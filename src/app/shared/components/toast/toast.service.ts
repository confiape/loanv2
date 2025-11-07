import { Injectable, ComponentRef, inject } from '@angular/core';
import { Toast } from './toast';
import { ToastContainer } from './toast-container';
import { ToastConfig, ToastVariant } from './toast-helpers';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private container?: ToastContainer;
  private toasts: ComponentRef<Toast>[] = [];

  /**
   * Register the toast container component
   * Should be called once in the app, typically in the root component
   */
  setContainer(container: ToastContainer): void {
    this.container = container;
  }

  /**
   * Show a toast notification
   */
  show(config: ToastConfig): ComponentRef<Toast> {
    if (!this.container) {
      console.error('ToastContainer not registered. Add <app-toast-container/> to your app.');
      throw new Error('ToastContainer not registered');
    }

    const viewContainerRef = this.container.viewContainerRef();
    if (!viewContainerRef) {
      console.error('ViewContainerRef not available yet');
      throw new Error('ViewContainerRef not available');
    }

    const toastRef = viewContainerRef.createComponent(Toast);

    // Configure the toast
    toastRef.setInput('variant', config.variant ?? 'info');
    toastRef.setInput('title', config.title ?? '');
    toastRef.setInput('message', config.message);
    toastRef.setInput('duration', config.duration ?? 3000);
    toastRef.setInput('dismissible', config.dismissible ?? true);
    toastRef.setInput('showIcon', config.showIcon ?? true);

    // Handle close event
    toastRef.instance.closed.subscribe(() => {
      this.remove(toastRef);
    });

    // Track the toast
    this.toasts.push(toastRef);

    return toastRef;
  }

  /**
   * Convenience method for info toast
   */
  info(message: string, title?: string, duration?: number): ComponentRef<Toast> {
    return this.show({
      variant: 'info',
      message,
      title,
      duration,
    });
  }

  /**
   * Convenience method for success toast
   */
  success(message: string, title?: string, duration?: number): ComponentRef<Toast> {
    return this.show({
      variant: 'success',
      message,
      title,
      duration,
    });
  }

  /**
   * Convenience method for error toast
   */
  error(message: string, title?: string, duration?: number): ComponentRef<Toast> {
    return this.show({
      variant: 'error',
      message,
      title,
      duration: duration ?? 5000, // Errors stay longer by default
    });
  }

  /**
   * Convenience method for warning toast
   */
  warning(message: string, title?: string, duration?: number): ComponentRef<Toast> {
    return this.show({
      variant: 'warning',
      message,
      title,
      duration,
    });
  }

  /**
   * Remove a specific toast
   */
  private remove(toastRef: ComponentRef<Toast>): void {
    const index = this.toasts.indexOf(toastRef);
    if (index > -1) {
      this.toasts.splice(index, 1);
      toastRef.destroy();
    }
  }

  /**
   * Remove all toasts
   */
  clear(): void {
    this.toasts.forEach((toast) => toast.destroy());
    this.toasts = [];
  }
}
