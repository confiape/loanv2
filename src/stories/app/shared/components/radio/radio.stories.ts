import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { RadioGroup } from '@loan/app/shared/components/radio/radio';
import { ReactiveFormsModule } from '@angular/forms';

const meta: Meta<RadioGroup> = {
  title: 'Forms/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [RadioGroup, ReactiveFormsModule],
    }),
  ],
  argTypes: {
    name: {
      control: 'text',
      description: 'Name attribute for the radio group',
    },
    inline: {
      control: 'boolean',
      description: 'Display options horizontally',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable all radio buttons',
    },
    validationState: {
      control: 'select',
      options: ['none', 'success', 'error'],
      description: 'Validation state visual indicator',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display when validation fails',
    },
  },
};

export default meta;
type Story = StoryObj<RadioGroup>;

const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

const paymentOptions = [
  { value: 'credit', label: 'Credit Card' },
  { value: 'debit', label: 'Debit Card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'bank', label: 'Bank Transfer' },
];

export const Default: Story = {
  render: () => ({
    template: `
      <div class="p-8 max-w-md">
        <app-radio-group
          [name]="'default-radio'"
          [options]="options"
        />
      </div>
    `,
    props: {
      options: mockOptions,
    },
  }),
};

export const Inline: Story = {
  render: () => ({
    template: `
      <div class="p-8 max-w-2xl">
        <app-radio-group
          [name]="'inline-radio'"
          [options]="options"
          [inline]="true"
        />
      </div>
    `,
    props: {
      options: mockOptions,
    },
  }),
};

export const PreSelected: Story = {
  render: () => ({
    template: `
      <div class="p-8 max-w-md">
        <app-radio-group
          [name]="'selected-radio'"
          [options]="options"
          [value]="'option2'"
        />
      </div>
    `,
    props: {
      options: mockOptions,
    },
  }),
};

export const ValidationStates: Story = {
  render: () => ({
    template: `
      <div class="p-8 space-y-6 max-w-md">
        <div>
          <label class="block text-sm font-medium mb-2">Success State</label>
          <app-radio-group
            [name]="'success-radio'"
            [options]="options"
            [validationState]="'success'"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Error State</label>
          <app-radio-group
            [name]="'error-radio'"
            [options]="options"
            [validationState]="'error'"
            [errorMessage]="'Please select an option'"
          />
        </div>
      </div>
    `,
    props: {
      options: mockOptions,
    },
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <div class="p-8 max-w-md">
        <app-radio-group
          [name]="'disabled-radio'"
          [options]="options"
          [disabled]="true"
        />
      </div>
    `,
    props: {
      options: mockOptions,
    },
  }),
};

export const PaymentMethod: Story = {
  render: () => ({
    template: `
      <div class="p-8 max-w-md">
        <label class="block text-sm font-medium mb-3">Select Payment Method</label>
        <app-radio-group
          [name]="'payment-radio'"
          [options]="options"
        />
      </div>
    `,
    props: {
      options: paymentOptions,
    },
  }),
};

export const InlinePayment: Story = {
  render: () => ({
    template: `
      <div class="p-8 max-w-2xl">
        <label class="block text-sm font-medium mb-3">Payment Method</label>
        <app-radio-group
          [name]="'payment-inline'"
          [options]="options"
          [inline]="true"
        />
      </div>
    `,
    props: {
      options: paymentOptions,
    },
  }),
};
