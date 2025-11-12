import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
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
  let fixture: ComponentFixture<Table<TestData>>;
  let component: Table<TestData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Table],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Table<TestData>);
    component = fixture.componentInstance;
  });

  function getTableElement(): HTMLTableElement {
    return fixture.nativeElement.querySelector('table') as HTMLTableElement;
  }

  function getSearchInput(): HTMLInputElement | null {
    return fixture.nativeElement.querySelector('input[type="text"]');
  }

  function getRows(): NodeListOf<HTMLTableRowElement> {
    return fixture.nativeElement.querySelectorAll('tbody tr');
  }

  function getCheckboxes(): NodeListOf<HTMLInputElement> {
    return fixture.nativeElement.querySelectorAll('input[type="checkbox"]');
  }

  describe('Basic Rendering', () => {
    it('should create', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      expect(component).toBeTruthy();
    });

    it('should render table with columns', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      const headers = fixture.nativeElement.querySelectorAll('thead th');
      expect(headers.length).toBeGreaterThan(0);
      expect(fixture.nativeElement.textContent).toContain('Name');
      expect(fixture.nativeElement.textContent).toContain('Category');
      expect(fixture.nativeElement.textContent).toContain('Price');
    });

    it('should render data rows', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('Product A');
      expect(fixture.nativeElement.textContent).toContain('Product B');
    });

    it('should render empty state when no data', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', []);
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('No data available');
    });

    it('should apply compact density classes', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData.slice(0, 1));
      fixture.componentRef.setInput('density', 'compact');
      fixture.detectChanges();

      const cell = fixture.nativeElement.querySelector('td');
      expect(cell?.className).toContain('px-4');
      expect(cell?.className).toContain('py-2');
    });

    it('should apply spacious density classes', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData.slice(0, 1));
      fixture.componentRef.setInput('density', 'spacious');
      fixture.detectChanges();

      const cell = fixture.nativeElement.querySelector('td');
      expect(cell?.className).toContain('px-8');
      expect(cell?.className).toContain('py-5');
    });
  });

  describe('Search Functionality', () => {
    it('should render search input when searchable is true', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.componentRef.setInput('searchable', true);
      fixture.detectChanges();

      const searchInput = getSearchInput();
      expect(searchInput).toBeTruthy();
    });

    it('should not render search input when searchable is false', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.componentRef.setInput('searchable', false);
      fixture.detectChanges();

      const searchInput = getSearchInput();
      expect(searchInput).toBeFalsy();
    });

    it('should filter data based on search term', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.componentRef.setInput('searchable', true);
      fixture.detectChanges();

      const searchInput = getSearchInput();
      expect(searchInput).toBeTruthy();

      if (searchInput) {
        searchInput.value = 'Electronics';
        searchInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(fixture.nativeElement.textContent).toContain('Product A');
        expect(fixture.nativeElement.textContent).toContain('Product C');
        expect(fixture.nativeElement.textContent).not.toContain('Product B');
      }
    });

    it('should show all data when search is cleared', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.componentRef.setInput('searchable', true);
      fixture.detectChanges();

      const searchInput = getSearchInput();
      if (searchInput) {
        searchInput.value = 'Electronics';
        searchInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(fixture.nativeElement.textContent).toContain('Product A');
        expect(fixture.nativeElement.textContent).toContain('Product B');
      }
    });
  });

  describe('Selection Functionality', () => {
    it('should render checkboxes when selectable is true', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData.slice(0, 2));
      fixture.componentRef.setInput('selectable', true);
      fixture.detectChanges();

      const checkboxes = getCheckboxes();
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    it('should not render checkboxes when selectable is false', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData.slice(0, 2));
      fixture.componentRef.setInput('selectable', false);
      fixture.detectChanges();

      const checkboxes = getCheckboxes();
      expect(checkboxes.length).toBe(0);
    });

    it('should select and deselect rows', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData.slice(0, 2));
      fixture.componentRef.setInput('selectable', true);
      fixture.detectChanges();

      const checkboxes = getCheckboxes();
      const rowCheckbox = checkboxes[1] as HTMLInputElement; // Skip "select all"

      expect(rowCheckbox.checked).toBe(false);

      rowCheckbox.click();
      fixture.detectChanges();
      expect(rowCheckbox.checked).toBe(true);

      rowCheckbox.click();
      fixture.detectChanges();
      expect(rowCheckbox.checked).toBe(false);
    });

    it('should emit selectionChange event', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData.slice(0, 2));
      fixture.componentRef.setInput('selectable', true);
      fixture.detectChanges();

      let emittedValue: TestData[] | undefined;
      component.selectionChange.subscribe((value) => {
        emittedValue = value;
      });

      const checkboxes = getCheckboxes();
      const rowCheckbox = checkboxes[1] as HTMLInputElement;
      rowCheckbox.click();
      fixture.detectChanges();

      expect(emittedValue).toBeDefined();
      expect(emittedValue?.length).toBeGreaterThan(0);
    });
  });

  describe('Pagination Functionality', () => {
    it('should render pagination controls when paginated is true', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.componentRef.setInput('paginated', true);
      fixture.componentRef.setInput('pageSize', 2);
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('Previous');
      expect(fixture.nativeElement.textContent).toContain('Next');
    });

    it('should not render pagination when paginated is false', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.componentRef.setInput('paginated', false);
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).not.toContain('Previous');
      expect(fixture.nativeElement.textContent).not.toContain('Next');
    });

    it('should show correct page size of data', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.componentRef.setInput('paginated', true);
      fixture.componentRef.setInput('pageSize', 2);
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('Product A');
      expect(fixture.nativeElement.textContent).toContain('Product B');
      expect(fixture.nativeElement.textContent).not.toContain('Product C');
    });

    it('should navigate to next page', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.componentRef.setInput('paginated', true);
      fixture.componentRef.setInput('pageSize', 2);
      fixture.detectChanges();

      const nextButton = Array.from<HTMLButtonElement>(
        fixture.nativeElement.querySelectorAll('button')
      ).find((btn) => btn.textContent?.includes('Next'));

      expect(nextButton).toBeTruthy();
      nextButton?.click();
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).not.toContain('Product A');
      expect(fixture.nativeElement.textContent).toContain('Product C');
    });

    it('should disable Previous on first page', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.componentRef.setInput('paginated', true);
      fixture.componentRef.setInput('pageSize', 2);
      fixture.detectChanges();

      const prevButton = Array.from<HTMLButtonElement>(
        fixture.nativeElement.querySelectorAll('button')
      ).find((btn) => btn.textContent?.includes('Previous'));

      expect(prevButton?.disabled).toBe(true);
    });

    it('should emit pageChange event', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.componentRef.setInput('paginated', true);
      fixture.componentRef.setInput('pageSize', 2);
      fixture.detectChanges();

      let emittedPage: number | undefined;
      component.pageChange.subscribe((page) => {
        emittedPage = page;
      });

      const nextButton = Array.from<HTMLButtonElement>(
        fixture.nativeElement.querySelectorAll('button')
      ).find((btn) => btn.textContent?.includes('Next'));

      nextButton?.click();
      fixture.detectChanges();

      expect(emittedPage).toBe(2);
    });
  });

  describe('Sorting Functionality', () => {
    it('should sort data in ascending order', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.componentRef.setInput('sortable', true);
      fixture.detectChanges();

      // Find the Price header button
      const priceButton = Array.from<HTMLButtonElement>(
        fixture.nativeElement.querySelectorAll('th button')
      ).find((btn) => btn.textContent?.includes('Price'));

      expect(priceButton).toBeTruthy();
      priceButton?.click();
      fixture.detectChanges();

      const rows = getRows();
      const firstRowText = rows[0]?.textContent || '';
      expect(firstRowText).toContain('Product B'); // Price 20
    });

    it('should sort data in descending order on second click', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.componentRef.setInput('sortable', true);
      fixture.detectChanges();

      const priceButton = Array.from<HTMLButtonElement>(
        fixture.nativeElement.querySelectorAll('th button')
      ).find((btn) => btn.textContent?.includes('Price'));

      priceButton?.click();
      fixture.detectChanges();
      priceButton?.click();
      fixture.detectChanges();

      const rows = getRows();
      const firstRowText = rows[0]?.textContent || '';
      expect(firstRowText).toContain('Product C'); // Price 150
    });

    it('should emit sortChange event', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData);
      fixture.componentRef.setInput('sortable', true);
      fixture.detectChanges();

      let emittedSort: { key: string; direction: 'asc' | 'desc' | null } | undefined;
      component.sortChange.subscribe((sort) => {
        emittedSort = sort;
      });

      const priceButton = Array.from<HTMLButtonElement>(
        fixture.nativeElement.querySelectorAll('th button')
      ).find((btn) => btn.textContent?.includes('Price'));

      priceButton?.click();
      fixture.detectChanges();

      expect(emittedSort).toBeDefined();
      expect(emittedSort?.key).toBe('price');
      expect(emittedSort?.direction).toBe('asc');
    });
  });

  describe('Actions Functionality', () => {
    it('should render action buttons', () => {
      const mockActions: TableAction<TestData>[] = [
        { label: 'Edit', variant: 'primary', handler: () => {} },
        { label: 'Delete', variant: 'danger', handler: () => {} },
      ];

      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData.slice(0, 2));
      fixture.componentRef.setInput('actions', mockActions);
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('Edit');
      expect(fixture.nativeElement.textContent).toContain('Delete');
    });

    it('should call action handler when clicked', () => {
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

      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData.slice(0, 1));
      fixture.componentRef.setInput('actions', mockActions);
      fixture.detectChanges();

      const editButton = Array.from<HTMLButtonElement>(
        fixture.nativeElement.querySelectorAll('button')
      ).find((btn) => btn.textContent?.includes('Edit'));

      editButton?.click();
      fixture.detectChanges();

      expect(handlerCalled).toBe(true);
      expect(receivedRow).toEqual(mockData[0]);
    });

    it('should respect action conditions', () => {
      const mockActions: TableAction<TestData>[] = [
        {
          label: 'Premium',
          variant: 'primary',
          handler: () => {},
          condition: (row) => row.price > 100,
        },
      ];

      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData.slice(0, 3));
      fixture.componentRef.setInput('actions', mockActions);
      fixture.detectChanges();

      const premiumButtons = Array.from<HTMLButtonElement>(
        fixture.nativeElement.querySelectorAll('button')
      ).filter((btn) => btn.textContent?.includes('Premium'));

      // Only Product C (price 150) should have the button
      expect(premiumButtons.length).toBe(1);
    });
  });

  describe('Hoverable Functionality', () => {
    it('should apply hover classes when hoverable is true', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData.slice(0, 1));
      fixture.componentRef.setInput('hoverable', true);
      fixture.detectChanges();

      const row = fixture.nativeElement.querySelector('tbody tr');
      expect(row?.className).toContain('hover:bg-bg-secondary');
    });

    it('should not apply hover classes when hoverable is false', () => {
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('data', mockData.slice(0, 1));
      fixture.componentRef.setInput('hoverable', false);
      fixture.detectChanges();

      const row = fixture.nativeElement.querySelector('tbody tr');
      expect(row?.className).not.toContain('hover:bg-bg-secondary');
    });
  });

  describe('Custom Rendering', () => {
    it('should use custom render function for columns', () => {
      const customColumns: TableColumn<TestData>[] = [
        {
          key: 'price',
          label: 'Price',
          render: (value: number) => `$${value.toFixed(2)}`,
        },
      ];

      fixture.componentRef.setInput('columns', customColumns);
      fixture.componentRef.setInput('data', [
        { id: 1, name: 'Test', category: 'Cat', price: 99.5 },
      ]);
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('$99.50');
    });
  });
});
