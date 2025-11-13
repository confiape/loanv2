import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { GenericCrudFormComponent } from '@loan/app/shared/components/generic-crud/generic-crud-form/generic-crud-form';
import { wrapInLightDarkComparison } from '@loan/stories/story-helpers';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { FormFieldMetadata } from '@loan/app/core/models';

const meta: Meta<GenericCrudFormComponent> = {
  title: 'Components/GenericCrudForm',
  component: GenericCrudFormComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [GenericCrudFormComponent, ReactiveFormsModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<GenericCrudFormComponent>;

const basicFields: FormFieldMetadata[] = [
  {
    key: 'name',
    label: 'Full Name',
    type: 'text',
    validators: [Validators.required, Validators.minLength(3)],
  },
  {
    key: 'email',
    label: 'Email Address',
    type: 'email',
    validators: [Validators.required, Validators.email],
  },
  {
    key: 'age',
    label: 'Age',
    type: 'number',
    validators: [Validators.required, Validators.min(18), Validators.max(120)],
  },
];

const allFieldTypes: FormFieldMetadata[] = [
  {
    key: 'textField',
    label: 'Text Input',
    type: 'text',
    validators: [Validators.required],
  },
  {
    key: 'emailField',
    label: 'Email Input',
    type: 'email',
    validators: [Validators.required, Validators.email],
  },
  {
    key: 'passwordField',
    label: 'Password Input',
    type: 'password',
    validators: [Validators.required, Validators.minLength(8)],
  },
  {
    key: 'numberField',
    label: 'Number Input',
    type: 'number',
    validators: [Validators.required],
  },
  {
    key: 'selectField',
    label: 'Select Dropdown',
    type: 'select',
    validators: [Validators.required],
    loadOptions: () =>
      of([
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
        { value: '3', label: 'Option 3' },
      ]),
  },
  {
    key: 'multiSelectField',
    label: 'Multi Select',
    type: 'multiselect',
    loadOptions: () =>
      of([
        { value: 'a', label: 'Choice A' },
        { value: 'b', label: 'Choice B' },
        { value: 'c', label: 'Choice C' },
      ]),
  },
  {
    key: 'checkboxField',
    label: 'Checkbox',
    type: 'checkbox',
  },
  {
    key: 'radioField',
    label: 'Radio Group',
    type: 'radio',
    loadOptions: () =>
      of([
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'maybe', label: 'Maybe' },
      ]),
  },
  {
    key: 'dateField',
    label: 'Date Input',
    type: 'date',
    validators: [Validators.required],
  },
];

const userRegistrationFields: FormFieldMetadata[] = [
  {
    key: 'fullName',
    label: 'Full Name',
    type: 'text',
    validators: [Validators.required, Validators.minLength(3)],
  },
  {
    key: 'email',
    label: 'Email Address',
    type: 'email',
    validators: [Validators.required, Validators.email],
  },
  {
    key: 'password',
    label: 'Password',
    type: 'password',
    validators: [Validators.required, Validators.minLength(8)],
  },
  {
    key: 'birthdate',
    label: 'Date of Birth',
    type: 'date',
    validators: [Validators.required],
  },
  {
    key: 'country',
    label: 'Country',
    type: 'select',
    validators: [Validators.required],
    loadOptions: () =>
      of([
        { value: 'us', label: 'United States' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'ca', label: 'Canada' },
        { value: 'au', label: 'Australia' },
      ]),
  },
  {
    key: 'interests',
    label: 'Interests',
    type: 'multiselect',
    loadOptions: () =>
      of([
        { value: 'tech', label: 'Technology' },
        { value: 'sports', label: 'Sports' },
        { value: 'music', label: 'Music' },
        { value: 'travel', label: 'Travel' },
      ]),
  },
  {
    key: 'newsletter',
    label: 'Subscribe to newsletter',
    type: 'checkbox',
  },
  {
    key: 'accountType',
    label: 'Account Type',
    type: 'radio',
    validators: [Validators.required],
    loadOptions: () =>
      of([
        { value: 'personal', label: 'Personal' },
        { value: 'business', label: 'Business' },
      ]),
  },
];

export const BasicForm: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-2xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Basic Form Example</h2>
        <app-generic-crud-form
          [fields]="fields"
        />
      </div>
    `),
    props: {
      fields: basicFields,
    },
  }),
};

export const AllFieldTypes: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-2xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">All Field Types Showcase</h2>
        <app-generic-crud-form
          [fields]="fields"
        />
      </div>
    `),
    props: {
      fields: allFieldTypes,
    },
  }),
};

export const UserRegistration: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-2xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">User Registration Form</h2>
        <app-generic-crud-form
          [fields]="fields"
        />
      </div>
    `),
    props: {
      fields: userRegistrationFields,
    },
  }),
};

export const WithInitialData: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-2xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Edit Mode (Pre-filled Data)</h2>
        <app-generic-crud-form
          [fields]="fields"
          [initialData]="initialData"
        />
      </div>
    `),
    props: {
      fields: basicFields,
      initialData: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        age: 30,
      },
    },
  }),
};

export const Compact: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="p-8 max-w-md mx-auto">
        <h2 class="text-xl font-bold mb-4">Compact Form</h2>
        <app-generic-crud-form
          [fields]="fields"
        />
      </div>
    `),
    props: {
      fields: [
        {
          key: 'username',
          label: 'Username',
          type: 'text',
          validators: [Validators.required],
        },
        {
          key: 'password',
          label: 'Password',
          type: 'password',
          validators: [Validators.required],
        },
        {
          key: 'remember',
          label: 'Remember me',
          type: 'checkbox',
        },
      ],
    },
  }),
};
