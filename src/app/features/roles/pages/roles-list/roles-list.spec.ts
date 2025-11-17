import { describe, it, expect, vi } from 'vitest';
import { provideZonelessChangeDetection } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { render } from '@testing-library/angular';
import { RolesListComponent } from './roles-list';
import { RoleCrudService } from '../../services/role-crud.service';
import { UserApiService } from '@loan/app/shared/openapi';

describe('RolesListComponent', () => {
  async function createComponent() {
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

    const { container, fixture } = await render(RolesListComponent, {
      providers: [
        provideZonelessChangeDetection(),
        RoleCrudService,
        { provide: UserApiService, useValue: mockUserApiService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });

    return { container, fixture, mockUserApiService, mockRouter, mockActivatedRoute };
  }

  describe('Component creation', () => {
    it('should create component', async () => {
      const { container } = await createComponent();
      expect(container).toBeTruthy();
    });

    it('should render as standalone component', async () => {
      const { fixture } = await createComponent();
      const metadata = (RolesListComponent as any).ɵcmp;
      expect(metadata.standalone).toBe(true);
    });
  });

  describe('Template rendering', () => {
    it('should render GenericCrudListComponent', async () => {
      const { container } = await createComponent();
      const genericCrudElement = container.querySelector('app-generic-crud-list');
      expect(genericCrudElement).toBeTruthy();
    });

    it('should render single child component', async () => {
      const { container } = await createComponent();
      const children = container.children;
      expect(children.length).toBeGreaterThan(0);
    });

    it('should render app-generic-crud-list as main element', async () => {
      const { container } = await createComponent();
      const genericCrud = container.querySelector('app-generic-crud-list');
      expect(genericCrud).toBeTruthy();
    });
  });

  describe('Component structure', () => {
    it('should have correct selector', () => {
      const metadata = (RolesListComponent as any).ɵcmp;
      expect(metadata.selectors).toEqual([['app-roles-list']]);
    });

    it('should have RoleCrudService injected', async () => {
      const { fixture } = await createComponent();
      const component = (fixture as any).componentInstance;
      expect(component.service).toBeDefined();
    });
  });

  describe('Service configuration', () => {
    it('should have service with correct route base path', async () => {
      const { fixture } = await createComponent();
      const component = (fixture as any).componentInstance;
      expect(component.service.getRouteBasePath()).toBe('/roles');
    });

    it('should have service with correct item type name', async () => {
      const { fixture } = await createComponent();
      const component = (fixture as any).componentInstance;
      expect(component.service.getItemTypeName()).toBe('role');
    });

    it('should have service with correct plural name', async () => {
      const { fixture } = await createComponent();
      const component = (fixture as any).componentInstance;
      expect(component.service.getItemTypePluralName()).toBe('roles');
    });

    it('should have table columns configuration', async () => {
      const { fixture } = await createComponent();
      const component = (fixture as any).componentInstance;
      const columns = component.service.getTableColumns();
      expect(Array.isArray(columns)).toBe(true);
      expect(columns.length).toBeGreaterThan(0);
    });

    it('should have form fields configuration', async () => {
      const { fixture } = await createComponent();
      const component = (fixture as any).componentInstance;
      const fields = component.service.getFormFields();
      expect(Array.isArray(fields)).toBe(true);
      expect(fields.length).toBeGreaterThan(0);
    });
  });

  describe('Service state', () => {
    it('should initialize with empty items', async () => {
      const { fixture } = await createComponent();
      const component = (fixture as any).componentInstance;
      expect(component.service.items()).toEqual([]);
    });

    it('should initialize with loading false', async () => {
      const { fixture } = await createComponent();
      const component = (fixture as any).componentInstance;
      expect(component.service.loading()).toBe(false);
    });

    it('should initialize with showModal false', async () => {
      const { fixture } = await createComponent();
      const component = (fixture as any).componentInstance;
      expect(component.service.showModal()).toBe(false);
    });

    it('should initialize with null editingItem', async () => {
      const { fixture } = await createComponent();
      const component = (fixture as any).componentInstance;
      expect(component.service.editingItem()).toBeNull();
    });

    it('should initialize with currentPage 1', async () => {
      const { fixture } = await createComponent();
      const component = (fixture as any).componentInstance;
      expect(component.service.currentPage()).toBe(1);
    });
  });

  describe('DOM structure', () => {
    it('should have proper parent-child relationship', async () => {
      const { container } = await createComponent();
      const genericCrud = container.querySelector('app-generic-crud-list');
      expect(genericCrud?.parentElement).toBeTruthy();
    });
  });

  describe('Service integration', () => {
    it('should provide table metadata', async () => {
      const { fixture } = await createComponent();
      const component = (fixture as any).componentInstance;
      const columns = component.service.getTableColumns();
      expect(columns.length).toBe(2);

      const nameColumn = columns.find((col: any) => col.key === 'name');
      const idColumn = columns.find((col: any) => col.key === 'id');

      expect(nameColumn).toBeDefined();
      expect(idColumn).toBeDefined();
    });

    it('should provide form metadata', async () => {
      const { fixture } = await createComponent();
      const component = (fixture as any).componentInstance;
      const fields = component.service.getFormFields();
      expect(fields.length).toBe(3);

      const nameField = fields.find((field: any) => field.key === 'name');
      const rolesField = fields.find((field: any) => field.key === 'rolesId');
      const permissionsField = fields.find((field: any) => field.key === 'permissionsId');

      expect(nameField).toBeDefined();
      expect(rolesField).toBeDefined();
      expect(permissionsField).toBeDefined();
    });

    it('should expose service methods', async () => {
      const { fixture } = await createComponent();
      const component = (fixture as any).componentInstance;
      expect(typeof component.service.loadItems).toBe('function');
      expect(typeof component.service.onNewItem).toBe('function');
    });
  });
});
