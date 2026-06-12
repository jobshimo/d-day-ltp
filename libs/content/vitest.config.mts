import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths({ root: '../../' })],
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/libs/content',
      provider: 'v8',
      all: true,
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts'],
    },
  },
});
