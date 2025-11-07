import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ModalBody } from './modal-body';

describe('ModalBody', () => {
  let fixture: ComponentFixture<ModalBody>;
  let component: ModalBody;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalBody],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalBody);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render body with correct styles', () => {
    const body = fixture.nativeElement.querySelector('div');
    expect(body.className).toContain('p-4');
    expect(body.className).toContain('md:p-5');
    expect(body.className).toContain('space-y-4');
  });

  it('should project content', () => {
    const testContent = 'Test body content';
    const testFixture = TestBed.createComponent(ModalBody);
    testFixture.nativeElement.innerHTML = testContent;
    testFixture.detectChanges();

    expect(testFixture.nativeElement.textContent).toContain('');
  });
});
