export async function runLighthouseAudit(page: any) {
  const { playAudit } = await import("playwright-lighthouse");

  const result = await playAudit({
    page,
    port: 9222,

    // ✅ IMPORTANT: disable thresholds
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
      formats: {
        html: false,
      },
    },
  });

  return result.lhr;
}