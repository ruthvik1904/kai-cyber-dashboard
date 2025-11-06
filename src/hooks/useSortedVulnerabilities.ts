/**
 * Hook for sorting vulnerabilities
 */

import { useState, useMemo, useCallback } from 'react';
import { FlattenedVulnerability } from '../types/vulnerability';
import { sortVulnerabilities } from '../utils/dataTransform';

export type SortField = 'cvss' | 'severity' | 'published' | 'cve';
export type SortOrder = 'asc' | 'desc';

export interface UseSortedVulnerabilitiesResult {
  sortedData: FlattenedVulnerability[];
  sortField: SortField;
  sortOrder: SortOrder;
  setSortField: (field: SortField) => void;
  setSortOrder: (order: SortOrder) => void;
  toggleSort: (field: SortField) => void;
}

/**
 * Hook for managing sorted vulnerabilities
 */
export function useSortedVulnerabilities(
  data: FlattenedVulnerability[]
): UseSortedVulnerabilitiesResult {
  const [sortField, setSortField] = useState<SortField>('cvss');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Memoize sorted data
  const sortedData = useMemo(() => {
    
    if (!data || data.length === 0) {
      return [];
    }
    return sortVulnerabilities(data, sortField, sortOrder);
  }, [data, sortField, sortOrder]);

  // Toggle sort order when clicking same field, or set new field
  const toggleSort = useCallback(
    (field: SortField) => {
      if (field === sortField) {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortField(field);
        setSortOrder('desc'); // Default to descending for new field
      }
    },
    [sortField]
  );

  return {
    sortedData,
    sortField,
    sortOrder,
    setSortField,
    setSortOrder,
    toggleSort,
  };
}

