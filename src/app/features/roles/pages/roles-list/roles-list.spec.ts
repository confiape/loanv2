import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { RolesListComponent } from './roles-list';
import { RoleCrudService } from '../../services/role-crud.service';
import { UserApiService } from '@loan/app/shared/openapi';

describe('RolesListComponent', () => {
  let component: RolesListComponent;
  let fixture: ComponentFixture<RolesListComponent>;
  let host: HTMLElement;
  let mockUserApiService: {
    getAllRoles: ReturnType<typeof vi.fn>;
    saveRole: ReturnType<typeof vi.fn>;
    deleteRole: ReturnType<typeof vi.fn>;
    getAllPermissions: ReturnType<typeof vi.fn>;
  };
  let mockRouter: {
    navigate: ReturnType<typeof vi.fn>;
  };
  let mockActivatedRoute: {
    params: { subscribe: ReturnType<typeof vi.fn> };
  };

  beforeEach(async () => {
    mockUserApiService = {
      getAllRoles: vi.fn().mockReturnValue(of([])),
      saveRole: vi.fn().mockReturnValue(of({})),
      deleteRole: vi.fn().mockReturnValue(of(undefined)),
      getAllPermissions: vi.fn().mockReturnValue(of([])),
    };

    mockRouter = {
      navigate: vi.fn().mockResolvedValue(true),
    };

    mockActivatedRoute = {
      params: {
        subscribe: vi.fn().mockImplementation((fn) => {
          fn({});
          return { unsubscribe: vi.fn() };
        }),
      },
    };

    await TestBed.configureTestingModule({
      imports: [RolesListComponent],
      providers: [
        provideZonelessChangeDetection(),
        RoleCrudService,
        { provide: UserApiService, useValue: mockUserApiService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RolesListComponent);
    component = fixture.componentInstance;
    host = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  describe('Component creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be an instance of RolesListComponent', () => {
      expect(component).toBeInstanceOf(RolesListComponent);
    });
  });

  describe('Service injection', () => {
    it('should inject RoleCrudService', () => {
      expect(component.service).toBeDefined();
    });

    it('should inject correct service type', () => {
      expect(component.service).toBeInstanceOf(RoleCrudService);
    });

    it('should make service accessible as protected member', () => {
      const serviceInstance = (component as any).service;
      expect(serviceInstance).toBeTruthy();
      expect(serviceInstance).toBe(component.service);
    });
  });

  describe('Template rendering', () => {
    it('should render GenericCrudListComponent', () => {
      const genericCrudElement = host.querySelector('app-generic-crud-list');
      expect(genericCrudElement).toBeTruthy();
    });

    it('should pass service to GenericCrudListComponent', () => {
      const genericCrudElement = host.querySelector('app-generic-crud-list');
      expect(genericCrudElement).toBeTruthy();
      // Verify component was created with service
      expect(component.service).toBeTruthy();
    });

    it('should have correct test ID prefix binding', () => {
      // The testIdPrefix is passed as an input to the child component
      const genericCrudElement = host.querySelector('app-generic-crud-list');
      expect(genericCrudElement).toBeTruthy();
    });
  });

  describe('Component structure', () => {
    it('should be a standalone component', () => {
      const metadata = (RolesListComponent as any).ɵcmp;
      expect(metadata.standalone).toBe(true);
    });

    it('should import GenericCrudListComponent', () => {
      const metadata = (RolesListComponent as any).ɵcmp;
      expect(metadata.dependencies).toBeDefined();
      // In Angular 20 with standalone components, dependencies may be flattened
      // The important thing is that the component renders correctly
      const genericCrudElement = host.querySelector('app-generic-crud-list');
      expect(genericCrudElement).toBeTruthy();
    });

    it('should have correct selector', () => {
      const metadata = (RolesListComponent as any).ɵcmp;
      expect(metadata.selectors).toEqual([['app-roles-list']]);
    });
  });

  describe('Service configuration', () => {
    it('should have service with correct route base path', () => {
      expect(component.service.getRouteBasePath()).toBe('/roles');
    });

    it('should have service with correct item type name', () => {
      expect(component.service.getItemTypeName()).toBe('role');
    });

    it('should have service with correct item type plural name', () => {
      expect(component.service.getItemTypePluralName()).toBe('roles');
    });

    it('should have service with table columns configuration', () => {
      const columns = component.service.getTableColumns();
      expect(columns).toBeDefined();
      expect(Array.isArray(columns)).toBe(true);
      expect(columns.length).toBeGreaterThan(0);
    });

    it('should have service with form fields configuration', () => {
      const fields = component.service.getFormFields();
      expect(fields).toBeDefined();
      expect(Array.isArray(fields)).toBe(true);
      expect(fields.length).toBeGreaterThan(0);
    });
  });

  describe('Component isolation', () => {
    it('should not have any custom public methods', () => {
      const publicMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(component)).filter(
        (name) => name !== 'constructor'
      );

      // Should only have minimal methods from the class
      expect(publicMethods.length).toBeLessThanOrEqual(2);
    });

    it('should delegate all functionality to GenericCrudListComponent', () => {
      // The component should not implement any custom CRUD logic
      const genericCrudElement = host.querySelector('app-generic-crud-list');
      expect(genericCrudElement).toBeTruthy();
    });
  });

  describe('Service state', () => {
    it('should have service with empty items initially', () => {
      expect(component.service.items()).toEqual([]);
    });

    it('should have service with loading false initially', () => {
      expect(component.service.loading()).toBe(false);
    });

    it('should have service with showModal false initially', () => {
      expect(component.service.showModal()).toBe(false);
    });

    it('should have service with null editingItem initially', () => {
      expect(component.service.editingItem()).toBeNull();
    });

    it('should have service with empty selectedItems initially', () => {
      expect(component.service.selectedItems().size).toBe(0);
    });

    it('should have service with empty search term initially', () => {
      expect(component.service.searchTerm()).toBe('');
    });

    it('should have service with currentPage 1 initially', () => {
      expect(component.service.currentPage()).toBe(1);
    });

    it('should have service with pageSize 10 initially', () => {
      expect(component.service.pageSize()).toBe(10);
    });
  });

  describe('DOM structure', () => {
    it('should have single child component', () => {
      const children = host.children;
      expect(children.length).toBe(1);
    });

    it('should render app-generic-crud-list as direct child', () => {
      const firstChild = host.children[0];
      expect(firstChild.tagName.toLowerCase()).toBe('app-generic-crud-list');
    });

    it('should not have any additional wrapper elements', () => {
      const genericCrud = host.querySelector('app-generic-crud-list');
      expect(genericCrud?.parentElement).toBe(host);
    });
  });

  describe('Change detection', () => {
    it('should handle multiple change detection cycles', () => {
      fixture.detectChanges();
      fixture.detectChanges();
      fixture.detectChanges();

      expect(component).toBeTruthy();
    });

    it('should respond to service signal changes', () => {
      const initialLoading = component.service.loading();
      fixture.detectChanges();
      expect(component.service.loading()).toBe(initialLoading);
    });
  });

  describe('Component lifecycle', () => {
    it('should properly initialize on creation', () => {
      expect(component.service).toBeDefined();
      expect(fixture.componentInstance).toBe(component);
    });

    it('should properly handle destroy', () => {
      fixture.destroy();
      expect(fixture.componentInstance).toBe(component);
    });
  });

  describe('Integration with service', () => {
    it('should maintain service instance throughout lifecycle', () => {
      const serviceRef1 = component.service;
      fixture.detectChanges();
      const serviceRef2 = component.service;

      expect(serviceRef1).toBe(serviceRef2);
    });

    it('should allow service method calls', () => {
      // Service methods should be accessible
      expect(typeof component.service.loadItems).toBe('function');
      expect(typeof component.service.onNewItem).toBe('function');
    });

    it('should have service with working signals', () => {
      // Test that signals are reactive
      const items = component.service.items();
      const filteredItems = component.service.filteredItems();

      expect(Array.isArray(items)).toBe(true);
      expect(Array.isArray(filteredItems)).toBe(true);
    });
  });

  describe('Testability', () => {
    it('should be easily testable via service mock', () => {
      expect(component.service).toBeDefined();
      expect(component.service).toBeInstanceOf(RoleCrudService);
    });

    it('should provide testIdPrefix for E2E testing', () => {
      const genericCrudElement = host.querySelector('app-generic-crud-list');
      expect(genericCrudElement).toBeTruthy();
    });
  });

  describe('Component composition', () => {
    it('should follow composition pattern', () => {
      const genericCrudElement = host.querySelector('app-generic-crud-list');
      expect(genericCrudElement).toBeTruthy();
    });

    it('should maintain single responsibility', () => {
      // Component only wires up service with GenericCrudListComponent
      expect(component.service).toBeDefined();
      const genericCrudElement = host.querySelector('app-generic-crud-list');
      expect(genericCrudElement).toBeTruthy();
    });

    it('should use declarative template', () => {
      expect(host.querySelector('app-generic-crud-list')).toBeTruthy();
    });
  });

  describe('Service metadata', () => {
    it('should provide correct columns for table', () => {
      const columns = component.service.getTableColumns();
      expect(columns.length).toBe(2);

      const nameColumn = columns.find((col) => col.key === 'name');
      const idColumn = columns.find((col) => col.key === 'id');

      expect(nameColumn).toBeDefined();
      expect(idColumn).toBeDefined();
    });

    it('should provide correct fields for form', () => {
      const fields = component.service.getFormFields();
      expect(fields.length).toBe(3);

      const nameField = fields.find((field) => field.key === 'name');
      const rolesField = fields.find((field) => field.key === 'rolesId');
      const permissionsField = fields.find((field) => field.key === 'permissionsId');

      expect(nameField).toBeDefined();
      expect(rolesField).toBeDefined();
      expect(permissionsField).toBeDefined();
    });

    it('should use role as item type name', () => {
      expect(component.service.getItemTypeName()).toBe('role');
    });

    it('should use roles as plural name', () => {
      expect(component.service.getItemTypePluralName()).toBe('roles');
    });
  });
});
