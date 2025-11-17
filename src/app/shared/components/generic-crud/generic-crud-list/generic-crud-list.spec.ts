import { provideZonelessChangeDetection, signal } from '@angular/core';
import { render } from '@testing-library/angular';
import { provideRouter } from '@angular/router';
import { GenericCrudListComponent } from './generic-crud-list';
import { ICrudService } from '@loan/app/core/services/crud.interface';
import { of } from 'rxjs';

// Mock CRUD Service
class MockCrudService implements Partial<ICrudService<{ id: string; name: string }, unknown>> {
  items = signal<{ id: string; name: string }[]>([
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
  ]);
  filteredItems = signal<{ id: string; name: string }[]>([]);
  searchTerm = signal('');
  selectedItems = signal(new Set<string>());
  showModal = signal(false);
  showDeleteConfirm = signal(false);
  deleteMessage = signal('');
  editingItem = signal<{ id: string; name: string } | null>(null);
  currentPage = signal(1);
  pageSize = signal(10);

  getItemTypeName() {
    return 'item';
  }

  getItemTypePluralName() {
    return 'items';
  }

  getItemDisplayName(item: { id: string; name: string }) {
    return item.name;
  }

  getTableData() {
    return this.items();
  }

  getTableColumns() {
    return [
      {
        key: 'name' as const,
        label: 'Name',
        sortable: true,
      },
    ];
  }

  getFormFields() {
    return [];
  }

  getRouteBasePath() {
    return '/items';
  }

  hasSelection() {
    return this.selectedItems().size > 0;
  }

  selectedItemsData() {
    return [];
  }

  loadItems() {
    return of([]);
  }

  saveItem(dto: unknown) {
    return of({ id: '1', name: 'New Item' });
  }

  onNewItem() {}
  onEditItem() {}
  onDeleteItem() {}
  onBulkDelete() {}
  onFormSave() {}
  onFormCancel() {}
  onSearch() {}
  onSelectionChange() {}
  onSelectAll() {}
  removeFromSelection() {}
  clearSelection() {}
  confirmDelete() {}
  cancelDelete() {}
  openEditModal() {}
  onPageChange() {}
}

describe('GenericCrudListComponent', () => {
  it('should create', async () => {
    const mockService = new MockCrudService();

    const { container } = await render(GenericCrudListComponent, {
      componentInputs: {
        service: mockService as any,
        dataTestId: 'test-crud',
      },
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    });

    expect(container).toBeTruthy();
  });

  describe('data-testid propagation', () => {
    it('should render data-testid on search input', async () => {
      const mockService = new MockCrudService();

      const { container } = await render(GenericCrudListComponent, {
        componentInputs: {
          service: mockService as any,
          dataTestId: 'test-crud',
        },
        providers: [provideZonelessChangeDetection(), provideRouter([])],
      });

      const searchInput = container.querySelector('input[data-testid="test-crud-search-input"]');
      expect(searchInput).toBeTruthy();
    });

    it('should render data-testid on new button', async () => {
      const mockService = new MockCrudService();

      const { container } = await render(GenericCrudListComponent, {
        componentInputs: {
          service: mockService as any,
          dataTestId: 'test-crud',
        },
        providers: [provideZonelessChangeDetection(), provideRouter([])],
      });

      const newButton = container.querySelector('button[data-testid="test-crud-btn-new"]');
      expect(newButton).toBeTruthy();
    });

    it('should render data-testid on table', async () => {
      const mockService = new MockCrudService();

      const { container } = await render(GenericCrudListComponent, {
        componentInputs: {
          service: mockService as any,
          dataTestId: 'test-crud',
        },
        providers: [provideZonelessChangeDetection(), provideRouter([])],
      });

      const table = container.querySelector('table[data-testid="test-crud-table"]');
      expect(table).toBeTruthy();
    });

    it('should render data-testid on delete confirmation buttons', async () => {
      const mockService = new MockCrudService();
      mockService.showDeleteConfirm.set(true);
      mockService.deleteMessage.set('Are you sure?');

      const { container } = await render(GenericCrudListComponent, {
        componentInputs: {
          service: mockService as any,
          dataTestId: 'test-crud',
        },
        providers: [provideZonelessChangeDetection(), provideRouter([])],
      });

      const cancelBtn = container.querySelector(
        'button[data-testid="test-crud-btn-cancel-delete"]',
      );
      const confirmBtn = container.querySelector(
        'button[data-testid="test-crud-btn-confirm-delete"]',
      );

      expect(cancelBtn).toBeTruthy();
      expect(confirmBtn).toBeTruthy();
    });

    it('should render data-testid on selected items section when hasSelection is true', async () => {
      const mockService = new MockCrudService();
      mockService.selectedItems.set(new Set(['1']));
      mockService.hasSelection = () => true;
      mockService.selectedItemsData = () => [{ id: '1', name: 'Item 1' }] as any;

      const { container } = await render(GenericCrudListComponent, {
        componentInputs: {
          service: mockService as any,
          dataTestId: 'test-crud',
        },
        providers: [provideZonelessChangeDetection(), provideRouter([])],
      });

      const selectedSection = container.querySelector(
        '[data-testid="test-crud-selected-items"]',
      );
      expect(selectedSection).toBeTruthy();
    });

    it('should render data-testid on bulk delete button when items are selected', async () => {
      const mockService = new MockCrudService();
      mockService.selectedItems.set(new Set(['1']));
      mockService.hasSelection = () => true;
      mockService.selectedItemsData = () => [{ id: '1', name: 'Item 1' }] as any;

      const { container } = await render(GenericCrudListComponent, {
        componentInputs: {
          service: mockService as any,
          dataTestId: 'test-crud',
        },
        providers: [provideZonelessChangeDetection(), provideRouter([])],
      });

      const bulkDeleteBtn = container.querySelector(
        'button[data-testid="test-crud-btn-bulk-delete"]',
      );
      expect(bulkDeleteBtn).toBeTruthy();
    });
  });
});
