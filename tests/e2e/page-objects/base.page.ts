import { Page, Locator, expect } from '@playwright/test';
import { getByTestId } from '../helpers/test-ids';

/**
 * Base Page Object
 * Provides common functionality for all page objects
 */
export abstract class BasePage {
  constructor(protected page: Page) {}

  /**
   * Navigate to a specific path
   */
  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Get element by test ID
   */
  getByTestId(testId: string): Locator {
    return this.page.locator(getByTestId(testId));
  }

  /**
   * Wait for element by test ID to be visible
   */
  async waitForTestId(testId: string, timeout = 10000): Promise<void> {
    await this.getByTestId(testId).waitFor({ state: 'visible', timeout });
  }

  /**
   * Click element by test ID
   */
  async clickByTestId(testId: string): Promise<void> {
    await this.getByTestId(testId).click();
  }

  /**
   * Fill input by test ID
   */
  async fillByTestId(testId: string, value: string): Promise<void> {
    await this.getByTestId(testId).fill(value);
  }

  /**
   * Get text content by test ID
   */
  async getTextByTestId(testId: string): Promise<string> {
    return (await this.getByTestId(testId).textContent()) || '';
  }

  /**
   * Check if element exists by test ID
   */
  async existsByTestId(testId: string): Promise<boolean> {
    return (await this.getByTestId(testId).count()) > 0;
  }

  /**
   * Wait for URL to match pattern
   */
  async waitForURL(
    urlPattern: string | RegExp | ((url: URL) => boolean),
    timeout = 10000,
  ): Promise<void> {
    await this.page.waitForURL(urlPattern, { timeout });
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Take a screenshot
   */
  async screenshot(path: string): Promise<void> {
    await this.page.screenshot({ path, fullPage: true });
  }

  /**
   * Wait for element to be hidden
   */
  async waitForHidden(selector: string, timeout = 10000): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'hidden', timeout });
  }

  /**
   * Get current URL
   */
  getCurrentURL(): string {
    return this.page.url();
  }

  /**
   * Reload page
   */
  async reload(): Promise<void> {
    await this.page.reload();
  }

  /**
   * Wait for specific time (use sparingly, prefer waitFor methods)
   */
  async wait(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  /**
   * Expect element to be visible
   */
  async expectVisible(testId: string): Promise<void> {
    await expect(this.getByTestId(testId)).toBeVisible();
  }

  /**
   * Expect element to be hidden
   */
  async expectHidden(testId: string): Promise<void> {
    await expect(this.getByTestId(testId)).toBeHidden();
  }

  /**
   * Expect element to have text
   */
  async expectText(testId: string, text: string | RegExp): Promise<void> {
    await expect(this.getByTestId(testId)).toContainText(text);
  }
}
