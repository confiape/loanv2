import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { DateInput } from './date-input';

describe('DateInput', () => {
  let component: DateInput;
  let fixture: ComponentFixture<DateInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateInput],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(DateInput);
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

  it('should apply date type', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input');
    expect(input?.type).toBe('date');
  });

  it('should render label when provided', () => {
    fixture.componentRef.setInput('label', 'Birth Date');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const label = compiled.querySelector('label');
    expect(label?.textContent?.trim()).toBe('Birth Date');
  });

  it('should not render label when not provided', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const label = compiled.querySelector('label');
    expect(label).toBeFalsy();
  });

  it('should apply placeholder', () => {
    fixture.componentRef.setInput('placeholder', 'Select date');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input');
    expect(input?.placeholder).toBe('Select date');
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

  it('should apply min date', () => {
    fixture.componentRef.setInput('min', '2024-01-01');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input');
    expect(input?.min).toBe('2024-01-01');
  });

  it('should apply max date', () => {
    fixture.componentRef.setInput('max', '2024-12-31');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input');
    expect(input?.max).toBe('2024-12-31');
  });

  it('should emit valueChange on input', () => {
    let emittedValue = '';
    component.valueChange.subscribe((value) => {
      emittedValue = value;
    });

    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input') as HTMLInputElement;
    input.value = '2024-03-15';
    input.dispatchEvent(new Event('input'));

    expect(emittedValue).toBe('2024-03-15');
  });

  it('should render help text', () => {
    fixture.componentRef.setInput('helpText', 'Select your birth date');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const helpText = compiled.querySelector('p');
    expect(helpText?.textContent?.trim()).toBe('Select your birth date');
  });

  it('should render success message when validation state is success', () => {
    fixture.componentRef.setInput('validationState', 'success');
    fixture.componentRef.setInput('successMessage', 'Date is valid!');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const message = compiled.querySelector('p');
    expect(message?.textContent).toContain('Date is valid!');
  });

  it('should render error message when validation state is error', () => {
    fixture.componentRef.setInput('validationState', 'error');
    fixture.componentRef.setInput('errorMessage', 'Invalid date');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const message = compiled.querySelector('p');
    expect(message?.textContent).toContain('Invalid date');
  });

  it('should render calendar icon', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const icon = compiled.querySelector('svg');
    expect(icon).toBeTruthy();
  });

  describe('ControlValueAccessor', () => {
    it('should write value', () => {
      component.writeValue('2024-03-15');
      expect(component.value()).toBe('2024-03-15');
    });

    it('should call onChange when input changes', () => {
      let changedValue = '';
      component.registerOnChange((value) => {
        changedValue = value;
      });

      const compiled = fixture.nativeElement as HTMLElement;
      const input = compiled.querySelector('input') as HTMLInputElement;
      input.value = '2024-03-15';
      input.dispatchEvent(new Event('input'));

      expect(changedValue).toBe('2024-03-15');
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

  describe('data-testid support', () => {
    it('should render test IDs with wrapper pattern when data-testid attribute is provided', async () => {
      @Component({
        template: `<app-date-input
          data-testid="test-date"
          label="Birth Date"
          helpText="Enter your birth date"
        ></app-date-input>`,
        standalone: true,
        imports: [DateInput],
      })
      class TestWrapper {}

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [TestWrapper],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const wrapperFixture = TestBed.createComponent(TestWrapper);
      wrapperFixture.detectChanges();
      await wrapperFixture.whenStable();

      const hostElement = wrapperFixture.nativeElement.querySelector('app-date-input');

      // Verify host has -wrapper suffix
      expect(hostElement.getAttribute('data-testid')).toBe('test-date-wrapper');

      // Verify main element has original ID (no suffix)
      const input = hostElement.querySelector('input');
      expect(input?.getAttribute('data-testid')).toBe('test-date');

      // Verify auxiliary elements have suffixes
      const label = hostElement.querySelector('label');
      expect(label?.getAttribute('data-testid')).toBe('test-date-label');

      const helpTextParagraphs = hostElement.querySelectorAll('p');
      const helpText = Array.from(helpTextParagraphs).find(p =>
        p.getAttribute('data-testid') === 'test-date-help-text'
      );
      expect(helpText).toBeTruthy();
    });

    it('should render error message test ID with wrapper pattern when validation state is error', async () => {
      @Component({
        template: `<app-date-input
          data-testid="test-date"
          validationState="error"
          errorMessage="Invalid date"
        ></app-date-input>`,
        standalone: true,
        imports: [DateInput],
      })
      class TestWrapper {}

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [TestWrapper],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const wrapperFixture = TestBed.createComponent(TestWrapper);
      wrapperFixture.detectChanges();
      await wrapperFixture.whenStable();

      const hostElement = wrapperFixture.nativeElement.querySelector('app-date-input');

      // Verify host has -wrapper suffix
      expect(hostElement.getAttribute('data-testid')).toBe('test-date-wrapper');

      // Verify error message test ID on correct element type
      const errorParagraphs = hostElement.querySelectorAll('p');
      const errorMessage = Array.from(errorParagraphs).find(p =>
        p.getAttribute('data-testid') === 'test-date-error-message'
      );
      expect(errorMessage).toBeTruthy();
    });

    it('should not render test IDs when data-testid attribute is not provided', async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [DateInput],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const standaloneFixture = TestBed.createComponent(DateInput);
      standaloneFixture.componentRef.setInput('label', 'Test Label');
      standaloneFixture.componentRef.setInput('helpText', 'Help text');
      standaloneFixture.detectChanges();

      // Verify NO test IDs are rendered
      const element = standaloneFixture.nativeElement;
      const elementsWithTestId = element.querySelectorAll('[data-testid]');
      expect(elementsWithTestId.length).toBe(0);
    });
  });
});
