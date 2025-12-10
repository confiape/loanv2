import { computed, Signal } from '@angular/core';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';

export interface ModalTestIds {
  overlay: Signal<string | null>;
  content: Signal<string | null>;
  header: Signal<string | null>;
  closeButton: Signal<string | null>;
  body: Signal<string | null>;
  footer: Signal<string | null>;
}

export function generateModalTestIds(hostTestId: Signal<string | null>): ModalTestIds {
  return {
    overlay: computed(() => {
      const id = hostTestId();
      return id ? `${id}-overlay` : null;
    }),
    content: computed(() => {
      const id = hostTestId();
      return id ? `${id}` : null;
    }),
    header: computed(() => {
      const id = hostTestId();
      return id ? `${id}-header` : null;
    }),
    closeButton: computed(() => {
      const id = hostTestId();
      return id ? `${id}-close-btn` : null;
    }),
    body: computed(() => {
      const id = hostTestId();
      return id ? `${id}-body` : null;
    }),
    footer: computed(() => {
      const id = hostTestId();
      return id ? `${id}-footer` : null;
    }),
  };
}

export function getModalSizeClasses(size: ModalSize): string {
  const sizeMap: Record<ModalSize, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    full: 'max-w-7xl',
  };

  return sizeMap[size];
}
