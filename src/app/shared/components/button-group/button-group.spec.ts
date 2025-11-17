import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, Component, inputBinding } from '@angular/core';
import { within } from '@testing-library/dom';
import { ButtonGroup } from './button-group';
import { ButtonGroupButton } from './button-group-button';

@Component({
  selector: 'app-test-host',
  standalone: true,
  imports: [ButtonGroup, ButtonGroupButton],
  template: `
    <app-button-group [variant]="variant()" [ariaLabel]="ariaLabel()">
      <app-button-group-button [position]="'first'" [variant]="variant()"
        >Button 1</app-button-group-button
      >
      <app-button-group-button [position]="'last'" [variant]="variant()"
        >Button 2</app-button-group-button
      >
    </app-button-group>
  `,
})
class TestHostComponent {
  variant = () => 'default' as const;
  ariaLabel = () => 'Button group';
}

describe('ButtonGroup', () => {
  const defaultProviders = [provideZonelessChangeDetection()];

  it('should render with role group', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(ButtonGroup, {
      bindings: [inputBinding('ariaLabel', () => 'Button group')],
    });
    TestBed.tick();

    const queries = within(fixture.nativeElement);

    // Act & Assert
    const group = queries.getByRole('group');
    expect(group).toBeTruthy();
  });

  it('should apply aria-label', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(ButtonGroup, {
      bindings: [inputBinding('ariaLabel', () => 'Button group')],
    });
    TestBed.tick();

    const queries = within(fixture.nativeElement);

    // Act & Assert
    const group = queries.getByRole('group');
    expect(group.getAttribute('aria-label')).toBe('Button group');
  });

  it('should apply custom aria-label', () => {
    // Arrange
    const customLabel = 'Action buttons';
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(ButtonGroup, {
      bindings: [inputBinding('ariaLabel', () => customLabel)],
    });
    TestBed.tick();

    const queries = within(fixture.nativeElement);

    // Act & Assert
    const group = queries.getByRole('group');
    expect(group.getAttribute('aria-label')).toBe(customLabel);
  });

  it('should apply inline-flex class', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(ButtonGroup, {
      bindings: [inputBinding('ariaLabel', () => 'Button group')],
    });
    TestBed.tick();

    const queries = within(fixture.nativeElement);

    // Act & Assert
    const group = queries.getByRole('group');
    expect(group.className).toContain('inline-flex');
  });
});
