import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import type { Plugin } from 'vite'

// Custom plugin to filter out assets during build
const filterAssets = (): Plugin => {
  return {
    name: 'filter-assets',
    enforce: 'pre',
    resolveId(id) {
      // Block the react.svg file from src/assets
      if (id.includes('src/assets/react.svg')) {
        return { id: 'virtual:empty-module', external: false };
      }
      // Block the vite.svg file from public
      if (id.includes('public/vite.svg')) {
        return { id: 'virtual:empty-module', external: false };
      }
      return null;
    },
    load(id) {
      if (id === 'virtual:empty-module') {
        return 'export default "";';
      }
      return null;
    }
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    filterAssets(),
    react()
  ],
  base: './', // Ensures relative paths
  build: {
    outDir: 'web', // Output to web directory for FiveM
    emptyOutDir: true,
    minify: true,
    sourcemap: false, // Set to true for debugging, false for production
  },
  css: {
    postcss: './postcss.config.cjs',
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})