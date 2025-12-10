import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { Validators } from '@angular/forms';
import { BaseCrudService } from '@loan/app/core/services/base-crud.service';
import {
  TableColumnMetadata,
  FormFieldMetadata,
  DisplayFieldMetadata,
} from '@loan/app/core/models/form-metadata';
import { UserDto, SaveUserDto, UserApiService } from '@loan/app/shared/openapi';
import { CommonDataCacheService } from '@loan/app/core/services/cache/common-data-cache.service';
import { emailValidator } from '../validators/user.validators';
import { formatBoolean, formatList, formatDate } from '@loan/app/shared/utils/formatters';

/**
 * CRUD service for User entities
 * Provides all CRUD operations and form/table configurations
 */
@Injectable({
  providedIn: 'root',
})
export class UserCrudService extends BaseCrudService<UserDto, SaveUserDto> {
  private apiService = inject(UserApiService);
  private commonDataCache = inject(CommonDataCacheService);
  private router = inject(Router);

  // ========== ABSTRACT METHOD IMPLEMENTATIONS ==========

  protected fetchAllItems(): Observable<UserDto[]> {
    return this.apiService.getAllUsers();
  }

  protected performSave(dto: SaveUserDto): Observable<UserDto> {
    // Ensure clean SaveUserDto structure with nested objects
    const cleanDto: SaveUserDto = {
      user: {
        id: dto.user?.id || null,
        email: dto.user?.email || '',
        isActive: dto.user?.isActive ?? true,
        password: dto.user?.password || null,
        picture: dto.user?.picture || null,
      },
      createPersonDto: {
        name: dto.createPersonDto?.name || '',
        dni: dto.createPersonDto?.dni || '',
        phoneNumber: dto.createPersonDto?.phoneNumber || '',
        birthday: dto.createPersonDto?.birthday || null,
        address: dto.createPersonDto?.address || null,
        notes: dto.createPersonDto?.notes || null,
      },
      rolesId: Array.isArray(dto.rolesId) ? dto.rolesId : [],
      permissionsId: Array.isArray(dto.permissionsId) ? dto.permissionsId : [],
      companyIds: Array.isArray(dto.companyIds) ? dto.companyIds : [],
    };

    return this.apiService.saveUser(cleanDto);
  }

  protected performDelete(id: string): Observable<unknown> {
    return this.apiService.deleteUser(id);
  }

  protected matchesSearch(item: UserDto, term: string): boolean {
    const searchableFields = [
      item.email,
      item.id,
      item.person?.name,
      item.person?.dni,
    ];

    return searchableFields.some((field) =>
      field?.toLowerCase().includes(term.toLowerCase()),
    );
  }

  getTableColumns(): TableColumnMetadata<UserDto>[] {
    return [
      {
        key: 'person.name',
        label: 'Name',
        sortable: true,
        align: 'left',
        valueGetter: (item) => item.person?.name || 'N/A',
      },
      {
        key: 'email',
        label: 'Email',
        sortable: true,
        align: 'left',
      },
      {
        key: 'person.dni',
        label: 'DNI',
        sortable: true,
        align: 'left',
        valueGetter: (item) => item.person?.dni || 'N/A',
      },
      {
        key: 'isActive',
        label: 'Active',
        sortable: true,
        align: 'center',
        formatter: (value) => formatBoolean(value),
      },
      {
        key: 'id',
        label: 'ID',
        sortable: true,
        align: 'left',
      },
    ];
  }

