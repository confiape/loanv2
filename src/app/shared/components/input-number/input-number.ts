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
import {
  InputSize,
  ValidationState,
  getLabelClasses,
  getInputClasses,
  generateInputTestIds,
} from '../input/input-helpers';

const DATA_TESTID = new HostAttributeToken('data-testid');

@Component({
  selector: 'app-input-number',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full" [attr.data-testid]="wrapperTestId()">
      <!-- Label -->
      @if (label()) {
        <label
          [for]="inputId()"
          [class]="labelClasses()"
          [attr.data-testid]="labelTestId()"
        >
          {{ label() }}
        </label>
      }

      <!-- Input Container -->
      <div class="relative">
        <!-- Prefix Icon -->
        @if (prefixIcon()) {
          <div
            class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
            [attr.data-testid]="prefixIconTestId()"
          >
            <svg
              class="w-4 h-4"
              [class.text-text-secondary]="validationState() === 'none'"
              [class.text-success]="validationState() === 'success'"
              [class.text-error]="validationState() === 'error'"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
              [innerHTML]="prefixIcon()"
            ></svg>
          </div>
        }

        <!-- Input -->
        <input
          [id]="inputId()"
          type="number"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [readonly]="readonly()"
          [min]="min()"
          [max]="max()"
          [step]="step()"
          [attr.aria-label]="ariaLabel()"
          [attr.aria-describedby]="helpTextId()"
          [attr.aria-invalid]="validationState() === 'error'"
          [attr.data-testid]="inputTestId()"
          [class]="inputClasses()"
          [value]="value()"
          (input)="onInput($event)"
          (blur)="onTouched()"
        />

        <!-- Increment/Decrement Buttons -->
        @if (showButtons()) {
          <div
            class="absolute inset-y-0 end-0 flex flex-col"
            [attr.data-testid]="buttonsContainerTestId()"
          >
            <button
              type="button"
              [attr.data-testid]="incrementButtonTestId()"
              [disabled]="disabled() || isMaxReached()"
              [class]="incrementButtonClasses()"
              (click)="increment()"
            >
              <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
              </svg>
            </button>
            <button
              type="button"
              [attr.data-testid]="decrementButtonTestId()"
              [disabled]="disabled() || isMinReached()"
              [class]="decrementButtonClasses()"
              (click)="decrement()"
            >
              <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
              </svg>
            </button>
          </div>
        }
      </div>

      <!-- Help Text -->
      @if (helpText() && validationState() === 'none') {
        <p
          [id]="helpTextId()"
          class="mt-2 text-sm text-text-secondary"
          [attr.data-testid]="helpTextTestId()"
        >
          {{ helpText() }}
        </p>
      }

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
      useExisting: forwardRef(() => InputNumber),
      multi: true,
    },
  ],
  host: {
    class: 'block',
  },
})
export class InputNumber implements ControlValueAccessor {
  // Test ID from host
  private readonly hostTestId = inject(DATA_TESTID, { optional: true });

  // Input properties
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly size = input<InputSize>('default');
  readonly validationState = input<ValidationState>('none');
  readonly helpText = input<string>('');
  readonly successMessage = input<string>('');
  readonly errorMessage = input<string>('');
  readonly ariaLabel = input<string>('');
  readonly inputId = input<string>(`input-number-${Math.random().toString(36).substring(2, 9)}`);

  // Number-specific properties
  readonly min = input<number | undefined>(undefined);
  readonly max = input<number | undefined>(undefined);
  readonly step = input<number>(1);
  readonly showButtons = input<boolean>(true);

  // Icon support
  readonly prefixIcon = input<string>('');

  // Output events
  readonly valueChange = output<number | null>();

  // Internal state
  readonly value = signal<number | null>(null);

  // ControlValueAccessor callbacks
  private onChange: (value: number | null) => void = () => {};
  protected onTouched: () => void = () => {};

