/**
 * Utility functions for preparing chart data from vulnerability data
 */

import { FlattenedVulnerability } from '../types/vulnerability';
import { format, parseISO, startOfMonth, startOfWeek } from 'date-fns';

export interface SeverityChartData {
  name: string;
  value: number;
  color: string;
}

export interface RiskFactorChartData {
  name: string;
  count: number;
}

export interface TrendChartData {
  date: string;
  count: number;
  critical?: number;
  high?: number;
  medium?: number;
  low?: number;
}

export interface KaiStatusChartData {
  name: string;
  value: number;
  color: string;
}

/**
 * Prepare severity distribution data for pie chart
 */
export function prepareSeverityData(
  vulnerabilities: FlattenedVulnerability[]
): SeverityChartData[] {
  const counts: Record<string, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  vulnerabilities.forEach((v) => {
    const severity = v.severity.toLowerCase();
    if (severity in counts) {
      counts[severity as keyof typeof counts]++;
    }
  });

  const colors: Record<string, string> = {
    critical: '#DC2626', // red-600
    high: '#EA580C', // orange-600
    medium: '#D97706', // amber-600
    low: '#16A34A', // green-600
  };

  return Object.entries(counts)
    .filter(([_, count]) => count > 0)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: colors[name] || '#6B7280',
    }));
}

/**
 * Prepare risk factors data for bar chart
 * Extracts and counts all risk factors from vulnerabilities
 */
export function prepareRiskFactorsData(
  vulnerabilities: FlattenedVulnerability[],
  topN: number = 15
): RiskFactorChartData[] {
  const factorCounts: Record<string, number> = {};

  vulnerabilities.forEach((v) => {
    Object.keys(v.riskFactors).forEach((factor) => {
      factorCounts[factor] = (factorCounts[factor] || 0) + 1;
    });
  });

  return Object.entries(factorCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}

/**
 * Prepare trend data grouped by date
 * Groups vulnerabilities by published date (monthly)
 */
export function prepareTrendData(
  vulnerabilities: FlattenedVulnerability[],
  groupBy: 'month' | 'week' = 'month'
): TrendChartData[] {
  const dateGroups: Record<string, {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  }> = {};

  vulnerabilities.forEach((v) => {
    try {
      const date = parseISO(v.published);
      const groupKey = groupBy === 'month'
        ? format(startOfMonth(date), 'yyyy-MM')
        : format(startOfWeek(date), 'yyyy-MM-dd');

      if (!dateGroups[groupKey]) {
        dateGroups[groupKey] = {
          total: 0,
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
        };
      }

      dateGroups[groupKey].total++;
      const severity = v.severity.toLowerCase();
      if (severity in dateGroups[groupKey]) {
        dateGroups[groupKey][severity as keyof typeof dateGroups[string]]++;
      }
    } catch (error) {
      // Skip invalid dates
    }
  });

  return Object.entries(dateGroups)
    .map(([date, counts]) => ({
      date,
      count: counts.total,
      critical: counts.critical,
      high: counts.high,
      medium: counts.medium,
      low: counts.low,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Prepare kaiStatus distribution data for donut chart
 */
export function prepareKaiStatusData(
  vulnerabilities: FlattenedVulnerability[]
): KaiStatusChartData[] {
  const counts: Record<string, number> = {};

  vulnerabilities.forEach((v) => {
    const status = v.kaiStatus || 'unknown';
    counts[status] = (counts[status] || 0) + 1;
  });

  // Color mapping for common statuses
  const colorMap: Record<string, string> = {
    'invalid - norisk': '#EF4444', // red-500
    'ai-invalid-norisk': '#8B5CF6', // violet-500
    unknown: '#6B7280', // gray-500
  };

  const defaultColors = [
    '#3B82F6', // blue-500
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#EC4899', // pink-500
    '#6366F1', // indigo-500
  ];

  let colorIndex = 0;

  return Object.entries(counts)
    .map(([name, value]) => ({
      name,
      value,
      color: colorMap[name] || defaultColors[colorIndex++ % defaultColors.length],
    }))
    .sort((a, b) => b.value - a.value);
}

