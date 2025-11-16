import {
  Component,
  input,
  output,
  signal,
  computed,
  ChangeDetectionStrategy,
  forwardRef,
  effect,
  inject,
  HostAttributeToken,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputSize, ValidationState } from '../input/input-helpers';

const DATA_TESTID = new HostAttributeToken('data-testid');

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full" [attr.data-testid]="wrapperTestId()">
      <div class="flex items-start">
        <div class="flex items-center h-5">
          <input
            [id]="checkboxId()"
            type="checkbox"
            [checked]="value()"
            [disabled]="isDisabled()"
            [attr.aria-label]="ariaLabel()"
            [attr.aria-describedby]="helpTextId()"
            [attr.aria-invalid]="validationState() === 'error'"
            [attr.data-testid]="checkboxTestId()"
            [class]="checkboxClasses()"
            (change)="onChange($event)"
            (blur)="onTouched()"
          />
        </div>
        @if (label()) {
          <div class="ms-2">
            <label
              [for]="checkboxId()"
              [class]="labelClasses()"
              [attr.data-testid]="labelTestId()"
            >
              {{ label() }}
            </label>
            @if (helpText() && validationState() === 'none') {
              <p
                [id]="helpTextId()"
                class="text-xs text-text-secondary"
                [attr.data-testid]="helpTextTestId()"
              >
                {{ helpText() }}
              </p>
            }
          </div>
        }
      </div>

      <!-- Success Message -->
      @if (successMessage() && validationState() === 'success') {
        <p
          [id]="helpTextId()"
          class="mt-2 text-sm text-success"
          [attr.data-testid]="successMessageTestId()"
        >
          <span class="font-medium">{{ successMessage() }}</span>
        </p>
      }

      <!-- Error Message -->
      @if (errorMessage() && validationState() === 'error') {
        <p
          [id]="helpTextId()"
          class="mt-2 text-sm text-error"
          [attr.data-testid]="errorMessageTestId()"
        >
          <span class="font-medium">{{ errorMessage() }}</span>
        </p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Checkbox),
      multi: true,
    },
  ],
  host: {
    class: 'block',
  },
})
export class Checkbox implements ControlValueAccessor {
  private readonly hostTestId = inject(DATA_TESTID, { optional: true });

  // Input properties
  readonly label = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly size = input<InputSize>('default');
  readonly validationState = input<ValidationState>('none');
  readonly helpText = input<string>('');
  readonly successMessage = input<string>('');
  readonly errorMessage = input<string>('');
  readonly ariaLabel = input<string>('');
  readonly checkboxId = input<string>(`checkbox-${Math.random().toString(36).substring(2, 9)}`);

  // Output events
  readonly valueChange = output<boolean>();

  // Internal state
  readonly value = signal<boolean>(false);
  private readonly controlDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.controlDisabled());

  // ControlValueAccessor callbacks
  private onChangeCallback: (value: boolean) => void = () => undefined;
  protected onTouched: () => void = () => undefined;

  // Test IDs
  readonly wrapperTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-wrapper` : null,
  );
  readonly checkboxTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-checkbox` : null,
  );
  readonly labelTestId = computed(() => (this.hostTestId ? `${this.hostTestId}-label` : null));
  readonly helpTextTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-help-text` : null,
  );
  readonly successMessageTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-success-message` : null,
  );
  readonly errorMessageTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-error-message` : null,
  );

  // Computed classes
  readonly labelClasses = computed(() => {
    const state = this.validationState();
    const disabled = this.isDisabled();

    let classes = 'text-sm font-medium';

    if (state === 'success') {
      classes += ' text-success';
    } else if (state === 'error') {
      classes += ' text-error';
    } else if (disabled) {
      classes += ' text-text-secondary cursor-not-allowed';
    } else {
      classes += ' text-text-primary cursor-pointer';
    }

    return classes;
  });

  readonly checkboxClasses = computed(() => {
    const size = this.size();
    const state = this.validationState();
    const disabled = this.isDisabled();

    // Base classes
    let classes =
      'text-accent bg-bg-secondary border-border rounded-sm focus:ring-2 focus:ring-accent focus:outline-none transition-colors';

    // Size variants
    if (size === 'small') {
      classes += ' w-3 h-3';
    } else if (size === 'large') {
      classes += ' w-5 h-5';
    } else {
      classes += ' w-4 h-4';
    }

    // Validation state colors
    if (state === 'success') {
      classes += ' border-success focus:ring-success';
    } else if (state === 'error') {
      classes += ' border-error focus:ring-error';
    }

    // Disabled state
    if (disabled) {
      classes += ' opacity-50 cursor-not-allowed';
    } else {
      classes += ' cursor-pointer';
    }

    return classes;
  });

  readonly helpTextId = computed(() => `${this.checkboxId()}-help`);

  constructor() {
    // Sync disabled state changes
    effect(() => {
      const isDisabled = this.isDisabled();
      if (isDisabled) {
        this.onTouched();
      }
    });
  }

  // ControlValueAccessor implementation
  writeValue(value: boolean): void {
    this.value.set(value || false);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.controlDisabled.set(isDisabled);
  }

  // Event handlers
  protected onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newValue = target.checked;
    this.value.set(newValue);
    this.onChangeCallback(newValue);
    this.valueChange.emit(newValue);
  }
}
