interface ImportMetaEnv {
  readonly VITE_RENDER_BACKEND_API_URL?: string;
  readonly VITE_NODE_BACKEND_API_URL?: string;
  readonly MODE?: string;
  readonly [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
