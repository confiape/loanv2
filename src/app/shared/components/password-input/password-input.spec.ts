// Angular testing
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, inputBinding, outputBinding, signal } from '@angular/core';

// Testing library
import { within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

// Vitest
import { describe, it, expect } from 'vitest';

// Component under test
import { PasswordInput } from '@loan/app/shared/components/password-input/password-input';

describe('PasswordInput', () => {
  it('should create', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(PasswordInput, {
      bindings: [],
    });
    TestBed.tick();

    // Assert
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render password input by default', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(PasswordInput, {
      bindings: [],
    });
    TestBed.tick();

    // Assert
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.type).toBe('password');
  });

  it('should toggle visibility when button is clicked', async () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(PasswordInput, {
      bindings: [],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);
    const user = userEvent.setup();

    // Act
    const button = queries.getByRole('button');
    await user.click(button);
    TestBed.tick();

    // Assert
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.type).toBe('text');
  });

  it('should render visibility toggle icon', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(PasswordInput, {
      bindings: [],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const button = queries.getByRole('button');
    const icon = button.querySelector('ng-icon');
    expect(icon).toBeTruthy();
  });

  it('should emit visibilityChange output', async () => {
    // Arrange
    const visibilitySignal = signal(false);
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(PasswordInput, {
      bindings: [
        outputBinding('visibilityChange', (value: boolean) => visibilitySignal.set(value)),
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
    expect(visibilitySignal()).toBe(true);
  });

  it('should emit valueChange when typing', async () => {
    // Arrange
    const valueSignal = signal('');
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(PasswordInput, {
      bindings: [outputBinding('valueChange', (value: string) => valueSignal.set(value))],
    });
    TestBed.tick();
    const user = userEvent.setup();

    // Act
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    await user.type(input, 'secret');
    TestBed.tick();

    // Assert
    expect(valueSignal()).toBe('secret');
  });

  it('should update value when writeValue is called', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(PasswordInput, {
      bindings: [],
    });
    TestBed.tick();
    const component = fixture.componentInstance;

    // Act
    component.writeValue('updated');
    TestBed.tick();

    // Assert
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('updated');
  });

  it('should respect disabled state from forms API', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(PasswordInput, {
      bindings: [],
    });
    TestBed.tick();
    const component = fixture.componentInstance;

    // Act
    component.setDisabledState(true);
    TestBed.tick();

    // Assert
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('should forward host data-testid to inner input', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(PasswordInput, {
      bindings: [inputBinding('dataTestId', () => 'pwd-field')],
    });
    TestBed.tick();

    // Assert
    const inner = fixture.nativeElement.querySelector('app-input');
    expect(inner?.getAttribute('data-testid')).toBe('pwd-field');
  });
});
