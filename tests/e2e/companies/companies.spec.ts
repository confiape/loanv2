import { test, expect } from '@playwright/test';
import { CompaniesPage } from '../pages/companies.page';
import { navigateToCompanies, createCompany, editCompany, deleteCompany, searchCompany } from '../actions/companies.actions';

test.describe('Companies CRUD', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to companies page (includes login)
    await navigateToCompanies(page);
  });

  test('should display companies page with table', async ({ page }) => {
    // Arrange
    const companiesPage = new CompaniesPage(page);

    // Assert
    await companiesPage.verifyPageLoaded();
    await expect(page).toHaveURL(/\/companies/);
  });

  test('should open new company modal when clicking new button', async ({ page }) => {
    // Arrange
    const companiesPage = new CompaniesPage(page);

    // Act
    await companiesPage.clickNew();

    // Assert
    await companiesPage.verifyModalOpen('New Company');
  });

  test('should successfully create a new company', async ({ page }) => {
    // Arrange
    const companyName = `Test Company ${Date.now()}`;

    // Act
    await createCompany(page, companyName);

    // Assert
    const companiesPage = new CompaniesPage(page);
    await companiesPage.verifyCompanyInTable(companyName);
  });

  test('should not allow creating company with empty name', async ({ page }) => {
    // Arrange
    const companiesPage = new CompaniesPage(page);

    // Act
    await companiesPage.clickNew();
    await companiesPage.verifyModalOpen('New Company');
    await companiesPage.fillCompanyName('');

    // Assert - submit button should be disabled or show validation error
    const submitButton = page.getByTestId('companies-modal').getByRole('button', { name: /save|submit/i });
    const isDisabled = await submitButton.isDisabled().catch(() => false);

    expect(isDisabled).toBe(true);
  });

  test('should not allow creating company with name too short', async ({ page }) => {
    // Arrange
    const companiesPage = new CompaniesPage(page);

    // Act
    await companiesPage.clickNew();
    await companiesPage.verifyModalOpen('New Company');
    await companiesPage.fillCompanyName('A'); // Only 1 character, min is 2

    // Assert
    const submitButton = page.getByTestId('companies-modal').getByRole('button', { name: /save|submit/i });
    const isDisabled = await submitButton.isDisabled().catch(() => false);

    expect(isDisabled).toBe(true);
  });

  test('should not allow creating company with name too long', async ({ page }) => {
    // Arrange
    const companiesPage = new CompaniesPage(page);
    const longName = 'A'.repeat(41); // Max is 40 characters

    // Act
    await companiesPage.clickNew();
    await companiesPage.verifyModalOpen('New Company');
    await companiesPage.fillCompanyName(longName);

    // Assert
    const submitButton = page.getByTestId('companies-modal').getByRole('button', { name: /save|submit/i });
    const isDisabled = await submitButton.isDisabled().catch(() => false);

    expect(isDisabled).toBe(true);
  });

  test('should not allow creating company with special characters', async ({ page }) => {
    // Arrange
    const companiesPage = new CompaniesPage(page);
    const nameWithSpecialChars = 'Test@Company#123';

    // Act
    await companiesPage.clickNew();
    await companiesPage.verifyModalOpen('New Company');
    await companiesPage.fillCompanyName(nameWithSpecialChars);

    // Assert
    const submitButton = page.getByTestId('companies-modal').getByRole('button', { name: /save|submit/i });
    const isDisabled = await submitButton.isDisabled().catch(() => false);

    expect(isDisabled).toBe(true);
  });

  test('should close modal when clicking cancel', async ({ page }) => {
    // Arrange
    const companiesPage = new CompaniesPage(page);

    // Act
    await companiesPage.clickNew();
    await companiesPage.verifyModalOpen('New Company');
    await companiesPage.cancelForm();

    // Assert
    await companiesPage.verifyModalClosed();
  });

  test('should successfully edit an existing company', async ({ page }) => {
    // Arrange - Create a company first
    const originalName = `Original ${Date.now()}`;
    await createCompany(page, originalName);

    const companiesPage = new CompaniesPage(page);
    const newName = `Edited ${Date.now()}`;

    // Act
    await editCompany(page, newName);

    // Assert
    await companiesPage.verifyCompanyInTable(newName);
    await companiesPage.verifyCompanyNotInTable(originalName);
  });

  test('should navigate to edit route when clicking edit', async ({ page }) => {
    // Arrange - Create a company first
    const companyName = `Edit Route Test ${Date.now()}`;
    await createCompany(page, companyName);

    const companiesPage = new CompaniesPage(page);

    // Act
    await companiesPage.clickEditOnFirstRow();

    // Assert - URL should change to /companies/:id
    await expect(page).toHaveURL(/\/companies\/[a-zA-Z0-9-]+/);
    await companiesPage.verifyModalOpen('Edit Company');
  });

  test('should cancel editing a company', async ({ page }) => {
    // Arrange - Create a company first
    const companyName = `Cancel Edit ${Date.now()}`;
    await createCompany(page, companyName);

    const companiesPage = new CompaniesPage(page);

    // Act
    await companiesPage.clickEditOnFirstRow();
    await companiesPage.verifyModalOpen('Edit Company');
    await companiesPage.cancelForm();

    // Assert
    await companiesPage.verifyModalClosed();
    await expect(page).toHaveURL(/\/companies$/); // Back to list
  });

  test('should show delete confirmation modal', async ({ page }) => {
    // Arrange - Create a company first
    const companyName = `Delete Test ${Date.now()}`;
    await createCompany(page, companyName);

    const companiesPage = new CompaniesPage(page);

    // Act
    await companiesPage.clickDeleteOnFirstRow();

    // Assert
    await companiesPage.verifyDeleteModalOpen();
  });

  test('should successfully delete a company', async ({ page }) => {
    // Arrange - Create a company first
    const companyName = `To Delete ${Date.now()}`;
    await createCompany(page, companyName);

    const companiesPage = new CompaniesPage(page);

    // Act
    await deleteCompany(page);

    // Assert
    await companiesPage.verifyCompanyNotInTable(companyName);
  });

  test('should cancel deleting a company', async ({ page }) => {
    // Arrange - Create a company first
    const companyName = `Cancel Delete ${Date.now()}`;
    await createCompany(page, companyName);

    const companiesPage = new CompaniesPage(page);

    // Act
    await companiesPage.clickDeleteOnFirstRow();
    await companiesPage.verifyDeleteModalOpen();
    await companiesPage.cancelDelete();

    // Assert - Company should still be visible
    await companiesPage.verifyCompanyInTable(companyName);
  });

  test('should search for companies', async ({ page }) => {
    // Arrange - Create two companies
    const company1 = `Search Test Alpha ${Date.now()}`;
    const company2 = `Search Test Beta ${Date.now()}`;
    await createCompany(page, company1);
    await createCompany(page, company2);

    const companiesPage = new CompaniesPage(page);

    // Act
    await searchCompany(page, 'Alpha');

    // Assert
    await companiesPage.verifyCompanyInTable(company1);
    await companiesPage.verifyCompanyNotInTable(company2);
  });

  test('should show all companies when search is cleared', async ({ page }) => {
    // Arrange - Create two companies and search
    const company1 = `Clear Search Alpha ${Date.now()}`;
    const company2 = `Clear Search Beta ${Date.now()}`;
    await createCompany(page, company1);
    await createCompany(page, company2);

    const companiesPage = new CompaniesPage(page);
    await searchCompany(page, 'Alpha');
    await companiesPage.verifyCompanyInTable(company1);
    await companiesPage.verifyCompanyNotInTable(company2);

    // Act
    await companiesPage.clearSearch();

    // Assert - Both should be visible again
    await companiesPage.verifyCompanyInTable(company1);
    await companiesPage.verifyCompanyInTable(company2);
  });

  test('should show no results message when search has no matches', async ({ page }) => {
    // Arrange - Create a company
    const companyName = `No Match ${Date.now()}`;
    await createCompany(page, companyName);

    const companiesPage = new CompaniesPage(page);

    // Act
    await searchCompany(page, 'NonExistentCompany12345');

    // Assert
    await companiesPage.verifyCompanyNotInTable(companyName);
    // Should show empty state or "no results"
  });
});
