import { describe, it, expect, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Validators } from '@angular/forms';
import { UserCrudService } from './user-crud.service';
import {
  UserApiService,
  UserDto,
  SaveUserDto,
  PersonDto,
  UserToRegister,
  PermissionDto,
  RoleDto,
  CompanyDto,
} from '@loan/app/shared/openapi';
import { CompanyApiService } from '@loan/app/shared/openapi/api/company.service';

// Test data
const mockPerson1: PersonDto = {
  name: 'John Doe',
  dni: '12345678',
  phoneNumber: '+1234567890',
  birthday: '1990-01-01',
  address: '123 Main St',
  notes: 'Admin user',
};

const mockPerson2: PersonDto = {
  name: 'Jane Smith',
  dni: '87654321',
  phoneNumber: '+0987654321',
  birthday: '1992-05-15',
  address: '456 Oak Ave',
  notes: 'Regular user',
};

const mockRole1: RoleDto = {
  id: 'role-1',
  name: 'Admin',
  roles: [],
  permissions: [{ name: 'read' }, { name: 'write' }],
};

const mockRole2: RoleDto = {
  id: 'role-2',
  name: 'User',
  roles: [],
  permissions: [{ name: 'read' }],
};

const mockPermission1: PermissionDto = {
  name: 'create',
};

const mockPermission2: PermissionDto = {
  name: 'delete',
};

const mockCompany1: CompanyDto = {
  id: 'company-1',
  name: 'Acme Inc',
};

const mockCompany2: CompanyDto = {
  id: 'company-2',
  name: 'Tech Corp',
};

const mockUser1: UserDto = {
  id: 'user-1',
  email: 'john@example.com',
  avatar: null,
  background: null,
  isActive: true,
  person: mockPerson1,
  roles: [mockRole1],
  permissions: [{ name: 'read' }, { name: 'write' }],
  companies: [mockCompany1],
};

const mockUser2: UserDto = {
  id: 'user-2',
  email: 'jane@example.com',
  avatar: null,
  background: null,
  isActive: true,
  person: mockPerson2,
  roles: [mockRole2],
  permissions: [{ name: 'read' }],
  companies: [mockCompany2],
};

const mockSaveDto: SaveUserDto = {
  user: {
    id: 'user-1',
    email: 'john@example.com',
    isActive: true,
    password: 'password123',
    picture: null,
  },
  createPersonDto: {
    name: 'John Doe',
    dni: '12345678',
    phoneNumber: '+1234567890',
    birthday: '1990-01-01',
    address: '123 Main St',
    notes: 'Admin user',
  },
  rolesId: ['role-1'],
  permissionsId: ['read', 'write'],
  companyIds: ['company-1'],
};

