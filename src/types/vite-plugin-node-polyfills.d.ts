// vite-plugin-node-polyfills.d.ts
declare module 'vite-plugin-node-polyfills' {
  import { Plugin } from 'vite';

  interface NodePolyfillsOptions {
    include?: string[];
    exclude?: string[];
    globals?: {
      Buffer?: boolean | 'dev' | 'build';
      global?: boolean | 'dev' | 'build';
      process?: boolean | 'dev' | 'build';
    };
    overrides?: Record<string, string>;
    protocolImports?: boolean;
  }

  export function nodePolyfills(options?: NodePolyfillsOptions): Plugin;
}
