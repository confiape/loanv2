import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';

import { UserMenuComponent, UserMenuItem } from '@loan/app/shared/components/user-menu/user-menu';

const items: UserMenuItem[] = [
  {
    id: 'profile',
    label: 'Perfil',
    icon: '<svg fill="currentColor" viewBox="0 0 20 20" class="w-4 h-4"><path d="M10 10a4 4 0 1 0-4-4 4 4 0 0 0 4 4ZM2 17a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6Z"/></svg>',
  },
  { id: 'billing', label: 'Facturación' },
  { id: 'divider-1', label: '', divider: true },
  { id: 'settings', label: 'Configuración' },
  { id: 'logout', label: 'Cerrar sesión', action: 'logout' },
];

const meta: Meta<UserMenuComponent> = {
  title: 'Shared/UserMenu',
  component: UserMenuComponent,
  decorators: [
    moduleMetadata({
      imports: [UserMenuComponent],
    }),
  ],
  args: {
    userName: 'Isabella Stone',
    userEmail: 'isabella@example.com',
    menuItems: items,
  },
};

export default meta;
type Story = StoryObj<UserMenuComponent>;

const template = `
  <div class="flex items-center justify-center min-h-screen">
    <app-user-menu
      [userName]="userName"
      [userEmail]="userEmail"
      [userAvatar]="userAvatar"
      [menuItems]="menuItems"
    ></app-user-menu>
  </div>
`;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template,
  }),
};

export const WithAvatar: Story = {
  args: {
    userAvatar:
      'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=facearea&w=256&h=256&q=80',
  },
  render: (args) => ({
    props: args,
    template,
  }),
};
