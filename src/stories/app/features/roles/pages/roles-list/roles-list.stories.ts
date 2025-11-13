import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { RolesListComponent } from '@loan/app/features/roles/pages/roles-list/roles-list';
import { RoleCrudService } from '@loan/app/features/roles/services/role-crud.service';
import { signal, Signal } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Validators } from '@angular/forms';
import { RoleDto, SaveRoleDto } from '@loan/app/shared/openapi';
import { ICrudService } from '@loan/app/core/services';
import { TableColumnMetadata, FormFieldMetadata } from '@loan/app/core/models';

const meta: Meta<RolesListComponent> = {
  title: 'Features/Roles/RolesList',
  component: RolesListComponent,
  tags: ['autodocs'],
  decorators: [],
};

export default meta;
type Story = StoryObj<RolesListComponent>;

// Mock data
const mockRoles: RoleDto[] = [
  {
    id: '1',
    name: 'Administrator',
    roles: [],
    permissions: [
      { name: 'users.read' },
      { name: 'users.write' },
      { name: 'roles.read' },
      { name: 'roles.write' },
    ],
  },
  {
    id: '2',
    name: 'Manager',
    roles: [],
    permissions: [
      { name: 'users.read' },
      { name: 'reports.read' },
    ],
  },
  {
    id: '3',
    name: 'User',
    roles: [],
    permissions: [
      { name: 'profile.read' },
      { name: 'profile.write' },
    ],
  },
  {
    id: '4',
    name: 'Analyst',
    roles: [
      {
        id: '3',
        name: 'User',
        roles: [],
        permissions: [],
      },
    ],
    permissions: [
      { name: 'reports.read' },
      { name: 'analytics.read' },
    ],
  },
  {
    id: '5',
    name: 'Support',
    roles: [],
    permissions: [
      { name: 'tickets.read' },
      { name: 'tickets.write' },
    ],
  },
];

// Mock service - implements ICrudService directly
class MockRoleCrudService implements ICrudService<RoleDto, SaveRoleDto> {
  private _items = signal<RoleDto[]>([]);
  private _loading = signal<boolean>(false);
  private _showModal = signal<boolean>(false);
  private _editingItem = signal<RoleDto | null>(null);
  private _showDeleteConfirm = signal<boolean>(false);
  private _selectedItems = signal<Set<string>>(new Set());
  private _searchTerm = signal<string>('');
  private _currentPage = signal<number>(1);
  private _pageSize = signal<number>(10);
  private _filteredItems = signal<RoleDto[]>([]);

  items: Signal<RoleDto[]> = this._items.asReadonly();
  loading: Signal<boolean> = this._loading.asReadonly();
  showModal: Signal<boolean> = this._showModal.asReadonly();
  editingItem: Signal<RoleDto | null> = this._editingItem.asReadonly();
  showDeleteConfirm: Signal<boolean> = this._showDeleteConfirm.asReadonly();
  selectedItems: Signal<Set<string>> = this._selectedItems.asReadonly();
  searchTerm: Signal<string> = this._searchTerm.asReadonly();
  currentPage: Signal<number> = this._currentPage.asReadonly();
  pageSize: Signal<number> = this._pageSize.asReadonly();
  filteredItems: Signal<RoleDto[]> = this._filteredItems.asReadonly();

  constructor(initialRoles: RoleDto[] = mockRoles, isLoading = false) {
    this._items.set(initialRoles);
    this._filteredItems.set(initialRoles);
    this._loading.set(isLoading);
  }

  loadAllItems(): Observable<RoleDto[]> {
    return of(this._items());
  }

  saveItem(dto: SaveRoleDto): Observable<RoleDto> {
    const roleDto: RoleDto = {
      id: dto.id || crypto.randomUUID(),
      name: dto.name,
      roles: [],
      permissions: dto.permissionsId?.map((name) => ({ name })) || [],
    };
    return of(roleDto);
  }

  deleteItem(id: string): Observable<unknown> {
    return of({ success: true });
  }

  getTableColumns(): TableColumnMetadata<RoleDto>[] {
    return [
      { key: 'name', label: 'Name', sortable: true, align: 'left' },
      { key: 'id', label: 'ID', sortable: true, align: 'left' },
    ];
  }

  getFormFields(): FormFieldMetadata[] {
    return [
      {
        key: 'name',
        label: 'Role Name',
        type: 'text',
        placeholder: 'Enter role name',
        validators: [Validators.required, Validators.minLength(2), Validators.maxLength(40)],
        helpText: 'Role name must be between 2-40 characters with no special characters',
      },
      {
        key: 'rolesId',
        label: 'Inherited Roles',
        type: 'multiselect',
        placeholder: 'Select inherited roles',
        helpText: 'Select other roles to inherit permissions from',
        loadOptions: () => of([]),
      },
      {
        key: 'permissionsId',
        label: 'Permissions',
        type: 'multiselect',
        placeholder: 'Select permissions',
        helpText: 'Select permissions for this role',
        loadOptions: () => of([]),
      },
    ];
  }

  getRouteBasePath(): string {
    return '/roles';
  }

  getItemTypeName(): string {
    return 'role';
  }

  getItemTypePluralName(): string {
    return 'roles';
  }

  getItemDisplayName(item: RoleDto): string {
    return item.name;
  }

  loadItems(): void {
    this._loading.set(true);
    setTimeout(() => {
      this._loading.set(false);
    }, 500);
  }

  onNewItem(): void {
    this._editingItem.set(null);
    this._showModal.set(true);
  }

