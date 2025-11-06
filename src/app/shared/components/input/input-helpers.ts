/**
 * Shared helper functions for Input and InputNumber components
 */

import { computed, Signal } from '@angular/core';

export type InputSize = 'small' | 'default' | 'large';
export type ValidationState = 'none' | 'success' | 'error';

/**
 * Generates CSS classes for input labels based on validation state
 */
export function getLabelClasses(validationState: ValidationState): string {
  const baseClasses = 'block mb-2 text-sm font-medium';

  if (validationState === 'success') {
    return `${baseClasses} text-success`;
  }
  if (validationState === 'error') {
    return `${baseClasses} text-error`;
  }
  return `${baseClasses} text-text-primary`;
}

/**
 * Generates CSS classes for input elements based on size, state, and modifiers
 */
export function getInputClasses(
  size: InputSize,
  validationState: ValidationState,
  disabled: boolean,
  hasPrefix: boolean,
  hasSuffix: boolean,
  hasSuffixButton: boolean = false
): string {
  // Base classes
  let classes = 'block w-full border rounded-lg focus:ring-1 focus:outline-none transition-colors';

  // Size variants
  if (size === 'small') {
    classes += ' p-2 text-xs';
  } else if (size === 'large') {
    classes += ' p-4 text-base';
  } else {
    classes += ' p-2.5 text-sm';
  }

  // Padding for icons/buttons
  if (hasPrefix) {
    classes += ' ps-10';
  }
  if (hasSuffix && !hasSuffixButton) {
    classes += ' pe-10';
  }
  if (hasSuffixButton) {
    classes += ' pe-24';
  }

  // Validation state colors
  if (validationState === 'success') {
    classes += ' bg-bg-success-light border-success text-success placeholder-success';
    classes += ' focus:ring-success focus:border-success';
  } else if (validationState === 'error') {
    classes += ' bg-bg-error-light border-error text-error placeholder-error';
    classes += ' focus:ring-error focus:border-error';
  } else if (disabled) {
    classes += ' bg-bg-disabled border-border text-text-secondary cursor-not-allowed';
  } else {
    classes += ' bg-bg-secondary border-border text-text-primary placeholder-text-secondary';
    classes += ' focus:ring-accent focus:border-accent';
  }

  return classes;
}

/**
 * Generates CSS classes for suffix buttons based on size
 */
export function getSuffixButtonClasses(size: InputSize): string {
  let classes = 'text-text-primary absolute end-2.5 bg-accent hover:bg-accent-hover';
  classes += ' focus:ring-4 focus:outline-none focus:ring-accent/30 font-medium rounded-lg';

  if (size === 'small') {
    classes += ' bottom-1.5 text-xs px-3 py-1.5';
  } else if (size === 'large') {
    classes += ' bottom-3 text-sm px-4 py-2.5';
  } else {
    classes += ' bottom-2 text-sm px-4 py-2';
  }

  return classes;
}

/**
 * Generates test IDs for input components
 */
export interface InputTestIds {
  wrapper: Signal<string | null>;
  label: Signal<string | null>;
  input: Signal<string | null>;
  prefixIcon: Signal<string | null>;
  suffixIcon: Signal<string | null>;
  suffixButton: Signal<string | null>;
  helpText: Signal<string | null>;
  successMessage: Signal<string | null>;
  errorMessage: Signal<string | null>;
}

export function generateInputTestIds(hostTestId: string | null): InputTestIds {
  return {
    wrapper: computed(() => (hostTestId ? `${hostTestId}-wrapper` : null)),
    label: computed(() => (hostTestId ? `${hostTestId}-label` : null)),
    input: computed(() => (hostTestId ? `${hostTestId}-input` : null)),
    prefixIcon: computed(() => (hostTestId ? `${hostTestId}-prefix-icon` : null)),
    suffixIcon: computed(() => (hostTestId ? `${hostTestId}-suffix-icon` : null)),
    suffixButton: computed(() => (hostTestId ? `${hostTestId}-button` : null)),
    helpText: computed(() => (hostTestId ? `${hostTestId}-help-text` : null)),
    successMessage: computed(() => (hostTestId ? `${hostTestId}-success-message` : null)),
    errorMessage: computed(() => (hostTestId ? `${hostTestId}-error-message` : null)),
  };
}
