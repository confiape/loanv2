import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection, signal, Signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Observable, of } from 'rxjs';
import { GenericCrudListComponent } from './generic-crud-list';
import { ICrudService } from '@loan/app/core/services/crud.interface';
import { TableColumnMetadata, FormFieldMetadata } from '@loan/app/core/models/form-metadata';

interface TestDto {
  id: string;
  name: string;
  email: string;
}

class MockCrudService implements ICrudService<TestDto> {
  items = signal<TestDto[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
  ]);
  loading = signal(false);
  showModal = signal(false);
  editingItem = signal<TestDto | null>(null);
  showDeleteConfirm = signal(false);
  selectedItems = signal<Set<string>>(new Set());
  searchTerm = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  filteredItems = signal<TestDto[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
  ]);
  deleteMessage = signal('Are you sure you want to delete this item?');

  loadAllItems(): Observable<TestDto[]> {
    return of(this.items());
  }

  saveItem(_dto: TestDto): Observable<TestDto> {
    return of({ id: '1', name: 'Test', email: 'test@example.com' });
  }

  deleteItem(_id: string): Observable<unknown> {
    return of({});
  }

  getTableColumns(): TableColumnMetadata<TestDto>[] {
    return [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
    ];
  }

  getFormFields(): FormFieldMetadata[] {
    return [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'email', label: 'Email', type: 'email' },
    ];
  }

  getRouteBasePath(): string {
    return '/test-items';
  }

  getItemTypeName(): string {
    return 'item';
  }

  getItemTypePluralName(): string {
    return 'items';
  }

  getItemDisplayName(item: TestDto): string {
    return item.name;
  }

  loadItems(): void {
    // Mock implementation
  }

  onNewItem(): void {
    this.showModal.set(true);
    this.editingItem.set(null);
  }

  onEditItem(item: TestDto): void {
    this.showModal.set(true);
    this.editingItem.set(item);
  }

  openEditModal(item: TestDto): void {
    this.showModal.set(true);
    this.editingItem.set(item);
  }

  onDeleteItem(item: TestDto): void {
    this.showDeleteConfirm.set(true);
    this.editingItem.set(item);
  }

  onBulkDelete(): void {
    this.showDeleteConfirm.set(true);
  }

  confirmDelete(): void {
    this.showDeleteConfirm.set(false);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
  }

  onFormSave(): void {
    this.showModal.set(false);
    this.editingItem.set(null);
  }

  onFormCancel(): void {
    this.showModal.set(false);
    this.editingItem.set(null);
  }

  onSearch(_term: string): void {
    // Mock implementation
  }

  onSelectionChange(selected: Set<string>): void {
    this.selectedItems.set(selected);
  }

  onSelectAll(_selectAll: boolean): void {
    // Mock implementation
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  removeFromSelection(id: string): void {
    const current = new Set(this.selectedItems());
    current.delete(id);
    this.selectedItems.set(current);
  }

  clearSelection(): void {
    this.selectedItems.set(new Set());
  }

  hasSelection(): boolean {
    return this.selectedItems().size > 0;
  }

  selectedItemsData(): TestDto[] {
    const selected = this.selectedItems();
    return this.items().filter((item) => selected.has(item.id));
  }

  getTableData(): TestDto[] {
    return this.filteredItems();
  }
}

