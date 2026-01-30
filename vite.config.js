import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Disable code splitting for Streamlit compatibility
    // Streamlit loads the app via srcdoc which doesn't support ES module imports well
    rollupOptions: {
      output: {
        // Single bundle - no code splitting
        manualChunks: undefined,
        // Ensure single entry point
        inlineDynamicImports: true,
      },
    },
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 1000,
    // Use esbuild for minification
    minify: 'esbuild',
    // Target modern browsers
    target: 'es2020',
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
  },
  // Server configuration for development
  server: {
    port: 5173,
    strictPort: false,
    // Proxy API requests to FastAPI backend
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
