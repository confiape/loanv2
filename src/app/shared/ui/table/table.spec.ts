// Angular testing
import { TestBed } from '@angular/core/testing';
import {
  provideZonelessChangeDetection,
  inputBinding,
  outputBinding,
  signal,
} from '@angular/core';

// Testing library
import { within } from '@testing-library/dom';

// Vitest
import { describe, it, expect, vi } from 'vitest';

// Component under test
import { Table } from './table';
import type { TableColumn, TableAction } from './table.models';

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
  const defaultProviders = [provideZonelessChangeDetection()];

  describe('Basic Rendering', () => {
    it('should create', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData),
        ],
      });
      TestBed.tick();

      // Assert
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('should render table with columns', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData),
        ],
      });
      TestBed.tick();

      const headers = fixture.nativeElement.querySelectorAll('thead th');

      // Assert
      expect(headers.length).toBeGreaterThan(0);
      expect(fixture.nativeElement.textContent).toContain('Name');
      expect(fixture.nativeElement.textContent).toContain('Category');
      expect(fixture.nativeElement.textContent).toContain('Price');
    });

    it('should render data rows', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData),
        ],
      });
      TestBed.tick();

      // Assert
      expect(fixture.nativeElement.textContent).toContain('Product A');
      expect(fixture.nativeElement.textContent).toContain('Product B');
    });

    it('should render empty state when no data', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [inputBinding('columns', () => mockColumns), inputBinding('data', () => [])],
      });
      TestBed.tick();

      // Assert
      expect(fixture.nativeElement.textContent).toContain('No data available');
    });

    it('should apply compact density classes', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData.slice(0, 1)),
          inputBinding('density', () => 'compact'),
        ],
      });
      TestBed.tick();

      const cell = fixture.nativeElement.querySelector('td');

      // Assert
      expect(cell?.className).toContain('px-4');
      expect(cell?.className).toContain('py-2');
    });

    it('should apply spacious density classes', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData.slice(0, 1)),
          inputBinding('density', () => 'spacious'),
        ],
      });
      TestBed.tick();

      const cell = fixture.nativeElement.querySelector('td');

      // Assert
      expect(cell?.className).toContain('px-8');
      expect(cell?.className).toContain('py-5');
    });
  });

  describe('Search Functionality', () => {
    it('should render search input when searchable is true', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData),
          inputBinding('searchable', () => true),
        ],
      });
      TestBed.tick();

      const searchInput = fixture.nativeElement.querySelector(
        'input[type="text"]',
      ) as HTMLInputElement;

      // Assert
      expect(searchInput).toBeTruthy();
    });

    it('should not render search input when searchable is false', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData),
          inputBinding('searchable', () => false),
        ],
      });
      TestBed.tick();

      const searchInput = fixture.nativeElement.querySelector(
        'input[type="text"]',
      ) as HTMLInputElement;

      // Assert
      expect(searchInput).toBeFalsy();
    });

    it('should filter data based on search term', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData),
          inputBinding('searchable', () => true),
        ],
      });
      TestBed.tick();

      const searchInput = fixture.nativeElement.querySelector(
        'input[type="text"]',
      ) as HTMLInputElement;

      // Act
      searchInput.value = 'Electronics';
      searchInput.dispatchEvent(new Event('input'));
      TestBed.tick();

      // Assert
      expect(fixture.nativeElement.textContent).toContain('Product A');
      expect(fixture.nativeElement.textContent).toContain('Product C');
      expect(fixture.nativeElement.textContent).not.toContain('Product B');
    });

    it('should show all data when search is cleared', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData),
          inputBinding('searchable', () => true),
        ],
      });
      TestBed.tick();

      const searchInput = fixture.nativeElement.querySelector(
        'input[type="text"]',
      ) as HTMLInputElement;

      // Act
      searchInput.value = 'Electronics';
      searchInput.dispatchEvent(new Event('input'));
      TestBed.tick();

      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
      TestBed.tick();

      // Assert
      expect(fixture.nativeElement.textContent).toContain('Product A');
      expect(fixture.nativeElement.textContent).toContain('Product B');
    });
  });

  describe('Selection Functionality', () => {
    it('should render checkboxes when selectable is true', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData.slice(0, 2)),
          inputBinding('selectable', () => true),
        ],
      });
      TestBed.tick();

      const checkboxes = fixture.nativeElement.querySelectorAll('input[type="checkbox"]');

      // Assert
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    it('should not render checkboxes when selectable is false', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData.slice(0, 2)),
          inputBinding('selectable', () => false),
        ],
      });
      TestBed.tick();

      const checkboxes = fixture.nativeElement.querySelectorAll('input[type="checkbox"]');

      // Assert
      expect(checkboxes.length).toBe(0);
    });

    it('should select and deselect rows', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData.slice(0, 2)),
          inputBinding('selectable', () => true),
        ],
      });
      TestBed.tick();

      const checkboxes = fixture.nativeElement.querySelectorAll('input[type="checkbox"]');
      const rowCheckbox = checkboxes[1] as HTMLInputElement;

      // Assert - Initial state
      expect(rowCheckbox.checked).toBe(false);

      // Act - Click to select
      rowCheckbox.click();
      TestBed.tick();
      expect(rowCheckbox.checked).toBe(true);

      // Act - Click to deselect
      rowCheckbox.click();
      TestBed.tick();

      // Assert
      expect(rowCheckbox.checked).toBe(false);
    });

    it('should emit selectionChange event', () => {
      // Arrange
      const selectionSignal = signal<readonly TestData[]>([]);
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData.slice(0, 2)),
          inputBinding('selectable', () => true),
          outputBinding('selectionChange', (value: readonly TestData[]) =>
            selectionSignal.set(value),
          ),
        ],
      });
      TestBed.tick();

      const checkboxes = fixture.nativeElement.querySelectorAll('input[type="checkbox"]');
      const rowCheckbox = checkboxes[1] as HTMLInputElement;

      // Act
      rowCheckbox.click();
      TestBed.tick();

      // Assert
      expect(selectionSignal().length).toBeGreaterThan(0);
    });
  });

  describe('Pagination Functionality', () => {
    it('should render pagination controls when paginated is true', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData),
          inputBinding('paginated', () => true),
          inputBinding('pageSize', () => 2),
        ],
      });
      TestBed.tick();

      // Assert
      expect(fixture.nativeElement.textContent).toContain('Previous');
      expect(fixture.nativeElement.textContent).toContain('Next');
    });

    it('should not render pagination when paginated is false', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData),
          inputBinding('paginated', () => false),
        ],
      });
      TestBed.tick();

      // Assert
      expect(fixture.nativeElement.textContent).not.toContain('Previous');
      expect(fixture.nativeElement.textContent).not.toContain('Next');
    });

    it('should show correct page size of data', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData),
          inputBinding('paginated', () => true),
          inputBinding('pageSize', () => 2),
        ],
      });
      TestBed.tick();

      // Assert
      expect(fixture.nativeElement.textContent).toContain('Product A');
      expect(fixture.nativeElement.textContent).toContain('Product B');
      expect(fixture.nativeElement.textContent).not.toContain('Product C');
    });

    it('should navigate to next page', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData),
          inputBinding('paginated', () => true),
          inputBinding('pageSize', () => 2),
        ],
      });
      TestBed.tick();

      const nextButton = Array.from<HTMLButtonElement>(
        fixture.nativeElement.querySelectorAll('button'),
      ).find((btn) => btn.textContent?.includes('Next'));

      // Act
      expect(nextButton).toBeTruthy();
      nextButton?.click();
      TestBed.tick();

      // Assert
      expect(fixture.nativeElement.textContent).not.toContain('Product A');
      expect(fixture.nativeElement.textContent).toContain('Product C');
    });

    it('should disable Previous on first page', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData),
          inputBinding('paginated', () => true),
          inputBinding('pageSize', () => 2),
        ],
      });
      TestBed.tick();

      const prevButton = Array.from<HTMLButtonElement>(
        fixture.nativeElement.querySelectorAll('button'),
      ).find((btn) => btn.textContent?.includes('Previous'));

      // Assert
      expect(prevButton?.disabled).toBe(true);
    });

    it('should emit pageChange event', () => {
      // Arrange
      const pageSignal = signal(1);
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData),
          inputBinding('paginated', () => true),
          inputBinding('pageSize', () => 2),
          outputBinding('pageChange', (page: number) => pageSignal.set(page)),
        ],
      });
      TestBed.tick();

      const nextButton = Array.from<HTMLButtonElement>(
        fixture.nativeElement.querySelectorAll('button'),
      ).find((btn) => btn.textContent?.includes('Next'));

      // Act
      nextButton?.click();
      TestBed.tick();

      // Assert
      expect(pageSignal()).toBe(2);
    });
  });

  describe('Sorting Functionality', () => {
    it('should sort data in ascending order', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData),
          inputBinding('sortable', () => true),
        ],
      });
      TestBed.tick();

      const priceButton = Array.from<HTMLButtonElement>(
        fixture.nativeElement.querySelectorAll('th button'),
      ).find((btn) => btn.textContent?.includes('Price'));

      // Act
      expect(priceButton).toBeTruthy();
      priceButton?.click();
      TestBed.tick();

      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      const firstRowText = rows[0]?.textContent || '';

      // Assert
      expect(firstRowText).toContain('Product B');
    });

    it('should sort data in descending order on second click', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData),
          inputBinding('sortable', () => true),
        ],
      });
      TestBed.tick();

      const priceButton = Array.from<HTMLButtonElement>(
        fixture.nativeElement.querySelectorAll('th button'),
      ).find((btn) => btn.textContent?.includes('Price'));

      // Act
      priceButton?.click();
      TestBed.tick();
      priceButton?.click();
      TestBed.tick();

      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      const firstRowText = rows[0]?.textContent || '';

      // Assert
      expect(firstRowText).toContain('Product C');
    });

    it('should emit sortChange event', () => {
      // Arrange
      const sortSignal = signal<{ key: string; direction: 'asc' | 'desc' | null } | null>(null);
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData),
          inputBinding('sortable', () => true),
          outputBinding(
            'sortChange',
            (sort: { key: string; direction: 'asc' | 'desc' | null }) => sortSignal.set(sort),
          ),
        ],
      });
      TestBed.tick();

      const priceButton = Array.from<HTMLButtonElement>(
        fixture.nativeElement.querySelectorAll('th button'),
      ).find((btn) => btn.textContent?.includes('Price'));

      // Act
      priceButton?.click();
      TestBed.tick();

      // Assert
      expect(sortSignal()).toBeDefined();
      expect(sortSignal()?.key).toBe('price');
      expect(sortSignal()?.direction).toBe('asc');
    });
  });

  describe('Actions Functionality', () => {
    it('should render action buttons', () => {
      // Arrange
      const mockActions: TableAction<TestData>[] = [
        { label: 'Edit', variant: 'primary', handler: () => {} },
        { label: 'Delete', variant: 'danger', handler: () => {} },
      ];

      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData.slice(0, 2)),
          inputBinding('actions', () => mockActions),
        ],
      });
      TestBed.tick();

      // Assert
      expect(fixture.nativeElement.textContent).toContain('Edit');
      expect(fixture.nativeElement.textContent).toContain('Delete');
    });

    it('should call action handler when clicked', () => {
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

      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData.slice(0, 1)),
          inputBinding('actions', () => mockActions),
        ],
      });
      TestBed.tick();

      const editButton = Array.from<HTMLButtonElement>(
        fixture.nativeElement.querySelectorAll('button'),
      ).find((btn) => btn.textContent?.includes('Edit'));

      // Act
      editButton?.click();
      TestBed.tick();

      // Assert
      expect(handlerCalled).toBe(true);
      expect(receivedRow).toEqual(mockData[0]);
    });

    it('should respect action conditions', () => {
      // Arrange
      const mockActions: TableAction<TestData>[] = [
        {
          label: 'Premium',
          variant: 'primary',
          handler: () => {},
          condition: (row) => row.price > 100,
        },
      ];

      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData.slice(0, 3)),
          inputBinding('actions', () => mockActions),
        ],
      });
      TestBed.tick();

      const premiumButtons = Array.from<HTMLButtonElement>(
        fixture.nativeElement.querySelectorAll('button'),
      ).filter((btn) => btn.textContent?.includes('Premium'));

      // Assert
      expect(premiumButtons.length).toBe(1);
    });
  });

  describe('Hoverable Functionality', () => {
    it('should apply hover classes when hoverable is true', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData.slice(0, 1)),
          inputBinding('hoverable', () => true),
        ],
      });
      TestBed.tick();

      const row = fixture.nativeElement.querySelector('tbody tr');

      // Assert
      expect(row?.className).toContain('hover:bg-bg-secondary');
    });

    it('should not apply hover classes when hoverable is false', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData.slice(0, 1)),
          inputBinding('hoverable', () => false),
        ],
      });
      TestBed.tick();

      const row = fixture.nativeElement.querySelector('tbody tr');

      // Assert
      expect(row?.className).not.toContain('hover:bg-bg-secondary');
    });
  });

  describe('Custom Rendering', () => {
    it('should use custom render function for columns', () => {
      // Arrange
      const customColumns: TableColumn<TestData>[] = [
        {
          key: 'price',
          label: 'Price',
          render: (value: number) => `$${value.toFixed(2)}`,
        },
      ];

      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => customColumns),
          inputBinding('data', () => [{ id: 1, name: 'Test', category: 'Cat', price: 99.5 }]),
        ],
      });
      TestBed.tick();

      // Assert
      expect(fixture.nativeElement.textContent).toContain('$99.50');
    });
  });

  describe('data-testid Attributes', () => {
    it('should render data-testid on table wrapper', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData.slice(0, 2)),
          inputBinding('dataTestId', () => 'test-table'),
        ],
      });
      TestBed.tick();

      const wrapper = fixture.nativeElement.querySelector('[data-testid="test-table-wrapper"]');

      // Assert
      expect(wrapper).toBeTruthy();
    });

    it('should render data-testid on table element', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData.slice(0, 2)),
          inputBinding('dataTestId', () => 'test-table'),
        ],
      });
      TestBed.tick();

      const table = fixture.nativeElement.querySelector('table[data-testid="test-table"]');

      // Assert
      expect(table).toBeTruthy();
    });

    it('should render data-testid on search input when searchable', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData.slice(0, 2)),
          inputBinding('dataTestId', () => 'test-table'),
          inputBinding('searchable', () => true),
        ],
      });
      TestBed.tick();

      const searchInput = fixture.nativeElement.querySelector(
        'input[data-testid="test-table-search"]',
      );

      // Assert
      expect(searchInput).toBeTruthy();
    });

    it('should render data-testid on pagination when paginated', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData),
          inputBinding('dataTestId', () => 'test-table'),
          inputBinding('paginated', () => true),
          inputBinding('pageSize', () => 2),
        ],
      });
      TestBed.tick();

      const pagination = fixture.nativeElement.querySelector(
        'nav[data-testid="test-table-pagination"]',
      );

      // Assert
      expect(pagination).toBeTruthy();
    });

    it('should render data-testid on table rows using row ID', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData.slice(0, 3)),
          inputBinding('dataTestId', () => 'test-table'),
        ],
      });
      TestBed.tick();

      const row1 = fixture.nativeElement.querySelector('tr[data-testid="test-table-row-1"]');
      const row2 = fixture.nativeElement.querySelector('tr[data-testid="test-table-row-2"]');
      const row3 = fixture.nativeElement.querySelector('tr[data-testid="test-table-row-3"]');

      // Assert
      expect(row1).toBeTruthy();
      expect(row2).toBeTruthy();
      expect(row3).toBeTruthy();
    });

    it('should render data-testid on table rows using index when no ID property', () => {
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

      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<DataWithoutId>, {
        bindings: [
          inputBinding('columns', () => columnsForDataWithoutId),
          inputBinding('data', () => dataWithoutId),
          inputBinding('dataTestId', () => 'test-table'),
        ],
      });
      TestBed.tick();

      const row0 = fixture.nativeElement.querySelector('tr[data-testid="test-table-row-0"]');
      const row1 = fixture.nativeElement.querySelector('tr[data-testid="test-table-row-1"]');

      // Assert
      expect(row0).toBeTruthy();
      expect(row1).toBeTruthy();
    });

    it('should render data-testid on action buttons with row ID', () => {
      // Arrange
      const mockActions: TableAction<TestData>[] = [
        { label: 'Edit', variant: 'primary', handler: () => {} },
        { label: 'Delete', variant: 'danger', handler: () => {} },
      ];

      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData.slice(0, 2)),
          inputBinding('actions', () => mockActions),
          inputBinding('dataTestId', () => 'test-table'),
        ],
      });
      TestBed.tick();

      const editBtn1 = fixture.nativeElement.querySelector(
        'button[data-testid="test-table-action-edit-row-1"]',
      );
      const deleteBtn1 = fixture.nativeElement.querySelector(
        'button[data-testid="test-table-action-delete-row-1"]',
      );
      const editBtn2 = fixture.nativeElement.querySelector(
        'button[data-testid="test-table-action-edit-row-2"]',
      );

      // Assert
      expect(editBtn1).toBeTruthy();
      expect(deleteBtn1).toBeTruthy();
      expect(editBtn2).toBeTruthy();
    });

    it('should render data-testid on action buttons with index when no ID property', () => {
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

      const mockActions: TableAction<DataWithoutId>[] = [
        { label: 'Edit', variant: 'primary', handler: () => {} },
      ];

      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<DataWithoutId>, {
        bindings: [
          inputBinding('columns', () => columnsForDataWithoutId),
          inputBinding('data', () => dataWithoutId),
          inputBinding('actions', () => mockActions),
          inputBinding('dataTestId', () => 'test-table'),
        ],
      });
      TestBed.tick();

      const editBtn0 = fixture.nativeElement.querySelector(
        'button[data-testid="test-table-action-edit-row-0"]',
      );
      const editBtn1 = fixture.nativeElement.querySelector(
        'button[data-testid="test-table-action-edit-row-1"]',
      );

      // Assert
      expect(editBtn0).toBeTruthy();
      expect(editBtn1).toBeTruthy();
    });

    it('should sanitize action labels with spaces in data-testid', () => {
      // Arrange
      const mockActions: TableAction<TestData>[] = [
        { label: 'View Details', variant: 'primary', handler: () => {} },
      ];

      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData.slice(0, 1)),
          inputBinding('actions', () => mockActions),
          inputBinding('dataTestId', () => 'test-table'),
        ],
      });
      TestBed.tick();

      const viewBtn = fixture.nativeElement.querySelector(
        'button[data-testid="test-table-action-view-details-row-1"]',
      );

      // Assert
      expect(viewBtn).toBeTruthy();
    });

    it('should not render data-testid attributes when dataTestId is null', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(Table<TestData>, {
        bindings: [
          inputBinding('columns', () => mockColumns),
          inputBinding('data', () => mockData.slice(0, 2)),
          inputBinding('dataTestId', () => null),
        ],
      });
      TestBed.tick();

      const rows = fixture.nativeElement.querySelectorAll('tbody tr[data-testid]');

      // Assert
      expect(rows.length).toBe(0);
    });
  });
});
