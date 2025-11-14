import { signal, computed, Signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ICrudService } from './crud.interface';
import { TableColumnMetadata, FormFieldMetadata } from '@loan/app/core/models/form-metadata';

/**
 * Base CRUD service implementation
 * Provides common functionality for all CRUD services
 * Extend this class and implement the abstract methods
 */
export abstract class BaseCrudService<TDto extends { id: string }, TSaveDto = TDto>
  implements ICrudService<TDto, TSaveDto>
{
  // ========== DEPENDENCIES ==========

  protected router = inject(Router);

  // ========== STATE (Signals) ==========

  protected _items = signal<TDto[]>([]);
  protected _loading = signal(false);
  protected _showModal = signal(false);
  protected _editingItem = signal<TDto | null>(null);
  protected _showDeleteConfirm = signal(false);
  protected _deleteTarget = signal<TDto | null>(null);
  protected _selectedItems = signal<Set<string>>(new Set());
  protected _searchTerm = signal('');
  protected _currentPage = signal(1);
  protected _pageSize = signal(10);

  // Public read-only signals
  readonly items = this._items.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly showModal = this._showModal.asReadonly();
  readonly editingItem = this._editingItem.asReadonly();
  readonly showDeleteConfirm = this._showDeleteConfirm.asReadonly();
  readonly selectedItems = this._selectedItems.asReadonly();
  readonly searchTerm = this._searchTerm.asReadonly();
  readonly currentPage = this._currentPage.asReadonly();
  readonly pageSize = this._pageSize.asReadonly();

  // Computed signals
  readonly filteredItems = computed(() => {
    const term = this._searchTerm().toLowerCase().trim();
    if (!term) return this._items();

    return this._items().filter((item) => this.matchesSearch(item, term));
  });

  readonly selectedItemsData = computed(() => {
    const selected = this._selectedItems();
    return this._items().filter((item) => selected.has(item.id));
  });

  readonly deleteMessage = computed(() => {
    const target = this._deleteTarget();
    const selectedCount = this._selectedItems().size;

    if (selectedCount > 1) {
      return `Are you sure you want to delete <strong>${selectedCount} items</strong>? This action cannot be undone.`;
    }

    if (target) {
      return `Are you sure you want to delete <strong>${this.getItemDisplayName(target)}</strong>? This action cannot be undone.`;
    }

    return 'Are you sure you want to delete this item? This action cannot be undone.';
  });

  // ========== ABSTRACT METHODS (must be implemented) ==========

  /** Fetch all items from backend */
  protected abstract fetchAllItems(): Observable<TDto[]>;

  /** Perform save operation (create or update) */
  protected abstract performSave(dto: TSaveDto): Observable<TDto>;

  /** Perform delete operation */
  protected abstract performDelete(id: string): Observable<unknown>;

  /** Check if item matches search term */
  protected abstract matchesSearch(item: TDto, term: string): boolean;

  /** Get table columns configuration */
  abstract getTableColumns(): TableColumnMetadata<TDto>[];

  /** Get form fields configuration */
  abstract getFormFields(): FormFieldMetadata[];

  /** Get display name for an item */
  abstract getItemDisplayName(item: TDto): string;

  // ========== ABSTRACT PROPERTIES (must be implemented) ==========

  /** Singular item type name (e.g., 'company') */
  abstract readonly itemTypeName: string;

  /** Plural item type name (e.g., 'companies') */
  abstract readonly itemTypePluralName: string;

  // ========== COMPUTED PROPERTIES (can be overridden) ==========

  /**
   * Base route path - defaults to '/' + itemTypePluralName
   * Override if you need a custom path (e.g., '/admin/companies')
   */
  get routeBasePath(): string {
    return '/' + this.itemTypePluralName;
  }

  // ========== LIFECYCLE HOOKS (optional overrides) ==========

  /** Called after successful save */
  protected onAfterFormSave(): void {
    // Override if needed
  }

  /** Called after form cancel */
  protected onAfterFormCancel(): void {
    // Override if needed
  }

  /** Called after delete */
  protected onAfterDelete(): void {
    // Override if needed
  }

  // ========== DATA OPERATIONS ==========

  loadAllItems(): Observable<TDto[]> {
    this._loading.set(true);
    return this.fetchAllItems().pipe(
      tap((data) => {
        this._items.set(data);
        this._loading.set(false);
      }),
    );
  }

  saveItem(dto: TSaveDto): Observable<TDto> {
    return this.performSave(dto).pipe(
      tap((savedItem) => {
        this.updateItemsAfterSave(savedItem);
      }),
    );
  }

  deleteItem(id: string): Observable<unknown> {
    return this.performDelete(id).pipe(
      tap(() => {
        this.removeItemFromList(id);
        this.onAfterDelete();
      }),
    );
  }

  // ========== UI ACTIONS ==========

  loadItems(): void {
    this.loadAllItems().subscribe();
  }

  onNewItem(): void {
    this._editingItem.set(null);
    this._showModal.set(true);
  }

  onEditItem(item: TDto): void {
    // Navigate to edit route (modal will open via route effect in GenericCrudListComponent)
    const editPath = [this.routeBasePath, item.id];

    this.router.navigate(editPath).then((success) => {
      if (!success) {
        // Navigation failed - route probably not configured
        this.throwRouteConfigurationError(this.routeBasePath, item.id);
      }
    });
  }

  openEditModal(item: TDto): void {
    this._editingItem.set(item);
    this._showModal.set(true);
  }

  onDeleteItem(item: TDto): void {
    this._deleteTarget.set(item);
    this._showDeleteConfirm.set(true);
  }

  onBulkDelete(): void {
    if (this._selectedItems().size === 0) return;
    this._deleteTarget.set(null);
    this._showDeleteConfirm.set(true);
  }

  confirmDelete(): void {
    const target = this._deleteTarget();
    const selected = this._selectedItems();

    if (selected.size > 1) {
      // Bulk delete
      this.performBulkDelete(Array.from(selected));
    } else if (target) {
      // Single delete
      this.deleteItem(target.id).subscribe({
        next: () => {
          this._showDeleteConfirm.set(false);
          this._deleteTarget.set(null);
        },
        error: (err) => {
          console.error('Delete failed:', err);
          this._showDeleteConfirm.set(false);
        },
      });
    }
  }

  cancelDelete(): void {
    this._showDeleteConfirm.set(false);
    this._deleteTarget.set(null);
  }

  onFormSave(): void {
    this._showModal.set(false);
    this._editingItem.set(null);
    this.router.navigate([this.routeBasePath]);
    this.onAfterFormSave();
  }

  onFormCancel(): void {
    this._showModal.set(false);
    this._editingItem.set(null);
    this.router.navigate([this.routeBasePath]);
    this.onAfterFormCancel();
  }

  onSearch(term: string): void {
    this._searchTerm.set(term);
    this._currentPage.set(1); // Reset to first page
  }

  onSelectionChange(selected: Set<string>): void {
    this._selectedItems.set(selected);
  }

  onSelectAll(selectAll: boolean): void {
    if (selectAll) {
      const allIds = new Set(this.getTableData().map((item) => item.id));
      this._selectedItems.set(allIds);
    } else {
      this._selectedItems.set(new Set());
    }
  }

  onPageChange(page: number): void {
    this._currentPage.set(page);
  }

  removeFromSelection(id: string): void {
    const selected = new Set(this._selectedItems());
    selected.delete(id);
    this._selectedItems.set(selected);
  }

  clearSelection(): void {
    this._selectedItems.set(new Set());
  }

  hasSelection(): boolean {
    return this._selectedItems().size > 0;
  }

  getTableData(): TDto[] {
    const filtered = this.filteredItems();
    const pageSize = this._pageSize();

    if (pageSize === 0) {
      return filtered; // No pagination
    }

    const page = this._currentPage();
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return filtered.slice(start, end);
  }

  // ========== HELPER METHODS ==========

  /**
   * Throw detailed error when route configuration is missing
   */
  private throwRouteConfigurationError(basePath: string, itemId: string): never {
    const routesFileName = `${basePath.split('/').pop()}.routes.ts`;

    throw new Error(`
╔═══════════════════════════════════════════════════════════════════════════════╗
║ CRUD Route Configuration Error                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝

Navigation to "${basePath}/${itemId}" failed. The route is not configured.

The GenericCrudList component requires route configuration to edit items via URL.

┌─────────────────────────────────────────────────────────────────────────────┐
│ REQUIRED SETUP:                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

1. Add the :id route to your routes configuration:

   File: src/app/features${basePath}/${routesFileName}

   export const routes: Routes = [
     {
       path: '',
       component: YourListComponent,  // List view
     },
     {
       path: ':id',                   // ← ADD THIS ROUTE
       component: YourListComponent,  // Same component (modal opens via route)
     },
   ];

2. The GenericCrudListComponent will automatically:
   ✓ Detect route parameter changes
   ✓ Open the edit modal when navigating to ${basePath}/:id
   ✓ Close the modal when navigating back to ${basePath}

┌─────────────────────────────────────────────────────────────────────────────┐
│ WHY THIS IS REQUIRED:                                                       │
└─────────────────────────────────────────────────────────────────────────────┘

✓ Shareable URLs (e.g., ${basePath}/${itemId})
✓ Browser back/forward navigation works correctly
✓ Page refresh maintains modal state
✓ Deep linking from notifications/emails

┌─────────────────────────────────────────────────────────────────────────────┐
│ CURRENT STATE:                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

Item Type:       ${this.itemTypeName}
Base Path:       ${basePath}
Attempted Route: ${basePath}/${itemId}
Route Exists:    ❌ NO

Please configure the route and try again.
`);
  }

  private updateItemsAfterSave(savedItem: TDto): void {
    const items = [...this._items()];
    const index = items.findIndex((item) => item.id === savedItem.id);

    if (index > -1) {
      // Update existing
      items[index] = savedItem;
    } else {
      // Add new
      items.push(savedItem);
    }

    this._items.set(items);
  }

  private removeItemFromList(id: string): void {
    const items = this._items().filter((item) => item.id !== id);
    this._items.set(items);

    // Remove from selection if present
    const selected = new Set(this._selectedItems());
    selected.delete(id);
    this._selectedItems.set(selected);
  }

  private performBulkDelete(ids: string[]): void {
    this._loading.set(true);

    // Delete all selected items
    const deleteObservables = ids.map((id) => this.performDelete(id));

    // Execute all deletes (you might want to use forkJoin for better error handling)
    deleteObservables.forEach((obs) => {
      obs.subscribe({
        next: () => {
          // Item deleted successfully
        },
        error: (err) => {
          console.error('Delete failed:', err);
        },
      });
    });

    // Remove all deleted items from list
    const items = this._items().filter((item) => !ids.includes(item.id));
    this._items.set(items);

    this._selectedItems.set(new Set());
    this._showDeleteConfirm.set(false);
    this._loading.set(false);
    this.onAfterDelete();
  }
}
