import { defineConfig } from 'vite';

const repoName = 'repoAWS';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? `/${repoName}/` : '/',
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react'
  }
}));
