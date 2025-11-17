import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { within } from '@testing-library/dom';
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default rendering', () => {
    it('should apply solid primary classes by default', () => {
      const screen = within(fixture.nativeElement);
      const button = screen.getByRole<HTMLButtonElement>('button');

      expect(button.className).toContain('bg-accent');
      expect(button.className).toContain('text-white');
    });

    it('should render button with type="button" by default', () => {
      const screen = within(fixture.nativeElement);
      const button = screen.getByRole<HTMLButtonElement>('button');

      expect(button.type).toBe('button');
    });
  });

  describe('variants', () => {
    it('should render outline variant with border', () => {
      fixture.componentRef.setInput('variant', 'outline');
      fixture.detectChanges();

      const screen = within(fixture.nativeElement);
      const button = screen.getByRole<HTMLButtonElement>('button');

      expect(button.className).toContain('border');
    });

    it('should render ghost variant', () => {
      fixture.componentRef.setInput('variant', 'ghost');
      fixture.detectChanges();

      const screen = within(fixture.nativeElement);
      const button = screen.getByRole<HTMLButtonElement>('button');

      expect(button.className).toContain('bg-transparent');
    });
  });

  describe('tones', () => {
    it('should apply primary tone by default', () => {
      const screen = within(fixture.nativeElement);
      const button = screen.getByRole<HTMLButtonElement>('button');

      expect(button.className).toContain('bg-accent');
    });

    it('should apply danger tone', () => {
      fixture.componentRef.setInput('tone', 'danger');
      fixture.detectChanges();

      const screen = within(fixture.nativeElement);
      const button = screen.getByRole<HTMLButtonElement>('button');

      expect(button.className).toContain('bg-red-600');
    });
  });

  describe('sizes', () => {
    it('should apply md size by default', () => {
      const screen = within(fixture.nativeElement);
      const button = screen.getByRole<HTMLButtonElement>('button');

      expect(button.className).toContain('px-4');
    });

    it('should apply sm size', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();

      const screen = within(fixture.nativeElement);
      const button = screen.getByRole<HTMLButtonElement>('button');

      expect(button.className).toContain('px-3');
      expect(button.className).toContain('text-sm');
    });

    it('should apply lg size', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();

      const screen = within(fixture.nativeElement);
      const button = screen.getByRole<HTMLButtonElement>('button');

      expect(button.className).toContain('px-6');
      expect(button.className).toContain('text-lg');
    });
  });

  describe('shapes', () => {
    it('should apply rounded shape by default', () => {
      const screen = within(fixture.nativeElement);
      const button = screen.getByRole<HTMLButtonElement>('button');

      expect(button.className).toContain('rounded-md');
    });

    it('should render pill shape', () => {
      fixture.componentRef.setInput('shape', 'pill');
      fixture.detectChanges();

      const screen = within(fixture.nativeElement);
      const button = screen.getByRole<HTMLButtonElement>('button');

      expect(button.className).toContain('rounded-full');
    });

    it('should apply square shape', () => {
      fixture.componentRef.setInput('shape', 'square');
      fixture.detectChanges();

      const screen = within(fixture.nativeElement);
      const button = screen.getByRole<HTMLButtonElement>('button');

      expect(button.className).toContain('rounded-none');
    });
  });

  describe('states', () => {
    it('should disable button when disabled is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const screen = within(fixture.nativeElement);
      const button = screen.getByRole<HTMLButtonElement>('button');

      expect(button.disabled).toBe(true);
    });

    it('should display spinner and disable when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const screen = within(fixture.nativeElement);
      const button = screen.getByRole<HTMLButtonElement>('button');

      expect(button.disabled).toBe(true);
      expect(button.getAttribute('aria-busy')).toBe('true');
    });

    it('should show loading spinner when loading', () => {
      fixture.componentRef.setInput('dataTestId', 'submit');
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const screen = within(fixture.nativeElement);
      const spinner = screen.getByTestId('submit-spinner');

      expect(spinner).toBeTruthy();
    });

    it('should not show content when loading', () => {
      fixture.componentRef.setInput('dataTestId', 'submit');
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const screen = within(fixture.nativeElement);
      const content = screen.queryByTestId('submit-content');

      expect(content).toBeNull();
    });

    it('should show content when not loading', () => {
      fixture.componentRef.setInput('dataTestId', 'submit');
      fixture.componentRef.setInput('loading', false);
      fixture.detectChanges();

      const screen = within(fixture.nativeElement);
      const content = screen.getByTestId('submit-content');

      expect(content).toBeTruthy();
    });
  });

  describe('layout', () => {
    it('should stretch to full width when fullWidth is true', () => {
      fixture.componentRef.setInput('fullWidth', true);
      fixture.detectChanges();

      const screen = within(fixture.nativeElement);
      const button = screen.getByRole<HTMLButtonElement>('button');

      expect(button.className).toContain('w-full');
    });

    it('should not be full width by default', () => {
      const screen = within(fixture.nativeElement);
      const button = screen.getByRole<HTMLButtonElement>('button');

      expect(button.className).not.toContain('w-full');
    });
  });

  describe('events', () => {
    it('should emit buttonClick when enabled', () => {
      let clicked = false;
      component.buttonClick.subscribe(() => {
        clicked = true;
      });

      const screen = within(fixture.nativeElement);
      const button = screen.getByRole<HTMLButtonElement>('button');
      button.click();

      expect(clicked).toBe(true);
    });

    it('should not emit buttonClick when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      let clicked = false;
      component.buttonClick.subscribe(() => {
        clicked = true;
      });

      const screen = within(fixture.nativeElement);
      const button = screen.getByRole<HTMLButtonElement>('button');
      button.click();

      expect(clicked).toBe(false);
    });

    it('should not emit buttonClick when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      let clicked = false;
      component.buttonClick.subscribe(() => {
        clicked = true;
      });

      const screen = within(fixture.nativeElement);
      const button = screen.getByRole<HTMLButtonElement>('button');
      button.click();

      expect(clicked).toBe(false);
    });
  });

  describe('accessibility', () => {
    it('should apply aria-label when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Submit form');
      fixture.detectChanges();

      const screen = within(fixture.nativeElement);
      const button = screen.getByRole<HTMLButtonElement>('button');

      expect(button.getAttribute('aria-label')).toBe('Submit form');
    });

    it('should not have aria-label when not provided', () => {
      const screen = within(fixture.nativeElement);
      const button = screen.getByRole<HTMLButtonElement>('button');

      expect(button.hasAttribute('aria-label')).toBe(false);
    });

    it('should set aria-busy when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const screen = within(fixture.nativeElement);
      const button = screen.getByRole<HTMLButtonElement>('button');

      expect(button.getAttribute('aria-busy')).toBe('true');
    });

    it('should not set aria-busy when not loading', () => {
      fixture.componentRef.setInput('loading', false);
      fixture.detectChanges();

      const screen = within(fixture.nativeElement);
      const button = screen.getByRole<HTMLButtonElement>('button');

      expect(button.getAttribute('aria-busy')).toBe('false');
    });
  });

  describe('data-testid', () => {
    it('should not render data-testid when not provided', () => {
      const screen = within(fixture.nativeElement);
      const button = screen.queryByTestId('submit');

      expect(button).toBeNull();
    });

    it('should render data-testid on button element', () => {
      fixture.componentRef.setInput('dataTestId', 'submit-btn');
      fixture.detectChanges();

      const screen = within(fixture.nativeElement);
      const button = screen.getByTestId('submit-btn');

      expect(button).toBeTruthy();
      expect(button.tagName).toBe('BUTTON');
    });

    it('should render data-testid on content with -content suffix', () => {
      fixture.componentRef.setInput('dataTestId', 'login');
      fixture.detectChanges();

      const screen = within(fixture.nativeElement);
      const content = screen.getByTestId('login-content');

      expect(content).toBeTruthy();
    });

    it('should render data-testid on spinner with -spinner suffix when loading', () => {
      fixture.componentRef.setInput('dataTestId', 'save');
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const screen = within(fixture.nativeElement);
      const spinner = screen.getByTestId('save-spinner');

      expect(spinner).toBeTruthy();
    });

    it('should render all data-testid attributes when loading', () => {
      fixture.componentRef.setInput('dataTestId', 'submit');
      fixture.componentRef.setInput('loading', true);
      fixture.componentRef.setInput('loadingText', 'Submitting...');
      fixture.detectChanges();

      const screen = within(fixture.nativeElement);
      const button = screen.getByTestId('submit');
      const spinner = screen.getByTestId('submit-spinner');

      expect(button).toBeTruthy();
      expect(spinner).toBeTruthy();
    });
  });
});
