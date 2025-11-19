import { type Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { debugToasts } from '../helpers/base.helper';

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
    // Strategy: Wait for ANY toast with error type to appear in DOM
    // The toast container has pointer-events-none, so we need to wait for DOM presence

    try {
      // First, wait for at least one error toast to be attached to DOM
      await this.page.waitForSelector('[data-testid="toast"][data-toast-type="error"]', {
        state: 'attached',
        timeout: 10000,
      });

      // Now get all error toasts
      const errorToast = this.page.locator('[data-testid="toast"][data-toast-type="error"]').first();

      // Verify it's actually visible (not just in DOM)
      await expect(errorToast).toBeVisible({ timeout: 5000 });

      if (expectedError) {
        // Check if the toast contains the expected error message
        await expect(errorToast).toContainText(expectedError);
      }
    } catch (error) {
      // Debug: Show what toasts are actually in the page
      console.log('\n❌ Failed to find error toast. Debugging...');
      await debugToasts(this.page);
      throw error;
    }
  }

  async clickForgotPassword(): Promise<void> {
    await this.page.getByTestId('forgot-password-link').click();
  }

  async clickSignup(): Promise<void> {
    await this.page.getByTestId('signup-link').click();
  }
}
