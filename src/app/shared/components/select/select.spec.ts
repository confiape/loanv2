// Angular testing
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, inputBinding, outputBinding, signal } from '@angular/core';

// Testing library
import { within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

// Vitest
import { describe, it, expect } from 'vitest';

// Component under test
import { Select } from './select';

describe('Select', () => {
  it('should create', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Select);
    TestBed.tick();

    // Assert
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render select element', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Select);
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    expect(queries.queryByRole('combobox')).toBeTruthy();
  });

  it('should render label when provided', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Select, {
      bindings: [inputBinding('label', () => 'Choose Country')],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const label = queries.getByText('Choose Country');
    expect(label.tagName).toBe('LABEL');
  });

  it('should not render label when not provided', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Select);
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    expect(queries.queryByRole('label')).toBeFalsy();
  });

  it('should render placeholder option when provided', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Select, {
      bindings: [inputBinding('placeholder', () => 'Select an option')],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const options = queries.getAllByRole('option');
    expect(options[0].textContent?.trim()).toBe('Select an option');
    expect((options[0] as HTMLOptionElement).disabled).toBe(true);
  });

  it('should render options from input', () => {
    // Arrange
    const options = [
      { value: 'US', label: 'United States' },
      { value: 'CA', label: 'Canada' },
      { value: 'FR', label: 'France' },
    ];
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Select, {
      bindings: [inputBinding('options', () => options)],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const optionElements = queries.getAllByRole('option');
    expect(optionElements.length).toBe(3);
    expect((optionElements[0] as HTMLOptionElement).value).toBe('US');
    expect(optionElements[0].textContent?.trim()).toBe('United States');
  });

  it('should apply disabled state', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Select, {
      bindings: [inputBinding('disabled', () => true)],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const select = queries.getByRole('combobox') as HTMLSelectElement;
    expect(select.disabled).toBe(true);
  });

  it('should render disabled options', () => {
    // Arrange
    const options = [
      { value: 'US', label: 'United States' },
      { value: 'CA', label: 'Canada', disabled: true },
    ];
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Select, {
      bindings: [inputBinding('options', () => options)],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const optionElements = queries.getAllByRole('option');
    expect((optionElements[0] as HTMLOptionElement).disabled).toBe(false);
    expect((optionElements[1] as HTMLOptionElement).disabled).toBe(true);
  });

  it('should emit valueChange on selection', async () => {
    // Arrange
    const valueChangeSignal = signal<string>('');
    const options = [
      { value: 'US', label: 'United States' },
      { value: 'CA', label: 'Canada' },
    ];
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Select, {
      bindings: [
        inputBinding('options', () => options),
        outputBinding('valueChange', (value: string) => valueChangeSignal.set(value)),
      ],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);
    const user = userEvent.setup();

    // Act
    const select = queries.getByRole('combobox') as HTMLSelectElement;
    await user.selectOptions(select, 'CA');
    TestBed.tick();

    // Assert
    expect(valueChangeSignal()).toBe('CA');
  });

  it('should render help text', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Select, {
      bindings: [inputBinding('helpText', () => 'Select your country')],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    expect(queries.getByText('Select your country')).toBeTruthy();
  });

  it('should render success message when validation state is success', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Select, {
      bindings: [
        inputBinding('validationState', () => 'success'),
        inputBinding('successMessage', () => 'Valid selection!'),
      ],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    expect(queries.getByText('Valid selection!')).toBeTruthy();
  });

  it('should render error message when validation state is error', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Select, {
      bindings: [
        inputBinding('validationState', () => 'error'),
        inputBinding('errorMessage', () => 'Please select an option'),
      ],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    expect(queries.getByText('Please select an option')).toBeTruthy();
  });

  it('should apply small size classes', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Select, {
      bindings: [inputBinding('size', () => 'small')],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const select = queries.getByRole('combobox') as HTMLSelectElement;
    expect(select.className).toContain('p-2');
    expect(select.className).toContain('text-sm');
  });

  it('should apply large size classes', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Select, {
      bindings: [inputBinding('size', () => 'large')],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const select = queries.getByRole('combobox') as HTMLSelectElement;
    expect(select.className).toContain('px-4');
    expect(select.className).toContain('py-3');
    expect(select.className).toContain('text-base');
  });

  it('should apply custom select id', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Select, {
      bindings: [inputBinding('selectId', () => 'custom-id')],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const select = queries.getByRole('combobox') as HTMLSelectElement;
    expect(select.id).toBe('custom-id');
  });

  it('should link label to select via for attribute', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Select, {
      bindings: [
        inputBinding('label', () => 'Country'),
        inputBinding('selectId', () => 'country-select'),
      ],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const label = queries.getByText('Country') as HTMLLabelElement;
    const select = queries.getByRole('combobox') as HTMLSelectElement;
    expect(label.getAttribute('for')).toBe('country-select');
    expect(select.id).toBe('country-select');
  });

  describe('ControlValueAccessor', () => {
    it('should write value', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Select);
      TestBed.tick();
      const component = fixture.componentInstance;

      // Act
      component.writeValue('US');

      // Assert
      expect(component.value()).toBe('US');
    });

    it('should call onChange when selection changes', async () => {
      // Arrange
      let changedValue = '';
      const options = [
        { value: 'US', label: 'United States' },
        { value: 'CA', label: 'Canada' },
      ];
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Select, {
        bindings: [inputBinding('options', () => options)],
      });
      TestBed.tick();
      const component = fixture.componentInstance;
      component.registerOnChange((value) => {
        changedValue = value;
      });
      const queries = within(fixture.nativeElement);
      const user = userEvent.setup();

      // Act
      const select = queries.getByRole('combobox') as HTMLSelectElement;
      await user.selectOptions(select, 'CA');
      TestBed.tick();

      // Assert
      expect(changedValue).toBe('CA');
    });

    it('should call onTouched when select loses focus', async () => {
      // Arrange
      let touched = false;
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Select);
      TestBed.tick();
      const component = fixture.componentInstance;
      component.registerOnTouched(() => {
        touched = true;
      });
      const queries = within(fixture.nativeElement);
      const user = userEvent.setup();

      // Act
      const select = queries.getByRole('combobox') as HTMLSelectElement;
      await user.click(select);
      await user.tab();
      TestBed.tick();

      // Assert
      expect(touched).toBe(true);
    });
  });

  describe('data-testid rendering', () => {
    it('should not render any data-testid attributes when dataTestId is not provided', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Select);
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      expect(queries.queryByTestId('')).toBeFalsy();
    });

    it('should render data-testid on select element (main element)', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Select, {
        bindings: [inputBinding('dataTestId', () => 'country')],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      expect(queries.getByTestId('country')).toBeTruthy();
    });

    it('should render data-testid on options with sanitized values', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Select, {
        bindings: [
          inputBinding('dataTestId', () => 'country'),
          inputBinding('options', () => [
            { value: 'us', label: 'United States' },
            { value: 'ca', label: 'Canada' },
          ]),
        ],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      expect(queries.getByTestId('country-option-us')).toBeTruthy();
      expect(queries.getByTestId('country-option-ca')).toBeTruthy();
    });

    it('should sanitize option values with special characters', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(Select, {
        bindings: [
          inputBinding('dataTestId', () => 'role'),
          inputBinding('options', () => [
            { value: 'Super Admin', label: 'Super Admin' },
            { value: 'user@email.com', label: 'User Email' },
          ]),
        ],
      });
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      expect(queries.getByTestId('role-option-super-admin')).toBeTruthy();
      expect(queries.getByTestId('role-option-user-email-com')).toBeTruthy();
    });
  });
});
