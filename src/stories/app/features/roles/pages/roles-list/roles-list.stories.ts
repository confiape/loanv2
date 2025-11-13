import { Meta, StoryObj } from '@storybook/angular';
import { RolesListComponent } from '@loan/app/features/roles/pages/roles-list/roles-list';
import { RoleCrudService } from '@loan/app/features/roles/services/role-crud.service';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { signal, Signal } from '@angular/core';
import { of, Observable, throwError, delay } from 'rxjs';
import { Validators } from '@angular/forms';
import { RoleDto, SaveRoleDto } from '@loan/app/shared/openapi';
import { TableColumnMetadata, FormFieldMetadata } from '@loan/app/core/models';

const meta: Meta<RolesListComponent> = {
  title: 'Features/Roles/RolesList',
  component: RolesListComponent,
  tags: ['autodocs'],
  decorators: [
    (Story) => ({
      template: `
        <div class="min-h-screen p-8 bg-[var(--color-bg-primary)]">
          <story />
        </div>
      `,
      providers: [
        provideRouter([]),
        provideHttpClient(),
      ],
    }),
  ],
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

// Mock service for stories
class MockRoleCrudService extends RoleCrudService {
  protected override _items = signal<RoleDto[]>(mockRoles);
  protected override _loading = signal<boolean>(false);
  protected override _showModal = signal<boolean>(false);
  protected override _editingItem = signal<RoleDto | null>(null);
  protected override _showDeleteConfirm = signal<boolean>(false);
  protected override _selectedItems = signal<Set<string>>(new Set());
  protected override _searchTerm = signal<string>('');
  protected override _currentPage = signal<number>(1);
  protected override _pageSize = signal<number>(10);
  private _filteredItems = signal<RoleDto[]>(mockRoles);

  override items: Signal<RoleDto[]> = this._items.asReadonly();
  override loading: Signal<boolean> = this._loading.asReadonly();
  override showModal: Signal<boolean> = this._showModal.asReadonly();
  override editingItem: Signal<RoleDto | null> = this._editingItem.asReadonly();
  override showDeleteConfirm: Signal<boolean> = this._showDeleteConfirm.asReadonly();
  override selectedItems: Signal<Set<string>> = this._selectedItems.asReadonly();
  override searchTerm: Signal<string> = this._searchTerm.asReadonly();
  override currentPage: Signal<number> = this._currentPage.asReadonly();
  override pageSize: Signal<number> = this._pageSize.asReadonly();
  override filteredItems: Signal<RoleDto[]> = this._filteredItems.asReadonly();

  constructor(initialRoles: RoleDto[] = mockRoles, isLoading = false) {
    super();
    this._items.set(initialRoles);
    this._filteredItems.set(initialRoles);
    this._loading.set(isLoading);
  }

  protected override fetchAllItems(): Observable<RoleDto[]> {
    return of(this._items());
  }

  protected override performSave(dto: SaveRoleDto): Observable<RoleDto> {
    // Transform SaveRoleDto to RoleDto for mock
    const roleDto: RoleDto = {
      id: dto.id || crypto.randomUUID(),
      name: dto.name,
      roles: [],
      permissions: dto.permissionsId?.map((name) => ({ name })) || [],
    };
    return of(roleDto);
  }

  protected override performDelete(id: string): Observable<unknown> {
    return of({ success: true });
  }

  protected override matchesSearch(item: RoleDto, term: string): boolean {
    const searchableFields = [item.name, item.id];
    return searchableFields.some((field) =>
      field.toLowerCase().includes(term.toLowerCase())
    );
  }

  override loadItems(): void {
    this._loading.set(true);
    setTimeout(() => {
      this._items.set(mockRoles);
      this._filteredItems.set(mockRoles);
      this._loading.set(false);
    }, 500);
  }

  override onSearch(term: string): void {
    this._searchTerm.set(term);
    const filtered = this._items().filter((role) =>
      this.matchesSearch(role, term)
    );
    this._filteredItems.set(filtered);
  }

  override onSelectionChange(selected: Set<string>): void {
    this._selectedItems.set(selected);
  }

  override onSelectAll(selectAll: boolean): void {
    if (selectAll) {
      this._selectedItems.set(new Set(this._items().map((r) => r.id)));
    } else {
      this._selectedItems.set(new Set());
    }
  }

  override onPageChange(page: number): void {
    this._currentPage.set(page);
  }
}

/**
 * Default state showing the roles list with sample data
 */
export const Default: Story = {
  render: () => {
    const mockService = new MockRoleCrudService();
    return {
      template: `<app-roles-list />`,
      providers: [
        { provide: RoleCrudService, useValue: mockService },
      ],
    };
  },
};

/**
 * Loading state while fetching roles from the API
 */
export const Loading: Story = {
  render: () => {
    const mockService = new MockRoleCrudService(mockRoles, true);
    return {
      template: `<app-roles-list />`,
      providers: [
        { provide: RoleCrudService, useValue: mockService },
      ],
    };
  },
};

/**
 * Empty state when no roles exist in the system
 */
export const Empty: Story = {
  render: () => {
    const mockService = new MockRoleCrudService([], false);
    return {
      template: `<app-roles-list />`,
      providers: [
        { provide: RoleCrudService, useValue: mockService },
      ],
    };
  },
};

/**
 * State with search results filtered
 */
export const WithSearch: Story = {
  render: () => {
    const mockService = new MockRoleCrudService();
    mockService.onSearch('admin');
    return {
      template: `<app-roles-list />`,
      providers: [
        { provide: RoleCrudService, useValue: mockService },
      ],
    };
  },
};

/**
 * State with selected items for bulk operations
 */
export const WithSelection: Story = {
  render: () => {
    const mockService = new MockRoleCrudService();
    mockService.onSelectionChange(new Set(['1', '3']));
    return {
      template: `<app-roles-list />`,
      providers: [
        { provide: RoleCrudService, useValue: mockService },
      ],
    };
  },
};

/**
 * State showing roles with inherited permissions
 */
export const WithInheritedRoles: Story = {
  render: () => {
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
    const mockService = new MockRoleCrudService(rolesWithInheritance, false);
    return {
      template: `<app-roles-list />`,
      providers: [
        { provide: RoleCrudService, useValue: mockService },
      ],
    };
  },
};
