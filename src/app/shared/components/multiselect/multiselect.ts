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
  HostListener,
  ElementRef,
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

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-multiselect',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full relative" [attr.data-testid]="wrapperTestId()">
      <!-- Label -->
      @if (label()) {
        <label
          [for]="multiselectId()"
          [class]="labelClasses()"
          [attr.data-testid]="labelTestId()"
        >
          {{ label() }}
        </label>
      }

      <!-- Dropdown Button -->
      <button
        [id]="multiselectId()"
        type="button"
        [disabled]="isDisabled()"
        [attr.aria-label]="ariaLabel()"
        [attr.aria-describedby]="helpTextId()"
        [attr.aria-invalid]="validationState() === 'error'"
        [attr.aria-expanded]="isOpen()"
        [attr.data-testid]="buttonTestId()"
        [class]="buttonClasses()"
        (click)="toggleDropdown()"
      >
        <span class="text-left flex-1 truncate">
          @if (selectedLabels().length === 0) {
            <span class="text-text-secondary">{{ placeholder() }}</span>
          } @else {
            <span>{{ selectedLabels().join(', ') }}</span>
          }
        </span>
        <svg
          class="w-2.5 h-2.5 ms-3 transition-transform"
          [class.rotate-180]="isOpen()"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      <!-- Dropdown Menu -->
      @if (isOpen() && !isDisabled()) {
        <div
          [class]="dropdownClasses()"
          [attr.data-testid]="dropdownTestId()"
          (click)="$event.stopPropagation()"
        >
          <!-- Search Input -->
          @if (searchable()) {
            <div class="p-3">
              <label [for]="searchInputId()" class="sr-only">Search</label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
                >
                  <svg
                    class="w-4 h-4 text-text-secondary"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  [id]="searchInputId()"
                  type="text"
                  [value]="searchTerm()"
                  [placeholder]="searchPlaceholder()"
                  [attr.data-testid]="searchInputTestId()"
                  class="block w-full p-2 ps-10 text-sm text-text-primary border border-border rounded-lg bg-bg-secondary focus:ring-accent focus:border-accent focus:outline-none transition-colors"
                  (input)="onSearchChange($event)"
                  (click)="$event.stopPropagation()"
                />
              </div>
            </div>
          }

          <!-- Options List -->
          <ul
            class="px-3 pb-3 overflow-y-auto text-sm text-text-primary max-h-48"
            [attr.aria-labelledby]="multiselectId()"
            [attr.data-testid]="listTestId()"
          >
            @for (option of filteredOptions(); track option.value) {
              <li>
                <div
                  class="flex items-center ps-2 rounded-sm hover:bg-bg-surface transition-colors"
                  [class.opacity-50]="option.disabled"
                  [class.cursor-not-allowed]="option.disabled"
                  [class.cursor-pointer]="!option.disabled"
                >
                  <input
                    [id]="getOptionId(option.value)"
                    type="checkbox"
                    [value]="option.value"
                    [checked]="isSelected(option.value)"
                    [disabled]="option.disabled"
                    [attr.data-testid]="getOptionTestId(option.value)"
                    class="w-4 h-4 text-accent bg-bg-secondary border-border rounded-sm focus:ring-accent focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    (change)="toggleOption(option.value)"
                    (click)="$event.stopPropagation()"
                  />
                  <label
                    [for]="getOptionId(option.value)"
                    class="w-full py-2 ms-2 text-sm font-medium text-text-primary rounded-sm select-none"
                    [class.cursor-pointer]="!option.disabled"
                    [class.cursor-not-allowed]="option.disabled"
                  >
                    {{ option.label }}
                  </label>
                </div>
              </li>
            } @empty {
              <li class="px-2 py-4 text-center text-text-secondary">
                {{ noResultsText() }}
              </li>
            }
          </ul>
        </div>
      }

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
      useExisting: forwardRef(() => MultiSelect),
      multi: true,
    },
  ],
  host: {
    class: 'block',
  },
})
export class MultiSelect implements ControlValueAccessor {
  private readonly hostTestId = inject(DATA_TESTID, { optional: true });
  private readonly elementRef = inject(ElementRef);

