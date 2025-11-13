import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonGroup } from '@loan/app/shared/components/button-group/button-group';
import { ButtonGroupButton } from '@loan/app/shared/components/button-group/button-group-button';

const meta: Meta<ButtonGroup> = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<ButtonGroup>;

export const Default: Story = {
  render: () => ({
    props: {},
    moduleMetadata: {
      imports: [ButtonGroup, ButtonGroupButton],
    },
    template: `
      <app-button-group [variant]="'default'">
        <app-button-group-button [position]="'first'" [variant]="'default'">
          Profile
        </app-button-group-button>
        <app-button-group-button [position]="'middle'" [variant]="'default'">
          Settings
        </app-button-group-button>
        <app-button-group-button [position]="'last'" [variant]="'default'">
          Messages
        </app-button-group-button>
      </app-button-group>
    `,
  }),
};

export const Outline: Story = {
  render: () => ({
    props: {},
    moduleMetadata: {
      imports: [ButtonGroup, ButtonGroupButton],
    },
    template: `
      <app-button-group [variant]="'outline'">
        <app-button-group-button [position]="'first'" [variant]="'outline'">
          Profile
        </app-button-group-button>
        <app-button-group-button [position]="'middle'" [variant]="'outline'">
          Settings
        </app-button-group-button>
        <app-button-group-button [position]="'last'" [variant]="'outline'">
          Messages
        </app-button-group-button>
      </app-button-group>
    `,
  }),
};

export const TwoButtons: Story = {
  render: () => ({
    props: {},
    moduleMetadata: {
      imports: [ButtonGroup, ButtonGroupButton],
    },
    template: `
      <div class="space-y-4">
        <app-button-group [variant]="'default'">
          <app-button-group-button [position]="'first'" [variant]="'default'">
            Yes
          </app-button-group-button>
          <app-button-group-button [position]="'last'" [variant]="'default'">
            No
          </app-button-group-button>
        </app-button-group>

        <app-button-group [variant]="'outline'">
          <app-button-group-button [position]="'first'" [variant]="'outline'">
            Yes
          </app-button-group-button>
          <app-button-group-button [position]="'last'" [variant]="'outline'">
            No
          </app-button-group-button>
        </app-button-group>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    props: {},
    moduleMetadata: {
      imports: [ButtonGroup, ButtonGroupButton],
    },
    template: `
      <app-button-group [variant]="'default'">
        <app-button-group-button [position]="'first'" [variant]="'default'">
          Profile
        </app-button-group-button>
        <app-button-group-button [position]="'middle'" [variant]="'default'" [disabled]="true">
          Settings (disabled)
        </app-button-group-button>
        <app-button-group-button [position]="'last'" [variant]="'default'">
          Messages
        </app-button-group-button>
      </app-button-group>
    `,
  }),
};
