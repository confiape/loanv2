import { provideZonelessChangeDetection } from '@angular/core';
import { DialogModule, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { render } from '@testing-library/angular';
import { Modal, ModalData } from './modal';
import { vi } from 'vitest';

type DialogRefSpy = Pick<DialogRef<unknown>, 'close'>;

const createMockDialogRef = (): DialogRefSpy => ({
  close: vi.fn(),
});

const setupModal = async (
  data: ModalData | null = null,
  mockDialogRef?: DialogRefSpy,
) => {
  const dialogRef = mockDialogRef ?? createMockDialogRef();

  const { fixture, component } = await render(Modal, {
    providers: [
      provideZonelessChangeDetection(),
      { provide: DialogRef, useValue: dialogRef },
      { provide: DIALOG_DATA, useValue: data },
    ],
  });

  return { fixture, component, dialogRef };
};

describe('Modal', () => {
  it('should create', async () => {
    const { component } = await setupModal();
    expect(component).toBeTruthy();
  });

  it('should render overlay and container', async () => {
    const { fixture } = await setupModal();
    const overlay = fixture.nativeElement.querySelector('.bg-overlay');
    const container = fixture.nativeElement.querySelector(
      '.overflow-y-auto',
    );

    expect(overlay).toBeTruthy();
    expect(container).toBeTruthy();
  });

  it('should apply default 2xl size', async () => {
    const { fixture } = await setupModal();
    const content = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(content.className).toContain('max-w-2xl');
  });

  it('should apply custom size', async () => {
    const { fixture } = await setupModal();
    fixture.componentRef.setInput('size', 'sm');
    await fixture.whenStable();

    const content = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(content.className).toContain('max-w-sm');
  });

  it('should close on backdrop click when dismissible', async () => {
    const mockDialogRef = createMockDialogRef();
    const { fixture } = await setupModal(null, mockDialogRef);
    fixture.componentRef.setInput('dismissible', true);
    await fixture.whenStable();

    const overlay = fixture.nativeElement.querySelector('.bg-overlay');
    overlay.click();

    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should not close on backdrop click when not dismissible', async () => {
    const mockDialogRef = createMockDialogRef();
    const { fixture } = await setupModal(null, mockDialogRef);
    fixture.componentRef.setInput('dismissible', false);
    await fixture.whenStable();

    const overlay = fixture.nativeElement.querySelector('.bg-overlay');
    overlay.click();

    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it('should not close when clicking content area', async () => {
    const mockDialogRef = createMockDialogRef();
    const { fixture } = await setupModal(null, mockDialogRef);
    fixture.componentRef.setInput('dismissible', true);
    await fixture.whenStable();

    const content = fixture.nativeElement.querySelector('[role="dialog"]');
    content.click();

    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it('should close programmatically', async () => {
    const mockDialogRef = createMockDialogRef();
    const { component } = await setupModal(null, mockDialogRef);
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should render with correct accessibility attributes', async () => {
    const { fixture } = await setupModal();
    const content = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(content.getAttribute('role')).toBe('dialog');
    expect(content.getAttribute('aria-modal')).toBe('true');
  });
});

describe('Modal with data', () => {
  const mockData: ModalData = {
    title: 'Test Modal',
    content: 'Test content',
    showCloseButton: true,
    testId: 'test-modal',
  };

  it('should have access to injected data', async () => {
    const { component } = await setupModal(mockData);
    expect(component.data).toEqual(mockData);
  });

  it('should set aria-labelledby when title is provided', async () => {
    const { fixture } = await setupModal(mockData);
    const content = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(content.getAttribute('aria-labelledby')).toBe('modal-title');
  });
});
