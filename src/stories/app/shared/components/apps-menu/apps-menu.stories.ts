import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';

import { AppsMenuComponent, AppMenuItem } from '@loan/app/shared/components/apps-menu/apps-menu';
import { wrapInLightDarkComparison } from '@loan/stories/story-helpers';

const sampleApps: AppMenuItem[] = [
  {
    id: 'analytics',
    label: 'Analytics',
    icon: '<svg fill="currentColor" viewBox="0 0 24 24" class="w-6 h-6"><path d="M5 3a2 2 0 0 0-2 2v14h18V5a2 2 0 0 0-2-2H5Zm2 4h2v9H7V7Zm4 3h2v6h-2v-6Zm4-2h2v8h-2V8Z"/></svg>',
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: '<svg fill="currentColor" viewBox="0 0 24 24" class="w-6 h-6"><path d="M4 5h16v14H4z"/><path fill="#fff" d="M6 8h12v2H6zM6 12h8v2H6z"/></svg>',
  },
  {
    id: 'crm',
    label: 'CRM',
    icon: '<svg fill="currentColor" viewBox="0 0 24 24" class="w-6 h-6"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5Z"/></svg>',
  },
  {
    id: 'support',
    label: 'Support',
    icon: '<svg fill="currentColor" viewBox="0 0 24 24" class="w-6 h-6"><path d="M12 2a10 10 0 1 0 10 10h-2a8 8 0 1 1-8-8Z"/><path d="M11 6h2v7h-2zm0 8h2v2h-2z"/></svg>',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: '<svg fill="currentColor" viewBox="0 0 24 24" class="w-6 h-6"><path d="M5 3h14v18H5z"/><path fill="#fff" d="M7 7h10v2H7zm0 4h7v2H7zm0 4h5v2H7z"/></svg>',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: '<svg fill="currentColor" viewBox="0 0 24 24" class="w-6 h-6"><path d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.04 7.04 0 0 0-1.62-.94l-.36-2.54a.5.5 0 0 0-.5-.43h-3.84a.5.5 0 0 0-.5.43l-.36 2.54a7.04 7.04 0 0 0-1.62.94l-2.39-.96a.5.5 0 0 0-.6.22L2.71 8.84a.5.5 0 0 0 .12.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.38 1.04.7 1.62.94l.36 2.54a.5.5 0 0 0 .5.43h3.84a.5.5 0 0 0 .5-.43l.36-2.54a7.04 7.04 0 0 0 1.62-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64ZM12 15.5A3.5 3.5 0 1 1 15.5 12 3.5 3.5 0 0 1 12 15.5Z"/></svg>',
  },
];

const meta: Meta<AppsMenuComponent> = {
  title: 'Shared/AppsMenu',
  component: AppsMenuComponent,
  decorators: [
    moduleMetadata({
      imports: [AppsMenuComponent],
    }),
  ],
  args: {
    apps: sampleApps,
    title: 'Quick access',
  },
};

export default meta;
type Story = StoryObj<AppsMenuComponent>;

const renderTemplate = wrapInLightDarkComparison(`
  <div class="flex items-center justify-center min-h-screen">
    <app-apps-menu
      [apps]="apps"
      [title]="title"
    ></app-apps-menu>
  </div>
`);

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: renderTemplate,
  }),
};
