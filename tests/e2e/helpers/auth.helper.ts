import { Page } from '@playwright/test';
import { getByTestId, TestIds } from './test-ids';

/**
 * Authentication helper for E2E tests
 * Handles login/logout operations
 */
export class AuthHelper {
  constructor(private page: Page) {}

  /**
   * Perform login with provided credentials
   */
  async login(email: string, password: string): Promise<void> {
    // Navigate to login page
    await this.page.goto('/login');

    // Wait for login form to be visible
    await this.page.waitForSelector(getByTestId(TestIds.login.emailInput), {
      state: 'visible',
    });

    // Fill credentials
    await this.page.fill(getByTestId(TestIds.login.emailInput), email);
    await this.page.fill(getByTestId(TestIds.login.passwordInput), password);

    // Submit form
    await this.page.click(getByTestId(TestIds.login.submitBtn));

    // Wait for navigation to complete (redirected away from /login)
    await this.page.waitForURL((url) => !url.pathname.includes('/login'), {
      timeout: 10000,
    });
  }

  /**
   * Login with admin credentials from environment variables
   */
  async loginAsAdmin(): Promise<void> {
    const email = process.env.TEST_ADMIN_EMAIL || 'admin@confia.com';
    const password = process.env.TEST_ADMIN_PASSWORD || 'admin@confia.com@@';

    await this.login(email, password);
  }

  /**
   * Check if user is authenticated (not on login page)
   */
  async isAuthenticated(): Promise<boolean> {
    const url = this.page.url();
    return !url.includes('/login');
  }

  /**
   * Logout (if logout functionality exists)
   * For now, just clear storage and navigate to login
   */
  async logout(): Promise<void> {
    await this.page.context().clearCookies();
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await this.page.goto('/login');
  }
}

/**
 * Setup authentication state that can be reused across tests
 * This creates a storage state file that can be loaded to skip login
 */
export async function setupAuthState(page: Page, storageStatePath: string): Promise<void> {
  const auth = new AuthHelper(page);
  await auth.loginAsAdmin();

  // Save storage state
  await page.context().storageState({ path: storageStatePath });
}