  // Input properties
  readonly label = input<string>('');
  readonly placeholder = input<string>('Select options');
  readonly disabled = input<boolean>(false);
  readonly size = input<InputSize>('default');
  readonly validationState = input<ValidationState>('none');
  readonly helpText = input<string>('');
  readonly successMessage = input<string>('');
  readonly errorMessage = input<string>('');
  readonly ariaLabel = input<string>('');
  readonly multiselectId = input<string>(
    `multiselect-${Math.random().toString(36).substring(2, 9)}`,
  );
  readonly options = input<MultiSelectOption[]>([]);
  readonly searchable = input<boolean>(true);
  readonly searchPlaceholder = input<string>('Search...');
  readonly noResultsText = input<string>('No results found');
  readonly maxHeight = input<string>('12rem');

  // Output events
  readonly valueChange = output<string[]>();

  // Internal state
  readonly value = signal<string[]>([]);
  private readonly controlDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.controlDisabled());
  readonly isOpen = signal(false);
  readonly searchTerm = signal('');

  // ControlValueAccessor callbacks
  private onChangeCallback: (value: string[]) => void = () => undefined;
  protected onTouched: () => void = () => undefined;

  // Test IDs using helper
  private readonly testIds = generateInputTestIds(this.hostTestId);
  readonly wrapperTestId = this.testIds.wrapper;
  readonly labelTestId = this.testIds.label;
  readonly helpTextTestId = this.testIds.helpText;
  readonly successMessageTestId = this.testIds.successMessage;
  readonly errorMessageTestId = this.testIds.errorMessage;

  // MultiSelect-specific test IDs
  readonly buttonTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-button` : null,
  );
  readonly dropdownTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-dropdown` : null,
  );
  readonly searchInputTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-search` : null,
  );
  readonly listTestId = computed(() => (this.hostTestId ? `${this.hostTestId}-list` : null));

  readonly searchInputId = computed(() => `${this.multiselectId()}-search`);

  // Computed properties
  readonly filteredOptions = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) {
      return this.options();
    }

    return this.options().filter((option) => option.label.toLowerCase().includes(term));
  });

  readonly selectedLabels = computed(() => {
    const selectedValues = this.value();
    return this.options()
      .filter((option) => selectedValues.includes(option.value))
      .map((option) => option.label);
  });

  readonly labelClasses = computed(() => getLabelClasses(this.validationState()));

  readonly buttonClasses = computed(() => {
    const size = this.size();
    const state = this.validationState();
    const disabled = this.isDisabled();

    // Base classes
    let classes =
      'flex items-center justify-between w-full border rounded-lg focus:ring-1 focus:outline-none transition-colors';

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
      classes += ' bg-bg-success border-success text-success';
      classes += ' focus:ring-success focus:border-success';
    } else if (state === 'error') {
      classes += ' bg-bg-error border-error text-error';
      classes += ' focus:ring-error focus:border-error';
    } else if (disabled) {
      classes += ' bg-bg-disabled border-border text-text-secondary cursor-not-allowed';
    } else {
      classes += ' bg-bg-secondary border-border text-text-primary';
      classes += ' focus:ring-accent focus:border-accent';
    }

    return classes;
  });

  readonly dropdownClasses = computed(() => {
    return 'absolute z-10 mt-1 bg-bg-primary rounded-lg shadow-sm w-full border border-border';
  });

  readonly helpTextId = computed(() => `${this.multiselectId()}-help`);

  constructor() {
    // Sync disabled state changes
    effect(() => {
      const isDisabled = this.isDisabled();
      if (isDisabled) {
        this.closeDropdown();
        this.onTouched();
      }
    });
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: string[]): void {
    this.value.set(value || []);
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.controlDisabled.set(isDisabled);
  }

  // Event handlers
  protected toggleDropdown(): void {
    if (this.isDisabled()) return;
    this.isOpen.update((open) => !open);
  }

  protected closeDropdown(): void {
    if (this.isOpen()) {
      this.isOpen.set(false);
      this.searchTerm.set('');
      this.onTouched();
    }
  }

  protected toggleOption(optionValue: string): void {
    const currentValue = [...this.value()];
    const index = currentValue.indexOf(optionValue);

    if (index > -1) {
      currentValue.splice(index, 1);
    } else {
      currentValue.push(optionValue);
    }

    this.value.set(currentValue);
    this.onChangeCallback(currentValue);
    this.valueChange.emit(currentValue);
  }

  protected isSelected(optionValue: string): boolean {
    return this.value().includes(optionValue);
  }

  protected onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  protected getOptionId(value: string): string {
    return `${this.multiselectId()}-option-${value}`;
  }

  protected getOptionTestId(value: string): string | null {
    return this.hostTestId ? `${this.hostTestId}-option-${value}` : null;
  }
}
