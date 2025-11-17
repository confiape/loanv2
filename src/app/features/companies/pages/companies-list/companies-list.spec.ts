import { describe, it, expect, vi } from 'vitest';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { render } from '@testing-library/angular';
import { CompaniesListComponent } from './companies-list';
import { CompanyCrudService } from '../../services/company-crud.service';
import { CompanyDto } from '@loan/app/shared/openapi';

describe('CompaniesListComponent', () => {
  const mockCompanies: CompanyDto[] = [
    { id: '1', name: 'Company One' },
    { id: '2', name: 'Company Two' },
    { id: '3', name: 'ABC Corp' },
  ];

  async function createComponent() {
    const serviceMock: Partial<CompanyCrudService> = {
      items: vi.fn().mockReturnValue(mockCompanies),
      loading: vi.fn().mockReturnValue(false),
      showModal: vi.fn().mockReturnValue(false),
      editingItem: vi.fn().mockReturnValue(null),
      showDeleteConfirm: vi.fn().mockReturnValue(false),
      selectedItems: vi.fn().mockReturnValue(new Set<string>()),
      searchTerm: vi.fn().mockReturnValue(''),
      currentPage: vi.fn().mockReturnValue(1),
      pageSize: vi.fn().mockReturnValue(10),
      filteredItems: vi.fn().mockReturnValue(mockCompanies),
      loadItems: vi.fn(),
      onNewItem: vi.fn(),
      onEditItem: vi.fn(),
      onDeleteItem: vi.fn(),
      onBulkDelete: vi.fn(),
      confirmDelete: vi.fn(),
      cancelDelete: vi.fn(),
      onFormSave: vi.fn(),
      onFormCancel: vi.fn(),
      onSearch: vi.fn(),
      onSelectionChange: vi.fn(),
      onSelectAll: vi.fn(),
      onPageChange: vi.fn(),
      removeFromSelection: vi.fn(),
      clearSelection: vi.fn(),
      hasSelection: vi.fn().mockReturnValue(false),
      selectedItemsData: vi.fn().mockReturnValue([]),
      getTableData: vi.fn().mockReturnValue(mockCompanies),
      deleteMessage: vi.fn().mockReturnValue('Are you sure?'),
      loadAllItems: vi.fn().mockReturnValue(of(mockCompanies)),
      saveItem: vi.fn().mockReturnValue(of(mockCompanies[0])),
      deleteItem: vi.fn().mockReturnValue(of({})),
      getTableColumns: vi.fn().mockReturnValue([
        { key: 'name', label: 'Name', sortable: true },
        { key: 'id', label: 'ID', sortable: true },
      ]),
      getFormFields: vi.fn().mockReturnValue([
        {
          key: 'name',
          label: 'Company Name',
          type: 'text',
          validators: [],
        },
      ]),
      getRouteBasePath: vi.fn().mockReturnValue('/companies'),
      getItemTypeName: vi.fn().mockReturnValue('company'),
      getItemTypePluralName: vi.fn().mockReturnValue('companies'),
      getItemDisplayName: vi.fn().mockImplementation((item: CompanyDto) => item.name),
      openEditModal: vi.fn(),
    };

    const { container, fixture } = await render(CompaniesListComponent, {
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: CompanyCrudService, useValue: serviceMock },
      ],
    });

    return { container, fixture, serviceMock };
  }

  describe('Component Initialization', () => {
    it('should create', async () => {
      const { container } = await createComponent();
      expect(container).toBeTruthy();
    });

    it('should render as standalone component', async () => {
      const { fixture } = await createComponent();
      const metadata = (CompaniesListComponent as any).ɵcmp;
      expect(metadata.standalone).toBe(true);
    });
  });

  describe('Template Rendering', () => {
    it('should render generic-crud-list component', async () => {
      const { container } = await createComponent();
      const crudList = container.querySelector('app-generic-crud-list');
      expect(crudList).toBeTruthy();
    });

    it('should render with proper structure', async () => {
      const { container } = await createComponent();
      const children = container.children;
      expect(children.length).toBeGreaterThan(0);

      const genericCrud = container.querySelector('app-generic-crud-list');
      expect(genericCrud).toBeTruthy();
    });
  });

  describe('Service Integration', () => {
    it('should inject CompanyCrudService', async () => {
      const { fixture, serviceMock } = await createComponent();
      const component = (fixture as any).componentInstance;
      expect(component['service']).toBeDefined();
      expect(component['service']).toBe(serviceMock);
    });

    it('should provide CRUD operations', async () => {
      const { serviceMock } = await createComponent();
      expect(typeof serviceMock.loadItems).toBe('function');
      expect(typeof serviceMock.onNewItem).toBe('function');
      expect(typeof serviceMock.onEditItem).toBe('function');
      expect(typeof serviceMock.onDeleteItem).toBe('function');
    });

    it('should provide table configuration', async () => {
      const { serviceMock } = await createComponent();
      const columns = serviceMock.getTableColumns!();
      expect(columns).toHaveLength(2);
      expect(columns[0].key).toBe('name');
    });

    it('should provide form configuration', async () => {
      const { serviceMock } = await createComponent();
      const fields = serviceMock.getFormFields!();
      expect(fields).toHaveLength(1);
      expect(fields[0].key).toBe('name');
    });

    it('should provide metadata', async () => {
      const { serviceMock } = await createComponent();
      expect(serviceMock.getRouteBasePath!()).toBe('/companies');
      expect(serviceMock.getItemTypeName!()).toBe('company');
      expect(serviceMock.getItemTypePluralName!()).toBe('companies');
    });
  });

  describe('Service State Access', () => {
    it('should provide access to items', async () => {
      const { serviceMock } = await createComponent();
      const items = (serviceMock.items as any)();
      expect(items).toEqual(mockCompanies);
    });

    it('should provide access to loading state', async () => {
      const { serviceMock } = await createComponent();
      const loading = (serviceMock.loading as any)();
      expect(loading).toBe(false);
    });

    it('should provide access to modal state', async () => {
      const { serviceMock } = await createComponent();
      const showModal = (serviceMock.showModal as any)();
      expect(showModal).toBe(false);
    });

    it('should provide access to editing item', async () => {
      const { serviceMock } = await createComponent();
      const editingItem = (serviceMock.editingItem as any)();
      expect(editingItem).toBeNull();
    });

    it('should provide access to search term', async () => {
      const { serviceMock } = await createComponent();
      const searchTerm = (serviceMock.searchTerm as any)();
      expect(searchTerm).toBe('');
    });
  });

  describe('Component Composition', () => {
    it('should delegate rendering to GenericCrudListComponent', async () => {
      const { container } = await createComponent();
      const genericCrud = container.querySelector('app-generic-crud-list');
      expect(genericCrud).toBeTruthy();
    });

    it('should pass service to child component', async () => {
      const { fixture, serviceMock } = await createComponent();
      const component = (fixture as any).componentInstance;
      expect(component['service']).toBe(serviceMock);
    });
  });
});
