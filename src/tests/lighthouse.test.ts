import { test, expect, chromium } from "@playwright/test";
import { PageNavigator } from "../pages/PageNavigator";
import { getEnv } from "../utils/env";
import { createHtmlReport } from "axe-html-reporter";
import fs from "fs";

test.describe("Lighthouse checks", () => {
  test("Scan all pages from JSON (single report)", async () => {

    const { playAudit } = await import("playwright-lighthouse");

    const browser = await chromium.launch({
      args: ["--remote-debugging-port=9222"],
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    const navigator = new PageNavigator(page);
    const env = getEnv();
    const pages = navigator.list();

    const allViolations: any[] = [];
    const failures: string[] = [];

    try {
      // ✅ Main test logic
      for (const pageName of pages) {
        await test.step(`Lighthouse: ${pageName} (${env})`, async () => {

          try {
            await navigator.goTo(pageName);
            await page.waitForLoadState("load");

            const result = await playAudit({
              page,
              port: 9222,
              thresholds: {
                performance: 0,
                accessibility: 0,
                "best-practices": 0,
                seo: 0,
              },
              opts: {
                onlyCategories: [
                  "performance",
                  "accessibility",
                  "best-practices",
                  "seo",
                ],
              },
              reports: {
                formats: { html: false },
              },
            });

            const lhr = result.lhr;

            const performanceScore =
              lhr.categories?.performance?.score ?? 0;

            const accessibilityScore =
              lhr.categories?.accessibility?.score ?? 0;

            if (performanceScore === 0 && accessibilityScore === 0) {
              console.warn(
                `⚠️ Possible page load issue on ${pageName}: ${page.url()}`
              );
            }

            // ✅ SAFE mapping
            const violations = Object.values(lhr.audits || {})
              .filter((audit: any) => audit?.score !== null && audit?.score < 0.9)
              .map((audit: any) => ({
                id: audit?.id || "unknown-id",
                impact:
                  audit?.score < 0.5
                    ? "critical"
                    : audit?.score < 0.7
                    ? "serious"
                    : "moderate",
                description:
                  audit?.description || "No description",
                help: audit?.title || audit?.id || "No help",
                helpUrl:
                  audit?.helpUrl ||
                  "https://developer.chrome.com/docs/lighthouse/",
                nodes: [
                  {
                    html: `<div>${audit?.id || "issue"}</div>`,
                    target: [audit?.id || "unknown"],
                  },
                ],
              }));

            allViolations.push({
              page: pageName,
              url: page.url(),
              violations,
            });

            // ✅ Soft assertions
            if (performanceScore < 0.5) {
              failures.push(
                `❌ ${pageName}: low performance (${performanceScore})`
              );
            }

            if (accessibilityScore < 0.2) {
              failures.push(
                `❌ ${pageName}: low accessibility (${accessibilityScore})`
              );
            }

            if (accessibilityScore < 0.7) {
              console.warn(
                `⚠️ Low accessibility score on ${pageName}: ${
                  accessibilityScore * 100
                }`
              );
            }

          } catch (err) {
            // ✅ CRITICAL: capture per-page failure but continue
            console.error(`❌ Error on page ${pageName}:`, err);

            failures.push(`❌ ${pageName}: execution failed`);

            // still push empty structure to keep report consistent
            allViolations.push({
              page: pageName,
              url: page.url(),
              violations: [],
            });
          }
        });
      }

    } finally {
      // ✅ ✅ ALWAYS EXECUTES (even on crash)

      try {
        fs.mkdirSync("reports/lighthouse", { recursive: true });

        const combinedResults = {
          violations: allViolations.flatMap((p) =>
            p.violations.map((v: any) => ({
              ...v,
              page: p.page,
              url: p.url,
            }))
          ),
        };

        createHtmlReport({
          results: combinedResults,
          options: {
            outputDir: "reports/lighthouse",
            reportFileName: "combined-lighthouse-report.html",
          },
        });

        console.log("✅ REPORT ALWAYS GENERATED ✅");

      } catch (err) {
        console.error("❌ Report generation failed:", err);
      }

      await browser.close();
    }

    // ✅ Final assertion AFTER report is guaranteed
    expect(
      failures,
      `Lighthouse issues found:\n${failures.join("\n")}`
    ).toHaveLength(0);
  });
});