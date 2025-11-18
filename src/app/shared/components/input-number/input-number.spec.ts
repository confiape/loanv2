import { TestBed } from '@angular/core/testing';
import { inputBinding, outputBinding, provideZonelessChangeDetection, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass, heroChevronUp, heroChevronDown } from '@ng-icons/heroicons/outline';
import { within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';

import { InputNumber } from '@loan/app/shared/components/input-number/input-number';

describe('InputNumber', () => {
  it('should create', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      imports: [InputNumber],
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroChevronUp, heroChevronDown }),
      ],
    }).createComponent(InputNumber);
    TestBed.tick();

    // Assert
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render input element with type number', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      imports: [InputNumber],
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroChevronUp, heroChevronDown }),
      ],
    }).createComponent(InputNumber);
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const input = queries.getByRole('spinbutton') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.type).toBe('number');
  });

  it('should render label when provided', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      imports: [InputNumber],
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroChevronUp, heroChevronDown }),
      ],
    }).createComponent(InputNumber, {
      bindings: [inputBinding('label', () => 'Quantity')],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const label = queries.getByText('Quantity');
    expect(label).toBeTruthy();
  });

  it('should apply min and max attributes', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      imports: [InputNumber],
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroChevronUp, heroChevronDown }),
      ],
    }).createComponent(InputNumber, {
      bindings: [inputBinding('min', () => 0), inputBinding('max', () => 100)],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const input = queries.getByRole('spinbutton') as HTMLInputElement;
    expect(input.min).toBe('0');
    expect(input.max).toBe('100');
  });

  it('should apply step attribute', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      imports: [InputNumber],
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroChevronUp, heroChevronDown }),
      ],
    }).createComponent(InputNumber, {
      bindings: [inputBinding('step', () => 5)],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const input = queries.getByRole('spinbutton') as HTMLInputElement;
    expect(input.step).toBe('5');
  });

  it('should show increment and decrement buttons by default', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      imports: [InputNumber],
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroChevronUp, heroChevronDown }),
      ],
    }).createComponent(InputNumber);
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const buttons = queries.getAllByRole('button');
    expect(buttons.length).toBe(2);
  });

  it('should render prefix icon when provided', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      imports: [InputNumber],
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroChevronUp, heroChevronDown }),
      ],
    }).createComponent(InputNumber, {
      bindings: [inputBinding('prefixIcon', () => 'heroMagnifyingGlass')],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const icons = queries.getAllByRole('img', { hidden: true });
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should hide buttons when showButtons is false', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      imports: [InputNumber],
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroChevronUp, heroChevronDown }),
      ],
    }).createComponent(InputNumber, {
      bindings: [inputBinding('showButtons', () => false)],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const buttons = queries.queryAllByRole('button');
    expect(buttons.length).toBe(0);
  });

  it('should increment value when increment button is clicked', async () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      imports: [InputNumber],
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroChevronUp, heroChevronDown }),
      ],
    }).createComponent(InputNumber);
    TestBed.tick();
    const component = fixture.componentInstance;
    component.writeValue(5);
    TestBed.tick();
    const queries = within(fixture.nativeElement);
    const user = userEvent.setup();

    // Act
    const incrementButton = queries.getAllByRole('button')[0];
    await user.click(incrementButton);
    TestBed.tick();

    // Assert
    expect(component.value()).toBe(6);
  });

  it('should decrement value when decrement button is clicked', async () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      imports: [InputNumber],
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroChevronUp, heroChevronDown }),
      ],
    }).createComponent(InputNumber);
    TestBed.tick();
    const component = fixture.componentInstance;
    component.writeValue(5);
    TestBed.tick();
    const queries = within(fixture.nativeElement);
    const user = userEvent.setup();

    // Act
    const decrementButton = queries.getAllByRole('button')[1];
    await user.click(decrementButton);
    TestBed.tick();

    // Assert
    expect(component.value()).toBe(4);
  });

  it('should respect min value when decrementing', async () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      imports: [InputNumber],
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroChevronUp, heroChevronDown }),
      ],
    }).createComponent(InputNumber, {
      bindings: [inputBinding('min', () => 0)],
    });
    TestBed.tick();
    const component = fixture.componentInstance;
    component.writeValue(0);
    TestBed.tick();
    const queries = within(fixture.nativeElement);
    const user = userEvent.setup();

    // Act
    const decrementButton = queries.getAllByRole('button')[1];
    await user.click(decrementButton);
    TestBed.tick();

    // Assert
    expect(component.value()).toBe(0);
  });

  it('should respect max value when incrementing', async () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      imports: [InputNumber],
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroChevronUp, heroChevronDown }),
      ],
    }).createComponent(InputNumber, {
      bindings: [inputBinding('max', () => 10)],
    });
    TestBed.tick();
    const component = fixture.componentInstance;
    component.writeValue(10);
    TestBed.tick();
    const queries = within(fixture.nativeElement);
    const user = userEvent.setup();

    // Act
    const incrementButton = queries.getAllByRole('button')[0];
    await user.click(incrementButton);
    TestBed.tick();

    // Assert
    expect(component.value()).toBe(10);
  });

  it('should increment by step value', async () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      imports: [InputNumber],
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroChevronUp, heroChevronDown }),
      ],
    }).createComponent(InputNumber, {
      bindings: [inputBinding('step', () => 5)],
    });
    TestBed.tick();
    const component = fixture.componentInstance;
    component.writeValue(0);
    TestBed.tick();
    const queries = within(fixture.nativeElement);
    const user = userEvent.setup();

    // Act
    const incrementButton = queries.getAllByRole('button')[0];
    await user.click(incrementButton);
    TestBed.tick();

    // Assert
    expect(component.value()).toBe(5);
  });

  it('should emit valueChange on increment', async () => {
    // Arrange
    const emittedValue = signal<number | null>(null);
    const fixture = TestBed.configureTestingModule({
      imports: [InputNumber],
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroChevronUp, heroChevronDown }),
      ],
    }).createComponent(InputNumber, {
      bindings: [outputBinding('valueChange', (value: number | null) => emittedValue.set(value))],
    });
    TestBed.tick();
    const component = fixture.componentInstance;
    component.writeValue(5);
    TestBed.tick();
    const queries = within(fixture.nativeElement);
    const user = userEvent.setup();

    // Act
    const incrementButton = queries.getAllByRole('button')[0];
    await user.click(incrementButton);
    TestBed.tick();

    // Assert
    expect(emittedValue()).toBe(6);
  });

  it('should emit valueChange on input', async () => {
    // Arrange
    const emittedValue = signal<number | null>(null);
    const fixture = TestBed.configureTestingModule({
      imports: [InputNumber],
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroChevronUp, heroChevronDown }),
      ],
    }).createComponent(InputNumber, {
      bindings: [outputBinding('valueChange', (value: number | null) => emittedValue.set(value))],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);
    const user = userEvent.setup();

    // Act
    const input = queries.getByRole('spinbutton') as HTMLInputElement;
    await user.clear(input);
    await user.type(input, '42');
    TestBed.tick();

    // Assert
    expect(emittedValue()).toBe(42);
  });

  it('should disable increment button when max is reached', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      imports: [InputNumber],
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroChevronUp, heroChevronDown }),
      ],
    }).createComponent(InputNumber, {
      bindings: [inputBinding('max', () => 10)],
    });
    TestBed.tick();
    const component = fixture.componentInstance;
    component.writeValue(10);
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const incrementButton = queries.getAllByRole('button')[0] as HTMLButtonElement;
    expect(incrementButton.disabled).toBe(true);
  });

  it('should disable decrement button when min is reached', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      imports: [InputNumber],
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroChevronUp, heroChevronDown }),
      ],
    }).createComponent(InputNumber, {
      bindings: [inputBinding('min', () => 0)],
    });
    TestBed.tick();
    const component = fixture.componentInstance;
    component.writeValue(0);
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const decrementButton = queries.getAllByRole('button')[1] as HTMLButtonElement;
    expect(decrementButton.disabled).toBe(true);
  });

  it('should render help text', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      imports: [InputNumber],
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroChevronUp, heroChevronDown }),
      ],
    }).createComponent(InputNumber, {
      bindings: [inputBinding('helpText', () => 'Enter a number between 1-100')],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const helpText = queries.getByText('Enter a number between 1-100');
    expect(helpText).toBeTruthy();
  });

  it('should render success message when validation state is success', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      imports: [InputNumber],
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroChevronUp, heroChevronDown }),
      ],
    }).createComponent(InputNumber, {
      bindings: [
        inputBinding('validationState', () => 'success'),
        inputBinding('successMessage', () => 'Valid number!'),
      ],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const message = queries.getByText(/Valid number!/);
    expect(message).toBeTruthy();
  });

  it('should render error message when validation state is error', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      imports: [InputNumber],
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroChevronUp, heroChevronDown }),
      ],
    }).createComponent(InputNumber, {
      bindings: [
        inputBinding('validationState', () => 'error'),
        inputBinding('errorMessage', () => 'Number out of range!'),
      ],
    });
    TestBed.tick();
    const queries = within(fixture.nativeElement);

    // Assert
    const message = queries.getByText(/Number out of range!/);
    expect(message).toBeTruthy();
  });

  it('should handle null value', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      imports: [InputNumber],
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroChevronUp, heroChevronDown }),
      ],
    }).createComponent(InputNumber);
    TestBed.tick();
    const component = fixture.componentInstance;

    // Act
    component.writeValue(null);

    // Assert
    expect(component.value()).toBeNull();
  });

  it('should parse input value to number', async () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      imports: [InputNumber],
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroChevronUp, heroChevronDown }),
      ],
    }).createComponent(InputNumber);
    TestBed.tick();
    const queries = within(fixture.nativeElement);
    const user = userEvent.setup();

    // Act
    const input = queries.getByRole('spinbutton') as HTMLInputElement;
    await user.clear(input);
    await user.type(input, '123.45');
    TestBed.tick();

    // Assert
    expect(fixture.componentInstance.value()).toBe(123.45);
  });

  it('should treat empty input as null', async () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      imports: [InputNumber],
      providers: [
        provideZonelessChangeDetection(),
        provideIcons({ heroMagnifyingGlass, heroChevronUp, heroChevronDown }),
      ],
    }).createComponent(InputNumber);
    TestBed.tick();
    const queries = within(fixture.nativeElement);
    const user = userEvent.setup();

    // Act
    const input = queries.getByRole('spinbutton') as HTMLInputElement;
    await user.clear(input);
    TestBed.tick();

    // Assert
    expect(fixture.componentInstance.value()).toBeNull();
  });

  describe('ControlValueAccessor', () => {
    it('should write value', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        imports: [InputNumber],
        providers: [
          provideZonelessChangeDetection(),
          provideIcons({ heroMagnifyingGlass, heroChevronUp, heroChevronDown }),
        ],
      }).createComponent(InputNumber);
      TestBed.tick();
      const component = fixture.componentInstance;

      // Act
      component.writeValue(42);

      // Assert
      expect(component.value()).toBe(42);
    });

    it('should call onChange when value changes', async () => {
      // Arrange
      const changedValue = signal<number | null>(null);
      const fixture = TestBed.configureTestingModule({
        imports: [InputNumber],
        providers: [
          provideZonelessChangeDetection(),
          provideIcons({ heroMagnifyingGlass, heroChevronUp, heroChevronDown }),
        ],
      }).createComponent(InputNumber);
      TestBed.tick();
      const component = fixture.componentInstance;
      component.registerOnChange((value) => {
        changedValue.set(value);
      });
      const queries = within(fixture.nativeElement);
      const user = userEvent.setup();

      // Act
      const input = queries.getByRole('spinbutton') as HTMLInputElement;
      await user.clear(input);
      await user.type(input, '99');
      TestBed.tick();

      // Assert
      expect(changedValue()).toBe(99);
    });

    it('should call onTouched when input loses focus', async () => {
      // Arrange
      let touched = false;
      const fixture = TestBed.configureTestingModule({
        imports: [InputNumber],
        providers: [
          provideZonelessChangeDetection(),
          provideIcons({ heroMagnifyingGlass, heroChevronUp, heroChevronDown }),
        ],
      }).createComponent(InputNumber);
      TestBed.tick();
      const component = fixture.componentInstance;
      component.registerOnTouched(() => {
        touched = true;
      });
      const queries = within(fixture.nativeElement);
      const user = userEvent.setup();

      // Act
      const input = queries.getByRole('spinbutton') as HTMLInputElement;
      await user.click(input);
      await user.tab();
      TestBed.tick();

      // Assert
      expect(touched).toBe(true);
    });
  });
});
