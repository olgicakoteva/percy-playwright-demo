import pages from "../data/pages.json";
import { Page } from "@playwright/test";

export class PageFactory {
  static async open(page: Page, site: string) {
    const entry = (pages as any)[site];

    if (!entry) {
      throw new Error(`❌ Site "${site}" not found in pages.json`);
    }

    await page.goto(entry.url);
  }
}