import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  resolve: {
    alias: {
      '@loan': resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    coverage: {
      enabled: true,
      provider: 'v8',
      all: true,
      reporter: ['text', 'lcov' , 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        '**/node_modules/**',
        'dist/',
        'src/app/shared/openapi/**',
        '**/*.spec.ts',
        '**/*.stories.ts',
        '**/*.stories.tsx',
        '.storybook/**',
        'src/test.ts',
        'src/stories/**',
        'vitest.config.ts',
        'eslint.config.js',
      ],
    },
  },
  define: {
    'import.meta.vitest': false,
  },
});
