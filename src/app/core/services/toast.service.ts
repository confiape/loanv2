import { Injectable, signal } from '@angular/core';
import { Toast, ToastType } from '@loan/app/shared/components/toast/toast';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toasts = signal<Toast[]>([]);

  public readonly toasts$ = this.toasts.asReadonly();

  /**
   * Show a toast notification
   * @param type Type of toast (success, error, warning, info)
   * @param message Message to display
   * @param title Optional title
   * @param duration Duration in milliseconds (default: 3000 for error, 2000 for success)
   * @param dismissible Whether the toast can be manually dismissed (default: true)
   */
  show(
    type: ToastType,
    message: string,
    title?: string,
    duration?: number,
    dismissible = true,
  ): void {
    const id = this.generateId();
    const defaultDuration = type === 'error' ? 3000 : 2000;

    const toast: Toast = {
      id,
      type,
      message,
      title,
      duration: duration ?? defaultDuration,
      dismissible,
    };

    this.toasts.update((toasts) => [...toasts, toast]);
  }

  /**
   * Show a success toast
   */
  success(message: string, title?: string, duration?: number): void {
    this.show('success', message, title, duration);
  }

  /**
   * Show an error toast
   */
  error(message: string, title?: string, duration?: number): void {
    this.show('error', message, title, duration);
  }

  /**
   * Show a warning toast
   */
  warning(message: string, title?: string, duration?: number): void {
    this.show('warning', message, title, duration);
  }

  /**
   * Show an info toast
   */
  info(message: string, title?: string, duration?: number): void {
    this.show('info', message, title, duration);
  }

  /**
   * Dismiss a toast by ID
   */
  dismiss(id: string): void {
    this.toasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  /**
   * Clear all toasts
   */
  clear(): void {
    this.toasts.set([]);
  }

  /**
   * Generate a unique ID for toasts
   */
  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}
