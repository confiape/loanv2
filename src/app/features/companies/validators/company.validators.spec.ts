import { describe, it, expect } from 'vitest';
import { FormControl } from '@angular/forms';
import { noSpecialCharactersValidator } from './company.validators';

describe('Company Validators', () => {
  describe('noSpecialCharactersValidator', () => {
    const validator = noSpecialCharactersValidator();

    it('should return null for valid alphanumeric input', () => {
      const control = new FormControl('Company123');
      const result = validator(control);

      expect(result).toBeNull();
    });

    it('should return null for input with spaces', () => {
      const control = new FormControl('Company Name 123');
      const result = validator(control);

      expect(result).toBeNull();
    });

    it('should return null for letters only', () => {
      const control = new FormControl('CompanyName');
      const result = validator(control);

      expect(result).toBeNull();
    });

    it('should return null for numbers only', () => {
      const control = new FormControl('12345');
      const result = validator(control);

      expect(result).toBeNull();
    });

    it('should return null for empty value', () => {
      const control = new FormControl('');
      const result = validator(control);

      expect(result).toBeNull();
    });

    it('should return null for null value', () => {
      const control = new FormControl(null);
      const result = validator(control);

      expect(result).toBeNull();
    });

    it('should return null for undefined value', () => {
      const control = new FormControl(undefined);
      const result = validator(control);

      expect(result).toBeNull();
    });

    it('should return error for special characters - symbols', () => {
      const control = new FormControl('Company@Name');
      const result = validator(control);

      expect(result).toEqual({
        specialCharacters: { value: 'Company@Name' },
      });
    });

    it('should return error for special characters - dash', () => {
      const control = new FormControl('Company-Name');
      const result = validator(control);

      expect(result).toEqual({
        specialCharacters: { value: 'Company-Name' },
      });
    });

    it('should return error for special characters - underscore', () => {
      const control = new FormControl('Company_Name');
      const result = validator(control);

      expect(result).toEqual({
        specialCharacters: { value: 'Company_Name' },
      });
    });

    it('should return error for special characters - dot', () => {
      const control = new FormControl('Company.Inc');
      const result = validator(control);

      expect(result).toEqual({
        specialCharacters: { value: 'Company.Inc' },
      });
    });

    it('should return error for special characters - comma', () => {
      const control = new FormControl('Company, Inc');
      const result = validator(control);

      expect(result).toEqual({
        specialCharacters: { value: 'Company, Inc' },
      });
    });

    it('should return error for special characters - exclamation', () => {
      const control = new FormControl('Company!');
      const result = validator(control);

      expect(result).toEqual({
        specialCharacters: { value: 'Company!' },
      });
    });

    it('should return error for special characters - question mark', () => {
      const control = new FormControl('Company?');
      const result = validator(control);

      expect(result).toEqual({
        specialCharacters: { value: 'Company?' },
      });
    });

    it('should return error for special characters - hash', () => {
      const control = new FormControl('Company#1');
      const result = validator(control);

      expect(result).toEqual({
        specialCharacters: { value: 'Company#1' },
      });
    });

    it('should return error for accented characters', () => {
      const control = new FormControl('Compañía');
      const result = validator(control);

      expect(result).toEqual({
        specialCharacters: { value: 'Compañía' },
      });
    });

    it('should return error for mixed valid and invalid characters', () => {
      const control = new FormControl('Valid123@Invalid');
      const result = validator(control);

      expect(result).toEqual({
        specialCharacters: { value: 'Valid123@Invalid' },
      });
    });
  });
});
