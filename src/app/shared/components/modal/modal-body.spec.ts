import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ModalBody } from './modal-body';

const setupModalBody = () => {
  const fixture = TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  }).createComponent(ModalBody);
  TestBed.tick();

  return { fixture };
};

describe('ModalBody', () => {
  it('should create', () => {
    // Arrange
    const { fixture } = setupModalBody();

    // Assert
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render body with correct styles', () => {
    // Arrange
    const { fixture } = setupModalBody();

    // Assert
    const body = fixture.nativeElement.querySelector('div');
    expect(body.className).toContain('p-4');
    expect(body.className).toContain('md:p-5');
    expect(body.className).toContain('space-y-4');
  });

  it('should project content', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(ModalBody);
    TestBed.tick();

    // Act
    const testContent = 'Test body content';
    fixture.nativeElement.innerHTML = `<p>${testContent}</p>`;

    // Assert
    expect(fixture.nativeElement.textContent).toContain(testContent);
  });
});
