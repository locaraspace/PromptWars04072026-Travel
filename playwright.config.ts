import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright e2e config. Point it at a running app via `PLAYWRIGHT_BASE_URL`
 * (defaults to the local dev server). Browsers must be installed once with
 * `npx playwright install`. See docs/TESTING.md for the full run instructions.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
