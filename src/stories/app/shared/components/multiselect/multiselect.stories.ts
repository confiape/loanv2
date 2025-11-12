import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MultiSelect } from '@loan/app/shared/components/multiselect/multiselect';
import { wrapInLightDarkComparison } from '@loan/stories/story-helpers';
import { ReactiveFormsModule } from '@angular/forms';

const meta: Meta<MultiSelect> = {
  title: 'Forms/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [MultiSelect, ReactiveFormsModule],
    }),
  ],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the dropdown',
    },
    searchable: {
      control: 'boolean',
      description: 'Enable search functionality',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the input',
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
type Story = StoryObj<MultiSelect>;

const mockOptions = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
  { value: '4', label: 'Option 4' },
  { value: '5', label: 'Option 5' },
];

const manyOptions = Array.from({ length: 20 }, (_, i) => ({
  value: String(i + 1),
  label: `Option ${i + 1}`,
}));

export const Default: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md">
        <app-multiselect
          [placeholder]="'Select options'"
          [options]="options"
        />
      </div>
    `),
    props: {
      options: mockOptions,
    },
  }),
};

export const WithSearch: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md">
        <app-multiselect
          [placeholder]="'Search and select'"
          [options]="options"
          [searchable]="true"
        />
      </div>
    `),
    props: {
      options: manyOptions,
    },
  }),
};

export const PreSelected: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md">
        <app-multiselect
          [placeholder]="'Select options'"
          [options]="options"
          [value]="['2', '4']"
        />
      </div>
    `),
    props: {
      options: mockOptions,
    },
  }),
};

export const ValidationStates: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="p-8 space-y-6 max-w-md">
        <div>
          <label class="block text-sm font-medium mb-2">Success State</label>
          <app-multiselect
            [placeholder]="'Valid selection'"
            [options]="options"
            [validationState]="'success'"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Error State</label>
          <app-multiselect
            [placeholder]="'Invalid selection'"
            [options]="options"
            [validationState]="'error'"
            [errorMessage]="'Please select at least one option'"
          />
        </div>
      </div>
    `),
    props: {
      options: mockOptions,
    },
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md">
        <app-multiselect
          [placeholder]="'Disabled multiselect'"
          [options]="options"
          [disabled]="true"
        />
      </div>
    `),
    props: {
      options: mockOptions,
    },
  }),
};

export const WithLabel: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md">
        <label class="block text-sm font-medium mb-2">Select Your Preferences</label>
        <app-multiselect
          [placeholder]="'Choose multiple options'"
          [options]="options"
        />
      </div>
    `),
    props: {
      options: mockOptions,
    },
  }),
};
