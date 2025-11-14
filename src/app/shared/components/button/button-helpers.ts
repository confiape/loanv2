import { Signal, computed } from '@angular/core';

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'gradient';
export type ButtonTone =
  | 'primary'
  | 'neutral'
  | 'dark'
  | 'light'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'purple'
  | 'teal'
  | 'cyan'
  | 'lime'
  | 'pink';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ButtonShape = 'rounded' | 'pill' | 'icon' | 'icon-circle';

interface ButtonClassConfig {
  variant: ButtonVariant;
  tone: ButtonTone;
  size: ButtonSize;
  shape: ButtonShape;
  fullWidth: boolean;
  loading: boolean;
}

const sizeMap: Record<ButtonSize, string> = {
  xs: 'px-3 py-1.5 text-[0.7rem]',
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
  xl: 'px-6 py-3.5 text-base',
};

const iconSizeMap: Record<ButtonSize, string> = {
  xs: 'p-1.5 text-xs',
  sm: 'p-2 text-sm',
  md: 'p-2.5 text-base',
  lg: 'p-3 text-base',
  xl: 'p-3.5 text-lg',
};

const solidToneClasses: Record<ButtonTone, string> = {
  primary: 'bg-accent text-white hover:bg-accent-hover focus-visible:ring-accent/40',
  neutral: 'bg-bg-secondary text-text-primary hover:bg-bg-primary focus-visible:ring-border/40',
  dark: 'bg-gray-900 text-white hover:bg-gray-800 focus-visible:ring-gray-500/40',
  light:
    'bg-bg-primary text-text-primary border border-border hover:bg-bg-secondary focus-visible:ring-border/40',
  success: 'bg-success text-white hover:opacity-90 focus-visible:ring-success/40',
  danger: 'bg-error text-white hover:opacity-90 focus-visible:ring-error/40',
  warning: 'bg-warning text-gray-900 hover:opacity-90 focus-visible:ring-warning/40',
  info: 'bg-sky-600 text-white hover:bg-sky-700 focus-visible:ring-sky-500/40',
  purple: 'bg-purple-600 text-white hover:bg-purple-700 focus-visible:ring-purple-500/40',
  teal: 'bg-teal-600 text-white hover:bg-teal-700 focus-visible:ring-teal-500/40',
  cyan: 'bg-cyan-600 text-white hover:bg-cyan-700 focus-visible:ring-cyan-500/40',
  lime: 'bg-lime-500 text-gray-900 hover:bg-lime-400 focus-visible:ring-lime-400/40',
  pink: 'bg-pink-600 text-white hover:bg-pink-700 focus-visible:ring-pink-500/40',
};

const outlineToneClasses: Record<ButtonTone, string> = {
  primary: 'border border-accent text-accent hover:bg-accent/10 focus-visible:ring-accent/30',
  neutral:
    'border border-border text-text-primary hover:bg-bg-secondary focus-visible:ring-border/30',
  dark: 'border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white focus-visible:ring-gray-500/30',
  light:
    'border border-border text-text-primary hover:bg-bg-secondary focus-visible:ring-border/30',
  success: 'border border-success text-success hover:bg-success/10 focus-visible:ring-success/30',
  danger: 'border border-error text-error hover:bg-error/10 focus-visible:ring-error/30',
  warning: 'border border-warning text-warning hover:bg-warning/10 focus-visible:ring-warning/30',
  info: 'border border-sky-600 text-sky-600 hover:bg-sky-600/10 focus-visible:ring-sky-500/30',
  purple:
    'border border-purple-600 text-purple-600 hover:bg-purple-600/10 focus-visible:ring-purple-500/30',
  teal: 'border border-teal-600 text-teal-600 hover:bg-teal-600/10 focus-visible:ring-teal-500/30',
  cyan: 'border border-cyan-600 text-cyan-600 hover:bg-cyan-600/10 focus-visible:ring-cyan-500/30',
  lime: 'border border-lime-500 text-lime-600 hover:bg-lime-500/10 focus-visible:ring-lime-400/30',
  pink: 'border border-pink-600 text-pink-600 hover:bg-pink-600/10 focus-visible:ring-pink-500/30',
};

