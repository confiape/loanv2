import { type Page, expect } from '@playwright/test';
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

  // Locators
  get emailInput() {
    return this.getByTestId(TestIds.auth.emailInput);
  }

  get passwordInput() {
    return this.getByTestId(TestIds.auth.passwordInput);
  }

  get submitButton() {
    return this.getByTestId(TestIds.auth.submitButton);
  }

  get errorMessage() {
    return this.getByTestId(TestIds.auth.errorMessage);
  }

  get forgotPasswordLink() {
    return this.getByTestId(TestIds.auth.forgotPasswordLink);
  }

  get signupLink() {
    return this.getByTestId(TestIds.auth.signupLink);
  }

  /**
   * Navigate to login page
   */
  async goto(): Promise<void> {
    await super.goto('/login');
  }

  /**
   * Perform login with credentials
   */
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  /**
   * Fill email field
   */
  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  /**
   * Fill password field
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Click submit button
   */
  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Verify login page is displayed
   */
  async verifyPageLoaded(): Promise<void> {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  /**
   * Verify error message is displayed
   */
  async verifyErrorDisplayed(expectedError?: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    if (expectedError) {
      await expect(this.errorMessage).toContainText(expectedError);
    }
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }

  /**
   * Click signup link
   */
  async clickSignup(): Promise<void> {
    await this.signupLink.click();
  }
}
