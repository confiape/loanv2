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
  getSuffixButtonClasses,
  generateInputTestIds,
} from '@loan/app/shared/components/input/input-helpers';

const DATA_TESTID = new HostAttributeToken('data-testid');

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  template: `
    <div class="w-full" [attr.data-testid]="wrapperTestId()">
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
            [attr.data-testid]="prefixIconTestId()"
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
            <ng-icon
              aria-hidden="true"
              [name]="suffixIcon()!"
              size="16"
              [class.text-text-secondary]="validationState() === 'none'"
              [class.text-success]="validationState() === 'success'"
              [class.text-error]="validationState() === 'error'"
            ></ng-icon>
          </div>
        }

        @if (suffixButton()) {
          <button
            type="button"
            [class]="suffixButtonClasses()"
            [attr.data-testid]="suffixButtonTestId()"
            [attr.aria-label]="suffixButtonAriaLabel() || null"
            (click)="onSuffixButtonClick()"
          >
            @if (suffixButtonIcon()) {
              <ng-icon
                aria-hidden="true"
                [name]="suffixButtonIcon()!"
                size="16"
                class="text-text-primary"
              ></ng-icon>
            } @else {
              {{ suffixButtonText() }}
            }
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
  // Test ID from host or explicit input
  private readonly injectedTestId = inject(DATA_TESTID, { optional: true });
  readonly dataTestId = input<string | null>(null);
  private readonly resolvedTestId = computed(
    () => this.dataTestId() ?? this.injectedTestId ?? null,
  );

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
  readonly suffixButtonIcon = input<string>('');
  readonly suffixButtonAriaLabel = input<string>('');
  readonly suffixButtonIconOnly = input<boolean>(false);

  // Output events
  readonly valueChange = output<string>();
  readonly suffixButtonClick = output<void>();

  // Internal state
  readonly value = signal<string>('');

  // ControlValueAccessor callbacks
  private onChange: (value: string) => void = () => {};
  protected onTouched: () => void = () => {};

  // Test IDs using helper
  private readonly testIds = generateInputTestIds(() => this.resolvedTestId());
  readonly wrapperTestId = this.testIds.wrapper;
  readonly labelTestId = this.testIds.label;
  readonly inputTestId = this.testIds.input;
  readonly prefixIconTestId = this.testIds.prefixIcon;
  readonly suffixIconTestId = this.testIds.suffixIcon;
  readonly suffixButtonTestId = this.testIds.suffixButton;
  readonly helpTextTestId = this.testIds.helpText;
  readonly successMessageTestId = this.testIds.successMessage;
  readonly errorMessageTestId = this.testIds.errorMessage;

  // Computed classes using helpers
  readonly labelClasses = computed(() => getLabelClasses(this.validationState()));

  readonly inputClasses = computed(() =>
    getInputClasses(
      this.size(),
      this.validationState(),
      this.disabled(),
      !!this.prefixIcon(),
      !!this.suffixIcon() || this.suffixButton(),
      this.suffixButton(),
    ),
  );

  readonly suffixButtonClasses = computed(() =>
    getSuffixButtonClasses(this.size(), this.suffixButtonIconOnly()),
  );

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
