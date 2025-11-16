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
    it('should render test IDs when data-testid attribute is provided', async () => {
      @Component({
        template: `<app-multiselect
          data-testid="test-multiselect"
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

      const multiselectComponent = wrapperFixture.nativeElement.querySelector('app-multiselect');

      // Verify label, button, and help text test IDs
      expect(multiselectComponent.querySelector('[data-testid="test-multiselect-label"]')).toBeTruthy();
      expect(multiselectComponent.querySelector('[data-testid="test-multiselect-button"]')).toBeTruthy();
      expect(multiselectComponent.querySelector('[data-testid="test-multiselect-help-text"]')).toBeTruthy();

      // Open dropdown to verify dropdown and option test IDs
      const button = multiselectComponent.querySelector('button') as HTMLButtonElement;
      button.click();
      wrapperFixture.detectChanges();
      await wrapperFixture.whenStable();

      // Verify dropdown test ID
      expect(multiselectComponent.querySelector('[data-testid="test-multiselect-dropdown"]')).toBeTruthy();

      // Verify option test IDs with sanitized values
      expect(multiselectComponent.querySelector('[data-testid="test-multiselect-option-us"]')).toBeTruthy();
      expect(multiselectComponent.querySelector('[data-testid="test-multiselect-option-new-york"]')).toBeTruthy();
      expect(multiselectComponent.querySelector('[data-testid="test-multiselect-option-ca"]')).toBeTruthy();
    });

    it('should render error message test ID when validation state is error', async () => {
      @Component({
        template: `<app-multiselect
          data-testid="test-multiselect"
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

      const multiselectComponent = wrapperFixture.nativeElement.querySelector('app-multiselect');

      // Verify error message test ID
      expect(multiselectComponent.querySelector('[data-testid="test-multiselect-error-message"]')).toBeTruthy();
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
