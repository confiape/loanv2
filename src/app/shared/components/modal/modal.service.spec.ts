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

describe('ModalService', () => {
  let service: ModalService;
  let dialog: any;

  beforeEach(() => {
    const dialogSpy = {
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

    service = TestBed.inject(ModalService);
    dialog = TestBed.inject(Dialog);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open a modal with custom component', () => {
    const config = {
      size: 'lg' as const,
      dismissible: true,
      testId: 'test-modal',
    };

    service.open(TestComponent, config);

    expect(dialog.open).toHaveBeenCalledWith(
      TestComponent,
      expect.objectContaining({
        panelClass: 'modal-panel',
        hasBackdrop: false,
        disableClose: false,
      })
    );
  });

  it('should open a simple modal with title and content', () => {
    const config = {
      title: 'Test Title',
      content: 'Test content',
      size: 'md' as const,
      dismissible: true,
      testId: 'simple-modal',
    };

    service.openSimple(config);

    const expectedData: ModalData = {
      title: 'Test Title',
      content: 'Test content',
      showCloseButton: true,
      testId: 'simple-modal',
    };

    expect(dialog.open).toHaveBeenCalledWith(
      Modal,
      expect.objectContaining({
        data: expectedData,
        panelClass: 'modal-panel',
        hasBackdrop: false,
        disableClose: false,
      })
    );
  });

  it('should disable close when dismissible is false', () => {
    const config = {
      size: 'sm' as const,
      dismissible: false,
    };

    service.open(TestComponent, config);

    expect(dialog.open).toHaveBeenCalledWith(
      TestComponent,
      expect.objectContaining({
        disableClose: true,
      }),
    );
  });

  it('should close all modals', () => {
    service.closeAll();
    expect(dialog.closeAll).toHaveBeenCalled();
  });

  it('should handle config without optional properties', () => {
    service.open(TestComponent);

    expect(dialog.open).toHaveBeenCalledWith(
      TestComponent,
      expect.objectContaining({
        panelClass: 'modal-panel',
        hasBackdrop: false,
      }),
    );
  });
});
