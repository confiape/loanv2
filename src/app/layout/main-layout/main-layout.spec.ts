import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
  let fixture: ComponentFixture<MainLayoutComponent>;
  let component: MainLayoutComponent;
  let host: HTMLElement;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MainLayoutComponent,
        NavbarComponent,
        SidenavComponent,
        BottomNavigationComponent,
        ToastContainerComponent,
      ],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserStateService, useValue: mockUserStateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    host = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  describe('initialization', () => {
    it('creates the component', () => {
      expect(component).toBeDefined();
    });

    it('initializes with default configuration values', () => {
      expect(component.appTitle).toBe('Loan UI');
      expect(component.userName).toBe('Warren Martinez');
      expect(component.userEmail).toBe('warren@loanui.com');
      expect(component.userAvatar).toBe('');
    });

    it('loads sidenav items from config', () => {
      expect(component.sidenavItems).toBeDefined();
      expect(Array.isArray(component.sidenavItems)).toBe(true);
      expect(component.sidenavItems.length).toBeGreaterThan(0);
    });

    it('loads apps menu items from config', () => {
      expect(component.appsMenuItems).toBeDefined();
      expect(Array.isArray(component.appsMenuItems)).toBe(true);
      expect(component.appsMenuItems.length).toBeGreaterThan(0);
    });

    it('loads user menu items from config', () => {
      expect(component.userMenuItems).toBeDefined();
      expect(Array.isArray(component.userMenuItems)).toBe(true);
      expect(component.userMenuItems.length).toBeGreaterThan(0);
    });

    it('loads bottom navigation items from config', () => {
      expect(component.bottomNavItems).toBeDefined();
      expect(Array.isArray(component.bottomNavItems)).toBe(true);
      expect(component.bottomNavItems.length).toBeGreaterThan(0);
    });

    it('initializes notifications signal with mock data', () => {
      const notifications = component.notifications();
      expect(Array.isArray(notifications)).toBe(true);
      expect(notifications.length).toBeGreaterThan(0);
    });

    it('initializes mobile menu as closed', () => {
      expect(component.isMobileMenuOpen()).toBe(false);
    });
  });

  describe('mobile menu state', () => {
    it('toggles mobile menu state', () => {
      expect(component.isMobileMenuOpen()).toBe(false);

      component.toggleMobileMenu();
      expect(component.isMobileMenuOpen()).toBe(true);

      component.toggleMobileMenu();
      expect(component.isMobileMenuOpen()).toBe(false);
    });

    it('closes mobile menu when closeMobileMenu is called', () => {
      component.toggleMobileMenu();
      expect(component.isMobileMenuOpen()).toBe(true);

      component.closeMobileMenu();
      expect(component.isMobileMenuOpen()).toBe(false);
    });

    it('sets mobile menu to closed state explicitly', () => {
      component.isMobileMenuOpen.set(true);
      expect(component.isMobileMenuOpen()).toBe(true);

      component.closeMobileMenu();
      expect(component.isMobileMenuOpen()).toBe(false);
    });
  });

  describe('sidenav interactions', () => {
    it('logs sidenav item click and closes mobile menu', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      component.isMobileMenuOpen.set(true);

      const testItem = component.sidenavItems[0];
      component.onSidenavItemClick(testItem);

      expect(consoleSpy).toHaveBeenCalledWith('Sidenav item clicked:', testItem);
      expect(component.isMobileMenuOpen()).toBe(false);

      consoleSpy.mockRestore();
    });

    it('closes mobile menu when navigating via sidenav', () => {
      component.isMobileMenuOpen.set(true);
      const testItem = component.sidenavItems[0];

      component.onSidenavItemClick(testItem);

      expect(component.isMobileMenuOpen()).toBe(false);
    });
  });

  describe('search functionality', () => {
    it('logs search query changes', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const query = 'test query';

      component.onSearchChange(query);

      expect(consoleSpy).toHaveBeenCalledWith('Search query:', query);
      consoleSpy.mockRestore();
    });

    it('logs search submission', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const query = 'submitted query';

      component.onSearchSubmit(query);

      expect(consoleSpy).toHaveBeenCalledWith('Search submitted:', query);
      consoleSpy.mockRestore();
    });

    it('handles empty search query', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      component.onSearchChange('');
      expect(consoleSpy).toHaveBeenCalledWith('Search query:', '');

      consoleSpy.mockRestore();
    });
  });

  describe('notification handling', () => {
    it('marks notification as read when clicked', () => {
      const unreadNotification = component.notifications().find((n) => !n.read);
      expect(unreadNotification).toBeDefined();

      const notificationId = unreadNotification!.id;
      component.onNotificationClick(unreadNotification!);

      const updatedNotification = component.notifications().find((n) => n.id === notificationId);
      expect(updatedNotification?.read).toBe(true);
    });

    it('logs notification click', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const notification = component.notifications()[0];

      component.onNotificationClick(notification);

      expect(consoleSpy).toHaveBeenCalledWith('Notification clicked:', notification);
      consoleSpy.mockRestore();
    });

    it('does not affect other notifications when marking one as read', () => {
      const notifications = component.notifications();
      const firstNotification = notifications[0];
      const totalCount = notifications.length;

      component.onNotificationClick(firstNotification);

      const updatedNotifications = component.notifications();
      expect(updatedNotifications.length).toBe(totalCount);
    });

    it('marks all notifications as read', () => {
      component.onMarkAllAsRead();

      const allNotifications = component.notifications();
      const allRead = allNotifications.every((n) => n.read === true);
      expect(allRead).toBe(true);
    });

    it('handles marking already read notifications', () => {
      component.onMarkAllAsRead();
      const countBefore = component.notifications().length;

      component.onMarkAllAsRead();
      const countAfter = component.notifications().length;

      expect(countAfter).toBe(countBefore);
    });
  });

  describe('apps menu interactions', () => {
    it('logs app click', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const app = component.appsMenuItems[0];

      component.onAppClick(app);

      expect(consoleSpy).toHaveBeenCalledWith('App clicked:', app);
      consoleSpy.mockRestore();
    });

    it('handles clicking each app in menu', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      component.appsMenuItems.forEach((app) => {
        component.onAppClick(app);
        expect(consoleSpy).toHaveBeenCalledWith('App clicked:', app);
      });

      consoleSpy.mockRestore();
    });
  });

  describe('user menu interactions', () => {
    it('logs user menu item click', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const menuItem = component.userMenuItems.find((item) => item.action !== 'logout')!;

      component.onUserMenuClick(menuItem);

      expect(consoleSpy).toHaveBeenCalledWith('User menu item clicked:', menuItem);
      consoleSpy.mockRestore();
    });

    it('handles logout action specifically', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const logoutItem = component.userMenuItems.find((item) => item.action === 'logout')!;

      component.onUserMenuClick(logoutItem);

      expect(consoleSpy).toHaveBeenCalledWith('User menu item clicked:', logoutItem);
      expect(consoleSpy).toHaveBeenCalledWith('Logging out...');
      consoleSpy.mockRestore();
    });

    it('identifies logout action correctly', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const logoutItem = { id: 'logout', label: 'Logout', action: 'logout' };

      component.onUserMenuClick(logoutItem as any);

      expect(consoleSpy).toHaveBeenCalledWith('Logging out...');
      consoleSpy.mockRestore();
    });
  });

  describe('bottom navigation interactions', () => {
    it('logs bottom nav item click', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const navItem = component.bottomNavItems[0];

      component.onBottomNavClick(navItem);

      expect(consoleSpy).toHaveBeenCalledWith('Bottom nav item clicked:', navItem);
      consoleSpy.mockRestore();
    });

    it('handles clicking each bottom nav item', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      component.bottomNavItems.forEach((item) => {
        component.onBottomNavClick(item);
        expect(consoleSpy).toHaveBeenCalledWith('Bottom nav item clicked:', item);
      });

      consoleSpy.mockRestore();
    });
  });

  describe('notifications signal updates', () => {
    it('updates notifications signal correctly', () => {
      const initialCount = component.notifications().length;

      component.notifications.update((notifications) => [
        ...notifications,
        {
          id: 'new-1',
          title: 'New notification',
          message: 'Test message',
          time: 'just now',
          read: false,
        },
      ]);

      expect(component.notifications().length).toBe(initialCount + 1);
    });

    it('preserves notification immutability when updating', () => {
      const originalNotifications = [...component.notifications()];
      const firstNotification = originalNotifications[0];

      component.onNotificationClick(firstNotification);

      const updatedFirstNotification = component.notifications()[0];
      expect(updatedFirstNotification.id).toBe(firstNotification.id);
    });
  });

  describe('edge cases', () => {
    it('handles undefined notification in onClick', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      expect(() => {
        component.onNotificationClick({
          id: 'non-existent',
          title: 'Test',
          message: 'Test',
          time: 'now',
        });
      }).not.toThrow();

      consoleSpy.mockRestore();
    });

    it('handles special characters in search query', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const specialQuery = '<script>alert("test")</script>';

      component.onSearchChange(specialQuery);
      expect(consoleSpy).toHaveBeenCalledWith('Search query:', specialQuery);

      consoleSpy.mockRestore();
    });

    it('maintains state after multiple toggle operations', () => {
      for (let i = 0; i < 10; i++) {
        component.toggleMobileMenu();
      }
      expect(component.isMobileMenuOpen()).toBe(false);
    });
  });

  describe('template rendering', () => {
    it('renders router outlet', () => {
      const routerOutlet = host.querySelector('router-outlet');
      expect(routerOutlet).toBeTruthy();
    });

    it('renders navbar component', () => {
      const navbar = host.querySelector('app-navbar');
      expect(navbar).toBeTruthy();
    });

    it('renders sidenav component', () => {
      const sidenav = host.querySelector('app-sidenav');
      expect(sidenav).toBeTruthy();
    });

    it('renders bottom navigation component', () => {
      const bottomNav = host.querySelector('app-bottom-navigation');
      expect(bottomNav).toBeTruthy();
    });

    it('renders toast container component', () => {
      const toastContainer = host.querySelector('app-toast-container');
      expect(toastContainer).toBeTruthy();
    });
  });
});
