import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, signal, inputBinding } from '@angular/core';
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
  const defaultProviders = [provideZonelessChangeDetection(), provideRouter([])];

  it('should create', () => {
    // Arrange
    const mockService = new MockCrudService();
    const fixture = TestBed.configureTestingModule({
      providers: defaultProviders,
    }).createComponent(GenericCrudListComponent, {
      bindings: [
        inputBinding('service', () => mockService as any),
        inputBinding('dataTestId', () => 'test-crud'),
      ],
    });
    TestBed.tick();

    // Assert
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('data-testid propagation', () => {
    it('should render data-testid on search input', () => {
      // Arrange
      const mockService = new MockCrudService();
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(GenericCrudListComponent, {
        bindings: [
          inputBinding('service', () => mockService as any),
          inputBinding('dataTestId', () => 'test-crud'),
        ],
      });
      TestBed.tick();

      // Assert
      const searchInput = fixture.nativeElement.querySelector(
        'input[data-testid="test-crud-search-input"]',
      );
      expect(searchInput).toBeTruthy();
    });

    it('should render data-testid on new button', () => {
      // Arrange
      const mockService = new MockCrudService();
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(GenericCrudListComponent, {
        bindings: [
          inputBinding('service', () => mockService as any),
          inputBinding('dataTestId', () => 'test-crud'),
        ],
      });
      TestBed.tick();

      // Assert
      const newButton = fixture.nativeElement.querySelector(
        'button[data-testid="test-crud-btn-new"]',
      );
      expect(newButton).toBeTruthy();
    });

    it('should render data-testid on table', () => {
      // Arrange
      const mockService = new MockCrudService();
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(GenericCrudListComponent, {
        bindings: [
          inputBinding('service', () => mockService as any),
          inputBinding('dataTestId', () => 'test-crud'),
        ],
      });
      TestBed.tick();

      // Assert
      const table = fixture.nativeElement.querySelector('table[data-testid="test-crud-table"]');
      expect(table).toBeTruthy();
    });

    it('should render data-testid on delete confirmation buttons', () => {
      // Arrange
      const mockService = new MockCrudService();
      mockService.showDeleteConfirm.set(true);
      mockService.deleteMessage.set('Are you sure?');

      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(GenericCrudListComponent, {
        bindings: [
          inputBinding('service', () => mockService as any),
          inputBinding('dataTestId', () => 'test-crud'),
        ],
      });
      TestBed.tick();

      // Assert
      const cancelBtn = fixture.nativeElement.querySelector(
        'button[data-testid="test-crud-btn-cancel-delete"]',
      );
      const confirmBtn = fixture.nativeElement.querySelector(
        'button[data-testid="test-crud-btn-confirm-delete"]',
      );

      expect(cancelBtn).toBeTruthy();
      expect(confirmBtn).toBeTruthy();
    });

    it('should render data-testid on selected items section when hasSelection is true', () => {
      // Arrange
      const mockService = new MockCrudService();
      mockService.selectedItems.set(new Set(['1']));
      mockService.hasSelection = () => true;
      mockService.selectedItemsData = () => [{ id: '1', name: 'Item 1' }] as any;

      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(GenericCrudListComponent, {
        bindings: [
          inputBinding('service', () => mockService as any),
          inputBinding('dataTestId', () => 'test-crud'),
        ],
      });
      TestBed.tick();

      // Assert
      const selectedSection = fixture.nativeElement.querySelector(
        '[data-testid="test-crud-selected-items"]',
      );
      expect(selectedSection).toBeTruthy();
    });

    it('should render data-testid on bulk delete button when items are selected', () => {
      // Arrange
      const mockService = new MockCrudService();
      mockService.selectedItems.set(new Set(['1']));
      mockService.hasSelection = () => true;
      mockService.selectedItemsData = () => [{ id: '1', name: 'Item 1' }] as any;

      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(GenericCrudListComponent, {
        bindings: [
          inputBinding('service', () => mockService as any),
          inputBinding('dataTestId', () => 'test-crud'),
        ],
      });
      TestBed.tick();

      // Assert
      const bulkDeleteBtn = fixture.nativeElement.querySelector(
        'button[data-testid="test-crud-btn-bulk-delete"]',
      );
      expect(bulkDeleteBtn).toBeTruthy();
    });
  });
});
