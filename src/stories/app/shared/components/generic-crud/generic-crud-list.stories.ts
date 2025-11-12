import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { GenericCrudListComponent } from '@loan/app/shared/components/generic-crud/generic-crud-list/generic-crud-list';
import { wrapInLightDarkComparison } from '@loan/stories/story-helpers';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { signal, Signal } from '@angular/core';
import { of, Observable } from 'rxjs';
import { ICrudService } from '@loan/app/core/services';
import { TableColumnMetadata, FormFieldMetadata } from '@loan/app/core/models';
import { RouterModule, ActivatedRoute } from '@angular/router';

const meta: Meta<GenericCrudListComponent<any>> = {
  title: 'Components/GenericCrudList',
  component: GenericCrudListComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [GenericCrudListComponent, ReactiveFormsModule, RouterModule.forRoot([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: {}, queryParams: {} },
            params: of({}),
            queryParams: of({}),
          },
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<GenericCrudListComponent<any>>;

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const mockUsers: MockUser[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
  { id: '4', name: 'Alice Williams', email: 'alice@example.com', role: 'Manager', status: 'Active' },
  { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', status: 'Active' },
];

class MockUserCrudService implements ICrudService<MockUser> {
  private _items = signal<MockUser[]>(mockUsers);
  private _loading = signal<boolean>(false);
  private _showModal = signal<boolean>(false);
  private _editingItem = signal<MockUser | null>(null);
  private _showDeleteConfirm = signal<boolean>(false);
  private _selectedItems = signal<Set<string>>(new Set());
  private _searchTerm = signal<string>('');
  private _currentPage = signal<number>(1);
  private _pageSize = signal<number>(5);
  private _filteredItems = signal<MockUser[]>(mockUsers);

  items: Signal<MockUser[]> = this._items.asReadonly();
  loading: Signal<boolean> = this._loading.asReadonly();
  showModal: Signal<boolean> = this._showModal.asReadonly();
  editingItem: Signal<MockUser | null> = this._editingItem.asReadonly();
  showDeleteConfirm: Signal<boolean> = this._showDeleteConfirm.asReadonly();
  selectedItems: Signal<Set<string>> = this._selectedItems.asReadonly();
  searchTerm: Signal<string> = this._searchTerm.asReadonly();
  currentPage: Signal<number> = this._currentPage.asReadonly();
  pageSize: Signal<number> = this._pageSize.asReadonly();
  filteredItems: Signal<MockUser[]> = this._filteredItems.asReadonly();

  loadAllItems(): Observable<MockUser[]> {
    return of(mockUsers);
  }

  saveItem(dto: MockUser): Observable<MockUser> {
    return of(dto);
  }

  deleteItem(id: string): Observable<unknown> {
    return of({ success: true });
  }

  getTableColumns(): TableColumnMetadata<MockUser>[] {
    return [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'role', label: 'Role', sortable: true },
      { key: 'status', label: 'Status', sortable: false },
    ];
  }

  getFormFields(): FormFieldMetadata[] {
    return [
      {
        key: 'name',
        label: 'Name',
        type: 'text',
        validators: [Validators.required],
      },
      {
        key: 'email',
        label: 'Email',
        type: 'email',
        validators: [Validators.required, Validators.email],
      },
      {
        key: 'role',
        label: 'Role',
        type: 'select',
        validators: [Validators.required],
        loadOptions: () =>
          of([
            { value: 'Admin', label: 'Admin' },
            { value: 'Manager', label: 'Manager' },
            { value: 'User', label: 'User' },
          ]),
      },
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        validators: [Validators.required],
        loadOptions: () =>
          of([
            { value: 'Active', label: 'Active' },
            { value: 'Inactive', label: 'Inactive' },
          ]),
      },
    ];
  }

  getRouteBasePath(): string {
    return '/users';
  }

  getItemTypeName(): string {
    return 'user';
  }

  getItemTypePluralName(): string {
    return 'users';
  }

  getItemDisplayName(item: MockUser): string {
    return item.name;
  }

  loadItems(): void {
    this._loading.set(true);
    setTimeout(() => {
      this._items.set(mockUsers);
      this._loading.set(false);
    }, 500);
  }

  onNewItem(): void {
    this._editingItem.set(null);
    this._showModal.set(true);
  }

  onEditItem(item: MockUser): void {
    this._editingItem.set(item);
    this._showModal.set(true);
  }

  openEditModal(item: MockUser): void {
    this._editingItem.set(item);
    this._showModal.set(true);
  }

  onDeleteItem(item: MockUser): void {
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
    const filtered = mockUsers.filter((user) =>
      user.name.toLowerCase().includes(term.toLowerCase()) ||
      user.email.toLowerCase().includes(term.toLowerCase())
    );
    this._filteredItems.set(filtered);
  }

  onSelectionChange(selected: Set<string>): void {
    this._selectedItems.set(selected);
  }

  onSelectAll(selectAll: boolean): void {
    if (selectAll) {
      this._selectedItems.set(new Set(mockUsers.map((u) => u.id)));
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

  selectedItemsData(): MockUser[] {
    const selected = this._selectedItems();
    return mockUsers.filter((user) => selected.has(user.id));
  }

  getTableData(): MockUser[] {
    return this._filteredItems();
  }

  deleteMessage(): string {
    const count = this._selectedItems().size;
    if (count > 0) {
      return `Are you sure you want to delete ${count} selected user(s)?`;
    }
    const item = this._editingItem();
    return item ? `Are you sure you want to delete ${item.name}?` : '';
  }
}

export const Default: Story = {
  render: () => ({
    template: wrapInLightDarkComparison(`
      <div class="p-8">
        <app-generic-crud-list
          [service]="service"
        />
      </div>
    `),
    props: {
      service: signal(new MockUserCrudService()),
    },
  }),
};

export const WithSearch: Story = {
  render: () => {
    const service = new MockUserCrudService();
    service.onSearch('john');
    return {
      template: wrapInLightDarkComparison(`
        <div class="p-8">
          <app-generic-crud-list
            [service]="service"
          />
        </div>
      `),
      props: {
        service: signal(service),
      },
    };
  },
};

export const WithSelection: Story = {
  render: () => {
    const service = new MockUserCrudService();
    service.onSelectionChange(new Set(['1', '3']));
    return {
      template: wrapInLightDarkComparison(`
        <div class="p-8">
          <app-generic-crud-list
            [service]="service"
          />
        </div>
      `),
      props: {
        service: signal(service),
      },
    };
  },
};

export const EmptyState: Story = {
  render: () => {
    class EmptyService extends MockUserCrudService {
      constructor() {
        super();
        this['_items'].set([]);
        this['_filteredItems'].set([]);
      }
    }
    return {
      template: wrapInLightDarkComparison(`
        <div class="p-8">
          <app-generic-crud-list
            [service]="service"
          />
        </div>
      `),
      props: {
        service: signal(new EmptyService()),
      },
    };
  },
};

export const Loading: Story = {
  render: () => {
    const service = new MockUserCrudService();
    service['_loading'].set(true);
    return {
      template: wrapInLightDarkComparison(`
        <div class="p-8">
          <app-generic-crud-list
            [service]="service"
          />
        </div>
      `),
      props: {
        service: signal(service),
      },
    };
  },
};
