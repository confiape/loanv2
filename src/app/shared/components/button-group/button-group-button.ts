import {
  Component,
  input,
  output,
  computed,
  inject,
  ChangeDetectionStrategy,
  HostAttributeToken,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonGroupPosition, ButtonGroupVariant } from './button-group-helpers';

const DATA_TESTID = new HostAttributeToken('data-testid');

@Component({
  selector: 'app-button-group-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [class]="buttonClasses()"
      [attr.data-testid]="buttonTestId()"
      (click)="handleClick($event)"
    >
      <ng-content />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block',
  },
})
export class ButtonGroupButton {
  private readonly hostTestId = inject(DATA_TESTID, { optional: true });

  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input<boolean>(false);
  readonly position = input<ButtonGroupPosition>('middle');
  readonly variant = input<ButtonGroupVariant>('default');

  readonly buttonClick = output<MouseEvent>();

  protected readonly buttonTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-button` : null
  );

  protected readonly buttonClasses = computed(() => {
    const position = this.position();
    const variant = this.variant();
    const disabled = this.disabled();

    let classes =
      'px-4 py-2 text-sm font-medium transition-colors focus:z-10 focus:ring-2 focus:outline-none';

    // Variant styles
    if (variant === 'outline') {
      classes +=
        ' bg-transparent border-text-primary text-text-primary hover:bg-text-primary hover:text-bg-primary';
      classes += ' focus:ring-text-secondary focus:bg-text-primary focus:text-bg-primary';
    } else {
      // default variant
      classes += ' bg-bg-primary border-border text-text-primary hover:bg-bg-secondary hover:text-accent';
      classes += ' focus:ring-accent focus:text-accent';
    }

    // Position-based borders and rounding
    if (position === 'first' || position === 'only') {
      classes += ' rounded-s-lg border';
    } else {
      classes += ' border-t border-b';
    }

    if (position === 'last' || position === 'only') {
      classes += ' rounded-e-lg border';
    }

    if (position === 'middle') {
      classes += ' border-e-0';
    }

    if (position === 'first') {
      classes += ' border-e-0';
    }

    // Disabled state
    if (disabled) {
      classes += ' opacity-50 cursor-not-allowed';
    }

    return classes;
  });

  protected handleClick(event: MouseEvent): void {
    if (!this.disabled()) {
      this.buttonClick.emit(event);
    }
  }
}
