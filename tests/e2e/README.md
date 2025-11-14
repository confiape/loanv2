# E2E Testing Architecture Documentation

## Overview

This directory contains the complete End-to-End (E2E) testing architecture for the Loan application using **Playwright**. The architecture follows the **Page Object Model (POM)** pattern for maintainability and reusability.

## Directory Structure

```
tests/e2e/
├── fixtures/                  # Test data and fixtures
│   └── companies.fixture.ts   # Company test data, generators, validation cases
├── helpers/                   # Utility helpers
│   ├── auth.helper.ts        # Authentication utilities
│   └── test-ids.ts           # Centralized test ID selectors
├── page-objects/             # Page Object Models
│   ├── base.page.ts          # Base page with common functionality
│   ├── login.page.ts         # Login page interactions
│   └── companies.page.ts     # Companies CRUD page interactions
├── specs/                    # Test specifications
│   └── companies/
│       ├── companies-crud.spec.ts            # CRUD operations tests
│       └── companies-bulk-operations.spec.ts # Bulk operations tests
└── README.md                 # This file
```

## Architecture Principles

### 1. Page Object Model (POM)

All page interactions are encapsulated in Page Object classes:

- **BasePage**: Common functionality shared by all pages (navigation, waiting, assertions)
- **LoginPage**: Login page specific interactions
- **CompaniesPage**: Companies list and CRUD operations

**Benefits:**
- Single source of truth for selectors
- Easy maintenance when UI changes
- Reusable methods across tests
- Better test readability

### 2. Test ID Selectors

All elements use `data-testid` attributes for stable, reliable selectors:

```typescript
// Centralized in helpers/test-ids.ts
export const TestIds = {
  companies: {
    btnNew: 'companies-btn-new',
    searchInput: 'companies-search-input',
    table: 'companies-table',
    // ... more IDs
  }
};
```

**Benefits:**
- Decoupled from CSS classes and DOM structure
- Resistant to styling changes
- Self-documenting
- Easy to find in code

### 3. Fixtures and Test Data

Test data is centralized in fixtures for reusability:

```typescript
// fixtures/companies.fixture.ts
export const validCompanies = [
  { name: 'E2E Test Company Alpha' },
  // ...
];

export function generateUniqueCompanyName(prefix = 'E2E Test Company'): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix} ${timestamp}-${random}`;
}
```

**Benefits:**
- Consistent test data
- Easy to update
- Unique data generation for incremental tests
- Validation test cases included

## Setup and Configuration

### 1. Environment Variables

Create a `.env.test` file in the root directory (copy from `.env.test.example`):

```bash
# Test Environment Variables
TEST_ADMIN_EMAIL=admin@confia.com
TEST_ADMIN_PASSWORD=admin@confia.com@@
TEST_BASE_URL=http://localhost:4200
```

**⚠️ Important:** `.env.test` is gitignored. Never commit credentials.

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Playwright Browsers

```bash
npx playwright install
```

## Running Tests

### Run All E2E Tests

```bash
npm run test:e2e
```

### Run Specific Test File

```bash
npx playwright test tests/e2e/specs/companies/companies-crud.spec.ts
```

### Run in UI Mode (Interactive)

```bash
npx playwright test --ui
```

### Run in Headed Mode (See Browser)

```bash
npx playwright test --headed
```

### Run Specific Test by Name

```bash
npx playwright test -g "should create a new company"
```

### Debug Tests

```bash
npx playwright test --debug
```

## Test Organization

### Companies CRUD Tests (`companies-crud.spec.ts`)

Tests for basic CRUD operations:

- **Read Operations**
  - Display companies list
  - Display table with data
  - Show "No data available" when empty

- **Create Operations**
  - Open new company modal
  - Create company successfully
  - Cancel company creation

- **Search/Filter Operations**
  - Filter by search term
  - Clear search
  - Case-insensitive search

- **Update Operations**
  - Open edit modal
  - Update company successfully
  - Cancel update

- **Delete Operations**
  - Open delete confirmation
  - Delete company successfully
  - Cancel delete

- **Form Validation**
  - Empty name validation
  - Name too short/long
  - Special characters validation

### Companies Bulk Operations Tests (`companies-bulk-operations.spec.ts`)

Tests for multi-select and bulk operations:

- **Selection Operations**
  - Select/deselect individual rows
  - Show selected items count
  - Select all visible rows
  - Display selected company names

- **Bulk Delete Operations**
  - Show bulk delete button
  - Open delete confirmation
  - Cancel bulk delete
  - Delete multiple companies
  - Delete all selected from "select all"
  - Handle large number of deletions

- **Selection Edge Cases**
  - Clear selection
  - Maintain selection when searching

## Authentication

All tests use the `AuthHelper` for authentication:

```typescript
// In test setup
beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.loginAsAdmin(); // Uses env variables
});
```

The `AuthHelper` class provides:
- `login(email, password)`: Login with credentials
- `loginAsAdmin()`: Login with admin credentials from env
- `logout()`: Clear session and logout
- `isAuthenticated()`: Check auth state

## Page Object Usage

### Example: Creating a Company

```typescript
test('should create a company', async ({ page }) => {
  const companiesPage = new CompaniesPage(page);

  await companiesPage.navigate();

  const companyName = generateUniqueCompanyName('E2E Test');
  await companiesPage.createCompany(companyName);

  await companiesPage.search(companyName);
  const exists = await companiesPage.companyExistsInTable(companyName);

  expect(exists).toBe(true);
});
```

### Common Page Object Methods

**BasePage (inherited by all pages):**
- `goto(path)`: Navigate to path
- `getByTestId(testId)`: Get element by test ID
- `clickByTestId(testId)`: Click element
- `fillByTestId(testId, value)`: Fill input
- `expectVisible(testId)`: Assert element visible
- `expectHidden(testId)`: Assert element hidden

**CompaniesPage:**
- `navigate()`: Go to companies page
- `createCompany(name)`: Complete create flow
- `editCompanyByName(oldName, newName)`: Complete edit flow
- `deleteCompanyByName(name)`: Complete delete flow
- `search(term)`: Search companies
- `selectAndDeleteMultiple(indices)`: Bulk delete

## Data Management Strategy

### Incremental Testing

Tests are designed to be **incremental** - data is NOT cleaned up after tests:

```typescript
// ✅ Good: Unique names prevent conflicts
const companyName = generateUniqueCompanyName('E2E Test');
await companiesPage.createCompany(companyName);

