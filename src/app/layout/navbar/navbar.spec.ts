import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NavbarComponent } from '@loan/app/layout/navbar/navbar';
import { AuthService } from '@loan/app/core/services/auth.service';
import { UserStateService } from '@loan/app/core/services/user.service';
import { Notification } from '@loan/app/shared/components/notification-button/notification-button';
import { AppMenuItem } from '@loan/app/shared/components/apps-menu/apps-menu';
import { UserMenuItem } from '@loan/app/shared/components/user-menu/user-menu';

describe('NavbarComponent', () => {
  let fixture: ComponentFixture<NavbarComponent>;
  let component: NavbarComponent;
  let host: HTMLElement;
  let mockAuthService: {
    logout: ReturnType<typeof vi.fn>;
  };
  let mockUserStateService: {
    userName: ReturnType<typeof vi.fn>;
    userEmail: ReturnType<typeof vi.fn>;
    userAvatar: ReturnType<typeof vi.fn>;
    clearUser: ReturnType<typeof vi.fn>;
  };
  let mockRouter: {
    navigate: ReturnType<typeof vi.fn>;
  };

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

  beforeEach(async () => {
    mockAuthService = {
      logout: vi.fn().mockReturnValue(of(undefined)),
    };

    mockUserStateService = {
      userName: vi.fn(() => 'Test User'),
      userEmail: vi.fn(() => 'test@example.com'),
      userAvatar: vi.fn(() => ''),
      clearUser: vi.fn(),
    };

    mockRouter = {
      navigate: vi.fn().mockResolvedValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserStateService, useValue: mockUserStateService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    host = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  describe('initialization', () => {
    it('creates the component', () => {
      expect(component).toBeDefined();
    });

    it('has default appTitle input value', () => {
      expect(component.appTitle()).toBe('Loan UI');
    });

    it('has empty notifications by default', () => {
      expect(component.notifications()).toEqual([]);
    });

    it('has empty apps by default', () => {
      expect(component.apps()).toEqual([]);
    });

    it('has empty userMenuItems by default', () => {
      expect(component.userMenuItems()).toEqual([]);
    });

    it('shows search by default', () => {
      expect(component.showSearch()).toBe(true);
    });
  });

  describe('appTitle input', () => {
    it('displays custom app title', () => {
      fixture.componentRef.setInput('appTitle', 'Custom App');
      fixture.detectChanges();

      expect(component.appTitle()).toBe('Custom App');
    });

    it('updates when appTitle changes', () => {
      fixture.componentRef.setInput('appTitle', 'First Title');
      fixture.detectChanges();
      expect(component.appTitle()).toBe('First Title');

      fixture.componentRef.setInput('appTitle', 'Second Title');
      fixture.detectChanges();
      expect(component.appTitle()).toBe('Second Title');
    });
  });

  describe('notifications input', () => {
    it('accepts notifications array', () => {
      fixture.componentRef.setInput('notifications', mockNotifications);
      fixture.detectChanges();

      expect(component.notifications()).toEqual(mockNotifications);
    });

    it('updates when notifications change', () => {
      fixture.componentRef.setInput('notifications', mockNotifications);
      fixture.detectChanges();
      expect(component.notifications().length).toBe(1);

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
      fixture.componentRef.setInput('notifications', newNotifications);
      fixture.detectChanges();
      expect(component.notifications().length).toBe(2);
    });
  });

  describe('apps input', () => {
    it('accepts apps array', () => {
      fixture.componentRef.setInput('apps', mockApps);
      fixture.detectChanges();

      expect(component.apps()).toEqual(mockApps);
    });

    it('updates when apps change', () => {
      fixture.componentRef.setInput('apps', mockApps);
      fixture.detectChanges();
      expect(component.apps().length).toBe(1);

      const newApps = [...mockApps, { ...mockApps[0], id: 'marketing' }];
      fixture.componentRef.setInput('apps', newApps);
      fixture.detectChanges();
      expect(component.apps().length).toBe(2);
    });
  });

  describe('userMenuItems input', () => {
    it('accepts userMenuItems array', () => {
      fixture.componentRef.setInput('userMenuItems', mockUserMenuItems);
      fixture.detectChanges();

      expect(component.userMenuItems()).toEqual(mockUserMenuItems);
    });
  });

  describe('showSearch input', () => {
    it('controls search visibility', () => {
      fixture.componentRef.setInput('showSearch', false);
      fixture.detectChanges();

      expect(component.showSearch()).toBe(false);
    });

    it('toggles search visibility', () => {
      fixture.componentRef.setInput('showSearch', true);
      fixture.detectChanges();
      expect(component.showSearch()).toBe(true);

      fixture.componentRef.setInput('showSearch', false);
      fixture.detectChanges();
      expect(component.showSearch()).toBe(false);
    });
  });

  describe('menuToggle output', () => {
    it('emits when onMenuToggle is called', () => {
      const emitSpy = vi.spyOn(component.menuToggle, 'emit');

      component.onMenuToggle();

      expect(emitSpy).toHaveBeenCalledOnce();
    });

    it('emits without parameters', () => {
      const emitSpy = vi.spyOn(component.menuToggle, 'emit');

      component.onMenuToggle();

      expect(emitSpy).toHaveBeenCalledWith();
    });
  });

  describe('searchChange output', () => {
    it('emits search query when onSearchChange is called', () => {
      const emitSpy = vi.spyOn(component.searchChange, 'emit');
      const query = 'test search';

      component.onSearchChange(query);

      expect(emitSpy).toHaveBeenCalledWith(query);
    });

    it('emits empty string', () => {
      const emitSpy = vi.spyOn(component.searchChange, 'emit');

      component.onSearchChange('');

      expect(emitSpy).toHaveBeenCalledWith('');
    });
  });

  describe('searchSubmit output', () => {
    it('emits search query when onSearchSubmit is called', () => {
      const emitSpy = vi.spyOn(component.searchSubmit, 'emit');
      const query = 'submitted query';

      component.onSearchSubmit(query);

      expect(emitSpy).toHaveBeenCalledWith(query);
    });
  });

  describe('notificationClick output', () => {
    it('emits notification when onNotificationClick is called', () => {
      const emitSpy = vi.spyOn(component.notificationClick, 'emit');
      const notification = mockNotifications[0];

      component.onNotificationClick(notification);

      expect(emitSpy).toHaveBeenCalledWith(notification);
    });
  });

  describe('appClick output', () => {
    it('emits app when onAppClick is called', () => {
      const emitSpy = vi.spyOn(component.appClick, 'emit');
      const app = mockApps[0];

      component.onAppClick(app);

      expect(emitSpy).toHaveBeenCalledWith(app);
    });
  });

  describe('userMenuClick output', () => {
    it('emits user menu item when onUserMenuClick is called', () => {
      const emitSpy = vi.spyOn(component.userMenuClick, 'emit');
      const menuItem = mockUserMenuItems[0];

      component.onUserMenuClick(menuItem);

      expect(emitSpy).toHaveBeenCalledWith(menuItem);
    });

    it('does not emit when logout action is triggered', () => {
      const emitSpy = vi.spyOn(component.userMenuClick, 'emit');
      const logoutItem = mockUserMenuItems[1];

      TestBed.runInInjectionContext(() => {
        component.onUserMenuClick(logoutItem);
      });

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('logout functionality', () => {
    it('calls authService.logout when logout action is clicked', () => {
      const logoutItem = mockUserMenuItems.find((item) => item.action === 'logout')!;

      TestBed.runInInjectionContext(() => {
        component.onUserMenuClick(logoutItem);
      });

      expect(mockAuthService.logout).toHaveBeenCalledOnce();
    });

    it('clears user state after successful logout', async () => {
      const logoutItem = mockUserMenuItems.find((item) => item.action === 'logout')!;

      TestBed.runInInjectionContext(() => {
        component.onUserMenuClick(logoutItem);
      });

      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(mockUserStateService.clearUser).toHaveBeenCalledOnce();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('navigates to login page after logout', async () => {
      const logoutItem = mockUserMenuItems.find((item) => item.action === 'logout')!;

      TestBed.runInInjectionContext(() => {
        component.onUserMenuClick(logoutItem);
      });

      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('handles logout error gracefully', async () => {
      mockAuthService.logout.mockReturnValue(throwError(() => new Error('Logout failed')));
      const logoutItem = mockUserMenuItems.find((item) => item.action === 'logout')!;

      TestBed.runInInjectionContext(() => {
        component.onUserMenuClick(logoutItem);
      });

      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(mockUserStateService.clearUser).toHaveBeenCalledOnce();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('clears user state even when logout API fails', async () => {
      mockAuthService.logout.mockReturnValue(throwError(() => new Error('API Error')));
      const logoutItem = mockUserMenuItems.find((item) => item.action === 'logout')!;

      TestBed.runInInjectionContext(() => {
        component.onUserMenuClick(logoutItem);
      });

      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(mockUserStateService.clearUser).toHaveBeenCalled();
    });
  });

  describe('navigation for user menu items', () => {
    it('navigates to href when menu item is clicked', () => {
      const profileItem = mockUserMenuItems[0];

      component.onUserMenuClick(profileItem);

      expect(mockRouter.navigate).toHaveBeenCalledWith([profileItem.href]);
    });

    it('does not navigate when logout is clicked', () => {
      mockRouter.navigate.mockClear();
      const logoutItem = mockUserMenuItems[1];

      TestBed.runInInjectionContext(() => {
        component.onUserMenuClick(logoutItem);
      });

      expect(mockRouter.navigate).not.toHaveBeenCalledWith([logoutItem.href]);
    });

    it('handles menu items without href', () => {
      const emitSpy = vi.spyOn(component.userMenuClick, 'emit');
      const itemWithoutHref = { ...mockUserMenuItems[0], href: undefined };

      component.onUserMenuClick(itemWithoutHref);

      expect(emitSpy).toHaveBeenCalledWith(itemWithoutHref);
    });
  });

  describe('userStateService integration', () => {
    it('accesses userName from userStateService', () => {
      expect(component.userState.userName()).toBe('Test User');
    });

    it('accesses userEmail from userStateService', () => {
      expect(component.userState.userEmail()).toBe('test@example.com');
    });

    it('accesses userAvatar from userStateService', () => {
      expect(component.userState.userAvatar()).toBe('');
    });
  });

  describe('edge cases', () => {
    it('handles null notification', () => {
      const emitSpy = vi.spyOn(component.notificationClick, 'emit');

      expect(() => {
        component.onNotificationClick(null as any);
      }).not.toThrow();

      expect(emitSpy).toHaveBeenCalledWith(null);
    });

    it('handles empty search query', () => {
      const emitSpy = vi.spyOn(component.searchChange, 'emit');

      component.onSearchChange('');

      expect(emitSpy).toHaveBeenCalledWith('');
    });

    it('handles special characters in search', () => {
      const emitSpy = vi.spyOn(component.searchSubmit, 'emit');
      const specialQuery = '<script>alert("xss")</script>';

      component.onSearchSubmit(specialQuery);

      expect(emitSpy).toHaveBeenCalledWith(specialQuery);
    });

    it('handles menu item with empty action', () => {
      const emitSpy = vi.spyOn(component.userMenuClick, 'emit');
      const itemWithEmptyAction = { ...mockUserMenuItems[0], action: '' };

      component.onUserMenuClick(itemWithEmptyAction);

      expect(emitSpy).toHaveBeenCalledWith(itemWithEmptyAction);
    });

    it('handles multiple rapid logout attempts', () => {
      const logoutItem = mockUserMenuItems.find((item) => item.action === 'logout')!;

      TestBed.runInInjectionContext(() => {
        component.onUserMenuClick(logoutItem);
        component.onUserMenuClick(logoutItem);
        component.onUserMenuClick(logoutItem);
      });

      expect(mockAuthService.logout).toHaveBeenCalledTimes(3);
    });
  });

  describe('template integration', () => {
    it('renders navbar element', () => {
      const nav = host.querySelector('nav');
      expect(nav).toBeTruthy();
    });

    it('renders search bar component when showSearch is true', () => {
      fixture.componentRef.setInput('showSearch', true);
      fixture.detectChanges();

      const searchBar = host.querySelector('app-search-bar');
      expect(searchBar).toBeTruthy();
    });

    it('renders notification button component', () => {
      const notificationButton = host.querySelector('app-notification-button');
      expect(notificationButton).toBeTruthy();
    });

    it('renders apps menu component', () => {
      const appsMenu = host.querySelector('app-apps-menu');
      expect(appsMenu).toBeTruthy();
    });

    it('renders user menu component', () => {
      const userMenu = host.querySelector('app-user-menu');
      expect(userMenu).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('has proper navigation role', () => {
      const nav = host.querySelector('nav');
      expect(nav).toBeTruthy();
    });

    it('provides toggle sidebar button with aria-label', () => {
      const toggleButton = host.querySelector('button[aria-label="Toggle sidebar"]');
      expect(toggleButton).toBeTruthy();
    });
  });
});
