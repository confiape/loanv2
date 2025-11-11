import { Injectable, inject, Type } from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Modal, ModalData } from './modal';
import { ModalSize } from './modal-helpers';

export interface ModalConfig<TData = unknown> {
  size?: ModalSize;
  dismissible?: boolean;
  data?: TData;
  testId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private readonly dialog = inject(Dialog);

  /**
   * Opens a modal with a custom component
   */
  open<TResult = unknown, TData = unknown>(
    component: Type<unknown>,
    config?: ModalConfig<TData>,
  ): DialogRef<TResult, unknown> {
    const dialogConfig = {
      data: config?.data,
      panelClass: 'modal-panel',
      hasBackdrop: false, // We handle backdrop manually for better control
      disableClose: !(config?.dismissible ?? true),
    };

    return this.dialog.open(component, dialogConfig) as DialogRef<TResult, unknown>;
  }

  /**
   * Opens a simple modal with title and content
   */
  openSimple<TResult = unknown>(
    config: ModalConfig<ModalData> & {
      title: string;
      content?: string;
    },
  ): DialogRef<TResult, unknown> {
    const modalData: ModalData = {
      title: config.title,
      content: config.content,
      showCloseButton: true,
      testId: config.testId,
    };

    const dialogConfig = {
      data: modalData,
      panelClass: 'modal-panel',
      hasBackdrop: false,
      disableClose: !(config?.dismissible ?? true),
    };

    return this.dialog.open(Modal, dialogConfig) as DialogRef<TResult, unknown>;
  }

  /**
   * Closes all open modals
   */
  closeAll(): void {
    this.dialog.closeAll();
  }
}
