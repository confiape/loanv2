import { Component, OnInit, inject, input, effect, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Table } from '@loan/app/shared/ui/table/table';
import { TableColumn, TableAction } from '@loan/app/shared/ui/table/table.models';
import { Modal } from '@loan/app/shared/components/modal/modal';
import { ModalHeader } from '@loan/app/shared/components/modal/modal-header';
import { ModalBody } from '@loan/app/shared/components/modal/modal-body';
import { Button } from '@loan/app/shared/components/button/button';
import { GenericCrudFormComponent } from '../generic-crud-form/generic-crud-form';
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

  // Input: Test ID prefix for E2E testing (optional)
  testIdPrefix = input<string>('crud');

  // Table configuration
  tableColumns = signal<TableColumn<TDto>[]>([]);
  tableActions = signal<TableAction<TDto>[]>([]);

  // Form state
  formLoading = signal(false);
  formError = signal<string | null>(null);

  // Track current route param ID
  private currentRouteId = signal<string | null>(null);

  // Computed modal title
  readonly modalTitle = computed(() => {
    const itemTypeName = this.service().getItemTypeName();
    const isEdit = this.service().editingItem() !== null;
    const capitalizedName = itemTypeName.charAt(0).toUpperCase() + itemTypeName.slice(1);
    return isEdit ? `Edit ${capitalizedName}` : `New ${capitalizedName}`;
  });

  constructor() {
    // Watch for changes in items and route ID to open modal
    effect(() => {
      const items = this.service().items();
      const routeId = this.currentRouteId();
      const srv = this.service();

      if (routeId && items.length > 0) {
        const item = items.find((i) => i.id === routeId);
        if (item) {
          // Only open modal if not already showing this item
          const currentEditingId = srv.editingItem()?.id;
          const isModalOpen = srv.showModal();

          if (!isModalOpen || currentEditingId !== item.id) {
            // Use openEditModal to bypass router navigation and directly open modal
            srv.openEditModal(item);
          }
        } else {
          // Item not found, navigate back to list
          this.router.navigate([srv.getRouteBasePath()]);
        }
      } else if (!routeId) {
        // No ID in route, close modal if open
        if (srv.showModal() && srv.editingItem()) {
          srv.onFormCancel();
        }
      }
    });
  }

  ngOnInit(): void {
    this.setupTableConfig();
    this.service().loadItems();

    // Subscribe to route params and update signal
    this.route.params.subscribe((params) => {
      this.currentRouteId.set(params['id'] || null);
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

    // Setup table actions
    const actions: TableAction<TDto>[] = [
      {
        label: 'Edit',
        variant: 'primary',
        handler: (item) => this.service().onEditItem(item),
      },
      {
        label: 'Delete',
        variant: 'danger',
        handler: (item) => this.service().onDeleteItem(item),
      },
    ];
    this.tableActions.set(actions);
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
   * Confirm delete
   */
  confirmDelete(): void {
    this.service().confirmDelete();
  }
}
