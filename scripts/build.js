import { copyFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const copyDir = (src, dest) => {
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

const main = () => {
  const projectRoot = resolve(__dirname, '..');
  const webDir = join(projectRoot, 'web');
  const fivemWebDir = join(projectRoot, '[fivem]', 'web');

  if (existsSync(webDir)) {
    console.log('📁 Copying web folder to [fivem]/web...');
    copyDir(webDir, fivemWebDir);
    console.log('✅ Successfully copied web folder to [fivem]/web');
  } else {
    console.error('❌ web folder not found. Please run "pnpm build" first.');
    process.exit(1);
  }
};

main();