import { computed, Signal } from '@angular/core';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ModalTestIds {
  overlay: Signal<string | null>;
  container: Signal<string | null>;
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
    container: computed(() => hostTestId()),
    content: computed(() => {
      const id = hostTestId();
      return id ? `${id}-content` : null;
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
  };

  return sizeMap[size];
}
