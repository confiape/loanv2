import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { fn } from 'storybook/test';
import { DropdownBasic } from '@loan/app/shared/components/dropdown/basic/dropdown-basic';
import { DropdownBasicHeader } from '@loan/app/shared/components/dropdown/basic/dropdown-basic-header';
import { DropdownBasicItem } from '@loan/app/shared/components/dropdown/basic/dropdown-basic-item';
import { DropdownBasicFooter } from '@loan/app/shared/components/dropdown/basic/dropdown-basic-footer';

const meta: Meta<DropdownBasic> = {
  title: 'UI/Dropdown/DropdownBasic',
  component: DropdownBasic,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [DropdownBasic, DropdownBasicHeader, DropdownBasicItem, DropdownBasicFooter],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    triggerConfig: {
      control: 'object',
      description: 'Configuration for trigger button (variant and size)',
    },
    placement: {
      control: 'select',
      options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'],
      description: 'Position of dropdown panel relative to trigger',
    },
    openStrategy: {
      control: 'select',
      options: ['click', 'hover'],
      description: 'Interaction method to open the dropdown',
    },
    closeOnSelect: {
      control: 'boolean',
      description: 'Whether to close dropdown when an item is clicked',
    },
    minPanelWidth: {
      control: 'number',
      description: 'Minimum width of dropdown panel in pixels',
    },
    openChange: {
      action: 'openChange',
      description: 'Emits when dropdown open state changes',
    },
    itemClick: {
      action: 'itemClick',
      description: 'Emits when a dropdown item is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<DropdownBasic>;

export const Default: Story = {
  args: {
    openChange: fn(),
    itemClick: fn(),
  },
  render: () => ({
    template: `
      <div class="flex justify-center items-start p-12">
        <app-dropdown-basic>
          <span trigger>Menu</span>

          <app-dropdown-basic-item [value]="'profile'">Profile</app-dropdown-basic-item>
          <app-dropdown-basic-item [value]="'settings'">Settings</app-dropdown-basic-item>
          <app-dropdown-basic-item [value]="'logout'">Logout</app-dropdown-basic-item>
        </app-dropdown-basic>
      </div>
    `,
  }),
};

export const WithHeader: Story = {
  args: {
    openChange: fn(),
    itemClick: fn(),
  },
  render: () => ({
    template: `
      <div class="flex justify-center items-start p-12">
        <app-dropdown-basic>
          <span trigger>User Menu</span>

          <app-dropdown-basic-header>
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white font-semibold">
                JD
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-semibold text-text-primary">John Doe</span>
                <span class="text-xs text-text-secondary">john.doe@example.com</span>
              </div>
            </div>
          </app-dropdown-basic-header>

          <app-dropdown-basic-item [value]="'profile'">My Profile</app-dropdown-basic-item>
          <app-dropdown-basic-item [value]="'settings'">Account Settings</app-dropdown-basic-item>
          <app-dropdown-basic-item [value]="'logout'">Sign Out</app-dropdown-basic-item>
        </app-dropdown-basic>
      </div>
    `,
  }),
};

export const WithFooter: Story = {
  args: {
    openChange: fn(),
    itemClick: fn(),
  },
  render: () => ({
    template: `
      <div class="flex justify-center items-start p-12">
        <app-dropdown-basic>
          <span trigger>Actions</span>

          <app-dropdown-basic-item [value]="'edit'">Edit</app-dropdown-basic-item>
          <app-dropdown-basic-item [value]="'duplicate'">Duplicate</app-dropdown-basic-item>
          <app-dropdown-basic-item [value]="'archive'">Archive</app-dropdown-basic-item>

          <app-dropdown-basic-footer>
            <a href="#" class="text-xs text-accent hover:underline">View all actions</a>
          </app-dropdown-basic-footer>
        </app-dropdown-basic>
      </div>
    `,
  }),
};

export const Complete: Story = {
  args: {
    openChange: fn(),
    itemClick: fn(),
  },
  render: () => ({
    template: `
      <div class="flex justify-center items-start p-12">
        <app-dropdown-basic>
          <span trigger>Account</span>

          <app-dropdown-basic-header>
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white font-semibold">
                JD
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-semibold text-text-primary">John Doe</span>
                <span class="text-xs text-text-secondary">john.doe@example.com</span>
              </div>
            </div>
          </app-dropdown-basic-header>

          <app-dropdown-basic-item [value]="'profile'">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
            </svg>
            Profile
          </app-dropdown-basic-item>
          <app-dropdown-basic-item [value]="'settings'">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
            </svg>
            Settings
          </app-dropdown-basic-item>
          <app-dropdown-basic-item [value]="'help'">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
            </svg>
            Help & Support
          </app-dropdown-basic-item>

          <app-dropdown-basic-footer>
            <div class="flex items-center justify-between">
              <span class="text-xs text-text-secondary">Version 1.0.0</span>
              <a href="#" class="text-xs text-accent hover:underline">Learn more</a>
            </div>
          </app-dropdown-basic-footer>
        </app-dropdown-basic>
      </div>
    `,
  }),
};

export const TriggerVariants: Story = {
  args: {
    openChange: fn(),
    itemClick: fn(),
  },
  render: () => ({
    template: `
      <div class="flex flex-wrap gap-8 p-12">
        <app-dropdown-basic [triggerConfig]="{variant: 'solid', size: 'md'}">
          <span trigger>Solid</span>
          <app-dropdown-basic-item [value]="'action1'">Action 1</app-dropdown-basic-item>
          <app-dropdown-basic-item [value]="'action2'">Action 2</app-dropdown-basic-item>
          <app-dropdown-basic-item [value]="'action3'">Action 3</app-dropdown-basic-item>
        </app-dropdown-basic>

        <app-dropdown-basic [triggerConfig]="{variant: 'soft', size: 'md'}">
          <span trigger>Soft</span>
          <app-dropdown-basic-item [value]="'action1'">Action 1</app-dropdown-basic-item>
          <app-dropdown-basic-item [value]="'action2'">Action 2</app-dropdown-basic-item>
          <app-dropdown-basic-item [value]="'action3'">Action 3</app-dropdown-basic-item>
        </app-dropdown-basic>

        <app-dropdown-basic [triggerConfig]="{variant: 'ghost', size: 'md'}">
          <span trigger>Ghost</span>
          <app-dropdown-basic-item [value]="'action1'">Action 1</app-dropdown-basic-item>
          <app-dropdown-basic-item [value]="'action2'">Action 2</app-dropdown-basic-item>
          <app-dropdown-basic-item [value]="'action3'">Action 3</app-dropdown-basic-item>
        </app-dropdown-basic>
      </div>
    `,
  }),
};

export const TriggerSizes: Story = {
  args: {
    openChange: fn(),
    itemClick: fn(),
  },
  render: () => ({
    template: `
      <div class="flex items-center gap-6 p-12">
        <app-dropdown-basic [triggerConfig]="{variant: 'solid', size: 'sm'}">
          <span trigger>Small</span>
          <app-dropdown-basic-item [value]="'action1'">Action 1</app-dropdown-basic-item>
          <app-dropdown-basic-item [value]="'action2'">Action 2</app-dropdown-basic-item>
          <app-dropdown-basic-item [value]="'action3'">Action 3</app-dropdown-basic-item>
        </app-dropdown-basic>

        <app-dropdown-basic [triggerConfig]="{variant: 'solid', size: 'md'}">
          <span trigger>Medium</span>
          <app-dropdown-basic-item [value]="'action1'">Action 1</app-dropdown-basic-item>
          <app-dropdown-basic-item [value]="'action2'">Action 2</app-dropdown-basic-item>
          <app-dropdown-basic-item [value]="'action3'">Action 3</app-dropdown-basic-item>
        </app-dropdown-basic>
      </div>
    `,
  }),
};

export const Placements: Story = {
  args: {
    openChange: fn(),
    itemClick: fn(),
  },
  render: () => ({
    template: `
      <div class="grid grid-cols-2 gap-16 p-16">
        <div class="flex flex-col items-center gap-4">
          <span class="text-sm font-semibold text-text-secondary">Bottom End (Default)</span>
          <app-dropdown-basic [placement]="'bottom-end'">
            <span trigger>Open</span>
            <app-dropdown-basic-item [value]="'action1'">Action 1</app-dropdown-basic-item>
            <app-dropdown-basic-item [value]="'action2'">Action 2</app-dropdown-basic-item>
            <app-dropdown-basic-item [value]="'action3'">Action 3</app-dropdown-basic-item>
          </app-dropdown-basic>
        </div>

        <div class="flex flex-col items-center gap-4">
          <span class="text-sm font-semibold text-text-secondary">Bottom Start</span>
          <app-dropdown-basic [placement]="'bottom-start'">
            <span trigger>Open</span>
            <app-dropdown-basic-item [value]="'action1'">Action 1</app-dropdown-basic-item>
            <app-dropdown-basic-item [value]="'action2'">Action 2</app-dropdown-basic-item>
            <app-dropdown-basic-item [value]="'action3'">Action 3</app-dropdown-basic-item>
          </app-dropdown-basic>
        </div>

        <div class="flex flex-col items-center gap-4">
          <span class="text-sm font-semibold text-text-secondary">Top End</span>
          <app-dropdown-basic [placement]="'top-end'">
            <span trigger>Open</span>
            <app-dropdown-basic-item [value]="'action1'">Action 1</app-dropdown-basic-item>
            <app-dropdown-basic-item [value]="'action2'">Action 2</app-dropdown-basic-item>
            <app-dropdown-basic-item [value]="'action3'">Action 3</app-dropdown-basic-item>
          </app-dropdown-basic>
        </div>

        <div class="flex flex-col items-center gap-4">
          <span class="text-sm font-semibold text-text-secondary">Top Start</span>
          <app-dropdown-basic [placement]="'top-start'">
            <span trigger>Open</span>
            <app-dropdown-basic-item [value]="'action1'">Action 1</app-dropdown-basic-item>
            <app-dropdown-basic-item [value]="'action2'">Action 2</app-dropdown-basic-item>
            <app-dropdown-basic-item [value]="'action3'">Action 3</app-dropdown-basic-item>
          </app-dropdown-basic>
        </div>
      </div>
    `,
  }),
};

export const HoverStrategy: Story = {
  args: {
    openChange: fn(),
    itemClick: fn(),
  },
  render: () => ({
    template: `
      <div class="flex justify-center items-start p-12">
        <div class="text-center">
          <p class="text-sm text-text-secondary mb-4">Hover over the button to open</p>
          <app-dropdown-basic [openStrategy]="'hover'">
            <span trigger>Hover Me</span>

            <app-dropdown-basic-item [value]="'action1'">Quick Action 1</app-dropdown-basic-item>
            <app-dropdown-basic-item [value]="'action2'">Quick Action 2</app-dropdown-basic-item>
            <app-dropdown-basic-item [value]="'action3'">Quick Action 3</app-dropdown-basic-item>
          </app-dropdown-basic>
        </div>
      </div>
    `,
  }),
};

export const DisabledItems: Story = {
  args: {
    openChange: fn(),
    itemClick: fn(),
  },
  render: () => ({
    template: `
      <div class="flex justify-center items-start p-12">
        <app-dropdown-basic>
          <span trigger>Options</span>

          <app-dropdown-basic-item [value]="'edit'">Edit</app-dropdown-basic-item>
          <app-dropdown-basic-item [value]="'share'">Share</app-dropdown-basic-item>
          <app-dropdown-basic-item [value]="'delete'" [disabled]="true">Delete (disabled)</app-dropdown-basic-item>
          <app-dropdown-basic-item [value]="'export'">Export</app-dropdown-basic-item>
          <app-dropdown-basic-item [value]="'archive'" [disabled]="true">Archive (disabled)</app-dropdown-basic-item>
        </app-dropdown-basic>
      </div>
    `,
  }),
};

export const CustomContent: Story = {
  args: {
    openChange: fn(),
    itemClick: fn(),
  },
  render: () => ({
    template: `
      <div class="flex justify-center items-start p-12">
        <app-dropdown-basic [minPanelWidth]="280">
          <span trigger>
            <svg class="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
            </svg>
            More Options
          </span>

          <app-dropdown-basic-header>
            <div class="space-y-1">
              <h4 class="text-sm font-semibold text-text-primary">Project Settings</h4>
              <p class="text-xs text-text-secondary">Manage your project configuration and team access</p>
            </div>
          </app-dropdown-basic-header>

          <app-dropdown-basic-item [value]="'general'">
            <div class="flex items-start gap-3 w-full">
              <svg class="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
              </svg>
              <div class="flex-1">
                <div class="text-sm font-medium">General Settings</div>
                <div class="text-xs text-text-secondary">Project name, description, status</div>
              </div>
            </div>
          </app-dropdown-basic-item>

          <app-dropdown-basic-item [value]="'team'">
            <div class="flex items-start gap-3 w-full">
              <svg class="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
              </svg>
              <div class="flex-1">
                <div class="text-sm font-medium">Team & Access</div>
                <div class="text-xs text-text-secondary">Manage members and permissions</div>
              </div>
            </div>
          </app-dropdown-basic-item>

          <app-dropdown-basic-item [value]="'integrations'">
            <div class="flex items-start gap-3 w-full">
              <svg class="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"/>
              </svg>
              <div class="flex-1">
                <div class="text-sm font-medium">Integrations</div>
                <div class="text-xs text-text-secondary">Connect third-party services</div>
              </div>
            </div>
          </app-dropdown-basic-item>

          <app-dropdown-basic-footer>
            <div class="flex items-center justify-between text-xs">
              <button class="text-accent hover:underline">Advanced settings</button>
              <span class="text-text-secondary">Need help?</span>
            </div>
          </app-dropdown-basic-footer>
        </app-dropdown-basic>
      </div>
    `,
  }),
};

export const WithIcons: Story = {
  args: {
    openChange: fn(),
    itemClick: fn(),
  },
  render: () => ({
    template: `
      <div class="flex justify-center items-start p-12">
        <app-dropdown-basic>
          <span trigger>
            <svg class="w-4 h-4 inline" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
            </svg>
          </span>

          <app-dropdown-basic-item [value]="'download'">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
            Download
          </app-dropdown-basic-item>

          <app-dropdown-basic-item [value]="'share'">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
            </svg>
            Share
          </app-dropdown-basic-item>

          <app-dropdown-basic-item [value]="'print'">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd"/>
            </svg>
            Print
          </app-dropdown-basic-item>

          <app-dropdown-basic-item [value]="'delete'">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            Delete
          </app-dropdown-basic-item>
        </app-dropdown-basic>
      </div>
    `,
  }),
};
