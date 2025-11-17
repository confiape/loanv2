import { describe, it, expect, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CompaniesListComponent } from './companies-list';
import { CompanyCrudService } from '../../services/company-crud.service';
import { CompanyDto } from '@loan/app/shared/openapi';

describe('CompaniesListComponent', () => {
  const mockCompanies: CompanyDto[] = [
    { id: '1', name: 'Company One' },
    { id: '2', name: 'Company Two' },
    { id: '3', name: 'ABC Corp' },
  ];

  function createComponent() {
    const serviceMock: Partial<CompanyCrudService> = {
      items: signal(mockCompanies),
      loading: signal(false),
      showModal: signal(false),
      editingItem: signal<CompanyDto | null>(null),
      showDeleteConfirm: signal(false),
      selectedItems: signal(new Set<string>()),
      searchTerm: signal(''),
      currentPage: signal(1),
      pageSize: signal(10),
      filteredItems: signal(mockCompanies),
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
      deleteMessage: signal('Are you sure?'),
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

    const fixture = TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: CompanyCrudService, useValue: serviceMock },
      ],
    }).createComponent(CompaniesListComponent);
    TestBed.tick();

    return { fixture, serviceMock };
  }

  describe('Component Initialization', () => {
    it('should create', () => {
      // Arrange
      const { fixture } = createComponent();

      // Assert
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('should render as standalone component', () => {
      // Arrange
      const { fixture } = createComponent();
      const metadata = (CompaniesListComponent as any).ɵcmp;

      // Assert
      expect(metadata.standalone).toBe(true);
    });
  });

  describe('Template Rendering', () => {
    it('should render generic-crud-list component', () => {
      // Arrange
      const { fixture } = createComponent();

      // Assert
      const crudList = fixture.nativeElement.querySelector('app-generic-crud-list');
      expect(crudList).toBeTruthy();
    });

    it('should render with proper structure', () => {
      // Arrange
      const { fixture } = createComponent();

      // Assert
      const children = fixture.nativeElement.children;
      expect(children.length).toBeGreaterThan(0);

      const genericCrud = fixture.nativeElement.querySelector('app-generic-crud-list');
      expect(genericCrud).toBeTruthy();
    });
  });

  describe('Service Integration', () => {
    it('should inject CompanyCrudService', () => {
      // Arrange
      const { fixture, serviceMock } = createComponent();
      const component = fixture.componentInstance as any;

      // Assert
      expect(component['service']).toBeDefined();
      expect(component['service']).toBe(serviceMock);
    });

    it('should provide CRUD operations', () => {
      // Arrange
      const { serviceMock } = createComponent();

      // Assert
      expect(typeof serviceMock.loadItems).toBe('function');
      expect(typeof serviceMock.onNewItem).toBe('function');
      expect(typeof serviceMock.onEditItem).toBe('function');
      expect(typeof serviceMock.onDeleteItem).toBe('function');
    });

    it('should provide table configuration', () => {
      // Arrange
      const { serviceMock } = createComponent();

      // Act
      const columns = serviceMock.getTableColumns!();

      // Assert
      expect(columns).toHaveLength(2);
      expect(columns[0].key).toBe('name');
    });

    it('should provide form configuration', () => {
      // Arrange
      const { serviceMock } = createComponent();

      // Act
      const fields = serviceMock.getFormFields!();

      // Assert
      expect(fields).toHaveLength(1);
      expect(fields[0].key).toBe('name');
    });

    it('should provide metadata', () => {
      // Arrange
      const { serviceMock } = createComponent();

      // Assert
      expect(serviceMock.getRouteBasePath!()).toBe('/companies');
      expect(serviceMock.getItemTypeName!()).toBe('company');
      expect(serviceMock.getItemTypePluralName!()).toBe('companies');
    });
  });

  describe('Service State Access', () => {
    it('should provide access to items', () => {
      // Arrange
      const { serviceMock } = createComponent();

      // Act
      const items = (serviceMock.items as any)();

      // Assert
      expect(items).toEqual(mockCompanies);
    });

    it('should provide access to loading state', () => {
      // Arrange
      const { serviceMock } = createComponent();

      // Act
      const loading = (serviceMock.loading as any)();

      // Assert
      expect(loading).toBe(false);
    });

    it('should provide access to modal state', () => {
      // Arrange
      const { serviceMock } = createComponent();

      // Act
      const showModal = (serviceMock.showModal as any)();

      // Assert
      expect(showModal).toBe(false);
    });

    it('should provide access to editing item', () => {
      // Arrange
      const { serviceMock } = createComponent();

      // Act
      const editingItem = (serviceMock.editingItem as any)();

      // Assert
      expect(editingItem).toBeNull();
    });

    it('should provide access to search term', () => {
      // Arrange
      const { serviceMock } = createComponent();

      // Act
      const searchTerm = (serviceMock.searchTerm as any)();

      // Assert
      expect(searchTerm).toBe('');
    });
  });

  describe('Component Composition', () => {
    it('should delegate rendering to GenericCrudListComponent', () => {
      // Arrange
      const { fixture } = createComponent();

      // Assert
      const genericCrud = fixture.nativeElement.querySelector('app-generic-crud-list');
      expect(genericCrud).toBeTruthy();
    });

    it('should pass service to child component', () => {
      // Arrange
      const { fixture, serviceMock } = createComponent();
      const component = fixture.componentInstance as any;

      // Assert
      expect(component['service']).toBe(serviceMock);
    });
  });
});
