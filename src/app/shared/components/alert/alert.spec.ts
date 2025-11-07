import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Alert } from './alert';

describe('Alert', () => {
  let fixture: ComponentFixture<Alert>;
  let component: Alert;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alert],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Alert);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render with default info variant', () => {
    const alertEl = fixture.nativeElement.querySelector('[role="alert"]');
    expect(alertEl).toBeTruthy();
    expect(alertEl.className).toContain('bg-accent/10');
  });

  it('should render success variant', () => {
    fixture.componentRef.setInput('variant', 'success');
    fixture.detectChanges();

    const alertEl = fixture.nativeElement.querySelector('[role="alert"]');
    expect(alertEl.className).toContain('bg-success/10');
  });

  it('should render error variant', () => {
    fixture.componentRef.setInput('variant', 'error');
    fixture.detectChanges();

    const alertEl = fixture.nativeElement.querySelector('[role="alert"]');
    expect(alertEl.className).toContain('bg-error/10');
  });

  it('should render warning variant', () => {
    fixture.componentRef.setInput('variant', 'warning');
    fixture.detectChanges();

    const alertEl = fixture.nativeElement.querySelector('[role="alert"]');
    expect(alertEl.className).toContain('bg-warning/10');
  });

  it('should display icon by default', () => {
    const iconDiv = fixture.nativeElement.querySelector('.shrink-0.inline.me-3');
    expect(iconDiv).toBeTruthy();
  });

  it('should hide icon when showIcon is false', () => {
    fixture.componentRef.setInput('showIcon', false);
    fixture.detectChanges();

    const iconDiv = fixture.nativeElement.querySelector('.shrink-0.inline.me-3');
    expect(iconDiv).toBeFalsy();
  });

  it('should render title when provided', () => {
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.detectChanges();

    const titleEl = fixture.nativeElement.querySelector('.font-medium');
    expect(titleEl).toBeTruthy();
    expect(titleEl.textContent).toContain('Test Title');
  });

  it('should show dismiss button when dismissible is true', () => {
    fixture.componentRef.setInput('dismissible', true);
    fixture.detectChanges();

    const closeBtn = fixture.nativeElement.querySelector('button[aria-label="Close alert"]');
    expect(closeBtn).toBeTruthy();
  });

  it('should not show dismiss button by default', () => {
    const closeBtn = fixture.nativeElement.querySelector('button[aria-label="Close alert"]');
    expect(closeBtn).toBeFalsy();
  });

  it('should emit dismissed event when close button clicked', () => {
    fixture.componentRef.setInput('dismissible', true);
    fixture.detectChanges();

    let dismissed = false;
    component.dismissed.subscribe(() => {
      dismissed = true;
    });

    const closeBtn = fixture.nativeElement.querySelector(
      'button[aria-label="Close alert"]',
    ) as HTMLButtonElement;
    closeBtn.click();

    expect(dismissed).toBeTruthy();
  });

  it('should apply border when withBorder is true', () => {
    fixture.componentRef.setInput('withBorder', true);
    fixture.detectChanges();

    const alertEl = fixture.nativeElement.querySelector('[role="alert"]');
    expect(alertEl.className).toContain('border');
  });

  it('should have correct accessibility attributes', () => {
    const alertEl = fixture.nativeElement.querySelector('[role="alert"]');
    expect(alertEl.getAttribute('role')).toBe('alert');
    expect(alertEl.getAttribute('aria-live')).toBe('polite');
  });

  it('should hide icon aria from screen readers', () => {
    const iconContainer = fixture.nativeElement.querySelector('.shrink-0');
    expect(iconContainer.getAttribute('aria-hidden')).toBe('true');
  });
});
