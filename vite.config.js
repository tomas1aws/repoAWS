import { defineConfig } from 'vite';

const repoName = process.env.GITHUB_REPOSITORY?.split('/').pop() ?? 'repoAWS';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? `/${repoName}/` : '/',
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react'
  }
}));
