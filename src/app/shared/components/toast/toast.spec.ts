import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ToastComponent, Toast, ToastPosition } from './toast';

type ToastInputs = Partial<{
  toast: Toast;
  position: ToastPosition;
}>;

interface RenderOptions {
  inputs?: ToastInputs;
}

interface RenderResult {
  fixture: ComponentFixture<ToastComponent>;
  component: ToastComponent;
  host: HTMLElement;
  rerender: (options?: RenderOptions) => Promise<void>;
}

async function renderToast(options: RenderOptions = {}): Promise<RenderResult> {
  const fixture = TestBed.createComponent(ToastComponent);
  const component = fixture.componentInstance;
  const host = fixture.nativeElement as HTMLElement;

  if (options.inputs) {
    for (const [key, value] of Object.entries(options.inputs)) {
      fixture.componentRef.setInput(key as keyof ToastInputs, value as never);
    }
  }

  fixture.detectChanges();
  await fixture.whenStable();

  const rerender = async (update: RenderOptions = {}) => {
    if (update.inputs) {
      for (const [key, value] of Object.entries(update.inputs)) {
        fixture.componentRef.setInput(key as keyof ToastInputs, value as never);
      }
    }

    fixture.detectChanges();
    await fixture.whenStable();
  };

  return { fixture, component, host, rerender };
}

const createMockToast = (overrides?: Partial<Toast>): Toast => ({
  id: 'toast-123',
  type: 'info',
  message: 'Test message',
  duration: 3000,
  dismissible: true,
  ...overrides,
});

