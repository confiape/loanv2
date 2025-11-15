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
import { NgIconComponent } from '@ng-icons/core';
import {
  InputSize,
  ValidationState,
  getLabelClasses,
  getInputClasses,
  generateInputTestIds,
} from '@loan/app/shared/components/input/input-helpers';

const DATA_TESTID = new HostAttributeToken('data-testid');

@Component({
  selector: 'app-input-number',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  template: `
    <div class="w-full">
      <!-- Label -->
      @if (label()) {
        <label [for]="inputId()" [class]="labelClasses()" [attr.data-testid]="labelTestId()">
          {{ label() }}
        </label>
      }

      <!-- Input Container -->
      <div class="relative">
        <!-- Prefix Icon -->
        @if (prefixIcon()) {
          <div
            class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
          >
            <ng-icon
              aria-hidden="true"
              [name]="prefixIcon()!"
              size="16"
              [class.text-text-secondary]="validationState() === 'none'"
              [class.text-success]="validationState() === 'success'"
              [class.text-error]="validationState() === 'error'"
            ></ng-icon>
          </div>
        }

        <!-- Input -->
        <input
          [id]="inputId()"
          type="number"
          [placeholder]="placeholder()"
          [disabled]="isDisabled()"
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
          >
            <button
              type="button"
              [attr.data-testid]="incrementButtonTestId()"
              [disabled]="isDisabled() || isMaxReached()"
              [class]="incrementButtonClasses()"
              (click)="increment()"
            >
              <ng-icon
                aria-hidden="true"
                name="heroChevronUp"
                size="12"
                class="text-text-primary"
              ></ng-icon>
            </button>
            <button
              type="button"
              [attr.data-testid]="decrementButtonTestId()"
              [disabled]="isDisabled() || isMinReached()"
              [class]="decrementButtonClasses()"
              (click)="decrement()"
            >
              <ng-icon
                aria-hidden="true"
                name="heroChevronDown"
                size="12"
                class="text-text-primary"
              ></ng-icon>
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
  private readonly controlDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.controlDisabled());

  // ControlValueAccessor callbacks
  private onChange: (value: number | null) => void = () => undefined;
  protected onTouched: () => void = () => undefined;

  // Test IDs using helper
  private readonly testIds = generateInputTestIds(this.hostTestId);
  readonly labelTestId = this.testIds.label;
  readonly inputTestId = this.testIds.input;
  readonly helpTextTestId = this.testIds.helpText;
  readonly errorMessageTestId = this.testIds.errorMessage;

  // Additional test IDs for buttons
  readonly incrementButtonTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-increment` : null,
  );
  readonly decrementButtonTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-decrement` : null,
  );

  // Computed classes using helpers
  readonly labelClasses = computed(() => getLabelClasses(this.validationState()));

  readonly inputClasses = computed(() => {
    const baseClasses = getInputClasses(
      this.size(),
      this.validationState(),
      this.isDisabled(),
      !!this.prefixIcon(),
      false,
      false,
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
    const disabledClasses =
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-bg-secondary';
    const roundedClasses = 'rounded-tr-lg';

    return `${baseClasses} ${disabledClasses} ${roundedClasses}`;
  });

  readonly decrementButtonClasses = computed(() => {
    const baseClasses =
      'h-1/2 px-3 bg-bg-secondary border border-t-0 border-border hover:bg-bg-surface focus:ring-2 focus:outline-none focus:ring-accent transition-colors';
    const disabledClasses =
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-bg-secondary';
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
      const isDisabled = this.isDisabled();
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
    this.controlDisabled.set(isDisabled);
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
