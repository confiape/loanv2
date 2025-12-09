/**
 * Common formatters for display fields
 * Reusable formatting functions for consistent data presentation
 */

/**
 * Format a date value
 * @param value - Date string or Date object
 * @param format - Format style (default: 'medium')
 * @returns Formatted date string
 */
export function formatDate(
  value: unknown,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium',
): string {
  if (!value) return 'N/A';

  try {
    const date = value instanceof Date ? value : new Date(String(value));

    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    const formatOptions: Record<string, Intl.DateTimeFormatOptions> = {
      short: { year: 'numeric', month: '2-digit', day: '2-digit' },
      medium: { year: 'numeric', month: 'short', day: 'numeric' },
      long: { year: 'numeric', month: 'long', day: 'numeric' },
      full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    };
    const options = formatOptions[format];

    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch {
    return 'Invalid Date';
  }
}

/**
 * Format a datetime value
 * @param value - DateTime string or Date object
 * @returns Formatted datetime string
 */
export function formatDateTime(value: unknown): string {
  if (!value) return 'N/A';

  try {
    const date = value instanceof Date ? value : new Date(String(value));

    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return 'Invalid Date';
  }
}

/**
 * Format a currency value
 * @param value - Numeric value
 * @param currency - Currency code (default: 'USD')
 * @returns Formatted currency string
 */
export function formatCurrency(value: unknown, currency = 'USD'): string {
  if (value === null || value === undefined) return 'N/A';

  const numValue = typeof value === 'number' ? value : parseFloat(String(value));

  if (isNaN(numValue)) {
    return 'Invalid Amount';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(numValue);
}

/**
 * Format a number with thousands separator
 * @param value - Numeric value
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string
 */
export function formatNumber(value: unknown, decimals = 2): string {
  if (value === null || value === undefined) return 'N/A';

  const numValue = typeof value === 'number' ? value : parseFloat(String(value));

  if (isNaN(numValue)) {
    return 'Invalid Number';
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numValue);
}

/**
 * Format a boolean value
 * @param value - Boolean value
 * @param labels - Custom labels for true/false
 * @returns Formatted boolean string
 */
export function formatBoolean(
  value: unknown,
  labels: { true: string; false: string } = { true: 'Yes', false: 'No' },
): string {
  if (value === null || value === undefined) return 'N/A';
  return value ? labels.true : labels.false;
}

/**
 * Format a boolean with icons
 * @param value - Boolean value
 * @returns Formatted boolean string with checkmark/cross
 */
export function formatBooleanIcon(value: unknown): string {
  if (value === null || value === undefined) return 'N/A';
  return value ? '✓ Yes' : '✗ No';
}

/**
 * Format an array as comma-separated list
 * @param value - Array value
 * @param emptyLabel - Label when array is empty
 * @returns Formatted list string
 */
export function formatList(value: unknown, emptyLabel = 'None'): string {
  if (!value) return emptyLabel;
  if (!Array.isArray(value)) return String(value);
  if (value.length === 0) return emptyLabel;

  return value.join(', ');
}

/**
 * Format a phone number
 * @param value - Phone number string
 * @returns Formatted phone number
 */
export function formatPhoneNumber(value: unknown): string {
  if (!value) return 'N/A';

  const phoneStr = String(value).replace(/\D/g, '');

  if (phoneStr.length === 10) {
    return `(${phoneStr.slice(0, 3)}) ${phoneStr.slice(3, 6)}-${phoneStr.slice(6)}`;
  }

  return String(value);
}

/**
 * Truncate long text
 * @param value - Text value
 * @param maxLength - Maximum length (default: 50)
 * @returns Truncated text with ellipsis
 */
export function formatTruncate(value: unknown, maxLength = 50): string {
  if (!value) return '';

  const text = String(value);
  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength) + '...';
}

/**
 * Format percentage
 * @param value - Numeric value (0-100 or 0-1)
 * @param asDecimal - If true, treats value as 0-1 (default: false treats as 0-100)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: unknown, asDecimal = false): string {
  if (value === null || value === undefined) return 'N/A';

  const numValue = typeof value === 'number' ? value : parseFloat(String(value));

  if (isNaN(numValue)) {
    return 'Invalid Percentage';
  }

  const percentage = asDecimal ? numValue * 100 : numValue;
  return `${percentage.toFixed(2)}%`;
}
