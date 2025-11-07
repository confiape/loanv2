import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ModalFooter } from './modal-footer';

describe('ModalFooter', () => {
  let fixture: ComponentFixture<ModalFooter>;
  let component: ModalFooter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFooter],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalFooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render footer with correct styles', () => {
    const footer = fixture.nativeElement.querySelector('div');
    expect(footer.className).toContain('flex');
    expect(footer.className).toContain('items-center');
    expect(footer.className).toContain('border-t');
    expect(footer.className).toContain('rounded-b');
  });

  it('should have border and padding classes', () => {
    const footer = fixture.nativeElement.querySelector('div');
    expect(footer.className).toContain('p-4');
    expect(footer.className).toContain('md:p-5');
    expect(footer.className).toContain('border-gray-200');
    expect(footer.className).toContain('dark:border-gray-600');
  });
});
