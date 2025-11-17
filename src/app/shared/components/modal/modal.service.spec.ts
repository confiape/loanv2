import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, Component } from '@angular/core';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { ModalService } from './modal.service';
import { Modal, ModalData } from './modal';
import { vi, expect } from 'vitest';

@Component({
  selector: 'app-test-component',
  standalone: true,
  template: '<div>Test Component</div>',
})
class TestComponent {}

type DialogSpy = Pick<Dialog, 'open' | 'closeAll'>;

describe('ModalService', () => {
  it('should be created', () => {
    // Arrange
    const dialogSpy: DialogSpy = {
      open: vi.fn(),
      closeAll: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [DialogModule],
      providers: [
        provideZonelessChangeDetection(),
        ModalService,
        { provide: Dialog, useValue: dialogSpy },
      ],
    });

    const service = TestBed.inject(ModalService);

    // Act & Assert
    expect(service).toBeTruthy();
  });

  it('should open a modal with custom component', () => {
    // Arrange
    const dialogSpy: DialogSpy = {
      open: vi.fn(),
      closeAll: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [DialogModule],
      providers: [
        provideZonelessChangeDetection(),
        ModalService,
        { provide: Dialog, useValue: dialogSpy },
      ],
    });

    const service = TestBed.inject(ModalService);
    const dialog = TestBed.inject(Dialog);

    const config = {
      size: 'lg' as const,
      dismissible: true,
      testId: 'test-modal',
    };

    // Act
    service.open(TestComponent, config);

    // Assert
    expect(dialog.open).toHaveBeenCalledWith(
      TestComponent,
      expect.objectContaining({
        panelClass: 'modal-panel',
        hasBackdrop: false,
        disableClose: false,
      }),
    );
  });

  it('should open a simple modal with title and content', () => {
    // Arrange
    const dialogSpy: DialogSpy = {
      open: vi.fn(),
      closeAll: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [DialogModule],
      providers: [
        provideZonelessChangeDetection(),
        ModalService,
        { provide: Dialog, useValue: dialogSpy },
      ],
    });

    const service = TestBed.inject(ModalService);
    const dialog = TestBed.inject(Dialog);

    const config = {
      title: 'Test Title',
      content: 'Test content',
      size: 'md' as const,
      dismissible: true,
      testId: 'simple-modal',
    };

    const expectedData: ModalData = {
      title: 'Test Title',
      content: 'Test content',
      showCloseButton: true,
      testId: 'simple-modal',
    };

    // Act
    service.openSimple(config);

    // Assert
    expect(dialog.open).toHaveBeenCalledWith(
      Modal,
      expect.objectContaining({
        data: expectedData,
        panelClass: 'modal-panel',
        hasBackdrop: false,
        disableClose: false,
      }),
    );
  });

  it('should disable close when dismissible is false', () => {
    // Arrange
    const dialogSpy: DialogSpy = {
      open: vi.fn(),
      closeAll: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [DialogModule],
      providers: [
        provideZonelessChangeDetection(),
        ModalService,
        { provide: Dialog, useValue: dialogSpy },
      ],
    });

    const service = TestBed.inject(ModalService);
    const dialog = TestBed.inject(Dialog);

    const config = {
      size: 'sm' as const,
      dismissible: false,
    };

    // Act
    service.open(TestComponent, config);

    // Assert
    expect(dialog.open).toHaveBeenCalledWith(
      TestComponent,
      expect.objectContaining({
        disableClose: true,
      }),
    );
  });

  it('should close all modals', () => {
    // Arrange
    const dialogSpy: DialogSpy = {
      open: vi.fn(),
      closeAll: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [DialogModule],
      providers: [
        provideZonelessChangeDetection(),
        ModalService,
        { provide: Dialog, useValue: dialogSpy },
      ],
    });

    const service = TestBed.inject(ModalService);
    const dialog = TestBed.inject(Dialog);

    // Act
    service.closeAll();

    // Assert
    expect(dialog.closeAll).toHaveBeenCalled();
  });

  it('should handle config without optional properties', () => {
    // Arrange
    const dialogSpy: DialogSpy = {
      open: vi.fn(),
      closeAll: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [DialogModule],
      providers: [
        provideZonelessChangeDetection(),
        ModalService,
        { provide: Dialog, useValue: dialogSpy },
      ],
    });

    const service = TestBed.inject(ModalService);
    const dialog = TestBed.inject(Dialog);

    // Act
    service.open(TestComponent);

    // Assert
    expect(dialog.open).toHaveBeenCalledWith(
      TestComponent,
      expect.objectContaining({
        panelClass: 'modal-panel',
        hasBackdrop: false,
      }),
    );
  });
});
