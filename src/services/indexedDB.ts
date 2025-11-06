/**
 * IndexedDB service using Dexie for caching vulnerability data
 */

import Dexie, { Table } from 'dexie';
import { FlattenedVulnerability, VulnerabilityMetadata } from '../types/vulnerability';
import { DATA_CONFIG } from '../config/dataConfig';

interface VulnerabilityRecord extends FlattenedVulnerability {
  id: string;
  cachedAt: number;
}

class VulnerabilityDatabase extends Dexie {
  vulnerabilities!: Table<VulnerabilityRecord, string>;
  metadata!: Table<VulnerabilityMetadata & { id: string; cachedAt: number }, string>;

  constructor() {
    super(DATA_CONFIG.DATABASE_NAME);
    
    this.version(DATA_CONFIG.DATABASE_VERSION).stores({
      vulnerabilities: 'id, cve, severity, kaiStatus, packageName, groupName, repoName, cachedAt',
      metadata: 'id, cachedAt',
    });
  }
}

const db = new VulnerabilityDatabase();

/**
 * Check if cache is still valid
 */
function isCacheValid(cachedAt: number): boolean {
  const expiryTime = DATA_CONFIG.CACHE_EXPIRY_HOURS * 60 * 60 * 1000;
  return Date.now() - cachedAt < expiryTime;
}

/**
 * Cache vulnerabilities in IndexedDB
 */
export async function cacheVulnerabilities(
  vulnerabilities: FlattenedVulnerability[],
  metadata: VulnerabilityMetadata
): Promise<void> {
  try {
    // Clear existing data
    await db.vulnerabilities.clear();
    await db.metadata.clear();

    const now = Date.now();
    
    // Batch insert vulnerabilities
    const BATCH_SIZE = DATA_CONFIG.BATCH_SIZE;
    for (let i = 0; i < vulnerabilities.length; i += BATCH_SIZE) {
      const batch = vulnerabilities.slice(i, i + BATCH_SIZE).map(vuln => ({
        ...vuln,
        cachedAt: now,
      }));
      
      await db.vulnerabilities.bulkPut(batch);
      
      // Yield to main thread to prevent blocking
      if (i % (BATCH_SIZE * 10) === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    // Cache metadata
    await db.metadata.put({
      id: 'main',
      ...metadata,
      cachedAt: now,
    });
  } catch (error) {
    console.error('Error caching vulnerabilities:', error);
    throw error;
  }
}

/**
 * Get all vulnerabilities from cache
 */
export async function getVulnerabilities(): Promise<FlattenedVulnerability[] | null> {
  try {
    const metadata = await db.metadata.get('main');
    
    if (!metadata || !isCacheValid(metadata.cachedAt)) {
      return null;
    }

    const records = await db.vulnerabilities.toArray();
    // Remove cachedAt field before returning
    return records.map(({ cachedAt, ...vuln }) => {
      const publishedTimestamp = new Date(vuln.published.replace(' ', 'T')).getTime();
      return {
        ...vuln,
        publishedTimestamp,
      };
    });
  } catch (error) {
    console.error('Error getting vulnerabilities from cache:', error);
    return null;
  }
}

/**
 * Get cached metadata
 */
export async function getMetadata(): Promise<VulnerabilityMetadata | null> {
  try {
    const metadata = await db.metadata.get('main');
    
    if (!metadata || !isCacheValid(metadata.cachedAt)) {
      return null;
    }

    const { id, cachedAt, ...metadataWithoutInternal } = metadata;
    return metadataWithoutInternal;
  } catch (error) {
    console.error('Error getting metadata from cache:', error);
    return null;
  }
}

/**
 * Query vulnerabilities by kaiStatus
 */
export async function queryByKaiStatus(
  kaiStatus: string,
  exclude: boolean = false
): Promise<FlattenedVulnerability[]> {
  try {
    let collection = db.vulnerabilities.where('kaiStatus').equals(kaiStatus);
    
    if (exclude) {
      // Get all, then filter out
      const all = await db.vulnerabilities.toArray();
      return all.filter(v => v.kaiStatus !== kaiStatus).map(({ cachedAt, ...v }) => v);
    }
    
    const records = await collection.toArray();
    return records.map(({ cachedAt, ...v }) => v);
  } catch (error) {
    console.error('Error querying by kaiStatus:', error);
    return [];
  }
}

/**
 * Query vulnerabilities by severity
 */
export async function queryBySeverity(
  severity: string
): Promise<FlattenedVulnerability[]> {
  try {
    const records = await db.vulnerabilities.where('severity').equals(severity).toArray();
    return records.map(({ cachedAt, ...v }) => v);
  } catch (error) {
    console.error('Error querying by severity:', error);
    return [];
  }
}

/**
 * Search vulnerabilities by CVE ID or package name
 */
export async function searchVulnerabilities(
  query: string
): Promise<FlattenedVulnerability[]> {
  try {
    const lowerQuery = query.toLowerCase();
    
    // Search in CVE IDs and package names
    const records = await db.vulnerabilities
      .filter(v => 
        v.cve.toLowerCase().includes(lowerQuery) ||
        v.packageName.toLowerCase().includes(lowerQuery)
      )
      .toArray();
    
    return records.map(({ cachedAt, ...v }) => v);
  } catch (error) {
    console.error('Error searching vulnerabilities:', error);
    return [];
  }
}

/**
 * Get count of vulnerabilities
 */
export async function getVulnerabilityCount(): Promise<number> {
  try {
    return await db.vulnerabilities.count();
  } catch (error) {
    console.error('Error getting vulnerability count:', error);
    return 0;
  }
}

/**
 * Clear all cached data
 */
export async function clearCache(): Promise<void> {
  try {
    await db.vulnerabilities.clear();
    await db.metadata.clear();
  } catch (error) {
    console.error('Error clearing cache:', error);
    throw error;
  }
}

/**
 * Check if cache exists and is valid
 */
export async function isCacheAvailable(): Promise<boolean> {
  try {
    const metadata = await db.metadata.get('main');
    return metadata !== undefined && isCacheValid(metadata.cachedAt);
  } catch (error) {
    return false;
  }
}