describe('ToastComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  describe('Rendering', () => {
    it('should render toast message', async () => {
      const toast = createMockToast({ message: 'Hello Toast!' });
      const { host } = await renderToast({ inputs: { toast } });

      expect(host.textContent).toContain('Hello Toast!');
    });

    it('should render toast title when provided', async () => {
      const toast = createMockToast({
        title: 'Success',
        message: 'Operation completed',
      });
      const { host } = await renderToast({ inputs: { toast } });

      expect(host.textContent).toContain('Success');
      expect(host.textContent).toContain('Operation completed');
    });

    it('should not render title when not provided', async () => {
      const toast = createMockToast({ message: 'Just a message' });
      const { host } = await renderToast({ inputs: { toast } });

      const titleElement = host.querySelector('.font-semibold');
      expect(titleElement).toBeNull();
    });

    it('should render close button when dismissible is true', async () => {
      const toast = createMockToast({ dismissible: true });
      const { host } = await renderToast({ inputs: { toast } });

      const closeButton = host.querySelector('button[aria-label="Close"]');
      expect(closeButton).toBeTruthy();
    });

    it('should not render close button when dismissible is false', async () => {
      const toast = createMockToast({ dismissible: false });
      const { host } = await renderToast({ inputs: { toast } });

      const closeButton = host.querySelector('button[aria-label="Close"]');
      expect(closeButton).toBeNull();
    });
  });

  describe('Toast Types', () => {
    it('should render success toast with correct classes', async () => {
      const toast = createMockToast({ type: 'success' });
      const { component } = await renderToast({ inputs: { toast } });

      expect(component.containerClasses()).toContain('bg-bg-success');
      expect(component.containerClasses()).toContain('border-border-success');
    });

    it('should render error toast with correct classes', async () => {
      const toast = createMockToast({ type: 'error' });
      const { component } = await renderToast({ inputs: { toast } });

      expect(component.containerClasses()).toContain('bg-bg-error');
      expect(component.containerClasses()).toContain('border-border-error');
    });

    it('should render warning toast with correct classes', async () => {
      const toast = createMockToast({ type: 'warning' });
      const { component } = await renderToast({ inputs: { toast } });

      expect(component.containerClasses()).toContain('bg-bg-warning');
      expect(component.containerClasses()).toContain('border-border-warning');
    });

    it('should render info toast with correct classes', async () => {
      const toast = createMockToast({ type: 'info' });
      const { component } = await renderToast({ inputs: { toast } });

      expect(component.containerClasses()).toContain('bg-bg-info');
      expect(component.containerClasses()).toContain('border-border-info');
    });

    it('should display correct icon for success toast', async () => {
      const toast = createMockToast({ type: 'success' });
      const { component } = await renderToast({ inputs: { toast } });

      expect(component.icon()).toBe('✓');
    });

    it('should display correct icon for error toast', async () => {
      const toast = createMockToast({ type: 'error' });
      const { component } = await renderToast({ inputs: { toast } });

      expect(component.icon()).toBe('✕');
    });

    it('should display correct icon for warning toast', async () => {
      const toast = createMockToast({ type: 'warning' });
      const { component } = await renderToast({ inputs: { toast } });

      expect(component.icon()).toBe('⚠');
    });

    it('should display correct icon for info toast', async () => {
      const toast = createMockToast({ type: 'info' });
      const { component } = await renderToast({ inputs: { toast } });

      expect(component.icon()).toBe('ℹ');
    });
  });

  describe('Icon Classes', () => {
    it('should apply success icon classes', async () => {
      const toast = createMockToast({ type: 'success' });
      const { component } = await renderToast({ inputs: { toast } });

      expect(component.iconClasses()).toContain('text-success');
    });

    it('should apply error icon classes', async () => {
      const toast = createMockToast({ type: 'error' });
      const { component } = await renderToast({ inputs: { toast } });

      expect(component.iconClasses()).toContain('text-error');
    });

    it('should apply warning icon classes', async () => {
      const toast = createMockToast({ type: 'warning' });
      const { component } = await renderToast({ inputs: { toast } });

      expect(component.iconClasses()).toContain('text-warning');
    });

    it('should apply info icon classes', async () => {
      const toast = createMockToast({ type: 'info' });
      const { component } = await renderToast({ inputs: { toast } });

      expect(component.iconClasses()).toContain('text-accent');
    });
  });

  describe('Dismiss Functionality', () => {
    it('should emit dismissed event when close button is clicked', async () => {
      const toast = createMockToast({ dismissible: true });
      const { host, fixture } = await renderToast({ inputs: { toast } });

      const dismissedSpy = vi.fn();
      fixture.componentInstance.dismissed.subscribe(dismissedSpy);

      const closeButton = host.querySelector('button[aria-label="Close"]') as HTMLButtonElement;
      closeButton.click();

      expect(dismissedSpy).toHaveBeenCalledWith('toast-123');
    });

    it('should auto-dismiss after duration', async () => {
      vi.useFakeTimers();

      const toast = createMockToast({ duration: 2000 });
      const { fixture } = await renderToast({ inputs: { toast } });

      const dismissedSpy = vi.fn();
      fixture.componentInstance.dismissed.subscribe(dismissedSpy);

      vi.advanceTimersByTime(2000);

      expect(dismissedSpy).toHaveBeenCalledWith('toast-123');

      vi.useRealTimers();
    });

    it('should not auto-dismiss when duration is 0', async () => {
      vi.useFakeTimers();

      const toast = createMockToast({ duration: 0 });
      const { fixture } = await renderToast({ inputs: { toast } });

      const dismissedSpy = vi.fn();
      fixture.componentInstance.dismissed.subscribe(dismissedSpy);

      vi.advanceTimersByTime(5000);

      expect(dismissedSpy).not.toHaveBeenCalled();

      vi.useRealTimers();
    });
  });

  describe('Accessibility', () => {
    it('should have correct ARIA attributes', async () => {
      const toast = createMockToast();
      const { host } = await renderToast({ inputs: { toast } });

      const toastElement = host.querySelector('[role="alert"]');
      expect(toastElement?.getAttribute('role')).toBe('alert');
      expect(toastElement?.getAttribute('aria-live')).toBe('assertive');
      expect(toastElement?.getAttribute('aria-atomic')).toBe('true');
    });

    it('should have accessible close button', async () => {
      const toast = createMockToast({ dismissible: true });
      const { host } = await renderToast({ inputs: { toast } });

      const closeButton = host.querySelector('button[aria-label="Close"]');
      expect(closeButton?.getAttribute('aria-label')).toBe('Close');
    });
  });
});
