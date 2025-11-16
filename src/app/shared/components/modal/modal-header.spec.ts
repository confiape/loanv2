import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ModalHeader } from './modal-header';

describe('ModalHeader', () => {
  let fixture: ComponentFixture<ModalHeader>;
  let component: ModalHeader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalHeader],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header with correct styles', () => {
    const header = fixture.nativeElement.querySelector('div');
    expect(header.className).toContain('flex');
    expect(header.className).toContain('items-center');
    expect(header.className).toContain('justify-between');
    expect(header.className).toContain('border-b');
  });

  it('should render close button', () => {
    const closeButton = fixture.nativeElement.querySelector('button');
    expect(closeButton).toBeTruthy();
    expect(closeButton.getAttribute('type')).toBe('button');
  });

  it('should emit closeClick when close button is clicked', () => {
    let emitted = false;
    component.closeClick.subscribe(() => {
      emitted = true;
    });

    const closeButton = fixture.nativeElement.querySelector('button');
    closeButton.click();

    expect(emitted).toBeTruthy();
  });

  it('should have accessible label for close button', () => {
    const closeButton = fixture.nativeElement.querySelector('button');
    expect(closeButton.getAttribute('aria-label')).toBe('Close modal');
  });

  it('should render svg icon in close button', () => {
    const svg = fixture.nativeElement.querySelector('button svg');
    expect(svg).toBeTruthy();
    expect(svg.getAttribute('aria-hidden')).toBe('true');
  });

  it('should render screen reader text', () => {
    const srOnly = fixture.nativeElement.querySelector('.sr-only');
    expect(srOnly).toBeTruthy();
    expect(srOnly.textContent).toBe('Close modal');
  });

  describe('data-testid support', () => {
    it('should render test IDs when data-testid attribute is provided', async () => {
      @Component({
        template: `<app-modal-header data-testid="test-modal">Modal Title</app-modal-header>`,
        standalone: true,
        imports: [ModalHeader],
      })
      class TestWrapper {}

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [TestWrapper],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const wrapperFixture = TestBed.createComponent(TestWrapper);
      wrapperFixture.detectChanges();
      await wrapperFixture.whenStable();

      const modalHeaderComponent = wrapperFixture.nativeElement.querySelector('app-modal-header');

      // Verify header test ID on correct element type (div container)
      const headerDiv = modalHeaderComponent.querySelector('div.flex.items-center.justify-between');
      expect(headerDiv?.getAttribute('data-testid')).toBe('test-modal-header');

      // Verify close button test ID on correct element type
      const closeButton = modalHeaderComponent.querySelector('button[aria-label="Close modal"]');
      expect(closeButton?.getAttribute('data-testid')).toBe('test-modal-close');
    });

    it('should not render test IDs when data-testid attribute is not provided', async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [ModalHeader],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const standaloneFixture = TestBed.createComponent(ModalHeader);
      standaloneFixture.detectChanges();

      // Verify NO test IDs are rendered
      const element = standaloneFixture.nativeElement;
      const elementsWithTestId = element.querySelectorAll('[data-testid]');
      expect(elementsWithTestId.length).toBe(0);
    });
  });
});
