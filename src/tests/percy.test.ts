import { test, expect } from "@playwright/test";
import percySnapshot from "@percy/playwright";
import { PageNavigator } from "../pages/PageNavigator";
import { getEnv } from "../utils/env";




test("Navigate, snapshot and validate accessibility", async ({ page }) => {
  const navigator = new PageNavigator(page);
  const env = getEnv();
  const pagesToVisit = navigator.list();

  const viewports = [
    { width: 1600, height: 900 },
    { width: 768, height: 1024 },
    { width: 320, height: 568 },
  ];

  for (const pageName of pagesToVisit) {
    await test.step(`Visit ${pageName} on ${env}`, async () => {
      for (const vp of viewports) {
        await test.step(`${pageName} @ ${vp.width}px`, async () => {
          // ✅ Set viewport BEFORE navigation
          await page.setViewportSize(vp);

          await navigator.goTo(pageName);

          await page.waitForLoadState("domcontentloaded");
          await page.waitForTimeout(2000);

          const label = pageName.charAt(0).toUpperCase() + pageName.slice(1);

          // ✅ Percy per viewport
          await percySnapshot(page, `${label} ${vp.width}px`, {
            widths: [vp.width],
          });

        });
      }
    });
  }
});
