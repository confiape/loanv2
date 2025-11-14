import { computed, Signal } from '@angular/core';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ModalTestIds {
  // Main dialog element (no suffix - this is the primary test ID)
  dialog: Signal<string | null>;
  // Internal elements (with suffixes)
  overlay: Signal<string | null>;
  container: Signal<string | null>;
  content: Signal<string | null>;
  header: Signal<string | null>;
  closeButton: Signal<string | null>;
  body: Signal<string | null>;
  footer: Signal<string | null>;
}

export function generateModalTestIds(hostTestId: string | null): ModalTestIds {
  return {
    // Primary test ID without suffix (for role="dialog" element)
    dialog: computed(() => hostTestId),
    // Internal elements with suffixes
    overlay: computed(() => (hostTestId ? `${hostTestId}-overlay` : null)),
    container: computed(() => (hostTestId ? `${hostTestId}-container` : null)),
    content: computed(() => (hostTestId ? `${hostTestId}-content` : null)),
    header: computed(() => (hostTestId ? `${hostTestId}-header` : null)),
    closeButton: computed(() => (hostTestId ? `${hostTestId}-close-btn` : null)),
    body: computed(() => (hostTestId ? `${hostTestId}-body` : null)),
    footer: computed(() => (hostTestId ? `${hostTestId}-footer` : null)),
  };
}

export function getModalSizeClasses(size: ModalSize): string {
  const sizeMap: Record<ModalSize, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return sizeMap[size];
}
