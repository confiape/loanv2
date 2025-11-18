import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ModalFooter } from './modal-footer';

const setupModalFooter = () => {
  const fixture = TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  }).createComponent(ModalFooter);
  TestBed.tick();

  return { fixture };
};

describe('ModalFooter', () => {
  it('should create', () => {
    // Arrange
    const { fixture } = setupModalFooter();

    // Assert
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render footer with correct styles', () => {
    // Arrange
    const { fixture } = setupModalFooter();

    // Assert
    const footer = fixture.nativeElement.querySelector('div');
    expect(footer.className).toContain('flex');
    expect(footer.className).toContain('items-center');
    expect(footer.className).toContain('border-t');
    expect(footer.className).toContain('rounded-b');
  });

  it('should have border and padding classes', () => {
    // Arrange
    const { fixture } = setupModalFooter();

    // Assert
    const footer = fixture.nativeElement.querySelector('div');
    expect(footer.className).toContain('p-4');
    expect(footer.className).toContain('md:p-5');
    expect(footer.className).toContain('border-border');
  });
});
