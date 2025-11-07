import { FlattenedVulnerability } from '../types/vulnerability';

function escapeCsvValue(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) {
    return '';
  }
  const stringValue = String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

export function convertVulnerabilitiesToCSV(vulnerabilities: FlattenedVulnerability[]): string {
  const headers = [
    'CVE',
    'Severity',
    'CVSS',
    'kaiStatus',
    'Package Name',
    'Package Version',
    'Package Type',
    'Published',
    'Fix Date',
    'Status',
    'Owner',
    'Group',
    'Repository',
    'Image',
    'Description',
    'Risk Factors',
    'Link',
  ];

  const rows = vulnerabilities.map((vuln) => [
    vuln.cve,
    vuln.severity,
    vuln.cvss,
    vuln.kaiStatus || '',
    vuln.packageName,
    vuln.packageVersion,
    vuln.packageType,
    vuln.published,
    vuln.fixDate,
    vuln.status,
    vuln.owner,
    vuln.groupName,
    vuln.repoName,
    `${vuln.imageName}:${vuln.imageVersion}`,
    vuln.description?.replace(/\s+/g, ' ').trim(),
    Object.keys(vuln.riskFactors || {}).join('; '),
    vuln.link || '',
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(','))
    .join('\n');

  return csvContent;
}

export function downloadFile(filename: string, data: string, mimeType: string) {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export function exportVulnerabilitiesAsCSV(vulnerabilities: FlattenedVulnerability[]) {
  const csv = convertVulnerabilitiesToCSV(vulnerabilities);
  downloadFile(`vulnerabilities-${Date.now()}.csv`, csv, 'text/csv;charset=utf-8;');
}

export function exportVulnerabilitiesAsJSON(vulnerabilities: FlattenedVulnerability[]) {
  const json = JSON.stringify(vulnerabilities, null, 2);
  downloadFile(`vulnerabilities-${Date.now()}.json`, json, 'application/json;charset=utf-8;');
}
