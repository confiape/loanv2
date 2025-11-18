import { describe, it, expect, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Validators } from '@angular/forms';
import { RoleCrudService } from './role-crud.service';
import { UserApiService, RoleDto, SaveRoleDto, PermissionDto } from '@loan/app/shared/openapi';
import { noSpecialCharactersValidator } from '../validators/role.validators';

// Test data
const mockRole1: RoleDto = {
  id: 'role-1',
  name: 'Admin',
  roles: [],
  permissions: [{ name: 'read' }, { name: 'write' }],
};

const mockRole2: RoleDto = {
  id: 'role-2',
  name: 'User',
  roles: [mockRole1],
  permissions: [{ name: 'read' }],
};

const mockRole3: RoleDto = {
  id: 'role-3',
  name: 'Super Admin',
  roles: [],
  permissions: [],
};

const mockPermission1: PermissionDto = {
  name: 'create',
};

const mockPermission2: PermissionDto = {
  name: 'delete',
};

const mockPermissions: PermissionDto[] = [mockPermission1, mockPermission2];

const mockSaveDto: SaveRoleDto = {
  id: 'role-1',
  name: 'Updated Admin',
  rolesId: ['role-2'],
  permissionsId: ['create', 'delete'],
};

describe('RoleCrudService', () => {
  function setupTestBed() {
    const mockUserApiService = {
      getAllRoles: vi.fn(),
      saveRole: vi.fn(),
      deleteRole: vi.fn(),
      getAllPermissions: vi.fn(),
    };

    const mockRouter = {
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

    const service = TestBed.inject(RoleCrudService);

    return { service, mockUserApiService, mockRouter };
  }

  describe('Initialization', () => {
    it('should be created', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act & Assert
      expect(service).toBeTruthy();
    });

    it('should initialize with empty items', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act & Assert
      expect(service.items()).toEqual([]);
    });

    it('should initialize with loading false', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act & Assert
      expect(service.loading()).toBe(false);
    });

    it('should initialize with showModal false', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act & Assert
      expect(service.showModal()).toBe(false);
    });

    it('should initialize with null editingItem', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act & Assert
      expect(service.editingItem()).toBeNull();
    });
  });

  describe('fetchAllItems', () => {
    it('should call getAllRoles from UserApiService', async () => {
      // Arrange
      const { service, mockUserApiService } = setupTestBed();
      const mockRoles = [mockRole1, mockRole2];
      mockUserApiService.getAllRoles.mockReturnValue(of(mockRoles));

      // Act & Assert
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
      // Arrange
      const { service, mockUserApiService } = setupTestBed();
      const mockRoles = [mockRole1, mockRole2];
      mockUserApiService.getAllRoles.mockReturnValue(of(mockRoles));

      // Act & Assert
      const promise = new Promise<void>((resolve) => {
        service.loadAllItems().subscribe(() => {
          expect(service.items()).toEqual(mockRoles);
          resolve();
        });
      });

      await promise;
    });

    it('should set loading to false after successful fetch', async () => {
      // Arrange
      const { service, mockUserApiService } = setupTestBed();
      mockUserApiService.getAllRoles.mockReturnValue(of([mockRole1]));

      // Act & Assert
      const promise = new Promise<void>((resolve) => {
        service.loadAllItems().subscribe(() => {
          expect(service.loading()).toBe(false);
          resolve();
        });
      });

      await promise;
    });

    it('should handle empty array response', async () => {
      // Arrange
      const { service, mockUserApiService } = setupTestBed();
      mockUserApiService.getAllRoles.mockReturnValue(of([]));

      // Act & Assert
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
      // Arrange
      const { service, mockUserApiService } = setupTestBed();
      mockUserApiService.saveRole.mockReturnValue(of(mockRole1));

      // Act & Assert
      const promise = new Promise<void>((resolve) => {
        service.saveItem(mockSaveDto).subscribe(() => {
          expect(mockUserApiService.saveRole).toHaveBeenCalledWith(mockSaveDto);
          resolve();
        });
      });

      await promise;
    });

    it('should return saved role', async () => {
      // Arrange
      const { service, mockUserApiService } = setupTestBed();
      mockUserApiService.saveRole.mockReturnValue(of(mockRole1));

      // Act & Assert
      const promise = new Promise<void>((resolve) => {
        service.saveItem(mockSaveDto).subscribe((role) => {
          expect(role).toEqual(mockRole1);
          resolve();
        });
      });

      await promise;
    });

    it('should strip nested role data and send clean SaveRoleDto', async () => {
      // Arrange
      const { service, mockUserApiService } = setupTestBed();
      mockUserApiService.saveRole.mockReturnValue(of(mockRole1));

      const dtoWithNestedData: SaveRoleDto = {
        id: 'role-1',
        name: 'Test Role',
        rolesId: ['role-2', 'role-3'],
        permissionsId: ['read', 'write', 'delete'],
      };

      // Act & Assert
      const promise = new Promise<void>((resolve) => {
        service.saveItem(dtoWithNestedData).subscribe(() => {
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
      // Arrange
      const { service, mockUserApiService } = setupTestBed();
      mockUserApiService.saveRole.mockReturnValue(of(mockRole1));

      const newRoleDto: SaveRoleDto = {
        name: 'New Role',
        rolesId: [],
        permissionsId: ['read'],
      };

      // Act & Assert
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
      // Arrange
      const { service, mockUserApiService } = setupTestBed();
      const error = new Error('Save failed');
      mockUserApiService.saveRole.mockReturnValue(throwError(() => error));

      // Act & Assert
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
      // Arrange
      const { service, mockUserApiService } = setupTestBed();
      mockUserApiService.deleteRole.mockReturnValue(of(undefined));

      // Act & Assert
      const promise = new Promise<void>((resolve) => {
        service.deleteItem('role-1').subscribe(() => {
          expect(mockUserApiService.deleteRole).toHaveBeenCalledWith('role-1');
          resolve();
        });
      });

      await promise;
    });

    it('should handle delete errors', async () => {
      // Arrange
      const { service, mockUserApiService } = setupTestBed();
      const error = new Error('Delete failed');
      mockUserApiService.deleteRole.mockReturnValue(throwError(() => error));

      // Act & Assert
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
      // Arrange
      const { service } = setupTestBed();

      // Act & Assert
      const matches = (service as any).matchesSearch(mockRole1, 'admin');
      expect(matches).toBe(true);
    });

    it('should match by role name with exact case', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act & Assert
      const matches = (service as any).matchesSearch(mockRole1, 'Admin');
      expect(matches).toBe(true);
    });

    it('should match by role name with different case', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act & Assert
      const matches = (service as any).matchesSearch(mockRole1, 'ADMIN');
      expect(matches).toBe(true);
    });

    it('should match by role ID', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act & Assert
      const matches = (service as any).matchesSearch(mockRole1, 'role-1');
      expect(matches).toBe(true);
    });

    it('should match by partial role name', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act & Assert
      const matches = (service as any).matchesSearch(mockRole1, 'adm');
      expect(matches).toBe(true);
    });

    it('should not match when search term is not found', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act & Assert
      const matches = (service as any).matchesSearch(mockRole1, 'xyz');
      expect(matches).toBe(false);
    });

    it('should handle empty search term', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act & Assert
      const matches = (service as any).matchesSearch(mockRole1, '');
      expect(matches).toBe(true);
    });

    it('should match role with spaces in name', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act & Assert
      const matches = (service as any).matchesSearch(mockRole3, 'super');
      expect(matches).toBe(true);
    });

    it('should match role with spaces by full text', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act & Assert
      const matches = (service as any).matchesSearch(mockRole3, 'super admin');
      expect(matches).toBe(true);
    });
  });

  describe('getTableColumns', () => {
    it('should return array of table columns', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act
      const columns = service.getTableColumns();

      // Assert
      expect(Array.isArray(columns)).toBe(true);
      expect(columns.length).toBe(2);
    });

    it('should return name column with correct metadata', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act
      const columns = service.getTableColumns();
      const nameColumn = columns.find((col) => col.key === 'name');

      // Assert
      expect(nameColumn).toBeDefined();
      expect(nameColumn?.label).toBe('Name');
      expect(nameColumn?.sortable).toBe(true);
      expect(nameColumn?.align).toBe('left');
    });

    it('should return id column with correct metadata', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act
      const columns = service.getTableColumns();
      const idColumn = columns.find((col) => col.key === 'id');

      // Assert
      expect(idColumn).toBeDefined();
      expect(idColumn?.label).toBe('ID');
      expect(idColumn?.sortable).toBe(true);
      expect(idColumn?.align).toBe('left');
    });

    it('should return columns in correct order', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act
      const columns = service.getTableColumns();

      // Assert
      expect(columns[0].key).toBe('name');
      expect(columns[1].key).toBe('id');
    });
  });

  describe('getFormFields', () => {
    it('should return array of form fields', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act
      const fields = service.getFormFields();

      // Assert
      expect(Array.isArray(fields)).toBe(true);
      expect(fields.length).toBe(3);
    });

    it('should return name field with correct configuration', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act
      const fields = service.getFormFields();
      const nameField = fields.find((field) => field.key === 'name');

      // Assert
      expect(nameField).toBeDefined();
      expect(nameField?.label).toBe('Role Name');
      expect(nameField?.type).toBe('text');
      expect(nameField?.placeholder).toBe('Enter role name');
      expect(nameField?.helpText).toBe(
        'Role name must be between 2-40 characters with no special characters',
      );
    });

    it('should include required validator for name field', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act
      const fields = service.getFormFields();
      const nameField = fields.find((field) => field.key === 'name');

      // Assert
      expect(nameField?.validators).toBeDefined();
      expect(nameField?.validators).toContain(Validators.required);
    });

    it('should include minLength validator for name field', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act
      const fields = service.getFormFields();
      const nameField = fields.find((field) => field.key === 'name');

      // Assert
      expect(nameField?.validators).toBeDefined();
      expect(nameField?.validators?.length).toBe(4);
    });

    it('should include maxLength validator for name field', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act
      const fields = service.getFormFields();
      const nameField = fields.find((field) => field.key === 'name');

      // Assert
      expect(nameField?.validators).toBeDefined();
      expect(nameField?.validators?.length).toBe(4);
    });

    it('should include noSpecialCharacters validator for name field', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act
      const fields = service.getFormFields();
      const nameField = fields.find((field) => field.key === 'name');
      const validator = noSpecialCharactersValidator();

      // Assert
      expect(nameField?.validators).toBeDefined();
      expect(nameField?.validators?.length).toBe(4);
      expect(nameField?.validators?.[3]).toBeDefined();
    });

    it('should return rolesId field with correct configuration', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act
      const fields = service.getFormFields();
      const rolesField = fields.find((field) => field.key === 'rolesId');

      // Assert
      expect(rolesField).toBeDefined();
      expect(rolesField?.label).toBe('Inherited Roles');
      expect(rolesField?.type).toBe('multiselect');
      expect(rolesField?.placeholder).toBe('Select inherited roles');
      expect(rolesField?.helpText).toBe('Select other roles to inherit permissions from');
    });

    it('should return permissionsId field with correct configuration', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act
      const fields = service.getFormFields();
      const permissionsField = fields.find((field) => field.key === 'permissionsId');

      // Assert
      expect(permissionsField).toBeDefined();
      expect(permissionsField?.label).toBe('Permissions');
      expect(permissionsField?.type).toBe('multiselect');
      expect(permissionsField?.placeholder).toBe('Select permissions');
      expect(permissionsField?.helpText).toBe('Select permissions for this role');
    });

    it('should include loadOptions for rolesId field', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act
      const fields = service.getFormFields();
      const rolesField = fields.find((field) => field.key === 'rolesId');

      // Assert
      expect(rolesField?.loadOptions).toBeDefined();
      expect(typeof rolesField?.loadOptions).toBe('function');
    });

    it('should include loadOptions for permissionsId field', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act
      const fields = service.getFormFields();
      const permissionsField = fields.find((field) => field.key === 'permissionsId');

      // Assert
      expect(permissionsField?.loadOptions).toBeDefined();
      expect(typeof permissionsField?.loadOptions).toBe('function');
    });
  });

  describe('Form field loadOptions', () => {
    describe('rolesId loadOptions', () => {
      it('should fetch roles and map to select options', async () => {
        // Arrange
        const { service, mockUserApiService } = setupTestBed();
        const mockRoles = [mockRole1, mockRole2];
        mockUserApiService.getAllRoles.mockReturnValue(of(mockRoles));

        const fields = service.getFormFields();
        const rolesField = fields.find((field) => field.key === 'rolesId');

        // Act & Assert
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
        // Arrange
        const { service, mockUserApiService } = setupTestBed();
        mockUserApiService.getAllRoles.mockReturnValue(of([]));

        const fields = service.getFormFields();
        const rolesField = fields.find((field) => field.key === 'rolesId');

        // Act & Assert
        const promise = new Promise<void>((resolve) => {
          rolesField?.loadOptions?.().subscribe((options) => {
            expect(options).toEqual([]);
            resolve();
          });
        });

        await promise;
      });

      it('should map role ID as value and name as label', async () => {
        // Arrange
        const { service, mockUserApiService } = setupTestBed();
        mockUserApiService.getAllRoles.mockReturnValue(of([mockRole3]));

        const fields = service.getFormFields();
        const rolesField = fields.find((field) => field.key === 'rolesId');

        // Act & Assert
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
        // Arrange
        const { service, mockUserApiService } = setupTestBed();
        mockUserApiService.getAllPermissions.mockReturnValue(of(mockPermissions));

        const fields = service.getFormFields();
        const permissionsField = fields.find((field) => field.key === 'permissionsId');

        // Act & Assert
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
        // Arrange
        const { service, mockUserApiService } = setupTestBed();
        mockUserApiService.getAllPermissions.mockReturnValue(of([]));

        const fields = service.getFormFields();
        const permissionsField = fields.find((field) => field.key === 'permissionsId');

        // Act & Assert
        const promise = new Promise<void>((resolve) => {
          permissionsField?.loadOptions?.().subscribe((options) => {
            expect(options).toEqual([]);
            resolve();
          });
        });

        await promise;
      });

      it('should map permission name as both value and label', async () => {
        // Arrange
        const { service, mockUserApiService } = setupTestBed();
        const customPermission: PermissionDto = {
          name: 'custom_permission',
        };
        mockUserApiService.getAllPermissions.mockReturnValue(of([customPermission]));

        const fields = service.getFormFields();
        const permissionsField = fields.find((field) => field.key === 'permissionsId');

        // Act & Assert
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
        // Arrange
        const { service } = setupTestBed();
        const fields = service.getFormFields();
        const rolesField = fields.find((field) => field.key === 'rolesId');

        // Act
        const result = rolesField?.valueTransformer?.(mockRole2);

        // Assert
        expect(result).toEqual(['role-1']);
      });

      it('should return empty array when roles is empty', () => {
        // Arrange
        const { service } = setupTestBed();
        const fields = service.getFormFields();
        const rolesField = fields.find((field) => field.key === 'rolesId');

        // Act
        const result = rolesField?.valueTransformer?.(mockRole1);

        // Assert
        expect(result).toEqual([]);
      });

      it('should return empty array when roles is undefined', () => {
        // Arrange
        const { service } = setupTestBed();
        const fields = service.getFormFields();
        const rolesField = fields.find((field) => field.key === 'rolesId');
        const roleWithoutRoles = { ...mockRole1, roles: undefined } as any;

        // Act
        const result = rolesField?.valueTransformer?.(roleWithoutRoles);

        // Assert
        expect(result).toEqual([]);
      });

      it('should handle multiple inherited roles', () => {
        // Arrange
        const { service } = setupTestBed();
        const fields = service.getFormFields();
        const rolesField = fields.find((field) => field.key === 'rolesId');
        const roleWithMultiple: RoleDto = {
          ...mockRole1,
          roles: [mockRole1, mockRole2, mockRole3],
        };

        // Act
        const result = rolesField?.valueTransformer?.(roleWithMultiple);

        // Assert
        expect(result).toEqual(['role-1', 'role-2', 'role-3']);
      });
    });

    describe('permissionsId valueTransformer', () => {
      it('should extract permission names from RoleDto', () => {
        // Arrange
        const { service } = setupTestBed();
        const fields = service.getFormFields();
        const permissionsField = fields.find((field) => field.key === 'permissionsId');

        // Act
        const result = permissionsField?.valueTransformer?.(mockRole1);

        // Assert
        expect(result).toEqual(['read', 'write']);
      });

      it('should return empty array when permissions is empty', () => {
        // Arrange
        const { service } = setupTestBed();
        const fields = service.getFormFields();
        const permissionsField = fields.find((field) => field.key === 'permissionsId');

        // Act
        const result = permissionsField?.valueTransformer?.(mockRole3);

        // Assert
        expect(result).toEqual([]);
      });

      it('should return empty array when permissions is undefined', () => {
        // Arrange
        const { service } = setupTestBed();
        const fields = service.getFormFields();
        const permissionsField = fields.find((field) => field.key === 'permissionsId');
        const roleWithoutPermissions = { ...mockRole1, permissions: undefined } as any;

        // Act
        const result = permissionsField?.valueTransformer?.(roleWithoutPermissions);

        // Assert
        expect(result).toEqual([]);
      });

      it('should handle single permission', () => {
        // Arrange
        const { service } = setupTestBed();
        const fields = service.getFormFields();
        const permissionsField = fields.find((field) => field.key === 'permissionsId');

        // Act
        const result = permissionsField?.valueTransformer?.(mockRole2);

        // Assert
        expect(result).toEqual(['read']);
      });
    });
  });

  describe('Metadata methods', () => {
    it('should return correct route base path', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act & Assert
      expect(service.getRouteBasePath()).toBe('/roles');
    });

    it('should return correct item type name', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act & Assert
      expect(service.getItemTypeName()).toBe('role');
    });

    it('should return correct item type plural name', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act & Assert
      expect(service.getItemTypePluralName()).toBe('roles');
    });

    it('should return role name as display name', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act & Assert
      expect(service.getItemDisplayName(mockRole1)).toBe('Admin');
    });

    it('should return role name with spaces as display name', () => {
      // Arrange
      const { service } = setupTestBed();

      // Act & Assert
      expect(service.getItemDisplayName(mockRole3)).toBe('Super Admin');
    });
  });

  describe('Routing overrides', () => {
    describe('onEditItem', () => {
      it('should navigate to edit route with role ID', () => {
        // Arrange
        const { service, mockRouter } = setupTestBed();

        // Act
        service.onEditItem(mockRole1);

        // Assert
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/roles', 'role-1']);
      });

      it('should navigate to correct route for different role', () => {
        // Arrange
        const { service, mockRouter } = setupTestBed();

        // Act
        service.onEditItem(mockRole2);

        // Assert
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/roles', 'role-2']);
      });

      it('should not open modal when editing', () => {
        // Arrange
        const { service } = setupTestBed();

        // Act
        service.onEditItem(mockRole1);

        // Assert
        expect(service.showModal()).toBe(false);
      });
    });

    describe('onNewItem', () => {
      it('should set editingItem to null', () => {
        // Arrange
        const { service } = setupTestBed();
        (service as any)._editingItem.set(mockRole1);

        // Act
        service.onNewItem();

        // Assert
        expect(service.editingItem()).toBeNull();
      });

      it('should show modal', () => {
        // Arrange
        const { service } = setupTestBed();

        // Act
        service.onNewItem();

        // Assert
        expect(service.showModal()).toBe(true);
      });

      it('should not navigate when opening new item form', () => {
        // Arrange
        const { service, mockRouter } = setupTestBed();

        // Act
        service.onNewItem();

        // Assert
        expect(mockRouter.navigate).not.toHaveBeenCalled();
      });
    });

    describe('onAfterFormSave', () => {
      it('should navigate to base route after save', () => {
        // Arrange
        const { service, mockRouter } = setupTestBed();

        // Act
        (service as any).onAfterFormSave();

        // Assert
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/roles']);
      });
    });

    describe('onFormCancel', () => {
      it('should hide modal', () => {
        // Arrange
        const { service } = setupTestBed();
        (service as any)._showModal.set(true);

        // Act
        service.onFormCancel();

        // Assert
        expect(service.showModal()).toBe(false);
      });

      it('should clear editingItem', () => {
        // Arrange
        const { service } = setupTestBed();
        (service as any)._editingItem.set(mockRole1);

        // Act
        service.onFormCancel();

        // Assert
        expect(service.editingItem()).toBeNull();
      });

      it('should navigate to base route', () => {
        // Arrange
        const { service, mockRouter } = setupTestBed();

        // Act
        service.onFormCancel();

        // Assert
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/roles']);
      });
    });
  });

  describe('Integration with base service', () => {
    it('should load items and update state', async () => {
      // Arrange
      const { service, mockUserApiService } = setupTestBed();
      mockUserApiService.getAllRoles.mockReturnValue(of([mockRole1, mockRole2]));

      // Act
      service.loadItems();

      // Assert
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(service.items().length).toBe(2);
          expect(service.loading()).toBe(false);
          resolve();
        }, 10);
      });
    });

    it('should filter items based on search term', () => {
      // Arrange
      const { service } = setupTestBed();
      (service as any)._items.set([mockRole1, mockRole2, mockRole3]);
      (service as any)._searchTerm.set('admin');

      // Act
      const filtered = service.filteredItems();

      // Assert
      expect(filtered.length).toBe(2);
      expect(filtered).toContain(mockRole1);
      expect(filtered).toContain(mockRole3);
    });

    it('should return all items when search term is empty', () => {
      // Arrange
      const { service } = setupTestBed();
      (service as any)._items.set([mockRole1, mockRole2, mockRole3]);
      (service as any)._searchTerm.set('');

      // Act
      const filtered = service.filteredItems();

      // Assert
      expect(filtered.length).toBe(3);
    });
  });

  describe('Error handling', () => {
    it('should handle API errors when loading items', async () => {
      // Arrange
      const { service, mockUserApiService } = setupTestBed();
      const error = new Error('API Error');
      mockUserApiService.getAllRoles.mockReturnValue(throwError(() => error));

      // Act & Assert
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
      // Arrange
      const { service, mockUserApiService } = setupTestBed();
      const error = new Error('Network Error');
      mockUserApiService.saveRole.mockReturnValue(throwError(() => error));

      // Act & Assert
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
      // Arrange
      const { service, mockUserApiService } = setupTestBed();
      const error = new Error('Delete Error');
      mockUserApiService.deleteRole.mockReturnValue(throwError(() => error));

      // Act & Assert
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
