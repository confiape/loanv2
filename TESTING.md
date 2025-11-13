# Testing Guide

Complete testing guide for the Loan application, including Unit Tests and E2E Tests.

## Table of Contents

- [Quick Start](#quick-start)
- [Unit Testing (Vitest)](#unit-testing-vitest)
- [E2E Testing (Playwright)](#e2e-testing-playwright)
- [Test Scripts](#test-scripts)
- [Project Structure](#project-structure)

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Playwright Browsers (E2E only)

```bash
npx playwright install
```

### 3. Setup Environment Variables

Copy the example file and configure credentials:

```bash
cp .env.test.example .env.test
# Edit .env.test with your test credentials
```

### 4. Run Tests

```bash
# Unit tests
npm run test:unit

# E2E tests (requires app running on localhost:4200)
npm run test:e2e
```

---

## Unit Testing (Vitest)

### Overview

Unit tests use **Vitest** with **Angular Testing Library** for component testing.

### Location

All unit tests are co-located with source files:

```
src/app/features/companies/
├── pages/
│   └── companies-list/
│       ├── companies-list.ts
│       └── companies-list.spec.ts        ← Unit test
├── services/
│   ├── company-crud.service.ts
│   └── company-crud.service.spec.ts      ← Unit test
└── validators/
    ├── company.validators.ts
    └── company.validators.spec.ts        ← Unit test
```

### Running Unit Tests

```bash
# Run all unit tests
npm run test:unit

# Run tests in watch mode
npm run test:unit:watch

# Run tests with coverage
npm run coverage
```

### Unit Test Example

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

describe('CompanyService', () => {
  let service: CompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        CompanyService,
      ],
    });
    service = TestBed.inject(CompanyService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
```

### Unit Test Coverage

Current coverage includes:
- ✅ Companies list component (100%)
- ✅ Company CRUD service (100%)
- ✅ Company validators (100%)

---

## E2E Testing (Playwright)

### Overview

E2E tests use **Playwright** following the **Page Object Model** pattern.

### Architecture

```
tests/e2e/
├── fixtures/          # Test data
├── helpers/           # Utilities (auth, test-ids)
├── page-objects/      # Page Object Models
└── specs/             # Test specifications
    └── companies/
        ├── companies-crud.spec.ts
        └── companies-bulk-operations.spec.ts
```

### Prerequisites

Before running E2E tests:

1. **Start the application** pointing to test backend:

```bash
npm run start:test
```

2. **Configure environment variables** in `.env.test`:

```bash
TEST_ADMIN_EMAIL=admin@confia.com
TEST_ADMIN_PASSWORD=admin@confia.com@@
TEST_BASE_URL=http://localhost:4200
```

### Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run in UI mode (interactive)
npm run test:e2e:ui

# Run with browser visible
npm run test:e2e:headed

# Debug mode
npm run test:e2e:debug

# View test report
npm run test:e2e:report

# Run only companies tests
npm run test:e2e:companies
```

### E2E Test Coverage

Current E2E tests cover:

#### Companies CRUD Operations
- ✅ Read: Display list, search, filter
- ✅ Create: New company with validation
- ✅ Update: Edit existing company
- ✅ Delete: Remove single company
- ✅ Validation: All form validations

#### Companies Bulk Operations
- ✅ Multi-select: Individual and select all
- ✅ Bulk delete: Multiple companies at once
- ✅ Selection states: Partial, all, none

### Page Object Example

```typescript
// page-objects/companies.page.ts
export class CompaniesPage extends BasePage {
  async createCompany(name: string): Promise<void> {
    await this.clickNewCompany();
    await this.fillCompanyForm({ name });
    await this.submitForm();
  }

  async companyExistsInTable(name: string): Promise<boolean> {
    // Implementation...
  }
}

// In test
test('should create company', async ({ page }) => {
  const companiesPage = new CompaniesPage(page);
  await companiesPage.navigate();
  await companiesPage.createCompany('Test Company');

  const exists = await companiesPage.companyExistsInTable('Test Company');
  expect(exists).toBe(true);
});
```

---

## Test Scripts

### Unit Tests

| Script | Description |
|--------|-------------|
| `npm run test` | Default test command (Vitest) |
| `npm run test:unit` | Run all unit tests |
| `npm run test:unit:watch` | Run tests in watch mode |
| `npm run coverage` | Run tests with coverage report |

### E2E Tests

| Script | Description |
|--------|-------------|
| `npm run test:e2e` | Run all E2E tests (headless) |
| `npm run test:e2e:ui` | Run in Playwright UI mode |
| `npm run test:e2e:headed` | Run with browser visible |
| `npm run test:e2e:debug` | Debug mode with inspector |
| `npm run test:e2e:report` | View HTML test report |
| `npm run test:e2e:companies` | Run only companies tests |

---

## Project Structure

### Complete Test Organization

```
loanv2/
├── src/
│   └── app/
│       ├── features/
│       │   └── companies/
│       │       ├── pages/
│       │       │   └── companies-list/
│       │       │       ├── companies-list.ts
│       │       │       └── companies-list.spec.ts       ← Unit test
│       │       ├── services/
│       │       │   ├── company-crud.service.ts
│       │       │   └── company-crud.service.spec.ts     ← Unit test
│       │       └── validators/
│       │           ├── company.validators.ts
│       │           └── company.validators.spec.ts       ← Unit test
│       └── shared/
│           ├── components/
│           │   └── generic-crud/
│           │       ├── generic-crud-list/
│           │       │   └── generic-crud-list.html       ← data-testid
│           │       └── generic-crud-form/
│           │           └── generic-crud-form.html       ← data-testid
│           └── ui/
│               └── table/
│                   └── table.html                       ← data-testid
├── tests/
│   └── e2e/
│       ├── fixtures/                                    ← Test data
│       ├── helpers/                                     ← Utilities
│       ├── page-objects/                                ← POM
│       ├── specs/                                       ← E2E tests
│       └── README.md                                    ← E2E docs
├── .env.test.example                                    ← Env template
├── .env.test                                            ← Test credentials (gitignored)
├── playwright.config.ts                                 ← Playwright config
└── TESTING.md                                           ← This file
```

---

## Data Test IDs

All interactive elements have `data-testid` attributes for reliable E2E testing:

### Companies Page

```html
<!-- New button -->
<button data-testid="companies-btn-new">New Company</button>

<!-- Search input -->
<input data-testid="companies-search-input" />

<!-- Table -->
<app-table data-testid="companies-table" />

<!-- Modal -->
<app-modal data-testid="companies-modal">
  <app-input data-testid="companies-input-name" />
  <button data-testid="companies-btn-submit">Submit</button>
  <button data-testid="companies-btn-cancel">Cancel</button>
</app-modal>

<!-- Delete confirmation -->
<app-modal data-testid="companies-delete-modal">
  <button data-testid="companies-btn-confirm-delete">Delete</button>
  <button data-testid="companies-btn-cancel-delete">Cancel</button>
</app-modal>

<!-- Table actions (dynamic per row) -->
<button data-testid="companies-table-row-0-btn-edit">Edit</button>
<button data-testid="companies-table-row-0-btn-delete">Delete</button>
```

### Login Page

```html
<app-input data-testid="login-email-input" />
<app-password-input data-testid="login-password-input" />
<button data-testid="login-submit-btn">Login</button>
```

---

## Best Practices

### Unit Tests

1. **Co-locate tests** with source files
2. **Use signals** for reactive state testing
3. **Mock dependencies** using Vitest mocks
4. **Test public APIs** not implementation details
5. **Use Testing Library** queries for component tests

### E2E Tests

1. **Use Page Objects** for all interactions
2. **Use data-testid** for selectors
3. **Generate unique data** for incremental testing
4. **Wait for state**, not arbitrary timeouts
5. **Independent tests** - each test stands alone
6. **Meaningful assertions** - verify behavior, not just existence

---

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:unit

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
        env:
          TEST_ADMIN_EMAIL: ${{ secrets.TEST_ADMIN_EMAIL }}
          TEST_ADMIN_PASSWORD: ${{ secrets.TEST_ADMIN_PASSWORD }}
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Troubleshooting

### E2E Tests Not Running

1. **Check app is running**: `npm run start:test`
2. **Verify port 4200**: App must be on `http://localhost:4200`
3. **Check .env.test**: Credentials must be valid
4. **Install browsers**: `npx playwright install`

### Unit Tests Failing

1. **Check dependencies**: `npm install`
2. **Clear cache**: `rm -rf node_modules/.vite`
3. **Verify imports**: Use `@loan/...` aliases
4. **Check providers**: Ensure all services are provided

### Timeout Errors

1. **Increase timeout** in `playwright.config.ts`:
   ```typescript
   use: {
     actionTimeout: 30000,  // 30 seconds
   }
   ```
2. **Add waits**: Wait for specific elements, not arbitrary delays
3. **Check network**: Slow backend may need more time

---

## Additional Resources

- [E2E Testing Documentation](./tests/e2e/README.md) - Detailed E2E architecture
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Testing Library Angular](https://testing-library.com/docs/angular-testing-library/intro/)

---

**Questions?** Create an issue in the repository or check the detailed E2E documentation in `tests/e2e/README.md`.
