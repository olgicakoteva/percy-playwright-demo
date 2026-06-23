import AxeBuilder from "@axe-core/playwright";
import { Page } from "@playwright/test";

export async function runAccessibilityCheck(page: Page) {
  return await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
}