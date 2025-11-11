import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { RouterTestingModule } from '@angular/router/testing';

import {
  BottomNavigationComponent,
  BottomNavItem,
} from '@loan/app/layout/bottom-navigation/bottom-navigation';
import { wrapInLightDarkComparison } from '@loan/stories/story-helpers';

const items: BottomNavItem[] = [
  { id: 'home', label: 'Inicio', icon: '<span>🏠</span>', routerLink: '/' },
  { id: 'accounts', label: 'Cuentas', icon: '<span>💼</span>', routerLink: '/accounts' },
  { id: 'cards', label: 'Tarjetas', icon: '<span>💳</span>', routerLink: '/cards' },
  { id: 'settings', label: 'Ajustes', icon: '<span>⚙️</span>', routerLink: '/settings' },
];

const meta: Meta<BottomNavigationComponent> = {
  title: 'Layout/BottomNavigation',
  component: BottomNavigationComponent,
  decorators: [
    moduleMetadata({
      imports: [BottomNavigationComponent, RouterTestingModule],
    }),
  ],
  args: {
    items,
  },
};

export default meta;
type Story = StoryObj<BottomNavigationComponent>;

const template = wrapInLightDarkComparison(`
  <div class="min-h-screen flex flex-col justify-end">
    <app-bottom-navigation [items]="items"></app-bottom-navigation>
  </div>
`);

export const Default: Story = {
  render: (args) => ({
    props: args,
    template,
  }),
};
