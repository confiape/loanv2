import { describe, it, expect } from 'vitest';
import { sanitizeTestId, generateTestId, generateItemTestId } from './test-id.utils';

describe('test-id.utils', () => {
  describe('sanitizeTestId', () => {
    it('should convert to lowercase', () => {
      expect(sanitizeTestId('United States')).toBe('united-states');
      expect(sanitizeTestId('UPPERCASE')).toBe('uppercase');
      expect(sanitizeTestId('MixedCase')).toBe('mixedcase');
    });

    it('should replace spaces with hyphens', () => {
      expect(sanitizeTestId('hello world')).toBe('hello-world');
      expect(sanitizeTestId('multiple   spaces')).toBe('multiple-spaces');
    });

    it('should replace special characters with hyphens', () => {
      expect(sanitizeTestId('user@email.com')).toBe('user-email-com');
      expect(sanitizeTestId('hello!world?')).toBe('hello-world');
      expect(sanitizeTestId('test_value')).toBe('test-value');
    });

    it('should remove leading and trailing hyphens', () => {
      expect(sanitizeTestId('!hello!')).toBe('hello');
      expect(sanitizeTestId('---test---')).toBe('test');
      expect(sanitizeTestId('_value_')).toBe('value');
    });

    it('should handle numbers', () => {
      expect(sanitizeTestId(123)).toBe('123');
      expect(sanitizeTestId(0)).toBe('0');
      expect(sanitizeTestId(456)).toBe('456');
    });

    it('should handle alphanumeric values', () => {
      expect(sanitizeTestId('option123')).toBe('option123');
      expect(sanitizeTestId('test-123')).toBe('test-123');
    });

    it('should handle empty strings', () => {
      expect(sanitizeTestId('')).toBe('');
    });

    it('should collapse multiple hyphens into one', () => {
      expect(sanitizeTestId('hello!!!world')).toBe('hello-world');
      expect(sanitizeTestId('test___value')).toBe('test-value');
    });
  });

  describe('generateTestId', () => {
    it('should generate test ID with suffix', () => {
      expect(generateTestId('form', 'input')).toBe('form-input');
      expect(generateTestId('button', 'spinner')).toBe('button-spinner');
    });

    it('should return base when no suffix provided', () => {
      expect(generateTestId('form')).toBe('form');
      expect(generateTestId('button', undefined)).toBe('button');
    });

    it('should return null when base is null', () => {
      expect(generateTestId(null, 'input')).toBeNull();
      expect(generateTestId(null)).toBeNull();
    });

    it('should handle empty suffix', () => {
      expect(generateTestId('form', '')).toBe('form-');
    });
  });

  describe('generateItemTestId', () => {
    it('should generate test ID with item type and ID', () => {
      expect(generateItemTestId('form', 'option', 'us')).toBe('form-option-us');
      expect(generateItemTestId('table', 'row', 5)).toBe('table-row-5');
    });

    it('should sanitize the ID part', () => {
      expect(generateItemTestId('form', 'option', 'United States')).toBe(
        'form-option-united-states',
      );
      expect(generateItemTestId('form', 'option', 'user@email.com')).toBe(
        'form-option-user-email-com',
      );
    });

    it('should return null when base is null', () => {
      expect(generateItemTestId(null, 'option', 'value')).toBeNull();
      expect(generateItemTestId(null, 'row', 0)).toBeNull();
    });

    it('should handle numeric IDs', () => {
      expect(generateItemTestId('list', 'item', 0)).toBe('list-item-0');
      expect(generateItemTestId('list', 'item', 123)).toBe('list-item-123');
    });

    it('should handle different item types', () => {
      expect(generateItemTestId('form', 'option', 'value')).toBe('form-option-value');
      expect(generateItemTestId('table', 'row', 1)).toBe('table-row-1');
      expect(generateItemTestId('accordion', 'item', 2)).toBe('accordion-item-2');
    });
  });
});
