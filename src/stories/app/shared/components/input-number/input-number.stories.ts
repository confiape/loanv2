import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { fn } from 'storybook/test';
import { provideIcons } from '@ng-icons/core';
import { heroChevronUp, heroChevronDown, heroCurrencyDollar } from '@ng-icons/heroicons/outline';

import { InputNumber } from '@loan/app/shared/components/input-number/input-number';
import { wrapInLightDarkComparison } from '@loan/stories/story-helpers';

const meta: Meta<InputNumber> = {
  title: 'UI/InputNumber',
  component: InputNumber,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [InputNumber],
      providers: [provideIcons({ heroChevronUp, heroChevronDown, heroCurrencyDollar })],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text for the input',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the input',
    },
    readonly: {
      control: 'boolean',
      description: 'Make the input readonly',
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Input size variant',
    },
    validationState: {
      control: 'select',
      options: ['none', 'success', 'error'],
      description: 'Validation state',
    },
    min: {
      control: 'number',
      description: 'Minimum value',
    },
    max: {
      control: 'number',
      description: 'Maximum value',
    },
    step: {
      control: 'number',
      description: 'Step increment/decrement value',
    },
    showButtons: {
      control: 'boolean',
      description: 'Show increment/decrement buttons',
    },
    helpText: {
      control: 'text',
      description: 'Help text shown below input',
    },
    successMessage: {
      control: 'text',
      description: 'Success message (shown when validationState is success)',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message (shown when validationState is error)',
    },
    prefixIcon: {
      control: 'text',
      description: 'NgIcon name rendered as prefix (e.g., heroCurrencyDollar)',
    },
    valueChange: {
      description: 'Event emitted when input value changes',
    },
  },
};

export default meta;
type Story = StoryObj<InputNumber>;

/**
 * Basic number input with increment/decrement buttons
 */
export const Default: Story = {
  args: {
    label: 'Select a number',
    placeholder: '0',
    valueChange: fn(),
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md mx-auto">
        <app-input-number
          [label]="'Select a number'"
          [placeholder]="'0'"
        />
      </div>
    `),
  }),
};

/**
 * Number input with min and max constraints
 */
export const WithMinMax: Story = {
  args: {
    valueChange: fn(),
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md mx-auto space-y-6">
        <app-input-number
          [label]="'Quantity (1-100)'"
          [min]="1"
          [max]="100"
          [placeholder]="'Enter quantity'"
          [helpText]="'Choose a value between 1 and 100'"
        />

        <app-input-number
          [label]="'Age (0-120)'"
          [min]="0"
          [max]="120"
          [placeholder]="'Enter age'"
        />
      </div>
    `),
  }),
};

/**
 * Number input size variants: small, default, and large
 */
export const Sizes: Story = {
  args: {
    valueChange: fn(),
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md mx-auto space-y-6">
        <app-input-number
          [label]="'Large input'"
          [size]="'large'"
          [placeholder]="'0'"
        />

        <app-input-number
          [label]="'Default input'"
          [size]="'default'"
          [placeholder]="'0'"
        />

        <app-input-number
          [label]="'Small input'"
          [size]="'small'"
          [placeholder]="'0'"
        />
      </div>
    `),
  }),
};

/**
 * Number input with different step values
 */
export const WithStep: Story = {
  args: {
    valueChange: fn(),
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md mx-auto space-y-6">
        <app-input-number
          [label]="'Count by 1'"
          [step]="1"
          [placeholder]="'0'"
        />

        <app-input-number
          [label]="'Count by 5'"
          [step]="5"
          [placeholder]="'0'"
        />

        <app-input-number
          [label]="'Count by 10'"
          [step]="10"
          [placeholder]="'0'"
        />

        <app-input-number
          [label]="'Decimals (0.01)'"
          [step]="0.01"
          [placeholder]="'0.00'"
        />
      </div>
    `),
  }),
};

/**
 * Number input without increment/decrement buttons
 */
export const WithoutButtons: Story = {
  args: {
    valueChange: fn(),
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md mx-auto">
        <app-input-number
          [label]="'Enter a number'"
          [showButtons]="false"
          [placeholder]="'Type a number'"
        />
      </div>
    `),
  }),
};

/**
 * Disabled and readonly states
 */
export const DisabledAndReadonly: Story = {
  args: {
    valueChange: fn(),
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md mx-auto space-y-6">
        <app-input-number
          [label]="'Disabled input'"
          [disabled]="true"
          [placeholder]="'Disabled'"
        />

        <app-input-number
          [label]="'Readonly input'"
          [readonly]="true"
          [placeholder]="'Readonly'"
        />
      </div>
    `),
  }),
};

/**
 * Validation states: success and error with messages
 */
export const ValidationStates: Story = {
  args: {
    valueChange: fn(),
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md mx-auto space-y-6">
        <app-input-number
          [label]="'Valid quantity'"
          [validationState]="'success'"
          [successMessage]="'Perfect! This quantity is available.'"
          [placeholder]="'0'"
        />

        <app-input-number
          [label]="'Invalid quantity'"
          [validationState]="'error'"
          [errorMessage]="'Error! Quantity exceeds available stock.'"
          [placeholder]="'0'"
        />
      </div>
    `),
  }),
};

/**
 * Number input with prefix icon
 */
export const WithPrefixIcon: Story = {
  args: {
    valueChange: fn(),
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md mx-auto">
        <app-input-number
          [label]="'Price'"
          [prefixIcon]="'heroCurrencyDollar'"
          [placeholder]="'0.00'"
          [step]="0.01"
          [min]="0"
        />
      </div>
    `),
  }),
};

/**
 * Practical form example with multiple number inputs
 */
export const FormExample: Story = {
  args: {
    valueChange: fn(),
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-2xl mx-auto">
        <form class="space-y-6">
          <div class="grid gap-6 md:grid-cols-2">
            <app-input-number
              [label]="'Quantity'"
              [min]="1"
              [max]="999"
              [placeholder]="'1'"
              [helpText]="'Enter quantity (1-999)'"
            />

            <app-input-number
              [label]="'Price'"
              [step]="0.01"
              [min]="0"
              [placeholder]="'0.00'"
              [prefixIcon]="'heroCurrencyDollar'"
            />
          </div>

          <app-input-number
            [label]="'Discount (%)'"
            [min]="0"
            [max]="100"
            [step]="5"
            [placeholder]="'0'"
          />

          <app-input-number
            [label]="'Stock Level'"
            [min]="0"
            [step]="10"
            [placeholder]="'0'"
            [helpText]="'Current stock level in warehouse'"
          />
        </form>
      </div>
    `),
  }),
};

/**
 * Compact layout with small size
 */
export const CompactForm: Story = {
  args: {
    valueChange: fn(),
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-xl mx-auto">
        <form class="space-y-4">
          <div class="grid gap-4 grid-cols-3">
            <app-input-number
              [label]="'Hours'"
              [size]="'small'"
              [min]="0"
              [max]="23"
              [placeholder]="'0'"
            />

            <app-input-number
              [label]="'Minutes'"
              [size]="'small'"
              [min]="0"
              [max]="59"
              [placeholder]="'0'"
            />

            <app-input-number
              [label]="'Seconds'"
              [size]="'small'"
              [min]="0"
              [max]="59"
              [placeholder]="'0'"
            />
          </div>
        </form>
      </div>
    `),
  }),
};
