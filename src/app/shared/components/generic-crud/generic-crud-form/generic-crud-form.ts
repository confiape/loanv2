import { Component, input, output, effect, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormControl,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { Input } from '@loan/app/shared/components/input/input';
import { InputNumber } from '@loan/app/shared/components/input-number/input-number';
import { PasswordInput } from '@loan/app/shared/components/password-input/password-input';
import { Select } from '@loan/app/shared/components/select/select';
import { MultiSelect } from '@loan/app/shared/components/multiselect/multiselect';
import { Checkbox } from '@loan/app/shared/components/checkbox/checkbox';
import { RadioGroup } from '@loan/app/shared/components/radio/radio';
import { DateInput } from '@loan/app/shared/components/date-input/date-input';
import { Button } from '@loan/app/shared/components/button/button';
import { FormFieldMetadata, SelectOption } from '@loan/app/core/models/form-metadata';

/**
 * Generic form component that generates form fields based on metadata
 * Supports: text, number, email, password, date, checkbox, radio, select, multiselect
 *
 * @example
 * ```html
 * <app-generic-crud-form
 *   [item]="editingItem()"
 *   [fields]="service.getFormFields()"
 *   (formSubmit)="service.onFormSave()"
 *   (formCancel)="service.onFormCancel()"
 * />
 * ```
 */
@Component({
  selector: 'app-generic-crud-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Input,
    InputNumber,
    PasswordInput,
    Select,
    MultiSelect,
    Checkbox,
    RadioGroup,
    DateInput,
    Button,
  ],
  templateUrl: './generic-crud-form.html',
})
export class GenericCrudFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  // Inputs
  item = input<Record<string, unknown> | null>(null);
  fields = input.required<FormFieldMetadata[]>();
  loading = input<boolean>(false);
  error = input<string | null>(null);
  testIdPrefix = input<string>('crud');

  // Outputs
  formSubmit = output<unknown>();
  formCancel = output<void>();

  // State
  form!: FormGroup;
  optionsMap = signal<Map<string, SelectOption[]>>(new Map());
  loadingOptions = signal<boolean>(false);

  private lastItemId: string | null = null;

  constructor() {
    // Update form when item changes - must be in constructor for injection context
    effect(() => {
      const currentItem = this.item();
      if (!this.form) return; // Guard against form not being initialized yet

      // Only update if item actually changed (by ID)
      const currentId = currentItem?.['id'] as string | undefined;
      const itemId = currentId || null;
      if (itemId === this.lastItemId) return;
      this.lastItemId = itemId;

      if (currentItem) {
        // Transform values using valueTransformer if provided
        const transformedValues: Record<string, unknown> = {};
        this.fields().forEach((field) => {
          if (field.valueTransformer) {
            transformedValues[field.key] = field.valueTransformer(currentItem);
          } else if (currentItem[field.key] !== undefined) {
            transformedValues[field.key] = currentItem[field.key];
          }
        });

        this.form.patchValue(transformedValues);
        this.form.markAsPristine();
        this.form.markAsUntouched();
      } else {
        this.form.reset();
        this.form.markAsPristine();
        this.form.markAsUntouched();
      }
    });
  }

  ngOnInit(): void {
    this.buildForm();
    this.loadAllOptions();
  }

  /**
   * Build reactive form based on field metadata
   */
  private buildForm(): void {
    const group: Record<string, unknown> = {};

    this.fields().forEach((field) => {
      const defaultValue = field.defaultValue ?? this.getDefaultValueForType(field.type);
      const validators: ValidatorFn[] = field.validators || [];
      const asyncValidators = field.asyncValidators || [];

      group[field.key] = [
        { value: defaultValue, disabled: field.disabled || field.readonly },
        validators,
        asyncValidators.length > 0 ? asyncValidators : null,
      ];
    });

    this.form = this.fb.group(group);
  }

  /**
   * Load all options for select/multiselect/radio fields
   */
  private loadAllOptions(): void {
    const fieldsWithOptions = this.fields().filter(
      (f) =>
        (f.type === 'select' || f.type === 'multiselect' || f.type === 'radio') && f.loadOptions,
    );

    if (fieldsWithOptions.length === 0) {
      // No dynamic options to load, just set static options
      this.setStaticOptions();
      return;
    }

    this.loadingOptions.set(true);

    const requests = fieldsWithOptions.map((field) =>
      field.loadOptions ? field.loadOptions() : of([]),
    );

    forkJoin(requests).subscribe({
      next: (results) => {
        const map = new Map<string, SelectOption[]>();

        fieldsWithOptions.forEach((field, index) => {
          map.set(field.key, results[index]);
        });

        // Also add static options
        this.fields().forEach((field) => {
          if (field.options && !map.has(field.key)) {
            map.set(field.key, field.options);
          }
        });

        this.optionsMap.set(map);
        this.loadingOptions.set(false);
      },
      error: (err) => {
        console.error('Error loading options:', err);
        this.loadingOptions.set(false);
        // Set static options even if dynamic load fails
        this.setStaticOptions();
      },
    });
  }

  /**
   * Set static options for fields that have them
   */
  private setStaticOptions(): void {
    const map = new Map<string, SelectOption[]>();
    this.fields().forEach((field) => {
      if (field.options) {
        map.set(field.key, field.options);
      }
    });
    this.optionsMap.set(map);
  }

  /**
   * Get default value based on field type
   */
  private getDefaultValueForType(type: string): unknown {
    switch (type) {
      case 'checkbox':
        return false;
      case 'multiselect':
        return [];
      case 'number':
        return 0;
      default:
        return '';
    }
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    const currentItem = this.item();

    // Merge with existing item if editing
    const dto = currentItem ? { ...currentItem, ...formValue } : formValue;

    this.formSubmit.emit(dto);
  }

  /**
   * Handle form cancellation
   */
  onCancel(): void {
    this.form.reset();
    this.formCancel.emit();
  }

  /**
   * Get FormControl for a field
   */
  getControl(fieldKey: string): FormControl {
    return this.form.get(fieldKey) as FormControl;
  }

  /**
   * Get options for select/multiselect/radio fields
   */
  getOptions(fieldKey: string): SelectOption[] {
    return this.optionsMap().get(fieldKey) || [];
  }

  /**
   * Check if form is in edit mode
   */
  get isEditMode(): boolean {
    return this.item() !== null;
  }

  /**
   * Check if field should be displayed
   */
  shouldShowField(field: FormFieldMetadata): boolean {
    // Add any custom logic here if needed
    return true;
  }

  /**
   * Check if a field has required validator
   */
  isFieldRequired(fieldKey: string): boolean {
    const field = this.fields().find((f) => f.key === fieldKey);
    if (!field || !field.validators) return false;
    return field.validators.includes(Validators.required);
  }

  /**
   * Get error message for a field
   */
  getFieldError(fieldKey: string): string | null {
    const control = this.getControl(fieldKey);
    if (!control || !control.errors || !control.touched) return null;

    if (control.errors['required']) return 'This field is required';
    if (control.errors['minlength'])
      return `Minimum length is ${control.errors['minlength'].requiredLength}`;
    if (control.errors['maxlength'])
      return `Maximum length is ${control.errors['maxlength'].requiredLength}`;
    if (control.errors['email']) return 'Invalid email address';
    if (control.errors['pattern']) return 'Invalid format';
    if (control.errors['min']) return `Minimum value is ${control.errors['min'].min}`;
    if (control.errors['max']) return `Maximum value is ${control.errors['max'].max}`;
    if (control.errors['notUnique']) return 'This value is already in use';

    return 'Invalid value';
  }

  /**
   * Get validation state for a field
   */
  getValidationState(fieldKey: string): 'none' | 'error' | 'success' {
    const control = this.getControl(fieldKey);
    if (!control || !control.touched) return 'none';
    return control.invalid ? 'error' : 'none';
  }
}
