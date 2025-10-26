import { defineConfig } from 'vite';

export default defineConfig({
  base: '/repoAWS/',
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
});
