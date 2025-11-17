import { render } from '@testing-library/angular';
import { Table } from './table';
import type { TableColumn, TableAction } from './table.models';
import { vi } from 'vitest';

interface TestData {
  id: number;
  name: string;
  category: string;
  price: number;
}

const mockData: TestData[] = [
  { id: 1, name: 'Product A', category: 'Electronics', price: 100 },
  { id: 2, name: 'Product B', category: 'Books', price: 20 },
  { id: 3, name: 'Product C', category: 'Electronics', price: 150 },
  { id: 4, name: 'Product D', category: 'Clothing', price: 50 },
  { id: 5, name: 'Product E', category: 'Books', price: 30 },
];

const mockColumns: TableColumn<TestData>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'price', label: 'Price', align: 'right', sortable: true },
];

describe('Table Component', () => {
  describe('Basic Rendering', () => {
    it('should create', async () => {
      // Arrange
      const props = { columns: mockColumns, data: mockData };

      // Act
      const { container } = await render(Table<TestData>, { componentProperties: props });

      // Assert
      expect(container).toBeTruthy();
    });

    it('should render table with columns', async () => {
      // Arrange
      const props = { columns: mockColumns, data: mockData };

      // Act
      const { container } = await render(Table<TestData>, { componentProperties: props });
      const headers = container.querySelectorAll('thead th');

      // Assert
      expect(headers.length).toBeGreaterThan(0);
      expect(container.textContent).toContain('Name');
      expect(container.textContent).toContain('Category');
      expect(container.textContent).toContain('Price');
    });

    it('should render data rows', async () => {
      // Arrange
      const props = { columns: mockColumns, data: mockData };

      // Act
      const { container } = await render(Table<TestData>, { componentProperties: props });

      // Assert
      expect(container.textContent).toContain('Product A');
      expect(container.textContent).toContain('Product B');
    });

    it('should render empty state when no data', async () => {
      // Arrange
      const props = { columns: mockColumns, data: [] };

      // Act
      const { container } = await render(Table<TestData>, { componentProperties: props });

      // Assert
      expect(container.textContent).toContain('No data available');
    });

    it('should apply compact density classes', async () => {
      // Arrange
      const props = { columns: mockColumns, data: mockData.slice(0, 1), density: 'compact' };

      // Act
      const { container } = await render(Table<TestData>, { componentProperties: props });
      const cell = container.querySelector('td');

      // Assert
      expect(cell?.className).toContain('px-4');
      expect(cell?.className).toContain('py-2');
    });

    it('should apply spacious density classes', async () => {
      // Arrange
      const props = { columns: mockColumns, data: mockData.slice(0, 1), density: 'spacious' };

      // Act
      const { container } = await render(Table<TestData>, { componentProperties: props });
      const cell = container.querySelector('td');

      // Assert
      expect(cell?.className).toContain('px-8');
      expect(cell?.className).toContain('py-5');
    });
  });

  describe('Search Functionality', () => {
    it('should render search input when searchable is true', async () => {
      // Arrange
      const props = { columns: mockColumns, data: mockData, searchable: true };

      // Act
      const { container } = await render(Table<TestData>, { componentProperties: props });
      const searchInput = container.querySelector('input[type="text"]') as HTMLInputElement;

      // Assert
      expect(searchInput).toBeTruthy();
    });

    it('should not render search input when searchable is false', async () => {
      // Arrange
      const props = { columns: mockColumns, data: mockData, searchable: false };

      // Act
      const { container } = await render(Table<TestData>, { componentProperties: props });
      const searchInput = container.querySelector('input[type="text"]') as HTMLInputElement;

      // Assert
      expect(searchInput).toBeFalsy();
    });

    it('should filter data based on search term', async () => {
      // Arrange
      const props = { columns: mockColumns, data: mockData, searchable: true };
      const { container } = await render(Table<TestData>, { componentProperties: props });
      const searchInput = container.querySelector('input[type="text"]') as HTMLInputElement;

      // Act
      searchInput.value = 'Electronics';
      searchInput.dispatchEvent(new Event('input'));
      await new Promise((r) => setTimeout(r, 0));

      // Assert
      expect(container.textContent).toContain('Product A');
      expect(container.textContent).toContain('Product C');
      expect(container.textContent).not.toContain('Product B');
    });

    it('should show all data when search is cleared', async () => {
      // Arrange
      const props = { columns: mockColumns, data: mockData, searchable: true };
      const { container } = await render(Table<TestData>, { componentProperties: props });
      const searchInput = container.querySelector('input[type="text"]') as HTMLInputElement;

      // Act
      searchInput.value = 'Electronics';
      searchInput.dispatchEvent(new Event('input'));
      await new Promise((r) => setTimeout(r, 0));

      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
      await new Promise((r) => setTimeout(r, 0));

      // Assert
      expect(container.textContent).toContain('Product A');
      expect(container.textContent).toContain('Product B');
    });
  });

  describe('Selection Functionality', () => {
    it('should render checkboxes when selectable is true', async () => {
      // Arrange
      const props = { columns: mockColumns, data: mockData.slice(0, 2), selectable: true };

      // Act
      const { container } = await render(Table<TestData>, { componentProperties: props });
      const checkboxes = container.querySelectorAll('input[type="checkbox"]');

      // Assert
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    it('should not render checkboxes when selectable is false', async () => {
      // Arrange
      const props = { columns: mockColumns, data: mockData.slice(0, 2), selectable: false };

      // Act
      const { container } = await render(Table<TestData>, { componentProperties: props });
      const checkboxes = container.querySelectorAll('input[type="checkbox"]');

      // Assert
      expect(checkboxes.length).toBe(0);
    });

    it('should select and deselect rows', async () => {
      // Arrange
      const props = { columns: mockColumns, data: mockData.slice(0, 2), selectable: true };
      const { container } = await render(Table<TestData>, { componentProperties: props });
      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      const rowCheckbox = checkboxes[1] as HTMLInputElement;

      // Act & Assert - Initial state
      expect(rowCheckbox.checked).toBe(false);

      // Act - Click to select
      rowCheckbox.click();
      await new Promise((r) => setTimeout(r, 0));
      expect(rowCheckbox.checked).toBe(true);

      // Act - Click to deselect
      rowCheckbox.click();
      await new Promise((r) => setTimeout(r, 0));
      expect(rowCheckbox.checked).toBe(false);
    });

    it('should emit selectionChange event', async () => {
      // Arrange
      const props = { columns: mockColumns, data: mockData.slice(0, 2), selectable: true };
      const { container, component } = await render(Table<TestData>, { componentProperties: props });

      let emittedValue: readonly TestData[] | undefined;
      component.selectionChange.subscribe((value) => {
        emittedValue = value;
      });

      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      const rowCheckbox = checkboxes[1] as HTMLInputElement;

      // Act
      rowCheckbox.click();
      await new Promise((r) => setTimeout(r, 0));

      // Assert
      expect(emittedValue).toBeDefined();
      expect(emittedValue?.length).toBeGreaterThan(0);
    });
  });

  describe('Pagination Functionality', () => {
    it('should render pagination controls when paginated is true', async () => {
      // Arrange
      const props = { columns: mockColumns, data: mockData, paginated: true, pageSize: 2 };

      // Act
      const { container } = await render(Table<TestData>, { componentProperties: props });

      // Assert
      expect(container.textContent).toContain('Previous');
      expect(container.textContent).toContain('Next');
    });

    it('should not render pagination when paginated is false', async () => {
      // Arrange
      const props = { columns: mockColumns, data: mockData, paginated: false };

      // Act
      const { container } = await render(Table<TestData>, { componentProperties: props });

      // Assert
      expect(container.textContent).not.toContain('Previous');
      expect(container.textContent).not.toContain('Next');
    });

    it('should show correct page size of data', async () => {
      // Arrange
      const props = { columns: mockColumns, data: mockData, paginated: true, pageSize: 2 };

      // Act
      const { container } = await render(Table<TestData>, { componentProperties: props });

      // Assert
      expect(container.textContent).toContain('Product A');
      expect(container.textContent).toContain('Product B');
      expect(container.textContent).not.toContain('Product C');
    });

    it('should navigate to next page', async () => {
      // Arrange
      const props = { columns: mockColumns, data: mockData, paginated: true, pageSize: 2 };
      const { container } = await render(Table<TestData>, { componentProperties: props });

      const nextButton = Array.from<HTMLButtonElement>(
        container.querySelectorAll('button')
      ).find((btn) => btn.textContent?.includes('Next'));

      // Act
      expect(nextButton).toBeTruthy();
      nextButton?.click();
      await new Promise((r) => setTimeout(r, 0));

      // Assert
      expect(container.textContent).not.toContain('Product A');
      expect(container.textContent).toContain('Product C');
    });

    it('should disable Previous on first page', async () => {
      // Arrange
      const props = { columns: mockColumns, data: mockData, paginated: true, pageSize: 2 };
      const { container } = await render(Table<TestData>, { componentProperties: props });

      const prevButton = Array.from<HTMLButtonElement>(
        container.querySelectorAll('button')
      ).find((btn) => btn.textContent?.includes('Previous'));

      // Assert
      expect(prevButton?.disabled).toBe(true);
    });

    it('should emit pageChange event', async () => {
      // Arrange
      const props = { columns: mockColumns, data: mockData, paginated: true, pageSize: 2 };
      const { container, component } = await render(Table<TestData>, { componentProperties: props });

      let emittedPage: number | undefined;
      component.pageChange.subscribe((page) => {
        emittedPage = page;
      });

      const nextButton = Array.from<HTMLButtonElement>(
        container.querySelectorAll('button')
      ).find((btn) => btn.textContent?.includes('Next'));

      // Act
      nextButton?.click();
      await new Promise((r) => setTimeout(r, 0));

      // Assert
      expect(emittedPage).toBe(2);
    });
  });

  describe('Sorting Functionality', () => {
    it('should sort data in ascending order', async () => {
      // Arrange
      const props = { columns: mockColumns, data: mockData, sortable: true };
      const { container } = await render(Table<TestData>, { componentProperties: props });

      const priceButton = Array.from<HTMLButtonElement>(
        container.querySelectorAll('th button')
      ).find((btn) => btn.textContent?.includes('Price'));

      // Act
      expect(priceButton).toBeTruthy();
      priceButton?.click();
      await new Promise((r) => setTimeout(r, 0));

      const rows = container.querySelectorAll('tbody tr');
      const firstRowText = rows[0]?.textContent || '';

      // Assert
      expect(firstRowText).toContain('Product B');
    });

    it('should sort data in descending order on second click', async () => {
      // Arrange
      const props = { columns: mockColumns, data: mockData, sortable: true };
      const { container } = await render(Table<TestData>, { componentProperties: props });

      const priceButton = Array.from<HTMLButtonElement>(
        container.querySelectorAll('th button')
      ).find((btn) => btn.textContent?.includes('Price'));

      // Act
      priceButton?.click();
      await new Promise((r) => setTimeout(r, 0));
      priceButton?.click();
      await new Promise((r) => setTimeout(r, 0));

      const rows = container.querySelectorAll('tbody tr');
      const firstRowText = rows[0]?.textContent || '';

      // Assert
      expect(firstRowText).toContain('Product C');
    });

    it('should emit sortChange event', async () => {
      // Arrange
      const props = { columns: mockColumns, data: mockData, sortable: true };
      const { container, component } = await render(Table<TestData>, { componentProperties: props });

      let emittedSort: { key: string; direction: 'asc' | 'desc' | null } | undefined;
      component.sortChange.subscribe((sort) => {
        emittedSort = sort;
      });

      const priceButton = Array.from<HTMLButtonElement>(
        container.querySelectorAll('th button')
      ).find((btn) => btn.textContent?.includes('Price'));

      // Act
      priceButton?.click();
      await new Promise((r) => setTimeout(r, 0));

      // Assert
      expect(emittedSort).toBeDefined();
      expect(emittedSort?.key).toBe('price');
      expect(emittedSort?.direction).toBe('asc');
    });
  });

  describe('Actions Functionality', () => {
    it('should render action buttons', async () => {
      // Arrange
      const mockActions: TableAction<TestData>[] = [
        { label: 'Edit', variant: 'primary', handler: () => {} },
        { label: 'Delete', variant: 'danger', handler: () => {} },
      ];
      const props = { columns: mockColumns, data: mockData.slice(0, 2), actions: mockActions };

      // Act
      const { container } = await render(Table<TestData>, { componentProperties: props });

      // Assert
      expect(container.textContent).toContain('Edit');
      expect(container.textContent).toContain('Delete');
    });

    it('should call action handler when clicked', async () => {
      // Arrange
      let handlerCalled = false;
      let receivedRow: TestData | undefined;

      const mockActions: TableAction<TestData>[] = [
        {
          label: 'Edit',
          variant: 'primary',
          handler: (row) => {
            handlerCalled = true;
            receivedRow = row;
          },
        },
      ];
      const props = { columns: mockColumns, data: mockData.slice(0, 1), actions: mockActions };
      const { container } = await render(Table<TestData>, { componentProperties: props });

      const editButton = Array.from<HTMLButtonElement>(
        container.querySelectorAll('button')
      ).find((btn) => btn.textContent?.includes('Edit'));

      // Act
      editButton?.click();
      await new Promise((r) => setTimeout(r, 0));

      // Assert
      expect(handlerCalled).toBe(true);
      expect(receivedRow).toEqual(mockData[0]);
    });

    it('should respect action conditions', async () => {
      // Arrange
      const mockActions: TableAction<TestData>[] = [
        {
          label: 'Premium',
          variant: 'primary',
          handler: () => {},
          condition: (row) => row.price > 100,
        },
      ];
      const props = { columns: mockColumns, data: mockData.slice(0, 3), actions: mockActions };

      // Act
      const { container } = await render(Table<TestData>, { componentProperties: props });

      const premiumButtons = Array.from<HTMLButtonElement>(
        container.querySelectorAll('button')
      ).filter((btn) => btn.textContent?.includes('Premium'));

      // Assert
      expect(premiumButtons.length).toBe(1);
    });
  });

  describe('Hoverable Functionality', () => {
    it('should apply hover classes when hoverable is true', async () => {
      // Arrange
      const props = { columns: mockColumns, data: mockData.slice(0, 1), hoverable: true };

      // Act
      const { container } = await render(Table<TestData>, { componentProperties: props });
      const row = container.querySelector('tbody tr');

      // Assert
      expect(row?.className).toContain('hover:bg-bg-secondary');
    });

    it('should not apply hover classes when hoverable is false', async () => {
      // Arrange
      const props = { columns: mockColumns, data: mockData.slice(0, 1), hoverable: false };

      // Act
      const { container } = await render(Table<TestData>, { componentProperties: props });
      const row = container.querySelector('tbody tr');

      // Assert
      expect(row?.className).not.toContain('hover:bg-bg-secondary');
    });
  });

  describe('Custom Rendering', () => {
    it('should use custom render function for columns', async () => {
      // Arrange
      const customColumns: TableColumn<TestData>[] = [
        {
          key: 'price',
          label: 'Price',
          render: (value: number) => `$${value.toFixed(2)}`,
        },
      ];
      const props = {
        columns: customColumns,
        data: [{ id: 1, name: 'Test', category: 'Cat', price: 99.5 }],
      };

      // Act
      const { container } = await render(Table<TestData>, { componentProperties: props });

      // Assert
      expect(container.textContent).toContain('$99.50');
    });
  });

  describe('data-testid Attributes', () => {
    it('should render data-testid on table wrapper', async () => {
      // Arrange
      const props = { columns: mockColumns, data: mockData.slice(0, 2), dataTestId: 'test-table' };

      // Act
      const { container } = await render(Table<TestData>, { componentProperties: props });
      const wrapper = container.querySelector('[data-testid="test-table-wrapper"]');

      // Assert
      expect(wrapper).toBeTruthy();
    });

    it('should render data-testid on table element', async () => {
      // Arrange
      const props = { columns: mockColumns, data: mockData.slice(0, 2), dataTestId: 'test-table' };

      // Act
      const { container } = await render(Table<TestData>, { componentProperties: props });
      const table = container.querySelector('table[data-testid="test-table"]');

      // Assert
      expect(table).toBeTruthy();
    });

    it('should render data-testid on search input when searchable', async () => {
      // Arrange
      const props = {
        columns: mockColumns,
        data: mockData.slice(0, 2),
        dataTestId: 'test-table',
        searchable: true,
      };

      // Act
      const { container } = await render(Table<TestData>, { componentProperties: props });
      const searchInput = container.querySelector('input[data-testid="test-table-search"]');

      // Assert
      expect(searchInput).toBeTruthy();
    });

    it('should render data-testid on pagination when paginated', async () => {
      // Arrange
      const props = {
        columns: mockColumns,
        data: mockData,
        dataTestId: 'test-table',
        paginated: true,
        pageSize: 2,
      };

      // Act
      const { container } = await render(Table<TestData>, { componentProperties: props });
      const pagination = container.querySelector('nav[data-testid="test-table-pagination"]');

      // Assert
      expect(pagination).toBeTruthy();
    });

    it('should render data-testid on table rows using row ID', async () => {
      // Arrange
      const props = { columns: mockColumns, data: mockData.slice(0, 3), dataTestId: 'test-table' };

      // Act
      const { container } = await render(Table<TestData>, { componentProperties: props });

      const row1 = container.querySelector('tr[data-testid="test-table-row-1"]');
      const row2 = container.querySelector('tr[data-testid="test-table-row-2"]');
      const row3 = container.querySelector('tr[data-testid="test-table-row-3"]');

      // Assert
      expect(row1).toBeTruthy();
      expect(row2).toBeTruthy();
      expect(row3).toBeTruthy();
    });

    it('should render data-testid on table rows using index when no ID property', async () => {
      // Arrange
      interface DataWithoutId {
        name: string;
        category: string;
      }

      const dataWithoutId: DataWithoutId[] = [
        { name: 'Item A', category: 'Cat A' },
        { name: 'Item B', category: 'Cat B' },
      ];

      const columnsForDataWithoutId: TableColumn<DataWithoutId>[] = [
        { key: 'name', label: 'Name' },
        { key: 'category', label: 'Category' },
      ];

      const props = { columns: columnsForDataWithoutId, data: dataWithoutId, dataTestId: 'test-table' };

      // Act
      const { container } = await render(Table<DataWithoutId>, { componentProperties: props });

      const row0 = container.querySelector('tr[data-testid="test-table-row-0"]');
      const row1 = container.querySelector('tr[data-testid="test-table-row-1"]');

      // Assert
      expect(row0).toBeTruthy();
      expect(row1).toBeTruthy();
    });

    it('should render data-testid on action buttons with row ID', async () => {
      // Arrange
      const mockActions: TableAction<TestData>[] = [
        { label: 'Edit', variant: 'primary', handler: () => {} },
        { label: 'Delete', variant: 'danger', handler: () => {} },
      ];

      const props = {
        columns: mockColumns,
        data: mockData.slice(0, 2),
        actions: mockActions,
        dataTestId: 'test-table',
      };

      // Act
      const { container } = await render(Table<TestData>, { componentProperties: props });

      const editBtn1 = container.querySelector('button[data-testid="test-table-action-edit-row-1"]');
      const deleteBtn1 = container.querySelector('button[data-testid="test-table-action-delete-row-1"]');
      const editBtn2 = container.querySelector('button[data-testid="test-table-action-edit-row-2"]');

      // Assert
      expect(editBtn1).toBeTruthy();
      expect(deleteBtn1).toBeTruthy();
      expect(editBtn2).toBeTruthy();
    });

    it('should render data-testid on action buttons with index when no ID property', async () => {
      // Arrange
      interface DataWithoutId {
        name: string;
        category: string;
      }

      const dataWithoutId: DataWithoutId[] = [
        { name: 'Item A', category: 'Cat A' },
        { name: 'Item B', category: 'Cat B' },
      ];

      const columnsForDataWithoutId: TableColumn<DataWithoutId>[] = [
        { key: 'name', label: 'Name' },
        { key: 'category', label: 'Category' },
      ];

      const mockActions: TableAction<DataWithoutId>[] = [{ label: 'Edit', variant: 'primary', handler: () => {} }];

      const props = {
        columns: columnsForDataWithoutId,
        data: dataWithoutId,
        actions: mockActions,
        dataTestId: 'test-table',
      };

      // Act
      const { container } = await render(Table<DataWithoutId>, { componentProperties: props });

      const editBtn0 = container.querySelector('button[data-testid="test-table-action-edit-row-0"]');
      const editBtn1 = container.querySelector('button[data-testid="test-table-action-edit-row-1"]');

      // Assert
      expect(editBtn0).toBeTruthy();
      expect(editBtn1).toBeTruthy();
    });

    it('should sanitize action labels with spaces in data-testid', async () => {
      // Arrange
      const mockActions: TableAction<TestData>[] = [
        { label: 'View Details', variant: 'primary', handler: () => {} },
      ];

      const props = {
        columns: mockColumns,
        data: mockData.slice(0, 1),
        actions: mockActions,
        dataTestId: 'test-table',
      };

      // Act
      const { container } = await render(Table<TestData>, { componentProperties: props });

      const viewBtn = container.querySelector('button[data-testid="test-table-action-view-details-row-1"]');

      // Assert
      expect(viewBtn).toBeTruthy();
    });

    it('should not render data-testid attributes when dataTestId is null', async () => {
      // Arrange
      const props = { columns: mockColumns, data: mockData.slice(0, 2), dataTestId: null };

      // Act
      const { container } = await render(Table<TestData>, { componentProperties: props });
      const rows = container.querySelectorAll('tbody tr[data-testid]');

      // Assert
      expect(rows.length).toBe(0);
    });
  });
});
