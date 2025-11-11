import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { fn } from 'storybook/test';
import { Select } from '@loan/app/shared/components/select/select';
import { wrapInLightDarkComparison } from '@loan/stories/story-helpers';

const meta: Meta<Select> = {
  title: 'UI/Select',
  component: Select,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [Select],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text for the select',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the select',
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Select size variant',
    },
    validationState: {
      control: 'select',
      options: ['none', 'success', 'error'],
      description: 'Validation state',
    },
    options: {
      control: 'object',
      description: 'Array of select options',
    },
    helpText: {
      control: 'text',
      description: 'Help text shown below select',
    },
    successMessage: {
      control: 'text',
      description: 'Success message (shown when validationState is success)',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message (shown when validationState is error)',
    },
    valueChange: {
      description: 'Event emitted when selection changes',
    },
  },
};

export default meta;
type Story = StoryObj<Select>;

const countryOptions = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'FR', label: 'France' },
  { value: 'DE', label: 'Germany' },
  { value: 'GB', label: 'United Kingdom' },
];

/**
 * Basic select with default size
 */
export const Default: Story = {
  args: {
    label: 'Choose a country',
    placeholder: 'Select a country',
    options: countryOptions,
    valueChange: fn(),
  },
  render: () => ({
    props: {
      options: countryOptions,
    },
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md mx-auto">
        <app-select
          [label]="'Choose a country'"
          [placeholder]="'Select a country'"
          [options]="options"
        />
      </div>
    `),
  }),
};

/**
 * Select size variants: small, default, and large
 */
export const Sizes: Story = {
  args: {
    valueChange: fn(),
  },
  render: () => ({
    props: {
      options: countryOptions,
    },
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md mx-auto space-y-6">
        <app-select
          [label]="'Small select'"
          [size]="'small'"
          [placeholder]="'Choose a country'"
          [options]="options"
        />

        <app-select
          [label]="'Default select'"
          [size]="'default'"
          [placeholder]="'Choose a country'"
          [options]="options"
        />

        <app-select
          [label]="'Large select'"
          [size]="'large'"
          [placeholder]="'Choose a country'"
          [options]="options"
        />
      </div>
    `),
  }),
};

/**
 * Disabled select
 */
export const Disabled: Story = {
  args: {
    valueChange: fn(),
  },
  render: () => ({
    props: {
      options: countryOptions,
    },
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md mx-auto">
        <app-select
          [label]="'Choose a country'"
          [disabled]="true"
          [placeholder]="'Select a country'"
          [options]="options"
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
  render: () => ({
    props: {
      options: countryOptions,
    },
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md mx-auto space-y-6">
        <app-select
          [label]="'Country'"
          [validationState]="'success'"
          [successMessage]="'Great choice! We ship to this location.'"
          [placeholder]="'Select a country'"
          [options]="options"
        />

        <app-select
          [label]="'Country'"
          [validationState]="'error'"
          [errorMessage]="'Sorry, we don\\'t ship to this location yet.'"
          [placeholder]="'Select a country'"
          [options]="options"
        />
      </div>
    `),
  }),
};

/**
 * Select with help text
 */
export const WithHelpText: Story = {
  args: {
    valueChange: fn(),
  },
  render: () => ({
    props: {
      options: countryOptions,
    },
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md mx-auto">
        <app-select
          [label]="'Shipping country'"
          [placeholder]="'Select destination'"
          [options]="options"
          [helpText]="'Choose where you want your order shipped'"
        />
      </div>
    `),
  }),
};

/**
 * Select with some disabled options
 */
export const WithDisabledOptions: Story = {
  args: {
    valueChange: fn(),
  },
  render: () => ({
    props: {
      options: [
        { value: 'US', label: 'United States' },
        { value: 'CA', label: 'Canada' },
        { value: 'FR', label: 'France (Out of stock)', disabled: true },
        { value: 'DE', label: 'Germany (Out of stock)', disabled: true },
        { value: 'GB', label: 'United Kingdom' },
      ],
    },
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md mx-auto">
        <app-select
          [label]="'Available countries'"
          [placeholder]="'Select a country'"
          [options]="options"
          [helpText]="'Some destinations are temporarily unavailable'"
        />
      </div>
    `),
  }),
};

/**
 * Form with multiple selects
 */
export const FormExample: Story = {
  args: {
    valueChange: fn(),
  },
  render: () => ({
    props: {
      countries: countryOptions,
      states: [
        { value: 'CA', label: 'California' },
        { value: 'NY', label: 'New York' },
        { value: 'TX', label: 'Texas' },
        { value: 'FL', label: 'Florida' },
      ],
      cities: [
        { value: 'LA', label: 'Los Angeles' },
        { value: 'SF', label: 'San Francisco' },
        { value: 'SD', label: 'San Diego' },
      ],
    },
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-2xl mx-auto">
        <form class="space-y-6">
          <app-select
            [label]="'Country'"
            [placeholder]="'Select your country'"
            [options]="countries"
          />

          <div class="grid gap-6 md:grid-cols-2">
            <app-select
              [label]="'State'"
              [placeholder]="'Select your state'"
              [options]="states"
            />

            <app-select
              [label]="'City'"
              [placeholder]="'Select your city'"
              [options]="cities"
            />
          </div>
        </form>
      </div>
    `),
  }),
};

