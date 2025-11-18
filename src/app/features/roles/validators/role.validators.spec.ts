import { describe, it, expect } from 'vitest';
import { FormControl } from '@angular/forms';
import { noSpecialCharactersValidator } from './role.validators';

describe('noSpecialCharactersValidator', () => {
  describe('Valid inputs', () => {
    it('should return null for valid text with letters only', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null for valid text with letters and numbers', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin123');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null for valid text with letters, numbers, and spaces', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Super Admin 2024');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null for text with multiple spaces', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Role  Name  With  Spaces');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null for uppercase letters', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('ADMINISTRATOR');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null for lowercase letters', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('administrator');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null for mixed case letters', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('MixedCase123');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null for numbers only', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('123456');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('Invalid inputs with special characters', () => {
    it('should return error for text with exclamation mark', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin!');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: 'Admin!' } });
    });

    it('should return error for text with at symbol', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin@Role');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: 'Admin@Role' } });
    });

    it('should return error for text with hash symbol', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Role#1');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: 'Role#1' } });
    });

    it('should return error for text with dollar sign', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin$Role');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: 'Admin$Role' } });
    });

    it('should return error for text with percent sign', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Role%Name');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: 'Role%Name' } });
    });

    it('should return error for text with ampersand', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Role&Name');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: 'Role&Name' } });
    });

    it('should return error for text with asterisk', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin*Role');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: 'Admin*Role' } });
    });

    it('should return error for text with parentheses', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin(Role)');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: 'Admin(Role)' } });
    });

    it('should return error for text with brackets', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin[Role]');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: 'Admin[Role]' } });
    });

    it('should return error for text with braces', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin{Role}');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: 'Admin{Role}' } });
    });

    it('should return error for text with underscore', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin_Role');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: 'Admin_Role' } });
    });

    it('should return error for text with hyphen', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin-Role');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: 'Admin-Role' } });
    });

    it('should return error for text with plus sign', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin+Role');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: 'Admin+Role' } });
    });

    it('should return error for text with equals sign', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin=Role');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: 'Admin=Role' } });
    });

    it('should return error for text with forward slash', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin/Role');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: 'Admin/Role' } });
    });

    it('should return error for text with backslash', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin\\Role');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: 'Admin\\Role' } });
    });

    it('should return error for text with comma', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin,Role');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: 'Admin,Role' } });
    });

    it('should return error for text with period', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin.Role');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: 'Admin.Role' } });
    });

    it('should return error for text with colon', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin:Role');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: 'Admin:Role' } });
    });

    it('should return error for text with semicolon', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin;Role');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: 'Admin;Role' } });
    });

    it('should return error for text with quotes', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin"Role');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: 'Admin"Role' } });
    });

    it('should return error for text with apostrophe', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl("Admin'Role");

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: "Admin'Role" } });
    });

    it('should return error for text with less than symbol', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin<Role');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: 'Admin<Role' } });
    });

    it('should return error for text with greater than symbol', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin>Role');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: 'Admin>Role' } });
    });

    it('should return error for text with question mark', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin?Role');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: 'Admin?Role' } });
    });

    it('should return error for text with pipe symbol', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin|Role');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: 'Admin|Role' } });
    });

    it('should return error for text with tilde', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin~Role');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: 'Admin~Role' } });
    });

    it('should return error for text with backtick', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin`Role');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: 'Admin`Role' } });
    });

    it('should return error for text with multiple special characters', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin@#$%Role!');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: 'Admin@#$%Role!' } });
    });
  });

  describe('Empty and null values', () => {
    it('should return null for empty string', () => {
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

    it('should return null for whitespace only', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('   ');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('Edge cases', () => {
    it('should handle single character valid input', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('A');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toBeNull();
    });

    it('should handle single character invalid input', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('!');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: '!' } });
    });

    it('should handle very long valid string', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const longString = 'A'.repeat(1000) + ' ' + '123'.repeat(100);
      const control = new FormControl(longString);

      // Act
      const result = validator(control);

      // Assert
      expect(result).toBeNull();
    });

    it('should handle special character at the beginning', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('!Admin');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: '!Admin' } });
    });

    it('should handle special character at the end', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin!');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: 'Admin!' } });
    });

    it('should handle special character in the middle', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Ad!min');

      // Act
      const result = validator(control);

      // Assert
      expect(result).toEqual({ specialCharacters: { value: 'Ad!min' } });
    });
  });

  describe('Validator reusability', () => {
    it('should work with multiple controls independently', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control1 = new FormControl('ValidRole');
      const control2 = new FormControl('Invalid@Role');

      // Act
      const result1 = validator(control1);
      const result2 = validator(control2);

      // Assert
      expect(result1).toBeNull();
      expect(result2).toEqual({ specialCharacters: { value: 'Invalid@Role' } });
    });

    it('should maintain consistent behavior across multiple calls', () => {
      // Arrange
      const validator = noSpecialCharactersValidator();
      const control = new FormControl('Admin!');

      // Act
      const result1 = validator(control);
      const result2 = validator(control);

      // Assert
      expect(result1).toEqual(result2);
    });
  });
});
