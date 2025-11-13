import { describe, it, expect } from 'vitest';
import { FormControl } from '@angular/forms';
import { noSpecialCharactersValidator } from './role.validators';

describe('noSpecialCharactersValidator', () => {
  describe('Valid inputs', () => {
    it('should return null for valid text with letters only', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin');

      const result = validator(control);

      expect(result).toBeNull();
    });

    it('should return null for valid text with letters and numbers', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin123');

      const result = validator(control);

      expect(result).toBeNull();
    });

    it('should return null for valid text with letters, numbers, and spaces', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Super Admin 2024');

      const result = validator(control);

      expect(result).toBeNull();
    });

    it('should return null for text with multiple spaces', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Role  Name  With  Spaces');

      const result = validator(control);

      expect(result).toBeNull();
    });

    it('should return null for uppercase letters', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('ADMINISTRATOR');

      const result = validator(control);

      expect(result).toBeNull();
    });

    it('should return null for lowercase letters', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('administrator');

      const result = validator(control);

      expect(result).toBeNull();
    });

    it('should return null for mixed case letters', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('MixedCase123');

      const result = validator(control);

      expect(result).toBeNull();
    });

    it('should return null for numbers only', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('123456');

      const result = validator(control);

      expect(result).toBeNull();
    });
  });

  describe('Invalid inputs with special characters', () => {
    it('should return error for text with exclamation mark', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin!');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: 'Admin!' } });
    });

    it('should return error for text with at symbol', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin@Role');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: 'Admin@Role' } });
    });

    it('should return error for text with hash symbol', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Role#1');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: 'Role#1' } });
    });

    it('should return error for text with dollar sign', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin$Role');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: 'Admin$Role' } });
    });

    it('should return error for text with percent sign', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Role%Name');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: 'Role%Name' } });
    });

    it('should return error for text with ampersand', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Role&Name');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: 'Role&Name' } });
    });

    it('should return error for text with asterisk', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin*Role');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: 'Admin*Role' } });
    });

    it('should return error for text with parentheses', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin(Role)');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: 'Admin(Role)' } });
    });

    it('should return error for text with brackets', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin[Role]');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: 'Admin[Role]' } });
    });

    it('should return error for text with braces', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin{Role}');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: 'Admin{Role}' } });
    });

    it('should return error for text with underscore', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin_Role');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: 'Admin_Role' } });
    });

    it('should return error for text with hyphen', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin-Role');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: 'Admin-Role' } });
    });

    it('should return error for text with plus sign', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin+Role');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: 'Admin+Role' } });
    });

    it('should return error for text with equals sign', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin=Role');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: 'Admin=Role' } });
    });

    it('should return error for text with forward slash', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin/Role');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: 'Admin/Role' } });
    });

    it('should return error for text with backslash', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin\\Role');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: 'Admin\\Role' } });
    });

    it('should return error for text with comma', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin,Role');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: 'Admin,Role' } });
    });

    it('should return error for text with period', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin.Role');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: 'Admin.Role' } });
    });

    it('should return error for text with colon', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin:Role');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: 'Admin:Role' } });
    });

    it('should return error for text with semicolon', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin;Role');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: 'Admin;Role' } });
    });

    it('should return error for text with quotes', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin"Role');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: 'Admin"Role' } });
    });

    it('should return error for text with apostrophe', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl("Admin'Role");

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: "Admin'Role" } });
    });

    it('should return error for text with less than symbol', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin<Role');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: 'Admin<Role' } });
    });

    it('should return error for text with greater than symbol', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin>Role');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: 'Admin>Role' } });
    });

    it('should return error for text with question mark', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin?Role');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: 'Admin?Role' } });
    });

    it('should return error for text with pipe symbol', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin|Role');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: 'Admin|Role' } });
    });

    it('should return error for text with tilde', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin~Role');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: 'Admin~Role' } });
    });

    it('should return error for text with backtick', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin`Role');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: 'Admin`Role' } });
    });

    it('should return error for text with multiple special characters', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin@#$%Role!');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: 'Admin@#$%Role!' } });
    });
  });

  describe('Empty and null values', () => {
    it('should return null for empty string', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('');

      const result = validator(control);

      expect(result).toBeNull();
    });

    it('should return null for null value', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl(null);

      const result = validator(control);

      expect(result).toBeNull();
    });

    it('should return null for undefined value', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl(undefined);

      const result = validator(control);

      expect(result).toBeNull();
    });

    it('should return null for whitespace only', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('   ');

      const result = validator(control);

      expect(result).toBeNull();
    });
  });

  describe('Edge cases', () => {
    it('should handle single character valid input', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('A');

      const result = validator(control);

      expect(result).toBeNull();
    });

    it('should handle single character invalid input', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('!');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: '!' } });
    });

    it('should handle very long valid string', () => {
      const validator = noSpecialCharactersValidator();
      const longString = 'A'.repeat(1000) + ' ' + '123'.repeat(100);
      const control = new FormControl(longString);

      const result = validator(control);

      expect(result).toBeNull();
    });

    it('should handle special character at the beginning', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('!Admin');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: '!Admin' } });
    });

    it('should handle special character at the end', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin!');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: 'Admin!' } });
    });

    it('should handle special character in the middle', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Ad!min');

      const result = validator(control);

      expect(result).toEqual({ specialCharacters: { value: 'Ad!min' } });
    });
  });

  describe('Validator reusability', () => {
    it('should work with multiple controls independently', () => {
      const validator = noSpecialCharactersValidator();
      const control1 = new FormControl('ValidRole');
      const control2 = new FormControl('Invalid@Role');

      const result1 = validator(control1);
      const result2 = validator(control2);

      expect(result1).toBeNull();
      expect(result2).toEqual({ specialCharacters: { value: 'Invalid@Role' } });
    });

    it('should maintain consistent behavior across multiple calls', () => {
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin!');

      const result1 = validator(control);
      const result2 = validator(control);

      expect(result1).toEqual(result2);
    });
  });
});
