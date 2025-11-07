import { computed, Signal } from '@angular/core';

export type AlertVariant = 'info' | 'success' | 'error' | 'warning' | 'neutral';

export interface AlertTestIds {
  alert: Signal<string | null>;
  icon: Signal<string | null>;
  closeButton: Signal<string | null>;
  content: Signal<string | null>;
}

export function generateAlertTestIds(hostTestId: string | null): AlertTestIds {
  return {
    alert: computed(() => (hostTestId ? `${hostTestId}-alert` : null)),
    icon: computed(() => (hostTestId ? `${hostTestId}-icon` : null)),
    closeButton: computed(() => (hostTestId ? `${hostTestId}-close` : null)),
    content: computed(() => (hostTestId ? `${hostTestId}-content` : null)),
  };
}

export interface AlertClasses {
  container: string;
  text: string;
  border: string;
  icon: string;
}

export function getAlertClasses(variant: AlertVariant, withBorder: boolean): AlertClasses {
  const baseContainer = 'p-4 rounded-lg text-sm';
  const baseBorder = withBorder ? 'border' : '';

  const variantMap: Record<AlertVariant, AlertClasses> = {
    info: {
      container: `${baseContainer} bg-accent/10 ${baseBorder} border-accent/30`,
      text: 'text-accent',
      border: 'border-accent/30',
      icon: 'text-accent',
    },
    success: {
      container: `${baseContainer} bg-success/10 ${baseBorder} border-success/30`,
      text: 'text-success',
      border: 'border-success/30',
      icon: 'text-success',
    },
    error: {
      container: `${baseContainer} bg-error/10 ${baseBorder} border-error/30`,
      text: 'text-error',
      border: 'border-error/30',
      icon: 'text-error',
    },
    warning: {
      container: `${baseContainer} bg-warning/10 ${baseBorder} border-warning/30`,
      text: 'text-warning',
      border: 'border-warning/30',
      icon: 'text-warning',
    },
    neutral: {
      container: `${baseContainer} bg-bg-secondary ${baseBorder} border-border`,
      text: 'text-text-primary',
      border: 'border-border',
      icon: 'text-text-secondary',
    },
  };

  return variantMap[variant];
}

export function getAlertIcon(variant: AlertVariant): string {
  const iconMap: Record<AlertVariant, string> = {
    info: `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
    </svg>`,
    success: `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
    </svg>`,
    error: `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
    </svg>`,
    warning: `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"/>
    </svg>`,
    neutral: `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
    </svg>`,
  };

  return iconMap[variant];
}
