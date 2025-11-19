import { type Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Companies Page Object
 * Handles all interactions with the companies CRUD page
 */
export class CompaniesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await super.goto('/companies');
  }

  async verifyPageLoaded(): Promise<void> {
    // goto() already waits for navigation and Angular ready
    // Just verify the table is visible
    await expect(this.page.getByTestId('companies-table')).toBeVisible({ timeout: 10000 });
  }

  async clickNew(): Promise<void> {
    await this.page.getByTestId('companies-btn-new').click();
  }

  async search(term: string): Promise<void> {
    await this.page.getByTestId('companies-search-input').fill(term);
  }

  async clearSearch(): Promise<void> {
    await this.page.getByTestId('companies-search-input').fill('');
  }

  async verifyModalOpen(expectedTitle: string): Promise<void> {
    const modal = this.page.getByTestId('companies-modal');
    await expect(modal).toBeVisible();
    await expect(modal.getByText(expectedTitle)).toBeVisible();
  }

  async verifyModalClosed(): Promise<void> {
    const modal = this.page.getByTestId('companies-modal');
    await expect(modal).not.toBeVisible();
  }

  async fillCompanyName(name: string): Promise<void> {
    // The form uses generic-crud-form which renders based on formFields
    // Field key is 'name', so we look for input with that key
    await this.page.locator('input[name="name"]').fill(name);
  }

  async submitForm(): Promise<void> {
    // Generic form has a submit button, typically the primary button in modal footer
    await this.page.getByTestId('companies-modal').getByRole('button', { name: /save|submit/i }).click();
  }

  async cancelForm(): Promise<void> {
    await this.page.getByTestId('companies-modal').getByRole('button', { name: /cancel/i }).click();
  }

  async clickEditOnFirstRow(): Promise<void> {
    // Table actions are rendered per row, find first Edit button
    await this.page.getByTestId('companies-table').getByRole('button', { name: /edit/i }).first().click();
  }

  async clickDeleteOnFirstRow(): Promise<void> {
    await this.page.getByTestId('companies-table').getByRole('button', { name: /delete/i }).first().click();
  }

  async verifyDeleteModalOpen(): Promise<void> {
    const deleteModal = this.page.getByTestId('companies-delete-modal');
    await expect(deleteModal).toBeVisible();
  }

  async confirmDelete(): Promise<void> {
    await this.page.getByTestId('companies-btn-confirm-delete').click();
  }

  async cancelDelete(): Promise<void> {
    await this.page.getByTestId('companies-delete-modal').getByRole('button', { name: /cancel/i }).click();
  }

  async verifyCompanyInTable(name: string): Promise<void> {
    const table = this.page.getByTestId('companies-table');
    await expect(table.getByText(name)).toBeVisible();
  }

  async verifyCompanyNotInTable(name: string): Promise<void> {
    const table = this.page.getByTestId('companies-table');
    await expect(table.getByText(name)).not.toBeVisible();
  }

  async getRowCount(): Promise<number> {
    // Count rows in tbody (excluding header)
    return await this.page.getByTestId('companies-table').locator('tbody tr').count();
  }

  async verifyEmptyState(): Promise<void> {
    // Empty state typically shows "No data" or similar message
    const table = this.page.getByTestId('companies-table');
    await expect(table.getByText(/no.*companies|no data/i)).toBeVisible();
  }
}
