import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { Checkbox } from '@loan/app/shared/components/checkbox/checkbox';
import { wrapInLightDarkComparison } from '@loan/stories/story-helpers';
import { ReactiveFormsModule } from '@angular/forms';

const meta: Meta<Checkbox> = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [Checkbox, ReactiveFormsModule],
    }),
  ],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text for the checkbox',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the checkbox',
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
type Story = StoryObj<Checkbox>;

export const Default: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="p-8 space-y-4">
        <app-checkbox [label]="'Accept terms and conditions'" />
        <app-checkbox [label]="'Subscribe to newsletter'" />
        <app-checkbox [label]="'Remember me'" />
      </div>
    `),
  }),
};

export const Checked: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="p-8 space-y-4">
        <app-checkbox [label]="'Option 1'" [value]="true" />
        <app-checkbox [label]="'Option 2'" [value]="true" />
      </div>
    `),
  }),
};

export const ValidationStates: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="p-8 space-y-6">
        <div>
          <app-checkbox
            [label]="'Valid checkbox'"
            [validationState]="'success'"
          />
        </div>

        <div>
          <app-checkbox
            [label]="'Invalid checkbox'"
            [validationState]="'error'"
            [errorMessage]="'This field is required'"
          />
        </div>
      </div>
    `),
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="p-8 space-y-4">
        <app-checkbox [label]="'Disabled unchecked'" [disabled]="true" />
        <app-checkbox [label]="'Disabled checked'" [disabled]="true" [value]="true" />
      </div>
    `),
  }),
};

export const WithHelperText: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md">
        <app-checkbox [label]="'Send me promotional emails'" />
        <p class="ml-7 text-sm text-gray-500 dark:text-gray-400 mt-1">
          We'll occasionally send you account-related emails.
        </p>
      </div>
    `),
  }),
};

export const InForm: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md">
        <form class="space-y-4">
          <div>
            <h3 class="text-lg font-semibold mb-3">Preferences</h3>
            <div class="space-y-3">
              <app-checkbox [label]="'Email notifications'" />
              <app-checkbox [label]="'SMS notifications'" />
              <app-checkbox [label]="'Push notifications'" />
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-3">Agreement</h3>
            <app-checkbox
              [label]="'I agree to the terms and conditions'"
              [validationState]="'error'"
              [errorMessage]="'You must accept the terms'"
            />
          </div>
        </form>
      </div>
    `),
  }),
};
