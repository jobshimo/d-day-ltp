import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths({ root: '../../../' })],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../coverage/libs/infrastructure/audio-adapter',
      provider: 'v8',
      all: true,
      include: ['src/lib/**/*.ts'],
      exclude: ['src/lib/**/*.spec.ts'],
    },
  },
});
