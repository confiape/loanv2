import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { DropdownIconName, DropdownTriggerConfig } from './dropdown.types';
import { DropdownIcon } from './dropdown-icon';

@Component({
  selector: 'app-dropdown-trigger',
  standalone: true,
  imports: [DropdownIcon],
  template: `
    <button
      type="button"
      [attr.data-testid]="testId()"
      [attr.aria-expanded]="isOpen()"
      [attr.aria-label]="config().ariaLabel || config().label"
      [attr.aria-haspopup]="true"
      [class]="triggerClasses()"
      (click)="triggerClick.emit($event)"
      (keydown)="triggerKeydown.emit($event)"
    >
      <span class="flex items-center gap-2 truncate">
        @if (config().leadingIcon) {
          <span class="flex items-center justify-center">
            <app-dropdown-icon [name]="config().leadingIcon!" [classes]="iconClass()" />
          </span>
        }
        @if (config().label) {
          <span class="truncate">{{ config().label }}</span>
        }
        @if (config().trailingIcon ?? fallbackTrailingIcon()) {
          <span class="flex items-center justify-center">
            <app-dropdown-icon
              [name]="config().trailingIcon ?? fallbackTrailingIcon()!"
              [classes]="iconClass()"
            />
          </span>
        }
      </span>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownTriggerComponent {
  readonly config = input.required<DropdownTriggerConfig>();
  readonly isOpen = input<boolean>(false);
  readonly testId = input<string | null>(null);

  readonly triggerClick = output<MouseEvent>();
  readonly triggerKeydown = output<KeyboardEvent>();

  readonly fallbackTrailingIcon = computed<DropdownIconName | null>(() => {
    if (this.config().variant === 'icon') {
      return null;
    }
    return 'chevron-down';
  });

  readonly triggerClasses = computed(() => {
    const config = this.config();
    const base =
      'inline-flex items-center justify-center gap-2 rounded-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';
    const size = config.size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-sm';

    const shape =
      config.shape === 'pill'
        ? 'rounded-full'
        : config.shape === 'circle'
          ? 'rounded-full px-0'
          : 'rounded-md';

    let variant = '';
    switch (config.variant) {
      case 'soft':
        variant = 'bg-bg-secondary text-text-primary hover:bg-bg-surface';
        break;
      case 'ghost':
        variant = 'bg-transparent text-text-primary hover:bg-bg-secondary';
        break;
      case 'icon':
        variant = 'h-10 w-10 rounded-full bg-bg-secondary text-text-primary hover:bg-bg-surface';
        break;
      default:
        variant = 'bg-accent text-white hover:bg-accent-hover';
        break;
    }

    const width = config.fullWidth ? 'w-full' : '';

    return [base, size, shape, variant, width].filter(Boolean).join(' ');
  });

  readonly iconClass = computed(() => {
    const variant = this.config().variant ?? 'solid';
    if (variant === 'solid') {
      return 'text-white';
    }
    if (variant === 'soft' || variant === 'icon' || variant === 'ghost') {
      return 'text-text-primary';
    }
    return 'text-text-secondary';
  });
}
