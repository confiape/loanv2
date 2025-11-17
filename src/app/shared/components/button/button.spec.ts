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
import { Button } from './button';

describe('Button', () => {
  it('should create', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Button, {
      bindings: [],
    });
    TestBed.tick();

    // Assert
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should apply solid primary classes by default', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Button, {
      bindings: [],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const button = queries.getByRole('button');
    expect(button.className).toContain('bg-accent');
    expect(button.className).toContain('text-white');
  });

  it('should emit buttonClick when enabled', async () => {
    // Arrange
    const clickedSignal = signal(false);
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Button, {
      bindings: [outputBinding('buttonClick', () => clickedSignal.set(true))],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);
    const user = userEvent.setup();

    // Act
    const button = queries.getByRole('button');
    await user.click(button);
    TestBed.tick();

    // Assert
    expect(clickedSignal()).toBe(true);
  });

  it('should not emit buttonClick when disabled', async () => {
    // Arrange
    const clickedSignal = signal(false);
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Button, {
      bindings: [
        inputBinding('disabled', () => true),
        outputBinding('buttonClick', () => clickedSignal.set(true)),
      ],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);
    const user = userEvent.setup();

    // Act
    const button = queries.getByRole('button');
    await user.click(button);
    TestBed.tick();

    // Assert
    expect(clickedSignal()).toBe(false);
  });

  it('should render outline variant with border', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Button, {
      bindings: [inputBinding('variant', () => 'outline')],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const button = queries.getByRole('button');
    expect(button.className).toContain('border');
  });

  it('should render pill shape', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Button, {
      bindings: [inputBinding('shape', () => 'pill')],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const button = queries.getByRole('button');
    expect(button.className).toContain('rounded-full');
  });

  it('should display spinner and disable when loading', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Button, {
      bindings: [inputBinding('loading', () => true)],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const button = queries.getByRole('button');
    const spinner = queries.getByRole('button').querySelector('svg.animate-spin');
    expect(button.hasAttribute('disabled')).toBe(true);
    expect(spinner).toBeTruthy();
  });

  it('should stretch to full width when fullWidth is true', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Button, {
      bindings: [inputBinding('fullWidth', () => true)],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const button = queries.getByRole('button');
    expect(button.className).toContain('w-full');
  });

  describe('data-testid rendering', () => {
    it('should not render data-testid when not provided', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Button, {
        bindings: [],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const button = queries.queryByTestId('submit-btn');
      expect(button).toBeNull();
    });

    it('should render data-testid on button element (main element)', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Button, {
        bindings: [inputBinding('dataTestId', () => 'submit-btn')],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const button = queries.getByTestId('submit-btn');
      expect(button).toBeTruthy();
    });

    it('should render data-testid on content with -content suffix', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Button, {
        bindings: [inputBinding('dataTestId', () => 'login')],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const content = queries.getByTestId('login-content');
      expect(content).toBeTruthy();
    });

    it('should render data-testid on spinner with -spinner suffix when loading', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Button, {
        bindings: [
          inputBinding('dataTestId', () => 'save'),
          inputBinding('loading', () => true),
        ],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const spinner = queries.getByTestId('save-spinner');
      expect(spinner).toBeTruthy();
    });

    it('should render all data-testid attributes when loading', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Button, {
        bindings: [
          inputBinding('dataTestId', () => 'submit'),
          inputBinding('loading', () => true),
          inputBinding('loadingText', () => 'Submitting...'),
        ],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      expect(queries.getByTestId('submit')).toBeTruthy();
      expect(queries.getByTestId('submit-spinner')).toBeTruthy();
    });
  });
});
