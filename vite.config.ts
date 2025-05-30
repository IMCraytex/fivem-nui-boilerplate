import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, existsSync, readdirSync } from 'fs'
import { join } from 'path'
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

// Custom plugin to copy web folder to [fivem] directory after build
const copyToFiveM = (): Plugin => {
  const copyDir = (src: string, dest: string) => {
    if (!existsSync(dest)) {
      mkdirSync(dest, { recursive: true });
    }

    const entries = readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = join(src, entry.name);
      const destPath = join(dest, entry.name);

      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        copyFileSync(srcPath, destPath);
      }
    }
  };

  return {
    name: 'copy-to-fivem',
    writeBundle() {
      const webDir = resolve(__dirname, 'web');
      const fivemWebDir = resolve(__dirname, '[fivem]/web');

      if (existsSync(webDir)) {
        console.log('📁 Copying web folder to [fivem]/web...');
        copyDir(webDir, fivemWebDir);
        console.log('✅ Successfully copied web folder to [fivem]/web');
      } else {
        console.warn('⚠️  web folder not found, skipping copy to [fivem]');
      }
    }
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    filterAssets(),
    react(),
    copyToFiveM()
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