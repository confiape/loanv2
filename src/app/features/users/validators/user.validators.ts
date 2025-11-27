import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator to ensure email format is valid
 * Basic email validation
 */
export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Don't validate empty values (use Validators.required for that)
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(control.value);

    return isValid ? null : { invalidEmail: { value: control.value } };
  };
}

/**
 * Validator to ensure DNI format is valid
 * Allows numbers and optional hyphen for format like XXX-XXXXXX-X
 */
export function dniValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const dniRegex = /^[\d]{8,20}(-[\d]{1,3})?$/;
    const isValid = dniRegex.test(control.value);

    return isValid ? null : { invalidDni: { value: control.value } };
  };
}

/**
 * Validator to ensure phone number is valid
 * Allows numbers, spaces, parentheses, and hyphens
 */
export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const phoneRegex = /^[\d\s\-\(\)]{7,20}$/;
    const isValid = phoneRegex.test(control.value);

    return isValid ? null : { invalidPhone: { value: control.value } };
  };
}
