import { test } from "@playwright/test";
import percySnapshot from "@percy/playwright";
import { PageNavigator } from "../pages/PageNavigator";
import { getEnv } from "../utils/env";

test("Navigate and snapshot all pages for selected environment", async ({ page }) => {
  const navigator = new PageNavigator(page);
  const env = getEnv();
  const pagesToVisit = navigator.list();

  for (const pageName of pagesToVisit) {
    await test.step(`Visit ${pageName} on ${env}`, async () => {
      await navigator.goTo(pageName);

      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(2000);

      const label = pageName.charAt(0).toUpperCase() + pageName.slice(1);
      await percySnapshot(page, `${label} Snapshot`, {
        widths: [1600, 768, 320]
      });
    });
  }
});