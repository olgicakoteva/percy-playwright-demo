import urls from "../data/pages.json";
import { getEnv, Environment } from "../utils/env";
import { Page } from "@playwright/test";

type Pages = Record<string, string>;
type UrlsShape = Record<Environment, Pages>;

export class PageNavigator {
  private page: Page;
  private pages: Pages;

  constructor(page: Page) {
    this.page = page;
    const env = getEnv();
    const all = urls as UrlsShape;
    this.pages = all[env];
  }

  list(): string[] {
    return Object.keys(this.pages);
  }

  async goTo(pageName: string) {
    const url = this.pages[pageName];
    if (!url) throw new Error(`Page "${pageName}" does not exist in env config.`);
    await this.page.goto(url);
  }
}

