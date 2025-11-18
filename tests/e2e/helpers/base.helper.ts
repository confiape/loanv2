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
