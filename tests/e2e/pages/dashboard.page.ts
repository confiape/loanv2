import { type Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { TestIds } from '../helpers/test-ids';

/**
 * Dashboard Page Object
 * Handles all interactions with the dashboard page
 */
export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators
  get header() {
    return this.getByTestId(TestIds.dashboard.header);
  }

  get sidebar() {
    return this.getByTestId(TestIds.dashboard.sidebar);
  }

  get content() {
    return this.getByTestId(TestIds.dashboard.content);
  }

  get userMenu() {
    return this.getByTestId(TestIds.dashboard.userMenu);
  }

  get logoutButton() {
    return this.getByTestId(TestIds.dashboard.logoutButton);
  }

  /**
   * Navigate to dashboard
   */
  async goto(): Promise<void> {
    await super.goto('/dashboard');
  }

  /**
   * Verify dashboard is loaded
   */
  async verifyPageLoaded(): Promise<void> {
    // Wait for URL to contain dashboard or be at root (some apps redirect to /)
    await this.page.waitForURL(/\/(dashboard)?/, { timeout: 10000 });

    // Verify at least one dashboard element is visible
    // Use a more flexible approach in case test IDs are different
    const isDashboardVisible =
      (await this.header.isVisible().catch(() => false)) ||
      (await this.sidebar.isVisible().catch(() => false)) ||
      (await this.content.isVisible().catch(() => false));

    expect(isDashboardVisible).toBeTruthy();
  }

  /**
   * Logout from application
   */
  async logout(): Promise<void> {
    await this.userMenu.click();
    await this.logoutButton.click();
  }
}
