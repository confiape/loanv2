import { test } from '@playwright/test';

/**
 * Temporary test to inspect login page and discover actual selectors
 * This test will help us identify the real data-testid attributes
 */
test('inspect login page elements', async ({ page }) => {
  // Intercept API calls to prevent crashes
  await page.route('**/api/**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: false }),
    });
  });

  await page.goto('/home');

  // Wait for an input to appear
  await page.locator('input').first().waitFor({ timeout: 5000 }).catch(() => {});

  // Log current URL
  console.log(`\n=== Current URL: ${page.url()} ===`);

  // Log page title
  console.log(`Page title: ${await page.title()}`);

  // Get all elements with data-testid
  const elementsWithTestId = await page.locator('[data-testid]').all();

  console.log('\n=== Elements with data-testid ===');
  for (const element of elementsWithTestId) {
    const testId = await element.getAttribute('data-testid');
    const tagName = await element.evaluate((el) => el.tagName);
    const text = await element.textContent().catch(() => '');
    console.log(`${tagName}: data-testid="${testId}" | text="${text?.trim()}"`);
  }

  // Get all input elements
  const inputs = await page.locator('input').all();
  console.log('\n=== Input elements ===');
  for (const input of inputs) {
    const type = await input.getAttribute('type');
    const name = await input.getAttribute('name');
    const id = await input.getAttribute('id');
    const placeholder = await input.getAttribute('placeholder');
    const testId = await input.getAttribute('data-testid');
    console.log(
      `Input: type="${type}" name="${name}" id="${id}" placeholder="${placeholder}" data-testid="${testId}"`,
    );
  }

  // Get all buttons
  const buttons = await page.locator('button').all();
  console.log('\n=== Button elements ===');
  for (const button of buttons) {
    const text = await button.textContent();
    const type = await button.getAttribute('type');
    const testId = await button.getAttribute('data-testid');
    console.log(`Button: text="${text?.trim()}" type="${type}" data-testid="${testId}"`);
  }
});
