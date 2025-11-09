import { computed, Signal } from '@angular/core';

export type ToastVariant = 'info' | 'success' | 'error' | 'warning';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
}

export interface ToastConfig {
  variant?: ToastVariant;
  title?: string;
  message: string;
  duration?: number; // milliseconds, 0 = no auto-dismiss
  dismissible?: boolean;
  position?: ToastPosition;
  showIcon?: boolean;
}

export interface ToastTestIds {
  toast: Signal<string | null>;
  icon: Signal<string | null>;
  closeButton: Signal<string | null>;
  content: Signal<string | null>;
}

export function generateToastTestIds(toastId: string): ToastTestIds {
  return {
    toast: computed(() => `toast-${toastId}`),
    icon: computed(() => `toast-${toastId}-icon`),
    closeButton: computed(() => `toast-${toastId}-close`),
    content: computed(() => `toast-${toastId}-content`),
  };
}

export interface ToastClasses {
  container: string;
  text: string;
  icon: string;
}

export function getToastClasses(variant: ToastVariant): ToastClasses {
  const baseContainer = 'flex items-center w-full max-w-xs p-4 rounded-lg shadow-lg border pointer-events-auto';

  const variantMap: Record<ToastVariant, ToastClasses> = {
    info: {
      container: `${baseContainer} bg-bg-info border-border-info`,
      text: 'text-text-info',
      icon: 'text-text-info',
    },
    success: {
      container: `${baseContainer} bg-bg-success border-border-success`,
      text: 'text-text-success',
      icon: 'text-text-success',
    },
    error: {
      container: `${baseContainer} bg-bg-error border-border-error`,
      text: 'text-text-error',
      icon: 'text-text-error',
    },
    warning: {
      container: `${baseContainer} bg-bg-warning border-border-warning`,
      text: 'text-text-warning',
      icon: 'text-text-warning',
    },
  };

  return variantMap[variant];
}

export function getToastIcon(variant: ToastVariant): string {
  const iconMap: Record<ToastVariant, string> = {
    info: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
    </svg>`,
    success: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
    </svg>`,
    error: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
    </svg>`,
    warning: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"/>
    </svg>`,
  };

  return iconMap[variant];
}

export function getContainerPositionClasses(position: ToastPosition): string {
  const positionMap: Record<ToastPosition, string> = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return positionMap[position];
}
