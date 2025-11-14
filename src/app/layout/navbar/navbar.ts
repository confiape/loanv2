import { Component, input, output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

import { AuthService } from '@loan/app/core/services/auth.service';
import { SearchBarComponent } from '@loan/app/shared/components/search-bar/search-bar';
import {
  NotificationButtonComponent,
  Notification,
} from '@loan/app/shared/components/notification-button/notification-button';
import { AppsMenuComponent, AppMenuItem } from '@loan/app/shared/components/apps-menu/apps-menu';
import { UserMenuComponent, UserMenuItem } from '@loan/app/shared/components/user-menu/user-menu';
import { UserStateService } from '@loan/app/core/services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SearchBarComponent, NotificationButtonComponent, AppsMenuComponent, UserMenuComponent],
  templateUrl: './navbar.html',
})
export class NavbarComponent {
  // Services
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly userState = inject(UserStateService);

  // Inputs
  readonly appTitle = input<string>('Loan UI');
  readonly notifications = input<Notification[]>([]);
  readonly apps = input<AppMenuItem[]>([]);
  readonly userMenuItems = input<UserMenuItem[]>([]);
  readonly showSearch = input<boolean>(true);

  // Outputs
  readonly menuToggle = output<void>();
  readonly searchChange = output<string>();
  readonly searchSubmit = output<string>();
  readonly notificationClick = output<Notification>();
  readonly appClick = output<AppMenuItem>();
  readonly userMenuClick = output<UserMenuItem>();

  // Event Handlers
  onMenuToggle(): void {
    this.menuToggle.emit();
  }

  onSearchChange(query: string): void {
    this.searchChange.emit(query);
  }

  onSearchSubmit(query: string): void {
    this.searchSubmit.emit(query);
  }

  onNotificationClick(notification: Notification): void {
    this.notificationClick.emit(notification);
  }

  onAppClick(app: AppMenuItem): void {
    this.appClick.emit(app);
  }

  onUserMenuClick(item: UserMenuItem): void {
    // Handle logout action
    if (item.action === 'logout') {
      this.handleLogout();
      return;
    }

    // Handle navigation
    if (item.href) {
      this.router.navigate([item.href]);
    }

    // Emit event for custom handling
    this.userMenuClick.emit(item);
  }

  private handleLogout(): void {
    this.authService
      .logout()
      .pipe(
        tap(() => {
          this.userState.clearUser();
          this.router.navigate(['/login']);
        }),
        catchError((error) => {
          console.error('Error during logout:', error);
          // Even if logout fails, clear user and redirect
          this.userState.clearUser();
          this.router.navigate(['/login']);
          return EMPTY;
        })
      )
      .subscribe();
  }
}
