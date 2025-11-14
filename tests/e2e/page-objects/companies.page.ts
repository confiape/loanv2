import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { TestIds } from '../helpers/test-ids';
import { getByTestId } from '../helpers/test-ids';

/**
 * Companies Page Object
 * Handles all interactions with the companies list and CRUD operations
 */
export class CompaniesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to companies page
   */
  async navigate(): Promise<void> {
    await this.goto('/companies');
    await this.waitForTestId(TestIds.companies.table);
  }

  // ========== CREATE OPERATIONS ==========

  /**
   * Click "New Company" button
   */
  async clickNewCompany(): Promise<void> {
    await this.clickByTestId(TestIds.companies.btnNew);
    await this.waitForTestId(TestIds.companies.modal);
  }

  /**
   * Fill company form
   */
  async fillCompanyForm(data: { name: string }): Promise<void> {
    await this.fillByTestId(TestIds.companies.inputName, data.name);
  }

  /**
   * Submit company form (create or update)
   */
  async submitForm(): Promise<void> {
    await this.clickByTestId(TestIds.companies.btnSubmit);

    // Wait for modal to close
    await this.page.waitForSelector(getByTestId(TestIds.companies.modal), {
      state: 'hidden',
      timeout: 10000,
    });
  }

  /**
   * Cancel company form
   */
  async cancelForm(): Promise<void> {
    await this.clickByTestId(TestIds.companies.btnCancel);

    // Wait for modal to close
    await this.page.waitForSelector(getByTestId(TestIds.companies.modal), {
      state: 'hidden',
      timeout: 5000,
    });
  }

  /**
   * Create a new company (complete flow)
   */
  async createCompany(name: string): Promise<void> {
    await this.clickNewCompany();
    await this.fillCompanyForm({ name });
    await this.submitForm();
  }

  // ========== READ/SEARCH OPERATIONS ==========

  /**
   * Search for companies
   */
  async search(searchTerm: string): Promise<void> {
    await this.fillByTestId(TestIds.companies.searchInput, searchTerm);

    // Wait a bit for search to filter results
    await this.page.waitForTimeout(500);
  }

  /**
   * Clear search
   */
  async clearSearch(): Promise<void> {
    await this.fillByTestId(TestIds.companies.searchInput, '');
    await this.page.waitForTimeout(500);
  }

  /**
   * Get all visible table rows
   */
  getTableRows(): Locator {
    return this.page.locator(`${getByTestId(TestIds.companies.table)} tbody tr`);
  }

  /**
   * Get table row by index
   */
  getTableRow(index: number): Locator {
    return this.getTableRows().nth(index);
  }

  /**
   * Get number of visible rows in table
   */
  async getTableRowCount(): Promise<number> {
    const rows = this.getTableRows();
    const count = await rows.count();

    // Check if it's the "No data available" row
    if (count === 1) {
      const text = await rows.first().textContent();
      if (text?.includes('No data available')) {
        return 0;
      }
    }

    return count;
  }

  /**
   * Get company name from table row
   */
  async getCompanyNameFromRow(index: number): Promise<string> {
    const row = this.getTableRow(index);
    // First cell after checkbox is the name (th element)
    const nameCell = row.locator('th').first();
    return (await nameCell.textContent())?.trim() || '';
  }

  /**
   * Check if company exists in table by name
   */
  async companyExistsInTable(companyName: string): Promise<boolean> {
    const rowCount = await this.getTableRowCount();

    for (let i = 0; i < rowCount; i++) {
      const name = await this.getCompanyNameFromRow(i);
      if (name === companyName) {
        return true;
      }
    }

    return false;
  }

  /**
   * Find row index by company name
   */
  async findRowIndexByName(companyName: string): Promise<number> {
    const rowCount = await this.getTableRowCount();

    for (let i = 0; i < rowCount; i++) {
      const name = await this.getCompanyNameFromRow(i);
      if (name === companyName) {
        return i;
      }
    }

    return -1;
  }

  // ========== UPDATE OPERATIONS ==========

  /**
   * Click Edit button on a specific row
   */
  async clickEditOnRow(index: number): Promise<void> {
    const row = this.getTableRow(index);
    // Find the Edit button in the actions column
    const editBtn = row.locator('button:has-text("Edit")');
    await editBtn.click();

    // Wait for modal to open
    await this.waitForTestId(TestIds.companies.modal);
  }

  /**
   * Edit company by name (complete flow)
   */
  async editCompanyByName(currentName: string, newName: string): Promise<void> {
    const index = await this.findRowIndexByName(currentName);
    if (index === -1) {
      throw new Error(`Company with name "${currentName}" not found`);
    }

    await this.clickEditOnRow(index);
    await this.fillCompanyForm({ name: newName });
    await this.submitForm();
  }

  // ========== DELETE OPERATIONS ==========

  /**
   * Click Delete button on a specific row
   */
  async clickDeleteOnRow(index: number): Promise<void> {
    const row = this.getTableRow(index);
    const deleteBtn = row.locator('button:has-text("Delete")');
    await deleteBtn.click();

    // Wait for delete confirmation modal
    await this.waitForTestId(TestIds.companies.deleteModal);
  }

  /**
   * Confirm delete in confirmation modal
   */
  async confirmDelete(): Promise<void> {
    await this.clickByTestId(TestIds.companies.btnConfirmDelete);

    // Wait for modal to close
    await this.page.waitForSelector(getByTestId(TestIds.companies.deleteModal), {
      state: 'hidden',
      timeout: 10000,
    });
  }

  /**
   * Cancel delete in confirmation modal
   */
  async cancelDelete(): Promise<void> {
    await this.clickByTestId(TestIds.companies.btnCancelDelete);

    // Wait for modal to close
    await this.page.waitForSelector(getByTestId(TestIds.companies.deleteModal), {
      state: 'hidden',
      timeout: 5000,
    });
  }

  /**
   * Delete company by name (complete flow)
   */
  async deleteCompanyByName(companyName: string): Promise<void> {
    const index = await this.findRowIndexByName(companyName);
    if (index === -1) {
      throw new Error(`Company with name "${companyName}" not found`);
    }

    await this.clickDeleteOnRow(index);
    await this.confirmDelete();
  }

  // ========== BULK OPERATIONS ==========

  /**
   * Select/unselect row by index
   */
  async toggleRowSelection(index: number): Promise<void> {
    const row = this.getTableRow(index);
    const checkbox = row.locator('input[type="checkbox"]').first();
    await checkbox.click();
  }

  /**
   * Select all rows
   */
  async selectAllRows(): Promise<void> {
    const selectAllCheckbox = this.page.locator(getByTestId(TestIds.table.selectAll));
    await selectAllCheckbox.click();
  }

  /**
   * Get selected items section
   */
  getSelectedItemsSection(): Locator {
    return this.getByTestId(TestIds.companies.selectedItems);
  }

  /**
   * Check if selected items section is visible
   */
  async isSelectedItemsSectionVisible(): Promise<boolean> {
    return this.getSelectedItemsSection().isVisible();
  }

  /**
   * Click bulk delete button
   */
  async clickBulkDelete(): Promise<void> {
    await this.clickByTestId(TestIds.companies.btnBulkDelete);

    // Wait for delete confirmation modal
    await this.waitForTestId(TestIds.companies.deleteModal);
  }

  /**
   * Bulk delete selected companies (complete flow)
   */
  async bulkDeleteSelected(): Promise<void> {
    await this.clickBulkDelete();
    await this.confirmDelete();
  }

  /**
   * Select multiple companies by indices and bulk delete
   */
  async selectAndDeleteMultiple(indices: number[]): Promise<void> {
    // Select all specified rows
    for (const index of indices) {
      await this.toggleRowSelection(index);
    }

    // Wait for selected items section to appear
    await expect(this.getSelectedItemsSection()).toBeVisible();

    // Bulk delete
    await this.bulkDeleteSelected();
  }

  // ========== VALIDATION HELPERS ==========

  /**
   * Check if submit button is disabled
   */
  async isSubmitDisabled(): Promise<boolean> {
    const submitBtn = this.getByTestId(TestIds.companies.btnSubmit);
    return (await submitBtn.getAttribute('disabled')) !== null;
  }

  /**
   * Get validation error message for name field
   */
  async getNameFieldError(): Promise<string | null> {
    // Look for error message near the name input
    const input = this.getByTestId(TestIds.companies.inputName);
    const parent = input.locator('..');
    const errorElement = parent.locator('[class*="error"]');

    if (await errorElement.count() > 0) {
      return errorElement.textContent();
    }

    return null;
  }

  /**
   * Wait for table to load (spinner gone, data visible)
   */
  async waitForTableLoad(): Promise<void> {
    await this.waitForTestId(TestIds.companies.table);
    // Additional wait for any loading spinners to disappear
    await this.page.waitForTimeout(1000);
  }
}
