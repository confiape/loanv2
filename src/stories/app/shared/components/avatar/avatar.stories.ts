import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { Avatar } from '@loan/app/shared/components/avatar/avatar';
import { wrapInLightDarkComparison } from '@loan/stories/story-helpers';

const meta: Meta<Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  decorators: [moduleMetadata({ imports: [Avatar] })],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['placeholder', 'image', 'initials'],
      description: 'Avatar display variant',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Avatar size',
    },
    shape: {
      control: 'select',
      options: ['full', 'sm'],
      description: 'Avatar shape (full = rounded-full, sm = rounded-sm)',
    },
    imageSrc: {
      control: 'text',
      description: 'Image URL for image variant',
    },
    imageAlt: {
      control: 'text',
      description: 'Alt text for image',
    },
    initials: {
      control: 'text',
      description: 'Initials text for initials variant',
    },
    statusIndicator: {
      control: 'select',
      options: [null, 'online', 'offline', 'away', 'dnd'],
      description: 'Status indicator badge',
    },
    statusPosition: {
      control: 'select',
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      description: 'Position of status indicator',
    },
  },
};

export default meta;
type Story = StoryObj<Avatar>;

export const Default: Story = {
  args: {
    variant: 'placeholder',
    size: 'md',
    shape: 'full',
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="flex items-center justify-center p-8">
        <app-avatar
          [variant]="variant"
          [size]="size"
          [shape]="shape"
        />
      </div>
    `),
  }),
};

export const ImageVariant: Story = {
  args: {
    variant: 'image',
    size: 'md',
    shape: 'full',
    imageSrc: 'https://i.pravatar.cc/150?img=12',
    imageAlt: 'User avatar',
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="flex items-center justify-center p-8">
        <app-avatar
          [variant]="variant"
          [size]="size"
          [shape]="shape"
          [imageSrc]="imageSrc"
          [imageAlt]="imageAlt"
        />
      </div>
    `),
  }),
};

export const InitialsVariant: Story = {
  args: {
    variant: 'initials',
    size: 'md',
    shape: 'full',
    initials: 'JD',
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="flex items-center justify-center p-8">
        <app-avatar
          [variant]="variant"
          [size]="size"
          [shape]="shape"
          [initials]="initials"
        />
      </div>
    `),
  }),
};

export const AllSizes: Story = {
  args: {
    variant: 'initials',
    shape: 'full',
    initials: 'AB',
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="flex flex-col gap-8 p-8">
        <div class="flex items-center gap-4">
          <span class="w-24 text-sm font-medium">Extra Small:</span>
          <app-avatar
            [variant]="variant"
            size="xs"
            [shape]="shape"
            [initials]="initials"
          />
        </div>
        <div class="flex items-center gap-4">
          <span class="w-24 text-sm font-medium">Small:</span>
          <app-avatar
            [variant]="variant"
            size="sm"
            [shape]="shape"
            [initials]="initials"
          />
        </div>
        <div class="flex items-center gap-4">
          <span class="w-24 text-sm font-medium">Medium:</span>
          <app-avatar
            [variant]="variant"
            size="md"
            [shape]="shape"
            [initials]="initials"
          />
        </div>
        <div class="flex items-center gap-4">
          <span class="w-24 text-sm font-medium">Large:</span>
          <app-avatar
            [variant]="variant"
            size="lg"
            [shape]="shape"
            [initials]="initials"
          />
        </div>
        <div class="flex items-center gap-4">
          <span class="w-24 text-sm font-medium">Extra Large:</span>
          <app-avatar
            [variant]="variant"
            size="xl"
            [shape]="shape"
            [initials]="initials"
          />
        </div>
      </div>
    `),
  }),
};

