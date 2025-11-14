/**
 * Debug script to check login page rendering
 */
import { chromium } from '@playwright/test';

async function debugLogin() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Clear all storage to ensure fresh state
  await context.clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  // Enable console logging
  page.on('console', (msg) => console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`));
  page.on('pageerror', (error) => console.error(`[Page Error]:`, error.message));

  try {
    console.log('Navigating to http://localhost:4200/login...');
    await page.goto('http://localhost:4200/login', { waitUntil: 'networkidle', timeout: 15000 });

    console.log('Current URL:', page.url());
    console.log('Page title:', await page.title());

    // Take screenshot
    await page.screenshot({ path: '/tmp/login-page-debug.png', fullPage: true });
    console.log('Screenshot saved to /tmp/login-page-debug.png');

    // Get page HTML
    const html = await page.content();
    console.log('\n--- Page HTML (first 1000 chars) ---');
    console.log(html.substring(0, 1000));

    // Check for specific elements
    console.log('\n--- Checking for elements ---');
    const emailInput = await page.locator('[data-testid="login-email-input"]').count();
    console.log(`Elements with [data-testid="login-email-input"]: ${emailInput}`);

    const emailBase = await page.locator('[data-testid="login-email"]').count();
    console.log(`Elements with [data-testid="login-email"]: ${emailBase}`);

    const allTestIds = await page.locator('[data-testid]').all();
    console.log(`\nAll elements with data-testid (${allTestIds.length}):`);
    for (const el of allTestIds.slice(0, 20)) {
      const testId = await el.getAttribute('data-testid');
      console.log(`  - ${testId}`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

debugLogin();
