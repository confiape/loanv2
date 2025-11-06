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

const DATA_TESTID = new HostAttributeToken('data-testid');

export type InputSize = 'small' | 'default' | 'large';
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
export type ValidationState = 'none' | 'success' | 'error';

@Component({
  selector: 'app-input',
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
          [type]="type()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [readonly]="readonly()"
          [attr.aria-label]="ariaLabel()"
          [attr.aria-describedby]="helpTextId()"
          [attr.aria-invalid]="validationState() === 'error'"
          [attr.data-testid]="inputTestId()"
          [class]="inputClasses()"
          [value]="value()"
          (input)="onInput($event)"
          (blur)="onTouched()"
        />

        <!-- Suffix Icon or Button -->
        @if (suffixIcon()) {
          <div
            class="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none"
            [attr.data-testid]="suffixIconTestId()"
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
              [innerHTML]="suffixIcon()"
            ></svg>
          </div>
        }

        @if (suffixButton()) {
          <button
            type="button"
            [class]="suffixButtonClasses()"
            [attr.data-testid]="suffixButtonTestId()"
            (click)="onSuffixButtonClick()"
          >
            {{ suffixButtonText() }}
          </button>
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
      useExisting: forwardRef(() => Input),
      multi: true,
    },
  ],
  host: {
    class: 'block',
  },
})
export class Input implements ControlValueAccessor {
  // Test ID from host
  private readonly hostTestId = inject(DATA_TESTID, { optional: true });

  // Input properties
  readonly label = input<string>('');
  readonly type = input<InputType>('text');
  readonly placeholder = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly size = input<InputSize>('default');
  readonly validationState = input<ValidationState>('none');
  readonly helpText = input<string>('');
  readonly successMessage = input<string>('');
  readonly errorMessage = input<string>('');
  readonly ariaLabel = input<string>('');
  readonly inputId = input<string>(`input-${Math.random().toString(36).substring(2, 9)}`);

  // Icon support
  readonly prefixIcon = input<string>('');
  readonly suffixIcon = input<string>('');
  readonly suffixButton = input<boolean>(false);
  readonly suffixButtonText = input<string>('');

  // Output events
  readonly valueChange = output<string>();
  readonly suffixButtonClick = output<void>();

  // Internal state
  readonly value = signal<string>('');

  // ControlValueAccessor callbacks
  private onChange: (value: string) => void = () => {};
  protected onTouched: () => void = () => {};

  // Test IDs for elements
  readonly wrapperTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-wrapper` : null
  );
  readonly labelTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-label` : null
  );
  readonly inputTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-input` : null
  );
  readonly prefixIconTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-prefix-icon` : null
  );
  readonly suffixIconTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-suffix-icon` : null
  );
  readonly suffixButtonTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-button` : null
  );
  readonly helpTextTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-help-text` : null
  );
  readonly successMessageTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-success-message` : null
  );
  readonly errorMessageTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-error-message` : null
  );

  // Computed classes
  readonly labelClasses = computed(() => {
    const state = this.validationState();
    const baseClasses = 'block mb-2 text-sm font-medium';

    if (state === 'success') {
      return `${baseClasses} text-success`;
    }
    if (state === 'error') {
      return `${baseClasses} text-error`;
    }
    return `${baseClasses} text-text-primary`;
  });

  readonly inputClasses = computed(() => {
    const size = this.size();
    const state = this.validationState();
    const disabled = this.disabled();
    const hasPrefix = !!this.prefixIcon();
    const hasSuffix = !!this.suffixIcon() || this.suffixButton();

    // Base classes
    let classes = 'block w-full border rounded-lg focus:ring-1 focus:outline-none transition-colors';

    // Size variants
    if (size === 'small') {
      classes += ' p-2 text-xs';
    } else if (size === 'large') {
      classes += ' p-4 text-base';
    } else {
      classes += ' p-2.5 text-sm';
    }

    // Padding for icons
    if (hasPrefix) {
      classes += ' ps-10';
    }
    if (hasSuffix && !this.suffixButton()) {
      classes += ' pe-10';
    }
    if (this.suffixButton()) {
      classes += ' pe-24';
    }

    // Validation state colors
    if (state === 'success') {
      classes += ' bg-bg-success-light border-success text-success placeholder-success';
      classes += ' focus:ring-success focus:border-success';
    } else if (state === 'error') {
      classes += ' bg-bg-error-light border-error text-error placeholder-error';
      classes += ' focus:ring-error focus:border-error';
    } else if (disabled) {
      classes += ' bg-bg-disabled border-border text-text-secondary cursor-not-allowed';
    } else {
      classes += ' bg-bg-secondary border-border text-text-primary placeholder-text-secondary';
      classes += ' focus:ring-accent focus:border-accent';
    }

    return classes;
  });

  readonly suffixButtonClasses = computed(() => {
    const size = this.size();
    let classes = 'text-text-primary absolute end-2.5 bg-accent hover:bg-accent-hover';
    classes += ' focus:ring-4 focus:outline-none focus:ring-accent/30 font-medium rounded-lg';

    if (size === 'small') {
      classes += ' bottom-1.5 text-xs px-3 py-1.5';
    } else if (size === 'large') {
      classes += ' bottom-3 text-sm px-4 py-2.5';
    } else {
      classes += ' bottom-2 text-sm px-4 py-2';
    }

    return classes;
  });

  readonly helpTextId = computed(() => `${this.inputId()}-help`);

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
    const newValue = target.value;
    this.value.set(newValue);
    this.onChange(newValue);
    this.valueChange.emit(newValue);
  }

  protected onSuffixButtonClick(): void {
    this.suffixButtonClick.emit();
  }
}
