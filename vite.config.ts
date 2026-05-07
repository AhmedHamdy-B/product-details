import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('react') || id.includes('scheduler')) return 'vendor-react'
          if (id.includes('@tanstack/react-query')) return 'vendor-query'
          if (id.includes('zustand')) return 'vendor-state'
          if (
            id.includes('@headlessui/react') ||
            id.includes('lucide-react') ||
            id.includes('class-variance-authority')
          ) {
            return 'vendor-ui'
          }
          if (id.includes('i18next') || id.includes('react-i18next')) return 'vendor-i18n'
          return 'vendor'
        },
      },
    },
  },
})