/**
 * Different categories of options
 */
export const DifferentCategories: Story = {
  args: {
    valueChange: fn(),
  },
  render: () => ({
    props: {
      languages: [
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Spanish' },
        { value: 'fr', label: 'French' },
        { value: 'de', label: 'German' },
        { value: 'it', label: 'Italian' },
      ],
      currencies: [
        { value: 'USD', label: 'US Dollar ($)' },
        { value: 'EUR', label: 'Euro (€)' },
        { value: 'GBP', label: 'British Pound (£)' },
        { value: 'JPY', label: 'Japanese Yen (¥)' },
      ],
      timezones: [
        { value: 'PST', label: 'Pacific Standard Time (PST)' },
        { value: 'EST', label: 'Eastern Standard Time (EST)' },
        { value: 'GMT', label: 'Greenwich Mean Time (GMT)' },
        { value: 'CET', label: 'Central European Time (CET)' },
      ],
    },
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md mx-auto space-y-6">
        <app-select
          [label]="'Language'"
          [placeholder]="'Select language'"
          [options]="languages"
        />

        <app-select
          [label]="'Currency'"
          [placeholder]="'Select currency'"
          [options]="currencies"
        />

        <app-select
          [label]="'Timezone'"
          [placeholder]="'Select timezone'"
          [options]="timezones"
        />
      </div>
    `),
  }),
};

/**
 * Compact form with small selects
 */
export const CompactForm: Story = {
  args: {
    valueChange: fn(),
  },
  render: () => ({
    props: {
      months: [
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
      ],
      days: Array.from({ length: 31 }, (_, i) => ({
        value: String(i + 1).padStart(2, '0'),
        label: String(i + 1),
      })),
      years: Array.from({ length: 10 }, (_, i) => ({
        value: String(2024 - i),
        label: String(2024 - i),
      })),
    },
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-xl mx-auto">
        <form class="space-y-4">
          <div class="grid gap-4 grid-cols-3">
            <app-select
              [label]="'Month'"
              [size]="'small'"
              [placeholder]="'MM'"
              [options]="months"
            />

            <app-select
              [label]="'Day'"
              [size]="'small'"
              [placeholder]="'DD'"
              [options]="days"
            />

            <app-select
              [label]="'Year'"
              [size]="'small'"
              [placeholder]="'YYYY'"
              [options]="years"
            />
          </div>
        </form>
      </div>
    `),
  }),
};
