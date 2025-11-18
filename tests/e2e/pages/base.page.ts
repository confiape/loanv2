import { type Page, type Locator } from '@playwright/test';
import { waitForAngularReady } from '../helpers/base.helper';

/**
 * Base Page Object
 * All page objects should extend this class
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /**
   * Navigate to a specific path
   */
  async goto(path: string = ''): Promise<void> {
    await this.page.goto(path);
    await waitForAngularReady(this.page);
  }

  /**
   * Get element by test ID
   */
  getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  /**
   * Get element by role
   */
  getByRole(role: Parameters<Page['getByRole']>[0], options?: Parameters<Page['getByRole']>[1]): Locator {
    return this.page.getByRole(role, options);
  }

  /**
   * Get element by text
   */
  getByText(text: string | RegExp): Locator {
    return this.page.getByText(text);
  }

  /**
   * Wait for URL to match
   */
  async waitForURL(url: string | RegExp): Promise<void> {
    await this.page.waitForURL(url);
    await waitForAngularReady(this.page);
  }

  /**
   * Get current URL
   */
  url(): string {
    return this.page.url();
  }
}
