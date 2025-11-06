import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Select } from './select';
import { provideZonelessChangeDetection } from '@angular/core';

describe('Select', () => {
  let component: Select;
  let fixture: ComponentFixture<Select>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Select],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Select);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render select element', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const select = compiled.querySelector('select');
    expect(select).toBeTruthy();
  });

  it('should render label when provided', () => {
    fixture.componentRef.setInput('label', 'Choose Country');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const label = compiled.querySelector('label');
    expect(label?.textContent?.trim()).toBe('Choose Country');
  });

  it('should not render label when not provided', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const label = compiled.querySelector('label');
    expect(label).toBeFalsy();
  });

  it('should render placeholder option when provided', () => {
    fixture.componentRef.setInput('placeholder', 'Select an option');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const options = compiled.querySelectorAll('option');
    expect(options[0]?.textContent?.trim()).toBe('Select an option');
    expect(options[0]?.disabled).toBe(true);
  });

  it('should render options from input', () => {
    const options = [
      { value: 'US', label: 'United States' },
      { value: 'CA', label: 'Canada' },
      { value: 'FR', label: 'France' },
    ];
    fixture.componentRef.setInput('options', options);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const optionElements = compiled.querySelectorAll('option');

    expect(optionElements.length).toBe(3);
    expect(optionElements[0]?.value).toBe('US');
    expect(optionElements[0]?.textContent?.trim()).toBe('United States');
  });

  it('should apply disabled state', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const select = compiled.querySelector('select');
    expect(select?.disabled).toBe(true);
  });

  it('should render disabled options', () => {
    const options = [
      { value: 'US', label: 'United States' },
      { value: 'CA', label: 'Canada', disabled: true },
    ];
    fixture.componentRef.setInput('options', options);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const optionElements = compiled.querySelectorAll('option');

    expect(optionElements[0]?.disabled).toBe(false);
    expect(optionElements[1]?.disabled).toBe(true);
  });

  it('should emit valueChange on selection', () => {
    let emittedValue = '';
    component.valueChange.subscribe((value) => {
      emittedValue = value;
    });

    const options = [
      { value: 'US', label: 'United States' },
      { value: 'CA', label: 'Canada' },
    ];
    fixture.componentRef.setInput('options', options);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const select = compiled.querySelector('select') as HTMLSelectElement;
    select.value = 'CA';
    select.dispatchEvent(new Event('change'));

    expect(emittedValue).toBe('CA');
  });

  it('should render help text', () => {
    fixture.componentRef.setInput('helpText', 'Select your country');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const helpText = compiled.querySelector('p');
    expect(helpText?.textContent?.trim()).toBe('Select your country');
  });

  it('should render success message when validation state is success', () => {
    fixture.componentRef.setInput('validationState', 'success');
    fixture.componentRef.setInput('successMessage', 'Valid selection!');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const message = compiled.querySelector('p');
    expect(message?.textContent).toContain('Valid selection!');
  });

  it('should render error message when validation state is error', () => {
    fixture.componentRef.setInput('validationState', 'error');
    fixture.componentRef.setInput('errorMessage', 'Please select an option');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const message = compiled.querySelector('p');
    expect(message?.textContent).toContain('Please select an option');
  });

  it('should apply small size classes', () => {
    fixture.componentRef.setInput('size', 'small');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const select = compiled.querySelector('select');
    expect(select?.className).toContain('p-2');
    expect(select?.className).toContain('text-sm');
  });

  it('should apply large size classes', () => {
    fixture.componentRef.setInput('size', 'large');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const select = compiled.querySelector('select');
    expect(select?.className).toContain('px-4');
    expect(select?.className).toContain('py-3');
    expect(select?.className).toContain('text-base');
  });

  it('should apply custom select id', () => {
    fixture.componentRef.setInput('selectId', 'custom-id');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const select = compiled.querySelector('select');
    expect(select?.id).toBe('custom-id');
  });

  it('should link label to select via for attribute', () => {
    fixture.componentRef.setInput('label', 'Country');
    fixture.componentRef.setInput('selectId', 'country-select');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const label = compiled.querySelector('label');
    const select = compiled.querySelector('select');
    expect(label?.getAttribute('for')).toBe('country-select');
    expect(select?.id).toBe('country-select');
  });

  describe('ControlValueAccessor', () => {
    it('should write value', () => {
      component.writeValue('US');
      expect(component.value()).toBe('US');
    });

    it('should call onChange when selection changes', () => {
      let changedValue = '';
      component.registerOnChange((value) => {
        changedValue = value;
      });

      const options = [
        { value: 'US', label: 'United States' },
        { value: 'CA', label: 'Canada' },
      ];
      fixture.componentRef.setInput('options', options);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const select = compiled.querySelector('select') as HTMLSelectElement;
      select.value = 'CA';
      select.dispatchEvent(new Event('change'));

      expect(changedValue).toBe('CA');
    });

    it('should call onTouched when select loses focus', () => {
      let touched = false;
      component.registerOnTouched(() => {
        touched = true;
      });

      const compiled = fixture.nativeElement as HTMLElement;
      const select = compiled.querySelector('select') as HTMLSelectElement;
      select.dispatchEvent(new Event('blur'));

      expect(touched).toBe(true);
    });
  });
});
