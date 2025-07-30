import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set base path for GitHub Pages deployment
  // When deploying to https://astrogirlnim.github.io/ROImance/
  base: process.env.NODE_ENV === 'production' ? '/ROImance/' : '/',
  build: {
    // Ensure clean build output
    outDir: 'dist',
    emptyOutDir: true,
    // Generate source maps for debugging
    sourcemap: true,
  },
  // Configure dev server
  server: {
    port: 5173,
    host: true,
  },
})
