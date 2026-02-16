import { defineConfig } from "@playwright/test";

export default defineConfig({
  // Point Playwright to your tests folder under src
  testDir: "src/tests",
  timeout: 120000, 

  // Optional: be explicit about file pattern (defaults already include *.test.ts)
  testMatch: ["**/*.test.ts"],

  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
});
