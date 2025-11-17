import { render } from '@testing-library/angular';
import { provideZonelessChangeDetection, Component } from '@angular/core';
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
  it('should render with role group', async () => {
    // Arrange
    const { getByRole } = await render(ButtonGroup, {
      providers: [provideZonelessChangeDetection()],
      componentProperties: { ariaLabel: 'Button group' },
    });

    // Act & Assert
    const group = getByRole('group');
    expect(group).toBeTruthy();
  });

  it('should apply aria-label', async () => {
    // Arrange
    const { getByRole } = await render(ButtonGroup, {
      providers: [provideZonelessChangeDetection()],
      componentProperties: { ariaLabel: 'Button group' },
    });

    // Act & Assert
    const group = getByRole('group');
    expect(group).toHaveAttribute('aria-label', 'Button group');
  });

  it('should apply custom aria-label', async () => {
    // Arrange
    const customLabel = 'Action buttons';
    const { getByRole } = await render(ButtonGroup, {
      providers: [provideZonelessChangeDetection()],
      componentProperties: { ariaLabel: customLabel },
    });

    // Act & Assert
    const group = getByRole('group');
    expect(group).toHaveAttribute('aria-label', customLabel);
  });

  it('should apply inline-flex class', async () => {
    // Arrange
    const { getByRole } = await render(ButtonGroup, {
      providers: [provideZonelessChangeDetection()],
      componentProperties: { ariaLabel: 'Button group' },
    });

    // Act & Assert
    const group = getByRole('group');
    expect(group.className).toContain('inline-flex');
  });
});
