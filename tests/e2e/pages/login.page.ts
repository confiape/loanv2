import { type Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Login Page Object
 * Handles all interactions with the login page
 */
export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await super.goto('/login');
  }

  async fillEmail(email: string): Promise<void> {
    await this.page.getByTestId('login-email').fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.page.getByTestId('login-password').fill(password);
  }

  async submit(): Promise<void> {
    await this.page.getByTestId('login-submit').click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }

  async verifyPageLoaded(): Promise<void> {
    await expect(this.page.getByTestId('login-email')).toBeVisible();
    await expect(this.page.getByTestId('login-password')).toBeVisible();
    await expect(this.page.getByTestId('login-submit')).toBeVisible();
  }

  async verifyErrorDisplayed(expectedError?: string): Promise<void> {
    // Wait for error toast to appear
    const errorToasts = this.page.getByTestId('toast').filter({ has: this.page.locator('[data-toast-type="error"]') });

    // Verify at least one error toast is visible
    await expect(errorToasts.first()).toBeVisible({ timeout: 5000 });

    if (expectedError) {
      // Check if any visible toast contains the expected error message
      await expect(errorToasts.first()).toContainText(expectedError);
    }
  }

  async clickForgotPassword(): Promise<void> {
    await this.page.getByTestId('forgot-password-link').click();
  }

  async clickSignup(): Promise<void> {
    await this.page.getByTestId('signup-link').click();
  }
}
