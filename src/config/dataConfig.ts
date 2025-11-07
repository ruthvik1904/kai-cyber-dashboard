/**
 * Configuration constants for data loading and processing
 */
const jsonUrl = import.meta.env.VITE_VULN_DATA_URL || '/ui_demo.json';
console.log(import.meta.env.VITE_VULN_DATA_URL);

export const DATA_CONFIG = {
  // JSON file path (relative to public directory)
  JSON_FILE_PATH: jsonUrl,
  
  // IndexedDB configuration
  DATABASE_NAME: 'VulnerabilityDB',
  DATABASE_VERSION: 1,
  
  // Processing configuration
  CHUNK_SIZE: 1000, // Number of vulnerabilities to process per chunk
  BATCH_SIZE: 100, // Number of items to batch for IndexedDB operations
  
  // Cache configuration
  CACHE_EXPIRY_HOURS: 24, // Cache expires after 24 hours
  
  // Web Worker configuration
  WORKER_CHUNK_SIZE: 5000, // Process this many vulnerabilities before yielding to main thread
} as const;

