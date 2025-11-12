import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator to ensure no special characters are present
 * Allows only letters, numbers, and spaces
 */
export function noSpecialCharactersValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Don't validate empty values (use Validators.required for that)
    }

    const regex = /^[a-zA-Z0-9\s]+$/;
    const isValid = regex.test(control.value);

    return isValid ? null : { specialCharacters: { value: control.value } };
  };
}
