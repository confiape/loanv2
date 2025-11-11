import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

import { NavbarComponent } from '@loan/app/layout/navbar/navbar';
import { Notification } from '@loan/app/shared/components/notification-button/notification-button';
import { AppMenuItem } from '@loan/app/shared/components/apps-menu/apps-menu';
import { UserMenuItem } from '@loan/app/shared/components/user-menu/user-menu';
import { UserApiService } from '@loan/app/shared/openapi';
import { AuthService } from '@loan/app/core/services/auth.service';
import { wrapInLightDarkComparison } from '@loan/stories/story-helpers';

const notifications: Notification[] = [
  { id: 'n1', title: 'Pago completado', message: 'Se aplicó el pago #1234', time: 'hace 5m' },
  {
    id: 'n2',
    title: 'Nueva solicitud',
    message: 'Juan Pérez envió documentos',
    time: 'hace 1h',
    read: true,
  },
];

const apps: AppMenuItem[] = [
  { id: 'analytics', label: 'Analytics', icon: '<span>📊</span>' },
  { id: 'crm', label: 'CRM', icon: '<span>👥</span>' },
  { id: 'billing', label: 'Billing', icon: '<span>💳</span>' },
];

const userMenuItems: UserMenuItem[] = [
  { id: 'profile', label: 'Perfil' },
  { id: 'settings', label: 'Configuración' },
  { id: 'divider', label: '', divider: true },
  { id: 'logout', label: 'Cerrar sesión', action: 'logout' },
];

const meta: Meta<NavbarComponent> = {
  title: 'Layout/Navbar',
  component: NavbarComponent,
  decorators: [
    moduleMetadata({
      imports: [NavbarComponent, RouterTestingModule],
      providers: [
        {
          provide: UserApiService,
          useValue: {
            getCurrentUser: () =>
              of({ email: 'isabella@loan.io', person: { name: 'Isabella Stone' } }),
          },
        },
        {
          provide: AuthService,
          useValue: {
            logout: () => of(undefined),
          },
        },
      ],
    }),
  ],
  args: {
    appTitle: 'Loan Platform',
    notifications,
    apps,
    userMenuItems,
    showSearch: true,
  },
};

export default meta;
type Story = StoryObj<NavbarComponent>;

const template = wrapInLightDarkComparison(`
  <div class="min-h-screen">
    <app-navbar
      [appTitle]="appTitle"
      [notifications]="notifications"
      [apps]="apps"
      [userMenuItems]="userMenuItems"
      [showSearch]="showSearch"
    ></app-navbar>
  </div>
`);

export const Default: Story = {
  render: (args) => ({
    props: args,
    template,
  }),
};

export const WithoutSearch: Story = {
  args: {
    showSearch: false,
  },
  render: (args) => ({
    props: args,
    template,
  }),
};
