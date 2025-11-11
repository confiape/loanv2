import { describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ToastContainerComponent } from './toast-container';
import { ToastComponent, Toast, ToastPosition } from './toast';
import { ToastService } from '@loan/app/core/services/toast.service';

type ToastContainerInputs = Partial<{
  position: ToastPosition;
}>;

interface RenderOptions {
  inputs?: ToastContainerInputs;
  toasts?: Toast[];
}

interface RenderResult {
  fixture: ComponentFixture<ToastContainerComponent>;
  component: ToastContainerComponent;
  host: HTMLElement;
  toastService: {
    toasts$: ReturnType<typeof signal<Toast[]>>;
    dismiss: ReturnType<typeof vi.fn>;
  };
}

const createMockToast = (id: string, type: Toast['type'], message: string): Toast => ({
  id,
  type,
  message,
  duration: 3000,
  dismissible: true,
});

async function renderToastContainer(options: RenderOptions = {}): Promise<RenderResult> {
  const toastService = {
    toasts$: signal<Toast[]>(options.toasts || []),
    dismiss: vi.fn(),
  };

  await TestBed.configureTestingModule({
    imports: [ToastContainerComponent, ToastComponent],
    providers: [
      provideZonelessChangeDetection(),
      { provide: ToastService, useValue: toastService },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(ToastContainerComponent);
  const component = fixture.componentInstance;
  const host = fixture.nativeElement as HTMLElement;

  if (options.inputs) {
    for (const [key, value] of Object.entries(options.inputs)) {
      fixture.componentRef.setInput(key as keyof ToastContainerInputs, value as never);
    }
  }

  fixture.detectChanges();
  await fixture.whenStable();

  return { fixture, component, host, toastService };
}

describe('ToastContainerComponent', () => {
  describe('Rendering', () => {
    it('should render empty container when no toasts', async () => {
      const { host } = await renderToastContainer();

      const toastElements = host.querySelectorAll('[role="alert"]');
      expect(toastElements.length).toBe(0);
    });

    it('should render single toast', async () => {
      const toast = createMockToast('toast-1', 'success', 'Success message');
      const { host } = await renderToastContainer({ toasts: [toast] });

      expect(host.textContent).toContain('Success message');
    });

    it('should render multiple toasts', async () => {
      const toasts = [
        createMockToast('toast-1', 'success', 'First message'),
        createMockToast('toast-2', 'error', 'Second message'),
        createMockToast('toast-3', 'warning', 'Third message'),
      ];
      const { host } = await renderToastContainer({ toasts });

      expect(host.textContent).toContain('First message');
      expect(host.textContent).toContain('Second message');
      expect(host.textContent).toContain('Third message');
    });
  });

  describe('Position Classes', () => {
    it('should apply top-right position classes by default', async () => {
      const { component } = await renderToastContainer();

      expect(component.containerClasses()).toContain('top-4');
      expect(component.containerClasses()).toContain('right-4');
    });

    it('should apply top-left position classes', async () => {
      const { component } = await renderToastContainer({
        inputs: { position: 'top-left' },
      });

      expect(component.containerClasses()).toContain('top-4');
      expect(component.containerClasses()).toContain('left-4');
    });

    it('should apply bottom-right position classes', async () => {
      const { component } = await renderToastContainer({
        inputs: { position: 'bottom-right' },
      });

      expect(component.containerClasses()).toContain('bottom-4');
      expect(component.containerClasses()).toContain('right-4');
    });

    it('should apply bottom-left position classes', async () => {
      const { component } = await renderToastContainer({
        inputs: { position: 'bottom-left' },
      });

      expect(component.containerClasses()).toContain('bottom-4');
      expect(component.containerClasses()).toContain('left-4');
    });

    it('should apply top-center position classes', async () => {
      const { component } = await renderToastContainer({
        inputs: { position: 'top-center' },
      });

      expect(component.containerClasses()).toContain('top-4');
      expect(component.containerClasses()).toContain('left-1/2');
      expect(component.containerClasses()).toContain('-translate-x-1/2');
    });

    it('should apply bottom-center position classes', async () => {
      const { component } = await renderToastContainer({
        inputs: { position: 'bottom-center' },
      });

      expect(component.containerClasses()).toContain('bottom-4');
      expect(component.containerClasses()).toContain('left-1/2');
      expect(component.containerClasses()).toContain('-translate-x-1/2');
    });

    it('should always apply base classes', async () => {
      const { component } = await renderToastContainer();

      expect(component.containerClasses()).toContain('fixed');
      expect(component.containerClasses()).toContain('z-50');
      expect(component.containerClasses()).toContain('flex');
      expect(component.containerClasses()).toContain('flex-col');
      expect(component.containerClasses()).toContain('gap-2');
      expect(component.containerClasses()).toContain('pointer-events-none');
    });
  });

  describe('Toast Dismissal', () => {
    it('should call toastService.dismiss when toast is dismissed', async () => {
      const toast = createMockToast('toast-1', 'info', 'Test message');
      const { host, toastService } = await renderToastContainer({ toasts: [toast] });

      const closeButton = host.querySelector('button[aria-label="Close"]') as HTMLButtonElement;
      closeButton.click();

      expect(toastService.dismiss).toHaveBeenCalledWith('toast-1');
    });

    it('should dismiss correct toast when multiple toasts exist', async () => {
      const toasts = [
        createMockToast('toast-1', 'success', 'First'),
        createMockToast('toast-2', 'error', 'Second'),
      ];
      const { host, toastService } = await renderToastContainer({ toasts });

      const closeButtons = host.querySelectorAll(
        'button[aria-label="Close"]',
      ) as NodeListOf<HTMLButtonElement>;
      closeButtons[1].click();

      expect(toastService.dismiss).toHaveBeenCalledWith('toast-2');
    });
  });

  describe('Toast Tracking', () => {
    it('should track toasts by id', async () => {
      const toasts = [
        createMockToast('toast-1', 'success', 'First'),
        createMockToast('toast-2', 'error', 'Second'),
      ];
      const { host } = await renderToastContainer({ toasts });

      const toastElements = host.querySelectorAll('[role="alert"]');
      expect(toastElements.length).toBe(2);
    });
  });
});
