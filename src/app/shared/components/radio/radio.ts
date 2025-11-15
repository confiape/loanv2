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
import { InputSize, ValidationState, getLabelClasses } from '../input/input-helpers';

const DATA_TESTID = new HostAttributeToken('data-testid');

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-radio-group',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full">
      <!-- Label -->
      @if (label()) {
        <label [class]="labelClasses()" [attr.data-testid]="labelTestId()">
          {{ label() }}
        </label>
      }

      <!-- Radio Options -->
      <div [class]="containerClasses()">
        @for (option of options(); track option.value; let idx = $index) {
          <div class="flex items-center">
            <input
              [id]="getOptionId(option.value)"
              type="radio"
              [name]="name()"
              [value]="option.value"
              [checked]="value() === option.value"
              [disabled]="isDisabled() || option.disabled"
              [attr.aria-label]="option.label"
              [attr.data-testid]="getOptionTestId(idx)"
              [class]="radioClasses()"
              (change)="onChange(option.value)"
              (blur)="onTouched()"
            />
            <label
              [for]="getOptionId(option.value)"
              [class]="getOptionLabelClasses(option.disabled)"
              [attr.data-testid]="getOptionLabelTestId(idx)"
            >
              {{ option.label }}
            </label>
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
      useExisting: forwardRef(() => RadioGroup),
      multi: true,
    },
  ],
  host: {
    class: 'block',
  },
})
export class RadioGroup implements ControlValueAccessor {
  private readonly hostTestId = inject(DATA_TESTID, { optional: true });

  // Input properties
  readonly label = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly size = input<InputSize>('default');
  readonly validationState = input<ValidationState>('none');
  readonly helpText = input<string>('');
  readonly successMessage = input<string>('');
  readonly errorMessage = input<string>('');
  readonly name = input<string>(`radio-${Math.random().toString(36).substring(2, 9)}`);
  readonly options = input<RadioOption[]>([]);
  readonly inline = input<boolean>(false);

  // Output events
  readonly valueChange = output<string>();

  // Internal state
  readonly value = signal<string>('');
  private readonly controlDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.controlDisabled());

  // ControlValueAccessor callbacks
  private onChangeCallback: (value: string) => void = () => undefined;
  protected onTouched: () => void = () => undefined;

  // Test IDs
  readonly labelTestId = computed(() => (this.hostTestId ? `${this.hostTestId}-label` : null));
  readonly helpTextTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-help-text` : null,
  );
  readonly errorMessageTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-error-message` : null,
  );

  // Computed classes
  readonly labelClasses = computed(() => {
    const state = this.validationState();
    let classes = getLabelClasses(state);

    return classes;
  });

  readonly containerClasses = computed(() => {
    const inline = this.inline();
    const size = this.size();

    let classes = 'flex';

    if (inline) {
      classes += ' flex-row gap-4';
    } else {
      classes += ' flex-col';

      if (size === 'small') {
        classes += ' gap-1';
      } else if (size === 'large') {
        classes += ' gap-3';
      } else {
        classes += ' gap-2';
      }
    }

    return classes;
  });

  readonly radioClasses = computed(() => {
    const size = this.size();
    const state = this.validationState();
    const disabled = this.isDisabled();

    // Base classes
    let classes =
      'text-accent bg-bg-secondary border-border focus:ring-2 focus:ring-accent focus:outline-none transition-colors';

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

  readonly helpTextId = computed(() => `${this.name()}-help`);

  protected getOptionLabelClasses(optionDisabled?: boolean): string {
    const disabled = this.isDisabled() || optionDisabled;
    let classes = 'ms-2 text-sm font-medium text-text-primary';

    if (disabled) {
      classes += ' opacity-50 cursor-not-allowed';
    } else {
      classes += ' cursor-pointer';
    }

    return classes;
  }

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
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.controlDisabled.set(isDisabled);
  }

  // Event handlers
  protected onChange(value: string): void {
    this.value.set(value);
    this.onChangeCallback(value);
    this.valueChange.emit(value);
  }

  // Helper methods for test IDs
  protected getOptionId(value: string): string {
    return `${this.name()}-${value}`;
  }

  protected getOptionTestId(index: number): string | null {
    return this.hostTestId ? `${this.hostTestId}-radio-${index}` : null;
  }

  protected getOptionLabelTestId(index: number): string | null {
    return this.hostTestId ? `${this.hostTestId}-label-${index}` : null;
  }
}
