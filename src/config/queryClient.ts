/**
 * React Query client configuration
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Create and configure React Query client
 * - 24-hour staleTime matches IndexedDB cache expiry
 * - Infinite cacheTime since IndexedDB handles persistence
 * - Minimal retries since data is local
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 24 * 60 * 60 * 1000, // 24 hours
      gcTime: Infinity, // Keep in memory indefinitely (IndexedDB handles persistence)
      retry: 1, // Minimal retries for local data
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnMount: false, // Don't refetch on mount if data exists
    },
    mutations: {
      retry: 1,
    },
  },
});

