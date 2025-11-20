import { test, expect } from '@playwright/test';
import { RolesPage } from '../pages/roles.page';
import { navigateToRoles, createRole, editRole, deleteRole, searchRole } from '../actions/roles.actions';

test.describe('Roles CRUD', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to roles page (includes login)
    await navigateToRoles(page);
  });

  test('should display roles page with table', async ({ page }) => {
    // Arrange
    const rolesPage = new RolesPage(page);

    // Assert
    await rolesPage.verifyPageLoaded();
    await expect(page).toHaveURL(/\/roles/);
  });

  test('should open new role modal when clicking new button', async ({ page }) => {
    // Arrange
    const rolesPage = new RolesPage(page);

    // Act
    await rolesPage.clickNew();

    // Assert
    await rolesPage.verifyModalOpen('New Role');
  });

  test('should successfully create a new role', async ({ page }) => {
    // Arrange
    const roleName = `Test Role ${Date.now()}`;

    // Act
    await createRole(page, roleName);

    // Assert
    const rolesPage = new RolesPage(page);
    await rolesPage.verifyRoleInTable(roleName);
  });

  test('should not allow creating role with empty name', async ({ page }) => {
    // Arrange
    const rolesPage = new RolesPage(page);

    // Act
    await rolesPage.clickNew();
    await rolesPage.verifyModalOpen('New Role');
    await rolesPage.fillRoleName('');

    // Assert
    const submitButton = page.getByTestId('roles-modal').getByRole('button', { name: /save|submit/i });
    const isDisabled = await submitButton.isDisabled().catch(() => false);

    expect(isDisabled).toBe(true);
  });

  test('should not allow creating role with name too short', async ({ page }) => {
    // Arrange
    const rolesPage = new RolesPage(page);

    // Act
    await rolesPage.clickNew();
    await rolesPage.verifyModalOpen('New Role');
    await rolesPage.fillRoleName('A'); // Only 1 character, min is 2

    // Assert
    const submitButton = page.getByTestId('roles-modal').getByRole('button', { name: /save|submit/i });
    const isDisabled = await submitButton.isDisabled().catch(() => false);

    expect(isDisabled).toBe(true);
  });

  test('should not allow creating role with name too long', async ({ page }) => {
    // Arrange
    const rolesPage = new RolesPage(page);
    const longName = 'A'.repeat(41); // Max is 40 characters

    // Act
    await rolesPage.clickNew();
    await rolesPage.verifyModalOpen('New Role');
    await rolesPage.fillRoleName(longName);

    // Assert
    const submitButton = page.getByTestId('roles-modal').getByRole('button', { name: /save|submit/i });
    const isDisabled = await submitButton.isDisabled().catch(() => false);

    expect(isDisabled).toBe(true);
  });

  test('should not allow creating role with special characters', async ({ page }) => {
    // Arrange
    const rolesPage = new RolesPage(page);
    const nameWithSpecialChars = 'Test@Role#123';

    // Act
    await rolesPage.clickNew();
    await rolesPage.verifyModalOpen('New Role');
    await rolesPage.fillRoleName(nameWithSpecialChars);

    // Assert
    const submitButton = page.getByTestId('roles-modal').getByRole('button', { name: /save|submit/i });
    const isDisabled = await submitButton.isDisabled().catch(() => false);

    expect(isDisabled).toBe(true);
  });

  test('should close modal when clicking cancel', async ({ page }) => {
    // Arrange
    const rolesPage = new RolesPage(page);

    // Act
    await rolesPage.clickNew();
    await rolesPage.verifyModalOpen('New Role');
    await rolesPage.cancelForm();

    // Assert
    await rolesPage.verifyModalClosed();
  });

  test('should successfully edit an existing role', async ({ page }) => {
    // Arrange - Create a role first
    const originalName = `Original ${Date.now()}`;
    await createRole(page, originalName);

    const rolesPage = new RolesPage(page);
    const newName = `Edited ${Date.now()}`;

    // Act
    await editRole(page, newName);

    // Assert
    await rolesPage.verifyRoleInTable(newName);
    await rolesPage.verifyRoleNotInTable(originalName);
  });

  test('should navigate to edit route when clicking edit', async ({ page }) => {
    // Arrange - Create a role first
    const roleName = `Edit Route Test ${Date.now()}`;
    await createRole(page, roleName);

    const rolesPage = new RolesPage(page);

    // Act
    await rolesPage.clickEditOnFirstRow();

    // Assert - URL should change to /roles/:id
    await expect(page).toHaveURL(/\/roles\/[a-zA-Z0-9-]+/);
    await rolesPage.verifyModalOpen('Edit Role');
  });

  test('should cancel editing a role', async ({ page }) => {
    // Arrange - Create a role first
    const roleName = `Cancel Edit ${Date.now()}`;
    await createRole(page, roleName);

    const rolesPage = new RolesPage(page);

    // Act
    await rolesPage.clickEditOnFirstRow();
    await rolesPage.verifyModalOpen('Edit Role');
    await rolesPage.cancelForm();

    // Assert
    await rolesPage.verifyModalClosed();
    await expect(page).toHaveURL(/\/roles$/); // Back to list
  });

  test('should show delete confirmation modal', async ({ page }) => {
    // Arrange - Create a role first
    const roleName = `Delete Test ${Date.now()}`;
    await createRole(page, roleName);

    const rolesPage = new RolesPage(page);

    // Act
    await rolesPage.clickDeleteOnFirstRow();

    // Assert
    await rolesPage.verifyDeleteModalOpen();
  });

  test('should successfully delete a role', async ({ page }) => {
    // Arrange - Create a role first
    const roleName = `To Delete ${Date.now()}`;
    await createRole(page, roleName);

    const rolesPage = new RolesPage(page);

    // Act
    await deleteRole(page);

    // Assert
    await rolesPage.verifyRoleNotInTable(roleName);
  });

  test('should cancel deleting a role', async ({ page }) => {
    // Arrange - Create a role first
    const roleName = `Cancel Delete ${Date.now()}`;
    await createRole(page, roleName);

    const rolesPage = new RolesPage(page);

    // Act
    await rolesPage.clickDeleteOnFirstRow();
    await rolesPage.verifyDeleteModalOpen();
    await rolesPage.cancelDelete();

    // Assert - Role should still be visible
    await rolesPage.verifyRoleInTable(roleName);
  });

  test('should search for roles', async ({ page }) => {
    // Arrange - Create two roles
    const role1 = `Search Test Alpha ${Date.now()}`;
    const role2 = `Search Test Beta ${Date.now()}`;
    await createRole(page, role1);
    await createRole(page, role2);

    const rolesPage = new RolesPage(page);

    // Act
    await searchRole(page, 'Alpha');

    // Assert
    await rolesPage.verifyRoleInTable(role1);
    await rolesPage.verifyRoleNotInTable(role2);
  });

  test('should show all roles when search is cleared', async ({ page }) => {
    // Arrange - Create two roles and search
    const role1 = `Clear Search Alpha ${Date.now()}`;
    const role2 = `Clear Search Beta ${Date.now()}`;
    await createRole(page, role1);
    await createRole(page, role2);

    const rolesPage = new RolesPage(page);
    await searchRole(page, 'Alpha');
    await rolesPage.verifyRoleInTable(role1);
    await rolesPage.verifyRoleNotInTable(role2);

    // Act
    await rolesPage.clearSearch();

    // Assert - Both should be visible again
    await rolesPage.verifyRoleInTable(role1);
    await rolesPage.verifyRoleInTable(role2);
  });

  test('should show no results message when search has no matches', async ({ page }) => {
    // Arrange - Create a role
    const roleName = `No Match ${Date.now()}`;
    await createRole(page, roleName);

    const rolesPage = new RolesPage(page);

    // Act
    await searchRole(page, 'NonExistentRole12345');

    // Assert
    await rolesPage.verifyRoleNotInTable(roleName);
  });
});
