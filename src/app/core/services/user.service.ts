import { Injectable, signal, computed } from '@angular/core';
import { UserDto } from '@loan/app/shared/openapi';

@Injectable({ providedIn: 'root' })
export class UserStateService {
  private readonly _user = signal<UserDto | null>(null);

  // ✅ Exponer user como readonly
  readonly user = this._user.asReadonly();

  // ✅ Computed SOLO para lógica reutilizable en MÚLTIPLES componentes
  readonly isAuthenticated = computed(() => this.user() !== null);

  // ✅ Computed para datos que se usan frecuentemente
  readonly userName = computed(() => this.user()?.person?.name);
  readonly userEmail = computed(() => this.user()?.email);
  readonly userAvatar = computed(() => this.user()?.avatar);

  setUser(user: UserDto | null): void {
    this._user.set(user);
  }

  clearUser(): void {
    this._user.set(null);
  }
}
