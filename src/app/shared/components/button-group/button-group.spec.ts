import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ButtonGroup } from './button-group';
import { ButtonGroupButton } from './button-group-button';

@Component({
  selector: 'app-test-host',
  standalone: true,
  imports: [ButtonGroup, ButtonGroupButton],
  template: `
    <app-button-group [variant]="variant" [ariaLabel]="ariaLabel">
      <app-button-group-button [position]="'first'" [variant]="variant">Button 1</app-button-group-button>
      <app-button-group-button [position]="'last'" [variant]="variant">Button 2</app-button-group-button>
    </app-button-group>
  `,
})
class TestHostComponent {
  variant: 'default' | 'outline' = 'default';
  ariaLabel = 'Button group';
}

describe('ButtonGroup', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render with role group', () => {
    const group = fixture.nativeElement.querySelector('[role="group"]');
    expect(group).toBeTruthy();
  });

  it('should render button texts', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons[0].textContent?.trim()).toBe('Button 1');
    expect(buttons[1].textContent?.trim()).toBe('Button 2');
  });

  it('should apply aria-label', () => {
    const group = fixture.nativeElement.querySelector('[role="group"]');
    expect(group.getAttribute('aria-label')).toBe('Button group');
  });

  it('should apply custom aria-label', () => {
    const newFixture = TestBed.createComponent(TestHostComponent);
    const newComponent = newFixture.componentInstance;
    newComponent.ariaLabel = 'Action buttons';
    newFixture.detectChanges();

    const group = newFixture.nativeElement.querySelector('[role="group"]');
    expect(group.getAttribute('aria-label')).toBe('Action buttons');
  });

  it('should apply inline-flex class', () => {
    const group = fixture.nativeElement.querySelector('[role="group"]');
    expect(group.className).toContain('inline-flex');
  });
});
