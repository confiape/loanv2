import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';

import { PasswordInput } from '@loan/app/shared/components/password-input/password-input';

// Wrapper component for testing data-testid attribute
@Component({
  template: `<app-password-input data-testid="pwd-field"></app-password-input>`,
  standalone: true,
  imports: [PasswordInput],
})
class TestWrapperComponent {}

describe('PasswordInput', () => {
  let fixture: ComponentFixture<PasswordInput>;
  let component: PasswordInput;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordInput],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render password input by default', () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.type).toBe('password');
  });

  it('should toggle visibility when button is clicked', () => {
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.type).toBe('text');
  });

  it('should render visibility toggle icon', () => {
    const icon = fixture.nativeElement.querySelector('button ng-icon');
    expect(icon).toBeTruthy();
  });

  it('should emit visibilityChange output', () => {
    let emitted = false;
    component.visibilityChange.subscribe((value) => {
      emitted = value;
    });

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(emitted).toBe(true);
  });

  it('should emit valueChange when typing', () => {
    let emitted = '';
    component.valueChange.subscribe((value) => {
      emitted = value;
    });

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'secret';
    input.dispatchEvent(new Event('input'));

    expect(emitted).toBe('secret');
  });

  it('should update value when writeValue is called', () => {
    component.writeValue('updated');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('updated');
  });

  it('should respect disabled state from forms API', () => {
    component.setDisabledState(true);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('should forward host data-testid to inner input', async () => {
    // Reset TestBed to configure it fresh for this test
    TestBed.resetTestingModule();

    // Configure test module with wrapper component
    await TestBed.configureTestingModule({
      imports: [TestWrapperComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    // Create wrapper component that has data-testid attribute
    const wrapperFixture = TestBed.createComponent(TestWrapperComponent);
    wrapperFixture.detectChanges();
    await wrapperFixture.whenStable();

    // Find the inner app-input element
    const passwordInput = wrapperFixture.nativeElement.querySelector('app-password-input');
    const inner = passwordInput.querySelector('app-input');

    // Verify that data-testid was forwarded to the inner input component
    expect(inner.getAttribute('data-testid')).toBe('pwd-field');
  });
});
