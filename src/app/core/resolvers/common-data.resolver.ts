import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CommonDataCacheService } from '../services/cache/common-data-cache.service';
import { CompanyDto, RoleDto, PermissionDto } from '@loan/app/shared/openapi';

/**
 * Resolver to pre-load common data (companies, roles, permissions)
 * Ensures data is available before entering protected routes
 */
export const commonDataResolver: ResolveFn<
  [CompanyDto[], RoleDto[], PermissionDto[]] | boolean
> = (route, state) => {
  const cacheService = inject(CommonDataCacheService);

  // If already loaded, return immediately
  if (cacheService.loaded()) {
    return of(true);
  }

  // Otherwise, load the data
  return cacheService.loadAll();
};
