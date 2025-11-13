import { ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';

/**
 * Form field types supported by the generic form
 */
export type FormFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'date'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'multiselect';

/**
 * Option for select, radio, and multiselect fields
 */
export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

/**
 * Metadata for defining form fields dynamically
 */
export interface FormFieldMetadata {
  /** Field key (matches DTO property) */
  key: string;

  /** Field label */
  label: string;

  /** Field type */
  type: FormFieldType;

  /** Synchronous validators */
  validators?: ValidatorFn[];

  /** Asynchronous validators */
  asyncValidators?: AsyncValidatorFn[];

  /** Static options for select/radio/multiselect */
  options?: SelectOption[];

  /** Dynamic options loader for select/radio/multiselect */
  loadOptions?: () => Observable<SelectOption[]>;

  /** Transform DTO value to form value */
  valueTransformer?: (item: unknown) => unknown;

  /** Placeholder text */
  placeholder?: string;

  /** Help text */
  helpText?: string;

  /** Default value */
  defaultValue?: unknown;

  /** Disabled state */
  disabled?: boolean;

  /** Readonly state */
  readonly?: boolean;

  /** Custom CSS classes */
  cssClass?: string;

  /** Min value (for number/date fields) */
  min?: number | string;

  /** Max value (for number/date fields) */
  max?: number | string;

  /** Step value (for number fields) */
  step?: number;
}

/**
 * Metadata for defining table columns
 */
export interface TableColumnMetadata<T> {
  /** Column key (matches DTO property) */
  key: keyof T | string;

  /** Column label */
  label: string;

  /** Enable sorting */
  sortable?: boolean;

  /** Custom value getter */
  valueGetter?: (item: T) => unknown;

  /** Custom value formatter */
  formatter?: (value: unknown) => string;

  /** Column width */
  width?: string;

  /** Column alignment */
  align?: 'left' | 'center' | 'right';
}
