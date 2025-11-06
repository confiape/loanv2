import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { fn } from 'storybook/test';
import { Button } from '@loan/app/shared/components/button';
import { wrapInLightDarkComparison } from '@loan/stories/story-helpers';

const meta: Meta<Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [Button],
    }),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'ghost', 'gradient'],
      description: 'Visual style of the button',
    },
    tone: {
      control: 'select',
      options: [
        'primary',
        'neutral',
        'dark',
        'light',
        'success',
        'danger',
        'warning',
        'info',
        'purple',
        'teal',
        'cyan',
        'lime',
        'pink',
      ],
      description: 'Color system token',
    },
    shape: {
      control: 'select',
      options: ['rounded', 'pill', 'icon', 'icon-circle'],
      description: 'Border radius presets',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Padding + typography scale',
    },
    loading: {
      control: 'boolean',
      description: 'Show progress state and disable interactions',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Stretches the button to fill its container width',
    },
    loadingText: {
      control: 'text',
      description: 'Label to display while loading=true',
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible label (required for icon-only usage)',
    },
    buttonClick: {
      action: 'clicked',
      description: 'Emits when the button is pressed',
    },
  },
};

export default meta;
type Story = StoryObj<Button>;

export const SolidPalette: Story = {
  args: {
    buttonClick: fn(),
  },
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="flex flex-wrap gap-4 p-8">
        <app-button>Primary</app-button>
        <app-button [tone]="'neutral'">Neutral</app-button>
        <app-button [tone]="'dark'">Dark</app-button>
        <app-button [tone]="'light'">Light</app-button>
        <app-button [tone]="'success'">Success</app-button>
        <app-button [tone]="'danger'">Danger</app-button>
        <app-button [tone]="'warning'">Warning</app-button>
        <app-button [tone]="'purple'">Purple</app-button>
      </div>
    `),
  }),
};

export const PillButtons: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="flex flex-wrap gap-4 p-8">
        <app-button [shape]="'pill'">Primary</app-button>
        <app-button [shape]="'pill'" [tone]="'neutral'">Alternative</app-button>
        <app-button [shape]="'pill'" [tone]="'dark'">Dark</app-button>
        <app-button [shape]="'pill'" [tone]="'light'">Light</app-button>
        <app-button [shape]="'pill'" [tone]="'success'">Green</app-button>
        <app-button [shape]="'pill'" [tone]="'danger'">Red</app-button>
        <app-button [shape]="'pill'" [tone]="'warning'">Yellow</app-button>
        <app-button [shape]="'pill'" [tone]="'purple'">Purple</app-button>
      </div>
    `),
  }),
};

export const GradientShowcase: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="flex flex-wrap gap-4 p-8">
        <app-button [variant]="'gradient'">Blue</app-button>
        <app-button [variant]="'gradient'" [tone]="'success'">Green</app-button>
        <app-button [variant]="'gradient'" [tone]="'cyan'">Cyan</app-button>
        <app-button [variant]="'gradient'" [tone]="'teal'">Teal</app-button>
        <app-button [variant]="'gradient'" [tone]="'lime'">Lime</app-button>
        <app-button [variant]="'gradient'" [tone]="'danger'">Red</app-button>
        <app-button [variant]="'gradient'" [tone]="'pink'">Pink</app-button>
        <app-button [variant]="'gradient'" [tone]="'purple'">Purple</app-button>
      </div>
    `),
  }),
};

export const OutlineVariants: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="flex flex-wrap gap-4 p-8">
        <app-button [variant]="'outline'">Primary</app-button>
        <app-button [variant]="'outline'" [tone]="'dark'">Dark</app-button>
        <app-button [variant]="'outline'" [tone]="'success'">Green</app-button>
        <app-button [variant]="'outline'" [tone]="'danger'">Red</app-button>
        <app-button [variant]="'outline'" [tone]="'warning'">Yellow</app-button>
        <app-button [variant]="'outline'" [tone]="'purple'">Purple</app-button>
      </div>
    `),
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="flex flex-col gap-4 p-8 max-w-md">
        <app-button [size]="'xs'">Extra small</app-button>
        <app-button [size]="'sm'">Small</app-button>
        <app-button [size]="'md'">Base</app-button>
        <app-button [size]="'lg'">Large</app-button>
        <app-button [size]="'xl'">Extra large</app-button>
      </div>
    `),
  }),
};

export const IconButtons: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="flex flex-wrap gap-6 p-8 items-center">
        <app-button [shape]="'icon'" [ariaLabel]="'Navigate forward'">
          <svg class="w-5 h-5" aria-hidden="true" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
          </svg>
          <span class="sr-only">Icon description</span>
        </app-button>

        <app-button [shape]="'icon-circle'" [ariaLabel]="'Navigate forward'">
          <svg class="w-4 h-4" aria-hidden="true" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
          </svg>
          <span class="sr-only">Icon description</span>
        </app-button>

        <app-button [variant]="'outline'" [shape]="'icon'" [tone]="'primary'" [ariaLabel]="'Thumbs up'">
          <svg class="w-5 h-5" aria-hidden="true" viewBox="0 0 18 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 7H1a1 1 0 0 0-1 1v8a2 2 0 0 0 4 0V8a1 1 0 0 0-1-1Zm12.954 0H12l1.558-4.5a1.778 1.778 0 0 0-3.331-1.06A24.859 24.859 0 0 1 6 6.8v9.586h.114C8.223 16.969 11.015 18 13.6 18c1.4 0 1.592-.526 1.88-1.317l2.354-7A2 2 0 0 0 15.954 7Z"/>
          </svg>
          <span class="sr-only">Icon description</span>
        </app-button>

        <app-button [variant]="'outline'" [shape]="'icon-circle'" [tone]="'primary'" [ariaLabel]="'Thumbs up'">
          <svg class="w-4 h-4" aria-hidden="true" viewBox="0 0 18 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 7H1a1 1 0 0 0-1 1v8a2 2 0 0 0 4 0V8a1 1 0 0 0-1-1Zm12.954 0H12l1.558-4.5a1.778 1.778 0 0 0-3.331-1.06A24.859 24.859 0 0 1 6 6.8v9.586h.114C8.223 16.969 11.015 18 13.6 18c1.4 0 1.592-.526 1.88-1.317l2.354-7A2 2 0 0 0 15.954 7Z"/>
          </svg>
          <span class="sr-only">Icon description</span>
        </app-button>
      </div>
    `),
  }),
};

export const ButtonsWithIcons: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="flex flex-wrap gap-4 p-8 items-center">
        <app-button>
          <svg class="w-4 h-4 mr-2" aria-hidden="true" viewBox="0 0 18 21" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z"/>
          </svg>
          Buy now
        </app-button>

        <app-button>
          Choose plan
          <svg class="rtl:rotate-180 w-3.5 h-3.5 ml-2" aria-hidden="true" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
          </svg>
        </app-button>
      </div>
    `),
  }),
};

export const LoaderStates: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="flex flex-wrap gap-4 p-8">
        <app-button [loading]="true">Submit</app-button>
        <app-button [variant]="'outline'" [loading]="true" [tone]="'neutral'" [loadingText]="'Loading...'">
          Secondary
        </app-button>
      </div>
    `),
  }),
};

export const DisabledState: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="flex flex-wrap gap-4 p-8">
        <app-button [disabled]="true">Disabled button</app-button>
        <app-button [variant]="'outline'" [disabled]="true">Outline disabled</app-button>
      </div>
    `),
  }),
};
