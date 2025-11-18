import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, signal, outputBinding } from '@angular/core';
import { ModalHeader } from './modal-header';

const setupModalHeader = () => {
  const fixture = TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  }).createComponent(ModalHeader);
  TestBed.tick();

  return { fixture };
};

describe('ModalHeader', () => {
  it('should create', () => {
    // Arrange
    const { fixture } = setupModalHeader();

    // Assert
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render header with correct styles', () => {
    // Arrange
    const { fixture } = setupModalHeader();

    // Assert
    const header = fixture.nativeElement.querySelector('div');
    expect(header.className).toContain('flex');
    expect(header.className).toContain('items-center');
    expect(header.className).toContain('justify-between');
    expect(header.className).toContain('border-b');
  });

  it('should render close button', () => {
    // Arrange
    const { fixture } = setupModalHeader();

    // Assert
    const closeButton = fixture.nativeElement.querySelector('button');
    expect(closeButton).toBeTruthy();
    expect(closeButton.getAttribute('type')).toBe('button');
  });

  it('should emit closeClick when close button is clicked', () => {
    // Arrange
    const closeClickedSignal = signal(false);
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(ModalHeader, {
      bindings: [outputBinding('closeClick', () => closeClickedSignal.set(true))],
    });
    TestBed.tick();

    const closeButton = fixture.nativeElement.querySelector('button');

    // Act
    closeButton.click();
    TestBed.tick();

    // Assert
    expect(closeClickedSignal()).toBe(true);
  });

  it('should have accessible label for close button', () => {
    // Arrange
    const { fixture } = setupModalHeader();

    // Assert
    const closeButton = fixture.nativeElement.querySelector('button');
    expect(closeButton.getAttribute('aria-label')).toBe('Close modal');
  });

  it('should render svg icon in close button', () => {
    // Arrange
    const { fixture } = setupModalHeader();

    // Assert
    const svg = fixture.nativeElement.querySelector('button svg');
    expect(svg).toBeTruthy();
    expect(svg.getAttribute('aria-hidden')).toBe('true');
  });

  it('should render screen reader text', () => {
    // Arrange
    const { fixture } = setupModalHeader();

    // Assert
    const srOnly = fixture.nativeElement.querySelector('.sr-only');
    expect(srOnly).toBeTruthy();
    expect(srOnly.textContent).toBe('Close modal');
  });
});
