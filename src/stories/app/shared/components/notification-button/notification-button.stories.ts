import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';

import {
  NotificationButtonComponent,
  Notification,
} from '@loan/app/shared/components/notification-button/notification-button';

const notifications: Notification[] = [
  {
    id: 'n1',
    title: 'New message',
    message: 'You received a message from Maria',
    time: '2m ago',
    read: false,
  },
  {
    id: 'n2',
    title: 'Invoice ready',
    message: 'Invoice #1042 has been generated',
    time: '1h ago',
    read: false,
  },
  {
    id: 'n3',
    title: 'Server update',
    message: 'Production deployment completed successfully',
    time: '3h ago',
    read: true,
  },
  {
    id: 'n4',
    title: 'Reminder',
    message: 'Quarterly meeting tomorrow at 10am',
    time: 'Yesterday',
    read: true,
  },
];

const meta: Meta<NotificationButtonComponent> = {
  title: 'Shared/NotificationButton',
  component: NotificationButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [NotificationButtonComponent],
    }),
  ],
  args: {
    notifications,
    badgeCount: notifications.filter((n) => !n.read).length,
  },
};

export default meta;
type Story = StoryObj<NotificationButtonComponent>;

const template = `
  <div class="flex items-center justify-center min-h-screen">
    <app-notification-button
      [notifications]="notifications"
      [badgeCount]="badgeCount"
    ></app-notification-button>
  </div>
`;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template,
  }),
};

export const EmptyState: Story = {
  args: {
    notifications: [],
    badgeCount: 0,
    emptyMessage: 'You are all caught up!',
  },
  render: (args) => ({
    props: args,
    template,
  }),
};
