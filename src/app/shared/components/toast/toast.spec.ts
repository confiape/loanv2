import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import {ToastComponent} from '@loan/app/shared/components/toast/toast';

describe('Toast', () => {
  let fixture: ComponentFixture<ToastComponent>;
  let component: ToastComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render with default info variant', () => {
    const toastEl = fixture.nativeElement.querySelector('[role="alert"]');
    expect(toastEl).toBeTruthy();
  });

  it('should display message', () => {
    fixture.componentRef.setInput('message', 'Test message');
    fixture.detectChanges();

    const messageEl = fixture.nativeElement.querySelector('.text-text-secondary');
    expect(messageEl.textContent).toContain('Test message');
  });

  it('should display title when provided', () => {
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.detectChanges();

    const titleEl = fixture.nativeElement.querySelector('.font-semibold');
    expect(titleEl).toBeTruthy();
    expect(titleEl.textContent).toContain('Test Title');
  });

  it('should show dismiss button when dismissible', () => {
    fixture.componentRef.setInput('dismissible', true);
    fixture.detectChanges();

    const closeBtn = fixture.nativeElement.querySelector('button[aria-label="Close"]');
    expect(closeBtn).toBeTruthy();
  });

  it('should emit closed event when dismiss button clicked', () => {
    fixture.componentRef.setInput('dismissible', true);
    fixture.detectChanges();

    let closed = false;
    component.closed.subscribe(() => {
      closed = true;
    });

    const closeBtn = fixture.nativeElement.querySelector(
      'button[aria-label="Close"]',
    ) as HTMLButtonElement;
    closeBtn.click();

    expect(closed).toBeTruthy();
  });

  it('should display icon by default', () => {
    const iconDiv = fixture.nativeElement.querySelector('.inline-flex.shrink-0.items-center');
    expect(iconDiv).toBeTruthy();
  });

  it('should hide icon when showIcon is false', () => {
    fixture.componentRef.setInput('showIcon', false);
    fixture.detectChanges();

    const iconDiv = fixture.nativeElement.querySelector('.inline-flex.shrink-0.items-center');
    expect(iconDiv).toBeFalsy();
  });

  it('should have correct accessibility attributes', () => {
    const toastEl = fixture.nativeElement.querySelector('[role="alert"]');
    expect(toastEl.getAttribute('role')).toBe('alert');
    expect(toastEl.getAttribute('aria-live')).toBe('assertive');
    expect(toastEl.getAttribute('aria-atomic')).toBe('true');
  });
});
