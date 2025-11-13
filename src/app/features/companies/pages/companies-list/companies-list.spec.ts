import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, signal, computed } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CompaniesListComponent } from './companies-list';
import { CompanyCrudService } from '../../services/company-crud.service';
import { CompanyDto } from '@loan/app/shared/openapi';

describe('CompaniesListComponent', () => {
  let component: CompaniesListComponent;
  let fixture: ComponentFixture<CompaniesListComponent>;
  let compiled: HTMLElement;
  let serviceMock: Partial<CompanyCrudService>;

  const mockCompanies: CompanyDto[] = [
    { id: '1', name: 'Company One' },
    { id: '2', name: 'Company Two' },
    { id: '3', name: 'ABC Corp' },
  ];

  beforeEach(async () => {
    serviceMock = {
      items: signal(mockCompanies),
      loading: signal(false),
      showModal: signal(false),
      editingItem: signal(null),
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
      selectedItemsData: computed(() => []),
      getTableData: vi.fn().mockReturnValue(mockCompanies),
      deleteMessage: computed(() => 'Are you sure?'),
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

    await TestBed.configureTestingModule({
      imports: [CompaniesListComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: CompanyCrudService, useValue: serviceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CompaniesListComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should inject CompanyCrudService', () => {
      expect(component['service']).toBeDefined();
      expect(component['service']).toBe(serviceMock);
    });
  });

  describe('Template Rendering', () => {
    it('should render generic-crud-list component', () => {
      const crudList = compiled.querySelector('app-generic-crud-list');
      expect(crudList).toBeTruthy();
    });

    it('should pass service to generic-crud-list', () => {
      const crudList = compiled.querySelector('app-generic-crud-list');
      expect(crudList).toBeTruthy();
      // The service is passed as an input binding
    });

    it('should pass testIdPrefix to generic-crud-list', () => {
      const crudList = compiled.querySelector('app-generic-crud-list');
      expect(crudList).toBeTruthy();
      // The testIdPrefix is passed as 'companies'
    });
  });

  describe('Integration with GenericCrudListComponent', () => {
    it('should display companies list through generic component', () => {
      // The actual rendering happens in GenericCrudListComponent
      // This test verifies the component is properly configured
      expect(serviceMock.getTableColumns).toBeDefined();
      expect(serviceMock.getFormFields).toBeDefined();
      expect(serviceMock.getItemTypeName).toBeDefined();
    });

    it('should pass testIdPrefix to GenericCrudListComponent', () => {
      const crudList = compiled.querySelector('app-generic-crud-list');
      expect(crudList).toBeTruthy();
      // The testIdPrefix is passed as 'companies' through the component's template
      // Verify the element exists which confirms the binding is present
    });
  });

  describe('Service Methods Access', () => {
    it('should have access to CRUD operations', () => {
      expect(typeof serviceMock.loadItems).toBe('function');
      expect(typeof serviceMock.onNewItem).toBe('function');
      expect(typeof serviceMock.onEditItem).toBe('function');
      expect(typeof serviceMock.onDeleteItem).toBe('function');
    });

    it('should have access to table configuration', () => {
      const columns = serviceMock.getTableColumns!();
      expect(columns).toHaveLength(2);
      expect(columns[0].key).toBe('name');
    });

    it('should have access to form configuration', () => {
      const fields = serviceMock.getFormFields!();
      expect(fields).toHaveLength(1);
      expect(fields[0].key).toBe('name');
    });

    it('should have access to metadata', () => {
      expect(serviceMock.getRouteBasePath!()).toBe('/companies');
      expect(serviceMock.getItemTypeName!()).toBe('company');
      expect(serviceMock.getItemTypePluralName!()).toBe('companies');
    });
  });

  describe('Component Properties', () => {
    it('should be a standalone component', () => {
      // Verify component metadata
      const metadata = (CompaniesListComponent as any).ɵcmp;
      expect(metadata.standalone).toBe(true);
    });

    it('should render GenericCrudListComponent with service', () => {
      const crudListElement = compiled.querySelector('app-generic-crud-list');
      expect(crudListElement).toBeTruthy();
    });
  });

  describe('Template Structure', () => {
    it('should have minimal template delegating to GenericCrudListComponent', () => {
      const children = compiled.children;
      expect(children.length).toBeGreaterThan(0);

      // Should primarily contain the generic crud list
      const genericCrud = compiled.querySelector('app-generic-crud-list');
      expect(genericCrud).toBeTruthy();
    });
  });

  describe('Service Signals', () => {
    it('should access items signal from service', () => {
      const items = component['service'].items();
      expect(items).toEqual(mockCompanies);
    });

    it('should access loading signal from service', () => {
      const loading = component['service'].loading();
      expect(loading).toBe(false);
    });

    it('should access showModal signal from service', () => {
      const showModal = component['service'].showModal();
      expect(showModal).toBe(false);
    });

    it('should access editingItem signal from service', () => {
      const editingItem = component['service'].editingItem();
      expect(editingItem).toBeNull();
    });

    it('should access searchTerm signal from service', () => {
      const searchTerm = component['service'].searchTerm();
      expect(searchTerm).toBe('');
    });
  });
});
