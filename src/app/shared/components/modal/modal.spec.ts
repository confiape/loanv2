import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { DialogModule, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Modal, ModalData } from './modal';
import { vi } from 'vitest';

type DialogRefSpy = Pick<DialogRef<unknown>, 'close'>;

const createMockDialogRef = (): DialogRefSpy => ({
  close: vi.fn(),
});

const setupModal = (data: ModalData | null = null, mockDialogRef?: DialogRefSpy) => {
  const dialogRef = mockDialogRef ?? createMockDialogRef();

  const fixture = TestBed.configureTestingModule({
    providers: [
      provideZonelessChangeDetection(),
      { provide: DialogRef, useValue: dialogRef },
      { provide: DIALOG_DATA, useValue: data },
    ],
  }).createComponent(Modal);
  TestBed.tick();

  return { fixture, dialogRef };
};

describe('Modal', () => {
  it('should create', () => {
    // Arrange
    const { fixture } = setupModal();

    // Assert
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render overlay and container', () => {
    // Arrange
    const { fixture } = setupModal();

    // Assert
    const overlay = fixture.nativeElement.querySelector('.bg-overlay');
    const container = fixture.nativeElement.querySelector('.overflow-y-auto');

    expect(overlay).toBeTruthy();
    expect(container).toBeTruthy();
  });

  it('should apply default 2xl size', () => {
    // Arrange
    const { fixture } = setupModal();

    // Assert
    const content = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(content.className).toContain('max-w-2xl');
  });

  it('should apply custom size', () => {
    // Arrange
    const { fixture } = setupModal();

    // Act
    fixture.componentRef.setInput('size', 'sm');
    TestBed.tick();

    // Assert
    const content = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(content.className).toContain('max-w-sm');
  });

  it('should close on backdrop click when dismissible', () => {
    // Arrange
    const mockDialogRef = createMockDialogRef();
    const { fixture } = setupModal(null, mockDialogRef);
    fixture.componentRef.setInput('dismissible', true);
    TestBed.tick();

    const overlay = fixture.nativeElement.querySelector('.bg-overlay');

    // Act
    overlay.click();

    // Assert
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should not close on backdrop click when not dismissible', () => {
    // Arrange
    const mockDialogRef = createMockDialogRef();
    const { fixture } = setupModal(null, mockDialogRef);
    fixture.componentRef.setInput('dismissible', false);
    TestBed.tick();

    const overlay = fixture.nativeElement.querySelector('.bg-overlay');

    // Act
    overlay.click();

    // Assert
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it('should not close when clicking content area', () => {
    // Arrange
    const mockDialogRef = createMockDialogRef();
    const { fixture } = setupModal(null, mockDialogRef);
    fixture.componentRef.setInput('dismissible', true);
    TestBed.tick();

    const content = fixture.nativeElement.querySelector('[role="dialog"]');

    // Act
    content.click();

    // Assert
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it('should close programmatically', () => {
    // Arrange
    const mockDialogRef = createMockDialogRef();
    const { fixture } = setupModal(null, mockDialogRef);

    // Act
    fixture.componentInstance.close();

    // Assert
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should render with correct accessibility attributes', () => {
    // Arrange
    const { fixture } = setupModal();

    // Assert
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

  it('should have access to injected data', () => {
    // Arrange
    const { fixture } = setupModal(mockData);

    // Assert
    expect(fixture.componentInstance.data).toEqual(mockData);
  });

  it('should set aria-labelledby when title is provided', () => {
    // Arrange
    const { fixture } = setupModal(mockData);

    // Assert
    const content = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(content.getAttribute('aria-labelledby')).toBe('modal-title');
  });
});
