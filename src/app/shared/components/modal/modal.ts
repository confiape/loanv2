import {
  ChangeDetectionStrategy,
  Component,
  HostAttributeToken,
  computed,
  inject,
  input,
} from '@angular/core';
import { DialogModule, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { ModalSize, generateModalTestIds, getModalSizeClasses } from './modal-helpers';

const DATA_TESTID = new HostAttributeToken('data-testid');

export interface ModalData {
  title?: string;
  content?: string;
  showCloseButton?: boolean;
  testId?: string;
}

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [DialogModule],
  template: `
    <button
      type="button"
      [attr.data-testid]="overlayTestId()"
      class="fixed inset-0 z-40 bg-overlay"
      aria-label="Dismiss modal backdrop"
      (click)="handleBackdropClick()"
      (keydown.enter)="handleBackdropKeydown($event)"
      (keydown.space)="handleBackdropKeydown($event)"
    ></button>
    <div
      class="pointer-events-none overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-full max-h-full p-4"
    >
      <div
        [class]="modalClasses()"
        class="pointer-events-auto"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="data?.title ? 'modal-title' : null"
      >
        <ng-content />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Modal {
  private readonly hostTestId = inject(DATA_TESTID, { optional: true });
  readonly dialogRef = inject(DialogRef<unknown>, { optional: true });
  readonly data = inject<ModalData>(DIALOG_DATA, { optional: true });

  readonly size = input<ModalSize>('2xl');
  readonly dismissible = input<boolean>(true);

  private readonly testIds = generateModalTestIds(this.hostTestId ?? this.data?.testId ?? null);
  readonly overlayTestId = this.testIds.overlay;

  readonly modalClasses = computed(() => {
    const baseClasses = 'relative w-full max-h-full bg-bg-primary rounded-lg shadow-sm';
    const sizeClasses = getModalSizeClasses(this.size());

    return `${baseClasses} ${sizeClasses}`;
  });

  protected handleBackdropClick(): void {
    if (this.dismissible() && this.dialogRef) {
      this.dialogRef.close();
    }
  }

  protected handleBackdropKeydown(event: Event): void {
    event.preventDefault();
    this.handleBackdropClick();
  }

  close(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
