/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VULN_DATA_URL?: string;
  // add other VITE_ prefixed env vars here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


