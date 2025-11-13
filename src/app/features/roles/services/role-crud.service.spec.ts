import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Validators } from '@angular/forms';
import { RoleCrudService } from './role-crud.service';
import { UserApiService, RoleDto, SaveRoleDto, PermissionDto } from '@loan/app/shared/openapi';
import { noSpecialCharactersValidator } from '../validators/role.validators';

describe('RoleCrudService', () => {
  let service: RoleCrudService;
  let mockUserApiService: {
    getAllRoles: ReturnType<typeof vi.fn>;
    saveRole: ReturnType<typeof vi.fn>;
    deleteRole: ReturnType<typeof vi.fn>;
    getAllPermissions: ReturnType<typeof vi.fn>;
  };
  let mockRouter: {
    navigate: ReturnType<typeof vi.fn>;
  };

  // Test data
  const mockRole1: RoleDto = {
    id: 'role-1',
    name: 'Admin',
    roles: [],
    permissions: [
      { name: 'read', description: 'Read permission' },
      { name: 'write', description: 'Write permission' },
    ],
  };

  const mockRole2: RoleDto = {
    id: 'role-2',
    name: 'User',
    roles: [mockRole1],
    permissions: [{ name: 'read', description: 'Read permission' }],
  };

  const mockRole3: RoleDto = {
    id: 'role-3',
    name: 'Super Admin',
    roles: [],
    permissions: [],
  };

  const mockPermission1: PermissionDto = {
    name: 'create',
    description: 'Create permission',
  };

  const mockPermission2: PermissionDto = {
    name: 'delete',
    description: 'Delete permission',
  };

  const mockPermissions: PermissionDto[] = [mockPermission1, mockPermission2];

  const mockSaveDto: SaveRoleDto = {
    id: 'role-1',
    name: 'Updated Admin',
    rolesId: ['role-2'],
    permissionsId: ['create', 'delete'],
  };

  beforeEach(() => {
    mockUserApiService = {
      getAllRoles: vi.fn(),
      saveRole: vi.fn(),
      deleteRole: vi.fn(),
      getAllPermissions: vi.fn(),
    };

    mockRouter = {
      navigate: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        RoleCrudService,
        { provide: UserApiService, useValue: mockUserApiService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    service = TestBed.inject(RoleCrudService);
  });

  describe('Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with empty items', () => {
      expect(service.items()).toEqual([]);
    });

    it('should initialize with loading false', () => {
      expect(service.loading()).toBe(false);
    });

    it('should initialize with showModal false', () => {
      expect(service.showModal()).toBe(false);
    });

    it('should initialize with null editingItem', () => {
      expect(service.editingItem()).toBeNull();
    });
  });

  describe('fetchAllItems', () => {
    it('should call getAllRoles from UserApiService', async () => {
      const mockRoles = [mockRole1, mockRole2];
      mockUserApiService.getAllRoles.mockReturnValue(of(mockRoles));

      const promise = new Promise<void>((resolve) => {
        service.loadAllItems().subscribe((roles) => {
          expect(mockUserApiService.getAllRoles).toHaveBeenCalled();
          expect(roles).toEqual(mockRoles);
          resolve();
        });
      });

      await promise;
    });

    it('should update items signal after fetching', async () => {
      const mockRoles = [mockRole1, mockRole2];
      mockUserApiService.getAllRoles.mockReturnValue(of(mockRoles));

      const promise = new Promise<void>((resolve) => {
        service.loadAllItems().subscribe(() => {
          expect(service.items()).toEqual(mockRoles);
          resolve();
        });
      });

      await promise;
    });

    it('should set loading to false after successful fetch', async () => {
      mockUserApiService.getAllRoles.mockReturnValue(of([mockRole1]));

      const promise = new Promise<void>((resolve) => {
        service.loadAllItems().subscribe(() => {
          expect(service.loading()).toBe(false);
          resolve();
        });
      });

      await promise;
    });

    it('should handle empty array response', async () => {
      mockUserApiService.getAllRoles.mockReturnValue(of([]));

      const promise = new Promise<void>((resolve) => {
        service.loadAllItems().subscribe((roles) => {
          expect(roles).toEqual([]);
          expect(service.items()).toEqual([]);
          resolve();
        });
      });

      await promise;
    });
  });

  describe('performSave', () => {
    it('should call saveRole from UserApiService', async () => {
      mockUserApiService.saveRole.mockReturnValue(of(mockRole1));

      const promise = new Promise<void>((resolve) => {
        service.saveItem(mockSaveDto).subscribe(() => {
          expect(mockUserApiService.saveRole).toHaveBeenCalledWith(mockSaveDto);
          resolve();
        });
      });

      await promise;
    });

    it('should return saved role', async () => {
      mockUserApiService.saveRole.mockReturnValue(of(mockRole1));

      const promise = new Promise<void>((resolve) => {
        service.saveItem(mockSaveDto).subscribe((role) => {
          expect(role).toEqual(mockRole1);
          resolve();
        });
      });

      await promise;
    });

    it('should strip nested role data and send clean SaveRoleDto', async () => {
      mockUserApiService.saveRole.mockReturnValue(of(mockRole1));

      // Create a DTO with potential nested data (simulating what might come from the form)
      const dtoWithNestedData: SaveRoleDto = {
        id: 'role-1',
        name: 'Test Role',
        rolesId: ['role-2', 'role-3'],
        permissionsId: ['read', 'write', 'delete'],
      };

      const promise = new Promise<void>((resolve) => {
        service.saveItem(dtoWithNestedData).subscribe(() => {
          // Verify that saveRole was called with a clean DTO structure
          expect(mockUserApiService.saveRole).toHaveBeenCalledWith({
            id: 'role-1',
            name: 'Test Role',
            rolesId: ['role-2', 'role-3'],
            permissionsId: ['read', 'write', 'delete'],
          });
          resolve();
        });
      });

      await promise;
    });

    it('should handle null id in SaveRoleDto', async () => {
      mockUserApiService.saveRole.mockReturnValue(of(mockRole1));

      const newRoleDto: SaveRoleDto = {
        name: 'New Role',
        rolesId: [],
        permissionsId: ['read'],
      };

      const promise = new Promise<void>((resolve) => {
        service.saveItem(newRoleDto).subscribe(() => {
          expect(mockUserApiService.saveRole).toHaveBeenCalledWith({
            id: null,
            name: 'New Role',
            rolesId: [],
            permissionsId: ['read'],
          });
          resolve();
        });
      });

      await promise;
    });

    it('should handle save errors', async () => {
      const error = new Error('Save failed');
      mockUserApiService.saveRole.mockReturnValue(throwError(() => error));

      const promise = new Promise<void>((resolve) => {
        service.saveItem(mockSaveDto).subscribe({
          error: (err) => {
            expect(err.message).toBe('Save failed');
            resolve();
          },
        });
      });

      await promise;
    });
  });

  describe('performDelete', () => {
    it('should call deleteRole from UserApiService', async () => {
      mockUserApiService.deleteRole.mockReturnValue(of(undefined));

      const promise = new Promise<void>((resolve) => {
        service.deleteItem('role-1').subscribe(() => {
          expect(mockUserApiService.deleteRole).toHaveBeenCalledWith('role-1');
          resolve();
        });
      });

      await promise;
    });

    it('should handle delete errors', async () => {
      const error = new Error('Delete failed');
      mockUserApiService.deleteRole.mockReturnValue(throwError(() => error));

      const promise = new Promise<void>((resolve) => {
        service.deleteItem('role-1').subscribe({
          error: (err) => {
            expect(err.message).toBe('Delete failed');
            resolve();
          },
        });
      });

      await promise;
    });
  });

  describe('matchesSearch', () => {
    it('should match by role name (case insensitive)', () => {
      // Access protected method via type assertion for testing
      const matches = (service as any).matchesSearch(mockRole1, 'admin');
      expect(matches).toBe(true);
    });

    it('should match by role name with exact case', () => {
      const matches = (service as any).matchesSearch(mockRole1, 'Admin');
      expect(matches).toBe(true);
    });

    it('should match by role name with different case', () => {
      const matches = (service as any).matchesSearch(mockRole1, 'ADMIN');
      expect(matches).toBe(true);
    });

    it('should match by role ID', () => {
      const matches = (service as any).matchesSearch(mockRole1, 'role-1');
      expect(matches).toBe(true);
    });

    it('should match by partial role name', () => {
      const matches = (service as any).matchesSearch(mockRole1, 'adm');
      expect(matches).toBe(true);
    });

    it('should not match when search term is not found', () => {
      const matches = (service as any).matchesSearch(mockRole1, 'xyz');
      expect(matches).toBe(false);
    });

    it('should handle empty search term', () => {
      const matches = (service as any).matchesSearch(mockRole1, '');
      expect(matches).toBe(true);
    });

    it('should match role with spaces in name', () => {
      const matches = (service as any).matchesSearch(mockRole3, 'super');
      expect(matches).toBe(true);
    });

    it('should match role with spaces by full text', () => {
      const matches = (service as any).matchesSearch(mockRole3, 'super admin');
      expect(matches).toBe(true);
    });
  });

  describe('getTableColumns', () => {
    it('should return array of table columns', () => {
      const columns = service.getTableColumns();

      expect(Array.isArray(columns)).toBe(true);
      expect(columns.length).toBe(2);
    });

    it('should return name column with correct metadata', () => {
      const columns = service.getTableColumns();
      const nameColumn = columns.find((col) => col.key === 'name');

      expect(nameColumn).toBeDefined();
      expect(nameColumn?.label).toBe('Name');
      expect(nameColumn?.sortable).toBe(true);
      expect(nameColumn?.align).toBe('left');
    });

    it('should return id column with correct metadata', () => {
      const columns = service.getTableColumns();
      const idColumn = columns.find((col) => col.key === 'id');

      expect(idColumn).toBeDefined();
      expect(idColumn?.label).toBe('ID');
      expect(idColumn?.sortable).toBe(true);
      expect(idColumn?.align).toBe('left');
    });

    it('should return columns in correct order', () => {
      const columns = service.getTableColumns();

      expect(columns[0].key).toBe('name');
      expect(columns[1].key).toBe('id');
    });
  });

  describe('getFormFields', () => {
    it('should return array of form fields', () => {
      const fields = service.getFormFields();

      expect(Array.isArray(fields)).toBe(true);
      expect(fields.length).toBe(3);
    });

    it('should return name field with correct configuration', () => {
      const fields = service.getFormFields();
      const nameField = fields.find((field) => field.key === 'name');

      expect(nameField).toBeDefined();
      expect(nameField?.label).toBe('Role Name');
      expect(nameField?.type).toBe('text');
      expect(nameField?.placeholder).toBe('Enter role name');
      expect(nameField?.helpText).toBe(
        'Role name must be between 2-40 characters with no special characters'
      );
    });

    it('should include required validator for name field', () => {
      const fields = service.getFormFields();
      const nameField = fields.find((field) => field.key === 'name');

      expect(nameField?.validators).toBeDefined();
      expect(nameField?.validators).toContain(Validators.required);
    });

    it('should include minLength validator for name field', () => {
      const fields = service.getFormFields();
      const nameField = fields.find((field) => field.key === 'name');

      expect(nameField?.validators).toBeDefined();
      expect(nameField?.validators?.length).toBe(4);
    });

    it('should include maxLength validator for name field', () => {
      const fields = service.getFormFields();
      const nameField = fields.find((field) => field.key === 'name');

      expect(nameField?.validators).toBeDefined();
      expect(nameField?.validators?.length).toBe(4);
    });

    it('should include noSpecialCharacters validator for name field', () => {
      const fields = service.getFormFields();
      const nameField = fields.find((field) => field.key === 'name');
      const validator = noSpecialCharactersValidator();

      expect(nameField?.validators).toBeDefined();
      expect(nameField?.validators?.length).toBe(4);
      // The validator function is included, we can't directly compare functions
      expect(nameField?.validators?.[3]).toBeDefined();
    });

    it('should return rolesId field with correct configuration', () => {
      const fields = service.getFormFields();
      const rolesField = fields.find((field) => field.key === 'rolesId');

      expect(rolesField).toBeDefined();
      expect(rolesField?.label).toBe('Inherited Roles');
      expect(rolesField?.type).toBe('multiselect');
      expect(rolesField?.placeholder).toBe('Select inherited roles');
      expect(rolesField?.helpText).toBe('Select other roles to inherit permissions from');
    });

    it('should return permissionsId field with correct configuration', () => {
      const fields = service.getFormFields();
      const permissionsField = fields.find((field) => field.key === 'permissionsId');

      expect(permissionsField).toBeDefined();
      expect(permissionsField?.label).toBe('Permissions');
      expect(permissionsField?.type).toBe('multiselect');
      expect(permissionsField?.placeholder).toBe('Select permissions');
      expect(permissionsField?.helpText).toBe('Select permissions for this role');
    });

    it('should include loadOptions for rolesId field', () => {
      const fields = service.getFormFields();
      const rolesField = fields.find((field) => field.key === 'rolesId');

      expect(rolesField?.loadOptions).toBeDefined();
      expect(typeof rolesField?.loadOptions).toBe('function');
    });

    it('should include loadOptions for permissionsId field', () => {
      const fields = service.getFormFields();
      const permissionsField = fields.find((field) => field.key === 'permissionsId');

      expect(permissionsField?.loadOptions).toBeDefined();
      expect(typeof permissionsField?.loadOptions).toBe('function');
    });
  });

  describe('Form field loadOptions', () => {
    describe('rolesId loadOptions', () => {
      it('should fetch roles and map to select options', async () => {
        const mockRoles = [mockRole1, mockRole2];
        mockUserApiService.getAllRoles.mockReturnValue(of(mockRoles));

        const fields = service.getFormFields();
        const rolesField = fields.find((field) => field.key === 'rolesId');

        const promise = new Promise<void>((resolve) => {
          rolesField?.loadOptions?.().subscribe((options) => {
            expect(mockUserApiService.getAllRoles).toHaveBeenCalled();
            expect(options.length).toBe(2);
            expect(options[0]).toEqual({ value: 'role-1', label: 'Admin' });
            expect(options[1]).toEqual({ value: 'role-2', label: 'User' });
            resolve();
          });
        });

        await promise;
      });

      it('should handle empty roles array', async () => {
        mockUserApiService.getAllRoles.mockReturnValue(of([]));

        const fields = service.getFormFields();
        const rolesField = fields.find((field) => field.key === 'rolesId');

        const promise = new Promise<void>((resolve) => {
          rolesField?.loadOptions?.().subscribe((options) => {
            expect(options).toEqual([]);
            resolve();
          });
        });

        await promise;
      });

      it('should map role ID as value and name as label', async () => {
        mockUserApiService.getAllRoles.mockReturnValue(of([mockRole3]));

        const fields = service.getFormFields();
        const rolesField = fields.find((field) => field.key === 'rolesId');

        const promise = new Promise<void>((resolve) => {
          rolesField?.loadOptions?.().subscribe((options) => {
            expect(options[0].value).toBe('role-3');
            expect(options[0].label).toBe('Super Admin');
            resolve();
          });
        });

        await promise;
      });
    });

    describe('permissionsId loadOptions', () => {
      it('should fetch permissions and map to select options', async () => {
        mockUserApiService.getAllPermissions.mockReturnValue(of(mockPermissions));

        const fields = service.getFormFields();
        const permissionsField = fields.find((field) => field.key === 'permissionsId');

        const promise = new Promise<void>((resolve) => {
          permissionsField?.loadOptions?.().subscribe((options) => {
            expect(mockUserApiService.getAllPermissions).toHaveBeenCalled();
            expect(options.length).toBe(2);
            expect(options[0]).toEqual({ value: 'create', label: 'create' });
            expect(options[1]).toEqual({ value: 'delete', label: 'delete' });
            resolve();
          });
        });

        await promise;
      });

      it('should handle empty permissions array', async () => {
        mockUserApiService.getAllPermissions.mockReturnValue(of([]));

        const fields = service.getFormFields();
        const permissionsField = fields.find((field) => field.key === 'permissionsId');

        const promise = new Promise<void>((resolve) => {
          permissionsField?.loadOptions?.().subscribe((options) => {
            expect(options).toEqual([]);
            resolve();
          });
        });

        await promise;
      });

      it('should map permission name as both value and label', async () => {
        const customPermission: PermissionDto = {
          name: 'custom_permission',
          description: 'Custom',
        };
        mockUserApiService.getAllPermissions.mockReturnValue(of([customPermission]));

        const fields = service.getFormFields();
        const permissionsField = fields.find((field) => field.key === 'permissionsId');

        const promise = new Promise<void>((resolve) => {
          permissionsField?.loadOptions?.().subscribe((options) => {
            expect(options[0].value).toBe('custom_permission');
            expect(options[0].label).toBe('custom_permission');
            resolve();
          });
        });

        await promise;
      });
    });
  });

  describe('Form field valueTransformer', () => {
    describe('rolesId valueTransformer', () => {
      it('should extract role IDs from RoleDto', () => {
        const fields = service.getFormFields();
        const rolesField = fields.find((field) => field.key === 'rolesId');

        const result = rolesField?.valueTransformer?.(mockRole2);

        expect(result).toEqual(['role-1']);
      });

      it('should return empty array when roles is empty', () => {
        const fields = service.getFormFields();
        const rolesField = fields.find((field) => field.key === 'rolesId');

        const result = rolesField?.valueTransformer?.(mockRole1);

        expect(result).toEqual([]);
      });

      it('should return empty array when roles is undefined', () => {
        const fields = service.getFormFields();
        const rolesField = fields.find((field) => field.key === 'rolesId');

        const roleWithoutRoles = { ...mockRole1, roles: undefined } as any;
        const result = rolesField?.valueTransformer?.(roleWithoutRoles);

        expect(result).toEqual([]);
      });

      it('should handle multiple inherited roles', () => {
        const fields = service.getFormFields();
        const rolesField = fields.find((field) => field.key === 'rolesId');

        const roleWithMultiple: RoleDto = {
          ...mockRole1,
          roles: [mockRole1, mockRole2, mockRole3],
        };

        const result = rolesField?.valueTransformer?.(roleWithMultiple);

        expect(result).toEqual(['role-1', 'role-2', 'role-3']);
      });
    });

    describe('permissionsId valueTransformer', () => {
      it('should extract permission names from RoleDto', () => {
        const fields = service.getFormFields();
        const permissionsField = fields.find((field) => field.key === 'permissionsId');

        const result = permissionsField?.valueTransformer?.(mockRole1);

        expect(result).toEqual(['read', 'write']);
      });

      it('should return empty array when permissions is empty', () => {
        const fields = service.getFormFields();
        const permissionsField = fields.find((field) => field.key === 'permissionsId');

        const result = permissionsField?.valueTransformer?.(mockRole3);

        expect(result).toEqual([]);
      });

      it('should return empty array when permissions is undefined', () => {
        const fields = service.getFormFields();
        const permissionsField = fields.find((field) => field.key === 'permissionsId');

        const roleWithoutPermissions = { ...mockRole1, permissions: undefined } as any;
        const result = permissionsField?.valueTransformer?.(roleWithoutPermissions);

        expect(result).toEqual([]);
      });

      it('should handle single permission', () => {
        const fields = service.getFormFields();
        const permissionsField = fields.find((field) => field.key === 'permissionsId');

        const result = permissionsField?.valueTransformer?.(mockRole2);

        expect(result).toEqual(['read']);
      });
    });
  });

  describe('Metadata methods', () => {
    it('should return correct route base path', () => {
      expect(service.getRouteBasePath()).toBe('/roles');
    });

    it('should return correct item type name', () => {
      expect(service.getItemTypeName()).toBe('role');
    });

    it('should return correct item type plural name', () => {
      expect(service.getItemTypePluralName()).toBe('roles');
    });

    it('should return role name as display name', () => {
      expect(service.getItemDisplayName(mockRole1)).toBe('Admin');
    });

    it('should return role name with spaces as display name', () => {
      expect(service.getItemDisplayName(mockRole3)).toBe('Super Admin');
    });
  });

  describe('Routing overrides', () => {
    describe('onEditItem', () => {
      it('should navigate to edit route with role ID', () => {
        service.onEditItem(mockRole1);

        expect(mockRouter.navigate).toHaveBeenCalledWith(['/roles', 'role-1']);
      });

      it('should navigate to correct route for different role', () => {
        service.onEditItem(mockRole2);

        expect(mockRouter.navigate).toHaveBeenCalledWith(['/roles', 'role-2']);
      });

      it('should not open modal when editing', () => {
        service.onEditItem(mockRole1);

        expect(service.showModal()).toBe(false);
      });
    });

    describe('onNewItem', () => {
      it('should set editingItem to null', () => {
        // Set an editing item first
        (service as any)._editingItem.set(mockRole1);

        service.onNewItem();

        expect(service.editingItem()).toBeNull();
      });

      it('should show modal', () => {
        service.onNewItem();

        expect(service.showModal()).toBe(true);
      });

      it('should not navigate when opening new item form', () => {
        service.onNewItem();

        expect(mockRouter.navigate).not.toHaveBeenCalled();
      });
    });

    describe('onAfterFormSave', () => {
      it('should navigate to base route after save', () => {
        // Trigger the lifecycle hook via the public method
        (service as any).onAfterFormSave();

        expect(mockRouter.navigate).toHaveBeenCalledWith(['/roles']);
      });
    });

    describe('onFormCancel', () => {
      it('should hide modal', () => {
        // Show modal first
        (service as any)._showModal.set(true);

        service.onFormCancel();

        expect(service.showModal()).toBe(false);
      });

      it('should clear editingItem', () => {
        // Set editing item first
        (service as any)._editingItem.set(mockRole1);

        service.onFormCancel();

        expect(service.editingItem()).toBeNull();
      });

      it('should navigate to base route', () => {
        service.onFormCancel();

        expect(mockRouter.navigate).toHaveBeenCalledWith(['/roles']);
      });
    });
  });

  describe('Integration with base service', () => {
    it('should load items and update state', async () => {
      mockUserApiService.getAllRoles.mockReturnValue(of([mockRole1, mockRole2]));

      service.loadItems();

      // Wait for async operation
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(service.items().length).toBe(2);
          expect(service.loading()).toBe(false);
          resolve();
        }, 10);
      });
    });

    it('should filter items based on search term', () => {
      // Set items directly for testing computed signal
      (service as any)._items.set([mockRole1, mockRole2, mockRole3]);

      // Search for "admin"
      (service as any)._searchTerm.set('admin');

      const filtered = service.filteredItems();
      expect(filtered.length).toBe(2); // Admin and Super Admin
      expect(filtered).toContain(mockRole1);
      expect(filtered).toContain(mockRole3);
    });

    it('should return all items when search term is empty', () => {
      (service as any)._items.set([mockRole1, mockRole2, mockRole3]);
      (service as any)._searchTerm.set('');

      const filtered = service.filteredItems();
      expect(filtered.length).toBe(3);
    });
  });

  describe('Error handling', () => {
    it('should handle API errors when loading items', async () => {
      const error = new Error('API Error');
      mockUserApiService.getAllRoles.mockReturnValue(throwError(() => error));

      const promise = new Promise<void>((resolve) => {
        service.loadAllItems().subscribe({
          error: (err) => {
            expect(err.message).toBe('API Error');
            resolve();
          },
        });
      });

      await promise;
    });

    it('should handle network errors when saving', async () => {
      const error = new Error('Network Error');
      mockUserApiService.saveRole.mockReturnValue(throwError(() => error));

      const promise = new Promise<void>((resolve) => {
        service.saveItem(mockSaveDto).subscribe({
          error: (err) => {
            expect(err.message).toBe('Network Error');
            resolve();
          },
        });
      });

      await promise;
    });

    it('should handle errors when deleting role', async () => {
      const error = new Error('Delete Error');
      mockUserApiService.deleteRole.mockReturnValue(throwError(() => error));

      const promise = new Promise<void>((resolve) => {
        service.deleteItem('role-1').subscribe({
          error: (err) => {
            expect(err.message).toBe('Delete Error');
            resolve();
          },
        });
      });

      await promise;
    });
  });
});
