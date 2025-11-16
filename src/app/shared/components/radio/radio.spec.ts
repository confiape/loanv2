import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { RadioGroup, RadioOption } from './radio';

describe('RadioGroup', () => {
  let component: RadioGroup;
  let fixture: ComponentFixture<RadioGroup>;

  const mockOptions: RadioOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioGroup],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(RadioGroup);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', mockOptions);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render radio inputs', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const radios = compiled.querySelectorAll('input[type="radio"]');
    expect(radios.length).toBe(3);
  });

  it('should render group label when provided', () => {
    fixture.componentRef.setInput('label', 'Choose One');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const label = compiled.querySelector('label[data-testid]') || compiled.querySelector('label');
    expect(label?.textContent?.trim()).toBe('Choose One');
  });

  it('should render option labels', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Option 1');
    expect(compiled.textContent).toContain('Option 2');
    expect(compiled.textContent).toContain('Option 3');
  });

  it('should apply disabled state', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const radios = compiled.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => {
      expect((radio as HTMLInputElement).disabled).toBe(true);
    });
  });

  it('should emit valueChange on selection', () => {
    let emittedValue = '';
    component.valueChange.subscribe((value) => {
      emittedValue = value;
    });

    const compiled = fixture.nativeElement as HTMLElement;
    const radio = compiled.querySelector('input[type="radio"]') as HTMLInputElement;
    radio.checked = true;
    radio.dispatchEvent(new Event('change'));

    expect(emittedValue).toBe('option1');
  });

  it('should render help text', () => {
    fixture.componentRef.setInput('helpText', 'Select one option');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Select one option');
  });

  it('should render success message when validation state is success', () => {
    fixture.componentRef.setInput('validationState', 'success');
    fixture.componentRef.setInput('successMessage', 'Valid selection!');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const message = compiled.querySelector('p.text-success');
    expect(message?.textContent).toContain('Valid selection!');
  });

  it('should render error message when validation state is error', () => {
    fixture.componentRef.setInput('validationState', 'error');
    fixture.componentRef.setInput('errorMessage', 'Please select an option');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const message = compiled.querySelector('p.text-error');
    expect(message?.textContent).toContain('Please select an option');
  });

  it('should apply small size classes', () => {
    fixture.componentRef.setInput('size', 'small');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const radio = compiled.querySelector('input[type="radio"]');
    expect(radio?.className).toContain('w-3');
    expect(radio?.className).toContain('h-3');
  });

  it('should apply large size classes', () => {
    fixture.componentRef.setInput('size', 'large');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const radio = compiled.querySelector('input[type="radio"]');
    expect(radio?.className).toContain('w-5');
    expect(radio?.className).toContain('h-5');
  });

  it('should apply inline layout when inline is true', () => {
    fixture.componentRef.setInput('inline', true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const container = compiled.querySelector('.flex');
    expect(container?.className).toContain('flex-row');
    expect(container?.className).toContain('gap-4');
  });

  it('should disable individual option when option.disabled is true', () => {
    const optionsWithDisabled: RadioOption[] = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2', disabled: true },
      { value: 'option3', label: 'Option 3' },
    ];
    fixture.componentRef.setInput('options', optionsWithDisabled);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const radios = compiled.querySelectorAll('input[type="radio"]');
    expect((radios[0] as HTMLInputElement).disabled).toBe(false);
    expect((radios[1] as HTMLInputElement).disabled).toBe(true);
    expect((radios[2] as HTMLInputElement).disabled).toBe(false);
  });

  describe('ControlValueAccessor', () => {
    it('should write value', () => {
      component.writeValue('option2');
      expect(component.value()).toBe('option2');
    });

    it('should call onChange when radio changes', () => {
      let changedValue = '';
      component.registerOnChange((value) => {
        changedValue = value;
      });

      const compiled = fixture.nativeElement as HTMLElement;
      const radio = compiled.querySelector('input[value="option1"]') as HTMLInputElement;
      radio.checked = true;
      radio.dispatchEvent(new Event('change'));

      expect(changedValue).toBe('option1');
    });

    it('should call onTouched when radio loses focus', () => {
      let touched = false;
      component.registerOnTouched(() => {
        touched = true;
      });

      const compiled = fixture.nativeElement as HTMLElement;
      const radio = compiled.querySelector('input[type="radio"]') as HTMLInputElement;
      radio.dispatchEvent(new Event('blur'));

      expect(touched).toBe(true);
    });
  });

  describe('data-testid support', () => {
    it('should render test IDs with wrapper pattern when data-testid attribute is provided', async () => {
      @Component({
        template: `<app-radio-group
          data-testid="test-radio"
          label="Choose Option"
          helpText="Select one"
          [options]="options"
        ></app-radio-group>`,
        standalone: true,
        imports: [RadioGroup],
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

      const hostElement = wrapperFixture.nativeElement.querySelector('app-radio-group');

      // Verify host has -wrapper suffix
      expect(hostElement.getAttribute('data-testid')).toBe('test-radio-wrapper');

      // Verify container has original ID
      const container = hostElement.querySelector('[role="radiogroup"]');
      expect(container?.getAttribute('data-testid')).toBe('test-radio');

      // Verify auxiliary elements have suffixes
      // Note: The group label is the first label, other labels are for individual options
      const allLabels = hostElement.querySelectorAll('label');
      const groupLabel = Array.from(allLabels).find(l =>
        l.getAttribute('data-testid') === 'test-radio-label'
      );
      expect(groupLabel).toBeTruthy();

      // Verify help text test ID on correct element type
      const helpTextParagraphs = hostElement.querySelectorAll('p');
      const helpText = Array.from(helpTextParagraphs).find(p =>
        p.getAttribute('data-testid') === 'test-radio-help-text'
      );
      expect(helpText).toBeTruthy();

      // Verify radio input test IDs with indices on correct element types
      const radioInputs = hostElement.querySelectorAll('input[type="radio"]');
      expect(radioInputs[0]?.getAttribute('data-testid')).toBe('test-radio-radio-0');
      expect(radioInputs[1]?.getAttribute('data-testid')).toBe('test-radio-radio-1');
      expect(radioInputs[2]?.getAttribute('data-testid')).toBe('test-radio-radio-2');

      // Verify label test IDs with indices on correct element types
      const optionLabel0 = Array.from(allLabels).find(l =>
        l.getAttribute('data-testid') === 'test-radio-label-0'
      );
      expect(optionLabel0).toBeTruthy();

      const optionLabel1 = Array.from(allLabels).find(l =>
        l.getAttribute('data-testid') === 'test-radio-label-1'
      );
      expect(optionLabel1).toBeTruthy();

      const optionLabel2 = Array.from(allLabels).find(l =>
        l.getAttribute('data-testid') === 'test-radio-label-2'
      );
      expect(optionLabel2).toBeTruthy();
    });

    it('should render error message test ID with wrapper pattern when validation state is error', async () => {
      @Component({
        template: `<app-radio-group
          data-testid="test-radio"
          validationState="error"
          errorMessage="Required field"
          [options]="options"
        ></app-radio-group>`,
        standalone: true,
        imports: [RadioGroup],
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

      const hostElement = wrapperFixture.nativeElement.querySelector('app-radio-group');

      // Verify host has -wrapper suffix
      expect(hostElement.getAttribute('data-testid')).toBe('test-radio-wrapper');

      // Verify error message test ID on correct element type
      const errorParagraphs = hostElement.querySelectorAll('p');
      const errorMessage = Array.from(errorParagraphs).find(p =>
        p.getAttribute('data-testid') === 'test-radio-error-message'
      );
      expect(errorMessage).toBeTruthy();
    });

    it('should not render test IDs when data-testid attribute is not provided', async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [RadioGroup],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const standaloneFixture = TestBed.createComponent(RadioGroup);
      standaloneFixture.componentRef.setInput('label', 'Test Label');
      standaloneFixture.componentRef.setInput('helpText', 'Help text');
      standaloneFixture.componentRef.setInput('options', mockOptions);
      standaloneFixture.detectChanges();

      // Verify NO test IDs are rendered
      const element = standaloneFixture.nativeElement;
      const elementsWithTestId = element.querySelectorAll('[data-testid]');
      expect(elementsWithTestId.length).toBe(0);
    });
  });
});
