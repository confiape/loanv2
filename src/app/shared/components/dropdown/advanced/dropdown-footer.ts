import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { DropdownFooterAction } from './dropdown.types';
import { DropdownIcon } from './dropdown-icon';

@Component({
  selector: 'app-dropdown-footer',
  standalone: true,
  imports: [DropdownIcon],
  template: `
    @if (action()) {
      <div class="border-t border-border bg-bg-secondary">
        <a
          class="flex items-center gap-2 px-4 py-3 text-sm font-medium"
          [class.text-accent]="action()!.intent === 'accent'"
          [class.text-error]="action()!.intent === 'danger'"
          [class.text-text-primary]="action()!.intent === 'default' || !action()!.intent"
          [href]="action()!.href || '#'"
          (click)="onClick($event)"
        >
          @if (action()!.icon) {
            <app-dropdown-icon [name]="action()!.icon!" [classes]="iconClass()" />
          }
          <span>{{ action()!.label }}</span>
        </a>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownFooterComponent {
  readonly action = input<DropdownFooterAction | null>(null);
  readonly footerClick = output<MouseEvent>();

  readonly iconClass = computed(() => {
    const action = this.action();
    if (!action) return 'text-text-primary';

    if (action.intent === 'accent') {
      return 'text-accent';
    }
    if (action.intent === 'danger') {
      return 'text-error';
    }
    return 'text-text-primary';
  });

  onClick(event: MouseEvent): void {
    const action = this.action();
    if (action && !action.href) {
      event.preventDefault();
    }
    this.footerClick.emit(event);
  }
}
