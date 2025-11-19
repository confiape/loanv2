import { type Page } from '@playwright/test';
import { CompaniesPage } from '../pages/companies.page';
import { loginAsAdmin } from './auth.actions';

/**
 * Navigate to companies page (requires authentication)
 */
export async function navigateToCompanies(page: Page): Promise<void> {
  await loginAsAdmin(page);
  const companiesPage = new CompaniesPage(page);
  await companiesPage.goto();
  await companiesPage.verifyPageLoaded();
}

/**
 * Create a new company
 */
export async function createCompany(page: Page, name: string): Promise<void> {
  const companiesPage = new CompaniesPage(page);
  await companiesPage.clickNew();
  await companiesPage.verifyModalOpen('New Company');
  await companiesPage.fillCompanyName(name);
  await companiesPage.submitForm();
  await companiesPage.verifyModalClosed();
  await companiesPage.verifyCompanyInTable(name);
}

/**
 * Edit a company (assumes at least one company exists)
 */
export async function editCompany(page: Page, newName: string): Promise<void> {
  const companiesPage = new CompaniesPage(page);
  await companiesPage.clickEditOnFirstRow();
  await companiesPage.verifyModalOpen('Edit Company');
  await companiesPage.fillCompanyName(newName);
  await companiesPage.submitForm();
  await companiesPage.verifyModalClosed();
  await companiesPage.verifyCompanyInTable(newName);
}

/**
 * Delete a company (assumes at least one company exists)
 */
export async function deleteCompany(page: Page): Promise<void> {
  const companiesPage = new CompaniesPage(page);
  await companiesPage.clickDeleteOnFirstRow();
  await companiesPage.verifyDeleteModalOpen();
  await companiesPage.confirmDelete();
}

/**
 * Search for a company
 */
export async function searchCompany(page: Page, term: string): Promise<void> {
  const companiesPage = new CompaniesPage(page);
  await companiesPage.search(term);
}
