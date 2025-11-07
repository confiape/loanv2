import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
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
});
