/**
 * Test fixtures for companies
 * Provides reusable test data
 */

export interface CompanyTestData {
  name: string;
  expectedValidation?: {
    shouldFail: boolean;
    errorMessage?: string;
  };
}

/**
 * Valid company test data
 */
export const validCompanies: CompanyTestData[] = [
  {
    name: 'E2E Test Company Alpha',
  },
  {
    name: 'E2E Test Company Beta',
  },
  {
    name: 'E2E Test Company Gamma',
  },
  {
    name: 'ABC Corporation',
  },
  {
    name: 'XYZ Industries',
  },
];

/**
 * Invalid company test data for validation tests
 */
export const invalidCompanies: CompanyTestData[] = [
  {
    name: 'A', // Too short (min 2 chars)
    expectedValidation: {
      shouldFail: true,
      errorMessage: 'Minimum length is 2',
    },
  },
  {
    name: 'A'.repeat(41), // Too long (max 40 chars)
    expectedValidation: {
      shouldFail: true,
      errorMessage: 'Maximum length is 40',
    },
  },
  {
    name: 'Company@#$%', // Special characters not allowed
    expectedValidation: {
      shouldFail: true,
    },
  },
  {
    name: '', // Empty/required
    expectedValidation: {
      shouldFail: true,
      errorMessage: 'This field is required',
    },
  },
];

/**
 * Generate unique company name with timestamp
 */
export function generateUniqueCompanyName(prefix = 'E2E Test Company'): string {
  const id = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${id}`;
}

/**
 * Get search test cases
 */
export const searchTestCases = [
  {
    searchTerm: 'Alpha',
    description: 'should find companies with "Alpha" in name',
  },
  {
    searchTerm: 'E2E Test',
    description: 'should find all E2E test companies',
  },
  {
    searchTerm: 'NonExistentCompany12345',
    description: 'should return no results for non-existent company',
  },
];
