import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: { alias: { '@shared': fileURLToPath(new URL('../shared', import.meta.url)) } },
  build: { cssCodeSplit: false, rollupOptions: { output: { entryFileNames: 'app.js', assetFileNames: '[name][extname]', codeSplitting: false } } },
});
