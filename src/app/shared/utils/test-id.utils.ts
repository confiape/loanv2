/**
 * Utilities for handling data-testid attributes in components
 */

/**
 * Sanitizes a value to be used as part of a data-testid
 * Converts to lowercase and replaces non-alphanumeric characters with hyphens
 *
 * @param value - The value to sanitize (string or number)
 * @returns Sanitized string suitable for use in data-testid
 *
 * @example
 * sanitizeTestId('United States') // 'united-states'
 * sanitizeTestId('user@email.com') // 'user-email-com'
 * sanitizeTestId(123) // '123'
 * sanitizeTestId('My Value!!!') // 'my-value'
 */
export function sanitizeTestId(value: string | number): string {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generates a test ID with optional suffix
 * Returns null if base is null
 *
 * @param base - Base test ID (can be null)
 * @param suffix - Optional suffix to append
 * @returns Generated test ID or null
 *
 * @example
 * generateTestId('form', 'input') // 'form-input'
 * generateTestId('form', null) // 'form'
 * generateTestId(null, 'input') // null
 */
export function generateTestId(base: string | null, suffix?: string): string | null {
  if (!base) {
    return null;
  }
  return suffix ? `${base}-${suffix}` : base;
}

/**
 * Generates a test ID for dynamic items (options, rows, etc)
 * Uses ID if available, otherwise falls back to index
 *
 * @param base - Base test ID (can be null)
 * @param itemType - Type of item (e.g., 'option', 'row', 'item')
 * @param id - Item ID (preferred) or index
 * @returns Generated test ID or null
 *
 * @example
 * generateItemTestId('form', 'option', 'us') // 'form-option-us'
 * generateItemTestId('table', 'row', 5) // 'table-row-5'
 * generateItemTestId(null, 'option', 'value') // null
 */
export function generateItemTestId(
  base: string | null,
  itemType: string,
  id: string | number,
): string | null {
  if (!base) {
    return null;
  }
  const sanitizedId = sanitizeTestId(id);
  return `${base}-${itemType}-${sanitizedId}`;
}
