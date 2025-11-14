import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { TableColumnMetadata, FormFieldMetadata } from '@loan/app/core/models/form-metadata';

/**
 * Interface that all CRUD services must implement
 * Provides a contract for generic CRUD operations
 */
export interface ICrudService<TDto extends { id: string }, TSaveDto = TDto> {
  // ========== STATE (Signals) ==========

  /** List of all items */
  items: Signal<TDto[]>;

  /** Loading state */
  loading: Signal<boolean>;

  /** Modal visibility for create/edit */
  showModal: Signal<boolean>;

  /** Item currently being edited (null for create) */
  editingItem: Signal<TDto | null>;

  /** Delete confirmation modal visibility */
  showDeleteConfirm: Signal<boolean>;

  /** Selected items (for bulk operations) */
  selectedItems: Signal<Set<string>>;

  /** Current search term */
  searchTerm: Signal<string>;

  /** Current page (if pagination enabled) */
  currentPage: Signal<number>;

  /** Page size (0 = disabled) */
  pageSize: Signal<number>;

  /** Filtered items (after search) */
  filteredItems: Signal<TDto[]>;

  // ========== DATA OPERATIONS (Observables) ==========

  /** Load all items from backend */
  loadAllItems(): Observable<TDto[]>;

  /** Save item (create or update) */
  saveItem(dto: TSaveDto): Observable<TDto>;

  /** Delete item by ID */
  deleteItem(id: string): Observable<unknown>;

  // ========== METADATA ==========

  /** Get table column configuration */
  getTableColumns(): TableColumnMetadata<TDto>[];

  /** Get form field configuration */
  getFormFields(): FormFieldMetadata[];

  /** Base route path (e.g., '/companies') - computed from itemTypePluralName by default */
  readonly routeBasePath: string;

  /** Singular item type name (e.g., 'company') */
  readonly itemTypeName: string;

  /** Plural item type name (e.g., 'companies') */
  readonly itemTypePluralName: string;

  /** Get display name for an item */
  getItemDisplayName(item: TDto): string;

  // ========== UI ACTIONS ==========

  /** Load items (calls loadAllItems and updates state) */
  loadItems(): void;

  /** Handle new item button click */
  onNewItem(): void;

  /** Handle edit item button click */
  onEditItem(item: TDto): void;

  /** Open edit modal directly (without router) */
  openEditModal(item: TDto): void;

  /** Handle delete item button click */
  onDeleteItem(item: TDto): void;

  /** Handle bulk delete button click */
  onBulkDelete(): void;

  /** Confirm delete action */
  confirmDelete(): void;

  /** Cancel delete action */
  cancelDelete(): void;

  /** Handle form save */
  onFormSave(): void;

  /** Handle form cancel */
  onFormCancel(): void;

  /** Handle search input change */
  onSearch(term: string): void;

  /** Handle selection change */
  onSelectionChange(selected: Set<string>): void;

  /** Handle select all */
  onSelectAll(selectAll: boolean): void;

  /** Handle page change */
  onPageChange(page: number): void;

  /** Remove item from selection */
  removeFromSelection(id: string): void;

  /** Clear all selections */
  clearSelection(): void;

  /** Check if there are selections */
  hasSelection(): boolean;

  /** Get selected items data */
  selectedItemsData(): TDto[];

  /** Get table data (paginated and filtered) */
  getTableData(): TDto[];

  /** Get delete confirmation message */
  deleteMessage(): string;
}
