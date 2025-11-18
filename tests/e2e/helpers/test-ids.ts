/**
 * Centralized test IDs for E2E tests
 * Keeps data-testid selectors in one place for easy maintenance
 */

export const TestIds = {
  // Auth / Login
  auth: {
    emailInput: 'login-email',
    passwordInput: 'login-password',
    submitButton: 'login-submit',
    errorMessage: 'login-error',
    forgotPasswordLink: 'forgot-password-link',
    signupLink: 'signup-link',
  },

  // Dashboard
  dashboard: {
    header: 'dashboard-header',
    sidebar: 'dashboard-sidebar',
    content: 'dashboard-content',
    userMenu: 'user-menu',
    logoutButton: 'logout-button',
  },

  // Navigation
  navigation: {
    homeLink: 'nav-home',
    loansLink: 'nav-loans',
    settingsLink: 'nav-settings',
  },

  // Loans
  loans: {
    createButton: 'loan-create-button',
    listTable: 'loans-table',
    searchInput: 'loans-search',
    filterButton: 'loans-filter',
  },
} as const;

/**
 * Helper to get test ID selector for Playwright
 */
export function getTestId(id: string): string {
  return `[data-testid="${id}"]`;
}
