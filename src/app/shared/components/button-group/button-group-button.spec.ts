import { render } from '@testing-library/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { ButtonGroupButton } from './button-group-button';

describe('ButtonGroupButton', () => {
  it('should render button', async () => {
    // Arrange & Act
    const { getByRole } = await render(ButtonGroupButton, {
      providers: [provideZonelessChangeDetection()],
    });

    // Assert
    const button = getByRole('button');
    expect(button).toBeTruthy();
  });

  it('should emit click event when clicked', async () => {
    // Arrange
    const clickSpy = vi.fn();
    const { getByRole, fixture } = await render(ButtonGroupButton, {
      providers: [provideZonelessChangeDetection()],
    });

    fixture.componentInstance.buttonClick.subscribe(clickSpy);
    const button = getByRole('button');

    // Act
    button.click();

    // Assert
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should not emit click when disabled', async () => {
    // Arrange
    const clickSpy = vi.fn();
    const { getByRole, fixture } = await render(ButtonGroupButton, {
      providers: [provideZonelessChangeDetection()],
      componentProperties: { disabled: true },
    });

    fixture.componentInstance.buttonClick.subscribe(clickSpy);
    const button = getByRole('button');

    // Act
    button.click();

    // Assert
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('should apply first position styles', async () => {
    // Arrange
    const { getByRole } = await render(ButtonGroupButton, {
      providers: [provideZonelessChangeDetection()],
      componentProperties: { position: 'first' },
    });

    // Act & Assert
    const button = getByRole('button');
    expect(button.className).toContain('rounded-s-lg');
  });

  it('should apply last position styles', async () => {
    // Arrange
    const { getByRole } = await render(ButtonGroupButton, {
      providers: [provideZonelessChangeDetection()],
      componentProperties: { position: 'last' },
    });

    // Act & Assert
    const button = getByRole('button');
    expect(button.className).toContain('rounded-e-lg');
  });

  it('should apply middle position styles', async () => {
    // Arrange
    const { getByRole } = await render(ButtonGroupButton, {
      providers: [provideZonelessChangeDetection()],
      componentProperties: { position: 'middle' },
    });

    // Act & Assert
    const button = getByRole('button');
    expect(button.className).toContain('border-t');
    expect(button.className).toContain('border-b');
  });

  it('should apply only position styles', async () => {
    // Arrange
    const { getByRole } = await render(ButtonGroupButton, {
      providers: [provideZonelessChangeDetection()],
      componentProperties: { position: 'only' },
    });

    // Act & Assert
    const button = getByRole('button');
    expect(button.className).toContain('rounded-s-lg');
    expect(button.className).toContain('rounded-e-lg');
  });

  it('should apply outline variant styles', async () => {
    // Arrange
    const { getByRole } = await render(ButtonGroupButton, {
      providers: [provideZonelessChangeDetection()],
      componentProperties: { variant: 'outline' },
    });

    // Act & Assert
    const button = getByRole('button');
    expect(button.className).toContain('bg-transparent');
  });

  it('should apply default variant styles', async () => {
    // Arrange
    const { getByRole } = await render(ButtonGroupButton, {
      providers: [provideZonelessChangeDetection()],
      componentProperties: { variant: 'default' },
    });

    // Act & Assert
    const button = getByRole('button');
    expect(button.className).toContain('bg-bg-primary');
  });

  it('should render different button types', async () => {
    // Arrange
    const { getByRole } = await render(ButtonGroupButton, {
      providers: [provideZonelessChangeDetection()],
      componentProperties: { type: 'submit' },
    });

    // Act & Assert
    const button = getByRole('button') as HTMLButtonElement;
    expect(button.type).toBe('submit');
  });

  it('should apply disabled state', async () => {
    // Arrange
    const { getByRole } = await render(ButtonGroupButton, {
      providers: [provideZonelessChangeDetection()],
      componentProperties: { disabled: true },
    });

    // Act & Assert
    const button = getByRole('button') as HTMLButtonElement;
    expect(button.disabled).toBeTruthy();
    expect(button.className).toContain('opacity-50');
    expect(button.className).toContain('cursor-not-allowed');
  });
});
