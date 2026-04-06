import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.{test,spec}.{ts,tsx}',
        'src/index.tsx',
        'src/main.tsx',
        'src/App.tsx',
      ],
    },
    deps: {
      inline: ['react', 'react-dom', 'react-router-dom'],
    },
  },
});