  getFormFields(): FormFieldMetadata[] {
    return [
      // Main fields (always visible - no group)
      {
        key: 'email',
        label: 'Email',
        type: 'text',
        placeholder: 'Enter user email',
        validators: [Validators.required, Validators.email],
        helpText: 'Must be a valid email address',
        // No group - displayed directly
      },
      {
        key: 'password',
        label: 'Password',
        type: 'text',
        placeholder: 'Enter password',
        validators: [Validators.minLength(6)],
        helpText: 'Password must be at least 6 characters (optional for edit)',
        // No group - displayed directly
      },
      {
        key: 'personName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'Enter full name',
        validators: [Validators.required, Validators.minLength(2)],
        helpText: 'Person full name',
        // No group - displayed directly
      },
      {
        key: 'isActive',
        label: 'Active',
        type: 'checkbox',
        helpText: 'Whether this user account is active',
        // No group - displayed directly
      },

      // Personal Information (in accordion)
      {
        key: 'personDni',
        label: 'DNI',
        type: 'text',
        placeholder: 'Enter DNI',
        validators: [Validators.required],
        helpText: 'National ID number',
        group: 'Personal Information',
      },
      {
        key: 'personPhoneNumber',
        label: 'Phone Number',
        type: 'text',
        placeholder: 'Enter phone number',
        validators: [Validators.required],
        helpText: 'Contact phone number',
        group: 'Personal Information',
      },
      {
        key: 'personBirthday',
        label: 'Birthday',
        type: 'text',
        placeholder: 'YYYY-MM-DD',
        helpText: 'Date of birth (optional)',
        group: 'Personal Information',
      },
      {
        key: 'personAddress',
        label: 'Address',
        type: 'text',
        placeholder: 'Enter address',
        helpText: 'Residential address (optional)',
        group: 'Personal Information',
        colSpan: 2,
      },
      {
        key: 'personNotes',
        label: 'Notes',
        type: 'text',
        placeholder: 'Enter notes',
        helpText: 'Additional notes (optional)',
        group: 'Personal Information',
        colSpan: 2,
      },

      // Access & Permissions (in accordion)
      {
        key: 'rolesId',
        label: 'Roles',
        type: 'multiselect',
        placeholder: 'Select roles',
        helpText: 'Assign roles to this user',
        group: 'Access & Permissions',
        colSpan: 2,
        loadOptions: () => of(this.commonDataCache.getRoleOptions()),
        valueTransformer: (item: unknown) => {
          const userItem = item as UserDto;
          return userItem.roles?.map((r) => r.id) || [];
        },
      },
      {
        key: 'permissionsId',
        label: 'Permissions',
        type: 'multiselect',
        placeholder: 'Select permissions',
        helpText: 'Assign permissions to this user',
        group: 'Access & Permissions',
        colSpan: 2,
        loadOptions: () => of(this.commonDataCache.getPermissionOptions()),
        valueTransformer: (item: unknown) => {
          const userItem = item as UserDto;
          return userItem.permissions?.map((p) => p.name) || [];
        },
      },
      {
        key: 'companyIds',
        label: 'Companies',
        type: 'multiselect',
        placeholder: 'Select companies',
        helpText: 'Assign companies to this user',
        group: 'Access & Permissions',
        colSpan: 2,
        loadOptions: () => of(this.commonDataCache.getCompanyOptions()),
        valueTransformer: (item: unknown) => {
          const userItem = item as UserDto;
          return userItem.companies?.map((c) => c.id) || [];
        },
      },
    ];
  }

