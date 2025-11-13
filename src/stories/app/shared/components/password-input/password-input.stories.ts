import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { fn } from 'storybook/test';
import { provideIcons } from '@ng-icons/core';
import { heroEye, heroEyeSlash, heroLockClosed } from '@ng-icons/heroicons/outline';

import { PasswordInput } from '@loan/app/shared/components/password-input/password-input';

const meta: Meta<PasswordInput> = {
  title: 'UI/PasswordInput',
  component: PasswordInput,
  decorators: [
    moduleMetadata({
      imports: [PasswordInput],
      providers: [provideIcons({ heroEye, heroEyeSlash, heroLockClosed })],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Field label',
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
      description: 'Readonly state',
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Input size variant',
    },
    validationState: {
      control: 'select',
      options: ['none', 'success', 'error'],
      description: 'Validation feedback style',
    },
    helpText: {
      control: 'text',
      description: 'Helper text below the field',
    },
    successMessage: {
      control: 'text',
      description: 'Success message when validationState is success',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message when validationState is error',
    },
    allowToggle: {
      control: 'boolean',
      description: 'Enable password visibility toggle',
    },
    showLabel: {
      control: 'text',
      description: 'Label for the "show" button state',
    },
    hideLabel: {
      control: 'text',
      description: 'Label for the "hide" button state',
    },
    prefixIcon: {
      control: 'text',
      description: 'Optional prefix NgIcon name (e.g., heroLockClosed)',
    },
    valueChange: {
      description: 'Emits when the password value changes',
    },
    visibilityChange: {
      description: 'Emits when the visibility toggle changes',
    },
  },
};

export default meta;
type Story = StoryObj<PasswordInput>;

export const Default: Story = {
  args: {
    label: 'Password',
    placeholder: '••••••••',
    valueChange: fn(),
    visibilityChange: fn(),
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-8 max-w-md mx-auto">
        <app-password-input
          [label]="'Password'"
          [placeholder]="'••••••••'"
        />
      </div>
    `,
  }),
};

export const WithPrefixIcon: Story = {
  args: {
    label: 'Account password',
    prefixIcon: 'heroLockClosed',
    valueChange: fn(),
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-8 max-w-md mx-auto">
        <app-password-input
          [label]="'Account password'"
          [placeholder]="'Use at least 12 characters'"
          [prefixIcon]="'heroLockClosed'"
        />
      </div>
    `,
  }),
};

export const ValidationStates: Story = {
  args: {
    valueChange: fn(),
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-8 max-w-md mx-auto space-y-6">
        <app-password-input
          [label]="'Strong password'"
          [validationState]="'success'"
          [successMessage]="'Password strength looks great.'"
          [placeholder]="'••••••••'"
        />

        <app-password-input
          [label]="'Weak password'"
          [validationState]="'error'"
          [errorMessage]="'Add more characters or symbols.'"
          [placeholder]="'••••'"
        />
      </div>
    `,
  }),
};

export const CustomToggleText: Story = {
  args: {
    showLabel: 'Mostrar',
    hideLabel: 'Ocultar',
    valueChange: fn(),
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-8 max-w-md mx-auto">
        <app-password-input
          [label]="'Contraseña'"
          [placeholder]="'Ingresa tu contraseña'"
          [showLabel]="'Mostrar'"
          [hideLabel]="'Ocultar'"
        />
      </div>
    `,
  }),
};

export const CompactForm: Story = {
  args: {
    size: 'small',
    valueChange: fn(),
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="p-8 max-w-xl mx-auto">
        <form class="space-y-4">
          <app-password-input
            [label]="'New password'"
            [size]="'small'"
            [helpText]="'Use at least 12 characters with numbers and symbols.'"
          />

          <app-password-input
            [label]="'Confirm password'"
            [size]="'small'"
            [validationState]="'success'"
            [successMessage]="'Passwords match.'"
          />
        </form>
      </div>
    `,
  }),
};
