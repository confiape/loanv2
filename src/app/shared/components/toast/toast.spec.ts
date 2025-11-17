import { describe, expect, it, vi } from 'vitest';
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
}

async function setupTestBed(): Promise<void> {
  await TestBed.configureTestingModule({
    imports: [ToastComponent],
    providers: [provideZonelessChangeDetection()],
  }).compileComponents();
}

async function renderToast(options: RenderOptions = {}): Promise<RenderResult> {
  const fixture = TestBed.createComponent(ToastComponent);
  const component = fixture.componentInstance;
  const host = fixture.nativeElement as HTMLElement;

  if (options.inputs?.toast) {
    fixture.componentRef.setInput('toast', options.inputs.toast);
  }
  if (options.inputs?.position) {
    fixture.componentRef.setInput('position', options.inputs.position);
  }

  fixture.detectChanges();
  await fixture.whenStable();

  return { fixture, component, host };
}

const createMockToast = (overrides?: Partial<Toast>): Toast => ({
  id: 'toast-123',
  type: 'info',
  message: 'Test message',
  duration: 3000,
  dismissible: true,
  ...overrides,
});

const within = (element: HTMLElement) => ({
  getByText: (text: string) => {
    const node = element.textContent?.includes(text) ? element : element.querySelector(`*:has(${text})`);
    return node || null;
  },
  querySelector: (selector: string) => element.querySelector(selector),
  querySelectorAll: (selector: string) => element.querySelectorAll(selector),
});

