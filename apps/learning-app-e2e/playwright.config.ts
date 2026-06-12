import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for learning-app E2E smoke tests.
 *
 * Runs against the Angular dev server (`nx serve learning-app`).
 * Start the dev server manually before running, or use the `webServer` block.
 */
export default defineConfig({
  testDir: './src',
  fullyParallel: false,
  retries: process.env['CI'] ? 2 : 0,
  workers: 1,
  reporter: [['html', { outputFolder: '../../dist/.playwright/learning-app-e2e' }]],
  use: {
    baseURL: process.env['BASE_URL'] ?? 'http://localhost:4200',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npx nx serve learning-app',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env['CI'],
    timeout: 120000,
  },
});
