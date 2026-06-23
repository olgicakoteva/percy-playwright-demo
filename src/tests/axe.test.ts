import { test, expect } from "@playwright/test";
import { PageNavigator } from "../pages/PageNavigator";
import { runAccessibilityCheck } from "../utils/accessibility";
import { createHtmlReport } from "axe-html-reporter";
import { getEnv } from "../utils/env";

test.describe("Accessibility checks with Axe", () => {
  test("Scan all pages from JSON (single report)", async ({ page }) => {
    const navigator = new PageNavigator(page);
    const env = getEnv();

    const pages = navigator.list();

    // ✅ Collect all results across pages
    const allViolations: any[] = [];

    for (const pageName of pages) {
      await test.step(`A11y check: ${pageName} (${env})`, async () => {

        // ✅ Navigate
        await navigator.goTo(pageName);
        await page.waitForLoadState("domcontentloaded");
        await page.waitForTimeout(2000);

        // ✅ Run Axe
        const results = await runAccessibilityCheck(page);

        // ✅ Aggregate results (IMPORTANT)
        allViolations.push({
          page: pageName,
          url: page.url(),
          violations: results.violations,
        });

        // ✅ Filter serious issues for assertion
        const seriousIssues = results.violations.filter(
          (v) => v.impact === "critical" || v.impact === "serious"
        );

        if (seriousIssues.length > 0) {
          console.log(`❌ Accessibility issues found on ${pageName}`);
          console.log(JSON.stringify(seriousIssues, null, 2));
        }

        // ✅ Assertion threshold (customizable)
        expect(seriousIssues.length).toBeLessThanOrEqual(9);
      });
    }

    // ✅ ✅ CREATE ONE COMBINED REPORT
    const combinedResults = {
      violations: allViolations.flatMap((p) =>
        p.violations.map((v: any) => ({
          ...v,
          page: p.page, // 👈 custom field for traceability
          url: p.url,
        }))
      ),
    };

    createHtmlReport({
      results: combinedResults,
      options: {
        outputDir: "reports/axe",
        reportFileName: "combined-axe-report.html",
      },
    });

    console.log("✅ Combined Axe report generated: reports/axe/combined-axe-report.html");
  });
});