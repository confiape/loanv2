/**
 * Centralized Test ID generators
 * Provides type-safe data-testid selectors for E2E tests
 */

export const TestIds = {
  /**
   * Companies page test IDs
   */
  companies: {
    // Main elements
    btnNew: 'companies-btn-new',
    searchInput: 'companies-search-input',
    table: 'companies-table',
    modal: 'companies-modal',
    deleteModal: 'companies-delete-modal',

    // Selected items section
    selectedItems: 'companies-selected-items',
    btnBulkDelete: 'companies-btn-bulk-delete',

    // Form elements
    inputName: 'companies-input-name',
    btnSubmit: 'companies-btn-submit',
    btnCancel: 'companies-btn-cancel',

    // Delete confirmation
    btnConfirmDelete: 'companies-btn-confirm-delete',
    btnCancelDelete: 'companies-btn-cancel-delete',

    // Table actions (these will need to be added to components)
    getEditBtn: (index: number) => `companies-table-row-${index}-btn-edit`,
    getDeleteBtn: (index: number) => `companies-table-row-${index}-btn-delete`,
    getRowCheckbox: (index: number) => `companies-table-row-${index}-checkbox`,
  },

  /**
   * Login page test IDs
   */
  login: {
    emailInput: 'login-email-input',
    passwordInput: 'login-password-input',
    submitBtn: 'login-submit-btn',
    errorMessage: 'login-error-message',
  },

  /**
   * Generic table test IDs
   */
  table: {
    selectAll: 'checkbox-all',
    search: 'table-search',
    pagination: 'table-pagination',
  },
} as const;

/**
 * Helper to get data-testid selector for Playwright
 */
export function getByTestId(testId: string): string {
  return `[data-testid="${testId}"]`;
}

/**
 * Helper to get multiple test IDs as selector
 */
export function getByTestIds(...testIds: string[]): string {
  return testIds.map((id) => getByTestId(id)).join(', ');
}
