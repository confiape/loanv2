import { type Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Roles Page Object
 * Handles all interactions with the roles CRUD page
 */
export class RolesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await super.goto('/roles');
  }

  async verifyPageLoaded(): Promise<void> {
    // goto() already waits for navigation and Angular ready
    // Just verify the table is visible
    await expect(this.page.getByTestId('roles-table')).toBeVisible({ timeout: 10000 });
  }

  async clickNew(): Promise<void> {
    await this.page.getByTestId('roles-btn-new').click();
  }

  async search(term: string): Promise<void> {
    await this.page.getByTestId('roles-search-input').fill(term);
  }

  async clearSearch(): Promise<void> {
    await this.page.getByTestId('roles-search-input').fill('');
  }

  async verifyModalOpen(expectedTitle: string): Promise<void> {
    const modal = this.page.getByTestId('roles-modal');
    await expect(modal).toBeVisible();
    await expect(modal.getByText(expectedTitle)).toBeVisible();
  }

  async verifyModalClosed(): Promise<void> {
    const modal = this.page.getByTestId('roles-modal');
    await expect(modal).not.toBeVisible();
  }

  async fillRoleName(name: string): Promise<void> {
    await this.page.locator('input[name="name"]').fill(name);
  }

  async submitForm(): Promise<void> {
    await this.page.getByTestId('roles-modal').getByRole('button', { name: /save|submit/i }).click();
  }

  async cancelForm(): Promise<void> {
    await this.page.getByTestId('roles-modal').getByRole('button', { name: /cancel/i }).click();
  }

  async clickEditOnFirstRow(): Promise<void> {
    await this.page.getByTestId('roles-table').getByRole('button', { name: /edit/i }).first().click();
  }

  async clickDeleteOnFirstRow(): Promise<void> {
    await this.page.getByTestId('roles-table').getByRole('button', { name: /delete/i }).first().click();
  }

  async verifyDeleteModalOpen(): Promise<void> {
    const deleteModal = this.page.getByTestId('roles-delete-modal');
    await expect(deleteModal).toBeVisible();
  }

  async confirmDelete(): Promise<void> {
    await this.page.getByTestId('roles-btn-confirm-delete').click();
  }

  async cancelDelete(): Promise<void> {
    await this.page.getByTestId('roles-delete-modal').getByRole('button', { name: /cancel/i }).click();
  }

  async verifyRoleInTable(name: string): Promise<void> {
    const table = this.page.getByTestId('roles-table');
    await expect(table.getByText(name)).toBeVisible();
  }

  async verifyRoleNotInTable(name: string): Promise<void> {
    const table = this.page.getByTestId('roles-table');
    await expect(table.getByText(name)).not.toBeVisible();
  }

  async getRowCount(): Promise<number> {
    return await this.page.getByTestId('roles-table').locator('tbody tr').count();
  }

  async verifyEmptyState(): Promise<void> {
    const table = this.page.getByTestId('roles-table');
    await expect(table.getByText(/no.*roles|no data/i)).toBeVisible();
  }
}
