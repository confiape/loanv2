import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Validators } from '@angular/forms';
import { BaseCrudService } from '@loan/app/core/services/base-crud.service';
import { TableColumnMetadata, FormFieldMetadata } from '@loan/app/core/models/form-metadata';
import { RoleDto, SaveRoleDto, UserApiService } from '@loan/app/shared/openapi';
import { noSpecialCharactersValidator } from '../validators/role.validators';

/**
 * CRUD service for Role entities
 * Provides all CRUD operations and form/table configurations
 */
@Injectable({
  providedIn: 'root',
})
export class RoleCrudService extends BaseCrudService<RoleDto, SaveRoleDto> {
  private apiService = inject(UserApiService);
  private router = inject(Router);

  // ========== ABSTRACT METHOD IMPLEMENTATIONS ==========

  protected fetchAllItems(): Observable<RoleDto[]> {
    return this.apiService.getAllRoles();
  }

  protected performSave(dto: SaveRoleDto): Observable<RoleDto> {
    return this.apiService.saveRole(dto);
  }

  protected performDelete(id: string): Observable<unknown> {
    return this.apiService.deleteRole(id);
  }

  protected matchesSearch(item: RoleDto, term: string): boolean {
    const searchableFields = [item.name, item.id];

    return searchableFields.some((field) =>
      field.toLowerCase().includes(term.toLowerCase())
    );
  }

  getTableColumns(): TableColumnMetadata<RoleDto>[] {
    return [
      {
        key: 'name',
        label: 'Name',
        sortable: true,
        align: 'left',
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
      {
        key: 'name',
        label: 'Role Name',
        type: 'text',
        placeholder: 'Enter role name',
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(40),
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
        loadOptions: () =>
          this.apiService.getAllRoles().pipe(
            map((roles) =>
              roles.map((role) => ({
                value: role.id,
                label: role.name,
              }))
            )
          ),
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
        loadOptions: () =>
          this.apiService.getAllPermissions().pipe(
            map((permissions) =>
              permissions.map((permission) => ({
                value: permission.name,
                label: permission.name,
              }))
            )
          ),
        valueTransformer: (item: unknown) => {
          const roleItem = item as RoleDto;
          return roleItem.permissions?.map((p) => p.name) || [];
        },
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
   * Override to navigate to edit route instead of opening modal directly
   */
  override onEditItem(item: RoleDto): void {
    this.router.navigate([this.getRouteBasePath(), item.id]);
  }

  /**
   * Override to navigate to base route when opening new item form
   */
  override onNewItem(): void {
    this._editingItem.set(null);
    this._showModal.set(true);
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
