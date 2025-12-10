import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Validators } from '@angular/forms';
import { BaseCrudService } from '@loan/app/core/services/base-crud.service';
import {
  TableColumnMetadata,
  FormFieldMetadata,
  DisplayFieldMetadata,
} from '@loan/app/core/models/form-metadata';
import { RoleDto, SaveRoleDto, UserApiService } from '@loan/app/shared/openapi';
import { CommonDataCacheService } from '@loan/app/core/services/cache/common-data-cache.service';
import { noSpecialCharactersValidator } from '@loan/app/features/roles';
import { formatList } from '@loan/app/shared/utils/formatters';
import {maxLengthTrimmed, minLengthTrimmed} from '@loan/app/core/utils/validators';

/**
 * CRUD service for Role entities
 * Provides all CRUD operations and form/table configurations
 */
@Injectable({
  providedIn: 'root',
})
export class RoleCrudService extends BaseCrudService<RoleDto, SaveRoleDto> {
  private apiService = inject(UserApiService);
  private commonDataCache = inject(CommonDataCacheService);
  private router = inject(Router);

  // ========== ABSTRACT METHOD IMPLEMENTATIONS ==========

  protected fetchAllItems(): Observable<RoleDto[]> {
    return this.apiService.getAllRoles();
  }

  protected performSave(dto: SaveRoleDto): Observable<RoleDto> {
    // Strip nested role data and ensure clean SaveRoleDto structure
    const cleanDto: SaveRoleDto = {
      id: dto.id || null,
      name: dto.name,
      rolesId: Array.isArray(dto.rolesId) ? dto.rolesId : [],
      permissionsId: Array.isArray(dto.permissionsId) ? dto.permissionsId : [],
    };

    return this.apiService.saveRole(cleanDto);
  }

  protected performDelete(id: string): Observable<unknown> {
    return this.apiService.deleteRole(id);
  }

  protected matchesSearch(item: RoleDto, term: string): boolean {
    const searchableFields = [item.name, item.id];

    return searchableFields.some((field) => field.toLowerCase().includes(term.toLowerCase()));
  }

  getTableColumns(): TableColumnMetadata<RoleDto>[] {
    return [
      {
        key: 'name',
        label: 'Name',
        sortable: true,
        align: 'left',
      }
    ];
  }

  getFormFields(): FormFieldMetadata[] {
    return [
      {
        key: 'name',
        label: 'Role Name',
        type: 'text',
        placeholder: 'Enter role name',
        validators: [
          Validators.required,
          minLengthTrimmed(2),
          maxLengthTrimmed(40),
          noSpecialCharactersValidator(),
        ],
        helpText: 'Role name must be between 2-40 characters with no special characters',
      },
      {
        key: 'rolesId',
        label: 'Inherited Roles',
        type: 'multiselect',
        placeholder: 'Select inherited roles',
        helpText: 'Select other roles to inherit permissions from',
        loadOptions: () => of(this.commonDataCache.getRoleOptions()),
        valueTransformer: (item: unknown) => {
          const roleItem = item as RoleDto;
          return roleItem.roles?.map((r) => r.id) || [];
        },
      },
      {
        key: 'permissionsId',
        label: 'Permissions',
        type: 'multiselect',
        placeholder: 'Select permissions',
        helpText: 'Select permissions for this role',
        loadOptions: () => of(this.commonDataCache.getPermissionOptions()),
        valueTransformer: (item: unknown) => {
          const roleItem = item as RoleDto;
          return roleItem.permissions?.map((p) => p.name) || [];
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
        key: 'name',
        label: 'Role Name',
      },
      {
        key: 'roles',
        label: 'Inherited Roles',
        valueGetter: (item: unknown) => {
          const roleItem = item as RoleDto;
          return roleItem.roles?.map((r) => r.name) || [];
        },
        formatter: (value) => formatList(value),
      },
      {
        key: 'permissions',
        label: 'Permissions',
        valueGetter: (item: unknown) => {
          const roleItem = item as RoleDto;
          return roleItem.permissions?.map((p) => p.name) || [];
        },
        formatter: (value) => formatList(value),
      },
    ];
  }

  getRouteBasePath(): string {
    return '/roles';
  }

  getItemTypeName(): string {
    return 'role';
  }

  getItemTypePluralName(): string {
    return 'roles';
  }

  getItemDisplayName(item: RoleDto): string {
    return item.name;
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
  override onEditItem(item: RoleDto): void {
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
}
