import { catchError, of, tap } from 'rxjs';
import { ResolveFn } from '@angular/router';
import { UserApiService, UserDto } from '@loan/app/shared/openapi';
import { inject } from '@angular/core';
import { UserStateService } from '@loan/app/core/services/user.service';

export const userResolver: ResolveFn<UserDto | null> = () => {
  const userApiService = inject(UserApiService);
  const userStateService = inject(UserStateService);

  return userApiService.getCurrentUser().pipe(
    tap((user) => {
      userStateService.setUser(user);
    }),
    catchError((error) => {
      console.error('Error loading user:', error);
      userStateService.clearUser();
      return of(null);
    }),
  );
};