describe('UserCrudService', () => {
  function setupTestBed() {
    const mockUserApiService = {
      getAllUsers: vi.fn(),
      saveUser: vi.fn(),
      deleteUser: vi.fn(),
      getAllRoles: vi.fn(),
      getAllPermissions: vi.fn(),
    };

    const mockCompanyApiService = {
      getAllCompanies: vi.fn(),
    };

    const mockRouter = {
      navigate: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        UserCrudService,
        { provide: UserApiService, useValue: mockUserApiService },
        { provide: CompanyApiService, useValue: mockCompanyApiService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    const service = TestBed.inject(UserCrudService);

    return { service, mockUserApiService, mockCompanyApiService, mockRouter };
  }

  describe('Initialization', () => {
    it('should be created', () => {
      const { service } = setupTestBed();
      expect(service).toBeTruthy();
    });

    it('should initialize with empty items', () => {
      const { service } = setupTestBed();
      expect(service.items()).toEqual([]);
    });

    it('should initialize with loading false', () => {
      const { service } = setupTestBed();
      expect(service.loading()).toBe(false);
    });

    it('should initialize with showModal false', () => {
      const { service } = setupTestBed();
      expect(service.showModal()).toBe(false);
    });

    it('should initialize with null editingItem', () => {
      const { service } = setupTestBed();
      expect(service.editingItem()).toBeNull();
    });
  });

  describe('fetchAllItems', () => {
    it('should call getAllUsers from UserApiService', async () => {
      const { service, mockUserApiService } = setupTestBed();
      const mockUsers = [mockUser1, mockUser2];
      mockUserApiService.getAllUsers.mockReturnValue(of(mockUsers));

      const promise = new Promise<void>((resolve) => {
        service.loadAllItems().subscribe((users) => {
          expect(mockUserApiService.getAllUsers).toHaveBeenCalled();
          expect(users).toEqual(mockUsers);
          resolve();
        });
      });

      await promise;
    });

    it('should update items signal after fetching', async () => {
      const { service, mockUserApiService } = setupTestBed();
      const mockUsers = [mockUser1];
      mockUserApiService.getAllUsers.mockReturnValue(of(mockUsers));

      const promise = new Promise<void>((resolve) => {
        service.loadAllItems().subscribe(() => {
          expect(service.items()).toEqual(mockUsers);
          resolve();
        });
      });

      await promise;
    });

    it('should handle empty array response', async () => {
      const { service, mockUserApiService } = setupTestBed();
      mockUserApiService.getAllUsers.mockReturnValue(of([]));

      const promise = new Promise<void>((resolve) => {
        service.loadAllItems().subscribe((users) => {
          expect(users).toEqual([]);
          expect(service.items()).toEqual([]);
          resolve();
        });
      });

      await promise;
    });
  });

  describe('performSave', () => {
    it('should call saveUser from UserApiService', async () => {
      const { service, mockUserApiService } = setupTestBed();
      mockUserApiService.saveUser.mockReturnValue(of(mockUser1));

      const promise = new Promise<void>((resolve) => {
        service.saveItem(mockSaveDto).subscribe(() => {
          expect(mockUserApiService.saveUser).toHaveBeenCalled();
          resolve();
        });
      });

      await promise;
    });

    it('should return saved user', async () => {
      const { service, mockUserApiService } = setupTestBed();
      mockUserApiService.saveUser.mockReturnValue(of(mockUser1));

      const promise = new Promise<void>((resolve) => {
        service.saveItem(mockSaveDto).subscribe((user) => {
          expect(user).toEqual(mockUser1);
          resolve();
        });
      });

      await promise;
    });

    it('should clean SaveUserDto structure before sending', async () => {
      const { service, mockUserApiService } = setupTestBed();
      mockUserApiService.saveUser.mockReturnValue(of(mockUser1));

      const promise = new Promise<void>((resolve) => {
        service.saveItem(mockSaveDto).subscribe(() => {
          const callArgs = mockUserApiService.saveUser.mock.calls[0][0];
          expect(callArgs.user).toBeDefined();
          expect(callArgs.createPersonDto).toBeDefined();
          expect(callArgs.rolesId).toEqual(expect.any(Array));
          expect(callArgs.permissionsId).toEqual(expect.any(Array));
          expect(callArgs.companyIds).toEqual(expect.any(Array));
          resolve();
        });
      });

      await promise;
    });

    it('should handle null id in SaveUserDto', async () => {
      const { service, mockUserApiService } = setupTestBed();
      mockUserApiService.saveUser.mockReturnValue(of(mockUser1));

      const newUserDto: SaveUserDto = {
        user: {
          email: 'new@example.com',
          isActive: true,
          password: 'password123',
        },
        createPersonDto: mockPerson1,
        rolesId: [],
        permissionsId: [],
        companyIds: [],
      };

      const promise = new Promise<void>((resolve) => {
        service.saveItem(newUserDto).subscribe(() => {
          const callArgs = mockUserApiService.saveUser.mock.calls[0][0];
          expect(callArgs.user.id).toBeNull();
          resolve();
        });
      });

      await promise;
    });

    it('should handle save errors', async () => {
      const { service, mockUserApiService } = setupTestBed();
      const error = new Error('Save failed');
      mockUserApiService.saveUser.mockReturnValue(throwError(() => error));

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
    it('should call deleteUser from UserApiService', async () => {
      const { service, mockUserApiService } = setupTestBed();
      mockUserApiService.deleteUser.mockReturnValue(of(undefined));

      const promise = new Promise<void>((resolve) => {
        service.deleteItem('user-1').subscribe(() => {
          expect(mockUserApiService.deleteUser).toHaveBeenCalledWith('user-1');
          resolve();
        });
      });

      await promise;
    });

    it('should handle delete errors', async () => {
      const { service, mockUserApiService } = setupTestBed();
      const error = new Error('Delete failed');
      mockUserApiService.deleteUser.mockReturnValue(throwError(() => error));

      const promise = new Promise<void>((resolve) => {
        service.deleteItem('user-1').subscribe({
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
    it('should match by email', () => {
      const { service } = setupTestBed();
      const matches = (service as any).matchesSearch(mockUser1, 'john@example.com');
      expect(matches).toBe(true);
    });

    it('should match by email (case insensitive)', () => {
      const { service } = setupTestBed();
      const matches = (service as any).matchesSearch(mockUser1, 'JOHN@EXAMPLE.COM');
      expect(matches).toBe(true);
    });

    it('should match by person name', () => {
      const { service } = setupTestBed();
      const matches = (service as any).matchesSearch(mockUser1, 'John Doe');
      expect(matches).toBe(true);
    });

    it('should match by person name partial', () => {
      const { service } = setupTestBed();
      const matches = (service as any).matchesSearch(mockUser1, 'John');
      expect(matches).toBe(true);
    });

    it('should match by DNI', () => {
      const { service } = setupTestBed();
      const matches = (service as any).matchesSearch(mockUser1, '12345678');
      expect(matches).toBe(true);
    });

    it('should match by user ID', () => {
      const { service } = setupTestBed();
      const matches = (service as any).matchesSearch(mockUser1, 'user-1');
      expect(matches).toBe(true);
    });

    it('should not match when search term is not found', () => {
      const { service } = setupTestBed();
      const matches = (service as any).matchesSearch(mockUser1, 'xyz');
      expect(matches).toBe(false);
    });

    it('should handle empty search term', () => {
      const { service } = setupTestBed();
      const matches = (service as any).matchesSearch(mockUser1, '');
      expect(matches).toBe(true);
    });
  });

  describe('getTableColumns', () => {
    it('should return array of table columns', () => {
      const { service } = setupTestBed();
      const columns = service.getTableColumns();
      expect(Array.isArray(columns)).toBe(true);
      expect(columns.length).toBeGreaterThan(0);
    });

    it('should include person name column', () => {
      const { service } = setupTestBed();
      const columns = service.getTableColumns();
      const nameColumn = columns.find((col) => col.key === 'person.name');
      expect(nameColumn).toBeDefined();
      expect(nameColumn?.label).toBe('Name');
    });

    it('should include email column', () => {
      const { service } = setupTestBed();
      const columns = service.getTableColumns();
      const emailColumn = columns.find((col) => col.key === 'email');
      expect(emailColumn).toBeDefined();
      expect(emailColumn?.label).toBe('Email');
    });

    it('should include isActive column', () => {
      const { service } = setupTestBed();
      const columns = service.getTableColumns();
      const activeColumn = columns.find((col) => col.key === 'isActive');
      expect(activeColumn).toBeDefined();
      expect(activeColumn?.label).toBe('Active');
    });
  });

  describe('getFormFields', () => {
    it('should return array of form fields', () => {
      const { service } = setupTestBed();
      const fields = service.getFormFields();
      expect(Array.isArray(fields)).toBe(true);
      expect(fields.length).toBeGreaterThan(0);
    });

    it('should include email field', () => {
      const { service } = setupTestBed();
      const fields = service.getFormFields();
      const emailField = fields.find((field) => field.key === 'email');
      expect(emailField).toBeDefined();
      expect(emailField?.label).toBe('Email');
      expect(emailField?.type).toBe('text');
    });

    it('should include password field', () => {
      const { service } = setupTestBed();
      const fields = service.getFormFields();
      const passwordField = fields.find((field) => field.key === 'password');
      expect(passwordField).toBeDefined();
      expect(passwordField?.type).toBe('text');
    });

    it('should include isActive checkbox field', () => {
      const { service } = setupTestBed();
      const fields = service.getFormFields();
      const activeField = fields.find((field) => field.key === 'isActive');
      expect(activeField).toBeDefined();
      expect(activeField?.type).toBe('checkbox');
    });

    it('should include personName field', () => {
      const { service } = setupTestBed();
      const fields = service.getFormFields();
      const nameField = fields.find((field) => field.key === 'personName');
      expect(nameField).toBeDefined();
      expect(nameField?.label).toBe('Full Name');
      expect(nameField?.validators).toContain(Validators.required);
    });

    it('should include personDni field', () => {
      const { service } = setupTestBed();
      const fields = service.getFormFields();
      const dniField = fields.find((field) => field.key === 'personDni');
      expect(dniField).toBeDefined();
      expect(dniField?.label).toBe('DNI');
    });

    it('should include personPhoneNumber field', () => {
      const { service } = setupTestBed();
      const fields = service.getFormFields();
      const phoneField = fields.find((field) => field.key === 'personPhoneNumber');
      expect(phoneField).toBeDefined();
      expect(phoneField?.label).toBe('Phone Number');
    });

    it('should include rolesId multiselect field', () => {
      const { service } = setupTestBed();
      const fields = service.getFormFields();
      const rolesField = fields.find((field) => field.key === 'rolesId');
      expect(rolesField).toBeDefined();
      expect(rolesField?.type).toBe('multiselect');
      expect(rolesField?.loadOptions).toBeDefined();
    });

    it('should include permissionsId multiselect field', () => {
      const { service } = setupTestBed();
      const fields = service.getFormFields();
      const permField = fields.find((field) => field.key === 'permissionsId');
      expect(permField).toBeDefined();
      expect(permField?.type).toBe('multiselect');
      expect(permField?.loadOptions).toBeDefined();
    });

    it('should include companyIds multiselect field', () => {
      const { service } = setupTestBed();
      const fields = service.getFormFields();
      const companyField = fields.find((field) => field.key === 'companyIds');
      expect(companyField).toBeDefined();
      expect(companyField?.type).toBe('multiselect');
    });
  });

  describe('Metadata methods', () => {
    it('should return correct route base path', () => {
      const { service } = setupTestBed();
      expect(service.getRouteBasePath()).toBe('/users');
    });

    it('should return correct item type name', () => {
      const { service } = setupTestBed();
      expect(service.getItemTypeName()).toBe('user');
    });

    it('should return correct item type plural name', () => {
      const { service } = setupTestBed();
      expect(service.getItemTypePluralName()).toBe('users');
    });

    it('should return person name as display name', () => {
      const { service } = setupTestBed();
      expect(service.getItemDisplayName(mockUser1)).toBe('John Doe');
    });

    it('should return email as display name when person name is missing', () => {
      const { service } = setupTestBed();
      const userWithoutName: UserDto = {
        ...mockUser1,
        person: { ...mockUser1.person, name: '' },
      };
      expect(service.getItemDisplayName(userWithoutName)).toBe('john@example.com');
    });

    it('should return ID as display name when both name and email are missing', () => {
      const { service } = setupTestBed();
      const userWithoutNameOrEmail: UserDto = {
        ...mockUser1,
        email: '',
        person: { ...mockUser1.person, name: '' },
      };
      expect(service.getItemDisplayName(userWithoutNameOrEmail)).toBe('user-1');
    });
  });

  describe('Routing overrides', () => {
    it('should navigate to edit route with user ID on edit', () => {
      const { service, mockRouter } = setupTestBed();
      service.onEditItem(mockUser1);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/users', 'user-1']);
    });

    it('should set editingItem to null on new item', () => {
      const { service } = setupTestBed();
      (service as any)._editingItem.set(mockUser1);
      service.onNewItem();
      expect(service.editingItem()).toBeNull();
    });

    it('should show modal on new item', () => {
      const { service } = setupTestBed();
      service.onNewItem();
      expect(service.showModal()).toBe(true);
    });

    it('should navigate to base route after form save', () => {
      const { service, mockRouter } = setupTestBed();
      (service as any).onAfterFormSave();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/users']);
    });

    it('should hide modal on form cancel', () => {
      const { service } = setupTestBed();
      (service as any)._showModal.set(true);
      service.onFormCancel();
      expect(service.showModal()).toBe(false);
    });

    it('should clear editingItem on form cancel', () => {
      const { service } = setupTestBed();
      (service as any)._editingItem.set(mockUser1);
      service.onFormCancel();
      expect(service.editingItem()).toBeNull();
    });

    it('should navigate to base route on form cancel', () => {
      const { service, mockRouter } = setupTestBed();
      service.onFormCancel();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/users']);
    });
  });

  describe('transformItemToFormData', () => {
    it('should flatten nested user object', () => {
      const { service } = setupTestBed();
      const formData = service.transformItemToFormData(mockUser1);

      expect(formData['email']).toBe('john@example.com');
      expect(formData['isActive']).toBe(true);
      expect(formData['personName']).toBe('John Doe');
      expect(formData['personDni']).toBe('12345678');
      expect(formData['personPhoneNumber']).toBe('+1234567890');
    });

    it('should extract role IDs', () => {
      const { service } = setupTestBed();
      const formData = service.transformItemToFormData(mockUser1);
      expect(formData['rolesId']).toEqual(['role-1']);
    });

    it('should extract permission names', () => {
      const { service } = setupTestBed();
      const formData = service.transformItemToFormData(mockUser1);
      expect(formData['permissionsId']).toEqual(['read', 'write']);
    });

    it('should extract company IDs', () => {
      const { service } = setupTestBed();
      const formData = service.transformItemToFormData(mockUser1);
      expect(formData['companyIds']).toEqual(['company-1']);
    });

    it('should handle optional fields', () => {
      const { service } = setupTestBed();
      const userWithoutOptionalFields: UserDto = {
        ...mockUser1,
        person: {
          ...mockUser1.person,
          birthday: null,
          address: null,
          notes: null,
        },
      };
      const formData = service.transformItemToFormData(userWithoutOptionalFields);
      expect(formData['personBirthday']).toBeNull();
      expect(formData['personAddress']).toBeNull();
      expect(formData['personNotes']).toBeNull();
    });
  });

  describe('transformFormDataToItem', () => {
    it('should reconstruct SaveUserDto from form data', () => {
      const { service } = setupTestBed();
      const formData = service.transformItemToFormData(mockUser1);
      const savedDto = service.transformFormDataToItem(formData as Record<string, unknown>);

      expect(savedDto.user.email).toBe('john@example.com');
      expect(savedDto.user.isActive).toBe(true);
      expect(savedDto.createPersonDto.name).toBe('John Doe');
      expect(savedDto.createPersonDto.dni).toBe('12345678');
    });

    it('should handle nested user object', () => {
      const { service } = setupTestBed();
      const formData = {
        email: 'test@example.com',
        isActive: true,
        personName: 'Test User',
        personDni: '999999',
        personPhoneNumber: '1234567',
        personBirthday: '2000-01-01',
        personAddress: 'Test Address',
        personNotes: 'Test Notes',
        rolesId: ['role-1', 'role-2'],
        permissionsId: ['read'],
        companyIds: ['company-1'],
      };

      const savedDto = service.transformFormDataToItem(formData);

      expect(savedDto.user.email).toBe('test@example.com');
      expect(savedDto.createPersonDto.name).toBe('Test User');
      expect(savedDto.rolesId).toEqual(['role-1', 'role-2']);
    });

    it('should handle missing optional fields', () => {
      const { service } = setupTestBed();
      const formData = {
        email: 'test@example.com',
        isActive: false,
        personName: 'Test User',
        personDni: '999999',
        personPhoneNumber: '1234567',
      };

      const savedDto = service.transformFormDataToItem(formData);

      expect(savedDto.createPersonDto.birthday).toBeNull();
      expect(savedDto.createPersonDto.address).toBeNull();
      expect(savedDto.createPersonDto.notes).toBeNull();
    });

    it('should handle empty array fields', () => {
      const { service } = setupTestBed();
      const formData = {
        email: 'test@example.com',
        isActive: true,
        personName: 'Test User',
        personDni: '999999',
        personPhoneNumber: '1234567',
        rolesId: [],
        permissionsId: [],
        companyIds: [],
      };

      const savedDto = service.transformFormDataToItem(formData);

      expect(savedDto.rolesId).toEqual([]);
      expect(savedDto.permissionsId).toEqual([]);
      expect(savedDto.companyIds).toEqual([]);
    });
  });
});
