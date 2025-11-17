import { describe, it, expect, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { RolesListComponent } from './roles-list';
import { RoleCrudService } from '../../services/role-crud.service';
import { UserApiService } from '@loan/app/shared/openapi';

describe('RolesListComponent', () => {
  function createComponent() {
    const mockUserApiService = {
      getAllRoles: vi.fn().mockReturnValue(of([])),
      saveRole: vi.fn().mockReturnValue(of({})),
      deleteRole: vi.fn().mockReturnValue(of(undefined)),
      getAllPermissions: vi.fn().mockReturnValue(of([])),
    };

    const mockRouter = {
      navigate: vi.fn().mockResolvedValue(true),
    };

    const mockActivatedRoute = {
      params: {
        subscribe: vi.fn().mockImplementation((fn) => {
          fn({});
          return { unsubscribe: vi.fn() };
        }),
      },
    };

    const fixture = TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        RoleCrudService,
        { provide: UserApiService, useValue: mockUserApiService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).createComponent(RolesListComponent);
    TestBed.tick();

    return { fixture, mockUserApiService, mockRouter, mockActivatedRoute };
  }

  describe('Component creation', () => {
    it('should create component', () => {
      // Arrange
      const { fixture } = createComponent();

      // Assert
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('should render as standalone component', () => {
      // Arrange
      const { fixture } = createComponent();
      const metadata = (RolesListComponent as any).ɵcmp;

      // Assert
      expect(metadata.standalone).toBe(true);
    });
  });

  describe('Template rendering', () => {
    it('should render GenericCrudListComponent', () => {
      // Arrange
      const { fixture } = createComponent();

      // Assert
      const genericCrudElement = fixture.nativeElement.querySelector('app-generic-crud-list');
      expect(genericCrudElement).toBeTruthy();
    });

    it('should render single child component', () => {
      // Arrange
      const { fixture } = createComponent();

      // Assert
      const children = fixture.nativeElement.children;
      expect(children.length).toBeGreaterThan(0);
    });

    it('should render app-generic-crud-list as main element', () => {
      // Arrange
      const { fixture } = createComponent();

      // Assert
      const genericCrud = fixture.nativeElement.querySelector('app-generic-crud-list');
      expect(genericCrud).toBeTruthy();
    });
  });

  describe('Component structure', () => {
    it('should have correct selector', () => {
      // Arrange
      const metadata = (RolesListComponent as any).ɵcmp;

      // Assert
      expect(metadata.selectors).toEqual([['app-roles-list']]);
    });

    it('should have RoleCrudService injected', () => {
      // Arrange
      const { fixture } = createComponent();
      const component = fixture.componentInstance as any;

      // Assert
      expect(component.service).toBeDefined();
    });
  });

  describe('Service configuration', () => {
    it('should have service with correct route base path', () => {
      // Arrange
      const { fixture } = createComponent();
      const component = fixture.componentInstance as any;

      // Assert
      expect(component.service.getRouteBasePath()).toBe('/roles');
    });

    it('should have service with correct item type name', () => {
      // Arrange
      const { fixture } = createComponent();
      const component = fixture.componentInstance as any;

      // Assert
      expect(component.service.getItemTypeName()).toBe('role');
    });

    it('should have service with correct plural name', () => {
      // Arrange
      const { fixture } = createComponent();
      const component = fixture.componentInstance as any;

      // Assert
      expect(component.service.getItemTypePluralName()).toBe('roles');
    });

    it('should have table columns configuration', () => {
      // Arrange
      const { fixture } = createComponent();
      const component = fixture.componentInstance as any;

      // Act
      const columns = component.service.getTableColumns();

      // Assert
      expect(Array.isArray(columns)).toBe(true);
      expect(columns.length).toBeGreaterThan(0);
    });

    it('should have form fields configuration', () => {
      // Arrange
      const { fixture } = createComponent();
      const component = fixture.componentInstance as any;

      // Act
      const fields = component.service.getFormFields();

      // Assert
      expect(Array.isArray(fields)).toBe(true);
      expect(fields.length).toBeGreaterThan(0);
    });
  });

  describe('Service state', () => {
    it('should initialize with empty items', () => {
      // Arrange
      const { fixture } = createComponent();
      const component = fixture.componentInstance as any;

      // Assert
      expect(component.service.items()).toEqual([]);
    });

    it('should initialize with loading false', () => {
      // Arrange
      const { fixture } = createComponent();
      const component = fixture.componentInstance as any;

      // Assert
      expect(component.service.loading()).toBe(false);
    });

    it('should initialize with showModal false', () => {
      // Arrange
      const { fixture } = createComponent();
      const component = fixture.componentInstance as any;

      // Assert
      expect(component.service.showModal()).toBe(false);
    });

    it('should initialize with null editingItem', () => {
      // Arrange
      const { fixture } = createComponent();
      const component = fixture.componentInstance as any;

      // Assert
      expect(component.service.editingItem()).toBeNull();
    });

    it('should initialize with currentPage 1', () => {
      // Arrange
      const { fixture } = createComponent();
      const component = fixture.componentInstance as any;

      // Assert
      expect(component.service.currentPage()).toBe(1);
    });
  });

  describe('DOM structure', () => {
    it('should have proper parent-child relationship', () => {
      // Arrange
      const { fixture } = createComponent();

      // Assert
      const genericCrud = fixture.nativeElement.querySelector('app-generic-crud-list');
      expect(genericCrud?.parentElement).toBeTruthy();
    });
  });

  describe('Service integration', () => {
    it('should provide table metadata', () => {
      // Arrange
      const { fixture } = createComponent();
      const component = fixture.componentInstance as any;

      // Act
      const columns = component.service.getTableColumns();

      // Assert
      expect(columns.length).toBe(2);

      const nameColumn = columns.find((col: any) => col.key === 'name');
      const idColumn = columns.find((col: any) => col.key === 'id');

      expect(nameColumn).toBeDefined();
      expect(idColumn).toBeDefined();
    });

    it('should provide form metadata', () => {
      // Arrange
      const { fixture } = createComponent();
      const component = fixture.componentInstance as any;

      // Act
      const fields = component.service.getFormFields();

      // Assert
      expect(fields.length).toBe(3);

      const nameField = fields.find((field: any) => field.key === 'name');
      const rolesField = fields.find((field: any) => field.key === 'rolesId');
      const permissionsField = fields.find((field: any) => field.key === 'permissionsId');

      expect(nameField).toBeDefined();
      expect(rolesField).toBeDefined();
      expect(permissionsField).toBeDefined();
    });

    it('should expose service methods', () => {
      // Arrange
      const { fixture } = createComponent();
      const component = fixture.componentInstance as any;

      // Assert
      expect(typeof component.service.loadItems).toBe('function');
      expect(typeof component.service.onNewItem).toBe('function');
    });
  });
});
