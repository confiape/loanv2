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
  selector: 'app-date-input',
  standalone: true,
  imports: [CommonModule],
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
        <!-- Calendar Icon -->
        <div
          class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
        >
          <svg
            class="w-4 h-4"
            [class.text-text-secondary]="validationState() === 'none'"
            [class.text-success]="validationState() === 'success'"
            [class.text-error]="validationState() === 'error'"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"
            />
          </svg>
        </div>

        <!-- Input -->
        <input
          [id]="inputId()"
          type="date"
          [placeholder]="placeholder()"
          [disabled]="isDisabled()"
          [readonly]="readonly()"
          [min]="min()"
          [max]="max()"
          [attr.aria-label]="ariaLabel()"
          [attr.aria-describedby]="helpTextId()"
          [attr.aria-invalid]="validationState() === 'error'"
          [attr.data-testid]="inputTestId()"
          [class]="inputClasses()"
          [value]="value()"
          (input)="onInput($event)"
          (blur)="onTouched()"
        />
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
      useExisting: forwardRef(() => DateInput),
      multi: true,
    },
  ],
  host: {
    class: 'block',
  },
})
export class DateInput implements ControlValueAccessor {
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
  readonly inputId = input<string>(`date-input-${Math.random().toString(36).substring(2, 9)}`);

  // Date-specific properties
  readonly min = input<string>('');
  readonly max = input<string>('');

  // Output events
  readonly valueChange = output<string>();

  // Internal state
  readonly value = signal<string>('');
  private readonly controlDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.controlDisabled());

  // ControlValueAccessor callbacks
  private onChange: (value: string) => void = () => undefined;
  protected onTouched: () => void = () => undefined;

  // Test IDs using helper
  private readonly testIds = generateInputTestIds(this.hostTestId);
  readonly labelTestId = this.testIds.label;
  readonly inputTestId = this.testIds.input;
  readonly helpTextTestId = this.testIds.helpText;
  readonly errorMessageTestId = this.testIds.errorMessage;

  // Computed classes using helpers
  readonly labelClasses = computed(() => getLabelClasses(this.validationState()));

  readonly inputClasses = computed(() =>
    getInputClasses(
      this.size(),
      this.validationState(),
      this.isDisabled(),
      true, // Always has prefix icon (calendar)
      false,
      false,
    ),
  );

  readonly helpTextId = computed(() => `${this.inputId()}-help`);

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
  writeValue(value: string): void {
    this.value.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
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
    const newValue = target.value;
    this.value.set(newValue);
    this.onChange(newValue);
    this.valueChange.emit(newValue);
  }
}
