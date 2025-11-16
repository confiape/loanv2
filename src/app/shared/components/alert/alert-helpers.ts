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
    info: 'heroInformationCircle',
    success: 'heroCheckCircle',
    error: 'heroXCircle',
    warning: 'heroExclamationTriangle',
    neutral: 'heroInformationCircle',
  };

  return iconMap[variant];
}
