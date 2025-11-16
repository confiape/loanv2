import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { MultiSelect, MultiSelectOption } from './multiselect';

describe('MultiSelect', () => {
  let component: MultiSelect;
  let fixture: ComponentFixture<MultiSelect>;

  const mockOptions: MultiSelectOption[] = [
    { value: 'US', label: 'United States' },
    { value: 'New York', label: 'New York' },
    { value: 'CA', label: 'California' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiSelect],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiSelect);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', mockOptions);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    expect(button).toBeTruthy();
  });

  it('should display placeholder when no selection', () => {
    fixture.componentRef.setInput('placeholder', 'Choose options');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Choose options');
  });

  it('should toggle dropdown on button click', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button') as HTMLButtonElement;

    expect(component.isOpen()).toBe(false);

    button.click();
    fixture.detectChanges();

    expect(component.isOpen()).toBe(true);
  });

  it('should render label when provided', () => {
    fixture.componentRef.setInput('label', 'Select Countries');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const label = compiled.querySelector('label');
    expect(label?.textContent?.trim()).toBe('Select Countries');
  });

  it('should render help text', () => {
    fixture.componentRef.setInput('helpText', 'Select multiple options');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const helpText = compiled.querySelector('p');
    expect(helpText?.textContent?.trim()).toBe('Select multiple options');
  });

  it('should apply disabled state', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    expect(button?.disabled).toBe(true);
  });

  describe('ControlValueAccessor', () => {
    it('should write value', () => {
      component.writeValue(['US', 'CA']);
      expect(component.value()).toEqual(['US', 'CA']);
    });

    it('should call onChange when option is toggled', () => {
      let changedValue: string[] = [];
      component.registerOnChange((value) => {
        changedValue = value;
      });

      component.writeValue([]);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const button = compiled.querySelector('button') as HTMLButtonElement;
      button.click();
      fixture.detectChanges();

      const checkbox = compiled.querySelector('input[type="checkbox"]') as HTMLInputElement;
      checkbox.click();
      fixture.detectChanges();

      expect(changedValue.length).toBeGreaterThan(0);
    });

    it('should call onTouched when dropdown closes', () => {
      let touched = false;
      component.registerOnTouched(() => {
        touched = true;
      });

      const compiled = fixture.nativeElement as HTMLElement;
      const button = compiled.querySelector('button') as HTMLButtonElement;
      button.click();
      fixture.detectChanges();

      // Close dropdown by clicking outside
      document.body.click();

      expect(touched).toBe(true);
    });
  });

  describe('data-testid support', () => {
    it('should render test IDs with wrapper pattern when data-testid attribute is provided', async () => {
      @Component({
        template: `<app-multiselect
          [testId]="'test-multiselect'"
          label="Countries"
          helpText="Select countries"
          [options]="options"
        ></app-multiselect>`,
        standalone: true,
        imports: [MultiSelect],
      })
      class TestWrapper {
        options = mockOptions;
      }

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [TestWrapper],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const wrapperFixture = TestBed.createComponent(TestWrapper);
      wrapperFixture.detectChanges();
      await wrapperFixture.whenStable();

      const hostElement = wrapperFixture.nativeElement.querySelector('app-multiselect');

      // Verify host has -wrapper suffix
      expect(hostElement.getAttribute('data-testid')).toBe('test-multiselect-wrapper');

      // Verify main element has original ID (no suffix)
      const button = hostElement.querySelector('button');
      expect(button?.getAttribute('data-testid')).toBe('test-multiselect');

      // Verify auxiliary elements have suffixes
      const label = hostElement.querySelector('label');
      expect(label?.getAttribute('data-testid')).toBe('test-multiselect-label');

      // Verify help text test ID on correct element type
      const helpTextParagraphs = hostElement.querySelectorAll('p');
      const helpText = (Array.from(helpTextParagraphs) as Element[]).find(p =>
        p.getAttribute('data-testid') === 'test-multiselect-help-text'
      );
      expect(helpText).toBeTruthy();

      // Open dropdown to verify dropdown and option test IDs
      button?.click();
      wrapperFixture.detectChanges();
      await wrapperFixture.whenStable();

      // Verify dropdown test ID on correct element type (div container)
      const dropdownDivs = hostElement.querySelectorAll('div');
      const dropdown = (Array.from(dropdownDivs) as Element[]).find(d =>
        d.getAttribute('data-testid') === 'test-multiselect-dropdown'
      );
      expect(dropdown).toBeTruthy();

      // Verify option test IDs with sanitized values on correct element types
      // Options are rendered as checkbox input elements
      const optionInputs = hostElement.querySelectorAll('input[type="checkbox"]');

      const optionUS = (Array.from(optionInputs) as Element[]).find(input =>
        input.getAttribute('data-testid') === 'test-multiselect-option-us'
      );
      expect(optionUS).toBeTruthy();

      const optionNewYork = (Array.from(optionInputs) as Element[]).find(input =>
        input.getAttribute('data-testid') === 'test-multiselect-option-new-york'
      );
      expect(optionNewYork).toBeTruthy();

      const optionCA = (Array.from(optionInputs) as Element[]).find(input =>
        input.getAttribute('data-testid') === 'test-multiselect-option-ca'
      );
      expect(optionCA).toBeTruthy();
    });

    it('should render error message test ID with wrapper pattern when validation state is error', async () => {
      @Component({
        template: `<app-multiselect
          [testId]="'test-multiselect'"
          validationState="error"
          errorMessage="This field is required"
          [options]="options"
        ></app-multiselect>`,
        standalone: true,
        imports: [MultiSelect],
      })
      class TestWrapper {
        options = mockOptions;
      }

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [TestWrapper],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const wrapperFixture = TestBed.createComponent(TestWrapper);
      wrapperFixture.detectChanges();
      await wrapperFixture.whenStable();

      const hostElement = wrapperFixture.nativeElement.querySelector('app-multiselect');

      // Verify host has -wrapper suffix
      expect(hostElement.getAttribute('data-testid')).toBe('test-multiselect-wrapper');

      // Verify error message test ID on correct element type
      const errorParagraphs = hostElement.querySelectorAll('p');
      const errorMessage = (Array.from(errorParagraphs) as Element[]).find(p =>
        p.getAttribute('data-testid') === 'test-multiselect-error-message'
      );
      expect(errorMessage).toBeTruthy();
    });

    it('should not render test IDs when data-testid attribute is not provided', async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [MultiSelect],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const standaloneFixture = TestBed.createComponent(MultiSelect);
      standaloneFixture.componentRef.setInput('label', 'Test Label');
      standaloneFixture.componentRef.setInput('helpText', 'Help text');
      standaloneFixture.componentRef.setInput('options', mockOptions);
      standaloneFixture.detectChanges();

      // Open dropdown
      const button = standaloneFixture.nativeElement.querySelector('button') as HTMLButtonElement;
      button.click();
      standaloneFixture.detectChanges();

      // Verify NO test IDs are rendered
      const element = standaloneFixture.nativeElement;
      const elementsWithTestId = element.querySelectorAll('[data-testid]');
      expect(elementsWithTestId.length).toBe(0);
    });
  });
});
