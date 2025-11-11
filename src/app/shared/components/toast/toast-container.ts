import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ToastComponent, ToastPosition } from './toast';
import { ToastService } from '@loan/app/core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [ToastComponent],
  template: `
    <div [class]="containerClasses()">
      @for (toast of toastService.toasts$(); track toast.id) {
        <app-toast [toast]="toast" [position]="position()" (dismissed)="onDismiss($event)" />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastContainerComponent {
  protected readonly toastService = inject(ToastService);

  readonly position = input<ToastPosition>('top-right');

  readonly containerClasses = computed(() => {
    const baseClasses = 'fixed z-50 flex flex-col gap-2 pointer-events-none';
    const positionClasses = this.getPositionClasses();
    return `${baseClasses} ${positionClasses}`;
  });

  onDismiss(id: string): void {
    this.toastService.dismiss(id);
  }

  private getPositionClasses(): string {
    const positionMap: Record<ToastPosition, string> = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-center': 'top-4 left-1/2 -translate-x-1/2',
      'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    };
    return positionMap[this.position()];
  }
}
