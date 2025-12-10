import { Component, input, output, effect, signal, inject, OnInit, computed } from '@angular/core';
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
 * Interface for grouped fields
 */
export interface FieldGroup {
  name: string;
  fields: FormFieldMetadata[];
}

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
  readonly dataTestId = input<string | null>(null);

  // Outputs
  formSubmit = output<unknown>();
  formCancel = output<void>();

  // State
  form!: FormGroup;
  optionsMap = signal<Map<string, SelectOption[]>>(new Map());
  loadingOptions = signal<boolean>(false);

  private lastItemId: string | null = null;

  /**
   * Fields without group (displayed directly, not in accordion)
   */
  protected ungroupedFields = computed<FormFieldMetadata[]>(() => {
    return this.fields().filter((field) => !field.group);
  });

  /**
   * Fields with group (displayed in accordions)
   */
  protected groupedFields = computed<FieldGroup[]>(() => {
    const groups = new Map<string, FormFieldMetadata[]>();

    this.fields().forEach((field) => {
      if (field.group) {
        if (!groups.has(field.group)) {
          groups.set(field.group, []);
        }
        groups.get(field.group)!.push(field);
      }
    });

    return Array.from(groups.entries()).map(([name, fields]) => ({
      name,
      fields,
    }));
  });

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
        // Transform values using valueTransformer if provided, or extract from dtoPath
        const transformedValues: Record<string, unknown> = {};
        this.fields().forEach((field) => {
          if (field.valueTransformer) {
            // Use custom transformer if provided
            transformedValues[field.key] = field.valueTransformer(currentItem);
          } else if (field.dtoPath) {
            // Extract value from nested path (support read/write paths)
            const readPath = this.getReadPath(field.dtoPath);
            const value = this.getNestedValue(currentItem, readPath);
            transformedValues[field.key] = value;
          } else if (currentItem[field.key] !== undefined) {
            // Fallback to direct key access
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

    // Transform flat form values to nested DTO structure using dtoPath
    const transformedDto = this.transformFormValueToDto(formValue);

    // Merge with existing item if editing
    const dto = currentItem ? { ...currentItem, ...transformedDto } : transformedDto;

    this.formSubmit.emit(dto);
  }

  /**
   * Transform flat form values to nested DTO structure
   * Uses dtoPath from field metadata to create nested objects
   */
  private transformFormValueToDto(formValue: Record<string, unknown>): Record<string, unknown> {
    const dto: Record<string, unknown> = {};

    this.fields().forEach((field) => {
      const value = formValue[field.key];
      const writePath = this.getWritePath(field.dtoPath || field.key);

      // Set value in nested path
      this.setNestedValue(dto, writePath, value);
    });

    return dto;
  }

  /**
   * Get the read path from dtoPath (for loading values into form)
   */
  private getReadPath(dtoPath: string | { read: string; write: string }): string {
    if (typeof dtoPath === 'string') {
      return dtoPath;
    }
    return dtoPath.read;
  }

  /**
   * Get the write path from dtoPath (for saving form values to DTO)
   */
  private getWritePath(dtoPath: string | { read: string; write: string }): string {
    if (typeof dtoPath === 'string') {
      return dtoPath;
    }
    return dtoPath.write;
  }

  /**
   * Set a value in a nested object using dot notation path
   * Example: setNestedValue(obj, 'personDto.name', 'John') creates obj.personDto.name = 'John'
   */
  private setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
    const parts = path.split('.');
    let current = obj;

    // Navigate/create nested structure
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part] || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part] as Record<string, unknown>;
    }

    // Set the final value
    current[parts[parts.length - 1]] = value;
  }

  /**
   * Get a value from a nested object using dot notation path
   * Example: getNestedValue(obj, 'personDto.name') returns obj.personDto.name
   */
  private getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    const parts = path.split('.');
    let current: unknown = obj;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = (current as Record<string, unknown>)[part];
      } else {
        return undefined;
      }
    }

    return current;
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

  /**
   * Get CSS classes for field grid layout
   */
  protected getFieldGridClass(field: FormFieldMetadata): string {
    const colSpan = field.colSpan || 1;
    const baseClass = field.cssClass || '';

    // Full-width types or colSpan 2
    if (colSpan === 2 || field.type === 'multiselect') {
      return `col-span-full ${baseClass}`.trim();
    }

    return `col-span-1 ${baseClass}`.trim();
  }
}