  getDisplayFields(): DisplayFieldMetadata[] {
    return [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'email',
        label: 'Email',
      },
      {
        key: 'isActive',
        label: 'Active',
        valueGetter: (item: unknown) => {
          const userItem = item as UserDto;
          return userItem.isActive;
        },
        formatter: (value) => formatBoolean(value),
      },
      {
        key: 'person.name',
        label: 'Full Name',
        valueGetter: (item: unknown) => {
          const userItem = item as UserDto;
          return userItem.person?.name || 'N/A';
        },
      },
      {
        key: 'person.dni',
        label: 'DNI',
        valueGetter: (item: unknown) => {
          const userItem = item as UserDto;
          return userItem.person?.dni || 'N/A';
        },
      },
      {
        key: 'person.phoneNumber',
        label: 'Phone Number',
        valueGetter: (item: unknown) => {
          const userItem = item as UserDto;
          return userItem.person?.phoneNumber || 'N/A';
        },
      },
      {
        key: 'person.birthday',
        label: 'Birthday',
        valueGetter: (item: unknown) => {
          const userItem = item as UserDto;
          return userItem.person?.birthday;
        },
        formatter: (value) => formatDate(value),
      },
      {
        key: 'person.address',
        label: 'Address',
        valueGetter: (item: unknown) => {
          const userItem = item as UserDto;
          return userItem.person?.address || 'N/A';
        },
      },
      {
        key: 'roles',
        label: 'Roles',
        valueGetter: (item: unknown) => {
          const userItem = item as UserDto;
          return userItem.roles?.map((r) => r.name) || [];
        },
        formatter: (value) => formatList(value),
      },
      {
        key: 'permissions',
        label: 'Permissions',
        valueGetter: (item: unknown) => {
          const userItem = item as UserDto;
          return userItem.permissions?.map((p) => p.name) || [];
        },
        formatter: (value) => formatList(value),
      },
      {
        key: 'companies',
        label: 'Companies',
        valueGetter: (item: unknown) => {
          const userItem = item as UserDto;
          return userItem.companies?.map((c) => c.name) || [];
        },
        formatter: (value) => formatList(value),
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

  getItemDisplayName(item: UserDto): string {
    return item.person?.name || item.email || item.id;
  }

  // ========== UI ACTION OVERRIDES (for routing) ==========

  /**
   * Override to navigate to new route
   */
  override onNewItem(): void {
    this.router.navigate([this.getRouteBasePath(), 'new']);
  }

  /**
   * Override to navigate to edit route
   */
  override onEditItem(item: UserDto): void {
    this.router.navigate([this.getRouteBasePath(), item.id, 'edit']);
  }

  /**
   * Override to navigate back to list after saving
   */
  protected override onAfterFormSave(): void {
    this.router.navigate([this.getRouteBasePath()]);
  }

  /**
   * Override to navigate back to list when canceling
   */
  override onFormCancel(): void {
    this._showModal.set(false);
    this._editingItem.set(null);
    this.router.navigate([this.getRouteBasePath()]);
  }

  /**
   * Transform a UserDto into a SaveUserDto for the form
   * Flattens nested objects into individual form fields
   */
  transformItemToFormData(item: UserDto): Partial<SaveUserDto> & Record<string, unknown> {
    return {
      user: {
        id: item.id,
        email: item.email,
        isActive: item.isActive,
      },
      email: item.email,
      isActive: item.isActive,
      personName: item.person?.name,
      personDni: item.person?.dni,
      personPhoneNumber: item.person?.phoneNumber,
      personBirthday: item.person?.birthday,
      personAddress: item.person?.address,
      personNotes: item.person?.notes,
      rolesId: item.roles?.map((r) => r.id) || [],
      permissionsId: item.permissions?.map((p) => p.name) || [],
      companyIds: item.companies?.map((c) => c.id) || [],
    };
  }

  /**
   * Transform form data back into SaveUserDto structure
   * Reconstructs nested objects from individual form fields
   */
  transformFormDataToItem(formData: Record<string, unknown>): SaveUserDto {
    return {
      user: {
        id: (formData['id'] as string) || null,
        email: (formData['email'] as string) || '',
        isActive: (formData['isActive'] as boolean) ?? true,
        password: (formData['password'] as string) || null,
        picture: null,
      },
      createPersonDto: {
        name: (formData['personName'] as string) || '',
        dni: (formData['personDni'] as string) || '',
        phoneNumber: (formData['personPhoneNumber'] as string) || '',
        birthday: (formData['personBirthday'] as string) || null,
        address: (formData['personAddress'] as string) || null,
        notes: (formData['personNotes'] as string) || null,
      },
      rolesId: Array.isArray(formData['rolesId'])
        ? (formData['rolesId'] as string[])
        : [],
      permissionsId: Array.isArray(formData['permissionsId'])
        ? (formData['permissionsId'] as string[])
        : [],
      companyIds: Array.isArray(formData['companyIds'])
        ? (formData['companyIds'] as string[])
        : [],
    };
  }
}
