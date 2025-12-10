import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minLengthTrimmed(minLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value == null) {
      return null;
    }
    const trimmedLength = control.value.trim().length;
    return trimmedLength < minLength
      ? { minLengthTrimmed: { requiredLength: minLength, actualLength: trimmedLength } }
      : null;
  };
}

export function maxLengthTrimmed(maxLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value == null) {
      return null;
    }
    const trimmedLength = control.value.trim().length;
    return trimmedLength > maxLength
      ? { maxLengthTrimmed: { requiredLength: maxLength, actualLength: trimmedLength } }
      : null;
  };
}
