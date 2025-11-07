import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ButtonGroupButton } from './button-group-button';

describe('ButtonGroupButton', () => {
  let fixture: ComponentFixture<ButtonGroupButton>;
  let component: ButtonGroupButton;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonGroupButton],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonGroupButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getButtonElement(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button') as HTMLButtonElement;
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render button', () => {
    const button = getButtonElement();
    expect(button).toBeTruthy();
  });

  it('should emit click event when clicked', () => {
    let clicked = false;
    component.buttonClick.subscribe(() => {
      clicked = true;
    });

    const button = getButtonElement();
    button.click();

    expect(clicked).toBeTruthy();
  });

  it('should not emit click when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    let clicked = false;
    component.buttonClick.subscribe(() => {
      clicked = true;
    });

    const button = getButtonElement();
    button.click();

    expect(clicked).toBeFalsy();
  });

  it('should apply first position styles', () => {
    fixture.componentRef.setInput('position', 'first');
    fixture.detectChanges();

    const button = getButtonElement();
    expect(button.className).toContain('rounded-s-lg');
  });

  it('should apply last position styles', () => {
    fixture.componentRef.setInput('position', 'last');
    fixture.detectChanges();

    const button = getButtonElement();
    expect(button.className).toContain('rounded-e-lg');
  });

  it('should apply middle position styles', () => {
    fixture.componentRef.setInput('position', 'middle');
    fixture.detectChanges();

    const button = getButtonElement();
    expect(button.className).toContain('border-t');
    expect(button.className).toContain('border-b');
  });

  it('should apply only position styles', () => {
    fixture.componentRef.setInput('position', 'only');
    fixture.detectChanges();

    const button = getButtonElement();
    expect(button.className).toContain('rounded-s-lg');
    expect(button.className).toContain('rounded-e-lg');
  });

  it('should apply outline variant styles', () => {
    fixture.componentRef.setInput('variant', 'outline');
    fixture.detectChanges();

    const button = getButtonElement();
    expect(button.className).toContain('bg-transparent');
  });

  it('should apply default variant styles', () => {
    fixture.componentRef.setInput('variant', 'default');
    fixture.detectChanges();

    const button = getButtonElement();
    expect(button.className).toContain('bg-bg-primary');
  });

  it('should render different button types', () => {
    fixture.componentRef.setInput('type', 'submit');
    fixture.detectChanges();

    const button = getButtonElement();
    expect(button.getAttribute('type')).toBe('submit');
  });

  it('should apply disabled state', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const button = getButtonElement();
    expect(button.disabled).toBeTruthy();
    expect(button.className).toContain('opacity-50');
    expect(button.className).toContain('cursor-not-allowed');
  });
});
