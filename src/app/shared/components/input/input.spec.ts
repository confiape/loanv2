// Angular testing
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, inputBinding, outputBinding, signal } from '@angular/core';

// Testing library
import { within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

// Vitest
import { describe, it, expect, vi } from 'vitest';

// Dependencies
import { provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass, heroEyeSlash } from '@ng-icons/heroicons/outline';

// Component under test
import { Input } from '@loan/app/shared/components/input/input';

describe('Input', () => {
  it('should create', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
      ],
    }).createComponent(Input, {
      bindings: [],
    });
    TestBed.tick();

    // Assert
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render input element', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
      ],
    }).createComponent(Input, {
      bindings: [],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const input = queries.getByRole('textbox');
    expect(input).toBeTruthy();
  });

  it('should apply default type', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
      ],
    }).createComponent(Input, {
      bindings: [],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const input = queries.getByRole('textbox') as HTMLInputElement;
    expect(input.type).toBe('text');
  });

  it('should render label when provided', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
      ],
    }).createComponent(Input, {
      bindings: [inputBinding('label', () => 'Test Label')],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const label = queries.getByText('Test Label');
    expect(label).toBeTruthy();
    expect(label.tagName).toBe('LABEL');
  });

  it('should not render label when not provided', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
      ],
    }).createComponent(Input, {
      bindings: [],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const label = queries.queryByRole('label');
    expect(label).toBeNull();
  });

  it('should apply placeholder', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
      ],
    }).createComponent(Input, {
      bindings: [inputBinding('placeholder', () => 'Enter text')],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const input = queries.getByPlaceholderText('Enter text');
    expect(input).toBeTruthy();
  });

  it('should apply disabled state', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
      ],
    }).createComponent(Input, {
      bindings: [inputBinding('disabled', () => true)],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const input = queries.getByRole('textbox') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('should apply readonly state', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
      ],
    }).createComponent(Input, {
      bindings: [inputBinding('readonly', () => true)],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const input = queries.getByRole('textbox') as HTMLInputElement;
    expect(input.readOnly).toBe(true);
  });

  it('should emit valueChange on input', async () => {
    // Arrange
    const emittedValue = signal('');
    const fixture = TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
      ],
    }).createComponent(Input, {
      bindings: [outputBinding('valueChange', (value: string) => emittedValue.set(value))],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);
    const user = userEvent.setup();

    // Act
    const input = queries.getByRole('textbox') as HTMLInputElement;
    await user.type(input, 'test value');
    TestBed.tick();

    // Assert
    expect(emittedValue()).toBe('test value');
  });

  it('should render help text', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
      ],
    }).createComponent(Input, {
      bindings: [inputBinding('helpText', () => 'This is help text')],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const helpText = queries.getByText('This is help text');
    expect(helpText).toBeTruthy();
  });

  it('should render success message when validation state is success', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
      ],
    }).createComponent(Input, {
      bindings: [
        inputBinding('validationState', () => 'success'),
        inputBinding('successMessage', () => 'Success!'),
      ],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const message = queries.getByText(/Success!/);
    expect(message).toBeTruthy();
  });

  it('should render error message when validation state is error', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
      ],
    }).createComponent(Input, {
      bindings: [
        inputBinding('validationState', () => 'error'),
        inputBinding('errorMessage', () => 'Error!'),
      ],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const message = queries.getByText(/Error!/);
    expect(message).toBeTruthy();
  });

  it('should render prefix icon when provided', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
      ],
    }).createComponent(Input, {
      bindings: [inputBinding('prefixIcon', () => 'heroMagnifyingGlass')],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const icon = queries.getByRole('textbox').parentElement?.querySelector('ng-icon');
    expect(icon).toBeTruthy();
  });

  it('should render suffix icon when provided', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
      ],
    }).createComponent(Input, {
      bindings: [inputBinding('suffixIcon', () => 'heroEyeSlash')],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const icon = queries.getByRole('textbox').parentElement?.querySelector('ng-icon');
    expect(icon).toBeTruthy();
  });

  it('should render suffix button when enabled', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
      ],
    }).createComponent(Input, {
      bindings: [
        inputBinding('suffixButton', () => true),
        inputBinding('suffixButtonText', () => 'Search'),
      ],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const button = queries.getByRole('button', { name: /Search/ });
    expect(button).toBeTruthy();
  });

  it('should render suffix button icon when provided', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
      ],
    }).createComponent(Input, {
      bindings: [
        inputBinding('suffixButton', () => true),
        inputBinding('suffixButtonIcon', () => 'heroEyeSlash'),
        inputBinding('suffixButtonAriaLabel', () => 'Toggle'),
      ],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const button = queries.getByRole('button', { name: 'Toggle' });
    const icon = button.querySelector('ng-icon');
    expect(icon).toBeTruthy();
    expect(button.getAttribute('aria-label')).toBe('Toggle');
  });

  it('should emit suffixButtonClick when suffix button is clicked', async () => {
    // Arrange
    const clickedSignal = signal(false);
    const fixture = TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
      ],
    }).createComponent(Input, {
      bindings: [
        inputBinding('suffixButton', () => true),
        inputBinding('suffixButtonText', () => 'Click'),
        outputBinding('suffixButtonClick', () => clickedSignal.set(true)),
      ],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);
    const user = userEvent.setup();

    // Act
    const button = queries.getByRole('button', { name: /Click/ });
    await user.click(button);
    TestBed.tick();

    // Assert
    expect(clickedSignal()).toBe(true);
  });

  it('should apply small size classes', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
      ],
    }).createComponent(Input, {
      bindings: [inputBinding('size', () => 'small')],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const input = queries.getByRole('textbox') as HTMLInputElement;
    expect(input.className).toContain('p-2');
    expect(input.className).toContain('text-xs');
  });

  it('should apply large size classes', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
      ],
    }).createComponent(Input, {
      bindings: [inputBinding('size', () => 'large')],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const input = queries.getByRole('textbox') as HTMLInputElement;
    expect(input.className).toContain('p-4');
    expect(input.className).toContain('text-base');
  });

  it('should apply custom input id', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
      ],
    }).createComponent(Input, {
      bindings: [inputBinding('inputId', () => 'custom-id')],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const input = queries.getByRole('textbox') as HTMLInputElement;
    expect(input.id).toBe('custom-id');
  });

  it('should link label to input via for attribute', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
      ],
    }).createComponent(Input, {
      bindings: [inputBinding('label', () => 'Test'), inputBinding('inputId', () => 'test-id')],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const label = queries.getByText('Test');
    const input = queries.getByRole('textbox') as HTMLInputElement;
    expect(label.getAttribute('for')).toBe('test-id');
    expect(input.id).toBe('test-id');
  });

  describe('ControlValueAccessor', () => {
    it('should write value', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
        ],
      }).createComponent(Input, {
        bindings: [],
      });
      TestBed.tick();
      const component = fixture.componentInstance;

      // Act
      component.writeValue('test');
      TestBed.tick();

      // Assert
      expect(component.value()).toBe('test');
    });

    it('should call onChange when input changes', async () => {
      // Arrange
      const onChangeFn = vi.fn();
      const fixture = TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
        ],
      }).createComponent(Input, {
        bindings: [],
      });
      TestBed.tick();
      const component = fixture.componentInstance;
      const queries = within(fixture.nativeElement);
      const user = userEvent.setup();

      component.registerOnChange(onChangeFn);

      // Act
      const input = queries.getByRole('textbox') as HTMLInputElement;
      await user.type(input, 'new value');
      TestBed.tick();

      // Assert
      expect(onChangeFn).toHaveBeenCalledWith('new value');
    });

    it('should call onTouched when input loses focus', async () => {
      // Arrange
      const onTouchedFn = vi.fn();
      const fixture = TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
        ],
      }).createComponent(Input, {
        bindings: [],
      });
      TestBed.tick();
      const component = fixture.componentInstance;
      const queries = within(fixture.nativeElement);
      const user = userEvent.setup();

      component.registerOnTouched(onTouchedFn);

      // Act
      const input = queries.getByRole('textbox') as HTMLInputElement;
      await user.click(input);
      await user.tab();
      TestBed.tick();

      // Assert
      expect(onTouchedFn).toHaveBeenCalled();
    });
  });

  describe('data-testid rendering', () => {
    it('should not render any data-testid attributes when dataTestId is not provided', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
        ],
      }).createComponent(Input, {
        bindings: [],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const wrapper = queries.queryByTestId('email');
      expect(wrapper).toBeNull();
    });

    it('should render data-testid on input element (main element)', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
        ],
      }).createComponent(Input, {
        bindings: [inputBinding('dataTestId', () => 'email')],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const input = queries.getByTestId('email');
      expect(input).toBeTruthy();
    });

    it('should render data-testid on wrapper with -wrapper suffix', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
        ],
      }).createComponent(Input, {
        bindings: [inputBinding('dataTestId', () => 'email')],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const wrapper = queries.getByTestId('email-wrapper');
      expect(wrapper).toBeTruthy();
    });

    it('should render data-testid on label with -label suffix', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
        ],
      }).createComponent(Input, {
        bindings: [
          inputBinding('dataTestId', () => 'email'),
          inputBinding('label', () => 'Email Address'),
        ],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const label = queries.getByTestId('email-label');
      expect(label).toBeTruthy();
      expect(label.textContent?.trim()).toBe('Email Address');
    });

    it('should render data-testid on prefix icon with -prefix-icon suffix', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
        ],
      }).createComponent(Input, {
        bindings: [
          inputBinding('dataTestId', () => 'search'),
          inputBinding('prefixIcon', () => 'heroMagnifyingGlass'),
        ],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const iconWrapper = queries.getByTestId('search-prefix-icon');
      expect(iconWrapper).toBeTruthy();
    });

    it('should render data-testid on suffix icon with -suffix-icon suffix', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
        ],
      }).createComponent(Input, {
        bindings: [
          inputBinding('dataTestId', () => 'password'),
          inputBinding('suffixIcon', () => 'heroEyeSlash'),
        ],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const iconWrapper = queries.getByTestId('password-suffix-icon');
      expect(iconWrapper).toBeTruthy();
    });

    it('should render data-testid on suffix button with -suffix-btn suffix', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
        ],
      }).createComponent(Input, {
        bindings: [
          inputBinding('dataTestId', () => 'search'),
          inputBinding('suffixButton', () => true),
          inputBinding('suffixButtonText', () => 'Search'),
        ],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const button = queries.getByTestId('search-suffix-btn');
      expect(button).toBeTruthy();
    });

    it('should render data-testid on help text with -help suffix', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
        ],
      }).createComponent(Input, {
        bindings: [
          inputBinding('dataTestId', () => 'username'),
          inputBinding('helpText', () => 'Choose a unique username'),
        ],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const helpText = queries.getByTestId('username-help');
      expect(helpText).toBeTruthy();
      expect(helpText.textContent?.trim()).toBe('Choose a unique username');
    });

    it('should render data-testid on success message with -success suffix', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
        ],
      }).createComponent(Input, {
        bindings: [
          inputBinding('dataTestId', () => 'email'),
          inputBinding('validationState', () => 'success'),
          inputBinding('successMessage', () => 'Email is valid'),
        ],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const successMsg = queries.getByTestId('email-success');
      expect(successMsg).toBeTruthy();
      expect(successMsg.textContent).toContain('Email is valid');
    });

    it('should render data-testid on error message with -error suffix', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
        ],
      }).createComponent(Input, {
        bindings: [
          inputBinding('dataTestId', () => 'email'),
          inputBinding('validationState', () => 'error'),
          inputBinding('errorMessage', () => 'Invalid email format'),
        ],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const errorMsg = queries.getByTestId('email-error');
      expect(errorMsg).toBeTruthy();
      expect(errorMsg.textContent).toContain('Invalid email format');
    });

    it('should render all data-testid attributes for complete form', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          provideIcons({ heroMagnifyingGlass, heroEyeSlash }),
        ],
      }).createComponent(Input, {
        bindings: [
          inputBinding('dataTestId', () => 'contact-email'),
          inputBinding('label', () => 'Email'),
          inputBinding('prefixIcon', () => 'heroMagnifyingGlass'),
          inputBinding('suffixButton', () => true),
          inputBinding('suffixButtonText', () => 'Verify'),
          inputBinding('helpText', () => 'We will never share your email'),
        ],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      expect(queries.getByTestId('contact-email-wrapper')).toBeTruthy();
      expect(queries.getByTestId('contact-email-label')).toBeTruthy();
      expect(queries.getByTestId('contact-email')).toBeTruthy();
      expect(queries.getByTestId('contact-email-prefix-icon')).toBeTruthy();
      expect(queries.getByTestId('contact-email-suffix-btn')).toBeTruthy();
      expect(queries.getByTestId('contact-email-help')).toBeTruthy();
    });
  });
});
