import { Component, OnInit, inject, input, effect, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Table } from '@loan/app/shared/ui/table/table';
import { TableColumn, TableAction } from '@loan/app/shared/ui/table/table.models';
import { Modal } from '@loan/app/shared/components/modal/modal';
import { ModalHeader } from '@loan/app/shared/components/modal/modal-header';
import { ModalBody } from '@loan/app/shared/components/modal/modal-body';
import { Button } from '@loan/app/shared/components/button/button';
import { GenericCrudFormComponent } from '../generic-crud-form/generic-crud-form';
import { GenericCrudViewComponent } from '../generic-crud-view/generic-crud-view';
import { ICrudService } from '@loan/app/core/services/crud.interface';
import { TableColumnMetadata } from '@loan/app/core/models/form-metadata';

/**
 * Generic CRUD list component
 * Displays a table with data and handles CRUD operations
 *
 * @example
 * ```typescript
 * @Component({
 *   selector: 'app-companies-list',
 *   standalone: true,
 *   imports: [GenericCrudListComponent],
 *   providers: [CompaniesListService],
 *   template: `<app-generic-crud-list [service]="service" />`
 * })
 * export class CompaniesListComponent {
 *   service = inject(CompaniesListService);
 * }
 * ```
 */
@Component({
  selector: 'app-generic-crud-list',
  standalone: true,
  imports: [
    CommonModule,
    Table,
    Modal,
    ModalHeader,
    ModalBody,
    Button,
    GenericCrudFormComponent,
    GenericCrudViewComponent,
  ],
  templateUrl: './generic-crud-list.html',
})
export class GenericCrudListComponent<TDto extends { id: string }> implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Expose Math for template
  protected readonly Math = Math;

  // Input: CRUD service (required)
  service = input.required<ICrudService<TDto, unknown>>();

  // Input: Test ID for E2E testing (optional)
  readonly dataTestId = input<string | null>(null);

  // Table configuration
  tableColumns = signal<TableColumn<TDto>[]>([]);
  tableActions = signal<TableAction<TDto>[]>([]);

  // Form state
  formLoading = signal(false);
  formError = signal<string | null>(null);

  // Modal mode: 'view' | 'edit' | 'new'
  modalMode = signal<'view' | 'edit' | 'new'>('new');

  // Track current route param ID and action
  private currentRouteId = signal<string | null>(null);
  private currentRouteAction = signal<'view' | 'edit' | 'new' | null>(null);

  // Computed modal title
  readonly modalTitle = computed(() => {
    const itemTypeName = this.service().getItemTypeName();
    const mode = this.modalMode();
    const capitalizedName = itemTypeName.charAt(0).toUpperCase() + itemTypeName.slice(1);

    switch (mode) {
      case 'view':
        return `View ${capitalizedName}`;
      case 'edit':
        return `Edit ${capitalizedName}`;
      case 'new':
        return `New ${capitalizedName}`;
    }
  });

  constructor() {
    // Watch for changes in items and route parameters to open modal
    effect(() => {
      const items = this.service().items();
      const routeId = this.currentRouteId();
      const action = this.currentRouteAction();
      const srv = this.service();

      if (action === 'new') {
        // New item mode
        this.modalMode.set('new');
        srv.openNewModal();
      } else if (routeId && items.length > 0) {
        // View or Edit mode
        const item = items.find((i) => i.id === routeId);
        if (item) {
          if (action === 'edit') {
            this.modalMode.set('edit');
            srv.openViewModal(item);
          } else {
            // Default to view mode when only ID is present
            this.modalMode.set('view');
            srv.openViewModal(item);
          }
        } else {
          // Item not found, navigate back to list
          this.router.navigate([srv.getRouteBasePath()]);
        }
      } else if (!routeId && !action) {
        // No ID or action in route, close modal if open
        if (srv.showModal()) {
          srv.onFormCancel();
        }
      }
    });
  }

  ngOnInit(): void {
    this.setupTableConfig();
    this.service().loadItems();

    // Update route state on navigation
    const updateRouteState = () => {
      const id = this.route.snapshot.params['id'];
      const url = this.router.url;

      if (url.endsWith('/new')) {
        // New mode: /companies/new
        this.currentRouteId.set(null);
        this.currentRouteAction.set('new');
      } else if (id && url.endsWith('/edit')) {
        // Edit mode: /companies/:id/edit
        this.currentRouteId.set(id);
        this.currentRouteAction.set('edit');
      } else if (id) {
        // View mode: /companies/:id
        this.currentRouteId.set(id);
        this.currentRouteAction.set(null);
      } else {
        // Base route: /companies
        this.currentRouteId.set(null);
        this.currentRouteAction.set(null);
      }
    };

    // Initial state
    updateRouteState();

    // Listen to navigation events
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        updateRouteState();
      });
  }

  /**
   * Setup table configuration from service metadata
   */
  private setupTableConfig(): void {
    const columnMetadata = this.service().getTableColumns();

    // Convert TableColumnMetadata to TableColumn
    const columns = columnMetadata.map((col) => this.convertColumnMetadata(col));
    this.tableColumns.set(columns);

    // No actions needed - using rowClick instead
    this.tableActions.set([]);
  }

  /**
   * Convert TableColumnMetadata to TableColumn
   */
  private convertColumnMetadata(metadata: TableColumnMetadata<TDto>): TableColumn<TDto> {
    const column: TableColumn<TDto> = {
      key: String(metadata.key),
      label: metadata.label,
      sortable: metadata.sortable,
      align: metadata.align,
      width: metadata.width,
    };

    // If valueGetter is provided, use it with formatter
    if (metadata.valueGetter) {
      column.render = (_, row) => {
        const value = metadata.valueGetter!(row);
        return metadata.formatter ? metadata.formatter(value) : String(value);
      };
    } else if (metadata.formatter) {
      column.render = (value) => metadata.formatter!(value);
    }

    return column;
  }

  /**
   * Handle search input
   */
  onSearch(term: string): void {
    this.service().onSearch(term);
  }

  /**
   * Handle selection change
   */
  onSelectionChange(selected: TDto[]): void {
    const selectedIds = new Set(selected.map((item) => item.id));
    this.service().onSelectionChange(selectedIds);
  }

  /**
   * Handle select all
   */
  onSelectAll(selectAll: boolean): void {
    this.service().onSelectAll(selectAll);
  }

  /**
   * Handle form save
   */
  onFormSave(dto: unknown): void {
    this.formLoading.set(true);
    this.formError.set(null);

    this.service()
      .saveItem(dto)
      .subscribe({
        next: () => {
          this.formLoading.set(false);
          this.service().onFormSave();
        },
        error: (error: unknown) => {
          console.error('Error saving item:', error);
          const errorObj = error as { error?: { message?: string } };
          this.formError.set(errorObj.error?.message || 'Failed to save. Please try again.');
          this.formLoading.set(false);
        },
      });
  }

  /**
   * Handle form cancel
   */
  onFormCancel(): void {
    this.formError.set(null);
    this.service().onFormCancel();
  }

  /**
   * Close modals
   */
  closeFormModal(): void {
    this.onFormCancel();
  }

  closeDeleteModal(): void {
    this.service().cancelDelete();
  }

  /**
   * Handle new item button click - navigate to new route
   */
  onNewItem(): void {
    const basePath = this.service().getRouteBasePath();
    this.router.navigate([basePath, 'new']);
  }

  /**
   * Handle row click - navigate to view mode
   */
  onRowClick(item: TDto): void {
    const basePath = this.service().getRouteBasePath();
    this.router.navigate([basePath, item.id]);
  }

  /**
   * Handle Edit button click from view modal
   */
  onViewEditClick(): void {
    const item = this.service().editingItem();
    if (item) {
      const basePath = this.service().getRouteBasePath();
      this.router.navigate([basePath, item.id, 'edit']);
    }
  }

  /**
   * Handle Delete button click from view modal
   */
  onViewDeleteClick(): void {
    const item = this.service().editingItem();
    if (item) {
      this.service().onDeleteItem(item);
    }
  }
}
