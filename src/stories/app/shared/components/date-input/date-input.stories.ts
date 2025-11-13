import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { DateInput } from '@loan/app/shared/components/date-input/date-input';
import { wrapInLightDarkComparison } from '@loan/stories/story-helpers';
import { ReactiveFormsModule } from '@angular/forms';

const meta: Meta<DateInput> = {
  title: 'Forms/DateInput',
  component: DateInput,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [DateInput, ReactiveFormsModule],
    }),
  ],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the date input',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the input',
    },
    min: {
      control: 'text',
      description: 'Minimum allowed date (YYYY-MM-DD)',
    },
    max: {
      control: 'text',
      description: 'Maximum allowed date (YYYY-MM-DD)',
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
type Story = StoryObj<DateInput>;

export const Default: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md">
        <app-date-input [placeholder]="'Select date'" />
      </div>
    `),
  }),
};

export const WithValue: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md">
        <app-date-input
          [placeholder]="'Select date'"
          [value]="'2025-11-12'"
        />
      </div>
    `),
  }),
};

export const WithMinMax: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="p-8 space-y-6 max-w-md">
        <div>
          <label class="block text-sm font-medium mb-2">Future dates only</label>
          <app-date-input
            [placeholder]="'Select future date'"
            [min]="'2025-11-12'"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Past dates only</label>
          <app-date-input
            [placeholder]="'Select past date'"
            [max]="'2025-11-12'"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Range restricted</label>
          <app-date-input
            [placeholder]="'Select date in range'"
            [min]="'2025-01-01'"
            [max]="'2025-12-31'"
          />
        </div>
      </div>
    `),
  }),
};

export const ValidationStates: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="p-8 space-y-6 max-w-md">
        <div>
          <label class="block text-sm font-medium mb-2">Success State</label>
          <app-date-input
            [placeholder]="'Valid date'"
            [validationState]="'success'"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Error State</label>
          <app-date-input
            [placeholder]="'Invalid date'"
            [validationState]="'error'"
            [errorMessage]="'Please select a valid date'"
          />
        </div>
      </div>
    `),
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md">
        <app-date-input
          [placeholder]="'Disabled date input'"
          [disabled]="true"
        />
      </div>
    `),
  }),
};

export const InForm: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md">
        <form class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2">Birth Date</label>
            <app-date-input
              [placeholder]="'MM/DD/YYYY'"
              [max]="'2025-11-12'"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Start Date</label>
            <app-date-input
              [placeholder]="'Select start date'"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">End Date</label>
            <app-date-input
              [placeholder]="'Select end date'"
            />
          </div>
        </form>
      </div>
    `),
  }),
};

export const BirthdayPicker: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md">
        <label class="block text-sm font-medium mb-2">Date of Birth</label>
        <app-date-input
          [placeholder]="'MM/DD/YYYY'"
          [max]="'2025-11-12'"
        />
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          You must be at least 18 years old.
        </p>
      </div>
    `),
  }),
};
