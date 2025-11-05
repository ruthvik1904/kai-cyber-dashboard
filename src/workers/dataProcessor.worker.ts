/**
 * Web Worker for processing large JSON files in the background
 * This prevents blocking the main UI thread during parsing
 */

import { VulnerabilityData, FlattenedVulnerability } from '../types/vulnerability';
import { flattenVulnerabilities } from '../utils/dataTransform';

interface WorkerMessage {
  type: 'PARSE_JSON' | 'CANCEL';
  data?: string;
}

interface WorkerResponse {
  type: 'PROGRESS' | 'COMPLETE' | 'ERROR';
  progress?: number;
  total?: number;
  data?: FlattenedVulnerability[];
  error?: string;
}

// Handle messages from main thread
self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { type, data } = e.data;

  if (type === 'CANCEL') {
    // Cleanup if needed
    return;
  }

  if (type === 'PARSE_JSON' && data) {
    try {
      // Parse JSON
      const jsonData: VulnerabilityData = JSON.parse(data);

      // Flatten data using shared utility with progress updates
      const flattened = flattenVulnerabilities(jsonData, (progress, total) => {
        const response: WorkerResponse = {
          type: 'PROGRESS',
          progress,
          total,
        };
        self.postMessage(response);
      });

      // Send complete message with results
      const response: WorkerResponse = {
        type: 'COMPLETE',
        data: flattened,
        progress: flattened.length,
        total: flattened.length,
      };
      self.postMessage(response);
    } catch (error) {
      const response: WorkerResponse = {
        type: 'ERROR',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
      self.postMessage(response);
    }
  }
};

// Export empty object for TypeScript module system
export {};

