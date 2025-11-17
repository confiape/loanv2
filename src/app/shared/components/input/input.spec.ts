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

  describe('data-testid rendering', () => {
    it('should not render any data-testid attributes when dataTestId is not provided', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      const wrapper = compiled.querySelector('[data-testid]');
      expect(wrapper).toBeFalsy();
    });

    it('should render data-testid on input element (main element)', () => {
      fixture.componentRef.setInput('dataTestId', 'email');
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      const input = compiled.querySelector('input[data-testid="email"]');
      expect(input).toBeTruthy();
    });

    it('should render data-testid on wrapper with -wrapper suffix', () => {
      fixture.componentRef.setInput('dataTestId', 'email');
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      const wrapper = compiled.querySelector('[data-testid="email-wrapper"]');
      expect(wrapper).toBeTruthy();
    });

    it('should render data-testid on label with -label suffix', () => {
      fixture.componentRef.setInput('dataTestId', 'email');
      fixture.componentRef.setInput('label', 'Email Address');
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      const label = compiled.querySelector('label[data-testid="email-label"]');
      expect(label).toBeTruthy();
      expect(label?.textContent?.trim()).toBe('Email Address');
    });

    it('should render data-testid on prefix icon with -prefix-icon suffix', () => {
      fixture.componentRef.setInput('dataTestId', 'search');
      fixture.componentRef.setInput('prefixIcon', 'heroMagnifyingGlass');
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      const iconWrapper = compiled.querySelector('[data-testid="search-prefix-icon"]');
      expect(iconWrapper).toBeTruthy();
    });

    it('should render data-testid on suffix icon with -suffix-icon suffix', () => {
      fixture.componentRef.setInput('dataTestId', 'password');
      fixture.componentRef.setInput('suffixIcon', 'heroEyeSlash');
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      const iconWrapper = compiled.querySelector('[data-testid="password-suffix-icon"]');
      expect(iconWrapper).toBeTruthy();
    });

    it('should render data-testid on suffix button with -suffix-btn suffix', () => {
      fixture.componentRef.setInput('dataTestId', 'search');
      fixture.componentRef.setInput('suffixButton', true);
      fixture.componentRef.setInput('suffixButtonText', 'Search');
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      const button = compiled.querySelector('button[data-testid="search-suffix-btn"]');
      expect(button).toBeTruthy();
    });

    it('should render data-testid on help text with -help suffix', () => {
      fixture.componentRef.setInput('dataTestId', 'username');
      fixture.componentRef.setInput('helpText', 'Choose a unique username');
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      const helpText = compiled.querySelector('p[data-testid="username-help"]');
      expect(helpText).toBeTruthy();
      expect(helpText?.textContent?.trim()).toBe('Choose a unique username');
    });

    it('should render data-testid on success message with -success suffix', () => {
      fixture.componentRef.setInput('dataTestId', 'email');
      fixture.componentRef.setInput('validationState', 'success');
      fixture.componentRef.setInput('successMessage', 'Email is valid');
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      const successMsg = compiled.querySelector('p[data-testid="email-success"]');
      expect(successMsg).toBeTruthy();
      expect(successMsg?.textContent).toContain('Email is valid');
    });

    it('should render data-testid on error message with -error suffix', () => {
      fixture.componentRef.setInput('dataTestId', 'email');
      fixture.componentRef.setInput('validationState', 'error');
      fixture.componentRef.setInput('errorMessage', 'Invalid email format');
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      const errorMsg = compiled.querySelector('p[data-testid="email-error"]');
      expect(errorMsg).toBeTruthy();
      expect(errorMsg?.textContent).toContain('Invalid email format');
    });

    it('should render all data-testid attributes for complete form', () => {
      fixture.componentRef.setInput('dataTestId', 'contact-email');
      fixture.componentRef.setInput('label', 'Email');
      fixture.componentRef.setInput('prefixIcon', 'heroMagnifyingGlass');
      fixture.componentRef.setInput('suffixButton', true);
      fixture.componentRef.setInput('suffixButtonText', 'Verify');
      fixture.componentRef.setInput('helpText', 'We will never share your email');
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.querySelector('[data-testid="contact-email-wrapper"]')).toBeTruthy();
      expect(compiled.querySelector('[data-testid="contact-email-label"]')).toBeTruthy();
      expect(compiled.querySelector('input[data-testid="contact-email"]')).toBeTruthy();
      expect(compiled.querySelector('[data-testid="contact-email-prefix-icon"]')).toBeTruthy();
      expect(compiled.querySelector('button[data-testid="contact-email-suffix-btn"]')).toBeTruthy();
      expect(compiled.querySelector('[data-testid="contact-email-help"]')).toBeTruthy();
    });
  });
});
