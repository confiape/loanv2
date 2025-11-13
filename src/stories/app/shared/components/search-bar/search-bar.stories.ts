import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';

import { SearchBarComponent } from '@loan/app/shared/components/search-bar/search-bar';

const meta: Meta<SearchBarComponent> = {
  title: 'Shared/SearchBar',
  component: SearchBarComponent,
  decorators: [
    moduleMetadata({
      imports: [SearchBarComponent],
    }),
  ],
  args: {
    placeholder: 'Buscar oportunidades',
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<SearchBarComponent>;

const template = `
  <div class="flex items-center justify-center min-h-screen">
    <app-search-bar
      [placeholder]="placeholder"
      [size]="size"
      [disabled]="disabled"
    ></app-search-bar>
  </div>
`;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template,
  }),
};

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Busca clientes, préstamos o tareas',
  },
  render: (args) => ({
    props: args,
    template,
  }),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Búsqueda deshabilitada',
  },
  render: (args) => ({
    props: args,
    template,
  }),
};
