import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MainLayoutComponent } from '@loan/app/layout/main-layout/main-layout';
import { NavbarComponent } from '@loan/app/layout/navbar/navbar';
import { SidenavComponent } from '@loan/app/layout/sidenav/sidenav';
import { BottomNavigationComponent } from '@loan/app/layout/bottom-navigation/bottom-navigation';
import { ToastContainerComponent } from '@loan/app/shared/components/toast/toast-container';
import { AuthService } from '@loan/app/core/services/auth.service';
import { UserStateService } from '@loan/app/core/services/user.service';

describe('MainLayoutComponent', () => {
  const mockAuthService = {
    logout: vi.fn(),
    getToken: vi.fn(),
  };

  const mockUserStateService = {
    userName: vi.fn(() => 'Test User'),
    userEmail: vi.fn(() => 'test@example.com'),
    userAvatar: vi.fn(() => ''),
    clearUser: vi.fn(),
  };

  const defaultProviders = [
    provideZonelessChangeDetection(),
    provideRouter([]),
    { provide: AuthService, useValue: mockAuthService },
    { provide: UserStateService, useValue: mockUserStateService },
  ];

  describe('initialization', () => {
    it('creates the component', async () => {
      // Arrange & Act
      const { container } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      // Assert
      expect(container).toBeTruthy();
    });

    it('initializes with default configuration values', async () => {
      // Arrange & Act
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      // Assert
      expect(fixture.componentInstance.appTitle).toBe('Loan UI');
      expect(fixture.componentInstance.userName).toBe('Warren Martinez');
      expect(fixture.componentInstance.userEmail).toBe('warren@loanui.com');
      expect(fixture.componentInstance.userAvatar).toBe('');
    });

    it('loads sidenav items from config', async () => {
      // Arrange & Act
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      // Assert
      expect(fixture.componentInstance.sidenavItems).toBeDefined();
      expect(Array.isArray(fixture.componentInstance.sidenavItems)).toBe(true);
      expect(fixture.componentInstance.sidenavItems.length).toBeGreaterThan(0);
    });

    it('loads apps menu items from config', async () => {
      // Arrange & Act
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      // Assert
      expect(fixture.componentInstance.appsMenuItems).toBeDefined();
      expect(Array.isArray(fixture.componentInstance.appsMenuItems)).toBe(true);
      expect(fixture.componentInstance.appsMenuItems.length).toBeGreaterThan(0);
    });

    it('loads user menu items from config', async () => {
      // Arrange & Act
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      // Assert
      expect(fixture.componentInstance.userMenuItems).toBeDefined();
      expect(Array.isArray(fixture.componentInstance.userMenuItems)).toBe(true);
      expect(fixture.componentInstance.userMenuItems.length).toBeGreaterThan(0);
    });

    it('loads bottom navigation items from config', async () => {
      // Arrange & Act
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      // Assert
      expect(fixture.componentInstance.bottomNavItems).toBeDefined();
      expect(Array.isArray(fixture.componentInstance.bottomNavItems)).toBe(true);
      expect(fixture.componentInstance.bottomNavItems.length).toBeGreaterThan(0);
    });

    it('initializes notifications signal with mock data', async () => {
      // Arrange & Act
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      const notifications = fixture.componentInstance.notifications();

      // Assert
      expect(Array.isArray(notifications)).toBe(true);
      expect(notifications.length).toBeGreaterThan(0);
    });

    it('initializes mobile menu as closed', async () => {
      // Arrange & Act
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      // Assert
      expect(fixture.componentInstance.isMobileMenuOpen()).toBe(false);
    });
  });

  describe('mobile menu state', () => {
    it('toggles mobile menu state', async () => {
      // Arrange & Act
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      expect(fixture.componentInstance.isMobileMenuOpen()).toBe(false);

      fixture.componentInstance.toggleMobileMenu();
      expect(fixture.componentInstance.isMobileMenuOpen()).toBe(true);

      fixture.componentInstance.toggleMobileMenu();

      // Assert
      expect(fixture.componentInstance.isMobileMenuOpen()).toBe(false);
    });

    it('closes mobile menu when closeMobileMenu is called', async () => {
      // Arrange & Act
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      fixture.componentInstance.toggleMobileMenu();
      expect(fixture.componentInstance.isMobileMenuOpen()).toBe(true);

      fixture.componentInstance.closeMobileMenu();

      // Assert
      expect(fixture.componentInstance.isMobileMenuOpen()).toBe(false);
    });

    it('sets mobile menu to closed state explicitly', async () => {
      // Arrange & Act
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      fixture.componentInstance.isMobileMenuOpen.set(true);
      expect(fixture.componentInstance.isMobileMenuOpen()).toBe(true);

      fixture.componentInstance.closeMobileMenu();

      // Assert
      expect(fixture.componentInstance.isMobileMenuOpen()).toBe(false);
    });
  });

  describe('sidenav interactions', () => {
    it('logs sidenav item click and closes mobile menu', async () => {
      // Arrange
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      fixture.componentInstance.isMobileMenuOpen.set(true);

      const testItem = fixture.componentInstance.sidenavItems[0];

      // Act
      fixture.componentInstance.onSidenavItemClick(testItem);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Sidenav item clicked:', testItem);
      expect(fixture.componentInstance.isMobileMenuOpen()).toBe(false);

      consoleSpy.mockRestore();
    });

    it('closes mobile menu when navigating via sidenav', async () => {
      // Arrange
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      fixture.componentInstance.isMobileMenuOpen.set(true);
      const testItem = fixture.componentInstance.sidenavItems[0];

      // Act
      fixture.componentInstance.onSidenavItemClick(testItem);

      // Assert
      expect(fixture.componentInstance.isMobileMenuOpen()).toBe(false);
    });
  });

  describe('search functionality', () => {
    it('logs search query changes', async () => {
      // Arrange
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const query = 'test query';

      // Act
      fixture.componentInstance.onSearchChange(query);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Search query:', query);
      consoleSpy.mockRestore();
    });

    it('logs search submission', async () => {
      // Arrange
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const query = 'submitted query';

      // Act
      fixture.componentInstance.onSearchSubmit(query);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Search submitted:', query);
      consoleSpy.mockRestore();
    });

    it('handles empty search query', async () => {
      // Arrange
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      // Act
      fixture.componentInstance.onSearchChange('');

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Search query:', '');

      consoleSpy.mockRestore();
    });
  });

  describe('notification handling', () => {
    it('marks notification as read when clicked', async () => {
      // Arrange
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      const unreadNotification = fixture.componentInstance.notifications().find((n) => !n.read);
      expect(unreadNotification).toBeDefined();

      const notificationId = unreadNotification!.id;

      // Act
      fixture.componentInstance.onNotificationClick(unreadNotification!);

      const updatedNotification = fixture.componentInstance.notifications().find((n) => n.id === notificationId);

      // Assert
      expect(updatedNotification?.read).toBe(true);
    });

    it('logs notification click', async () => {
      // Arrange
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const notification = fixture.componentInstance.notifications()[0];

      // Act
      fixture.componentInstance.onNotificationClick(notification);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Notification clicked:', notification);
      consoleSpy.mockRestore();
    });

    it('does not affect other notifications when marking one as read', async () => {
      // Arrange
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      const notifications = fixture.componentInstance.notifications();
      const firstNotification = notifications[0];
      const totalCount = notifications.length;

      // Act
      fixture.componentInstance.onNotificationClick(firstNotification);

      const updatedNotifications = fixture.componentInstance.notifications();

      // Assert
      expect(updatedNotifications.length).toBe(totalCount);
    });

    it('marks all notifications as read', async () => {
      // Arrange
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      // Act
      fixture.componentInstance.onMarkAllAsRead();

      const allNotifications = fixture.componentInstance.notifications();
      const allRead = allNotifications.every((n) => n.read === true);

      // Assert
      expect(allRead).toBe(true);
    });

    it('handles marking already read notifications', async () => {
      // Arrange
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      fixture.componentInstance.onMarkAllAsRead();
      const countBefore = fixture.componentInstance.notifications().length;

      // Act
      fixture.componentInstance.onMarkAllAsRead();
      const countAfter = fixture.componentInstance.notifications().length;

      // Assert
      expect(countAfter).toBe(countBefore);
    });
  });

  describe('apps menu interactions', () => {
    it('logs app click', async () => {
      // Arrange
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const app = fixture.componentInstance.appsMenuItems[0];

      // Act
      fixture.componentInstance.onAppClick(app);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('App clicked:', app);
      consoleSpy.mockRestore();
    });

    it('handles clicking each app in menu', async () => {
      // Arrange
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      // Act
      fixture.componentInstance.appsMenuItems.forEach((app) => {
        fixture.componentInstance.onAppClick(app);
        expect(consoleSpy).toHaveBeenCalledWith('App clicked:', app);
      });

      // Assert
      consoleSpy.mockRestore();
    });
  });

  describe('user menu interactions', () => {
    it('logs user menu item click', async () => {
      // Arrange
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const menuItem = fixture.componentInstance.userMenuItems.find((item) => item.action !== 'logout')!;

      // Act
      fixture.componentInstance.onUserMenuClick(menuItem);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('User menu item clicked:', menuItem);
      consoleSpy.mockRestore();
    });

    it('handles logout action specifically', async () => {
      // Arrange
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const logoutItem = fixture.componentInstance.userMenuItems.find((item) => item.action === 'logout')!;

      // Act
      fixture.componentInstance.onUserMenuClick(logoutItem);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('User menu item clicked:', logoutItem);
      expect(consoleSpy).toHaveBeenCalledWith('Logging out...');
      consoleSpy.mockRestore();
    });

    it('identifies logout action correctly', async () => {
      // Arrange
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const logoutItem = { id: 'logout', label: 'Logout', action: 'logout' };

      // Act
      fixture.componentInstance.onUserMenuClick(logoutItem as any);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Logging out...');
      consoleSpy.mockRestore();
    });
  });

  describe('bottom navigation interactions', () => {
    it('logs bottom nav item click', async () => {
      // Arrange
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const navItem = fixture.componentInstance.bottomNavItems[0];

      // Act
      fixture.componentInstance.onBottomNavClick(navItem);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Bottom nav item clicked:', navItem);
      consoleSpy.mockRestore();
    });

    it('handles clicking each bottom nav item', async () => {
      // Arrange
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      // Act
      fixture.componentInstance.bottomNavItems.forEach((item) => {
        fixture.componentInstance.onBottomNavClick(item);
        expect(consoleSpy).toHaveBeenCalledWith('Bottom nav item clicked:', item);
      });

      // Assert
      consoleSpy.mockRestore();
    });
  });

  describe('notifications signal updates', () => {
    it('updates notifications signal correctly', async () => {
      // Arrange
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      const initialCount = fixture.componentInstance.notifications().length;

      // Act
      fixture.componentInstance.notifications.update((notifications) => [
        ...notifications,
        {
          id: 'new-1',
          title: 'New notification',
          message: 'Test message',
          time: 'just now',
          read: false,
        },
      ]);

      // Assert
      expect(fixture.componentInstance.notifications().length).toBe(initialCount + 1);
    });

    it('preserves notification immutability when updating', async () => {
      // Arrange
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      const originalNotifications = [...fixture.componentInstance.notifications()];
      const firstNotification = originalNotifications[0];

      // Act
      fixture.componentInstance.onNotificationClick(firstNotification);

      const updatedFirstNotification = fixture.componentInstance.notifications()[0];

      // Assert
      expect(updatedFirstNotification.id).toBe(firstNotification.id);
    });
  });

  describe('edge cases', () => {
    it('handles undefined notification in onClick', async () => {
      // Arrange
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      // Act & Assert
      expect(() => {
        fixture.componentInstance.onNotificationClick({
          id: 'non-existent',
          title: 'Test',
          message: 'Test',
          time: 'now',
        });
      }).not.toThrow();

      consoleSpy.mockRestore();
    });

    it('handles special characters in search query', async () => {
      // Arrange
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const specialQuery = '<script>alert("test")</script>';

      // Act
      fixture.componentInstance.onSearchChange(specialQuery);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Search query:', specialQuery);

      consoleSpy.mockRestore();
    });

    it('maintains state after multiple toggle operations', async () => {
      // Arrange
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      // Act
      for (let i = 0; i < 10; i++) {
        fixture.componentInstance.toggleMobileMenu();
      }

      // Assert
      expect(fixture.componentInstance.isMobileMenuOpen()).toBe(false);
    });
  });

  describe('template rendering', () => {
    it('renders router outlet', async () => {
      // Arrange & Act
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      const routerOutlet = fixture.nativeElement.querySelector('router-outlet');

      // Assert
      expect(routerOutlet).toBeTruthy();
    });

    it('renders navbar component', async () => {
      // Arrange & Act
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      const navbar = fixture.nativeElement.querySelector('app-navbar');

      // Assert
      expect(navbar).toBeTruthy();
    });

    it('renders sidenav component', async () => {
      // Arrange & Act
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      const sidenav = fixture.nativeElement.querySelector('app-sidenav');

      // Assert
      expect(sidenav).toBeTruthy();
    });

    it('renders bottom navigation component', async () => {
      // Arrange & Act
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      const bottomNav = fixture.nativeElement.querySelector('app-bottom-navigation');

      // Assert
      expect(bottomNav).toBeTruthy();
    });

    it('renders toast container component', async () => {
      // Arrange & Act
      const { fixture } = await render(MainLayoutComponent, {
        imports: [
          MainLayoutComponent,
          NavbarComponent,
          SidenavComponent,
          BottomNavigationComponent,
          ToastContainerComponent,
        ],
        providers: defaultProviders,
      });

      const toastContainer = fixture.nativeElement.querySelector('app-toast-container');

      // Assert
      expect(toastContainer).toBeTruthy();
    });
  });
});
