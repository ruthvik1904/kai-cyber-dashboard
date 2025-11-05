/**
 * Data transformation utilities for processing vulnerability data
 */

import {
  VulnerabilityData,
  FlattenedVulnerability,
  VulnerabilityMetadata,
} from '../types/vulnerability';

/**
 * Flatten hierarchical vulnerability structure into array
 * Each vulnerability includes context from parent hierarchy
 * @param data - The vulnerability data structure
 * @param onProgress - Optional callback for progress updates (progress, total)
 */
export function flattenVulnerabilities(
  data: VulnerabilityData,
  onProgress?: (progress: number, total: number) => void
): FlattenedVulnerability[] {
  // Count total vulnerabilities first for progress tracking
  let totalCount = 0;
  if (onProgress) {
    for (const group of Object.values(data.groups)) {
      for (const repo of Object.values(group.repos)) {
        for (const image of Object.values(repo.images)) {
          totalCount += image.vulnerabilities.length;
        }
      }
    }
  }

  const flattened: FlattenedVulnerability[] = [];
  let processedCount = 0;

  for (const [groupKey, group] of Object.entries(data.groups)) {
    for (const [repoKey, repo] of Object.entries(group.repos)) {
      for (const [imageKey, image] of Object.entries(repo.images)) {
        for (const vulnerability of image.vulnerabilities) {
          // Create unique ID from hierarchy and CVE
          const id = `${groupKey}-${repoKey}-${imageKey}-${vulnerability.cve}`;
          
          flattened.push({
            ...vulnerability,
            groupName: group.name,
            repoName: repo.name,
            imageName: image.name,
            imageVersion: image.version,
            id,
          });

          processedCount++;

          // Report progress periodically if callback provided
          if (onProgress && processedCount % 5000 === 0) {
            onProgress(processedCount, totalCount);
          }
        }
      }
    }
  }

  // Final progress update
  if (onProgress) {
    onProgress(processedCount, totalCount);
  }

  return flattened;
}

/**
 * Extract metadata and statistics from vulnerability data
 */
