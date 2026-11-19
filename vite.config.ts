import { defineConfig } from 'vite';

// Demo site build: bundles the sample-room page (index.html) into dist/.
export default defineConfig({
  // The Arena live-preview proxy host (e.g. 4173-*.e2b.app) must be allowed.
  preview: {
    allowedHosts: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
    sourcemap: true,
  },
});