export const ShapeVariants: Story = {
  args: {
    variant: 'image',
    size: 'lg',
    imageSrc: 'https://i.pravatar.cc/150?img=33',
    imageAlt: 'User avatar',
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="flex items-center justify-center gap-12 p-8">
        <div class="flex flex-col items-center gap-4">
          <span class="text-sm font-medium">Full (Rounded)</span>
          <app-avatar
            [variant]="variant"
            [size]="size"
            shape="full"
            [imageSrc]="imageSrc"
            [imageAlt]="imageAlt"
          />
        </div>
        <div class="flex flex-col items-center gap-4">
          <span class="text-sm font-medium">Small Rounded</span>
          <app-avatar
            [variant]="variant"
            [size]="size"
            shape="sm"
            [imageSrc]="imageSrc"
            [imageAlt]="imageAlt"
          />
        </div>
      </div>
    `),
  }),
};

export const WithStatusIndicators: Story = {
  args: {
    variant: 'image',
    size: 'lg',
    shape: 'full',
    imageSrc: 'https://i.pravatar.cc/150?img=45',
    imageAlt: 'User avatar',
    statusPosition: 'bottom-right',
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="flex flex-col gap-8 p-8">
        <div class="flex items-center gap-4">
          <span class="w-24 text-sm font-medium">Online:</span>
          <app-avatar
            [variant]="variant"
            [size]="size"
            [shape]="shape"
            [imageSrc]="imageSrc"
            [imageAlt]="imageAlt"
            statusIndicator="online"
            [statusPosition]="statusPosition"
          />
        </div>
        <div class="flex items-center gap-4">
          <span class="w-24 text-sm font-medium">Offline:</span>
          <app-avatar
            [variant]="variant"
            [size]="size"
            [shape]="shape"
            [imageSrc]="imageSrc"
            [imageAlt]="imageAlt"
            statusIndicator="offline"
            [statusPosition]="statusPosition"
          />
        </div>
        <div class="flex items-center gap-4">
          <span class="w-24 text-sm font-medium">Away:</span>
          <app-avatar
            [variant]="variant"
            [size]="size"
            [shape]="shape"
            [imageSrc]="imageSrc"
            [imageAlt]="imageAlt"
            statusIndicator="away"
            [statusPosition]="statusPosition"
          />
        </div>
        <div class="flex items-center gap-4">
          <span class="w-24 text-sm font-medium">Do Not Disturb:</span>
          <app-avatar
            [variant]="variant"
            [size]="size"
            [shape]="shape"
            [imageSrc]="imageSrc"
            [imageAlt]="imageAlt"
            statusIndicator="dnd"
            [statusPosition]="statusPosition"
          />
        </div>
      </div>
    `),
  }),
};

export const StatusPositions: Story = {
  args: {
    variant: 'initials',
    size: 'xl',
    shape: 'full',
    initials: 'WD',
    statusIndicator: 'online',
  },
  render: (args) => ({
    props: args,
    template: wrapInLightDarkComparison(`
      <div class="grid grid-cols-2 gap-12 p-8">
        <div class="flex flex-col items-center gap-4">
          <span class="text-sm font-medium">Top Left</span>
          <app-avatar
            [variant]="variant"
            [size]="size"
            [shape]="shape"
            [initials]="initials"
            [statusIndicator]="statusIndicator"
            statusPosition="top-left"
          />
        </div>
        <div class="flex flex-col items-center gap-4">
          <span class="text-sm font-medium">Top Right</span>
          <app-avatar
            [variant]="variant"
            [size]="size"
            [shape]="shape"
            [initials]="initials"
            [statusIndicator]="statusIndicator"
            statusPosition="top-right"
          />
        </div>
        <div class="flex flex-col items-center gap-4">
          <span class="text-sm font-medium">Bottom Left</span>
          <app-avatar
            [variant]="variant"
            [size]="size"
            [shape]="shape"
            [initials]="initials"
            [statusIndicator]="statusIndicator"
            statusPosition="bottom-left"
          />
        </div>
        <div class="flex flex-col items-center gap-4">
          <span class="text-sm font-medium">Bottom Right</span>
          <app-avatar
            [variant]="variant"
            [size]="size"
            [shape]="shape"
            [initials]="initials"
            [statusIndicator]="statusIndicator"
            statusPosition="bottom-right"
          />
        </div>
      </div>
    `),
  }),
};

export const AvatarGroup: Story = {
  render: () => ({
    props: {},
    template: wrapInLightDarkComparison(`
      <div class="flex flex-col gap-8 p-8">
        <div class="flex items-center gap-3">
          <app-avatar
            variant="image"
            size="md"
            shape="full"
            imageSrc="https://i.pravatar.cc/150?img=1"
            imageAlt="User 1"
            statusIndicator="online"
          />
          <app-avatar
            variant="image"
            size="md"
            shape="full"
            imageSrc="https://i.pravatar.cc/150?img=2"
            imageAlt="User 2"
            statusIndicator="away"
          />
          <app-avatar
            variant="initials"
            size="md"
            shape="full"
            initials="AB"
            statusIndicator="offline"
          />
          <app-avatar
            variant="placeholder"
            size="md"
            shape="full"
          />
        </div>
        <div class="flex items-center -space-x-4">
          <app-avatar
            variant="image"
            size="lg"
            shape="full"
            imageSrc="https://i.pravatar.cc/150?img=10"
            imageAlt="User 1"
          />
          <app-avatar
            variant="image"
            size="lg"
            shape="full"
            imageSrc="https://i.pravatar.cc/150?img=11"
            imageAlt="User 2"
          />
          <app-avatar
            variant="image"
            size="lg"
            shape="full"
            imageSrc="https://i.pravatar.cc/150?img=12"
            imageAlt="User 3"
          />
          <app-avatar
            variant="initials"
            size="lg"
            shape="full"
            initials="+5"
          />
        </div>
      </div>
    `),
  }),
};
