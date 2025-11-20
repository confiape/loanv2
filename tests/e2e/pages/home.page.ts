import { type Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Home Page Object
 * Handles interactions with the home page
 */
export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await super.goto('/home');
  }

  async verifyPageLoaded(): Promise<void> {
    await this.page.waitForURL(/\/(home)?/, { timeout: 10000 });
    // Wait for MainLayout to load (confirms userResolver completed)
    // This ensures the user session is fully established before navigating to other pages
    await expect(this.page.locator('app-navbar')).toBeVisible({ timeout: 10000 });
  }
}
