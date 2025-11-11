import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), ToastService],
    });
    service = TestBed.inject(ToastService);
  });

  describe('Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should start with empty toasts array', () => {
      expect(service.toasts$()).toEqual([]);
    });
  });

  describe('show() method', () => {
    it('should add toast to the list', () => {
      service.show('info', 'Test message');

      const toasts = service.toasts$();
      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('info');
      expect(toasts[0].message).toBe('Test message');
    });

    it('should generate unique ID for each toast', () => {
      service.show('info', 'First');
      service.show('info', 'Second');

      const toasts = service.toasts$();
      expect(toasts[0].id).not.toBe(toasts[1].id);
    });

    it('should set title when provided', () => {
      service.show('success', 'Message', 'Title');

      const toasts = service.toasts$();
      expect(toasts[0].title).toBe('Title');
    });

    it('should set custom duration when provided', () => {
      service.show('info', 'Message', undefined, 5000);

      const toasts = service.toasts$();
      expect(toasts[0].duration).toBe(5000);
    });

    it('should set default duration of 2000ms for success', () => {
      service.show('success', 'Message');

      const toasts = service.toasts$();
      expect(toasts[0].duration).toBe(2000);
    });

    it('should set default duration of 3000ms for error', () => {
      service.show('error', 'Message');

      const toasts = service.toasts$();
      expect(toasts[0].duration).toBe(3000);
    });

    it('should set default duration of 2000ms for warning', () => {
      service.show('warning', 'Message');

      const toasts = service.toasts$();
      expect(toasts[0].duration).toBe(2000);
    });

    it('should set default duration of 2000ms for info', () => {
      service.show('info', 'Message');

      const toasts = service.toasts$();
      expect(toasts[0].duration).toBe(2000);
    });

    it('should set dismissible to true by default', () => {
      service.show('info', 'Message');

      const toasts = service.toasts$();
      expect(toasts[0].dismissible).toBe(true);
    });

    it('should allow setting dismissible to false', () => {
      service.show('info', 'Message', undefined, undefined, false);

      const toasts = service.toasts$();
      expect(toasts[0].dismissible).toBe(false);
    });

    it('should add multiple toasts in order', () => {
      service.show('info', 'First');
      service.show('success', 'Second');
      service.show('error', 'Third');

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
        service.success('Success message');

        const toasts = service.toasts$();
        expect(toasts[0].type).toBe('success');
        expect(toasts[0].message).toBe('Success message');
      });

      it('should accept title and duration', () => {
        service.success('Message', 'Title', 5000);

        const toasts = service.toasts$();
        expect(toasts[0].title).toBe('Title');
        expect(toasts[0].duration).toBe(5000);
      });
    });

    describe('error()', () => {
      it('should create error toast', () => {
        service.error('Error message');

        const toasts = service.toasts$();
        expect(toasts[0].type).toBe('error');
        expect(toasts[0].message).toBe('Error message');
      });

      it('should accept title and duration', () => {
        service.error('Message', 'Error Title', 4000);

        const toasts = service.toasts$();
        expect(toasts[0].title).toBe('Error Title');
        expect(toasts[0].duration).toBe(4000);
      });
    });

    describe('warning()', () => {
      it('should create warning toast', () => {
        service.warning('Warning message');

        const toasts = service.toasts$();
        expect(toasts[0].type).toBe('warning');
        expect(toasts[0].message).toBe('Warning message');
      });

      it('should accept title and duration', () => {
        service.warning('Message', 'Warning Title', 3500);

        const toasts = service.toasts$();
        expect(toasts[0].title).toBe('Warning Title');
        expect(toasts[0].duration).toBe(3500);
      });
    });

    describe('info()', () => {
      it('should create info toast', () => {
        service.info('Info message');

        const toasts = service.toasts$();
        expect(toasts[0].type).toBe('info');
        expect(toasts[0].message).toBe('Info message');
      });

      it('should accept title and duration', () => {
        service.info('Message', 'Info Title', 2500);

        const toasts = service.toasts$();
        expect(toasts[0].title).toBe('Info Title');
        expect(toasts[0].duration).toBe(2500);
      });
    });
  });

  describe('dismiss()', () => {
    it('should remove toast by id', () => {
      service.show('info', 'First');
      service.show('success', 'Second');

      const toasts = service.toasts$();
      const firstToastId = toasts[0].id;

      service.dismiss(firstToastId);

      const remainingToasts = service.toasts$();
      expect(remainingToasts.length).toBe(1);
      expect(remainingToasts[0].message).toBe('Second');
    });

    it('should do nothing if id does not exist', () => {
      service.show('info', 'First');

      service.dismiss('non-existent-id');

      const toasts = service.toasts$();
      expect(toasts.length).toBe(1);
    });

    it('should remove correct toast when multiple exist', () => {
      service.show('info', 'First');
      service.show('success', 'Second');
      service.show('error', 'Third');

      const toasts = service.toasts$();
      const secondToastId = toasts[1].id;

      service.dismiss(secondToastId);

      const remainingToasts = service.toasts$();
      expect(remainingToasts.length).toBe(2);
      expect(remainingToasts[0].message).toBe('First');
      expect(remainingToasts[1].message).toBe('Third');
    });
  });

  describe('clear()', () => {
    it('should remove all toasts', () => {
      service.show('info', 'First');
      service.show('success', 'Second');
      service.show('error', 'Third');

      expect(service.toasts$().length).toBe(3);

      service.clear();

      expect(service.toasts$().length).toBe(0);
    });

    it('should work when no toasts exist', () => {
      service.clear();
      expect(service.toasts$().length).toBe(0);
    });
  });

  describe('Signal reactivity', () => {
    it('should update toasts$ signal when toast is added', () => {
      const initialLength = service.toasts$().length;
      service.show('info', 'New toast');
      const finalLength = service.toasts$().length;

      expect(finalLength).toBe(initialLength + 1);
    });

    it('should update toasts$ signal when toast is dismissed', () => {
      service.show('info', 'Test');
      const toastId = service.toasts$()[0].id;

      service.dismiss(toastId);

      expect(service.toasts$().length).toBe(0);
    });

    it('should update toasts$ signal when cleared', () => {
      service.show('info', 'First');
      service.show('success', 'Second');

      service.clear();

      expect(service.toasts$().length).toBe(0);
    });
  });

  describe('ID generation', () => {
    it('should generate IDs with correct format', () => {
      service.show('info', 'Test');

      const toast = service.toasts$()[0];
      expect(toast.id).toMatch(/^toast-\d+-[a-z0-9]+$/);
    });

    it('should generate unique IDs for concurrent toasts', () => {
      const ids = new Set<string>();

      for (let i = 0; i < 10; i++) {
        service.show('info', `Message ${i}`);
      }

      const toasts = service.toasts$();
      toasts.forEach((toast) => ids.add(toast.id));

      expect(ids.size).toBe(10);
    });
  });
});
