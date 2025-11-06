import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { fn } from 'storybook/test';
import { Input } from '@loan/app/shared/components/input/input';
import { wrapInLightDarkComparison } from '@loan/stories/story-helpers';

const meta: Meta<Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [Input],
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
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: 'Input type',
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
    valueChange: {
      description: 'Event emitted when input value changes',
    },
    suffixButtonClick: {
      description: 'Event emitted when suffix button is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<Input>;

/**
 * Basic text input with label
 */
export const Default: Story = {
  args: {
    label: 'First name',
    placeholder: 'John',
    valueChange: fn(),
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md mx-auto">
        <app-input
          [label]="'First name'"
          [placeholder]="'John'"
        />
      </div>
    `),
  }),
};

/**
 * Input size variants: small, default, and large
 */
export const Sizes: Story = {
  args: {
    valueChange: fn(),
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md mx-auto space-y-6">
        <app-input
          [label]="'Large input'"
          [size]="'large'"
          [placeholder]="'Large size'"
        />

        <app-input
          [label]="'Default input'"
          [size]="'default'"
          [placeholder]="'Default size'"
        />

        <app-input
          [label]="'Small input'"
          [size]="'small'"
          [placeholder]="'Small size'"
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
        <app-input
          [disabled]="true"
          [placeholder]="'Disabled input'"
          [ariaLabel]="'disabled input'"
        />

        <app-input
          [disabled]="true"
          [readonly]="true"
          [placeholder]="'Disabled readonly input'"
          [ariaLabel]="'disabled input 2'"
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
        <app-input
          [label]="'Your name'"
          [validationState]="'success'"
          [successMessage]="'Well done! Some success message.'"
          [placeholder]="'Success input'"
        />

        <app-input
          [label]="'Your name'"
          [validationState]="'error'"
          [errorMessage]="'Oh, snapp! Some error message.'"
          [placeholder]="'Error input'"
        />
      </div>
    `),
  }),
};

/**
 * Search input with prefix icon and suffix button
 */
export const SearchInput: Story = {
  args: {
    valueChange: fn(),
    suffixButtonClick: fn(),
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-2xl mx-auto">
        <app-input
          [type]="'search'"
          [placeholder]="'Search'"
          [size]="'large'"
          [prefixIcon]="'<path stroke=\\'currentColor\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' stroke-width=\\'2\\' d=\\'m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z\\' />'"
          [suffixButton]="true"
          [suffixButtonText]="'Search'"
          [ariaLabel]="'search'"
        />
      </div>
    `),
  }),
};

/**
 * Form with multiple inputs
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
            <app-input
              [label]="'First name'"
              [placeholder]="'John'"
            />

            <app-input
              [label]="'Last name'"
              [placeholder]="'Doe'"
            />
          </div>

          <app-input
            [label]="'Email'"
            [type]="'email'"
            [placeholder]="'john@example.com'"
            [helpText]="'We\\'ll never share your email with anyone else.'"
          />

          <app-input
            [label]="'Phone number'"
            [type]="'tel'"
            [placeholder]="'+1 (555) 000-0000'"
          />

          <app-input
            [label]="'Password'"
            [type]="'password'"
            [placeholder]="'••••••••'"
          />
        </form>
      </div>
    `),
  }),
};

/**
 * All input types demonstration
 */
export const InputTypes: Story = {
  args: {
    valueChange: fn(),
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md mx-auto space-y-4">
        <app-input
          [label]="'Text'"
          [type]="'text'"
          [placeholder]="'Enter text'"
        />

        <app-input
          [label]="'Email'"
          [type]="'email'"
          [placeholder]="'email@example.com'"
        />

        <app-input
          [label]="'Password'"
          [type]="'password'"
          [placeholder]="'••••••••'"
        />

        <app-input
          [label]="'Number'"
          [type]="'number'"
          [placeholder]="'123'"
        />

        <app-input
          [label]="'Tel'"
          [type]="'tel'"
          [placeholder]="'+1 555 000 0000'"
        />

        <app-input
          [label]="'URL'"
          [type]="'url'"
          [placeholder]="'https://example.com'"
        />

        <app-input
          [label]="'Search'"
          [type]="'search'"
          [placeholder]="'Search...'"
        />
      </div>
    `),
  }),
};

/**
 * Input with prefix icon (email example)
 */
export const WithPrefixIcon: Story = {
  args: {
    valueChange: fn(),
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md mx-auto">
        <app-input
          [label]="'Email'"
          [type]="'email'"
          [placeholder]="'email@example.com'"
          [prefixIcon]="'<path stroke=\\'currentColor\\' stroke-linecap=\\'round\\' stroke-width=\\'2\\' d=\\'m3.5 5.5 7.893 6.036a1 1 0 0 0 1.214 0L20.5 5.5M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z\\' />'"
        />
      </div>
    `),
  }),
};

/**
 * Input with suffix icon
 */
export const WithSuffixIcon: Story = {
  args: {
    valueChange: fn(),
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md mx-auto">
        <app-input
          [label]="'Password'"
          [type]="'password'"
          [placeholder]="'Enter password'"
          [suffixIcon]="'<path stroke=\\'currentColor\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' stroke-width=\\'2\\' d=\\'M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z\\' /><path stroke=\\'currentColor\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' stroke-width=\\'2\\' d=\\'M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z\\' />'"
        />
      </div>
    `),
  }),
};

/**
 * Input with help text
 */
export const WithHelpText: Story = {
  args: {
    valueChange: fn(),
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md mx-auto">
        <app-input
          [label]="'Username'"
          [placeholder]="'Enter username'"
          [helpText]="'Choose a unique username between 3-20 characters.'"
        />
      </div>
    `),
  }),
};

/**
 * Compact form layout
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
          <app-input
            [label]="'Email'"
            [type]="'email'"
            [size]="'small'"
            [placeholder]="'email@example.com'"
          />

          <app-input
            [label]="'Password'"
            [type]="'password'"
            [size]="'small'"
            [placeholder]="'••••••••'"
          />
        </form>
      </div>
    `),
  }),
};
