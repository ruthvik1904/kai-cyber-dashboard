/**
 * Main data loading service
 * Handles fetching, parsing, and caching vulnerability data
 */

import { VulnerabilityData, FlattenedVulnerability, VulnerabilityMetadata } from '../types/vulnerability';
import { DATA_CONFIG } from '../config/dataConfig';
import {
  getVulnerabilities,
  getMetadata,
  cacheVulnerabilities,
  isCacheAvailable,
} from './indexedDB';
import { flattenVulnerabilities, extractMetadata } from '../utils/dataTransform';

export interface LoadProgress {
  stage: 'fetching' | 'parsing' | 'caching' | 'complete';
  progress: number;
  total: number;
  message: string;
}

export type ProgressCallback = (progress: LoadProgress) => void;

/**
 * Create Web Worker for background processing
 * Vite handles workers via ?worker suffix or direct import
 */
function createWorker(): Worker | null {
  try {
    // Try to use the worker file directly
    // Vite will handle the worker compilation
    return new Worker(
      new URL('../workers/dataProcessor.worker.ts', import.meta.url),
      { type: 'module' }
    );
  } catch (error) {
    console.warn('Web Worker not available, falling back to main thread:', error);
    return null;
  }
}

/**
 * Parse JSON using Web Worker if available, otherwise use main thread
 */
async function parseJSONWithWorker(
  jsonText: string,
  onProgress?: ProgressCallback
): Promise<FlattenedVulnerability[]> {
  const worker = createWorker();
  
  if (!worker) {
    // Fallback to main thread parsing
    return parseJSONMainThread(jsonText, onProgress);
  }

  return new Promise((resolve, reject) => {
    worker.onmessage = (e) => {
      const { type, progress, total, data, error } = e.data;
      
      if (type === 'PROGRESS' && onProgress) {
        onProgress({
          stage: 'parsing',
          progress: progress || 0,
          total: total || 0,
          message: `Parsing vulnerabilities: ${progress}/${total}`,
        });
      }
      
      if (type === 'COMPLETE') {
        worker.terminate();
        resolve(data || []);
      }
      
      if (type === 'ERROR') {
        worker.terminate();
        reject(new Error(error || 'Worker parsing failed'));
      }
    };

    worker.onerror = (error) => {
      worker.terminate();
      reject(error);
    };

    worker.postMessage({ type: 'PARSE_JSON', data: jsonText });
  });
}

/**
 * Parse JSON in main thread (fallback)
 */
function parseJSONMainThread(
  jsonText: string,
  onProgress?: ProgressCallback
): FlattenedVulnerability[] {
  if (onProgress) {
    onProgress({
      stage: 'parsing',
      progress: 0,
      total: 100,
      message: 'Parsing JSON in main thread...',
    });
  }

  const jsonData: VulnerabilityData = JSON.parse(jsonText);
  const flattened = flattenVulnerabilities(jsonData);

  if (onProgress) {
    onProgress({
      stage: 'parsing',
      progress: flattened.length,
      total: flattened.length,
      message: 'Parsing complete',
    });
  }

  return flattened;
}

/**
 * Fetch JSON file from server
 */
async function fetchJSONFile(
  onProgress?: ProgressCallback
): Promise<string> {
  if (onProgress) {
    onProgress({
      stage: 'fetching',
      progress: 0,
      total: 100,
      message: 'Fetching vulnerability data...',
    });
  }

  try {
    const response = await fetch(DATA_CONFIG.JSON_FILE_PATH);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    // Get content length for progress tracking
    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;

    // Read response as text with progress tracking
    const reader = response.body?.getReader();
    if (!reader) {
      // Fallback to simple fetch
      const text = await response.text();
      if (onProgress) {
        onProgress({
          stage: 'fetching',
          progress: 100,
          total: 100,
          message: 'Fetch complete',
        });
      }
      return text;
    }

    const decoder = new TextDecoder();
    let text = '';
    let received = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      received += value.length;
      text += decoder.decode(value, { stream: true });

      if (onProgress && total > 0) {
        const progress = Math.min(100, Math.round((received / total) * 100));
        onProgress({
          stage: 'fetching',
          progress,
          total: 100,
          message: `Fetching: ${Math.round(received / 1024 / 1024)}MB`,
        });
      }
    }

    if (onProgress) {
      onProgress({
        stage: 'fetching',
        progress: 100,
        total: 100,
        message: 'Fetch complete',
      });
    }

    return text;
  } catch (error) {
    throw new Error(`Failed to fetch JSON file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Main function to load vulnerability data
 * Checks cache first, then fetches and parses if needed
 */
export async function loadVulnerabilityData(
  onProgress?: ProgressCallback
): Promise<{
  vulnerabilities: FlattenedVulnerability[];
  metadata: VulnerabilityMetadata;
}> {
  // Check cache first
  const cached = await getVulnerabilities();
  const cachedMetadata = await getMetadata();

  if (cached && cachedMetadata) {
    if (onProgress) {
      onProgress({
        stage: 'complete',
        progress: cached.length,
        total: cached.length,
        message: `Loaded ${cached.length} vulnerabilities from cache`,
      });
    }
    return {
      vulnerabilities: cached,
      metadata: cachedMetadata,
    };
  }

  // Fetch and parse
  try {
    // Fetch JSON
    const jsonText = await fetchJSONFile(onProgress);

    // Parse JSON
    const vulnerabilities = await parseJSONWithWorker(jsonText, onProgress);

    // Extract metadata
    if (onProgress) {
      onProgress({
        stage: 'caching',
        progress: 0,
        total: 100,
        message: 'Extracting metadata...',
      });
    }
    const metadata = extractMetadata(vulnerabilities);

    // Cache data
    if (onProgress) {
      onProgress({
        stage: 'caching',
        progress: 50,
        total: 100,
        message: 'Caching data...',
      });
    }
    await cacheVulnerabilities(vulnerabilities, metadata);

    if (onProgress) {
      onProgress({
        stage: 'complete',
        progress: vulnerabilities.length,
        total: vulnerabilities.length,
        message: `Loaded ${vulnerabilities.length} vulnerabilities`,
      });
    }

    return {
      vulnerabilities,
      metadata,
    };
  } catch (error) {
    throw new Error(
      `Failed to load vulnerability data: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Check if cached data is available
 */
export async function checkCacheAvailability(): Promise<boolean> {
  return await isCacheAvailable();
}

/**
 * Force reload data (skip cache)
 */
export async function reloadVulnerabilityData(
  onProgress?: ProgressCallback
): Promise<{
  vulnerabilities: FlattenedVulnerability[];
  metadata: VulnerabilityMetadata;
}> {
  // Clear cache first
  const { clearCache } = await import('./indexedDB');
  await clearCache();

  // Load fresh data
  return loadVulnerabilityData(onProgress);
}

