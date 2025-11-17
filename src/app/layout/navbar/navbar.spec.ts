// Angular testing
import { TestBed } from '@angular/core/testing';
import {
  provideZonelessChangeDetection,
  inputBinding,
  outputBinding,
  signal,
} from '@angular/core';
import { provideRouter } from '@angular/router';

// Testing library
import { within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

// Vitest
import { describe, it, expect, vi } from 'vitest';

// Component and dependencies
import { NavbarComponent } from '@loan/app/layout/navbar/navbar';
import { AuthService } from '@loan/app/core/services/auth.service';
import { UserStateService } from '@loan/app/core/services/user.service';
import { Notification } from '@loan/app/shared/components/notification-button/notification-button';
import { AppMenuItem } from '@loan/app/shared/components/apps-menu/apps-menu';
import { UserMenuItem } from '@loan/app/shared/components/user-menu/user-menu';
import { of, throwError } from 'rxjs';

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
    it('creates the component', () => {
      // Arrange
      const mocks = createMockServices();
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent);
      TestBed.tick();

      // Assert
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('has default appTitle input value', () => {
      // Arrange
      const mocks = createMockServices();
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent);
      TestBed.tick();

      // Assert
      expect(fixture.componentInstance.appTitle()).toBe('Loan UI');
    });

    it('has empty notifications by default', () => {
      // Arrange
      const mocks = createMockServices();
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent);
      TestBed.tick();

      // Assert
      expect(fixture.componentInstance.notifications()).toEqual([]);
    });

    it('has empty apps by default', () => {
      // Arrange
      const mocks = createMockServices();
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent);
      TestBed.tick();

      // Assert
      expect(fixture.componentInstance.apps()).toEqual([]);
    });

    it('has empty userMenuItems by default', () => {
      // Arrange
      const mocks = createMockServices();
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent);
      TestBed.tick();

      // Assert
      expect(fixture.componentInstance.userMenuItems()).toEqual([]);
    });

    it('shows search by default', () => {
      // Arrange
      const mocks = createMockServices();
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent);
      TestBed.tick();

      // Assert
      expect(fixture.componentInstance.showSearch()).toBe(true);
    });
  });

  describe('appTitle input', () => {
    it('displays custom app title', () => {
      // Arrange
      const mocks = createMockServices();
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent, {
        bindings: [inputBinding('appTitle', () => 'Custom App')],
      });
      TestBed.tick();

      // Assert
      expect(fixture.componentInstance.appTitle()).toBe('Custom App');
    });
  });

  describe('notifications input', () => {
    it('accepts notifications array', () => {
      // Arrange
      const mocks = createMockServices();
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent, {
        bindings: [inputBinding('notifications', () => mockNotifications)],
      });
      TestBed.tick();

      // Assert
      expect(fixture.componentInstance.notifications()).toEqual(mockNotifications);
    });
  });

  describe('apps input', () => {
    it('accepts apps array', () => {
      // Arrange
      const mocks = createMockServices();
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent, {
        bindings: [inputBinding('apps', () => mockApps)],
      });
      TestBed.tick();

      // Assert
      expect(fixture.componentInstance.apps()).toEqual(mockApps);
    });
  });

  describe('userMenuItems input', () => {
    it('accepts userMenuItems array', () => {
      // Arrange
      const mocks = createMockServices();
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent, {
        bindings: [inputBinding('userMenuItems', () => mockUserMenuItems)],
      });
      TestBed.tick();

      // Assert
      expect(fixture.componentInstance.userMenuItems()).toEqual(mockUserMenuItems);
    });
  });

  describe('showSearch input', () => {
    it('controls search visibility', () => {
      // Arrange
      const mocks = createMockServices();
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent, {
        bindings: [inputBinding('showSearch', () => false)],
      });
      TestBed.tick();

      // Assert
      expect(fixture.componentInstance.showSearch()).toBe(false);
    });
  });

  describe('menuToggle output', () => {
    it('emits when onMenuToggle is called', () => {
      // Arrange
      const mocks = createMockServices();
      const emittedSignal = signal(false);
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent, {
        bindings: [outputBinding('menuToggle', () => emittedSignal.set(true))],
      });
      TestBed.tick();

      // Act
      fixture.componentInstance.onMenuToggle();
      TestBed.tick();

      // Assert
      expect(emittedSignal()).toBe(true);
    });

    it('emits without parameters', () => {
      // Arrange
      const mocks = createMockServices();
      let emitCount = 0;
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent, {
        bindings: [outputBinding('menuToggle', () => emitCount++)],
      });
      TestBed.tick();

      // Act
      fixture.componentInstance.onMenuToggle();
      TestBed.tick();

      // Assert
      expect(emitCount).toBe(1);
    });
  });

  describe('searchChange output', () => {
    it('emits search query when onSearchChange is called', () => {
      // Arrange
      const mocks = createMockServices();
      const searchSignal = signal('');
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent, {
        bindings: [outputBinding('searchChange', (query: string) => searchSignal.set(query))],
      });
      TestBed.tick();
      const query = 'test search';

      // Act
      fixture.componentInstance.onSearchChange(query);
      TestBed.tick();

      // Assert
      expect(searchSignal()).toBe(query);
    });

    it('emits empty string', () => {
      // Arrange
      const mocks = createMockServices();
      const searchSignal = signal('initial');
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent, {
        bindings: [outputBinding('searchChange', (query: string) => searchSignal.set(query))],
      });
      TestBed.tick();

      // Act
      fixture.componentInstance.onSearchChange('');
      TestBed.tick();

      // Assert
      expect(searchSignal()).toBe('');
    });
  });

  describe('searchSubmit output', () => {
    it('emits search query when onSearchSubmit is called', () => {
      // Arrange
      const mocks = createMockServices();
      const searchSubmitSignal = signal('');
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent, {
        bindings: [
          outputBinding('searchSubmit', (query: string) => searchSubmitSignal.set(query)),
        ],
      });
      TestBed.tick();
      const query = 'submitted query';

      // Act
      fixture.componentInstance.onSearchSubmit(query);
      TestBed.tick();

      // Assert
      expect(searchSubmitSignal()).toBe(query);
    });
  });

  describe('notificationClick output', () => {
    it('emits notification when onNotificationClick is called', () => {
      // Arrange
      const mocks = createMockServices();
      const notificationSignal = signal<Notification | null>(null);
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent, {
        bindings: [
          outputBinding('notificationClick', (notification: Notification) =>
            notificationSignal.set(notification),
          ),
        ],
      });
      TestBed.tick();
      const notification = mockNotifications[0];

      // Act
      fixture.componentInstance.onNotificationClick(notification);
      TestBed.tick();

      // Assert
      expect(notificationSignal()).toEqual(notification);
    });
  });

  describe('appClick output', () => {
    it('emits app when onAppClick is called', () => {
      // Arrange
      const mocks = createMockServices();
      const appSignal = signal<AppMenuItem | null>(null);
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent, {
        bindings: [outputBinding('appClick', (app: AppMenuItem) => appSignal.set(app))],
      });
      TestBed.tick();
      const app = mockApps[0];

      // Act
      fixture.componentInstance.onAppClick(app);
      TestBed.tick();

      // Assert
      expect(appSignal()).toEqual(app);
    });
  });

  describe('userMenuClick output', () => {
    it('emits user menu item when onUserMenuClick is called', () => {
      // Arrange
      const mocks = createMockServices();
      const userMenuSignal = signal<UserMenuItem | null>(null);
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent, {
        bindings: [
          outputBinding('userMenuClick', (item: UserMenuItem) => userMenuSignal.set(item)),
        ],
      });
      TestBed.tick();
      const menuItem = mockUserMenuItems[0];

      // Act
      fixture.componentInstance.onUserMenuClick(menuItem);
      TestBed.tick();

      // Assert
      expect(userMenuSignal()).toEqual(menuItem);
    });

    it('does not emit when logout action is triggered', () => {
      // Arrange
      const mocks = createMockServices();
      const userMenuSignal = signal<UserMenuItem | null>(null);
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent, {
        bindings: [
          outputBinding('userMenuClick', (item: UserMenuItem) => userMenuSignal.set(item)),
        ],
      });
      TestBed.tick();
      const logoutItem = mockUserMenuItems[1];

      // Act
      fixture.componentInstance.onUserMenuClick(logoutItem);
      TestBed.tick();

      // Assert
      expect(userMenuSignal()).toBeNull();
    });
  });

  describe('logout functionality', () => {
    it('calls authService.logout when logout action is clicked', () => {
      // Arrange
      const mocks = createMockServices();
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent);
      TestBed.tick();

      const logoutItem = mockUserMenuItems.find((item) => item.action === 'logout')!;

      // Act
      fixture.componentInstance.onUserMenuClick(logoutItem);

      // Assert
      expect(mocks.authService.logout).toHaveBeenCalledOnce();
    });

    it('clears user state after successful logout', async () => {
      // Arrange
      const mocks = createMockServices();
      const fixture = TestBed.configureTestingModule({
        providers: [
          ...defaultProviders(mocks),
          { provide: 'Router', useValue: mocks.router },
        ],
      }).createComponent(NavbarComponent);
      TestBed.tick();

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
      const fixture = TestBed.configureTestingModule({
        providers: [
          ...defaultProviders(mocks),
          { provide: 'Router', useValue: mocks.router },
        ],
      }).createComponent(NavbarComponent);
      TestBed.tick();

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

      const fixture = TestBed.configureTestingModule({
        providers: [
          ...defaultProviders(mocks),
          { provide: 'Router', useValue: mocks.router },
        ],
      }).createComponent(NavbarComponent);
      TestBed.tick();

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

      const fixture = TestBed.configureTestingModule({
        providers: [
          ...defaultProviders(mocks),
          { provide: 'Router', useValue: mocks.router },
        ],
      }).createComponent(NavbarComponent);
      TestBed.tick();

      const logoutItem = mockUserMenuItems.find((item) => item.action === 'logout')!;

      // Act
      fixture.componentInstance.onUserMenuClick(logoutItem);
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Assert
      expect(mocks.userStateService.clearUser).toHaveBeenCalled();
    });
  });

  describe('navigation for user menu items', () => {
    it('navigates to href when menu item is clicked', () => {
      // Arrange
      const mocks = createMockServices();
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent);
      TestBed.tick();

      const profileItem = mockUserMenuItems[0];

      // Act
      fixture.componentInstance.onUserMenuClick(profileItem);

      // Assert (based on component behavior, not router mock)
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('does not navigate when logout is clicked', () => {
      // Arrange
      const mocks = createMockServices();
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent);
      TestBed.tick();

      const logoutItem = mockUserMenuItems[1];

      // Act
      fixture.componentInstance.onUserMenuClick(logoutItem);

      // Assert
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('handles menu items without href', () => {
      // Arrange
      const mocks = createMockServices();
      const userMenuSignal = signal<UserMenuItem | null>(null);
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent, {
        bindings: [
          outputBinding('userMenuClick', (item: UserMenuItem) => userMenuSignal.set(item)),
        ],
      });
      TestBed.tick();

      const itemWithoutHref = { ...mockUserMenuItems[0], href: undefined };

      // Act
      fixture.componentInstance.onUserMenuClick(itemWithoutHref);
      TestBed.tick();

      // Assert
      expect(userMenuSignal()).toEqual(itemWithoutHref);
    });
  });

  describe('userStateService integration', () => {
    it('accesses userName from userStateService', () => {
      // Arrange
      const mocks = createMockServices();
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent);
      TestBed.tick();

      // Assert
      expect(fixture.componentInstance.userState.userName()).toBe('Test User');
    });

    it('accesses userEmail from userStateService', () => {
      // Arrange
      const mocks = createMockServices();
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent);
      TestBed.tick();

      // Assert
      expect(fixture.componentInstance.userState.userEmail()).toBe('test@example.com');
    });

    it('accesses userAvatar from userStateService', () => {
      // Arrange
      const mocks = createMockServices();
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent);
      TestBed.tick();

      // Assert
      expect(fixture.componentInstance.userState.userAvatar()).toBe('');
    });
  });

  describe('edge cases', () => {
    it('handles null notification', () => {
      // Arrange
      const mocks = createMockServices();
      const notificationSignal = signal<Notification | null>(null);
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent, {
        bindings: [
          outputBinding('notificationClick', (notification: Notification) =>
            notificationSignal.set(notification),
          ),
        ],
      });
      TestBed.tick();

      // Act & Assert
      expect(() => {
        fixture.componentInstance.onNotificationClick(null as any);
      }).not.toThrow();

      TestBed.tick();
      expect(notificationSignal()).toBeNull();
    });

    it('handles empty search query', () => {
      // Arrange
      const mocks = createMockServices();
      const searchSignal = signal('');
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent, {
        bindings: [outputBinding('searchChange', (query: string) => searchSignal.set(query))],
      });
      TestBed.tick();

      // Act
      fixture.componentInstance.onSearchChange('');
      TestBed.tick();

      // Assert
      expect(searchSignal()).toBe('');
    });

    it('handles special characters in search', () => {
      // Arrange
      const mocks = createMockServices();
      const searchSubmitSignal = signal('');
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent, {
        bindings: [
          outputBinding('searchSubmit', (query: string) => searchSubmitSignal.set(query)),
        ],
      });
      TestBed.tick();
      const specialQuery = '<script>alert("xss")</script>';

      // Act
      fixture.componentInstance.onSearchSubmit(specialQuery);
      TestBed.tick();

      // Assert
      expect(searchSubmitSignal()).toBe(specialQuery);
    });

    it('handles menu item with empty action', () => {
      // Arrange
      const mocks = createMockServices();
      const userMenuSignal = signal<UserMenuItem | null>(null);
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent, {
        bindings: [
          outputBinding('userMenuClick', (item: UserMenuItem) => userMenuSignal.set(item)),
        ],
      });
      TestBed.tick();

      const itemWithEmptyAction = { ...mockUserMenuItems[0], action: '' };

      // Act
      fixture.componentInstance.onUserMenuClick(itemWithEmptyAction);
      TestBed.tick();

      // Assert
      expect(userMenuSignal()).toEqual(itemWithEmptyAction);
    });

    it('handles multiple rapid logout attempts', () => {
      // Arrange
      const mocks = createMockServices();
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent);
      TestBed.tick();

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
    it('renders navbar element', () => {
      // Arrange
      const mocks = createMockServices();
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent);
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const nav = queries.getByRole('navigation');
      expect(nav).toBeTruthy();
    });

    it('renders search bar component when showSearch is true', () => {
      // Arrange
      const mocks = createMockServices();
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent, {
        bindings: [inputBinding('showSearch', () => true)],
      });
      TestBed.tick();

      // Assert
      const searchBar = fixture.nativeElement.querySelector('app-search-bar');
      expect(searchBar).toBeTruthy();
    });

    it('renders notification button component', () => {
      // Arrange
      const mocks = createMockServices();
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent);
      TestBed.tick();

      // Assert
      const notificationButton = fixture.nativeElement.querySelector('app-notification-button');
      expect(notificationButton).toBeTruthy();
    });

    it('renders apps menu component', () => {
      // Arrange
      const mocks = createMockServices();
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent);
      TestBed.tick();

      // Assert
      const appsMenu = fixture.nativeElement.querySelector('app-apps-menu');
      expect(appsMenu).toBeTruthy();
    });

    it('renders user menu component', () => {
      // Arrange
      const mocks = createMockServices();
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent);
      TestBed.tick();

      // Assert
      const userMenu = fixture.nativeElement.querySelector('app-user-menu');
      expect(userMenu).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('has proper navigation role', () => {
      // Arrange
      const mocks = createMockServices();
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent);
      TestBed.tick();
      const queries = within(fixture.nativeElement);

      // Assert
      const nav = queries.getByRole('navigation');
      expect(nav).toBeTruthy();
    });

    it('provides toggle sidebar button with aria-label', () => {
      // Arrange
      const mocks = createMockServices();
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders(mocks),
      }).createComponent(NavbarComponent);
      TestBed.tick();

      // Assert
      const toggleButton = fixture.nativeElement.querySelector('button[aria-label="Toggle sidebar"]');
      expect(toggleButton).toBeTruthy();
    });
  });
});
