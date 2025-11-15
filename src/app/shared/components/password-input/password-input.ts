import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  effect,
  inject,
  HostAttributeToken,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import { heroEye, heroEyeSlash } from '@ng-icons/heroicons/outline';

import { Input } from '@loan/app/shared/components/input/input';
import { InputSize, ValidationState } from '@loan/app/shared/components/input/input-helpers';

const DATA_TESTID = new HostAttributeToken('data-testid');

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [Input],
  template: `
    <app-input
      [attr.data-testid]="hostTestId"
      [label]="label()"
      [placeholder]="placeholder()"
      [disabled]="isDisabled()"
      [readonly]="readonly()"
      [size]="size()"
      [validationState]="validationState()"
      [helpText]="helpText()"
      [successMessage]="successMessage()"
      [errorMessage]="errorMessage()"
      [ariaLabel]="ariaLabel()"
      [inputId]="inputId()"
      [type]="inputType()"
      [prefixIcon]="prefixIcon()"
      [suffixButton]="allowToggle()"
      [suffixButtonIcon]="toggleIcon()"
      [suffixButtonAriaLabel]="toggleButtonLabel()"
      [suffixButtonIconOnly]="true"
      (suffixButtonClick)="toggleVisibility()"
      (valueChange)="handleValueChange($event)"
      (focusout)="handleTouched()"
    ></app-input>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInput),
      multi: true,
    },
    provideIcons({ heroEye, heroEyeSlash }),
  ],
  host: {
    class: 'block w-full',
  },
})
export class PasswordInput implements ControlValueAccessor {
  protected readonly hostTestId = inject(DATA_TESTID, { optional: true });

  @ViewChild(Input)
  set inputComponent(component: Input | undefined) {
    if (!component) {
      return;
    }

    this.inputCmp = component;
    this.inputCmp.writeValue(this.value());
    this.inputCmp.setDisabledState(this.isDisabled());
  }

  private inputCmp?: Input;

  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly size = input<InputSize>('default');
  readonly validationState = input<ValidationState>('none');
  readonly helpText = input<string>('');
  readonly successMessage = input<string>('');
  readonly errorMessage = input<string>('');
  readonly ariaLabel = input<string>('Password input');
  readonly inputId = input<string>(`password-input-${Math.random().toString(36).substring(2, 9)}`);
  readonly prefixIcon = input<string>('');
  readonly allowToggle = input<boolean>(true);
  readonly showLabel = input<string>('Show password');
  readonly hideLabel = input<string>('Hide password');
  readonly showIcon = input<string>('heroEye');
  readonly hideIcon = input<string>('heroEyeSlash');

  readonly valueChange = output<string>();
  readonly visibilityChange = output<boolean>();

  private readonly value = signal<string>('');
  private readonly controlDisabled = signal<boolean>(false);
  private readonly passwordVisible = signal<boolean>(false);

  readonly isDisabled = computed(() => this.disabled() || this.controlDisabled());
  readonly inputType = computed(() => (this.passwordVisible() ? 'text' : 'password'));
  readonly toggleButtonLabel = computed(() =>
    this.passwordVisible() ? this.hideLabel() : this.showLabel(),
  );
  readonly toggleIcon = computed(() =>
    this.passwordVisible() ? this.hideIcon() : this.showIcon(),
  );

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor() {
    effect(() => {
      const disabled = this.isDisabled();
      this.inputCmp?.setDisabledState(disabled);
    });
  }

  writeValue(value: string | null): void {
    const safeValue = value ?? '';
    this.value.set(safeValue);
    this.inputCmp?.writeValue(safeValue);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.controlDisabled.set(isDisabled);
    this.inputCmp?.setDisabledState(isDisabled);
  }

  protected handleValueChange(value: string): void {
    this.value.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
  }

  protected toggleVisibility(): void {
    if (!this.allowToggle()) {
      return;
    }

    const nextState = !this.passwordVisible();
    this.passwordVisible.set(nextState);
    this.visibilityChange.emit(nextState);
  }

  protected handleTouched(): void {
    this.onTouched();
  }
}