const ghostToneClasses: Record<ButtonTone, string> = {
  primary: 'text-accent bg-transparent hover:bg-accent/10 focus-visible:ring-accent/20',
  neutral: 'text-text-primary bg-transparent hover:bg-bg-secondary focus-visible:ring-border/20',
  dark: 'text-gray-900 bg-transparent hover:bg-gray-900/10 focus-visible:ring-gray-500/20',
  light: 'text-text-primary bg-transparent hover:bg-bg-secondary focus-visible:ring-border/20',
  success: 'text-success bg-transparent hover:bg-success/10 focus-visible:ring-success/20',
  danger: 'text-error bg-transparent hover:bg-error/10 focus-visible:ring-error/20',
  warning: 'text-warning bg-transparent hover:bg-warning/10 focus-visible:ring-warning/20',
  info: 'text-sky-600 bg-transparent hover:bg-sky-600/10 focus-visible:ring-sky-500/20',
  purple: 'text-purple-600 bg-transparent hover:bg-purple-600/10 focus-visible:ring-purple-500/20',
  teal: 'text-teal-600 bg-transparent hover:bg-teal-600/10 focus-visible:ring-teal-500/20',
  cyan: 'text-cyan-600 bg-transparent hover:bg-cyan-600/10 focus-visible:ring-cyan-500/20',
  lime: 'text-lime-600 bg-transparent hover:bg-lime-500/10 focus-visible:ring-lime-400/20',
  pink: 'text-pink-600 bg-transparent hover:bg-pink-600/10 focus-visible:ring-pink-500/20',
};

const gradientToneClasses: Record<ButtonTone, string> = {
  primary:
    'text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 shadow-lg shadow-blue-500/40 focus-visible:ring-blue-500/40',
  neutral:
    'text-gray-900 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 shadow-lg shadow-gray-400/40 focus-visible:ring-gray-400/40',
  dark: 'text-white bg-gradient-to-r from-slate-800 via-slate-900 to-black shadow-lg shadow-gray-900/50 focus-visible:ring-gray-600/50',
  light:
    'text-gray-900 bg-gradient-to-r from-white via-gray-50 to-gray-200 shadow-lg shadow-gray-200/60 focus-visible:ring-gray-200/60',
  success:
    'text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 shadow-lg shadow-green-500/40 focus-visible:ring-green-400/40',
  danger:
    'text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 shadow-lg shadow-red-500/40 focus-visible:ring-red-400/40',
  warning:
    'text-white bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 shadow-lg shadow-yellow-500/50 focus-visible:ring-yellow-400/50',
  info: 'text-white bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 shadow-lg shadow-sky-500/40 focus-visible:ring-sky-400/40',
  purple:
    'text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 shadow-lg shadow-purple-500/40 focus-visible:ring-purple-400/40',
  teal: 'text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 shadow-lg shadow-teal-500/40 focus-visible:ring-teal-400/40',
  cyan: 'text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/40 focus-visible:ring-cyan-400/40',
  lime: 'text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 shadow-lg shadow-lime-400/40 focus-visible:ring-lime-300/40',
  pink: 'text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 shadow-lg shadow-pink-500/40 focus-visible:ring-pink-400/40',
};

const defaultVariantByTone: Record<ButtonVariant, Record<ButtonTone, string>> = {
  solid: solidToneClasses,
  outline: outlineToneClasses,
  ghost: ghostToneClasses,
  gradient: gradientToneClasses,
};

function resolveVariantToneClasses(variant: ButtonVariant, tone: ButtonTone): string {
  const map = defaultVariantByTone[variant];
  return map?.[tone] ?? solidToneClasses.primary;
}

function resolveSizeClasses(size: ButtonSize, shape: ButtonShape): string {
  if (shape === 'icon' || shape === 'icon-circle') {
    return `${iconSizeMap[size]} aspect-square`;
  }
  return sizeMap[size];
}

function resolveShapeClasses(shape: ButtonShape): string {
  if (shape === 'pill' || shape === 'icon-circle') {
    return 'rounded-full';
  }
  return 'rounded-lg';
}

export function getButtonClasses(config: ButtonClassConfig): string {
  const classes = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-semibold',
    'gap-2',
    'transition-[background,box-shadow,color]',
    'duration-200',
    'focus-visible:outline-none',
    'disabled:cursor-not-allowed',
    'disabled:opacity-60',
    'select-none',
  ];

  classes.push(resolveSizeClasses(config.size, config.shape));
  classes.push(resolveShapeClasses(config.shape));
  classes.push(resolveVariantToneClasses(config.variant, config.tone));

  if (config.fullWidth) {
    classes.push('w-full');
  }

  if (config.loading) {
    classes.push('cursor-progress');
  }

  return classes.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
}

export interface ButtonTestIds {
  button: Signal<string | null>;
  content: Signal<string | null>;
  spinner: Signal<string | null>;
}

export function generateButtonTestIds(hostTestId: string | null): ButtonTestIds {
  return {
    button: computed(() => (hostTestId ? `${hostTestId}-button` : null)),
    content: computed(() => (hostTestId ? `${hostTestId}-content` : null)),
    spinner: computed(() => (hostTestId ? `${hostTestId}-spinner` : null)),
  };
}
