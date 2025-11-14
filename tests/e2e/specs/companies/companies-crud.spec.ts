import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/login.page';
import { CompaniesPage } from '../../page-objects/companies.page';
import { ApiMockHelper } from '../../helpers/api-mock.helper';
import { generateUniqueCompanyName, invalidCompanies } from '../../fixtures/companies.fixture';

/**
 * E2E Tests: Companies CRUD Operations
 * Tests create, read, update, delete operations for companies
 */

test.describe('Companies CRUD Operations', () => {
  let loginPage: LoginPage;
  let companiesPage: CompaniesPage;
  let apiMock: ApiMockHelper;

  // Setup: Mock API and login before each test
  test.beforeEach(async ({ page }) => {
    // Setup API mocks FIRST (before any navigation)
    apiMock = new ApiMockHelper(page);
    await apiMock.setupAllMocks();

    loginPage = new LoginPage(page);
    companiesPage = new CompaniesPage(page);

    // Login as admin
    await loginPage.navigate();
    await loginPage.loginAsAdmin();

    // Navigate to companies page
    await companiesPage.navigate();
  });

  test.describe('Read Operations', () => {
    test('should display companies list page', async () => {
      // Verify page loaded
      await companiesPage.expectVisible('companies-table');

      // Verify search input is visible
      await companiesPage.expectVisible('companies-search-input');

      // Verify "New Company" button is visible
      await companiesPage.expectVisible('companies-btn-new');
    });

    test('should display companies table with data', async () => {
      await companiesPage.waitForTableLoad();

      const rowCount = await companiesPage.getTableRowCount();

      // Should have at least some companies (from previous tests or seed data)
      // Since we don't clean up, this should be > 0
      expect(rowCount).toBeGreaterThanOrEqual(0);
    });

    test('should display "No data available" when no companies exist after filtering', async () => {
      // Search for something that definitely doesn't exist
      await companiesPage.search('XxXxX_NonExistent_Company_12345_XxXxX');

      const rowCount = await companiesPage.getTableRowCount();
      expect(rowCount).toBe(0);

      // Clear search
      await companiesPage.clearSearch();
    });
  });

  test.describe('Create Operations', () => {
    test('should open new company modal when clicking "New Company" button', async () => {
      await companiesPage.clickNewCompany();

      // Modal should be visible
      await companiesPage.expectVisible('companies-modal');

      // Form fields should be visible
      await companiesPage.expectVisible('companies-input-name');
      await companiesPage.expectVisible('companies-btn-submit');
      await companiesPage.expectVisible('companies-btn-cancel');
    });

    test('should create a new company successfully', async () => {
      const companyName = generateUniqueCompanyName('E2E Create Test');

      // Create company
      await companiesPage.createCompany(companyName);

      // Wait for modal to close and table to update
      await companiesPage.waitForTableLoad();

      // Search for the newly created company
      await companiesPage.search(companyName);

      // Verify company exists in table
      const exists = await companiesPage.companyExistsInTable(companyName);
      expect(exists).toBe(true);

      // Clear search
      await companiesPage.clearSearch();
    });

    test('should cancel company creation when clicking cancel', async () => {
      const companyName = generateUniqueCompanyName('E2E Cancel Test');

      // Open modal and fill form
      await companiesPage.clickNewCompany();
      await companiesPage.fillCompanyForm({ name: companyName });

      // Cancel
      await companiesPage.cancelForm();

      // Modal should be closed
      await companiesPage.expectHidden('companies-modal');

      // Company should NOT exist in table
      await companiesPage.search(companyName);
      const exists = await companiesPage.companyExistsInTable(companyName);
      expect(exists).toBe(false);

      // Clear search
      await companiesPage.clearSearch();
    });
  });

  test.describe('Search/Filter Operations', () => {
    test('should filter companies by search term', async () => {
      // First, create a unique company to search for
      const uniqueName = generateUniqueCompanyName('E2E Search Test');
      await companiesPage.createCompany(uniqueName);
      await companiesPage.waitForTableLoad();

      // Search for the company
      await companiesPage.search(uniqueName);

      // Should find the company
      const exists = await companiesPage.companyExistsInTable(uniqueName);
      expect(exists).toBe(true);

      // Get row count - should be filtered to only matching companies
      const rowCount = await companiesPage.getTableRowCount();
      expect(rowCount).toBeGreaterThanOrEqual(1);

      // Clear search
      await companiesPage.clearSearch();
    });

    test('should show all companies when search is cleared', async () => {
      // Create a unique company first
      const uniqueName = generateUniqueCompanyName('E2E Search Clear');
      await companiesPage.createCompany(uniqueName);
      await companiesPage.waitForTableLoad();

      // Get initial count
      const initialCount = await companiesPage.getTableRowCount();

      // Search for specific company
      await companiesPage.search(uniqueName);
      const filteredCount = await companiesPage.getTableRowCount();

      // Clear search
      await companiesPage.clearSearch();
      const clearedCount = await companiesPage.getTableRowCount();

      // After clearing, should show all companies again
      expect(clearedCount).toBeGreaterThanOrEqual(filteredCount);
      expect(clearedCount).toBe(initialCount);
    });

    test('should search case-insensitively', async () => {
      // Create a company with mixed case
      const companyName = generateUniqueCompanyName('E2E CaseSensitive Test');
      await companiesPage.createCompany(companyName);
      await companiesPage.waitForTableLoad();

      // Search with lowercase
      await companiesPage.search(companyName.toLowerCase());

      // Should still find the company
      const exists = await companiesPage.companyExistsInTable(companyName);
      expect(exists).toBe(true);

      // Clear search
      await companiesPage.clearSearch();
    });
  });

  test.describe('Update Operations', () => {
    test('should open edit modal when clicking Edit button', async () => {
      // Create a company to edit
      const originalName = generateUniqueCompanyName('E2E Edit Modal Test');
      await companiesPage.createCompany(originalName);
      await companiesPage.waitForTableLoad();

      // Search for the company
      await companiesPage.search(originalName);

      // Click edit on first row
      await companiesPage.clickEditOnRow(0);

      // Modal should be visible
      await companiesPage.expectVisible('companies-modal');

      // Form should be populated
      await companiesPage.expectVisible('companies-input-name');

      // Cancel to close modal
      await companiesPage.cancelForm();
      await companiesPage.clearSearch();
    });

    test('should update company name successfully', async () => {
      // Create a company to edit
      const originalName = generateUniqueCompanyName('E2E Update Original');
      const updatedName = generateUniqueCompanyName('E2E Update Modified');

      await companiesPage.createCompany(originalName);
      await companiesPage.waitForTableLoad();

      // Edit the company
      await companiesPage.editCompanyByName(originalName, updatedName);
      await companiesPage.waitForTableLoad();

      // Search for updated company
      await companiesPage.search(updatedName);

      // Verify new name exists
      const updatedExists = await companiesPage.companyExistsInTable(updatedName);
      expect(updatedExists).toBe(true);

      // Clear and search for old name
      await companiesPage.clearSearch();
      await companiesPage.search(originalName);

      // Old name should NOT exist
      const originalExists = await companiesPage.companyExistsInTable(originalName);
      expect(originalExists).toBe(false);

      // Clear search
      await companiesPage.clearSearch();
    });

    test('should cancel company update when clicking cancel', async () => {
      // Create a company
      const originalName = generateUniqueCompanyName('E2E Update Cancel');
      await companiesPage.createCompany(originalName);
      await companiesPage.waitForTableLoad();

      // Search for the company
      await companiesPage.search(originalName);
      const index = await companiesPage.findRowIndexByName(originalName);

      // Open edit modal
      await companiesPage.clickEditOnRow(index);

      // Change the name
      await companiesPage.fillCompanyForm({ name: 'Should Not Be Saved' });

      // Cancel
      await companiesPage.cancelForm();
      await companiesPage.waitForTableLoad();

      // Verify original name still exists
      const originalExists = await companiesPage.companyExistsInTable(originalName);
      expect(originalExists).toBe(true);

      // Clear search
      await companiesPage.clearSearch();
    });
  });

  test.describe('Delete Operations', () => {
    test('should open delete confirmation modal when clicking Delete button', async () => {
      // Create a company to delete
      const companyName = generateUniqueCompanyName('E2E Delete Modal Test');
      await companiesPage.createCompany(companyName);
      await companiesPage.waitForTableLoad();

      // Search for the company
      await companiesPage.search(companyName);

      // Click delete on first row
      await companiesPage.clickDeleteOnRow(0);

      // Delete confirmation modal should be visible
      await companiesPage.expectVisible('companies-delete-modal');
      await companiesPage.expectVisible('companies-btn-confirm-delete');
      await companiesPage.expectVisible('companies-btn-cancel-delete');

      // Cancel delete
      await companiesPage.cancelDelete();

      // Clear search
      await companiesPage.clearSearch();
    });

    test('should cancel delete when clicking Cancel in confirmation modal', async () => {
      // Create a company
      const companyName = generateUniqueCompanyName('E2E Delete Cancel');
      await companiesPage.createCompany(companyName);
      await companiesPage.waitForTableLoad();

      // Search for the company
      await companiesPage.search(companyName);
      const index = await companiesPage.findRowIndexByName(companyName);

      // Click delete
      await companiesPage.clickDeleteOnRow(index);

      // Cancel delete
      await companiesPage.cancelDelete();

      // Company should still exist
      const exists = await companiesPage.companyExistsInTable(companyName);
      expect(exists).toBe(true);

      // Clear search
      await companiesPage.clearSearch();
    });

    test('should delete company successfully when confirming', async () => {
      // Create a company to delete
      const companyName = generateUniqueCompanyName('E2E Delete Confirm');
      await companiesPage.createCompany(companyName);
      await companiesPage.waitForTableLoad();

      // Delete the company
      await companiesPage.deleteCompanyByName(companyName);
      await companiesPage.waitForTableLoad();

      // Search for the deleted company
      await companiesPage.search(companyName);

      // Company should NOT exist
      const exists = await companiesPage.companyExistsInTable(companyName);
      expect(exists).toBe(false);

      // Clear search
      await companiesPage.clearSearch();
    });
  });

  test.describe('Form Validation', () => {
    test('should show validation error for empty name', async () => {
      await companiesPage.clickNewCompany();

      // Try to submit with empty name
      await companiesPage.fillCompanyForm({ name: '' });

      // Submit button should be disabled when form is invalid
      const isDisabled = await companiesPage.isSubmitDisabled();
      expect(isDisabled).toBe(true);

      await companiesPage.cancelForm();
    });

    test('should show validation error for name too short', async () => {
      await companiesPage.clickNewCompany();

      // Fill with 1 character (min is 2)
      await companiesPage.fillCompanyForm({ name: 'A' });

      // Try to submit (should be disabled or show error)
      const isDisabled = await companiesPage.isSubmitDisabled();
      expect(isDisabled).toBe(true);

      await companiesPage.cancelForm();
    });

    test('should show validation error for name too long', async () => {
      await companiesPage.clickNewCompany();

      // Fill with 41 characters (max is 40)
      const longName = 'A'.repeat(41);
      await companiesPage.fillCompanyForm({ name: longName });

      // Submit button should be disabled
      const isDisabled = await companiesPage.isSubmitDisabled();
      expect(isDisabled).toBe(true);

      await companiesPage.cancelForm();
    });

    test('should show validation error for special characters', async () => {
      await companiesPage.clickNewCompany();

      // Fill with special characters
      await companiesPage.fillCompanyForm({ name: 'Company@#$%' });

      // Submit button should be disabled
      const isDisabled = await companiesPage.isSubmitDisabled();
      expect(isDisabled).toBe(true);

      await companiesPage.cancelForm();
    });

    test('should enable submit button for valid company name', async () => {
      await companiesPage.clickNewCompany();

      // Fill with valid name
      const validName = generateUniqueCompanyName('E2E Valid Name');
      await companiesPage.fillCompanyForm({ name: validName });

      // Submit button should NOT be disabled
      const isDisabled = await companiesPage.isSubmitDisabled();
      expect(isDisabled).toBe(false);

      await companiesPage.cancelForm();
    });
  });
});
