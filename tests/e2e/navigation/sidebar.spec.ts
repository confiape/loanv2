import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../actions/auth.actions';

test.describe('Sidebar Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await loginAsAdmin(page);
  });

  test('should navigate to companies from sidebar', async ({ page }) => {
    // Act
    await page.getByRole('link', { name: 'Companies' }).click();

    // Assert
    await expect(page).toHaveURL(/\/companies/);
    await expect(page.getByTestId('companies-table')).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to roles from sidebar', async ({ page }) => {
    // Act
    await page.getByRole('link', { name: 'Roles' }).click();

    // Assert
    await expect(page).toHaveURL(/\/roles/);
    await expect(page.getByTestId('roles-table')).toBeVisible({ timeout: 10000 });
  });

  test('should navigate between companies and roles', async ({ page }) => {
    // Act - Navigate to companies
    await page.getByRole('link', { name: 'Companies' }).click();
    await expect(page).toHaveURL(/\/companies/);
    await expect(page.getByTestId('companies-table')).toBeVisible({ timeout: 10000 });

    // Act - Navigate to roles
    await page.getByRole('link', { name: 'Roles' }).click();
    await expect(page).toHaveURL(/\/roles/);
    await expect(page.getByTestId('roles-table')).toBeVisible({ timeout: 10000 });

    // Act - Navigate back to companies
    await page.getByRole('link', { name: 'Companies' }).click();
    await expect(page).toHaveURL(/\/companies/);
    await expect(page.getByTestId('companies-table')).toBeVisible({ timeout: 10000 });
  });

  test('should highlight active navigation item', async ({ page }) => {
    // Act
    await page.getByRole('link', { name: 'Companies' }).click();
    await expect(page).toHaveURL(/\/companies/);

    // Assert - Active link should have router-link-active class
    const activeLink = page.getByRole('link', { name: 'Companies' });
    await expect(activeLink).toHaveClass(/router-link-active/);
  });
});

test.describe('User Menu and Logout', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await loginAsAdmin(page);
  });

  test('should open user menu when clicking user button', async ({ page }) => {
    // Act - Click user menu button (look for button with user icon or avatar)
    await page.getByRole('button', { name: /user menu|account/i }).click();

    // Assert - User menu should be visible
    await expect(page.getByText(/sign out/i)).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Arrange - Verify we're logged in
    await expect(page.locator('app-navbar')).toBeVisible();

    // Act - Open user menu
    await page.getByRole('button', { name: /user menu|account/i }).click();

    // Act - Click Sign Out
    await page.getByRole('button', { name: /sign out/i }).click();

    // Assert - Should redirect to login page
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByTestId('login-email')).toBeVisible({ timeout: 10000 });
  });

  test('should not access protected pages after logout', async ({ page }) => {
    // Arrange - Logout first
    await page.getByRole('button', { name: /user menu|account/i }).click();
    await page.getByRole('button', { name: /sign out/i }).click();
    await expect(page).toHaveURL(/\/login/);

    // Act - Try to navigate to companies directly
    await page.goto('/companies');

    // Assert - Should be redirected to login
    await expect(page).toHaveURL(/\/login/);
  });
});
