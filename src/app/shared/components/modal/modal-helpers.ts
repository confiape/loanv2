import { computed, Signal } from '@angular/core';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ModalTestIds {
  overlay: Signal<string | null>;
  close: Signal<string | null>;
  header: Signal<string | null>;
}

export function generateModalTestIds(hostTestId: string | null): ModalTestIds {
  return {
    overlay: computed(() => (hostTestId ? `${hostTestId}-overlay` : null)),
    close: computed(() => (hostTestId ? `${hostTestId}-close` : null)),
    header: computed(() => (hostTestId ? `${hostTestId}-header` : null)),
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
