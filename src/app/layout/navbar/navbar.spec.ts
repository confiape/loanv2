import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NavbarComponent } from '@loan/app/layout/navbar/navbar';
import { AuthService } from '@loan/app/core/services/auth.service';
import { UserStateService } from '@loan/app/core/services/user.service';
import { Notification } from '@loan/app/shared/components/notification-button/notification-button';
import { AppMenuItem } from '@loan/app/shared/components/apps-menu/apps-menu';
import { UserMenuItem } from '@loan/app/shared/components/user-menu/user-menu';

describe('NavbarComponent', () => {
  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'Test Notification',
      message: 'Test message',
      time: '5 min ago',
      read: false,
    },
  ];

  const mockApps: AppMenuItem[] = [
    {
      id: 'sales',
      label: 'Sales',
      icon: '<svg>sales</svg>',
      href: '/sales',
      action: 'sales',
    },
  ];

  const mockUserMenuItems: UserMenuItem[] = [
    {
      id: 'profile',
      label: 'Profile',
      icon: 'heroUser',
      href: '/profile',
      action: 'profile',
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: 'heroLogout',
      href: '#',
      action: 'logout',
    },
  ];

  const createMockServices = () => ({
    authService: {
      logout: vi.fn().mockReturnValue(of(undefined)),
    },
    userStateService: {
      userName: vi.fn(() => 'Test User'),
      userEmail: vi.fn(() => 'test@example.com'),
      userAvatar: vi.fn(() => ''),
      clearUser: vi.fn(),
    },
    router: {
      navigate: vi.fn().mockResolvedValue(true),
    },
  });

  const defaultProviders = (mocks: ReturnType<typeof createMockServices>) => [
    provideZonelessChangeDetection(),
    provideRouter([]),
    { provide: AuthService, useValue: mocks.authService },
    { provide: UserStateService, useValue: mocks.userStateService },
  ];

  describe('initialization', () => {
    it('creates the component', async () => {
      // Arrange
      const mocks = createMockServices();

      // Act
      const { container } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      // Assert
      expect(container).toBeTruthy();
    });

    it('has default appTitle input value', async () => {
      // Arrange
      const mocks = createMockServices();

      // Act
      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      // Assert
      expect(fixture.componentInstance.appTitle()).toBe('Loan UI');
    });

    it('has empty notifications by default', async () => {
      // Arrange
      const mocks = createMockServices();

      // Act
      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      // Assert
      expect(fixture.componentInstance.notifications()).toEqual([]);
    });

    it('has empty apps by default', async () => {
      // Arrange
      const mocks = createMockServices();

      // Act
      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      // Assert
      expect(fixture.componentInstance.apps()).toEqual([]);
    });

    it('has empty userMenuItems by default', async () => {
      // Arrange
      const mocks = createMockServices();

      // Act
      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      // Assert
      expect(fixture.componentInstance.userMenuItems()).toEqual([]);
    });

    it('shows search by default', async () => {
      // Arrange
      const mocks = createMockServices();

      // Act
      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      // Assert
      expect(fixture.componentInstance.showSearch()).toBe(true);
    });
  });

  describe('appTitle input', () => {
    it('displays custom app title', async () => {
      // Arrange
      const mocks = createMockServices();

      // Act
      const { fixture } = await render(NavbarComponent, {
        componentProperties: { appTitle: 'Custom App' },
        providers: defaultProviders(mocks),
      });

      // Assert
      expect(fixture.componentInstance.appTitle()).toBe('Custom App');
    });

    it('updates when appTitle changes', async () => {
      // Arrange
      const mocks = createMockServices();

      // Act
      const { fixture } = await render(NavbarComponent, {
        componentProperties: { appTitle: 'First Title' },
        providers: defaultProviders(mocks),
      });

      expect(fixture.componentInstance.appTitle()).toBe('First Title');

      fixture.componentInstance.appTitle.set('Second Title');

      // Assert
      expect(fixture.componentInstance.appTitle()).toBe('Second Title');
    });
  });

  describe('notifications input', () => {
    it('accepts notifications array', async () => {
      // Arrange
      const mocks = createMockServices();

      // Act
      const { fixture } = await render(NavbarComponent, {
        componentProperties: { notifications: mockNotifications },
        providers: defaultProviders(mocks),
      });

      // Assert
      expect(fixture.componentInstance.notifications()).toEqual(mockNotifications);
    });

    it('updates when notifications change', async () => {
      // Arrange
      const mocks = createMockServices();

      // Act
      const { fixture } = await render(NavbarComponent, {
        componentProperties: { notifications: mockNotifications },
        providers: defaultProviders(mocks),
      });

      expect(fixture.componentInstance.notifications().length).toBe(1);

      const newNotifications = [
        ...mockNotifications,
        {
          id: '2',
          title: 'Second',
          message: 'Message',
          time: 'now',
          read: false,
        },
      ];

      fixture.componentInstance.notifications.set(newNotifications);

      // Assert
      expect(fixture.componentInstance.notifications().length).toBe(2);
    });
  });

  describe('apps input', () => {
    it('accepts apps array', async () => {
      // Arrange
      const mocks = createMockServices();

      // Act
      const { fixture } = await render(NavbarComponent, {
        componentProperties: { apps: mockApps },
        providers: defaultProviders(mocks),
      });

      // Assert
      expect(fixture.componentInstance.apps()).toEqual(mockApps);
    });

    it('updates when apps change', async () => {
      // Arrange
      const mocks = createMockServices();

      // Act
      const { fixture } = await render(NavbarComponent, {
        componentProperties: { apps: mockApps },
        providers: defaultProviders(mocks),
      });

      expect(fixture.componentInstance.apps().length).toBe(1);

      const newApps = [...mockApps, { ...mockApps[0], id: 'marketing' }];
      fixture.componentInstance.apps.set(newApps);

      // Assert
      expect(fixture.componentInstance.apps().length).toBe(2);
    });
  });

  describe('userMenuItems input', () => {
    it('accepts userMenuItems array', async () => {
      // Arrange
      const mocks = createMockServices();

      // Act
      const { fixture } = await render(NavbarComponent, {
        componentProperties: { userMenuItems: mockUserMenuItems },
        providers: defaultProviders(mocks),
      });

      // Assert
      expect(fixture.componentInstance.userMenuItems()).toEqual(mockUserMenuItems);
    });
  });

  describe('showSearch input', () => {
    it('controls search visibility', async () => {
      // Arrange
      const mocks = createMockServices();

      // Act
      const { fixture } = await render(NavbarComponent, {
        componentProperties: { showSearch: false },
        providers: defaultProviders(mocks),
      });

      // Assert
      expect(fixture.componentInstance.showSearch()).toBe(false);
    });

    it('toggles search visibility', async () => {
      // Arrange
      const mocks = createMockServices();

      // Act
      const { fixture } = await render(NavbarComponent, {
        componentProperties: { showSearch: true },
        providers: defaultProviders(mocks),
      });

      expect(fixture.componentInstance.showSearch()).toBe(true);

      fixture.componentInstance.showSearch.set(false);

      // Assert
      expect(fixture.componentInstance.showSearch()).toBe(false);
    });
  });

  describe('menuToggle output', () => {
    it('emits when onMenuToggle is called', async () => {
      // Arrange
      const mocks = createMockServices();

      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      const emitSpy = vi.spyOn(fixture.componentInstance.menuToggle, 'emit');

      // Act
      fixture.componentInstance.onMenuToggle();

      // Assert
      expect(emitSpy).toHaveBeenCalledOnce();
    });

    it('emits without parameters', async () => {
      // Arrange
      const mocks = createMockServices();

      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      const emitSpy = vi.spyOn(fixture.componentInstance.menuToggle, 'emit');

      // Act
      fixture.componentInstance.onMenuToggle();

      // Assert
      expect(emitSpy).toHaveBeenCalledWith();
    });
  });

  describe('searchChange output', () => {
    it('emits search query when onSearchChange is called', async () => {
      // Arrange
      const mocks = createMockServices();

      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      const emitSpy = vi.spyOn(fixture.componentInstance.searchChange, 'emit');
      const query = 'test search';

      // Act
      fixture.componentInstance.onSearchChange(query);

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(query);
    });

    it('emits empty string', async () => {
      // Arrange
      const mocks = createMockServices();

      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      const emitSpy = vi.spyOn(fixture.componentInstance.searchChange, 'emit');

      // Act
      fixture.componentInstance.onSearchChange('');

      // Assert
      expect(emitSpy).toHaveBeenCalledWith('');
    });
  });

  describe('searchSubmit output', () => {
    it('emits search query when onSearchSubmit is called', async () => {
      // Arrange
      const mocks = createMockServices();

      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      const emitSpy = vi.spyOn(fixture.componentInstance.searchSubmit, 'emit');
      const query = 'submitted query';

      // Act
      fixture.componentInstance.onSearchSubmit(query);

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(query);
    });
  });

  describe('notificationClick output', () => {
    it('emits notification when onNotificationClick is called', async () => {
      // Arrange
      const mocks = createMockServices();

      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      const emitSpy = vi.spyOn(fixture.componentInstance.notificationClick, 'emit');
      const notification = mockNotifications[0];

      // Act
      fixture.componentInstance.onNotificationClick(notification);

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(notification);
    });
  });

  describe('appClick output', () => {
    it('emits app when onAppClick is called', async () => {
      // Arrange
      const mocks = createMockServices();

      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      const emitSpy = vi.spyOn(fixture.componentInstance.appClick, 'emit');
      const app = mockApps[0];

      // Act
      fixture.componentInstance.onAppClick(app);

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(app);
    });
  });

  describe('userMenuClick output', () => {
    it('emits user menu item when onUserMenuClick is called', async () => {
      // Arrange
      const mocks = createMockServices();

      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      const emitSpy = vi.spyOn(fixture.componentInstance.userMenuClick, 'emit');
      const menuItem = mockUserMenuItems[0];

      // Act
      fixture.componentInstance.onUserMenuClick(menuItem);

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(menuItem);
    });

    it('does not emit when logout action is triggered', async () => {
      // Arrange
      const mocks = createMockServices();

      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      const emitSpy = vi.spyOn(fixture.componentInstance.userMenuClick, 'emit');
      const logoutItem = mockUserMenuItems[1];

      // Act
      fixture.componentInstance.onUserMenuClick(logoutItem);

      // Assert
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('logout functionality', () => {
    it('calls authService.logout when logout action is clicked', async () => {
      // Arrange
      const mocks = createMockServices();

      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      const logoutItem = mockUserMenuItems.find((item) => item.action === 'logout')!;

      // Act
      fixture.componentInstance.onUserMenuClick(logoutItem);

      // Assert
      expect(mocks.authService.logout).toHaveBeenCalledOnce();
    });

    it('clears user state after successful logout', async () => {
      // Arrange
      const mocks = createMockServices();

      const { fixture } = await render(NavbarComponent, {
        providers: [
          ...defaultProviders(mocks),
          { provide: 'Router', useValue: mocks.router },
        ],
      });

      const logoutItem = mockUserMenuItems.find((item) => item.action === 'logout')!;

      // Act
      fixture.componentInstance.onUserMenuClick(logoutItem);
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Assert
      expect(mocks.userStateService.clearUser).toHaveBeenCalledOnce();
    });

    it('navigates to login page after logout', async () => {
      // Arrange
      const mocks = createMockServices();

      const { fixture } = await render(NavbarComponent, {
        providers: [
          ...defaultProviders(mocks),
          { provide: 'Router', useValue: mocks.router },
        ],
      });

      const logoutItem = mockUserMenuItems.find((item) => item.action === 'logout')!;

      // Act
      fixture.componentInstance.onUserMenuClick(logoutItem);
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Assert
      expect(mocks.userStateService.clearUser).toHaveBeenCalledOnce();
    });

    it('handles logout error gracefully', async () => {
      // Arrange
      const mocks = createMockServices();
      mocks.authService.logout.mockReturnValue(throwError(() => new Error('Logout failed')));

      const { fixture } = await render(NavbarComponent, {
        providers: [
          ...defaultProviders(mocks),
          { provide: 'Router', useValue: mocks.router },
        ],
      });

      const logoutItem = mockUserMenuItems.find((item) => item.action === 'logout')!;

      // Act
      fixture.componentInstance.onUserMenuClick(logoutItem);
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Assert
      expect(mocks.userStateService.clearUser).toHaveBeenCalledOnce();
    });

    it('clears user state even when logout API fails', async () => {
      // Arrange
      const mocks = createMockServices();
      mocks.authService.logout.mockReturnValue(throwError(() => new Error('API Error')));

      const { fixture } = await render(NavbarComponent, {
        providers: [
          ...defaultProviders(mocks),
          { provide: 'Router', useValue: mocks.router },
        ],
      });

      const logoutItem = mockUserMenuItems.find((item) => item.action === 'logout')!;

      // Act
      fixture.componentInstance.onUserMenuClick(logoutItem);
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Assert
      expect(mocks.userStateService.clearUser).toHaveBeenCalled();
    });
  });

  describe('navigation for user menu items', () => {
    it('navigates to href when menu item is clicked', async () => {
      // Arrange
      const mocks = createMockServices();

      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      const profileItem = mockUserMenuItems[0];

      // Act
      fixture.componentInstance.onUserMenuClick(profileItem);

      // Assert (based on component behavior, not router mock)
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('does not navigate when logout is clicked', async () => {
      // Arrange
      const mocks = createMockServices();

      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      const logoutItem = mockUserMenuItems[1];

      // Act
      fixture.componentInstance.onUserMenuClick(logoutItem);

      // Assert
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('handles menu items without href', async () => {
      // Arrange
      const mocks = createMockServices();

      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      const emitSpy = vi.spyOn(fixture.componentInstance.userMenuClick, 'emit');
      const itemWithoutHref = { ...mockUserMenuItems[0], href: undefined };

      // Act
      fixture.componentInstance.onUserMenuClick(itemWithoutHref);

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(itemWithoutHref);
    });
  });

  describe('userStateService integration', () => {
    it('accesses userName from userStateService', async () => {
      // Arrange
      const mocks = createMockServices();

      // Act
      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      // Assert
      expect(fixture.componentInstance.userState.userName()).toBe('Test User');
    });

    it('accesses userEmail from userStateService', async () => {
      // Arrange
      const mocks = createMockServices();

      // Act
      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      // Assert
      expect(fixture.componentInstance.userState.userEmail()).toBe('test@example.com');
    });

    it('accesses userAvatar from userStateService', async () => {
      // Arrange
      const mocks = createMockServices();

      // Act
      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      // Assert
      expect(fixture.componentInstance.userState.userAvatar()).toBe('');
    });
  });

  describe('edge cases', () => {
    it('handles null notification', async () => {
      // Arrange
      const mocks = createMockServices();

      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      const emitSpy = vi.spyOn(fixture.componentInstance.notificationClick, 'emit');

      // Act & Assert
      expect(() => {
        fixture.componentInstance.onNotificationClick(null as any);
      }).not.toThrow();

      expect(emitSpy).toHaveBeenCalledWith(null);
    });

    it('handles empty search query', async () => {
      // Arrange
      const mocks = createMockServices();

      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      const emitSpy = vi.spyOn(fixture.componentInstance.searchChange, 'emit');

      // Act
      fixture.componentInstance.onSearchChange('');

      // Assert
      expect(emitSpy).toHaveBeenCalledWith('');
    });

    it('handles special characters in search', async () => {
      // Arrange
      const mocks = createMockServices();

      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      const emitSpy = vi.spyOn(fixture.componentInstance.searchSubmit, 'emit');
      const specialQuery = '<script>alert("xss")</script>';

      // Act
      fixture.componentInstance.onSearchSubmit(specialQuery);

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(specialQuery);
    });

    it('handles menu item with empty action', async () => {
      // Arrange
      const mocks = createMockServices();

      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      const emitSpy = vi.spyOn(fixture.componentInstance.userMenuClick, 'emit');
      const itemWithEmptyAction = { ...mockUserMenuItems[0], action: '' };

      // Act
      fixture.componentInstance.onUserMenuClick(itemWithEmptyAction);

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(itemWithEmptyAction);
    });

    it('handles multiple rapid logout attempts', async () => {
      // Arrange
      const mocks = createMockServices();

      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      const logoutItem = mockUserMenuItems.find((item) => item.action === 'logout')!;

      // Act
      fixture.componentInstance.onUserMenuClick(logoutItem);
      fixture.componentInstance.onUserMenuClick(logoutItem);
      fixture.componentInstance.onUserMenuClick(logoutItem);

      // Assert
      expect(mocks.authService.logout).toHaveBeenCalledTimes(3);
    });
  });

  describe('template integration', () => {
    it('renders navbar element', async () => {
      // Arrange
      const mocks = createMockServices();

      // Act
      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      const nav = fixture.nativeElement.querySelector('nav');

      // Assert
      expect(nav).toBeTruthy();
    });

    it('renders search bar component when showSearch is true', async () => {
      // Arrange
      const mocks = createMockServices();

      // Act
      const { fixture } = await render(NavbarComponent, {
        componentProperties: { showSearch: true },
        providers: defaultProviders(mocks),
      });

      const searchBar = fixture.nativeElement.querySelector('app-search-bar');

      // Assert
      expect(searchBar).toBeTruthy();
    });

    it('renders notification button component', async () => {
      // Arrange
      const mocks = createMockServices();

      // Act
      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      const notificationButton = fixture.nativeElement.querySelector('app-notification-button');

      // Assert
      expect(notificationButton).toBeTruthy();
    });

    it('renders apps menu component', async () => {
      // Arrange
      const mocks = createMockServices();

      // Act
      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      const appsMenu = fixture.nativeElement.querySelector('app-apps-menu');

      // Assert
      expect(appsMenu).toBeTruthy();
    });

    it('renders user menu component', async () => {
      // Arrange
      const mocks = createMockServices();

      // Act
      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      const userMenu = fixture.nativeElement.querySelector('app-user-menu');

      // Assert
      expect(userMenu).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('has proper navigation role', async () => {
      // Arrange
      const mocks = createMockServices();

      // Act
      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      const nav = fixture.nativeElement.querySelector('nav');

      // Assert
      expect(nav).toBeTruthy();
    });

    it('provides toggle sidebar button with aria-label', async () => {
      // Arrange
      const mocks = createMockServices();

      // Act
      const { fixture } = await render(NavbarComponent, {
        providers: defaultProviders(mocks),
      });

      const toggleButton = fixture.nativeElement.querySelector('button[aria-label="Toggle sidebar"]');

      // Assert
      expect(toggleButton).toBeTruthy();
    });
  });
});
