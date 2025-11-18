import { type Page, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { testUsers, type TestUser } from '../fixtures/users';
import { clearSession } from '../helpers/base.helper';

/**
 * Reusable authentication actions
 * These are higher-level flows that combine multiple page interactions
 */

/**
 * Login as a specific user and verify success
 */
export async function loginAs(page: Page, user: TestUser): Promise<void> {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.goto();
  await loginPage.login(user.email, user.password);
  await dashboardPage.verifyPageLoaded();
}

/**
 * Quick login as admin user
 */
export async function loginAsAdmin(page: Page): Promise<void> {
  await loginAs(page, testUsers.admin);
}

/**
 * Quick login as regular user
 */
export async function loginAsUser(page: Page): Promise<void> {
  await loginAs(page, testUsers.regularUser);
}

/**
 * Quick login as analyst
 */
export async function loginAsAnalyst(page: Page): Promise<void> {
  await loginAs(page, testUsers.analyst);
}

/**
 * Logout from application
 */
export async function logout(page: Page): Promise<void> {
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.logout();

  // Verify we're back at login page
  const loginPage = new LoginPage(page);
  await expect(loginPage.emailInput).toBeVisible({ timeout: 5000 });
}

/**
 * Login and ensure clean session
 */
export async function loginWithCleanSession(page: Page, user: TestUser): Promise<void> {
  await clearSession(page);
  await loginAs(page, user);
}

/**
 * Attempt login with invalid credentials (for negative testing)
 */
export async function attemptLoginWithInvalidCredentials(
  page: Page,
  email: string,
  password: string,
): Promise<void> {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(email, password);

  // Verify error is displayed
  await loginPage.verifyErrorDisplayed();
}
