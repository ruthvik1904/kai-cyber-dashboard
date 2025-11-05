/**
 * Hook for tracking data loading progress
 */

import { useState, useCallback } from 'react';
import { LoadProgress } from '../services/dataLoader';

export interface UseDataLoadingProgressResult {
  progress: LoadProgress | null;
  isActive: boolean;
  reset: () => void;
}

/**
 * Hook for tracking data loading progress
 * Useful for showing loading indicators during initial data fetch
 */
export function useDataLoadingProgress(): UseDataLoadingProgressResult {
  const [progress, setProgress] = useState<LoadProgress | null>(null);

  const updateProgress = useCallback((prog: LoadProgress) => {
    setProgress(prog);
  }, []);

  const reset = useCallback(() => {
    setProgress(null);
  }, []);

  // Expose updateProgress for use in dataLoader if needed
  // For now, progress is handled internally by the dataLoader service
  // This hook can be extended to listen to progress events if needed

  return {
    progress,
    isActive: progress !== null && progress.stage !== 'complete',
    reset,
  };
}