describe('ToastComponent', () => {

  describe('Rendering', () => {
    it('should render toast message', async () => {
      await setupTestBed();
      const toast = createMockToast({ message: 'Hello Toast!' });
      const { host } = await renderToast({ inputs: { toast } });

      expect(host.textContent).toContain('Hello Toast!');
    });

    it('should render toast title when provided', async () => {
      await setupTestBed();
      const toast = createMockToast({
        title: 'Success',
        message: 'Operation completed',
      });
      const { host } = await renderToast({ inputs: { toast } });

      expect(within(host).getByText('Success')).toBeTruthy();
      expect(within(host).getByText('Operation completed')).toBeTruthy();
    });

    it('should not render title when not provided', async () => {
      await setupTestBed();
      const toast = createMockToast({ message: 'Just a message' });
      const { host } = await renderToast({ inputs: { toast } });

      const titleElement = host.querySelector('.font-semibold');
      expect(titleElement).toBeNull();
    });

    it('should render close button when dismissible is true', async () => {
      await setupTestBed();
      const toast = createMockToast({ dismissible: true });
      const { host } = await renderToast({ inputs: { toast } });

      const closeButton = within(host).querySelector('button[aria-label="Close"]');
      expect(closeButton).toBeTruthy();
    });

    it('should not render close button when dismissible is false', async () => {
      await setupTestBed();
      const toast = createMockToast({ dismissible: false });
      const { host } = await renderToast({ inputs: { toast } });

      const closeButton = within(host).querySelector('button[aria-label="Close"]');
      expect(closeButton).toBeNull();
    });
  });

  describe('Toast Types', () => {
    it('should render success toast with correct classes', async () => {
      await setupTestBed();
      const toast = createMockToast({ type: 'success' });
      const { component } = await renderToast({ inputs: { toast } });

      expect(component.containerClasses()).toContain('bg-bg-success');
      expect(component.containerClasses()).toContain('border-border-success');
    });

    it('should render error toast with correct classes', async () => {
      await setupTestBed();
      const toast = createMockToast({ type: 'error' });
      const { component } = await renderToast({ inputs: { toast } });

      expect(component.containerClasses()).toContain('bg-bg-error');
      expect(component.containerClasses()).toContain('border-border-error');
    });

    it('should render warning toast with correct classes', async () => {
      await setupTestBed();
      const toast = createMockToast({ type: 'warning' });
      const { component } = await renderToast({ inputs: { toast } });

      expect(component.containerClasses()).toContain('bg-bg-warning');
      expect(component.containerClasses()).toContain('border-border-warning');
    });

    it('should render info toast with correct classes', async () => {
      await setupTestBed();
      const toast = createMockToast({ type: 'info' });
      const { component } = await renderToast({ inputs: { toast } });

      expect(component.containerClasses()).toContain('bg-bg-info');
      expect(component.containerClasses()).toContain('border-border-info');
    });

    it('should display correct icon for success toast', async () => {
      await setupTestBed();
      const toast = createMockToast({ type: 'success' });
      const { component } = await renderToast({ inputs: { toast } });

      expect(component.icon()).toBe('✓');
    });

    it('should display correct icon for error toast', async () => {
      await setupTestBed();
      const toast = createMockToast({ type: 'error' });
      const { component } = await renderToast({ inputs: { toast } });

      expect(component.icon()).toBe('✕');
    });

    it('should display correct icon for warning toast', async () => {
      await setupTestBed();
      const toast = createMockToast({ type: 'warning' });
      const { component } = await renderToast({ inputs: { toast } });

      expect(component.icon()).toBe('⚠');
    });

    it('should display correct icon for info toast', async () => {
      await setupTestBed();
      const toast = createMockToast({ type: 'info' });
      const { component } = await renderToast({ inputs: { toast } });

      expect(component.icon()).toBe('ℹ');
    });
  });

  describe('Icon Classes', () => {
    it('should apply success icon classes', async () => {
      await setupTestBed();
      const toast = createMockToast({ type: 'success' });
      const { component } = await renderToast({ inputs: { toast } });

      expect(component.iconClasses()).toContain('text-success');
    });

    it('should apply error icon classes', async () => {
      await setupTestBed();
      const toast = createMockToast({ type: 'error' });
      const { component } = await renderToast({ inputs: { toast } });

      expect(component.iconClasses()).toContain('text-error');
    });

    it('should apply warning icon classes', async () => {
      await setupTestBed();
      const toast = createMockToast({ type: 'warning' });
      const { component } = await renderToast({ inputs: { toast } });

      expect(component.iconClasses()).toContain('text-warning');
    });

    it('should apply info icon classes', async () => {
      await setupTestBed();
      const toast = createMockToast({ type: 'info' });
      const { component } = await renderToast({ inputs: { toast } });

      expect(component.iconClasses()).toContain('text-accent');
    });
  });

  describe('Dismiss Functionality', () => {
    it('should emit dismissed event when close button is clicked', async () => {
      await setupTestBed();
      const toast = createMockToast({ dismissible: true });
      const { host, component } = await renderToast({ inputs: { toast } });

      const dismissedIds: string[] = [];
      const subscription = component.dismissed.subscribe((id) => dismissedIds.push(id));

      const closeButton = within(host).querySelector('button[aria-label="Close"]') as HTMLButtonElement;
      closeButton?.click();

      expect(dismissedIds).toContain('toast-123');
      subscription.unsubscribe();
    });

    it('should auto-dismiss after duration', async () => {
      await setupTestBed();
      vi.useFakeTimers();

      const toast = createMockToast({ duration: 2000 });
      const { component } = await renderToast({ inputs: { toast } });

      const dismissedIds: string[] = [];
      const subscription = component.dismissed.subscribe((id) => dismissedIds.push(id));

      vi.advanceTimersByTime(2000);

      expect(dismissedIds).toContain('toast-123');

      subscription.unsubscribe();
      vi.useRealTimers();
    });

    it('should not auto-dismiss when duration is 0', async () => {
      await setupTestBed();
      vi.useFakeTimers();

      const toast = createMockToast({ duration: 0 });
      const { component } = await renderToast({ inputs: { toast } });

      const dismissedIds: string[] = [];
      const subscription = component.dismissed.subscribe((id) => dismissedIds.push(id));

      vi.advanceTimersByTime(5000);

      expect(dismissedIds.length).toBe(0);

      subscription.unsubscribe();
      vi.useRealTimers();
    });
  });

  describe('Accessibility', () => {
    it('should have correct ARIA attributes', async () => {
      await setupTestBed();
      const toast = createMockToast();
      const { host } = await renderToast({ inputs: { toast } });

      const toastElement = within(host).querySelector('[role="alert"]');
      expect(toastElement?.getAttribute('role')).toBe('alert');
      expect(toastElement?.getAttribute('aria-live')).toBe('assertive');
      expect(toastElement?.getAttribute('aria-atomic')).toBe('true');
    });

    it('should have accessible close button', async () => {
      await setupTestBed();
      const toast = createMockToast({ dismissible: true });
      const { host } = await renderToast({ inputs: { toast } });

      const closeButton = within(host).querySelector('button[aria-label="Close"]');
      expect(closeButton?.getAttribute('aria-label')).toBe('Close');
    });
  });
});
