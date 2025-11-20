import { type Page } from '@playwright/test';
import { RolesPage } from '../pages/roles.page';
import { loginAsAdmin } from './auth.actions';

/**
 * Navigate to roles page (requires authentication)
 */
export async function navigateToRoles(page: Page): Promise<void> {
  await loginAsAdmin(page);
  const rolesPage = new RolesPage(page);
  await rolesPage.goto();
  await rolesPage.verifyPageLoaded();
}

/**
 * Create a new role
 */
export async function createRole(page: Page, name: string): Promise<void> {
  const rolesPage = new RolesPage(page);
  await rolesPage.clickNew();
  await rolesPage.verifyModalOpen('New Role');
  await rolesPage.fillRoleName(name);
  await rolesPage.submitForm();
  await rolesPage.verifyModalClosed();
  await rolesPage.verifyRoleInTable(name);
}

/**
 * Edit a role (assumes at least one role exists)
 */
export async function editRole(page: Page, newName: string): Promise<void> {
  const rolesPage = new RolesPage(page);
  await rolesPage.clickEditOnFirstRow();
  await rolesPage.verifyModalOpen('Edit Role');
  await rolesPage.fillRoleName(newName);
  await rolesPage.submitForm();
  await rolesPage.verifyModalClosed();
  await rolesPage.verifyRoleInTable(newName);
}

/**
 * Delete a role (assumes at least one role exists)
 */
export async function deleteRole(page: Page): Promise<void> {
  const rolesPage = new RolesPage(page);
  await rolesPage.clickDeleteOnFirstRow();
  await rolesPage.verifyDeleteModalOpen();
  await rolesPage.confirmDelete();
}

/**
 * Search for a role
 */
export async function searchRole(page: Page, term: string): Promise<void> {
  const rolesPage = new RolesPage(page);
  await rolesPage.search(term);
}
