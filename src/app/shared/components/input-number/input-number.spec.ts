import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass, heroChevronUp, heroChevronDown } from '@ng-icons/heroicons/outline';

import { InputNumber } from '@loan/app/shared/components/input-number/input-number';

describe('InputNumber', () => {
  let component: InputNumber;
  let fixture: ComponentFixture<InputNumber>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputNumber],
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroChevronUp, heroChevronDown }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InputNumber);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render input element with type number', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input');
    expect(input).toBeTruthy();
    expect(input?.type).toBe('number');
  });

  it('should render label when provided', () => {
    fixture.componentRef.setInput('label', 'Quantity');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const label = compiled.querySelector('label');
    expect(label?.textContent?.trim()).toBe('Quantity');
  });

  it('should apply min and max attributes', () => {
    fixture.componentRef.setInput('min', 0);
    fixture.componentRef.setInput('max', 100);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input');
    expect(input?.min).toBe('0');
    expect(input?.max).toBe('100');
  });

  it('should apply step attribute', () => {
    fixture.componentRef.setInput('step', 5);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input');
    expect(input?.step).toBe('5');
  });

  it('should show increment and decrement buttons by default', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('button');
    expect(buttons.length).toBe(2);
  });

  it('should render prefix icon when provided', () => {
    fixture.componentRef.setInput('prefixIcon', 'heroMagnifyingGlass');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const icon = compiled.querySelector('ng-icon');
    expect(icon).not.toBeNull();
  });

  it('should hide buttons when showButtons is false', () => {
    fixture.componentRef.setInput('showButtons', false);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('button');
    expect(buttons.length).toBe(0);
  });

  it('should increment value when increment button is clicked', () => {
    component.writeValue(5);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const incrementButton = compiled.querySelectorAll('button')[0];
    incrementButton.click();

    expect(component.value()).toBe(6);
  });

  it('should decrement value when decrement button is clicked', () => {
    component.writeValue(5);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const decrementButton = compiled.querySelectorAll('button')[1];
    decrementButton.click();

    expect(component.value()).toBe(4);
  });

  it('should respect min value when decrementing', () => {
    fixture.componentRef.setInput('min', 0);
    component.writeValue(0);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const decrementButton = compiled.querySelectorAll('button')[1];
    decrementButton.click();

    expect(component.value()).toBe(0);
  });

  it('should respect max value when incrementing', () => {
    fixture.componentRef.setInput('max', 10);
    component.writeValue(10);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const incrementButton = compiled.querySelectorAll('button')[0];
    incrementButton.click();

    expect(component.value()).toBe(10);
  });

  it('should increment by step value', () => {
    fixture.componentRef.setInput('step', 5);
    component.writeValue(0);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const incrementButton = compiled.querySelectorAll('button')[0];
    incrementButton.click();

    expect(component.value()).toBe(5);
  });

  it('should emit valueChange on increment', () => {
    let emittedValue: number | null = null;
    component.valueChange.subscribe((value) => {
      emittedValue = value;
    });

    component.writeValue(5);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const incrementButton = compiled.querySelectorAll('button')[0];
    incrementButton.click();

    expect(emittedValue).toBe(6 as any);
  });

  it('should emit valueChange on input', () => {
    let emittedValue: number | null = null;
    component.valueChange.subscribe((value) => {
      emittedValue = value;
    });

    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input') as HTMLInputElement;
    input.value = '42';
    input.dispatchEvent(new Event('input'));

    expect(emittedValue).toBe(42 as any);
  });

  it('should disable increment button when max is reached', () => {
    fixture.componentRef.setInput('max', 10);
    component.writeValue(10);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const incrementButton = compiled.querySelectorAll('button')[0] as HTMLButtonElement;

    expect(incrementButton.disabled).toBe(true);
  });

  it('should disable decrement button when min is reached', () => {
    fixture.componentRef.setInput('min', 0);
    component.writeValue(0);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const decrementButton = compiled.querySelectorAll('button')[1] as HTMLButtonElement;

    expect(decrementButton.disabled).toBe(true);
  });

  it('should render help text', () => {
    fixture.componentRef.setInput('helpText', 'Enter a number between 1-100');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const helpText = compiled.querySelector('p');
    expect(helpText?.textContent?.trim()).toBe('Enter a number between 1-100');
  });

  it('should render success message when validation state is success', () => {
    fixture.componentRef.setInput('validationState', 'success');
    fixture.componentRef.setInput('successMessage', 'Valid number!');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const message = compiled.querySelector('p');
    expect(message?.textContent).toContain('Valid number!');
  });

  it('should render error message when validation state is error', () => {
    fixture.componentRef.setInput('validationState', 'error');
    fixture.componentRef.setInput('errorMessage', 'Number out of range!');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const message = compiled.querySelector('p');
    expect(message?.textContent).toContain('Number out of range!');
  });

  it('should handle null value', () => {
    component.writeValue(null);
    expect(component.value()).toBeNull();
  });

  it('should parse input value to number', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input') as HTMLInputElement;
    input.value = '123.45';
    input.dispatchEvent(new Event('input'));

    expect(component.value()).toBe(123.45);
  });

  it('should treat empty input as null', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input') as HTMLInputElement;
    input.value = '';
    input.dispatchEvent(new Event('input'));

    expect(component.value()).toBeNull();
  });

  describe('ControlValueAccessor', () => {
    it('should write value', () => {
      component.writeValue(42);
      expect(component.value()).toBe(42);
    });

    it('should call onChange when value changes', () => {
      let changedValue: number | null = null;
      component.registerOnChange((value) => {
        changedValue = value;
      });

      const compiled = fixture.nativeElement as HTMLElement;
      const input = compiled.querySelector('input') as HTMLInputElement;
      input.value = '99';
      input.dispatchEvent(new Event('input'));

      expect(changedValue).toBe(99 as any);
    });

    it('should call onTouched when input loses focus', () => {
      let touched = false;
      component.registerOnTouched(() => {
        touched = true;
      });

      const compiled = fixture.nativeElement as HTMLElement;
      const input = compiled.querySelector('input') as HTMLInputElement;
      input.dispatchEvent(new Event('blur'));

      expect(touched).toBe(true);
    });
  });
});
