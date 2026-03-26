import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { configDefaults } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    exclude: [
      ...configDefaults.exclude,
      '**/node_modules/**',
    ],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'coverage/'],
    },
  },
})
