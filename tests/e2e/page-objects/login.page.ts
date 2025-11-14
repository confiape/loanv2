import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { TestIds } from '../helpers/test-ids';

/**
 * Login Page Object
 * Handles all interactions with the login page
 */
export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to login page
   */
  async navigate(): Promise<void> {
    await this.goto('/login');
    await this.waitForTestId(TestIds.login.emailInput);
  }

  /**
   * Fill email input
   */
  async fillEmail(email: string): Promise<void> {
    await this.fillByTestId(TestIds.login.emailInput, email);
  }

  /**
   * Fill password input
   */
  async fillPassword(password: string): Promise<void> {
    await this.fillByTestId(TestIds.login.passwordInput, password);
  }

  /**
   * Click login button
   */
  async clickLogin(): Promise<void> {
    await this.clickByTestId(TestIds.login.submitBtn);
  }

  /**
   * Perform complete login flow
   */
  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();

    // Wait for redirect away from login page
    await this.waitForURL((url) => !url.pathname.includes('/login'));
  }

  /**
   * Login with admin credentials from env
   */
  async loginAsAdmin(): Promise<void> {
    const email = process.env.TEST_ADMIN_EMAIL || 'admin@confia.com';
    const password = process.env.TEST_ADMIN_PASSWORD || 'admin@confia.com@@';
    await this.login(email, password);
  }

  /**
   * Check if error message is displayed
   */
  async hasErrorMessage(): Promise<boolean> {
    return this.existsByTestId(TestIds.login.errorMessage);
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return this.getTextByTestId(TestIds.login.errorMessage);
  }
}
