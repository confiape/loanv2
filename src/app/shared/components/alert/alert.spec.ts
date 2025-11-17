// Angular testing
import { TestBed } from '@angular/core/testing';
import {
  provideZonelessChangeDetection,
  inputBinding,
  outputBinding,
  signal,
} from '@angular/core';

// Testing library
import { within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

// Vitest
import { describe, it, expect } from 'vitest';

// Component under test
import { Alert } from './alert';

describe('Alert', () => {
  it('should create', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Alert, {
      bindings: [],
    });
    TestBed.tick();

    // Assert
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render with default info variant', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Alert, {
      bindings: [],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const alertEl = queries.getByRole('alert');
    expect(alertEl).toBeTruthy();
    expect(alertEl.className).toContain('bg-accent/10');
  });

  it('should render success variant', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Alert, {
      bindings: [inputBinding('variant', () => 'success')],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const alertEl = queries.getByRole('alert');
    expect(alertEl.className).toContain('bg-success/10');
  });

  it('should render error variant', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Alert, {
      bindings: [inputBinding('variant', () => 'error')],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const alertEl = queries.getByRole('alert');
    expect(alertEl.className).toContain('bg-error/10');
  });

  it('should render warning variant', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Alert, {
      bindings: [inputBinding('variant', () => 'warning')],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const alertEl = queries.getByRole('alert');
    expect(alertEl.className).toContain('bg-warning/10');
  });

  it('should display icon by default', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Alert, {
      bindings: [],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const icon = queries.getByRole('alert').querySelector('ng-icon');
    expect(icon).toBeTruthy();
  });

  it('should hide icon when showIcon is false', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Alert, {
      bindings: [inputBinding('showIcon', () => false)],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const icon = queries.getByRole('alert').querySelector('ng-icon');
    expect(icon).toBeFalsy();
  });

  it('should render title when provided', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Alert, {
      bindings: [inputBinding('title', () => 'Test Title')],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const titleEl = queries.getByText('Test Title');
    expect(titleEl).toBeTruthy();
    expect(titleEl.className).toContain('font-medium');
  });

  it('should show dismiss button when dismissible is true', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Alert, {
      bindings: [inputBinding('dismissible', () => true)],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const closeBtn = queries.getByRole('button', { name: 'Close alert' });
    expect(closeBtn).toBeTruthy();
  });

  it('should not show dismiss button by default', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Alert, {
      bindings: [],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const closeBtn = queries.queryByRole('button', { name: 'Close alert' });
    expect(closeBtn).toBeNull();
  });

  it('should emit dismissed event when close button clicked', async () => {
    // Arrange
    const dismissedSignal = signal(false);
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Alert, {
      bindings: [
        inputBinding('dismissible', () => true),
        outputBinding('dismissed', () => dismissedSignal.set(true)),
      ],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);
    const user = userEvent.setup();

    // Act
    const closeBtn = queries.getByRole('button', { name: 'Close alert' });
    await user.click(closeBtn);
    TestBed.tick();

    // Assert
    expect(dismissedSignal()).toBe(true);
  });

  it('should apply border when withBorder is true', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Alert, {
      bindings: [inputBinding('withBorder', () => true)],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const alertEl = queries.getByRole('alert');
    expect(alertEl.className).toContain('border');
  });

  it('should have correct accessibility attributes', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Alert, {
      bindings: [],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const alertEl = queries.getByRole('alert');
    expect(alertEl.getAttribute('role')).toBe('alert');
    expect(alertEl.getAttribute('aria-live')).toBe('polite');
  });

  it('should hide icon aria from screen readers', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Alert, {
      bindings: [],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const iconContainer = queries.getByRole('alert').querySelector('.shrink-0');
    expect(iconContainer?.getAttribute('aria-hidden')).toBe('true');
  });

  describe('data-testid rendering', () => {
    it('should not render data-testid when not provided', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Alert, {
        bindings: [],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const alert = queries.queryByTestId('error-alert');
      expect(alert).toBeNull();
    });

    it('should render data-testid on alert element (main element)', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Alert, {
        bindings: [inputBinding('dataTestId', () => 'error-alert')],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const alert = queries.getByTestId('error-alert');
      expect(alert).toBeTruthy();
    });

    it('should render data-testid on icon with -icon suffix', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Alert, {
        bindings: [
          inputBinding('dataTestId', () => 'success-alert'),
          inputBinding('showIcon', () => true),
        ],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const icon = queries.getByTestId('success-alert-icon');
      expect(icon).toBeTruthy();
    });

    it('should render data-testid on content with -content suffix', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Alert, {
        bindings: [inputBinding('dataTestId', () => 'info-alert')],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const content = queries.getByTestId('info-alert-content');
      expect(content).toBeTruthy();
    });

    it('should render data-testid on close button with -close-btn suffix', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Alert, {
        bindings: [
          inputBinding('dataTestId', () => 'warning-alert'),
          inputBinding('dismissible', () => true),
        ],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const closeBtn = queries.getByTestId('warning-alert-close-btn');
      expect(closeBtn).toBeTruthy();
    });

    it('should render all data-testid attributes for dismissible alert', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Alert, {
        bindings: [
          inputBinding('dataTestId', () => 'notification'),
          inputBinding('dismissible', () => true),
          inputBinding('showIcon', () => true),
        ],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      expect(queries.getByTestId('notification')).toBeTruthy();
      expect(queries.getByTestId('notification-icon')).toBeTruthy();
      expect(queries.getByTestId('notification-content')).toBeTruthy();
      expect(queries.getByTestId('notification-close-btn')).toBeTruthy();
    });
  });
});
