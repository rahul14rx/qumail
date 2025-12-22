/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KM_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
