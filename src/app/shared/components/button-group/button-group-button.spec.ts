import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ButtonGroupButton } from './button-group-button';

// Wrapper component for testing data-testid attribute
@Component({
  template: `<app-button-group-button [testId]="'test-button'">Test</app-button-group-button>`,
  standalone: true,
  imports: [ButtonGroupButton],
})
class TestWrapperComponent {}

describe('ButtonGroupButton', () => {
  let fixture: ComponentFixture<ButtonGroupButton>;
  let component: ButtonGroupButton;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonGroupButton],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonGroupButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getButtonElement(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button') as HTMLButtonElement;
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render button', () => {
    const button = getButtonElement();
    expect(button).toBeTruthy();
  });

  it('should emit click event when clicked', () => {
    let clicked = false;
    component.buttonClick.subscribe(() => {
      clicked = true;
    });

    const button = getButtonElement();
    button.click();

    expect(clicked).toBeTruthy();
  });

  it('should not emit click when disabled', () => {
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

  it('should apply first position styles', () => {
    fixture.componentRef.setInput('position', 'first');
    fixture.detectChanges();

    const button = getButtonElement();
    expect(button.className).toContain('rounded-s-lg');
  });

  it('should apply last position styles', () => {
    fixture.componentRef.setInput('position', 'last');
    fixture.detectChanges();

    const button = getButtonElement();
    expect(button.className).toContain('rounded-e-lg');
  });

  it('should apply middle position styles', () => {
    fixture.componentRef.setInput('position', 'middle');
    fixture.detectChanges();

    const button = getButtonElement();
    expect(button.className).toContain('border-t');
    expect(button.className).toContain('border-b');
  });

  it('should apply only position styles', () => {
    fixture.componentRef.setInput('position', 'only');
    fixture.detectChanges();

    const button = getButtonElement();
    expect(button.className).toContain('rounded-s-lg');
    expect(button.className).toContain('rounded-e-lg');
  });

  it('should apply outline variant styles', () => {
    fixture.componentRef.setInput('variant', 'outline');
    fixture.detectChanges();

    const button = getButtonElement();
    expect(button.className).toContain('bg-transparent');
  });

  it('should apply default variant styles', () => {
    fixture.componentRef.setInput('variant', 'default');
    fixture.detectChanges();

    const button = getButtonElement();
    expect(button.className).toContain('bg-bg-primary');
  });

  it('should render different button types', () => {
    fixture.componentRef.setInput('type', 'submit');
    fixture.detectChanges();

    const button = getButtonElement();
    expect(button.getAttribute('type')).toBe('submit');
  });

  it('should apply disabled state', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const button = getButtonElement();
    expect(button.disabled).toBeTruthy();
    expect(button.className).toContain('opacity-50');
    expect(button.className).toContain('cursor-not-allowed');
  });

  describe('data-testid support', () => {
    it('should render test IDs with wrapper pattern when data-testid attribute is provided', async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [TestWrapperComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const wrapperFixture = TestBed.createComponent(TestWrapperComponent);
      wrapperFixture.detectChanges();
      await wrapperFixture.whenStable();

      const hostElement = wrapperFixture.nativeElement.querySelector('app-button-group-button');

      // Verify host has -wrapper suffix
      expect(hostElement.getAttribute('data-testid')).toBe('test-button-wrapper');

      // Verify main element has original ID
      const button = hostElement.querySelector('button');
      expect(button?.getAttribute('data-testid')).toBe('test-button');
    });

    it('should not render test ID when data-testid attribute is not provided', async () => {
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button');

      // Verify NO test ID
      expect(button?.hasAttribute('data-testid')).toBe(false);
    });
  });
});
