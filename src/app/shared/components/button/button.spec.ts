import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { Button } from './button';

describe('Button', () => {
  let fixture: ComponentFixture<Button>;
  let component: Button;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Button);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getButtonElement(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button') as HTMLButtonElement;
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply solid primary classes by default', () => {
    const button = getButtonElement();
    expect(button.className).toContain('bg-accent');
    expect(button.className).toContain('text-white');
  });

  it('should emit buttonClick when enabled', () => {
    let clicked = false;
    component.buttonClick.subscribe(() => {
      clicked = true;
    });

    const button = getButtonElement();
    button.click();

    expect(clicked).toBeTruthy();
  });

  it('should not emit buttonClick when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    let clicked = false;
    component.buttonClick.subscribe(() => {
      clicked = true;
    });

    const button = getButtonElement();
    button.click();

    expect(clicked).toBeFalsy();
  });

  it('should render outline variant with border', () => {
    fixture.componentRef.setInput('variant', 'outline');
    fixture.detectChanges();

    const button = getButtonElement();
    expect(button.className).toContain('border');
  });

  it('should render pill shape', () => {
    fixture.componentRef.setInput('shape', 'pill');
    fixture.detectChanges();

    const button = getButtonElement();
    expect(button.className).toContain('rounded-full');
  });

  it('should display spinner and disable when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const button = getButtonElement();
    const spinner = fixture.nativeElement.querySelector('svg.animate-spin');

    expect(button.disabled).toBeTruthy();
    expect(spinner).toBeTruthy();
  });

  it('should stretch to full width when fullWidth is true', () => {
    fixture.componentRef.setInput('fullWidth', true);
    fixture.detectChanges();

    const button = getButtonElement();
    expect(button.className).toContain('w-full');
  });

  describe('data-testid support', () => {
    it('should render test ID on button when data-testid attribute is provided', async () => {
      @Component({
        template: `<app-button data-testid="test-button">Click me</app-button>`,
        standalone: true,
        imports: [Button],
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

      const buttonComponent = wrapperFixture.nativeElement.querySelector('app-button');
      const button = buttonComponent.querySelector('button');

      // Verify button has the test ID
      expect(button.getAttribute('data-testid')).toBe('test-button');
    });

    it('should render spinner test ID when loading', async () => {
      @Component({
        template: `<app-button data-testid="test-button" [loading]="true">Submit</app-button>`,
        standalone: true,
        imports: [Button],
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

      const buttonComponent = wrapperFixture.nativeElement.querySelector('app-button');

      // Verify spinner test ID
      expect(buttonComponent.querySelector('[data-testid="test-button-spinner"]')).toBeTruthy();
    });

    it('should not render test IDs when data-testid attribute is not provided', async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [Button],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const standaloneFixture = TestBed.createComponent(Button);
      standaloneFixture.componentRef.setInput('loading', true);
      standaloneFixture.detectChanges();

      // Verify NO test IDs are rendered
      const element = standaloneFixture.nativeElement;
      const elementsWithTestId = element.querySelectorAll('[data-testid]');
      expect(elementsWithTestId.length).toBe(0);
    });
  });
});
