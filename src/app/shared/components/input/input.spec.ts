import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass, heroEyeSlash } from '@ng-icons/heroicons/outline';

import { Input } from '@loan/app/shared/components/input/input';

describe('Input', () => {
  let component: Input;
  let fixture: ComponentFixture<Input>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Input],
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Input);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render input element', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input');
    expect(input).toBeTruthy();
  });

  it('should apply default type', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input');
    expect(input?.type).toBe('text');
  });

  it('should render label when provided', () => {
    fixture.componentRef.setInput('label', 'Test Label');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const label = compiled.querySelector('label');
    expect(label?.textContent?.trim()).toBe('Test Label');
  });

  it('should not render label when not provided', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const label = compiled.querySelector('label');
    expect(label).toBeFalsy();
  });

  it('should apply placeholder', () => {
    fixture.componentRef.setInput('placeholder', 'Enter text');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input');
    expect(input?.placeholder).toBe('Enter text');
  });

  it('should apply disabled state', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input');
    expect(input?.disabled).toBe(true);
  });

  it('should apply readonly state', () => {
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input');
    expect(input?.readOnly).toBe(true);
  });

  it('should emit valueChange on input', () => {
    let emittedValue = '';
    component.valueChange.subscribe((value) => {
      emittedValue = value;
    });

    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input') as HTMLInputElement;
    input.value = 'test value';
    input.dispatchEvent(new Event('input'));

    expect(emittedValue).toBe('test value');
  });

  it('should render help text', () => {
    fixture.componentRef.setInput('helpText', 'This is help text');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const helpText = compiled.querySelector('p');
    expect(helpText?.textContent?.trim()).toBe('This is help text');
  });

  it('should render success message when validation state is success', () => {
    fixture.componentRef.setInput('validationState', 'success');
    fixture.componentRef.setInput('successMessage', 'Success!');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const message = compiled.querySelector('p');
    expect(message?.textContent).toContain('Success!');
  });

  it('should render error message when validation state is error', () => {
    fixture.componentRef.setInput('validationState', 'error');
    fixture.componentRef.setInput('errorMessage', 'Error!');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const message = compiled.querySelector('p');
    expect(message?.textContent).toContain('Error!');
  });

  it('should render prefix icon when provided', () => {
    fixture.componentRef.setInput('prefixIcon', 'heroMagnifyingGlass');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const icon = compiled.querySelector('ng-icon');
    expect(icon).toBeTruthy();
  });

  it('should render suffix icon when provided', () => {
    fixture.componentRef.setInput('suffixIcon', 'heroEyeSlash');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const icon = compiled.querySelector('ng-icon');
    expect(icon).toBeTruthy();
  });

  it('should render suffix button when enabled', () => {
    fixture.componentRef.setInput('suffixButton', true);
    fixture.componentRef.setInput('suffixButtonText', 'Search');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    expect(button?.textContent?.trim()).toBe('Search');
  });

  it('should render suffix button icon when provided', () => {
    fixture.componentRef.setInput('suffixButton', true);
    fixture.componentRef.setInput('suffixButtonIcon', 'heroEyeSlash');
    fixture.componentRef.setInput('suffixButtonAriaLabel', 'Toggle');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const icon = compiled.querySelector('button ng-icon');
    const button = compiled.querySelector('button');
    expect(icon).toBeTruthy();
    expect(button?.getAttribute('aria-label')).toBe('Toggle');
  });

  it('should emit suffixButtonClick when suffix button is clicked', () => {
    let clicked = false;
    component.suffixButtonClick.subscribe(() => {
      clicked = true;
    });

    fixture.componentRef.setInput('suffixButton', true);
    fixture.componentRef.setInput('suffixButtonText', 'Click');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(clicked).toBe(true);
  });

  it('should apply small size classes', () => {
    fixture.componentRef.setInput('size', 'small');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input');
    expect(input?.className).toContain('p-2');
    expect(input?.className).toContain('text-xs');
  });

  it('should apply large size classes', () => {
    fixture.componentRef.setInput('size', 'large');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input');
    expect(input?.className).toContain('p-4');
    expect(input?.className).toContain('text-base');
  });

  it('should apply custom input id', () => {
    fixture.componentRef.setInput('inputId', 'custom-id');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input');
    expect(input?.id).toBe('custom-id');
  });

  it('should link label to input via for attribute', () => {
    fixture.componentRef.setInput('label', 'Test');
    fixture.componentRef.setInput('inputId', 'test-id');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const label = compiled.querySelector('label');
    const input = compiled.querySelector('input');
    expect(label?.getAttribute('for')).toBe('test-id');
    expect(input?.id).toBe('test-id');
  });

  describe('ControlValueAccessor', () => {
    it('should write value', () => {
      component.writeValue('test');
      expect(component.value()).toBe('test');
    });

    it('should call onChange when input changes', () => {
      let changedValue = '';
      component.registerOnChange((value) => {
        changedValue = value;
      });

      const compiled = fixture.nativeElement as HTMLElement;
      const input = compiled.querySelector('input') as HTMLInputElement;
      input.value = 'new value';
      input.dispatchEvent(new Event('input'));

      expect(changedValue).toBe('new value');
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