  onEditItem(item: RoleDto): void {
    this._editingItem.set(item);
    this._showModal.set(true);
  }

  openEditModal(item: RoleDto): void {
    this._editingItem.set(item);
    this._showModal.set(true);
  }

  onDeleteItem(item: RoleDto): void {
    this._editingItem.set(item);
    this._showDeleteConfirm.set(true);
  }

  onBulkDelete(): void {
    this._showDeleteConfirm.set(true);
  }

  confirmDelete(): void {
    this._showDeleteConfirm.set(false);
    this._editingItem.set(null);
  }

  cancelDelete(): void {
    this._showDeleteConfirm.set(false);
    this._editingItem.set(null);
  }

  onFormSave(): void {
    this._showModal.set(false);
    this._editingItem.set(null);
  }

  onFormCancel(): void {
    this._showModal.set(false);
    this._editingItem.set(null);
  }

  onSearch(term: string): void {
    this._searchTerm.set(term);
    const filtered = this._items().filter((role) =>
      role.name.toLowerCase().includes(term.toLowerCase()) ||
      role.id.toLowerCase().includes(term.toLowerCase())
    );
    this._filteredItems.set(filtered);
  }

  onSelectionChange(selected: Set<string>): void {
    this._selectedItems.set(selected);
  }

  onSelectAll(selectAll: boolean): void {
    if (selectAll) {
      this._selectedItems.set(new Set(this._items().map((r) => r.id)));
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

  selectedItemsData(): RoleDto[] {
    const selected = this._selectedItems();
    return this._items().filter((role) => selected.has(role.id));
  }

  getTableData(): RoleDto[] {
    return this._filteredItems();
  }

  deleteMessage(): string {
    const count = this._selectedItems().size;
    if (count > 0) {
      return `Are you sure you want to delete ${count} selected role(s)?`;
    }
    const item = this._editingItem();
    return item ? `Are you sure you want to delete ${item.name}?` : '';
  }
}

/**
 * Default state showing the roles list with sample data
 */
export const Default: Story = {
  decorators: [
    moduleMetadata({
      imports: [RolesListComponent],
      providers: [
        { provide: RoleCrudService, useValue: new MockRoleCrudService() },
      ],
    }),
  ],
  render: () => ({
    template: `
      <div class="min-h-screen p-8 bg-[var(--color-bg-primary)]">
        <app-roles-list />
      </div>
    `,
  }),
};

/**
 * Loading state while fetching roles from the API
 */
export const Loading: Story = {
  decorators: [
    moduleMetadata({
      imports: [RolesListComponent],
      providers: [
        { provide: RoleCrudService, useValue: new MockRoleCrudService(mockRoles, true) },
      ],
    }),
  ],
  render: () => ({
    template: `
      <div class="min-h-screen p-8 bg-[var(--color-bg-primary)]">
        <app-roles-list />
      </div>
    `,
  }),
};

/**
 * Empty state when no roles exist in the system
 */
export const Empty: Story = {
  decorators: [
    moduleMetadata({
      imports: [RolesListComponent],
      providers: [
        { provide: RoleCrudService, useValue: new MockRoleCrudService([], false) },
      ],
    }),
  ],
  render: () => ({
    template: `
      <div class="min-h-screen p-8 bg-[var(--color-bg-primary)]">
        <app-roles-list />
      </div>
    `,
  }),
};

/**
 * State with search results filtered
 */
export const WithSearch: Story = {
  decorators: [
    moduleMetadata({
      imports: [RolesListComponent],
      providers: [
        {
          provide: RoleCrudService,
          useFactory: () => {
            const service = new MockRoleCrudService();
            service.onSearch('admin');
            return service;
          },
        },
      ],
    }),
  ],
  render: () => ({
    template: `
      <div class="min-h-screen p-8 bg-[var(--color-bg-primary)]">
        <app-roles-list />
      </div>
    `,
  }),
};

/**
 * State with selected items for bulk operations
 */
export const WithSelection: Story = {
  decorators: [
    moduleMetadata({
      imports: [RolesListComponent],
      providers: [
        {
          provide: RoleCrudService,
          useFactory: () => {
            const service = new MockRoleCrudService();
            service.onSelectionChange(new Set(['1', '3']));
            return service;
          },
        },
      ],
    }),
  ],
  render: () => ({
    template: `
      <div class="min-h-screen p-8 bg-[var(--color-bg-primary)]">
        <app-roles-list />
      </div>
    `,
  }),
};

/**
 * State showing roles with inherited permissions
 */
export const WithInheritedRoles: Story = {
  decorators: [
    moduleMetadata({
      imports: [RolesListComponent],
      providers: [
        {
          provide: RoleCrudService,
          useFactory: () => {
            const rolesWithInheritance: RoleDto[] = [
              {
                id: '1',
                name: 'Super Admin',
                roles: [],
                permissions: [
                  { name: 'system.admin' },
                  { name: 'users.manage' },
                ],
              },
              {
                id: '2',
                name: 'Department Manager',
                roles: [
                  { id: '3', name: 'User', roles: [], permissions: [] },
                  { id: '4', name: 'Viewer', roles: [], permissions: [] },
                ],
                permissions: [
                  { name: 'team.manage' },
                  { name: 'reports.create' },
                ],
              },
            ];
            return new MockRoleCrudService(rolesWithInheritance, false);
          },
        },
      ],
    }),
  ],
  render: () => ({
    template: `
      <div class="min-h-screen p-8 bg-[var(--color-bg-primary)]">
        <app-roles-list />
      </div>
    `,
  }),
};