export function extractMetadata(
  vulnerabilities: FlattenedVulnerability[]
): VulnerabilityMetadata {
  const severityDistribution = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  const kaiStatusDistribution: Record<string, number> = {};
  const uniqueGroups = new Set<string>();
  const uniqueRepos = new Set<string>();
  const uniqueImages = new Set<string>();

  for (const vuln of vulnerabilities) {
    // Count severity
    const severity = vuln.severity.toLowerCase();
    if (severity in severityDistribution) {
      severityDistribution[severity as keyof typeof severityDistribution]++;
    }

    // Count kaiStatus
    const kaiStatus = vuln.kaiStatus || 'unknown';
    kaiStatusDistribution[kaiStatus] = (kaiStatusDistribution[kaiStatus] || 0) + 1;

    // Track unique entities
    uniqueGroups.add(vuln.groupName);
    uniqueRepos.add(`${vuln.groupName}-${vuln.repoName}`);
    uniqueImages.add(`${vuln.groupName}-${vuln.repoName}-${vuln.imageName}`);
  }

  return {
    totalCount: vulnerabilities.length,
    severityDistribution,
    kaiStatusDistribution,
    totalGroups: uniqueGroups.size,
    totalRepos: uniqueRepos.size,
    totalImages: uniqueImages.size,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Filter vulnerabilities by kaiStatus
 * @param vulnerabilities - Array of vulnerabilities to filter
 * @param kaiStatus - Status to filter by
 * @param exclude - If true, exclude this status instead of including it
 */
export function filterByKaiStatus(
  vulnerabilities: FlattenedVulnerability[],
  kaiStatus: string,
  exclude: boolean = false
): FlattenedVulnerability[] {
  if (exclude) {
    return vulnerabilities.filter(v => v.kaiStatus !== kaiStatus);
  }
  return vulnerabilities.filter(v => v.kaiStatus === kaiStatus);
}

/**
 * Build indexes for fast filtering
 * Creates lookup maps for common filter operations
 */
export function buildIndexes(vulnerabilities: FlattenedVulnerability[]) {
  const byCveId = new Map<string, FlattenedVulnerability[]>();
  const byStatus = new Map<string, FlattenedVulnerability[]>();
  const bySeverity = new Map<string, FlattenedVulnerability[]>();
  const byPackageName = new Map<string, FlattenedVulnerability[]>();
  const byKaiStatus = new Map<string, FlattenedVulnerability[]>();

  for (const vuln of vulnerabilities) {
    // Index by CVE ID
    if (!byCveId.has(vuln.cve)) {
      byCveId.set(vuln.cve, []);
    }
    byCveId.get(vuln.cve)!.push(vuln);

    // Index by status
    if (!byStatus.has(vuln.status)) {
      byStatus.set(vuln.status, []);
    }
    byStatus.get(vuln.status)!.push(vuln);

    // Index by severity
    if (!bySeverity.has(vuln.severity)) {
      bySeverity.set(vuln.severity, []);
    }
    bySeverity.get(vuln.severity)!.push(vuln);

    // Index by package name
    if (!byPackageName.has(vuln.packageName)) {
      byPackageName.set(vuln.packageName, []);
    }
    byPackageName.get(vuln.packageName)!.push(vuln);

    // Index by kaiStatus
    const kaiStatus = vuln.kaiStatus || 'unknown';
    if (!byKaiStatus.has(kaiStatus)) {
      byKaiStatus.set(kaiStatus, []);
    }
    byKaiStatus.get(kaiStatus)!.push(vuln);
  }

  return {
    byCveId,
    byStatus,
    bySeverity,
    byPackageName,
    byKaiStatus,
  };
}

/**
 * Filter vulnerabilities by multiple criteria
 */
export function filterVulnerabilities(
  vulnerabilities: FlattenedVulnerability[],
  filters: {
    severity?: string[];
    kaiStatus?: string[];
    excludeKaiStatus?: string[];
    packageName?: string;
    searchQuery?: string;
  }
): FlattenedVulnerability[] {
  let filtered = [...vulnerabilities];

  // Filter by severity
  if (filters.severity && filters.severity.length > 0) {
    filtered = filtered.filter(v => filters.severity!.includes(v.severity));
  }

  // Filter by kaiStatus (include)
  if (filters.kaiStatus && filters.kaiStatus.length > 0) {
    filtered = filtered.filter(v => 
      filters.kaiStatus!.includes(v.kaiStatus || 'unknown')
    );
  }

  // Filter by kaiStatus (exclude)
  if (filters.excludeKaiStatus && filters.excludeKaiStatus.length > 0) {
    filtered = filtered.filter(v => 
      !filters.excludeKaiStatus!.includes(v.kaiStatus || 'unknown')
    );
  }

  // Filter by package name
  if (filters.packageName) {
    const lowerPackageName = filters.packageName.toLowerCase();
    filtered = filtered.filter(v =>
      v.packageName.toLowerCase().includes(lowerPackageName)
    );
  }

  // Search query (CVE, description, package name)
  if (filters.searchQuery) {
    const lowerQuery = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(v =>
      v.cve.toLowerCase().includes(lowerQuery) ||
      v.description.toLowerCase().includes(lowerQuery) ||
      v.packageName.toLowerCase().includes(lowerQuery)
    );
  }

  return filtered;
}

/**
 * Sort vulnerabilities by various criteria
 */
export function sortVulnerabilities(
  vulnerabilities: FlattenedVulnerability[],
  sortBy: 'cvss' | 'severity' | 'published' | 'cve',
  order: 'asc' | 'desc' = 'desc'
): FlattenedVulnerability[] {
  const sorted = [...vulnerabilities];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'cvss':
        comparison = a.cvss - b.cvss;
        break;
      case 'severity':
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        comparison =
          (severityOrder[a.severity] || 0) - (severityOrder[b.severity] || 0);
        break;
      case 'published':
        comparison = new Date(a.published).getTime() - new Date(b.published).getTime();
        break;
      case 'cve':
        comparison = a.cve.localeCompare(b.cve);
        break;
    }

    return order === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

