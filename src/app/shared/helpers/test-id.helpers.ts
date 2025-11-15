/**
 * Sanitizes a value to be used as part of a data-testid
 * Converts to lowercase and replaces spaces/special characters with hyphens
 *
 * @param value - The value to sanitize
 * @returns Sanitized test ID part
 *
 * @example
 * sanitizeTestIdValue('New York') // 'new-york'
 * sanitizeTestIdValue('user@email.com') // 'user-email-com'
 */
export function sanitizeTestIdValue(value: string | number): string {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