// ❌ Bad: Hardcoded names may conflict
await companiesPage.createCompany('Test Company'); // May already exist!
```

**Why Incremental?**
- Tests real-world scenarios with existing data
- Faster test execution (no cleanup)
- Tests search/filter with populated data
- Mimics production environment

**Best Practices:**
1. Always use `generateUniqueCompanyName()` for new data
2. Use specific search terms to isolate test data
3. Don't rely on exact row counts
4. Clean up by searching and deleting specific test data if needed

## Debugging Tips

### 1. Use Playwright Inspector

```bash
npx playwright test --debug
```

Allows stepping through tests, inspecting DOM, and viewing selectors.

### 2. Screenshots and Videos

Playwright automatically captures:
- **Screenshots**: On test failure
- **Videos**: On test failure
- **Traces**: On retry

Find them in `test-results/` and `playwright-report/`.

### 3. View Test Reports

```bash
npx playwright show-report
```

Opens HTML report with detailed results, screenshots, and traces.

### 4. Slow Motion

```bash
npx playwright test --headed --slow-mo=1000
```

Slows down test execution by 1000ms per action.

### 5. Console Logs

Add logging in page objects or tests:

```typescript
console.log('Current URL:', await page.url());
console.log('Row count:', await companiesPage.getTableRowCount());
```

## CI/CD Integration

Playwright config is already set up for CI:

```typescript
// playwright.config.ts
forbidOnly: !!process.env.CI,  // Fail if test.only found
retries: process.env.CI ? 2 : 0,  // Retry on CI
workers: process.env.CI ? 1 : undefined,  // Single worker on CI
```

### GitHub Actions Example

```yaml
- name: Install dependencies
  run: npm ci

- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: npm run test:e2e
  env:
    TEST_ADMIN_EMAIL: ${{ secrets.TEST_ADMIN_EMAIL }}
    TEST_ADMIN_PASSWORD: ${{ secrets.TEST_ADMIN_PASSWORD }}
```

## Common Issues and Solutions

### Issue: "Timed out waiting for selector"

**Cause:** Element not found or slow to load

**Solutions:**
- Increase timeout: `await page.waitForSelector(selector, { timeout: 30000 })`
- Check selector is correct
- Ensure element is actually rendered
- Wait for network to be idle first

### Issue: "Element is not visible"

**Cause:** Element exists but not visible (CSS hidden, scroll needed, etc.)

**Solutions:**
- Use `scrollIntoViewIfNeeded` option
- Check for overlays/modals blocking element
- Verify element styles

### Issue: "Tests fail on CI but pass locally"

**Causes:**
- Different screen sizes
- Timing issues (slower CI)
- Missing dependencies

**Solutions:**
- Use consistent viewport sizes
- Add proper waits (not `waitForTimeout`)
- Ensure all deps installed on CI

## Best Practices

### 1. Always Wait for State, Not Time

```typescript
// ❌ Bad: Arbitrary wait
await page.waitForTimeout(3000);

// ✅ Good: Wait for specific state
await companiesPage.waitForTableLoad();
await page.waitForSelector('[data-testid="companies-table"]');
```

### 2. Use Descriptive Test Names

```typescript
// ❌ Bad
test('test 1', async ({ page }) => { ... });

// ✅ Good
test('should create a new company successfully', async ({ page }) => { ... });
```

### 3. Isolate Tests

Each test should be independent:

```typescript
test.beforeEach(async ({ page }) => {
  // Setup for EACH test
  await loginPage.navigate();
  await loginPage.loginAsAdmin();
  await companiesPage.navigate();
});
```

### 4. Use Page Objects

```typescript
// ❌ Bad: Direct selectors in tests
await page.click('[data-testid="companies-btn-new"]');
await page.fill('[data-testid="companies-input-name"]', 'Test');

// ✅ Good: Page object methods
await companiesPage.clickNewCompany();
await companiesPage.fillCompanyForm({ name: 'Test' });
```

### 5. Meaningful Assertions

```typescript
// ❌ Bad: Just checking it exists
const element = await page.locator('[data-testid="table"]');
expect(element).toBeTruthy();

// ✅ Good: Verify specific state
const rowCount = await companiesPage.getTableRowCount();
expect(rowCount).toBeGreaterThan(0);

const exists = await companiesPage.companyExistsInTable(companyName);
expect(exists).toBe(true);
```

## Contributing

When adding new tests:

1. **Update Page Objects** if new UI interactions needed
2. **Add Test IDs** to components (`data-testid` attributes)
3. **Add to Fixtures** for reusable test data
4. **Follow Naming Conventions**:
   - Test files: `*.spec.ts`
   - Page objects: `*.page.ts`
   - Fixtures: `*.fixture.ts`
5. **Document Complex Scenarios** in test descriptions

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Selectors Guide](https://playwright.dev/docs/selectors)

---

**Questions or Issues?** Check the main project README or create an issue in the repository.
