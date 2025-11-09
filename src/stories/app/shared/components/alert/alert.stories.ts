import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { Alert } from '@loan/app/shared/components/alert/alert';
import { Button } from '@loan/app/shared/components/button/button';
import { wrapInLightDarkComparison } from '@loan/stories/story-helpers';

const meta: Meta<Alert> = {
  title: 'UI/Alert',
  component: Alert,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [Alert, Button],
    }),
  ],
};

export default meta;
type Story = StoryObj<Alert>;

export const Variants: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="space-y-4 p-8">
        <app-alert [variant]="'info'" [title]="'Info alert!'">
          Change a few things up and try submitting again.
        </app-alert>

        <app-alert [variant]="'success'" [title]="'Success alert!'">
          Your changes have been saved successfully.
        </app-alert>

        <app-alert [variant]="'error'" [title]="'Danger alert!'">
          There was an error processing your request.
        </app-alert>

        <app-alert [variant]="'warning'" [title]="'Warning alert!'">
          Please review the information before proceeding.
        </app-alert>

        <app-alert [variant]="'neutral'" [title]="'Neutral alert!'">
          This is a neutral informational message.
        </app-alert>
      </div>
    `),
  }),
};

export const WithBorder: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="space-y-4 p-8">
        <app-alert [variant]="'info'" [withBorder]="true" [title]="'Info alert!'">
          This alert has a border for better visual separation.
        </app-alert>

        <app-alert [variant]="'success'" [withBorder]="true" [title]="'Success alert!'">
          Operation completed with a bordered style.
        </app-alert>

        <app-alert [variant]="'error'" [withBorder]="true" [title]="'Error alert!'">
          Error message with border emphasis.
        </app-alert>
      </div>
    `),
  }),
};

export const Dismissible: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="space-y-4 p-8">
        <app-alert [variant]="'info'" [dismissible]="true" [title]="'Dismissible alert'">
          You can close this alert by clicking the X button.
        </app-alert>

        <app-alert [variant]="'success'" [dismissible]="true" [title]="'Success!'">
          This success message can be dismissed.
        </app-alert>
      </div>
    `),
  }),
};

export const WithoutIcon: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="space-y-4 p-8">
        <app-alert [variant]="'info'" [showIcon]="false" [title]="'Info without icon'">
          This alert doesn't show an icon.
        </app-alert>

        <app-alert [variant]="'success'" [showIcon]="false">
          Alert without icon or title.
        </app-alert>
      </div>
    `),
  }),
};

export const WithActions: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="space-y-4 p-8">
        <app-alert [variant]="'info'" [hasActions]="true" [withBorder]="true">
          <div class="mb-2">
            <h3 class="text-lg font-medium">This is an info alert</h3>
          </div>
          <div class="text-sm">
            More info about this alert goes here. This example text is going to run a bit longer.
          </div>
          <div alert-actions>
            <app-button [size]="'xs'" [tone]="'primary'">View more</app-button>
            <app-button [size]="'xs'" [variant]="'outline'" [tone]="'neutral'">Dismiss</app-button>
          </div>
        </app-alert>

        <app-alert [variant]="'error'" [hasActions]="true" [withBorder]="true">
          <div class="mb-2">
            <h3 class="text-lg font-medium">This is a danger alert</h3>
          </div>
          <div class="text-sm">
            More info about this danger alert goes here with detailed information.
          </div>
          <div alert-actions>
            <app-button [size]="'xs'" [tone]="'danger'">View more</app-button>
            <app-button [size]="'xs'" [variant]="'outline'" [tone]="'neutral'">Dismiss</app-button>
          </div>
        </app-alert>

        <app-alert [variant]="'success'" [hasActions]="true" [withBorder]="true">
          <div class="mb-2">
            <h3 class="text-lg font-medium">This is a success alert</h3>
          </div>
          <div class="text-sm">
            Your operation was completed successfully. You can view more details or dismiss this message.
          </div>
          <div alert-actions>
            <app-button [size]="'xs'" [tone]="'success'">View more</app-button>
            <app-button [size]="'xs'" [variant]="'outline'" [tone]="'neutral'">Dismiss</app-button>
          </div>
        </app-alert>
      </div>
    `),
  }),
};

export const Simple: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="space-y-4 p-8">
        <app-alert [variant]="'info'">
          Simple info message without title.
        </app-alert>

        <app-alert [variant]="'success'">
          Simple success message.
        </app-alert>

        <app-alert [variant]="'error'">
          Simple error message.
        </app-alert>
      </div>
    `),
  }),
};
