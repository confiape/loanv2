import {
  ChangeDetectionStrategy,
  Component,
  HostAttributeToken,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonShape,
  ButtonSize,
  ButtonTone,
  ButtonVariant,
  generateButtonTestIds,
  getButtonClasses,
} from './button-helpers';

const DATA_TESTID = new HostAttributeToken('data-testid');

export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [attr.type]="type()"
      [disabled]="disabled() || loading()"
      [attr.aria-label]="ariaLabel() || null"
      [attr.aria-busy]="loading()"
      [attr.data-testid]="buttonTestId()"
      [class]="buttonClasses()"
      (click)="handleClick($event)"
    >
      @if (loading()) {
        <span
          class="inline-flex items-center gap-2"
          [attr.data-testid]="spinnerTestId()"
          aria-live="polite"
        >
          <svg
            class="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z"
            ></path>
          </svg>
          @if (loadingText()) {
            <span>{{ loadingText() }}</span>
          }
        </span>
      } @else {
        <span class="inline-flex items-center gap-2" [attr.data-testid]="contentTestId()">
          <ng-content />
        </span>
      }
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block',
  },
})
export class Button {
  private readonly hostTestId = inject(DATA_TESTID, { optional: true });

  readonly variant = input<ButtonVariant>('solid');
  readonly tone = input<ButtonTone>('primary');
  readonly size = input<ButtonSize>('md');
  readonly shape = input<ButtonShape>('rounded');
  readonly type = input<ButtonType>('button');
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly fullWidth = input<boolean>(false);
  readonly loadingText = input<string>('Loading...');
  readonly ariaLabel = input<string>('');

  readonly buttonClick = output<MouseEvent>();

  private readonly testIds = generateButtonTestIds(this.hostTestId);
  readonly buttonTestId = this.testIds.button;
  readonly contentTestId = this.testIds.content;
  readonly spinnerTestId = this.testIds.spinner;

  readonly buttonClasses = computed(() =>
    getButtonClasses({
      variant: this.variant(),
      tone: this.tone(),
      size: this.size(),
      shape: this.shape(),
      fullWidth: this.fullWidth(),
      loading: this.loading(),
    }),
  );

  protected handleClick(event: MouseEvent): void {
    if (this.disabled() || this.loading()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    this.buttonClick.emit(event);
  }
}
