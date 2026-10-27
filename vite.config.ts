import { defineConfig } from 'vite'

// Relative base: works under /career/v1/dist/ on GitHub Pages
export default defineConfig({ base: './', build: { outDir: 'dist', emptyOutDir: true } })
