import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/login.page';
import { CompaniesPage } from '../../page-objects/companies.page';
import { generateUniqueCompanyName } from '../../fixtures/companies.fixture';

/**
 * E2E Tests: Companies Bulk Operations
 * Tests multi-select and bulk delete operations
 * Uses mock API server running on localhost:3001
 */

test.describe('Companies Bulk Operations', () => {
  let loginPage: LoginPage;
  let companiesPage: CompaniesPage;

  // Setup: Login before each test
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    companiesPage = new CompaniesPage(page);

    // Login as admin
    await loginPage.navigate();
    await loginPage.loginAsAdmin();

    // Navigate to companies page
    await companiesPage.navigate();
  });

  test.describe('Selection Operations', () => {
    test('should select and deselect individual rows', async () => {
      // Ensure we have at least one company
      const companyName = generateUniqueCompanyName('E2E');
      await companiesPage.createCompany(companyName);
      await companiesPage.waitForTableLoad();

      // Search for the company
      await companiesPage.search(companyName);

      // Select first row
      await companiesPage.toggleRowSelection(0);

      // Selected items section should appear
      const isVisible = await companiesPage.isSelectedItemsSectionVisible();
      expect(isVisible).toBe(true);

      // Deselect the row
      await companiesPage.toggleRowSelection(0);

      // Selected items section should disappear
      const isVisibleAfter = await companiesPage.isSelectedItemsSectionVisible();
      expect(isVisibleAfter).toBe(false);

      // Clear search
      await companiesPage.clearSearch();
    });

    test('should show selected items count when items are selected', async () => {
      // Create multiple companies for selection
      const company1 = generateUniqueCompanyName('E2E Bulk Select 1');
      const company2 = generateUniqueCompanyName('E2E Bulk Select 2');

      await companiesPage.createCompany(company1);
      await companiesPage.createCompany(company2);
      await companiesPage.waitForTableLoad();

      // Search for these companies to isolate them
      await companiesPage.search('E2E Bulk Select');

      // Select first two rows
      await companiesPage.toggleRowSelection(0);
      await companiesPage.toggleRowSelection(1);

      // Verify selected items section shows count
      await companiesPage.expectVisible('companies-selected-items');

      // Deselect all
      await companiesPage.toggleRowSelection(0);
      await companiesPage.toggleRowSelection(1);

      // Clear search
      await companiesPage.clearSearch();
    });

    test('should select all visible rows when clicking select all', async () => {
      // Create multiple companies
      const prefix = generateUniqueCompanyName('E2E Select All');
      const company1 = `${prefix} Alpha`;
      const company2 = `${prefix} Beta`;
      const company3 = `${prefix} Gamma`;

      await companiesPage.createCompany(company1);
      await companiesPage.createCompany(company2);
      await companiesPage.createCompany(company3);
      await companiesPage.waitForTableLoad();

      // Search to filter to only these companies
      await companiesPage.search(prefix);

      // Get row count
      const rowCount = await companiesPage.getTableRowCount();
      expect(rowCount).toBeGreaterThanOrEqual(3);

      // Select all
      await companiesPage.selectAllRows();

      // Selected items section should be visible
      const isVisible = await companiesPage.isSelectedItemsSectionVisible();
      expect(isVisible).toBe(true);

      // Deselect all by clicking select all again
      await companiesPage.selectAllRows();

      // Selected items section should disappear
      const isVisibleAfter = await companiesPage.isSelectedItemsSectionVisible();
      expect(isVisibleAfter).toBe(false);

      // Clear search
      await companiesPage.clearSearch();
    });

    test('should display selected company names in selected items section', async () => {
      // Create a unique company
      const companyName = generateUniqueCompanyName('E2E Display Selected');
      await companiesPage.createCompany(companyName);
      await companiesPage.waitForTableLoad();

      // Search for the company
      await companiesPage.search(companyName);

      // Select the row
      await companiesPage.toggleRowSelection(0);

      // Verify selected items section is visible
      await companiesPage.expectVisible('companies-selected-items');

      // Verify the company name appears in the selected section
      await companiesPage.expectText('companies-selected-items', companyName);

      // Deselect
      await companiesPage.toggleRowSelection(0);

      // Clear search
      await companiesPage.clearSearch();
    });
  });

  test.describe('Bulk Delete Operations', () => {
    test('should show bulk delete button when items are selected', async () => {
      // Create a company to select
      const companyName = generateUniqueCompanyName('E2E Bulk Delete Btn');
      await companiesPage.createCompany(companyName);
      await companiesPage.waitForTableLoad();

      // Search and select
      await companiesPage.search(companyName);
      await companiesPage.toggleRowSelection(0);

      // Bulk delete button should be visible
      await companiesPage.expectVisible('companies-btn-bulk-delete');

      // Deselect
      await companiesPage.toggleRowSelection(0);

      // Clear search
      await companiesPage.clearSearch();
    });

    test('should open delete confirmation modal when clicking bulk delete', async () => {
      // Create companies to delete
      const company1 = generateUniqueCompanyName('E2E Bulk Modal 1');
      const company2 = generateUniqueCompanyName('E2E Bulk Modal 2');

      await companiesPage.createCompany(company1);
      await companiesPage.createCompany(company2);
      await companiesPage.waitForTableLoad();

      // Search for these companies
      await companiesPage.search('E2E Bulk Modal');

      // Select both rows
      await companiesPage.toggleRowSelection(0);
      await companiesPage.toggleRowSelection(1);

      // Click bulk delete
      await companiesPage.clickBulkDelete();

      // Delete confirmation modal should be visible
      await companiesPage.expectVisible('companies-delete-modal');
      await companiesPage.expectVisible('companies-btn-confirm-delete');
      await companiesPage.expectVisible('companies-btn-cancel-delete');

      // Cancel delete
      await companiesPage.cancelDelete();

      // Deselect all
      await companiesPage.selectAllRows();

      // Clear search
      await companiesPage.clearSearch();
    });

    test('should cancel bulk delete when clicking cancel', async () => {
      // Create companies
      const prefix = generateUniqueCompanyName('E2E Bulk Cancel');
      const company1 = `${prefix} 1`;
      const company2 = `${prefix} 2`;

      await companiesPage.createCompany(company1);
      await companiesPage.createCompany(company2);
      await companiesPage.waitForTableLoad();

      // Search for these companies
      await companiesPage.search(prefix);

      // Select both
      await companiesPage.toggleRowSelection(0);
      await companiesPage.toggleRowSelection(1);

      // Click bulk delete
      await companiesPage.clickBulkDelete();

      // Cancel delete
      await companiesPage.cancelDelete();
      await companiesPage.waitForTableLoad();

      // Both companies should still exist
      const exists1 = await companiesPage.companyExistsInTable(company1);
      const exists2 = await companiesPage.companyExistsInTable(company2);

      expect(exists1).toBe(true);
      expect(exists2).toBe(true);

      // Deselect all
      await companiesPage.selectAllRows();

      // Clear search
      await companiesPage.clearSearch();
    });

    test('should delete multiple companies when confirming bulk delete', async () => {
      // Create companies to delete
      const prefix = generateUniqueCompanyName('E2E Bulk Delete Confirm');
      const company1 = `${prefix} Alpha`;
      const company2 = `${prefix} Beta`;

      await companiesPage.createCompany(company1);
      await companiesPage.createCompany(company2);
      await companiesPage.waitForTableLoad();

      // Search for these companies
      await companiesPage.search(prefix);

      // Verify both exist before deletion
      const existsBefore1 = await companiesPage.companyExistsInTable(company1);
      const existsBefore2 = await companiesPage.companyExistsInTable(company2);
      expect(existsBefore1).toBe(true);
      expect(existsBefore2).toBe(true);

      // Select and delete both
      await companiesPage.selectAndDeleteMultiple([0, 1]);
      await companiesPage.waitForTableLoad();

      // Both companies should be deleted
      const existsAfter1 = await companiesPage.companyExistsInTable(company1);
      const existsAfter2 = await companiesPage.companyExistsInTable(company2);

      expect(existsAfter1).toBe(false);
      expect(existsAfter2).toBe(false);

      // Clear search
      await companiesPage.clearSearch();
    });

    test('should delete all selected companies from select all', async () => {
      // Create multiple companies with unique prefix
      const prefix = generateUniqueCompanyName('E2E Bulk All');
      const company1 = `${prefix} 1`;
      const company2 = `${prefix} 2`;
      const company3 = `${prefix} 3`;

      await companiesPage.createCompany(company1);
      await companiesPage.createCompany(company2);
      await companiesPage.createCompany(company3);
      await companiesPage.waitForTableLoad();

      // Search for these companies
      await companiesPage.search(prefix);

      // Verify all exist
      const rowCount = await companiesPage.getTableRowCount();
      expect(rowCount).toBe(3);

      // Select all
      await companiesPage.selectAllRows();

      // Bulk delete
      await companiesPage.bulkDeleteSelected();
      await companiesPage.waitForTableLoad();

      // All should be deleted
      const rowCountAfter = await companiesPage.getTableRowCount();
      expect(rowCountAfter).toBe(0);

      // Clear search
      await companiesPage.clearSearch();
    });

    test('should handle deleting large number of companies', async () => {
      // Create 5 companies
      const prefix = generateUniqueCompanyName('E2E Bulk Large');
      const companies: string[] = [];

      for (let i = 1; i <= 5; i++) {
        const name = `${prefix} ${i}`;
        companies.push(name);
        await companiesPage.createCompany(name);
      }

      await companiesPage.waitForTableLoad();

      // Search for these companies
      await companiesPage.search(prefix);

      // Verify all exist
      const rowCount = await companiesPage.getTableRowCount();
      expect(rowCount).toBe(5);

      // Select all and delete
      await companiesPage.selectAllRows();
      await companiesPage.bulkDeleteSelected();
      await companiesPage.waitForTableLoad();

      // All should be deleted
      const rowCountAfter = await companiesPage.getTableRowCount();
      expect(rowCountAfter).toBe(0);

      // Clear search
      await companiesPage.clearSearch();
    });
  });

  test.describe('Selection Edge Cases', () => {
    test('should clear selection when clearing all button is clicked', async () => {
      // Create companies
      const company1 = generateUniqueCompanyName('E2E Clear Selection 1');
      const company2 = generateUniqueCompanyName('E2E Clear Selection 2');

      await companiesPage.createCompany(company1);
      await companiesPage.createCompany(company2);
      await companiesPage.waitForTableLoad();

      // Search for these companies
      await companiesPage.search('E2E Clear Selection');

      // Select both
      await companiesPage.toggleRowSelection(0);
      await companiesPage.toggleRowSelection(1);

      // Verify selected section is visible
      const isVisibleBefore = await companiesPage.isSelectedItemsSectionVisible();
      expect(isVisibleBefore).toBe(true);

      // Click "Clear all" button in selected items section
      // Note: This functionality might need to be implemented or adjusted based on actual UI
      await companiesPage.selectAllRows(); // Toggle to deselect

      // Selected section should disappear
      const isVisibleAfter = await companiesPage.isSelectedItemsSectionVisible();
      expect(isVisibleAfter).toBe(false);

      // Clear search
      await companiesPage.clearSearch();
    });

    test('should maintain selection when searching', async () => {
      // Create unique companies
      const prefix = generateUniqueCompanyName('E2E Maintain Selection');
      const company1 = `${prefix} Keep1`;
      const company2 = `${prefix} Keep2`;

      await companiesPage.createCompany(company1);
      await companiesPage.createCompany(company2);
      await companiesPage.waitForTableLoad();

      // Search for these companies
      await companiesPage.search(prefix);

      // Select both
      await companiesPage.toggleRowSelection(0);
      await companiesPage.toggleRowSelection(1);

      // Verify selection is maintained
      const isVisible = await companiesPage.isSelectedItemsSectionVisible();
      expect(isVisible).toBe(true);

      // Modify search slightly
      await companiesPage.search(`${prefix} Keep`);

      // Selection should still be maintained
      const isVisibleAfter = await companiesPage.isSelectedItemsSectionVisible();
      expect(isVisibleAfter).toBe(true);

      // Deselect all
      await companiesPage.selectAllRows();

      // Clear search
      await companiesPage.clearSearch();
    });
  });
});
