import { defineConfig, devices } from '@playwright/test'

/** See https://playwright.dev/docs/test-configuration */
export default defineConfig({
  testDir: './e2e',
  timeout: 90_000,
  expect: { timeout: 18_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter:
    process.env.CI ?
      [['github'], ['html', { open: 'never', outputFolder: 'playwright-report' }]]
    : [['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    /** Dedicated dev port avoids clashing with a human `npm run dev` on :5173. */
    baseURL: 'http://localhost:5199',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: process.env.CI ? 'retain-on-failure' : 'off',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev -- --host localhost --strictPort --port 5199',
    url: 'http://localhost:5199',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
