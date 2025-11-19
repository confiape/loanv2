import { type Page } from '@playwright/test';

/**
 * Common helper functions for E2E tests
 */

/**
 * Wait for Angular app to be ready (zoneless)
 */
export async function waitForAngularReady(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  // Additional wait for Angular hydration if needed
  await page.waitForTimeout(100);
}

/**
 * Fill form input by test ID
 */
export async function fillByTestId(page: Page, testId: string, value: string): Promise<void> {
  await page.getByTestId(testId).fill(value);
}

/**
 * Click button by test ID
 */
export async function clickByTestId(page: Page, testId: string): Promise<void> {
  await page.getByTestId(testId).click();
}

/**
 * Wait for navigation to complete
 */
export async function waitForNavigation(page: Page, expectedUrl: string): Promise<void> {
  await page.waitForURL(expectedUrl);
  await waitForAngularReady(page);
}

/**
 * Take a screenshot with custom name
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
  await page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
}

/**
 * Clear all cookies and local storage
 */
export async function clearSession(page: Page): Promise<void> {
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Debug helper: Log all toasts currently in the page
 * Useful for debugging toast-related test failures
 */
export async function debugToasts(page: Page): Promise<void> {
  const toasts = await page.locator('[data-testid="toast"]').all();

  console.log(`\n=== Debug: Found ${toasts.length} toast(s) ===`);

  for (let i = 0; i < toasts.length; i++) {
    const toast = toasts[i];
    const type = await toast.getAttribute('data-toast-type');
    const isVisible = await toast.isVisible();
    const text = await toast.textContent();

    console.log(`Toast ${i + 1}:`);
    console.log(`  Type: ${type}`);
    console.log(`  Visible: ${isVisible}`);
    console.log(`  Text: ${text?.trim()}`);
  }

  console.log('=== End Debug ===\n');
}
