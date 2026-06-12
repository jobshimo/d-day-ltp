import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'libs/**/vitest.config.ts',
  'libs/**/vitest.config.mts',
  'apps/**/vitest.config.ts',
  'apps/**/vitest.config.mts',
]);
