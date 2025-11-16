import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  let component: Checkbox;
  let fixture: ComponentFixture<Checkbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Checkbox],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Checkbox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render checkbox input', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const checkbox = compiled.querySelector('input[type="checkbox"]');
    expect(checkbox).toBeTruthy();
  });

  it('should render label when provided', () => {
    fixture.componentRef.setInput('label', 'Accept Terms');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const label = compiled.querySelector('label');
    expect(label?.textContent?.trim()).toBe('Accept Terms');
  });

  it('should not render label when not provided', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const label = compiled.querySelector('label');
    expect(label).toBeFalsy();
  });

  it('should apply disabled state', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const checkbox = compiled.querySelector('input[type="checkbox"]');
    expect(checkbox?.disabled).toBe(true);
  });

  it('should emit valueChange on change', () => {
    let emittedValue = false;
    component.valueChange.subscribe((value) => {
      emittedValue = value;
    });

    const compiled = fixture.nativeElement as HTMLElement;
    const checkbox = compiled.querySelector('input[type="checkbox"]') as HTMLInputElement;
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));

    expect(emittedValue).toBe(true);
  });

  it('should render help text', () => {
    fixture.componentRef.setInput('label', 'Accept');
    fixture.componentRef.setInput('helpText', 'You must accept the terms');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('You must accept the terms');
  });

  it('should render success message when validation state is success', () => {
    fixture.componentRef.setInput('validationState', 'success');
    fixture.componentRef.setInput('successMessage', 'Accepted!');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const message = compiled.querySelector('p.text-success');
    expect(message?.textContent).toContain('Accepted!');
  });

  it('should render error message when validation state is error', () => {
    fixture.componentRef.setInput('validationState', 'error');
    fixture.componentRef.setInput('errorMessage', 'You must accept');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const message = compiled.querySelector('p.text-error');
    expect(message?.textContent).toContain('You must accept');
  });

  it('should apply small size classes', () => {
    fixture.componentRef.setInput('size', 'small');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const checkbox = compiled.querySelector('input[type="checkbox"]');
    expect(checkbox?.className).toContain('w-3');
    expect(checkbox?.className).toContain('h-3');
  });

  it('should apply large size classes', () => {
    fixture.componentRef.setInput('size', 'large');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const checkbox = compiled.querySelector('input[type="checkbox"]');
    expect(checkbox?.className).toContain('w-5');
    expect(checkbox?.className).toContain('h-5');
  });

  describe('ControlValueAccessor', () => {
    it('should write value', () => {
      component.writeValue(true);
      expect(component.value()).toBe(true);
    });

    it('should call onChange when checkbox changes', () => {
      let changedValue = false;
      component.registerOnChange((value) => {
        changedValue = value;
      });

      const compiled = fixture.nativeElement as HTMLElement;
      const checkbox = compiled.querySelector('input[type="checkbox"]') as HTMLInputElement;
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change'));

      expect(changedValue).toBe(true);
    });

    it('should call onTouched when checkbox loses focus', () => {
      let touched = false;
      component.registerOnTouched(() => {
        touched = true;
      });

      const compiled = fixture.nativeElement as HTMLElement;
      const checkbox = compiled.querySelector('input[type="checkbox"]') as HTMLInputElement;
      checkbox.dispatchEvent(new Event('blur'));

      expect(touched).toBe(true);
    });
  });

  describe('data-testid support', () => {
    it('should render test IDs with wrapper pattern when data-testid attribute is provided', async () => {
      @Component({
        template: `<app-checkbox
          data-testid="test-checkbox"
          label="Accept Terms"
          helpText="You must accept"
        ></app-checkbox>`,
        standalone: true,
        imports: [Checkbox],
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

      const hostElement = wrapperFixture.nativeElement.querySelector('app-checkbox');

      // Verify host has -wrapper suffix
      expect(hostElement.getAttribute('data-testid')).toBe('test-checkbox-wrapper');

      // Verify main element has original ID (no suffix)
      const input = hostElement.querySelector('input[type="checkbox"]');
      expect(input?.getAttribute('data-testid')).toBe('test-checkbox');

      // Verify auxiliary elements have suffixes
      const label = hostElement.querySelector('label');
      expect(label?.getAttribute('data-testid')).toBe('test-checkbox-label');

      const helpTextParagraphs = hostElement.querySelectorAll('p');
      const helpText = Array.from(helpTextParagraphs).find(p =>
        p.getAttribute('data-testid') === 'test-checkbox-help-text'
      );
      expect(helpText).toBeTruthy();
    });

    it('should render error message test ID with wrapper pattern when validation state is error', async () => {
      @Component({
        template: `<app-checkbox
          data-testid="test-checkbox"
          validationState="error"
          errorMessage="Required field"
        ></app-checkbox>`,
        standalone: true,
        imports: [Checkbox],
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

      const hostElement = wrapperFixture.nativeElement.querySelector('app-checkbox');

      // Verify host has -wrapper suffix
      expect(hostElement.getAttribute('data-testid')).toBe('test-checkbox-wrapper');

      // Verify error message test ID on correct element type
      const errorParagraphs = hostElement.querySelectorAll('p');
      const errorMessage = Array.from(errorParagraphs).find(p =>
        p.getAttribute('data-testid') === 'test-checkbox-error-message'
      );
      expect(errorMessage).toBeTruthy();
    });

    it('should not render test IDs when data-testid attribute is not provided', async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [Checkbox],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const standaloneFixture = TestBed.createComponent(Checkbox);
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
