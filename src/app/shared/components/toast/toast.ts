import { ChangeDetectionStrategy, Component, computed, effect, input, output } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  templateUrl: './toast.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  readonly toast = input.required<Toast>();
  readonly position = input<ToastPosition>('top-right');

  readonly dismissed = output<string>();

  readonly containerClasses = computed(() => {
    const type = this.toast().type;
    const baseClasses =
      'flex items-start gap-3 p-4 rounded-lg shadow-xl min-w-[300px] max-w-[400px] mb-3 border-l-4 animate-in slide-in-from-right fade-in duration-300';

    const typeClasses: Record<ToastType, string> = {
      success: 'bg-bg-success border-border-success',
      error: 'bg-bg-error border-border-error',
      warning: 'bg-bg-warning border-border-warning',
      info: 'bg-bg-info border-border-info',
    };

    return `${baseClasses} ${typeClasses[type]}`;
  });

  readonly iconClasses = computed(() => {
    const type = this.toast().type;
    const baseClasses = 'shrink-0 w-6 h-6 flex items-center justify-center font-bold text-xl';

    const typeClasses: Record<ToastType, string> = {
      success: 'text-success',
      error: 'text-error',
      warning: 'text-warning',
      info: 'text-accent',
    };

    return `${baseClasses} ${typeClasses[type]}`;
  });

  readonly icon = computed(() => {
    const icons: Record<ToastType, string> = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    };
    return icons[this.toast().type];
  });

  constructor() {
    effect(() => {
      const toastData = this.toast();
      if (toastData?.duration && toastData.duration > 0) {
        setTimeout(() => {
          this.dismiss();
        }, toastData.duration);
      }
    });
  }

  protected dismiss(): void {
    this.dismissed.emit(this.toast().id);
  }
}
