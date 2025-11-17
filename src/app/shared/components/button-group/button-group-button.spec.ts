import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, inputBinding, outputBinding, signal } from '@angular/core';
import { within } from '@testing-library/dom';
import { vi } from 'vitest';
import { ButtonGroupButton } from './button-group-button';

describe('ButtonGroupButton', () => {
  const defaultProviders = [provideZonelessChangeDetection()];

  it('should render button', () => {
    // Arrange & Act
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(ButtonGroupButton);
    TestBed.tick();

    const queries = within(fixture.nativeElement);

    // Assert
    const button = queries.getByRole('button');
    expect(button).toBeTruthy();
  });

  it('should emit click event when clicked', () => {
    // Arrange
    const clickedSignal = signal(false);
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(ButtonGroupButton, {
      bindings: [outputBinding('buttonClick', () => clickedSignal.set(true))],
    });
    TestBed.tick();

    const queries = within(fixture.nativeElement);
    const button = queries.getByRole('button');

    // Act
    button.click();
    TestBed.tick();

    // Assert
    expect(clickedSignal()).toBe(true);
  });

  it('should not emit click when disabled', () => {
    // Arrange
    const clickedSignal = signal(false);
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(ButtonGroupButton, {
      bindings: [
        inputBinding('disabled', () => true),
        outputBinding('buttonClick', () => clickedSignal.set(true)),
      ],
    });
    TestBed.tick();

    const queries = within(fixture.nativeElement);
    const button = queries.getByRole('button');

    // Act
    button.click();
    TestBed.tick();

    // Assert
    expect(clickedSignal()).toBe(false);
  });

  it('should apply first position styles', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(ButtonGroupButton, {
      bindings: [inputBinding('position', () => 'first' as const)],
    });
    TestBed.tick();

    const queries = within(fixture.nativeElement);

    // Act & Assert
    const button = queries.getByRole('button');
    expect(button.className).toContain('rounded-s-lg');
  });

  it('should apply last position styles', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(ButtonGroupButton, {
      bindings: [inputBinding('position', () => 'last' as const)],
    });
    TestBed.tick();

    const queries = within(fixture.nativeElement);

    // Act & Assert
    const button = queries.getByRole('button');
    expect(button.className).toContain('rounded-e-lg');
  });

  it('should apply middle position styles', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(ButtonGroupButton, {
      bindings: [inputBinding('position', () => 'middle' as const)],
    });
    TestBed.tick();

    const queries = within(fixture.nativeElement);

    // Act & Assert
    const button = queries.getByRole('button');
    expect(button.className).toContain('border-t');
    expect(button.className).toContain('border-b');
  });

  it('should apply only position styles', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(ButtonGroupButton, {
      bindings: [inputBinding('position', () => 'only' as const)],
    });
    TestBed.tick();

    const queries = within(fixture.nativeElement);

    // Act & Assert
    const button = queries.getByRole('button');
    expect(button.className).toContain('rounded-s-lg');
    expect(button.className).toContain('rounded-e-lg');
  });

  it('should apply outline variant styles', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(ButtonGroupButton, {
      bindings: [inputBinding('variant', () => 'outline' as const)],
    });
    TestBed.tick();

    const queries = within(fixture.nativeElement);

    // Act & Assert
    const button = queries.getByRole('button');
    expect(button.className).toContain('bg-transparent');
  });

  it('should apply default variant styles', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(ButtonGroupButton, {
      bindings: [inputBinding('variant', () => 'default' as const)],
    });
    TestBed.tick();

    const queries = within(fixture.nativeElement);

    // Act & Assert
    const button = queries.getByRole('button');
    expect(button.className).toContain('bg-bg-primary');
  });

  it('should render different button types', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(ButtonGroupButton, {
      bindings: [inputBinding('type', () => 'submit')],
    });
    TestBed.tick();

    const queries = within(fixture.nativeElement);

    // Act & Assert
    const button = queries.getByRole('button') as HTMLButtonElement;
    expect(button.type).toBe('submit');
  });

  it('should apply disabled state', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(ButtonGroupButton, {
      bindings: [inputBinding('disabled', () => true)],
    });
    TestBed.tick();

    const queries = within(fixture.nativeElement);

    // Act & Assert
    const button = queries.getByRole('button') as HTMLButtonElement;
    expect(button.disabled).toBeTruthy();
    expect(button.className).toContain('opacity-50');
    expect(button.className).toContain('cursor-not-allowed');
  });
});
