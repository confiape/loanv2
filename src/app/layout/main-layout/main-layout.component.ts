import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { SidenavComponent, SidenavItem } from '@loan/app/layout';
import { NavbarComponent } from '@loan/app/layout';

import { BottomNavigationComponent, BottomNavItem } from '@loan/app/layout';
import {ToastContainerComponent} from '@loan/app/shared/components/toast';
import {
  APPS_MENU_ITEMS,
  BOTTOM_NAV_ITEMS,
  MOCK_NOTIFICATIONS,
  SIDENAV_ITEMS,
  USER_MENU_ITEMS
} from '@loan/app/config/layout.config';
import {AppMenuItem} from '@loan/app/shared/components/apps-menu/apps-menu.component';
import {UserMenuItem} from '@loan/app/shared/components/user-menu/user-menu.component';
import {Notification} from '@loan/app/shared/components/notification-button/notification-button.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [

    NavbarComponent,
    SidenavComponent,
    NavbarComponent,
    BottomNavigationComponent,
    ToastContainerComponent,
  ],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {
  // Configuration
  appTitle = 'Loan UI';
  userName = 'Warren Martinez';
  userEmail = 'warren@loanui.com';
  userAvatar = '';

  // Data from config
  sidenavItems: SidenavItem[] = SIDENAV_ITEMS;
  appsMenuItems: AppMenuItem[] = APPS_MENU_ITEMS;
  userMenuItems: UserMenuItem[] = USER_MENU_ITEMS;
  bottomNavItems: BottomNavItem[] = BOTTOM_NAV_ITEMS;
  notifications = signal<Notification[]>(MOCK_NOTIFICATIONS);

  // State
  isMobileMenuOpen = signal(false);

  // Methods
  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  onSidenavItemClick(item: SidenavItem): void {
    console.log('Sidenav item clicked:', item);
    this.closeMobileMenu();
  }

  onSearchChange(query: string): void {
    console.log('Search query:', query);
  }

  onSearchSubmit(query: string): void {
    console.log('Search submitted:', query);
  }

  onNotificationClick(notification: Notification): void {
    console.log('Notification clicked:', notification);
    // Mark as read
    this.notifications.update((notifications) =>
      notifications.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
    );
  }

  onMarkAllAsRead(): void {
    this.notifications.update((notifications) => notifications.map((n) => ({ ...n, read: true })));
  }

  onAppClick(app: AppMenuItem): void {
    console.log('App clicked:', app);
  }

  onUserMenuClick(item: UserMenuItem): void {
    console.log('User menu item clicked:', item);
    if (item.action === 'logout') {
      console.log('Logging out...');
    }
  }

  onBottomNavClick(item: BottomNavItem): void {
    console.log('Bottom nav item clicked:', item);
  }
}
