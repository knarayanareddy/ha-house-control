import { defineConfig } from 'vite';

// Lovelace card build: single-file ES module at dist/house-control-card.js,
// as referenced by hacs.json ("filename": "house-control-card.js").
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false, // keep the demo site built by vite.config.ts
    target: 'es2022',
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'house-control-card.js',
    },
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
  },
});
