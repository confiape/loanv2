import { Injectable, inject, signal } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CompanyApiService } from '@loan/app/shared/openapi/api/company.service';
import { UserApiService } from '@loan/app/shared/openapi/api/user.service';
import { CompanyDto, RoleDto, PermissionDto } from '@loan/app/shared/openapi';

export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Service to cache commonly used data across the application
 * Pre-loads companies, roles, and permissions to avoid repeated HTTP calls
 */
@Injectable({
  providedIn: 'root',
})
export class CommonDataCacheService {
  private companyApiService = inject(CompanyApiService);
  private userApiService = inject(UserApiService);

  // Cached data as signals
  private _companies = signal<CompanyDto[]>([]);
  private _roles = signal<RoleDto[]>([]);
  private _permissions = signal<PermissionDto[]>([]);
  private _loaded = signal(false);

  // Public read-only signals
  readonly companies = this._companies.asReadonly();
  readonly roles = this._roles.asReadonly();
  readonly permissions = this._permissions.asReadonly();
  readonly loaded = this._loaded.asReadonly();

  /**
   * Load all common data from the server
   * This should be called once during app initialization or via resolver
   */
  loadAll(): Observable<[CompanyDto[], RoleDto[], PermissionDto[]]> {
    return forkJoin([
      this.companyApiService.getAllCompanies(),
      this.userApiService.getAllRoles(),
      this.userApiService.getAllPermissions(),
    ]).pipe(
      tap(([companies, roles, permissions]) => {
        this._companies.set(companies);
        this._roles.set(roles);
        this._permissions.set(permissions);
        this._loaded.set(true);
      })
    );
  }

  /**
   * Reload all data (for manual refresh)
   */
  reload(): Observable<[CompanyDto[], RoleDto[], PermissionDto[]]> {
    this._loaded.set(false);
    return this.loadAll();
  }

  /**
   * Get companies as select options (synchronous)
   */
  getCompanyOptions(): SelectOption[] {
    return this._companies().map((company) => ({
      value: company.id,
      label: company.name,
    }));
  }

  /**
   * Get roles as select options (synchronous)
   */
  getRoleOptions(): SelectOption[] {
    return this._roles().map((role) => ({
      value: role.id,
      label: role.name,
    }));
  }

  /**
   * Get permissions as select options (synchronous)
   */
  getPermissionOptions(): SelectOption[] {
    return this._permissions().map((permission) => ({
      value: permission.name,
      label: permission.name,
    }));
  }

  /**
   * Get company by ID
   */
  getCompanyById(id: string): CompanyDto | undefined {
    return this._companies().find((c) => c.id === id);
  }

  /**
   * Get role by ID
   */
  getRoleById(id: string): RoleDto | undefined {
    return this._roles().find((r) => r.id === id);
  }

  /**
   * Get permission by name
   */
  getPermissionByName(name: string): PermissionDto | undefined {
    return this._permissions().find((p) => p.name === name);
  }
}