describe('GenericCrudListComponent - data-testid', () => {
  it('should render basic list elements with correct test IDs', async () => {
    @Component({
      template: `
        <app-generic-crud-list [service]="service" [testIdPrefix]="'users'" />
      `,
      standalone: true,
      imports: [GenericCrudListComponent],
    })
    class TestWrapper {
      service = new MockCrudService();
    }

    await TestBed.configureTestingModule({
      imports: [TestWrapper],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestWrapper);
    fixture.detectChanges();
    await fixture.whenStable();

    const listElement = fixture.nativeElement.querySelector('app-generic-crud-list');

    // Verify new button
    const newButton = listElement.querySelector('app-button[data-testid="users-btn-new-wrapper"]');
    expect(newButton).toBeTruthy();

    // Verify search input
    const searchInput = listElement.querySelector('input[data-testid="users-search-input"]');
    expect(searchInput).toBeTruthy();

    // Verify table
    const table = listElement.querySelector('app-table[data-testid="users-table-wrapper"]');
    expect(table).toBeTruthy();
  });

  it('should render selection controls when items are selected', async () => {
    @Component({
      template: `
        <app-generic-crud-list [service]="service" [testIdPrefix]="'users'" />
      `,
      standalone: true,
      imports: [GenericCrudListComponent],
    })
    class TestWrapper {
      service = new MockCrudService();
    }

    await TestBed.configureTestingModule({
      imports: [TestWrapper],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestWrapper);
    const component = fixture.componentInstance;

    // Select some items
    component.service.selectedItems.set(new Set(['1', '2']));
    fixture.detectChanges();
    await fixture.whenStable();

    const listElement = fixture.nativeElement.querySelector('app-generic-crud-list');

    // Verify selected items section
    const selectedSection = listElement.querySelector('div[data-testid="users-selected-items"]');
    expect(selectedSection).toBeTruthy();

    // Verify remove selection buttons
    const removeButton1 = listElement.querySelector(
      'button[data-testid="users-btn-remove-selection-1"]'
    );
    expect(removeButton1).toBeTruthy();

    const removeButton2 = listElement.querySelector(
      'button[data-testid="users-btn-remove-selection-2"]'
    );
    expect(removeButton2).toBeTruthy();

    // Verify clear all button
    const clearButton = listElement.querySelector(
      'button[data-testid="users-btn-clear-selection"]'
    );
    expect(clearButton).toBeTruthy();

    // Verify bulk delete button
    const bulkDeleteButton = listElement.querySelector(
      'app-button[data-testid="users-btn-bulk-delete-wrapper"]'
    );
    expect(bulkDeleteButton).toBeTruthy();
  });

  it('should render pagination controls with correct test IDs', async () => {
    @Component({
      template: `
        <app-generic-crud-list [service]="service" [testIdPrefix]="'users'" />
      `,
      standalone: true,
      imports: [GenericCrudListComponent],
    })
    class TestWrapper {
      service = new MockCrudService();
    }

    await TestBed.configureTestingModule({
      imports: [TestWrapper],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestWrapper);
    const component = fixture.componentInstance;

    // Enable pagination with smaller page size to trigger pagination controls
    component.service.pageSize.set(2);
    component.service.filteredItems.set([
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
      { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();

    const listElement = fixture.nativeElement.querySelector('app-generic-crud-list');

    // Verify previous page button
    const prevButton = listElement.querySelector('app-button[data-testid="users-btn-prev-page-wrapper"]');
    expect(prevButton).toBeTruthy();

    // Verify next page button
    const nextButton = listElement.querySelector('app-button[data-testid="users-btn-next-page-wrapper"]');
    expect(nextButton).toBeTruthy();
  });

  it('should render form modal with correct test ID when shown', async () => {
    @Component({
      template: `
        <app-generic-crud-list [service]="service" [testIdPrefix]="'users'" />
      `,
      standalone: true,
      imports: [GenericCrudListComponent],
    })
    class TestWrapper {
      service = new MockCrudService();
    }

    await TestBed.configureTestingModule({
      imports: [TestWrapper],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestWrapper);
    const component = fixture.componentInstance;

    // Open modal
    component.service.showModal.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const listElement = fixture.nativeElement.querySelector('app-generic-crud-list');

    // Verify modal
    const modal = listElement.querySelector('app-modal[data-testid="users-modal-wrapper"]');
    expect(modal).toBeTruthy();

    // Verify form inside modal
    const form = listElement.querySelector('app-generic-crud-form');
    expect(form).toBeTruthy();
    // Verify that form buttons have the correct testId prefix
    const submitButton = modal.querySelector('app-button[data-testid="users-btn-submit-wrapper"]');
    expect(submitButton).toBeTruthy();
  });

  it('should render delete confirmation modal with correct test ID when shown', async () => {
    @Component({
      template: `
        <app-generic-crud-list [service]="service" [testIdPrefix]="'users'" />
      `,
      standalone: true,
      imports: [GenericCrudListComponent],
    })
    class TestWrapper {
      service = new MockCrudService();
    }

    await TestBed.configureTestingModule({
      imports: [TestWrapper],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestWrapper);
    const component = fixture.componentInstance;

    // Open delete modal
    component.service.showDeleteConfirm.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const listElement = fixture.nativeElement.querySelector('app-generic-crud-list');

    // Verify delete modal
    const deleteModal = listElement.querySelector('app-modal[data-testid="users-delete-modal-wrapper"]');
    expect(deleteModal).toBeTruthy();

    // Verify cancel button
    const cancelButton = listElement.querySelector(
      'app-button[data-testid="users-btn-cancel-delete-wrapper"]'
    );
    expect(cancelButton).toBeTruthy();

    // Verify confirm button
    const confirmButton = listElement.querySelector(
      'app-button[data-testid="users-btn-confirm-delete-wrapper"]'
    );
    expect(confirmButton).toBeTruthy();
  });

  it('should handle new button click', async () => {
    @Component({
      template: `
        <app-generic-crud-list [service]="service" [testIdPrefix]="'users'" />
      `,
      standalone: true,
      imports: [GenericCrudListComponent],
    })
    class TestWrapper {
      service = new MockCrudService();
    }

    await TestBed.configureTestingModule({
      imports: [TestWrapper],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestWrapper);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    const listElement = fixture.nativeElement.querySelector('app-generic-crud-list');

    // Click new button
    const newButtonHost = listElement.querySelector('app-button[data-testid="users-btn-new-wrapper"]');
    const newButton = newButtonHost.querySelector('button');
    newButton.click();
    fixture.detectChanges();

    // Verify modal opens
    expect(component.service.showModal()).toBe(true);
    expect(component.service.editingItem()).toBeNull();
  });

  it('should handle search input', async () => {
    @Component({
      template: `
        <app-generic-crud-list [service]="service" [testIdPrefix]="'users'" />
      `,
      standalone: true,
      imports: [GenericCrudListComponent],
    })
    class TestWrapper {
      service = new MockCrudService();
    }

    await TestBed.configureTestingModule({
      imports: [TestWrapper],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestWrapper);
    const component = fixture.componentInstance;

    let searchTerm = '';
    component.service.onSearch = (term: string) => {
      searchTerm = term;
    };

    fixture.detectChanges();
    await fixture.whenStable();

    const listElement = fixture.nativeElement.querySelector('app-generic-crud-list');

    // Type in search input
    const searchInput = listElement.querySelector('input[data-testid="users-search-input"]');
    searchInput.value = 'John';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Verify search was called
    expect(searchTerm).toBe('John');
  });

  it('should handle clear selection button click', async () => {
    @Component({
      template: `
        <app-generic-crud-list [service]="service" [testIdPrefix]="'users'" />
      `,
      standalone: true,
      imports: [GenericCrudListComponent],
    })
    class TestWrapper {
      service = new MockCrudService();
    }

    await TestBed.configureTestingModule({
      imports: [TestWrapper],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestWrapper);
    const component = fixture.componentInstance;

    // Select some items
    component.service.selectedItems.set(new Set(['1', '2']));
    fixture.detectChanges();
    await fixture.whenStable();

    const listElement = fixture.nativeElement.querySelector('app-generic-crud-list');

    // Click clear button
    const clearButton = listElement.querySelector(
      'button[data-testid="users-btn-clear-selection"]'
    );
    clearButton.click();
    fixture.detectChanges();

    // Verify selection is cleared
    expect(component.service.selectedItems().size).toBe(0);
  });

  it('should handle remove individual selection button click', async () => {
    @Component({
      template: `
        <app-generic-crud-list [service]="service" [testIdPrefix]="'users'" />
      `,
      standalone: true,
      imports: [GenericCrudListComponent],
    })
    class TestWrapper {
      service = new MockCrudService();
    }

    await TestBed.configureTestingModule({
      imports: [TestWrapper],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestWrapper);
    const component = fixture.componentInstance;

    // Select some items
    component.service.selectedItems.set(new Set(['1', '2']));
    fixture.detectChanges();
    await fixture.whenStable();

    const listElement = fixture.nativeElement.querySelector('app-generic-crud-list');

    // Click remove button for item 1
    const removeButton = listElement.querySelector(
      'button[data-testid="users-btn-remove-selection-1"]'
    );
    removeButton.click();
    fixture.detectChanges();

    // Verify item 1 is removed but item 2 remains
    expect(component.service.selectedItems().has('1')).toBe(false);
    expect(component.service.selectedItems().has('2')).toBe(true);
  });
});
