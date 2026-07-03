import { defineConfig, devices } from "@playwright/test";

// Dual-mode: against a Vercel preview when PLAYWRIGHT_BASE_URL is set (the real
// merge gate), otherwise a local dev server. Locally we run with no database so
// the UI journey works via the no-DB acknowledgement path; the @db specs
// (persistence, dedupe) are grep-inverted locally and only assert against the
// preview, which is wired to the real database.
const BASE = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: BASE || "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: BASE
    ? undefined
    : {
        command: process.env.E2E_WITH_DB ? "npm run dev" : "DATABASE_URL= npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
