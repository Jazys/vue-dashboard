/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_DOMAIN: string;
    readonly VITE_CLIENT_ID: string;
    readonly VITE_REDIRECT_URL: string;
    readonly VITE_ENABLE_AUTH0: string;
    readonly VITE_ENABLE_AUTH_KOBBLE: string;
 }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
 }