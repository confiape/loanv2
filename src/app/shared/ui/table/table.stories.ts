import type { Meta, StoryObj } from '@storybook/angular';
import { Table } from './table';
import type { TableColumn, TableAction } from './table.models';

// Datos de ejemplo
interface Product {
  id: number;
  name: string;
  color: string;
  category: string;
  price: number;
}

const sampleData: Product[] = [
  {
    id: 1,
    name: 'Apple MacBook Pro 17"',
    color: 'Silver',
    category: 'Laptop',
    price: 2999,
  },
  {
    id: 2,
    name: 'Microsoft Surface Pro',
    color: 'White',
    category: 'Laptop PC',
    price: 1999,
  },
  {
    id: 3,
    name: 'Magic Mouse 2',
    color: 'Black',
    category: 'Accessories',
    price: 99,
  },
  {
    id: 4,
    name: 'Apple Watch',
    color: 'Black',
    category: 'Watches',
    price: 199,
  },
  {
    id: 5,
    name: 'Apple iMac',
    color: 'Silver',
    category: 'PC',
    price: 2999,
  },
  {
    id: 6,
    name: 'Apple AirPods',
    color: 'White',
    category: 'Accessories',
    price: 399,
  },
  {
    id: 7,
    name: 'iPad Pro',
    color: 'Gold',
    category: 'Tablet',
    price: 699,
  },
  {
    id: 8,
    name: 'Magic Keyboard',
    color: 'Black',
    category: 'Accessories',
    price: 99,
  },
  {
    id: 9,
    name: 'Smart Folio iPad Air',
    color: 'Blue',
    category: 'Accessories',
    price: 79,
  },
  {
    id: 10,
    name: 'AirTag',
    color: 'Silver',
    category: 'Accessories',
    price: 29,
  },
];

const columns: TableColumn<Product>[] = [
  { key: 'name', label: 'Product Name', sortable: true },
  { key: 'color', label: 'Color', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  {
    key: 'price',
    label: 'Price',
    align: 'right',
    sortable: true,
    render: (value: number) => `$${value}`,
  },
];

const actions: TableAction<Product>[] = [
  {
    label: 'Edit',
    variant: 'primary',
    handler: (row) => console.log('Edit', row),
  },
  {
    label: 'Delete',
    variant: 'danger',
    handler: (row) => console.log('Delete', row),
    condition: (row) => row.price < 1000, // Solo mostrar para productos baratos
  },
];

const meta: Meta<Table<Product>> = {
  title: 'UI/Table',
  component: Table,
  tags: ['autodocs'],
  argTypes: {
    hoverable: { control: 'boolean' },
    selectable: { control: 'boolean' },
    searchable: { control: 'boolean' },
    paginated: { control: 'boolean' },
    sortable: { control: 'boolean' },
    pageSize: { control: 'number' },
    density: {
      control: 'select',
      options: ['compact', 'comfortable', 'spacious'],
    },
  },
};

export default meta;
type Story = StoryObj<Table<Product>>;

/**
 * Tabla básica sin funcionalidades adicionales
 */
export const Default: Story = {
  args: {
    columns,
    data: sampleData.slice(0, 5),
    hoverable: false,
    selectable: false,
    searchable: false,
    paginated: false,
    sortable: false,
  },
};

/**
 * Tabla con efecto hover en las filas
 */
export const Hoverable: Story = {
  args: {
    columns,
    data: sampleData.slice(0, 5),
    hoverable: true,
  },
};

/**
 * Tabla con búsqueda local
 */
export const Searchable: Story = {
  args: {
    columns,
    data: sampleData,
    searchable: true,
    hoverable: true,
  },
};

/**
 * Tabla con selección múltiple
 */
export const Selectable: Story = {
  args: {
    columns,
    data: sampleData.slice(0, 6),
    selectable: true,
    hoverable: true,
  },
};

/**
 * Tabla con paginación
 */
export const Paginated: Story = {
  args: {
    columns,
    data: sampleData,
    paginated: true,
    pageSize: 5,
    hoverable: true,
  },
};

/**
 * Tabla con ordenamiento de columnas
 */
export const Sortable: Story = {
  args: {
    columns,
    data: sampleData,
    sortable: true,
    hoverable: true,
  },
};

/**
 * Tabla con acciones por fila
 */
export const WithActions: Story = {
  args: {
    columns,
    data: sampleData.slice(0, 6),
    actions,
    hoverable: true,
  },
};

/**
 * Tabla con todas las funcionalidades activadas
 */
export const FullFeatured: Story = {
  args: {
    columns,
    data: sampleData,
    actions,
    hoverable: true,
    selectable: true,
    searchable: true,
    paginated: true,
    sortable: true,
    pageSize: 5,
  },
};

/**
 * Tabla con densidad compacta
 */
export const CompactDensity: Story = {
  args: {
    columns,
    data: sampleData.slice(0, 5),
    density: 'compact',
    hoverable: true,
  },
};

/**
 * Tabla con densidad espaciosa
 */
export const SpaciousDensity: Story = {
  args: {
    columns,
    data: sampleData.slice(0, 5),
    density: 'spacious',
    hoverable: true,
  },
};

/**
 * Tabla vacía (sin datos)
 */
export const Empty: Story = {
  args: {
    columns,
    data: [],
    searchable: true,
  },
};
