import { Component, input, output, signal, inject, OnInit } from '@angular/core';
import {Notification} from '@loan/app/shared/components/notification-button/notification-button';

import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import {UserApiService, UserDto} from '@loan/app/shared/openapi';
import {AuthService} from '@loan/app/core/services/auth.service';
import {SearchBarComponent} from '@loan/app/shared/components/search-bar/search-bar';
import {
  NotificationButtonComponent
} from '@loan/app/shared/components/notification-button/notification-button';
import {AppMenuItem, AppsMenuComponent} from '@loan/app/shared/components/apps-menu/apps-menu';
import {UserMenuComponent, UserMenuItem} from '@loan/app/shared/components/user-menu/user-menu';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SearchBarComponent, NotificationButtonComponent, AppsMenuComponent, UserMenuComponent],
  templateUrl: './navbar.html',
})
export class NavbarComponent implements OnInit {
  // Services
  private readonly userApiService = inject(UserApiService);
  private readonly authService = inject(AuthService);

  // Signals
  currentUser = signal<UserDto | null>(null);
  isLoadingUser = signal<boolean>(false);
  userLoadError = signal<string | null>(null);

  // Inputs
  appTitle = input<string>('Loan UI');
  userName = input<string>('User');
  userEmail = input<string>('');
  userAvatar = input<string>('');
  notifications = input<Notification[]>([]);
  apps = input<AppMenuItem[]>([]);
  userMenuItems = input<UserMenuItem[]>([]);
  showSearch = input<boolean>(true);

  // Outputs
  menuToggle = output<void>();
  searchChange = output<string>();
  searchSubmit = output<string>();
  notificationClick = output<Notification>();
  appClick = output<AppMenuItem>();
  userMenuClick = output<UserMenuItem>();

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.isLoadingUser.set(true);
    this.userLoadError.set(null);

    this.userApiService
      .getCurrentUser()
      .pipe(
        tap((user) => {
          this.currentUser.set(user);
          this.isLoadingUser.set(false);
        }),
        catchError((error) => {
          console.error('Error loading current user:', error);
          this.userLoadError.set('Failed to load user data');
          this.isLoadingUser.set(false);
          return of(null);
        }),
      )
      .subscribe();
  }

  // Computed properties
  get displayUserName(): string {
    const user = this.currentUser();
    if (user?.person?.name) {
      return user.person.name;
    }
    return this.userName() || 'User';
  }

  get displayUserEmail(): string {
    const user = this.currentUser();
    if (user?.email) {
      return user.email;
    }
    return this.userEmail() || '';
  }

  get displayUserAvatar(): string {
    const user = this.currentUser();
    if (user?.avatar) {
      return user.avatar;
    }
    return this.userAvatar() || '';
  }

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

    this.userMenuClick.emit(item);
  }

  private handleLogout(): void {
    this.authService.logout().subscribe();
  }
}
