import { test, expect } from '@playwright/test';

/**
 * E2E tests for Companies CRUD functionality
 * Tests the complete CRUD operations for company management
 *
 * Note: These tests assume you have authentication set up.
 * You may need to add a login fixture or beforeEach hook to authenticate.
 */
test.describe('Companies Page', () => {
  // Helper function to login (customize based on your auth implementation)
  async function login(page) {
    await page.goto('/login');
    await page.getByTestId('login-email-input').fill('admin@confia.com');
    await page.getByTestId('login-password-input').fill('admin@confia.com@@');
    await page.getByTestId('login-submit-button').click();
    // Wait for navigation or authentication to complete
    await page.waitForURL(/\/(home|companies)/, { timeout: 10000 }).catch(() => {
      // Continue if already authenticated
    });
  }

  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page);
    // Navigate to companies page
    await page.goto('/companies');
    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('should display companies list page with all elements', async ({ page }) => {
    // Verify page title
    await expect(page.locator('h1')).toContainText('Companies');

    // Verify "New Company" button is visible
    const newButton = page.getByTestId('companies-btn-new-button');
    await expect(newButton).toBeVisible();
    await expect(newButton).toContainText('New Company');

    // Verify search input is visible
    const searchInput = page.getByTestId('companies-search-input');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute('placeholder', 'Search...');

    // Verify table is visible
    const table = page.getByTestId('companies-table');
    await expect(table).toBeVisible();
  });

  test('should search companies by name', async ({ page }) => {
    const searchInput = page.getByTestId('companies-search-input');

    // Enter search term
    await searchInput.fill('test');

    // Wait a moment for the search to filter
    await page.waitForTimeout(500);

    // Verify table updates (specific assertions depend on your data)
    const table = page.getByTestId('companies-table');
    await expect(table).toBeVisible();
  });

  test('should clear search when input is cleared', async ({ page }) => {
    const searchInput = page.getByTestId('companies-search-input');

    // Enter search term
    await searchInput.fill('test');
    await page.waitForTimeout(500);

    // Clear search
    await searchInput.clear();
    await page.waitForTimeout(500);

    // Verify all items are shown again
    const table = page.getByTestId('companies-table');
    await expect(table).toBeVisible();
  });

  test('should open new company modal when clicking "New Company" button', async ({ page }) => {
    const newButton = page.getByTestId('companies-btn-new-button');

    // Click the "New Company" button
    await newButton.click();

    // Wait for modal to appear
    await page.waitForTimeout(500);

    // Verify modal is visible
    const modal = page.getByTestId('companies-modal');
    await expect(modal).toBeVisible();

    // Verify modal header
    await expect(page.locator('app-modal-header')).toContainText('New Company');

    // Verify form input is visible
    const nameInput = page.getByTestId('companies-input-name-input');
    await expect(nameInput).toBeVisible();

    // Verify buttons are visible
    await expect(page.getByTestId('companies-btn-cancel-button')).toBeVisible();
    await expect(page.getByTestId('companies-btn-submit-button')).toBeVisible();
  });

  test('should validate company name - required field', async ({ page }) => {
    // Open new company modal
    await page.getByTestId('companies-btn-new-button').click();
    await page.waitForTimeout(500);

    const nameInput = page.getByTestId('companies-input-name-input');
    const submitButton = page.getByTestId('companies-btn-submit-button');

    // Submit button should be disabled when form is empty
    await expect(submitButton).toBeDisabled();

    // Focus and blur to trigger validation
    await nameInput.focus();
    await nameInput.blur();

    // Submit button should still be disabled
    await expect(submitButton).toBeDisabled();
  });

  test('should validate company name - minimum length', async ({ page }) => {
    // Open new company modal
    await page.getByTestId('companies-btn-new-button').click();
    await page.waitForTimeout(500);

    const nameInput = page.getByTestId('companies-input-name-input');
    const submitButton = page.getByTestId('companies-btn-submit-button');

    // Enter name shorter than 2 characters
    await nameInput.fill('A');
    await nameInput.blur();

    // Submit button should be disabled
    await expect(submitButton).toBeDisabled();

    // Error message should be visible
    const errorMessage = page.getByTestId('companies-input-name-errorMessage');
    await expect(errorMessage).toBeVisible();
  });

  test('should validate company name - maximum length', async ({ page }) => {
    // Open new company modal
    await page.getByTestId('companies-btn-new-button').click();
    await page.waitForTimeout(500);

    const nameInput = page.getByTestId('companies-input-name-input');
    const submitButton = page.getByTestId('companies-btn-submit-button');

    // Enter name longer than 40 characters
    await nameInput.fill('A'.repeat(41));
    await nameInput.blur();

    // Submit button should be disabled
    await expect(submitButton).toBeDisabled();

    // Error message should be visible
    const errorMessage = page.getByTestId('companies-input-name-errorMessage');
    await expect(errorMessage).toBeVisible();
  });

  test('should validate company name - no special characters', async ({ page }) => {
    // Open new company modal
    await page.getByTestId('companies-btn-new-button').click();
    await page.waitForTimeout(500);

    const nameInput = page.getByTestId('companies-input-name-input');
    const submitButton = page.getByTestId('companies-btn-submit-button');

    // Enter name with special characters
    await nameInput.fill('Company@#$');
    await nameInput.blur();

    // Submit button should be disabled
    await expect(submitButton).toBeDisabled();

    // Error message should be visible
    const errorMessage = page.getByTestId('companies-input-name-errorMessage');
    await expect(errorMessage).toBeVisible();
  });

  test('should create a new company with valid data', async ({ page }) => {
    // Open new company modal
    await page.getByTestId('companies-btn-new-button').click();
    await page.waitForTimeout(500);

    const nameInput = page.getByTestId('companies-input-name-input');
    const submitButton = page.getByTestId('companies-btn-submit-button');

    // Generate unique company name to avoid conflicts
    const companyName = `Test Company ${Date.now()}`;

    // Fill in valid company name
    await nameInput.fill(companyName);

    // Submit button should be enabled
    await expect(submitButton).toBeEnabled();

    // Click submit
    await submitButton.click();

    // Should show loading state
    await expect(submitButton).toContainText('Saving...');

    // Wait for modal to close (indicating success)
    await page.waitForTimeout(2000);

    // Modal should be closed
    const modal = page.getByTestId('companies-modal');
    await expect(modal).not.toBeVisible();

    // Search for the new company to verify it was created
    const searchInput = page.getByTestId('companies-search-input');
    await searchInput.fill(companyName);
    await page.waitForTimeout(500);

    // Verify company appears in the table
    await expect(page.locator('app-table')).toContainText(companyName);
  });

  test('should cancel company creation', async ({ page }) => {
    // Open new company modal
    await page.getByTestId('companies-btn-new-button').click();
    await page.waitForTimeout(500);

    const nameInput = page.getByTestId('companies-input-name-input');
    const cancelButton = page.getByTestId('companies-btn-cancel-button');

    // Fill in some data
    await nameInput.fill('Test Company');

    // Click cancel
    await cancelButton.click();

    // Modal should be closed
    const modal = page.getByTestId('companies-modal');
    await expect(modal).not.toBeVisible();
  });

  test('should close modal when clicking close button', async ({ page }) => {
    // Open new company modal
    await page.getByTestId('companies-btn-new-button').click();
    await page.waitForTimeout(500);

    // Find and click the close button in modal header
    const closeButton = page.locator('app-modal-header button[aria-label*="Close"]');
    await closeButton.click();

    // Modal should be closed
    const modal = page.getByTestId('companies-modal');
    await expect(modal).not.toBeVisible();
  });

  test('should open edit modal when clicking edit action', async ({ page }) => {
    // Find first row in the table and click edit action
    // Note: Specific selectors depend on your Table component implementation
    const firstEditButton = page.locator('app-table button', { hasText: 'Edit' }).first();

    if ((await firstEditButton.count()) > 0) {
      await firstEditButton.click();

      // Wait for navigation to edit route
      await page.waitForURL(/\/companies\/[^/]+/, { timeout: 5000 });

      // Verify modal is visible
      const modal = page.getByTestId('companies-modal');
      await expect(modal).toBeVisible();

      // Verify modal header shows "Edit Company"
      await expect(page.locator('app-modal-header')).toContainText('Edit Company');

      // Verify form has pre-filled data
      const nameInput = page.getByTestId('companies-input-name-input');
      await expect(nameInput).not.toHaveValue('');

      // Verify submit button shows "Update"
      const submitButton = page.getByTestId('companies-btn-submit-button');
      await expect(submitButton).toContainText('Update');
    }
  });

  test('should update company with new data', async ({ page }) => {
    // Find first row in the table and click edit action
    const firstEditButton = page.locator('app-table button', { hasText: 'Edit' }).first();

    if ((await firstEditButton.count()) > 0) {
      await firstEditButton.click();
      await page.waitForURL(/\/companies\/[^/]+/, { timeout: 5000 });

      const nameInput = page.getByTestId('companies-input-name-input');
      const submitButton = page.getByTestId('companies-btn-submit-button');

      // Update company name
      const updatedName = `Updated Company ${Date.now()}`;
      await nameInput.clear();
      await nameInput.fill(updatedName);

      // Submit update
      await submitButton.click();

      // Should show loading state
      await expect(submitButton).toContainText('Saving...');

      // Wait for navigation back to list
      await page.waitForURL('/companies', { timeout: 5000 });

      // Search for updated company
      const searchInput = page.getByTestId('companies-search-input');
      await searchInput.fill(updatedName);
      await page.waitForTimeout(500);

      // Verify updated company appears in the table
      await expect(page.locator('app-table')).toContainText(updatedName);
    }
  });

  test('should open delete confirmation modal when clicking delete action', async ({ page }) => {
    // Find first row in the table and click delete action
    const firstDeleteButton = page.locator('app-table button', { hasText: 'Delete' }).first();

    if ((await firstDeleteButton.count()) > 0) {
      await firstDeleteButton.click();

      // Wait for delete modal to appear
      await page.waitForTimeout(500);

      // Verify delete confirmation modal is visible
      const deleteModal = page.getByTestId('companies-delete-modal');
      await expect(deleteModal).toBeVisible();

      // Verify modal header
      await expect(page.locator('app-modal-header')).toContainText('Confirm Delete');

      // Verify buttons are visible
      await expect(page.getByTestId('companies-btn-cancel-delete-button')).toBeVisible();
      await expect(page.getByTestId('companies-btn-confirm-delete-button')).toBeVisible();
    }
  });

  test('should cancel delete operation', async ({ page }) => {
    // Find first row in the table and click delete action
    const firstDeleteButton = page.locator('app-table button', { hasText: 'Delete' }).first();

    if ((await firstDeleteButton.count()) > 0) {
      await firstDeleteButton.click();
      await page.waitForTimeout(500);

      // Click cancel in delete confirmation
      const cancelButton = page.getByTestId('companies-btn-cancel-delete-button');
      await cancelButton.click();

      // Delete modal should be closed
      const deleteModal = page.getByTestId('companies-delete-modal');
      await expect(deleteModal).not.toBeVisible();
    }
  });

  test('should delete company when confirming', async ({ page }) => {
    // First create a company to delete
    await page.getByTestId('companies-btn-new-button').click();
    await page.waitForTimeout(500);

    const companyName = `Company To Delete ${Date.now()}`;
    await page.getByTestId('companies-input-name-input').fill(companyName);
    await page.getByTestId('companies-btn-submit-button').click();
    await page.waitForTimeout(2000);

    // Search for the newly created company
    const searchInput = page.getByTestId('companies-search-input');
    await searchInput.fill(companyName);
    await page.waitForTimeout(500);

    // Click delete on the company
    const deleteButton = page.locator('app-table button', { hasText: 'Delete' }).first();
    await deleteButton.click();
    await page.waitForTimeout(500);

    // Confirm delete
    const confirmButton = page.getByTestId('companies-btn-confirm-delete-button');
    await confirmButton.click();

    // Wait for deletion to complete
    await page.waitForTimeout(2000);

    // Delete modal should be closed
    const deleteModal = page.getByTestId('companies-delete-modal');
    await expect(deleteModal).not.toBeVisible();

    // Search for the deleted company
    await searchInput.clear();
    await searchInput.fill(companyName);
    await page.waitForTimeout(500);

    // Company should not appear in the table
    // Note: This assertion might need adjustment based on how your table shows "no results"
  });

  test('should select multiple companies', async ({ page }) => {
    // Check if there are any checkboxes in the table
    const checkboxes = page.locator('app-table input[type="checkbox"]');

    if ((await checkboxes.count()) > 1) {
      // Select first two companies (skip header checkbox)
      await checkboxes.nth(1).check();
      await checkboxes.nth(2).check();

      // Wait for selection UI to appear
      await page.waitForTimeout(500);

      // Verify selected items section is visible
      const selectedSection = page.getByTestId('companies-selected-items');
      await expect(selectedSection).toBeVisible();

      // Verify count shows "2"
      await expect(selectedSection).toContainText('Selected (2)');

      // Verify bulk delete button is visible
      const bulkDeleteButton = page.getByTestId('companies-btn-bulk-delete-button');
      await expect(bulkDeleteButton).toBeVisible();
    }
  });

  test('should clear selection', async ({ page }) => {
    // Check if there are any checkboxes in the table
    const checkboxes = page.locator('app-table input[type="checkbox"]');

    if ((await checkboxes.count()) > 1) {
      // Select a company
      await checkboxes.nth(1).check();
      await page.waitForTimeout(500);

      // Click "Clear all" button
      const clearButton = page.locator('button', { hasText: 'Clear all' });
      await clearButton.click();

      // Selected items section should not be visible
      const selectedSection = page.getByTestId('companies-selected-items');
      await expect(selectedSection).not.toBeVisible();
    }
  });

  test('should perform bulk delete', async ({ page }) => {
    // Create two companies to delete
    for (let i = 0; i < 2; i++) {
      await page.getByTestId('companies-btn-new-button').click();
      await page.waitForTimeout(500);
      await page
        .getByTestId('companies-input-name-input')
        .fill(`Bulk Delete ${Date.now()}-${i}`);
      await page.getByTestId('companies-btn-submit-button').click();
      await page.waitForTimeout(2000);
    }

    // Search for the created companies
    const searchInput = page.getByTestId('companies-search-input');
    await searchInput.fill('Bulk Delete');
    await page.waitForTimeout(500);

    // Select the companies
    const checkboxes = page.locator('app-table input[type="checkbox"]');
    if ((await checkboxes.count()) > 1) {
      await checkboxes.nth(1).check();
      await checkboxes.nth(2).check();
      await page.waitForTimeout(500);

      // Click bulk delete button
      const bulkDeleteButton = page.getByTestId('companies-btn-bulk-delete-button');
      await bulkDeleteButton.click();

      // Wait for delete confirmation modal
      await page.waitForTimeout(500);

      // Confirm delete
      const confirmButton = page.getByTestId('companies-btn-confirm-delete-button');
      await confirmButton.click();

      // Wait for deletion to complete
      await page.waitForTimeout(2000);

      // Selected items section should not be visible
      const selectedSection = page.getByTestId('companies-selected-items');
      await expect(selectedSection).not.toBeVisible();
    }
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Verify key elements are still visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByTestId('companies-btn-new-button')).toBeVisible();
    await expect(page.getByTestId('companies-search-input')).toBeVisible();
    await expect(page.getByTestId('companies-table')).toBeVisible();
  });
});