  // Test IDs using helper
  private readonly testIds = generateInputTestIds(this.hostTestId);
  readonly wrapperTestId = this.testIds.wrapper;
  readonly labelTestId = this.testIds.label;
  readonly inputTestId = this.testIds.input;
  readonly prefixIconTestId = this.testIds.prefixIcon;
  readonly helpTextTestId = this.testIds.helpText;
  readonly successMessageTestId = this.testIds.successMessage;
  readonly errorMessageTestId = this.testIds.errorMessage;

  // Additional test IDs for buttons
  readonly buttonsContainerTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-buttons` : null
  );
  readonly incrementButtonTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-increment` : null
  );
  readonly decrementButtonTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-decrement` : null
  );

  // Computed classes using helpers
  readonly labelClasses = computed(() => getLabelClasses(this.validationState()));

  readonly inputClasses = computed(() => {
    const baseClasses = getInputClasses(
      this.size(),
      this.validationState(),
      this.disabled(),
      !!this.prefixIcon(),
      false,
      false
    );

    // Add padding for increment/decrement buttons if shown
    if (this.showButtons()) {
      return `${baseClasses} pe-12`;
    }

    return baseClasses;
  });

  readonly incrementButtonClasses = computed(() => {
    const baseClasses =
      'h-1/2 px-3 bg-bg-secondary border border-border hover:bg-bg-surface focus:ring-2 focus:outline-none focus:ring-accent transition-colors';
    const disabledClasses = 'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-bg-secondary';
    const roundedClasses = 'rounded-tr-lg';

    return `${baseClasses} ${disabledClasses} ${roundedClasses}`;
  });

  readonly decrementButtonClasses = computed(() => {
    const baseClasses =
      'h-1/2 px-3 bg-bg-secondary border border-t-0 border-border hover:bg-bg-surface focus:ring-2 focus:outline-none focus:ring-accent transition-colors';
    const disabledClasses = 'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-bg-secondary';
    const roundedClasses = 'rounded-br-lg';

    return `${baseClasses} ${disabledClasses} ${roundedClasses}`;
  });

  readonly helpTextId = computed(() => `${this.inputId()}-help`);

  readonly isMinReached = computed(() => {
    const currentValue = this.value();
    const minValue = this.min();
    return minValue !== undefined && currentValue !== null && currentValue <= minValue;
  });

  readonly isMaxReached = computed(() => {
    const currentValue = this.value();
    const maxValue = this.max();
    return maxValue !== undefined && currentValue !== null && currentValue >= maxValue;
  });

  constructor() {
    // Sync disabled state changes
    effect(() => {
      const isDisabled = this.disabled();
      if (isDisabled) {
        this.onTouched();
      }
    });
  }

  // ControlValueAccessor implementation
  writeValue(value: number | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handled via input signal
  }

  // Event handlers
  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newValue = target.value === '' ? null : parseFloat(target.value);

    // Validate min/max
    if (newValue !== null) {
      const min = this.min();
      const max = this.max();

      if (min !== undefined && newValue < min) {
        this.value.set(min);
        target.value = min.toString();
        this.onChange(min);
        this.valueChange.emit(min);
        return;
      }

      if (max !== undefined && newValue > max) {
        this.value.set(max);
        target.value = max.toString();
        this.onChange(max);
        this.valueChange.emit(max);
        return;
      }
    }

    this.value.set(newValue);
    this.onChange(newValue);
    this.valueChange.emit(newValue);
  }

  protected increment(): void {
    const currentValue = this.value() ?? 0;
    const stepValue = this.step();
    const maxValue = this.max();

    let newValue = currentValue + stepValue;

    if (maxValue !== undefined && newValue > maxValue) {
      newValue = maxValue;
    }

    this.value.set(newValue);
    this.onChange(newValue);
    this.valueChange.emit(newValue);
  }

  protected decrement(): void {
    const currentValue = this.value() ?? 0;
    const stepValue = this.step();
    const minValue = this.min();

    let newValue = currentValue - stepValue;

    if (minValue !== undefined && newValue < minValue) {
      newValue = minValue;
    }

    this.value.set(newValue);
    this.onChange(newValue);
    this.valueChange.emit(newValue);
  }
}
