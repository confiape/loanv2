import { describe, it, expect } from 'vitest';
import { FormControl } from '@angular/forms';
import { noSpecialCharactersValidator } from './company.validators';

describe('Company Validators', () => {
  describe('noSpecialCharactersValidator', () => {
    it('should return null for valid alphanumeric input', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Company123');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null for input with spaces', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Company Name 123');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null for letters only', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('CompanyName');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null for numbers only', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('12345');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null for empty value', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null for null value', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl(null);

      // Act
      const result = validator(control);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null for undefined value', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl(undefined);

      // Act
      const result = validator(control);

      // Assert
      expect(result).toBeNull();
    });

    it('should return error for special characters - symbols', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Company@Name');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({
        specialCharacters: { value: 'Company@Name' },
      });
    });

    it('should return error for special characters - dash', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Company-Name');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({
        specialCharacters: { value: 'Company-Name' },
      });
    });

    it('should return error for special characters - underscore', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Company_Name');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({
        specialCharacters: { value: 'Company_Name' },
      });
    });

    it('should return error for special characters - dot', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Company.Inc');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({
        specialCharacters: { value: 'Company.Inc' },
      });
    });

    it('should return error for special characters - comma', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Company, Inc');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({
        specialCharacters: { value: 'Company, Inc' },
      });
    });

    it('should return error for special characters - exclamation', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Company!');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({
        specialCharacters: { value: 'Company!' },
      });
    });

    it('should return error for special characters - question mark', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Company?');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({
        specialCharacters: { value: 'Company?' },
      });
    });

    it('should return error for special characters - hash', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Company#1');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({
        specialCharacters: { value: 'Company#1' },
      });
    });

    it('should return error for accented characters', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Compañía');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({
        specialCharacters: { value: 'Compañía' },
      });
    });

    it('should return error for mixed valid and invalid characters', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Valid123@Invalid');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({
        specialCharacters: { value: 'Valid123@Invalid' },
      });
    });
  });
});
