import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    pool: 'threads',
    maxWorkers: 1,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        'prisma/**',
        'prisma.config.ts',
        'vitest.config.ts',
        'tests/**',
        'eslint.config.mjs'
      ]
    },
  },
});
