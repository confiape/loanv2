import { defineConfig } from 'vitest/config';

import angular from '@analogjs/vite-plugin-angular';
export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
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
