import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { provideIcons } from '@ng-icons/core';
import {
  heroChartPie,
  heroDocumentText,
  heroCheckCircle,
  heroClock,
  heroCheckBadge,
  heroUsers,
  heroBuildingOffice2,
  heroUserGroup,
  heroChartBar,
  heroCog6Tooth,
  heroQuestionMarkCircle,
  heroSquares2x2,
  heroChevronLeft,
  heroChevronRight,
  heroChevronDown,
} from '@ng-icons/heroicons/outline';

import { SidenavComponent, SidenavItem } from '@loan/app/layout/sidenav/sidenav';
import { wrapInLightDarkComparison } from '@loan/stories/story-helpers';

const items: SidenavItem[] = [
  { label: 'Dashboard', icon: 'heroChartPie', value: 'dashboard' },
  {
    label: 'Loans',
    icon: 'heroDocumentText',
    value: 'loans',
    badge: '12',
    children: [
      { label: 'Activos', icon: 'heroCheckCircle', value: 'loans-active' },
      { label: 'Pendientes', icon: 'heroClock', value: 'loans-pending', badge: '3' },
      { label: 'Completados', icon: 'heroCheckBadge', value: 'loans-done' },
    ],
  },
  { label: 'Clientes', icon: 'heroUsers', value: 'customers' },
  { label: 'Empresas', icon: 'heroBuildingOffice2', value: 'companies' },
  { label: 'Roles', icon: 'heroUserGroup', value: 'roles' },
  { label: 'Reportes', icon: 'heroChartBar', value: 'reports' },
  { label: 'divider', divider: true, value: 'divider-1' },
  { label: 'Configuración', icon: 'heroCog6Tooth', value: 'settings' },
  { label: 'Ayuda', icon: 'heroQuestionMarkCircle', value: 'help' },
];

const meta: Meta<SidenavComponent> = {
  title: 'Layout/Sidenav',
  component: SidenavComponent,
  decorators: [
    moduleMetadata({
      imports: [SidenavComponent, RouterTestingModule],
      providers: [
        provideIcons({
          heroChartPie,
          heroDocumentText,
          heroCheckCircle,
          heroClock,
          heroCheckBadge,
          heroUsers,
          heroBuildingOffice2,
          heroUserGroup,
          heroChartBar,
          heroCog6Tooth,
          heroQuestionMarkCircle,
          heroSquares2x2,
          heroChevronLeft,
          heroChevronRight,
          heroChevronDown,
        }),
      ],
    }),
  ],
  args: {
    items,
    header: 'Loan Admin',
    logo: 'heroSquares2x2',
    collapsible: true,
    showToggle: true,
  },
};

export default meta;
type Story = StoryObj<SidenavComponent>;

const template = wrapInLightDarkComparison(`
  <div class="min-h-screen">
    <app-sidenav
      [items]="items"
      [header]="header"
      [logo]="logo"
      [collapsed]="collapsed"
      [collapsible]="collapsible"
      [showToggle]="showToggle"
    ></app-sidenav>
  </div>
`);

export const Default: Story = {
  render: (args) => ({ props: args, template }),
};

export const Collapsed: Story = {
  args: {
    collapsed: true,
  },
  render: (args) => ({ props: args, template }),
};
