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
  /** Field key (matches form control name) */
  key: string;

  /** Field label */
  label: string;

  /** Field type */
  type: FormFieldType;

  /**
   * Path in the DTO structure for nested objects
   * Examples:
   * - 'displayName' (flat field)
   * - 'personDto.name' (nested field)
   * - 'address.street.name' (deeply nested)
   *
   * If not provided, defaults to using 'key' as the DTO path
   *
   * Can be a string (same path for read/write) or an object with separate paths:
   * - string: 'personDto.name' (read and write from same path)
   * - object: { read: 'person.name', write: 'personDto.name' }
   */
  dtoPath?: string | { read: string; write: string };

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

  /** Group name for organizing fields in sections */
  group?: string;

  /** Column span in grid layout (1 or 2 columns) */
  colSpan?: 1 | 2;
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

/**
 * Metadata for defining display fields in view mode
 */
export interface DisplayFieldMetadata {
  /** Field key (matches DTO property) */
  key: string;

  /** Field label */
  label: string;

  /** Custom value getter */
  valueGetter?: (item: unknown) => unknown;

  /** Custom value formatter */
  formatter?: (value: unknown) => string;
}
