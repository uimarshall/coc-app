import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for end-to-end (E2E) tests.
 * E2E tests open a real browser and simulate real user interactions.
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Only look for test files in the tests/e2e directory
  testDir: "./tests/e2e",

  // Run tests in all files in parallel (faster in CI)
  fullyParallel: true,

  // Fail the build if you accidentally left test.only in a file
  forbidOnly: !!process.env.CI,

  // Retry failed tests once on CI (flaky tests can be caused by timing issues)
  retries: process.env.CI ? 1 : 0,

  // Use more workers in CI for faster runs
  workers: process.env.CI ? 2 : undefined,

  // Generate an HTML report you can open in a browser
  reporter: "html",

  use: {
    // The base URL of your running app — used for page.goto("/") etc.
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",

    // Save a trace (screenshots + network) on first retry so you can debug failures
    trace: "on-first-retry",

    // Take a screenshot on failure
    screenshot: "only-on-failure",
  },

  projects: [
    // Test in Chrome/Chromium
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // Test in Firefox
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
  ],

  // Automatically start the Next.js dev server before running E2E tests
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    // Re-use an already running server if one is available
    reuseExistingServer: !process.env.CI,
    timeout: 120_000, // Allow 2 minutes for the build to complete
    env: {
      // Pass a test database URL so E2E tests don't touch production data
      DATABASE_URL: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL || "",
    },
  },
});
