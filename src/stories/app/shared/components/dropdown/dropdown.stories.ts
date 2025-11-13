import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { Dropdown } from '@loan/app/shared/components/dropdown/advanced/dropdown';
import { DropdownFooterAction } from '@loan/app/shared/components/dropdown/advanced/dropdown.types';
import { DropdownSearchConfig } from '@loan/app/shared/components/dropdown/advanced/dropdown.types';
import { DropdownSection } from '@loan/app/shared/components/dropdown/advanced/dropdown.types';
import { DropdownTriggerConfig } from '@loan/app/shared/components/dropdown/advanced/dropdown.types';

type Story = StoryObj<Dropdown>;

const defaultTrigger: DropdownTriggerConfig = {
  label: 'Dropdown',
  trailingIcon: 'chevron-down',
  variant: 'solid',
  size: 'md',
  shape: 'rounded',
};

const simpleSections: DropdownSection[] = [
  {
    id: 'primary',
    items: [
      { type: 'action', id: 'dashboard', label: 'Dashboard' },
      { type: 'action', id: 'settings', label: 'Settings' },
      { type: 'action', id: 'earnings', label: 'Earnings' },
      { type: 'action', id: 'logout', label: 'Sign out', intent: 'danger' },
    ],
  },
];

const dividerSections: DropdownSection[] = [
  {
    id: 'main',
    items: [
      { type: 'action', id: 'dashboard', label: 'Dashboard' },
      { type: 'action', id: 'settings', label: 'Settings' },
      { type: 'action', id: 'earnings', label: 'Earnings' },
      { type: 'divider', id: 'divider-1' },
      { type: 'action', id: 'logout', label: 'Sign out', intent: 'danger' },
    ],
  },
];

const headerSections: DropdownSection[] = [
  {
    id: 'primary',
    items: [
      { type: 'action', id: 'dashboard', label: 'Dashboard' },
      { type: 'action', id: 'settings', label: 'Settings' },
      { type: 'action', id: 'earnings', label: 'Earnings' },
    ],
    separatorAfter: true,
  },
  {
    id: 'secondary',
    items: [{ type: 'action', id: 'logout', label: 'Sign out', intent: 'danger' }],
  },
];

const footerAction: DropdownFooterAction = {
  label: 'Add new user',
  icon: 'plus',
  intent: 'accent',
  href: '#',
};

const multiLevelSections: DropdownSection[] = [
  {
    id: 'main',
    items: [
      { type: 'action', id: 'dashboard', label: 'Dashboard' },
      {
        type: 'submenu',
        id: 'dropdown',
        label: 'Dropdown',
        children: [
          { type: 'action', id: 'overview', label: 'Overview' },
          { type: 'action', id: 'downloads', label: 'My downloads' },
          { type: 'action', id: 'billing', label: 'Billing' },
          { type: 'action', id: 'rewards', label: 'Rewards' },
        ],
      },
      { type: 'action', id: 'earnings', label: 'Earnings' },
      { type: 'action', id: 'logout', label: 'Sign out' },
    ],
  },
];

const scrollingSections: DropdownSection[] = [
  {
    id: 'users',
    items: [
      {
        type: 'user',
        id: 'user-1',
        label: 'Jese Leos',
        value: 'jese-leos',
        avatar: { name: 'Jese Leos', imageUrl: '/docs/images/people/profile-picture-1.jpg' },
      },
      {
        type: 'user',
        id: 'user-2',
        label: 'Robert Gough',
        value: 'robert-gough',
        avatar: { name: 'Robert Gough', imageUrl: '/docs/images/people/profile-picture-2.jpg' },
      },
      {
        type: 'user',
        id: 'user-3',
        label: 'Bonnie Green',
        value: 'bonnie-green',
        avatar: { name: 'Bonnie Green', imageUrl: '/docs/images/people/profile-picture-3.jpg' },
      },
      {
        type: 'user',
        id: 'user-4',
        label: 'Leslie Livingston',
        value: 'leslie-livingston',
        avatar: {
          name: 'Leslie Livingston',
          imageUrl: '/docs/images/people/profile-picture-4.jpg',
        },
      },
      {
        type: 'user',
        id: 'user-5',
        label: 'Michael Gough',
        value: 'michael-gough',
        avatar: { name: 'Michael Gough', imageUrl: '/docs/images/people/profile-picture-5.jpg' },
      },
      {
        type: 'user',
        id: 'user-6',
        label: 'Joseph Mcfall',
        value: 'joseph-mcfall',
        avatar: { name: 'Joseph Mcfall', imageUrl: '/docs/images/people/profile-picture-2.jpg' },
      },
      {
        type: 'user',
        id: 'user-7',
        label: 'Roberta Casas',
        value: 'roberta-casas',
        avatar: { name: 'Roberta Casas', imageUrl: '/docs/images/people/profile-picture-3.jpg' },
      },
      {
        type: 'user',
        id: 'user-8',
        label: 'Neil Sims',
        value: 'neil-sims',
        avatar: { name: 'Neil Sims', imageUrl: '/docs/images/people/profile-picture-1.jpg' },
      },
    ],
  },
];

const searchConfig: DropdownSearchConfig = {
  placeholder: 'Search user',
  ariaLabel: 'Search users',
};

const meta: Meta<Dropdown> = {
  title: 'UI/Dropdown',
  component: Dropdown,
  decorators: [
    moduleMetadata({
      imports: [Dropdown],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    trigger: defaultTrigger,
    sections: simpleSections,
  },
};

export default meta;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex min-h-screen items-start justify-center pt-16">
        <app-dropdown
          [trigger]="trigger"
          [sections]="sections"
        />
      </div>
    `,
  }),
};

export const WithDivider: Story = {
  args: {
    sections: dividerSections,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="flex min-h-screen items-start justify-center pt-16">
        <app-dropdown
          [trigger]="trigger"
          [sections]="sections"
        />
      </div>
    `,
  }),
};

export const WithHeaderAndFooter: Story = {
  args: {
    sections: headerSections,
    header: {
      title: 'Bonnie Green',
      subtitle: 'name@flowbite.com',
      avatar: { initials: 'BG', name: 'Bonnie Green' },
    },
    footerAction,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="flex min-h-screen items-start justify-center pt-16">
        <app-dropdown
          [trigger]="trigger"
          [sections]="sections"
          [header]="header"
          [footerAction]="footerAction"
        />
      </div>
    `,
  }),
};

export const MultiLevel: Story = {
  args: {
    sections: multiLevelSections,
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="flex min-h-screen items-start justify-center pt-16">
        <app-dropdown
          [trigger]="trigger"
          [sections]="sections"
        />
      </div>
    `,
  }),
};

export const WithSearchAndScrolling: Story = {
  args: {
    sections: scrollingSections,
    search: searchConfig,
    panelMaxHeight: 320,
    panelWidth: 240,
    footerAction: {
      label: 'Delete user',
      icon: 'minus',
      intent: 'danger',
      href: '#',
    },
    trigger: {
      ...defaultTrigger,
      label: 'Project users',
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="flex min-h-screen items-start justify-center pt-16">
        <app-dropdown
          [trigger]="trigger"
          [sections]="sections"
          [search]="search"
          [panelMaxHeight]="panelMaxHeight"
          [panelWidth]="panelWidth"
          [footerAction]="footerAction"
        />
      </div>
    `,
  }),
};
