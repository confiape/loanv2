import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { DialogModule, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Modal, ModalData } from './modal';

describe('Modal', () => {
  let fixture: ComponentFixture<Modal>;
  let component: Modal;
  let mockDialogRef: jasmine.SpyObj<DialogRef>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('DialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [Modal, DialogModule],
      providers: [
        provideZonelessChangeDetection(),
        { provide: DialogRef, useValue: mockDialogRef },
        { provide: DIALOG_DATA, useValue: null },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Modal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render overlay and container', () => {
    const compiled = fixture.nativeElement;
    const overlay = compiled.querySelector('[class*="bg-gray-900"]');
    const container = compiled.querySelector('[class*="overflow-y-auto"]');

    expect(overlay).toBeTruthy();
    expect(container).toBeTruthy();
  });

  it('should apply default 2xl size', () => {
    const content = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(content.className).toContain('max-w-2xl');
  });

  it('should apply custom size', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();

    const content = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(content.className).toContain('max-w-sm');
  });

  it('should close on backdrop click when dismissible', () => {
    fixture.componentRef.setInput('dismissible', true);
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector('[class*="bg-gray-900"]');
    overlay.click();

    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should not close on backdrop click when not dismissible', () => {
    fixture.componentRef.setInput('dismissible', false);
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector('[class*="bg-gray-900"]');
    overlay.click();

    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it('should not close when clicking content area', () => {
    fixture.componentRef.setInput('dismissible', true);
    fixture.detectChanges();

    const content = fixture.nativeElement.querySelector('[role="dialog"]');
    content.click();

    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it('should close programmatically', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should render with correct accessibility attributes', () => {
    const content = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(content.getAttribute('role')).toBe('dialog');
    expect(content.getAttribute('aria-modal')).toBe('true');
  });
});

describe('Modal with data', () => {
  let fixture: ComponentFixture<Modal>;
  let component: Modal;
  const mockData: ModalData = {
    title: 'Test Modal',
    content: 'Test content',
    showCloseButton: true,
    testId: 'test-modal',
  };

  beforeEach(async () => {
    const mockDialogRef = jasmine.createSpyObj('DialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [Modal, DialogModule],
      providers: [
        provideZonelessChangeDetection(),
        { provide: DialogRef, useValue: mockDialogRef },
        { provide: DIALOG_DATA, useValue: mockData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Modal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have access to injected data', () => {
    expect(component.data).toEqual(mockData);
  });

  it('should set aria-labelledby when title is provided', () => {
    const content = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(content.getAttribute('aria-labelledby')).toBe('modal-title');
  });
});
