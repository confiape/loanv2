# E2E Tests - Playwright

This directory contains end-to-end tests for the Loan application using Playwright.

## Overview

The E2E tests verify the complete user workflows and interactions with the application, ensuring that all features work correctly from the user's perspective.

## Test Structure

### Test Files

- **login.spec.ts** - Tests for authentication and login functionality
- **companies.spec.ts** - Tests for company CRUD operations

## Test IDs Convention

All components use the `data-testid` attribute pattern for reliable element selection:

### Pattern

Components inherit a `data-testid` from their host element and generate child test IDs with suffixes:

```html
<app-input data-testid="login-email" />
```

Generates:
- `login-email-label` - Label element
- `login-email-input` - Input field
- `login-email-helpText` - Help text
- `login-email-errorMessage` - Error message

### Button Pattern

```html
<app-button data-testid="login-submit" />
```

Generates:
- `login-submit-button` - Button element

### CRUD List Pattern

For CRUD lists using `GenericCrudListComponent` with `testIdPrefix="companies"`:

- `companies-btn-new-button` - New item button
- `companies-search-input` - Search input field
- `companies-table` - Data table
- `companies-modal` - Form modal
- `companies-delete-modal` - Delete confirmation modal
- `companies-btn-bulk-delete-button` - Bulk delete button
- `companies-btn-cancel-delete-button` - Cancel delete button
- `companies-btn-confirm-delete-button` - Confirm delete button

### Form Pattern

For forms with `testIdPrefix="companies"` and field key `name`:

- `companies-input-name-input` - Name input field
- `companies-input-name-label` - Name label
- `companies-input-name-errorMessage` - Name error message
- `companies-btn-cancel-button` - Cancel button
- `companies-btn-submit-button` - Submit button

## Running Tests

### Prerequisites

Ensure you have the test environment set up:

```bash
npm install
```

### Run All Tests

```bash
npx playwright test
```

### Run Specific Test File

```bash
npx playwright test tests/e2e/login.spec.ts
npx playwright test tests/e2e/companies.spec.ts
```

### Run Tests in UI Mode

For interactive debugging:

```bash
npx playwright test --ui
```

### Run Tests in Headed Mode

To see the browser:

```bash
npx playwright test --headed
```

### Debug Mode

```bash
npx playwright test --debug
```

## Test Coverage

### Login Tests

- ✅ Display login form with all elements
- ✅ Validation for empty form
- ✅ Validation for invalid email format
- ✅ Validation for short password
- ✅ Enable submit with valid credentials
- ✅ Handle successful login
- ✅ Handle invalid credentials
- ✅ Password visibility toggle
- ✅ Password recovery link
- ✅ Form state after failed login
- ✅ Responsive design on mobile

### Companies Tests

- ✅ Display companies list with all elements
- ✅ Search companies by name
- ✅ Clear search
- ✅ Open new company modal
- ✅ Validate required field
- ✅ Validate minimum length (2 chars)
- ✅ Validate maximum length (40 chars)
- ✅ Validate no special characters
- ✅ Create new company
- ✅ Cancel company creation
- ✅ Close modal
- ✅ Open edit modal
- ✅ Update company
- ✅ Open delete confirmation
- ✅ Cancel delete
- ✅ Confirm delete
- ✅ Select multiple companies
- ✅ Clear selection
- ✅ Bulk delete
- ✅ Responsive design on mobile

## Configuration

The Playwright configuration is defined in `playwright.config.ts` at the root of the project:

- **Base URL**: `http://localhost:4200`
- **Test Directory**: `./tests/e2e`
- **Web Server**: Starts automatically with `npm run start:test`
- **Browser**: Chromium (default)
- **Retries**: 2 on CI, 0 locally
- **Screenshots**: On failure only
- **Videos**: Retained on failure

## Authentication

The companies tests require authentication. The test suite includes a helper function `login()` that:

1. Navigates to `/login`
2. Fills in credentials
3. Submits the form
4. Waits for navigation

You may need to customize this based on your authentication implementation or use Playwright's authentication state storage for better performance.

## Best Practices

1. **Use data-testid selectors** - Always prefer `getByTestId()` over CSS selectors
2. **Wait for elements** - Use `waitForTimeout()` or `waitForSelector()` appropriately
3. **Unique test data** - Use timestamps or random IDs to avoid conflicts
4. **Clean up** - Delete test data when possible
5. **Independent tests** - Each test should be self-contained
6. **Descriptive names** - Use clear, descriptive test names

## Troubleshooting

### Tests fail with "element not found"

- Verify the test ID exists in the component
- Check if the component is properly rendered
- Increase timeout values if needed

### Tests fail with authentication errors

- Verify the login credentials in the test
- Check if the backend is running
- Verify the proxy configuration in `proxy.conf.test.js`

### Tests are slow

- Use `page.waitForLoadState('networkidle')` sparingly
- Consider using authentication state storage
- Run tests in parallel where possible

## CI/CD Integration

The tests are configured to run in CI environments:

- Retries: 2 attempts
- Workers: 1 (sequential execution)
- Reporters: HTML, JSON, and list

## Future Enhancements

- [ ] Add visual regression tests
- [ ] Add accessibility (a11y) tests
- [ ] Add performance tests
- [ ] Add API mocking for more reliable tests
- [ ] Add authentication state storage
- [ ] Add more edge case scenarios
- [ ] Add tests for roles CRUD
- [ ] Add tests for other features

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Test Selectors](https://playwright.dev/docs/selectors)
