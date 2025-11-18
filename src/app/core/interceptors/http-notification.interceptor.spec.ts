import { describe, it, expect, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ToastService } from '@loan/app/core/services/toast.service';
import { httpNotificationInterceptor } from '@loan/app/core/interceptors/http-notification.interceptor';

describe('httpNotificationInterceptor', () => {
  function setupTestBed() {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(withInterceptors([httpNotificationInterceptor])),
        provideHttpClientTesting(),
        ToastService,
      ],
    });

    const httpClient = TestBed.inject(HttpClient);
    const httpTestingController = TestBed.inject(HttpTestingController);
    const toastService = TestBed.inject(ToastService);

    // Clear toasts before each test
    toastService.clear();

    afterEach(() => {
      httpTestingController.verify();
    });

    return { httpClient, httpTestingController, toastService };
  }

  describe('Error Handling', () => {
    it('should show error toast with message from response', () => {
      // Arrange
      const { httpClient, httpTestingController, toastService } = setupTestBed();
      const errorMessage = 'Usuario no encontrado';

      // Act
      httpClient.get('/api/users/1').subscribe({
        next: () => {
          // Expected path
        },
        error: () => {
          // Error case
        },
      });

      // Assert
      const req = httpTestingController.expectOne('/api/users/1');
      req.flush({ message: errorMessage }, { status: 404, statusText: 'Not Found' });

      const toasts = toastService.toasts$();
      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('error');
      expect(toasts[0].message).toBe(errorMessage);
      expect(toasts[0].title).toBe('Error 404');
    });

    it('should show error message when no message field in error object', () => {
      // Arrange
      const { httpClient, httpTestingController, toastService } = setupTestBed();

      // Act
      httpClient.get('/api/users/1').subscribe({
        next: () => {
          // Expected path
        },
        error: () => {
          // Error case
        },
      });

      // Assert
      const req = httpTestingController.expectOne('/api/users/1');
      req.flush({}, { status: 500, statusText: 'Internal Server Error' });

      const toasts = toastService.toasts$();
      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('error');
      // The interceptor will use error.message as fallback, which contains the HTTP error description
      expect(toasts[0].message).toContain('Http failure response');
    });

    it('should use error.message as fallback', () => {
      // Arrange
      const { httpClient, httpTestingController, toastService } = setupTestBed();

      // Act
      httpClient.get('/api/users/1').subscribe({
        next: () => {
          // Expected path
        },
        error: () => {
          // Error case
        },
      });

      // Assert
      const req = httpTestingController.expectOne('/api/users/1');
      req.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });

      const toasts = toastService.toasts$();
      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('error');
    });

    it('should include status code in title', () => {
      // Arrange
      const { httpClient, httpTestingController, toastService } = setupTestBed();

      // Act
      httpClient.get('/api/users/1').subscribe({
        next: () => {
          // Expected path
        },
        error: () => {
          // Error case
        },
      });

      // Assert
      const req = httpTestingController.expectOne('/api/users/1');
      req.flush({ message: 'Forbidden' }, { status: 403, statusText: 'Forbidden' });

      const toasts = toastService.toasts$();
      expect(toasts[0].title).toBe('Error 403');
    });
  });

  describe('Success Notifications for Write Operations', () => {
    it('should show success toast for POST request', () => {
      // Arrange
      const { httpClient, httpTestingController, toastService } = setupTestBed();

      // Act
      httpClient.post('/api/users', { name: 'John' }).subscribe();

      // Assert
      const req = httpTestingController.expectOne('/api/users');
      req.flush({ id: 1, name: 'John' });

      const toasts = toastService.toasts$();
      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('success');
      expect(toasts[0].message).toBe('Operación realizada con éxito');
    });

    it('should show success toast for PUT request', () => {
      // Arrange
      const { httpClient, httpTestingController, toastService } = setupTestBed();

      // Act
      httpClient.put('/api/users/1', { name: 'John Updated' }).subscribe();

      // Assert
      const req = httpTestingController.expectOne('/api/users/1');
      req.flush({ id: 1, name: 'John Updated' });

      const toasts = toastService.toasts$();
      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('success');
    });

    it('should show success toast for PATCH request', () => {
      // Arrange
      const { httpClient, httpTestingController, toastService } = setupTestBed();

      // Act
      httpClient.patch('/api/users/1', { name: 'John Patched' }).subscribe();

      // Assert
      const req = httpTestingController.expectOne('/api/users/1');
      req.flush({ id: 1, name: 'John Patched' });

      const toasts = toastService.toasts$();
      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('success');
    });

    it('should show success toast for DELETE request', () => {
      // Arrange
      const { httpClient, httpTestingController, toastService } = setupTestBed();

      // Act
      httpClient.delete('/api/users/1').subscribe();

      // Assert
      const req = httpTestingController.expectOne('/api/users/1');
      req.flush({});

      const toasts = toastService.toasts$();
      expect(toasts.length).toBe(1);
      expect(toasts[0].type).toBe('success');
    });
  });

  describe('No Notifications for Read Operations', () => {
    it('should NOT show success toast for GET request', () => {
      // Arrange
      const { httpClient, httpTestingController, toastService } = setupTestBed();

      // Act
      httpClient.get('/api/users').subscribe();

      // Assert
      const req = httpTestingController.expectOne('/api/users');
      req.flush([{ id: 1, name: 'John' }]);

      const toasts = toastService.toasts$();
      expect(toasts.length).toBe(0);
    });

    it('should NOT show success toast for HEAD request', () => {
      // Arrange
      const { httpClient, httpTestingController, toastService } = setupTestBed();

      // Act
      httpClient.head('/api/users').subscribe();

      // Assert
      const req = httpTestingController.expectOne('/api/users');
      req.flush({});

      const toasts = toastService.toasts$();
      expect(toasts.length).toBe(0);
    });

    it('should NOT show success toast for OPTIONS request', () => {
      // Arrange
      const { httpClient, httpTestingController, toastService } = setupTestBed();

      // Act
      httpClient.options('/api/users').subscribe();

      // Assert
      const req = httpTestingController.expectOne('/api/users');
      req.flush({});

      const toasts = toastService.toasts$();
      expect(toasts.length).toBe(0);
    });
  });

  describe('Error Re-throwing', () => {
    it('should re-throw error so caller can handle it', () => {
      // Arrange
      const { httpClient, httpTestingController } = setupTestBed();
      let errorCaught = false;

      // Act
      httpClient.get('/api/users/1').subscribe({
        next: () => {
          // Expected path
        },
        error: (error) => {
          errorCaught = true;
          expect(error.status).toBe(404);
        },
      });

      // Assert
      const req = httpTestingController.expectOne('/api/users/1');
      req.flush({ message: 'Not found' }, { status: 404, statusText: 'Not Found' });

      expect(errorCaught).toBe(true);
    });
  });

  describe('Multiple Requests', () => {
    it('should handle multiple errors correctly', () => {
      // Arrange
      const { httpClient, httpTestingController, toastService } = setupTestBed();

      // Act
      httpClient.get('/api/users/1').subscribe({
        next: () => {
          // Expected path
        },
        error: () => {
          // Error case
        },
      });
      httpClient.get('/api/posts/1').subscribe({
        next: () => {
          // Expected path
        },
        error: () => {
          // Error case
        },
      });

      // Assert
      const req1 = httpTestingController.expectOne('/api/users/1');
      const req2 = httpTestingController.expectOne('/api/posts/1');

      req1.flush({ message: 'User not found' }, { status: 404, statusText: 'Not Found' });
      req2.flush({ message: 'Post not found' }, { status: 404, statusText: 'Not Found' });

      const toasts = toastService.toasts$();
      expect(toasts.length).toBe(2);
      expect(toasts[0].message).toBe('User not found');
      expect(toasts[1].message).toBe('Post not found');
    });

    it('should handle multiple successful write operations', () => {
      // Arrange
      const { httpClient, httpTestingController, toastService } = setupTestBed();

      // Act
      httpClient.post('/api/users', { name: 'User 1' }).subscribe();
      httpClient.post('/api/posts', { title: 'Post 1' }).subscribe();

      // Assert
      const req1 = httpTestingController.expectOne('/api/users');
      const req2 = httpTestingController.expectOne('/api/posts');

      req1.flush({ id: 1, name: 'User 1' });
      req2.flush({ id: 1, title: 'Post 1' });

      const toasts = toastService.toasts$();
      expect(toasts.length).toBe(2);
      expect(toasts[0].type).toBe('success');
      expect(toasts[1].type).toBe('success');
    });
  });
});
