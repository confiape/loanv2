import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { PasswordInput } from '@loan/app/shared/components/password-input/password-input';

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

  it('should forward host data-testid to inner input', () => {
    fixture.componentRef.setInput('dataTestId', 'pwd-field');
    fixture.detectChanges();

    const inner = fixture.nativeElement.querySelector('app-input');
    expect(inner.getAttribute('data-testid')).toBe('pwd-field');
  });
});
