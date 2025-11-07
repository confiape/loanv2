import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonGroupVariant } from './button-group-helpers';

@Component({
  selector: 'app-button-group',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [class]="containerClasses()"
      role="group"
      [attr.aria-label]="ariaLabel()"
    >
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block',
  },
})
export class ButtonGroup {
  readonly variant = input<ButtonGroupVariant>('default');
  readonly ariaLabel = input<string>('Button group');

  protected readonly containerClasses = computed(() => {
    const base = 'inline-flex rounded-md shadow-sm';
    return base;
  });
}
