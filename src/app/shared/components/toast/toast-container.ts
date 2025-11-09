import {
  ChangeDetectionStrategy,
  Component,
  ViewContainerRef,
  input,
  computed,
  viewChild,
} from '@angular/core';
import { ToastPosition, getContainerPositionClasses } from './toast-helpers';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  template: `
    <ng-container #toastOutlet></ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'containerClasses()',
    '[attr.aria-live]': '"polite"',
    '[attr.aria-atomic]': '"false"',
    role: 'region',
    'aria-label': 'Notifications',
  },
})
export class ToastContainerComponent {
  readonly viewContainerRef = viewChild('toastOutlet', { read: ViewContainerRef });

  readonly position = input<ToastPosition>('top-right');

  protected readonly containerClasses = computed(() => {
    const baseClasses = 'fixed z-[9999] flex flex-col gap-2 pointer-events-none';
    const positionClasses = getContainerPositionClasses(this.position());
    return `${baseClasses} ${positionClasses}`;
  });
}
