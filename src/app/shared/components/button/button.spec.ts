import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
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
});

  describe('data-testid rendering', () => {
    it('should not render data-testid when not provided', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const button = compiled.querySelector('button[data-testid]');
      expect(button).toBeFalsy();
    });

    it('should render data-testid on button element (main element)', () => {
      fixture.componentRef.setInput('dataTestId', 'submit-btn');
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const button = compiled.querySelector('button[data-testid="submit-btn"]');
      expect(button).toBeTruthy();
    });

    it('should render data-testid on content with -content suffix', () => {
      fixture.componentRef.setInput('dataTestId', 'login');
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const content = compiled.querySelector('[data-testid="login-content"]');
      expect(content).toBeTruthy();
    });

    it('should render data-testid on spinner with -spinner suffix when loading', () => {
      fixture.componentRef.setInput('dataTestId', 'save');
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const spinner = compiled.querySelector('[data-testid="save-spinner"]');
      expect(spinner).toBeTruthy();
    });

    it('should render all data-testid attributes when loading', () => {
      fixture.componentRef.setInput('dataTestId', 'submit');
      fixture.componentRef.setInput('loading', true);
      fixture.componentRef.setInput('loadingText', 'Submitting...');
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('button[data-testid="submit"]')).toBeTruthy();
      expect(compiled.querySelector('[data-testid="submit-spinner"]')).toBeTruthy();
    });
  });
});
