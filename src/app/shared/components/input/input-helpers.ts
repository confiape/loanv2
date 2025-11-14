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
  hasSuffixButton = false,
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
    classes += ' bg-bg-success border-success text-success placeholder-success';
    classes += ' focus:ring-success focus:border-success';
  } else if (validationState === 'error') {
    classes += ' bg-bg-error border-error text-error placeholder-error';
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
export function getSuffixButtonClasses(size: InputSize, iconOnly = false): string {
  let classes = 'absolute end-2.5 focus:outline-none transition-colors';

  if (iconOnly) {
    classes +=
      ' bg-bg-secondary hover:bg-bg-tertiary border border-border rounded-full text-text-primary flex items-center justify-center focus:ring-2 focus:ring-accent/30';
    if (size === 'small') {
      classes += ' top-1/2 -translate-y-1/2 h-8 w-8';
    } else if (size === 'large') {
      classes += ' top-1/2 -translate-y-1/2 h-10 w-10';
    } else {
      classes += ' top-1/2 -translate-y-1/2 h-9 w-9';
    }
    return classes;
  }

  classes +=
    ' text-bg-primary bg-accent hover:bg-accent-hover focus:ring-4 focus:ring-accent/30 font-medium rounded-lg';

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
  label: Signal<string | null>;
  input: Signal<string | null>;
  prefixIcon: Signal<string | null>;
  suffixIcon: Signal<string | null>;
  suffixButton: Signal<string | null>;
  helpText: Signal<string | null>;
  successMessage: Signal<string | null>;
  errorMessage: Signal<string | null>;
}

type HostTestIdSource = string | null | (() => string | null);

function resolveHostTestId(source: HostTestIdSource): () => string | null {
  if (typeof source === 'function') {
    return source;
  }
  return () => source;
}

export function generateInputTestIds(hostTestId: HostTestIdSource): InputTestIds {
  const getHostTestId = resolveHostTestId(hostTestId);
  return {
    label: computed(() => {
      const id = getHostTestId();
      return id ? `${id}-label` : null;
    }),
    input: computed(() => {
      const id = getHostTestId();
      return id ? `${id}-input` : null;
    }),
    prefixIcon: computed(() => {
      const id = getHostTestId();
      return id ? `${id}-prefix-icon` : null;
    }),
    suffixIcon: computed(() => {
      const id = getHostTestId();
      return id ? `${id}-suffix-icon` : null;
    }),
    suffixButton: computed(() => {
      const id = getHostTestId();
      return id ? `${id}-button` : null;
    }),
    helpText: computed(() => {
      const id = getHostTestId();
      return id ? `${id}-help-text` : null;
    }),
    successMessage: computed(() => {
      const id = getHostTestId();
      return id ? `${id}-success-message` : null;
    }),
    errorMessage: computed(() => {
      const id = getHostTestId();
      return id ? `${id}-error-message` : null;
    }),
  };
}
