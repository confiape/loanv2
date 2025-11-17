// Angular testing
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

// Vitest
import { describe, it, expect } from 'vitest';

// Service under test
import { ToastService } from './toast.service';

describe('ToastService', () => {
  describe('Initialization', () => {
    it('should be created', () => {
      // Arrange
      TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection(), ToastService],
      });
      const service = TestBed.inject(ToastService);

      // Assert
      expect(service).toBeTruthy();
    });

    it('should start with empty toasts array', () => {
      // Arrange
      TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection(), ToastService],
      });
      const service = TestBed.inject(ToastService);

      // Assert
      expect(service.toasts$()).toEqual([]);
    });
  });

  describe('show() method', () => {
    it('should add toast to the list', () => {
      // Arrange
      TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection(), ToastService],
      });
      const service = TestBed.inject(ToastService);

      // Act
      service.show('info', 'Test message');

      // Assert
      const toasts = service.toasts$();
      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('info');
      expect(toasts[0].message).toBe('Test message');
    });

    it('should generate unique ID for each toast', () => {
      // Arrange
      TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection(), ToastService],
      });
      const service = TestBed.inject(ToastService);

      // Act
      service.show('info', 'First');
      service.show('info', 'Second');

      // Assert
      const toasts = service.toasts$();
      expect(toasts[0].id).not.toBe(toasts[1].id);
    });

    it('should set title when provided', () => {
      // Arrange
      TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection(), ToastService],
      });
      const service = TestBed.inject(ToastService);

      // Act
      service.show('success', 'Message', 'Title');

      // Assert
      const toasts = service.toasts$();
      expect(toasts[0].title).toBe('Title');
    });

    it('should set custom duration when provided', () => {
      // Arrange
      TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection(), ToastService],
      });
      const service = TestBed.inject(ToastService);

      // Act
      service.show('info', 'Message', undefined, 5000);

      // Assert
      const toasts = service.toasts$();
      expect(toasts[0].duration).toBe(5000);
    });

    it('should set default duration of 2000ms for success', () => {
      // Arrange
      TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection(), ToastService],
      });
      const service = TestBed.inject(ToastService);

      // Act
      service.show('success', 'Message');

      // Assert
      const toasts = service.toasts$();
      expect(toasts[0].duration).toBe(2000);
    });

    it('should set default duration of 3000ms for error', () => {
      // Arrange
      TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection(), ToastService],
      });
      const service = TestBed.inject(ToastService);

      // Act
      service.show('error', 'Message');

      // Assert
      const toasts = service.toasts$();
      expect(toasts[0].duration).toBe(3000);
    });

    it('should set default duration of 2000ms for warning', () => {
      // Arrange
      TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection(), ToastService],
      });
      const service = TestBed.inject(ToastService);

      // Act
      service.show('warning', 'Message');

      // Assert
      const toasts = service.toasts$();
      expect(toasts[0].duration).toBe(2000);
    });

    it('should set default duration of 2000ms for info', () => {
      // Arrange
      TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection(), ToastService],
      });
      const service = TestBed.inject(ToastService);

      // Act
      service.show('info', 'Message');

      // Assert
      const toasts = service.toasts$();
      expect(toasts[0].duration).toBe(2000);
    });

    it('should set dismissible to true by default', () => {
      // Arrange
      TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection(), ToastService],
      });
      const service = TestBed.inject(ToastService);

      // Act
      service.show('info', 'Message');

      // Assert
      const toasts = service.toasts$();
      expect(toasts[0].dismissible).toBe(true);
    });

    it('should allow setting dismissible to false', () => {
      // Arrange
      TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection(), ToastService],
      });
      const service = TestBed.inject(ToastService);

      // Act
      service.show('info', 'Message', undefined, undefined, false);

      // Assert
      const toasts = service.toasts$();
      expect(toasts[0].dismissible).toBe(false);
    });

    it('should add multiple toasts in order', () => {
      // Arrange
      TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection(), ToastService],
      });
      const service = TestBed.inject(ToastService);

      // Act
      service.show('info', 'First');
      service.show('success', 'Second');
      service.show('error', 'Third');

      // Assert
      const toasts = service.toasts$();
      expect(toasts.length).toBe(3);
      expect(toasts[0].message).toBe('First');
      expect(toasts[1].message).toBe('Second');
      expect(toasts[2].message).toBe('Third');
    });
  });

  describe('Convenience methods', () => {
    describe('success()', () => {
      it('should create success toast', () => {
        // Arrange
        TestBed.configureTestingModule({
          providers: [provideZonelessChangeDetection(), ToastService],
        });
        const service = TestBed.inject(ToastService);

        // Act
        service.success('Success message');

        // Assert
        const toasts = service.toasts$();
        expect(toasts[0].type).toBe('success');
        expect(toasts[0].message).toBe('Success message');
      });

      it('should accept title and duration', () => {
        // Arrange
        TestBed.configureTestingModule({
          providers: [provideZonelessChangeDetection(), ToastService],
        });
        const service = TestBed.inject(ToastService);

        // Act
        service.success('Message', 'Title', 5000);

        // Assert
        const toasts = service.toasts$();
        expect(toasts[0].title).toBe('Title');
        expect(toasts[0].duration).toBe(5000);
      });
    });

    describe('error()', () => {
      it('should create error toast', () => {
        // Arrange
        TestBed.configureTestingModule({
          providers: [provideZonelessChangeDetection(), ToastService],
        });
        const service = TestBed.inject(ToastService);

        // Act
        service.error('Error message');

        // Assert
        const toasts = service.toasts$();
        expect(toasts[0].type).toBe('error');
        expect(toasts[0].message).toBe('Error message');
      });

      it('should accept title and duration', () => {
        // Arrange
        TestBed.configureTestingModule({
          providers: [provideZonelessChangeDetection(), ToastService],
        });
        const service = TestBed.inject(ToastService);

        // Act
        service.error('Message', 'Error Title', 4000);

        // Assert
        const toasts = service.toasts$();
        expect(toasts[0].title).toBe('Error Title');
        expect(toasts[0].duration).toBe(4000);
      });
    });

    describe('warning()', () => {
      it('should create warning toast', () => {
        // Arrange
        TestBed.configureTestingModule({
          providers: [provideZonelessChangeDetection(), ToastService],
        });
        const service = TestBed.inject(ToastService);

        // Act
        service.warning('Warning message');

        // Assert
        const toasts = service.toasts$();
        expect(toasts[0].type).toBe('warning');
        expect(toasts[0].message).toBe('Warning message');
      });

      it('should accept title and duration', () => {
        // Arrange
        TestBed.configureTestingModule({
          providers: [provideZonelessChangeDetection(), ToastService],
        });
        const service = TestBed.inject(ToastService);

        // Act
        service.warning('Message', 'Warning Title', 3500);

        // Assert
        const toasts = service.toasts$();
        expect(toasts[0].title).toBe('Warning Title');
        expect(toasts[0].duration).toBe(3500);
      });
    });

    describe('info()', () => {
      it('should create info toast', () => {
        // Arrange
        TestBed.configureTestingModule({
          providers: [provideZonelessChangeDetection(), ToastService],
        });
        const service = TestBed.inject(ToastService);

        // Act
        service.info('Info message');

        // Assert
        const toasts = service.toasts$();
        expect(toasts[0].type).toBe('info');
        expect(toasts[0].message).toBe('Info message');
      });

      it('should accept title and duration', () => {
        // Arrange
        TestBed.configureTestingModule({
          providers: [provideZonelessChangeDetection(), ToastService],
        });
        const service = TestBed.inject(ToastService);

        // Act
        service.info('Message', 'Info Title', 2500);

        // Assert
        const toasts = service.toasts$();
        expect(toasts[0].title).toBe('Info Title');
        expect(toasts[0].duration).toBe(2500);
      });
    });
  });

  describe('dismiss()', () => {
    it('should remove toast by id', () => {
      // Arrange
      TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection(), ToastService],
      });
      const service = TestBed.inject(ToastService);

      // Act
      service.show('info', 'First');
      service.show('success', 'Second');
      const toasts = service.toasts$();
      const firstToastId = toasts[0].id;
      service.dismiss(firstToastId);

      // Assert
      const remainingToasts = service.toasts$();
      expect(remainingToasts.length).toBe(1);
      expect(remainingToasts[0].message).toBe('Second');
    });

    it('should do nothing if id does not exist', () => {
      // Arrange
      TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection(), ToastService],
      });
      const service = TestBed.inject(ToastService);

      // Act
      service.show('info', 'First');
      service.dismiss('non-existent-id');

      // Assert
      const toasts = service.toasts$();
      expect(toasts.length).toBe(1);
    });

    it('should remove correct toast when multiple exist', () => {
      // Arrange
      TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection(), ToastService],
      });
      const service = TestBed.inject(ToastService);

      // Act
      service.show('info', 'First');
      service.show('success', 'Second');
      service.show('error', 'Third');
      const toasts = service.toasts$();
      const secondToastId = toasts[1].id;
      service.dismiss(secondToastId);

      // Assert
      const remainingToasts = service.toasts$();
      expect(remainingToasts.length).toBe(2);
      expect(remainingToasts[0].message).toBe('First');
      expect(remainingToasts[1].message).toBe('Third');
    });
  });

  describe('clear()', () => {
    it('should remove all toasts', () => {
      // Arrange
      TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection(), ToastService],
      });
      const service = TestBed.inject(ToastService);

      // Act
      service.show('info', 'First');
      service.show('success', 'Second');
      service.show('error', 'Third');
      expect(service.toasts$().length).toBe(3);
      service.clear();

      // Assert
      expect(service.toasts$().length).toBe(0);
    });

    it('should work when no toasts exist', () => {
      // Arrange
      TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection(), ToastService],
      });
      const service = TestBed.inject(ToastService);

      // Act
      service.clear();

      // Assert
      expect(service.toasts$().length).toBe(0);
    });
  });

  describe('Signal reactivity', () => {
    it('should update toasts$ signal when toast is added', () => {
      // Arrange
      TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection(), ToastService],
      });
      const service = TestBed.inject(ToastService);

      // Act
      const initialLength = service.toasts$().length;
      service.show('info', 'New toast');
      const finalLength = service.toasts$().length;

      // Assert
      expect(finalLength).toBe(initialLength + 1);
    });

    it('should update toasts$ signal when toast is dismissed', () => {
      // Arrange
      TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection(), ToastService],
      });
      const service = TestBed.inject(ToastService);

      // Act
      service.show('info', 'Test');
      const toastId = service.toasts$()[0].id;
      service.dismiss(toastId);

      // Assert
      expect(service.toasts$().length).toBe(0);
    });

    it('should update toasts$ signal when cleared', () => {
      // Arrange
      TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection(), ToastService],
      });
      const service = TestBed.inject(ToastService);

      // Act
      service.show('info', 'First');
      service.show('success', 'Second');
      service.clear();

      // Assert
      expect(service.toasts$().length).toBe(0);
    });
  });

  describe('ID generation', () => {
    it('should generate IDs with correct format', () => {
      // Arrange
      TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection(), ToastService],
      });
      const service = TestBed.inject(ToastService);

      // Act
      service.show('info', 'Test');

      // Assert
      const toast = service.toasts$()[0];
      expect(toast.id).toMatch(/^toast-\d+-[a-z0-9]+$/);
    });

    it('should generate unique IDs for concurrent toasts', () => {
      // Arrange
      TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection(), ToastService],
      });
      const service = TestBed.inject(ToastService);
      const ids = new Set<string>();

      // Act
      for (let i = 0; i < 10; i++) {
        service.show('info', `Message ${i}`);
      }

      // Assert
      const toasts = service.toasts$();
      toasts.forEach((toast) => ids.add(toast.id));
      expect(ids.size).toBe(10);
    });
  });
});
