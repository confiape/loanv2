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
  generateInputTestIds,
} from '../input/input-helpers';

const DATA_TESTID = new HostAttributeToken('data-testid');

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full" [attr.data-testid]="wrapperTestId()">
      <!-- Label -->
      @if (label()) {
        <label
          [for]="selectId()"
          [class]="labelClasses()"
          [attr.data-testid]="labelTestId()"
        >
          {{ label() }}
        </label>
      }

      <!-- Select Container -->
      <div class="relative">
        <!-- Select -->
        <select
          [id]="selectId()"
          [disabled]="disabled()"
          [attr.aria-label]="ariaLabel()"
          [attr.aria-describedby]="helpTextId()"
          [attr.aria-invalid]="validationState() === 'error'"
          [attr.data-testid]="selectTestId()"
          [class]="selectClasses()"
          [value]="value()"
          (change)="onChange($event)"
          (blur)="onTouched()"
        >
          @if (placeholder()) {
            <option value="" disabled selected>{{ placeholder() }}</option>
          }
          @for (option of options(); track option.value) {
            <option
              [value]="option.value"
              [disabled]="option.disabled || false"
            >
              {{ option.label }}
            </option>
          }
        </select>
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
      useExisting: forwardRef(() => Select),
      multi: true,
    },
  ],
  host: {
    class: 'block',
  },
})
export class Select implements ControlValueAccessor {
  // Test ID from host
  private readonly hostTestId = inject(DATA_TESTID, { optional: true });

  // Input properties
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly size = input<InputSize>('default');
  readonly validationState = input<ValidationState>('none');
  readonly helpText = input<string>('');
  readonly successMessage = input<string>('');
  readonly errorMessage = input<string>('');
  readonly ariaLabel = input<string>('');
  readonly selectId = input<string>(`select-${Math.random().toString(36).substring(2, 9)}`);
  readonly options = input<SelectOption[]>([]);

  // Output events
  readonly valueChange = output<string>();

  // Internal state
  readonly value = signal<string>('');

  // ControlValueAccessor callbacks
  private onChangeCallback: (value: string) => void = () => {};
  protected onTouched: () => void = () => {};

  // Test IDs using helper
  private readonly testIds = generateInputTestIds(this.hostTestId);
  readonly wrapperTestId = this.testIds.wrapper;
  readonly labelTestId = this.testIds.label;
  readonly helpTextTestId = this.testIds.helpText;
  readonly successMessageTestId = this.testIds.successMessage;
  readonly errorMessageTestId = this.testIds.errorMessage;

  // Select-specific test ID
  readonly selectTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-select` : null
  );

  // Computed classes
  readonly labelClasses = computed(() => {
    const state = this.validationState();
    const size = this.size();
    let classes = getLabelClasses(state);

    // Adjust label size for large select
    if (size === 'large') {
      classes = classes.replace('text-sm', 'text-base');
    }

    return classes;
  });

  readonly selectClasses = computed(() => {
    const size = this.size();
    const state = this.validationState();
    const disabled = this.disabled();

    // Base classes
    let classes = 'block w-full border rounded-lg focus:ring-1 focus:outline-none transition-colors';

    // Size variants
    if (size === 'small') {
      classes += ' p-2 text-sm';
    } else if (size === 'large') {
      classes += ' px-4 py-3 text-base';
    } else {
      classes += ' p-2.5 text-sm';
    }

    // Validation state colors
    if (state === 'success') {
      classes += ' bg-bg-success-light border-success text-success';
      classes += ' focus:ring-success focus:border-success';
    } else if (state === 'error') {
      classes += ' bg-bg-error-light border-error text-error';
      classes += ' focus:ring-error focus:border-error';
    } else if (disabled) {
      classes += ' bg-bg-disabled border-border text-text-secondary cursor-not-allowed';
    } else {
      classes += ' bg-bg-secondary border-border text-text-primary';
      classes += ' focus:ring-accent focus:border-accent';
    }

    return classes;
  });

  readonly helpTextId = computed(() => `${this.selectId()}-help`);

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
  writeValue(value: string): void {
    this.value.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handled via input signal
  }

  // Event handlers
  protected onChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newValue = target.value;
    this.value.set(newValue);
    this.onChangeCallback(newValue);
    this.valueChange.emit(newValue);
  }
}
