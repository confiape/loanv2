import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import {
  NotificationButtonComponent,
  Notification,
} from '@loan/app/shared/components/notification-button/notification-button';

describe('NotificationButtonComponent', () => {
  let fixture: ComponentFixture<NotificationButtonComponent>;
  let component: NotificationButtonComponent;
  let host: HTMLElement;

  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'New loan application',
      message: 'John Doe submitted a new loan application',
      time: '5 minutes ago',
      read: false,
      iconColor: 'var(--color-accent)',
    },
    {
      id: '2',
      title: 'Payment received',
      message: 'Payment of $1,500 received',
      time: '1 hour ago',
      read: false,
      iconColor: 'var(--color-success)',
    },
    {
      id: '3',
      title: 'Loan approved',
      message: 'Loan application has been approved',
      time: '3 hours ago',
      read: true,
    },
    {
      id: '4',
      title: 'System maintenance',
      message: 'Scheduled maintenance tonight',
      time: '1 day ago',
      read: true,
      iconColor: 'var(--color-warning)',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationButtonComponent],
      providers: [
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationButtonComponent);
    component = fixture.componentInstance;
    host = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  describe('initialization', () => {
    it('creates the component', () => {
      expect(component).toBeDefined();
    });

    it('has empty notifications by default', () => {
      expect(component.notifications()).toEqual([]);
    });

    it('has default input values', () => {
      expect(component.badgeCount()).toBe(0);
      expect(component.showBadge()).toBe(true);
      expect(component.maxNotificationsDisplay()).toBe(5);
      expect(component.emptyMessage()).toBe('No notifications');
    });

    it('starts with menu closed', () => {
      expect(component.isOpen()).toBe(false);
    });

    it('renders the notification button', () => {
      const button = host.querySelector('button');
      expect(button).toBeTruthy();
      expect(button?.getAttribute('aria-label')).toBe('View notifications');
    });
  });

  describe('notifications input', () => {
    it('accepts notifications array', () => {
      fixture.componentRef.setInput('notifications', mockNotifications);
      fixture.detectChanges();

      expect(component.notifications()).toEqual(mockNotifications);
    });

    it('displays notifications when menu is open', () => {
      fixture.componentRef.setInput('notifications', mockNotifications);
      component.toggle();
      fixture.detectChanges();

      mockNotifications.slice(0, 5).forEach((notification) => {
        expect(host.textContent).toContain(notification.title);
      });
    });

    it('limits displayed notifications based on maxNotificationsDisplay', () => {
      fixture.componentRef.setInput('notifications', mockNotifications);
      fixture.componentRef.setInput('maxNotificationsDisplay', 2);
      fixture.detectChanges();

      expect(component.displayedNotifications.length).toBe(2);
    });

    it('calculates unread count correctly', () => {
      fixture.componentRef.setInput('notifications', mockNotifications);
      fixture.detectChanges();

      const unreadCount = mockNotifications.filter((n) => !n.read).length;
      expect(component.unreadCount).toBe(unreadCount);
    });

    it('uses badgeCount when provided', () => {
      fixture.componentRef.setInput('badgeCount', 10);
      fixture.detectChanges();

      expect(component.unreadCount).toBe(10);
    });
  });

  describe('badge display', () => {
    it('shows badge when showBadge is true and there are unread notifications', () => {
      fixture.componentRef.setInput('notifications', mockNotifications);
      fixture.componentRef.setInput('showBadge', true);
      fixture.detectChanges();

      const badge = host.querySelector('.bg-error');
      expect(badge).toBeTruthy();
    });

    it('hides badge when showBadge is false', () => {
      fixture.componentRef.setInput('notifications', mockNotifications);
      fixture.componentRef.setInput('showBadge', false);
      fixture.detectChanges();

      const badge = host.querySelector('.bg-error');
      expect(badge).toBeFalsy();
    });

    it('displays correct unread count on badge', () => {
      fixture.componentRef.setInput('notifications', mockNotifications);
      fixture.detectChanges();

      const unreadCount = mockNotifications.filter((n) => !n.read).length;
      const badge = host.querySelector('.bg-error');
      expect(badge?.textContent?.trim()).toBe(String(unreadCount));
    });

    it('displays "99+" when unread count exceeds 99', () => {
      fixture.componentRef.setInput('badgeCount', 150);
      fixture.detectChanges();

      const badge = host.querySelector('.bg-error');
      expect(badge?.textContent?.trim()).toBe('99+');
    });

    it('does not show badge when unread count is 0', () => {
      const allReadNotifications = mockNotifications.map((n) => ({ ...n, read: true }));
      fixture.componentRef.setInput('notifications', allReadNotifications);
      fixture.detectChanges();

      const badge = host.querySelector('.bg-error');
      expect(badge).toBeFalsy();
    });

    it('sets aria-label on badge with unread count', () => {
      fixture.componentRef.setInput('badgeCount', 5);
      fixture.detectChanges();

      const badge = host.querySelector('.bg-error');
      expect(badge?.getAttribute('aria-label')).toBe('5 unread notifications');
    });
  });

  describe('menu toggle', () => {
    it('opens menu when toggle is called', () => {
      expect(component.isOpen()).toBe(false);

      component.toggle();

      expect(component.isOpen()).toBe(true);
    });

    it('closes menu when toggle is called again', () => {
      component.toggle();
      expect(component.isOpen()).toBe(true);

      component.toggle();
      expect(component.isOpen()).toBe(false);
    });

    it('shows dropdown when menu is open', () => {
      component.toggle();
      fixture.detectChanges();

      const dropdown = host.querySelector('div[role="menu"]');
      expect(dropdown).toBeTruthy();
    });

    it('hides dropdown when menu is closed', () => {
      fixture.detectChanges();

      const dropdown = host.querySelector('div[role="menu"]');
      expect(dropdown).toBeFalsy();
    });

    it('sets aria-expanded attribute correctly', () => {
      const button = host.querySelector('button');

      expect(button?.getAttribute('aria-expanded')).toBe('false');

      component.toggle();
      fixture.detectChanges();

      expect(button?.getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('close method', () => {
    it('closes the menu', () => {
      component.toggle();
      expect(component.isOpen()).toBe(true);

      component.close();

      expect(component.isOpen()).toBe(false);
    });
  });

  describe('notificationClick output', () => {
    it('emits notification when clicked', () => {
      fixture.componentRef.setInput('notifications', mockNotifications);
      const emitSpy = vi.spyOn(component.notificationClick, 'emit');

      component.onNotificationClick(mockNotifications[0]);

      expect(emitSpy).toHaveBeenCalledWith(mockNotifications[0]);
    });

    it('emits markAsRead for unread notifications', () => {
      const unreadNotification = mockNotifications[0];
      const emitSpy = vi.spyOn(component.markAsRead, 'emit');

      component.onNotificationClick(unreadNotification);

      expect(emitSpy).toHaveBeenCalledWith(unreadNotification.id);
    });

    it('does not emit markAsRead for already read notifications', () => {
      const readNotification = mockNotifications[2];
      const emitSpy = vi.spyOn(component.markAsRead, 'emit');

      component.onNotificationClick(readNotification);

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('mark all as read', () => {
    it('emits markAllAsRead event', () => {
      const emitSpy = vi.spyOn(component.markAllAsRead, 'emit');

      component.onMarkAllAsRead();

      expect(emitSpy).toHaveBeenCalledOnce();
    });

    it('shows mark all as read button when there are notifications', () => {
      fixture.componentRef.setInput('notifications', mockNotifications);
      component.toggle();
      fixture.detectChanges();

      const markAllButton = Array.from(host.querySelectorAll('button')).find((btn) =>
        btn.textContent?.includes('Mark all as read'),
      );
      expect(markAllButton).toBeTruthy();
    });

    it('hides mark all as read button when there are no notifications', () => {
      fixture.componentRef.setInput('notifications', []);
      component.toggle();
      fixture.detectChanges();

      const markAllButton = Array.from(host.querySelectorAll('button')).find((btn) =>
        btn.textContent?.includes('Mark all as read'),
      );
      expect(markAllButton).toBeFalsy();
    });
  });

  describe('view all', () => {
    it('emits viewAll event', () => {
      const emitSpy = vi.spyOn(component.viewAll, 'emit');

      component.onViewAll();

      expect(emitSpy).toHaveBeenCalledOnce();
    });

    it('closes menu after view all is clicked', () => {
      component.toggle();
      expect(component.isOpen()).toBe(true);

      component.onViewAll();

      expect(component.isOpen()).toBe(false);
    });

    it('shows view all button in footer', () => {
      fixture.componentRef.setInput('notifications', mockNotifications);
      component.toggle();
      fixture.detectChanges();

      const viewAllButton = Array.from(host.querySelectorAll('button')).find((btn) =>
        btn.textContent?.includes('View all'),
      );
      expect(viewAllButton).toBeTruthy();
    });
  });

  describe('empty state', () => {
    it('displays empty message when no notifications', () => {
      fixture.componentRef.setInput('notifications', []);
      component.toggle();
      fixture.detectChanges();

      expect(host.textContent).toContain('No notifications');
    });

    it('displays custom empty message', () => {
      fixture.componentRef.setInput('notifications', []);
      fixture.componentRef.setInput('emptyMessage', 'All caught up!');
      component.toggle();
      fixture.detectChanges();

      expect(host.textContent).toContain('All caught up!');
    });

    it('shows empty state icon', () => {
      fixture.componentRef.setInput('notifications', []);
      component.toggle();
      fixture.detectChanges();

      const emptyIcon = host.querySelector('.text-text-secondary.mx-auto');
      expect(emptyIcon).toBeTruthy();
    });

    it('hides footer when no notifications', () => {
      fixture.componentRef.setInput('notifications', []);
      component.toggle();
      fixture.detectChanges();

      const footer = host.querySelector('.border-t');
      expect(footer).toBeFalsy();
    });
  });

  describe('notification rendering', () => {
    it('renders notification title and message', () => {
      fixture.componentRef.setInput('notifications', [mockNotifications[0]]);
      component.toggle();
      fixture.detectChanges();

      expect(host.textContent).toContain(mockNotifications[0].title);
      expect(host.textContent).toContain(mockNotifications[0].message);
    });

    it('renders notification time', () => {
      fixture.componentRef.setInput('notifications', [mockNotifications[0]]);
      component.toggle();
      fixture.detectChanges();

      expect(host.textContent).toContain(mockNotifications[0].time);
    });

    it('applies different background for unread notifications', () => {
      fixture.componentRef.setInput('notifications', mockNotifications);
      component.toggle();
      fixture.detectChanges();

      const links = host.querySelectorAll('a[role="menuitem"]');
      const unreadLink = links[0] as HTMLElement;
      expect(unreadLink.className).toContain('bg-bg-info');
    });

    it('shows unread indicator for unread notifications', () => {
      fixture.componentRef.setInput('notifications', [mockNotifications[0]]);
      component.toggle();
      fixture.detectChanges();

      const unreadIndicator = host.querySelector('.bg-accent');
      expect(unreadIndicator).toBeTruthy();
    });

    it('hides unread indicator for read notifications', () => {
      fixture.componentRef.setInput('notifications', [mockNotifications[2]]);
      component.toggle();
      fixture.detectChanges();

      const notificationElement = host.querySelector('a[role="menuitem"]');
      const unreadIndicator = notificationElement?.querySelector('.bg-accent');
      expect(unreadIndicator).toBeFalsy();
    });

    it('renders custom icon color when provided', () => {
      fixture.componentRef.setInput('notifications', [mockNotifications[0]]);
      component.toggle();
      fixture.detectChanges();

      const iconCircle = host.querySelector('div[class*="w-11 h-11 rounded-full"]') as HTMLElement;
      expect(iconCircle.style.backgroundColor).toBe('var(--color-accent)');
    });

    it('renders avatar when provided', () => {
      const notificationWithAvatar = {
        ...mockNotifications[0],
        avatar: 'https://example.com/avatar.jpg',
      };
      fixture.componentRef.setInput('notifications', [notificationWithAvatar]);
      component.toggle();
      fixture.detectChanges();

      const avatar = host.querySelector('img[alt]');
      expect(avatar).toBeTruthy();
      expect(avatar?.getAttribute('src')).toBe('https://example.com/avatar.jpg');
    });
  });

  describe('click outside to close', () => {
    it('closes menu when clicking outside', () => {
      component.toggle();
      expect(component.isOpen()).toBe(true);

      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      outsideElement.dispatchEvent(clickEvent);

      component.onDocumentClick(clickEvent);

      expect(component.isOpen()).toBe(false);

      document.body.removeChild(outsideElement);
    });

    it('does not close menu when clicking inside', () => {
      component.toggle();
      fixture.detectChanges();

      const button = host.querySelector('button') as HTMLButtonElement;
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });

      Object.defineProperty(clickEvent, 'target', {
        value: button,
        writable: false,
      });

      component.onDocumentClick(clickEvent);

      expect(component.isOpen()).toBe(true);
    });
  });

  describe('keyboard navigation', () => {
    it('closes menu on Escape key', () => {
      component.toggle();
      expect(component.isOpen()).toBe(true);

      component.onEscapeKey();

      expect(component.isOpen()).toBe(false);
    });

    it('does nothing on Escape when menu is closed', () => {
      expect(component.isOpen()).toBe(false);

      component.onEscapeKey();

      expect(component.isOpen()).toBe(false);
    });
  });

  describe('accessibility', () => {
    it('sets correct ARIA attributes on button', () => {
      const button = host.querySelector('button');

      expect(button?.getAttribute('aria-label')).toBe('View notifications');
      expect(button?.getAttribute('aria-haspopup')).toBe('true');
    });

    it('sets role="menu" on dropdown', () => {
      component.toggle();
      fixture.detectChanges();

      const dropdown = host.querySelector('div[role="menu"]');
      expect(dropdown).toBeTruthy();
      expect(dropdown?.getAttribute('aria-label')).toBe('Notifications menu');
    });

    it('sets role="menuitem" on each notification', () => {
      fixture.componentRef.setInput('notifications', mockNotifications);
      component.toggle();
      fixture.detectChanges();

      const menuItems = host.querySelectorAll('a[role="menuitem"]');
      expect(menuItems.length).toBeGreaterThan(0);
    });

    it('sets descriptive aria-label on each notification', () => {
      fixture.componentRef.setInput('notifications', [mockNotifications[0]]);
      component.toggle();
      fixture.detectChanges();

      const link = host.querySelector('a[role="menuitem"]');
      expect(link?.getAttribute('aria-label')).toContain(mockNotifications[0].title);
      expect(link?.getAttribute('aria-label')).toContain(mockNotifications[0].message);
    });

    it('hides decorative elements from screen readers', () => {
      const bellIcon = host.querySelector('button svg');
      expect(bellIcon?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('edge cases', () => {
    it('handles empty notifications array', () => {
      fixture.componentRef.setInput('notifications', []);
      component.toggle();
      fixture.detectChanges();

      expect(host.textContent).toContain('No notifications');
    });

    it('handles notification with missing title', () => {
      const notificationWithoutTitle = [
        { ...mockNotifications[0], title: '' },
      ];
      fixture.componentRef.setInput('notifications', notificationWithoutTitle);
      component.toggle();
      fixture.detectChanges();

      expect(host.textContent).toContain(mockNotifications[0].message);
    });

    it('handles notification with missing icon and iconColor', () => {
      const plainNotification = [
        {
          id: '5',
          title: 'Plain',
          message: 'Plain notification',
          time: 'now',
          read: false,
        },
      ];
      fixture.componentRef.setInput('notifications', plainNotification);
      component.toggle();
      fixture.detectChanges();

      expect(host.textContent).toContain('Plain');
    });

    it('handles maxNotificationsDisplay of 0', () => {
      fixture.componentRef.setInput('notifications', mockNotifications);
      fixture.componentRef.setInput('maxNotificationsDisplay', 0);
      fixture.detectChanges();

      expect(component.displayedNotifications.length).toBe(0);
    });

    it('handles very long notification messages', () => {
      const longMessage = 'A'.repeat(500);
      const longNotification = [
        {
          ...mockNotifications[0],
          message: longMessage,
        },
      ];
      fixture.componentRef.setInput('notifications', longNotification);
      component.toggle();
      fixture.detectChanges();

      expect(host.textContent).toContain(longMessage);
    });

    it('handles special characters in notifications', () => {
      const specialNotification = [
        {
          ...mockNotifications[0],
          title: '<script>alert("xss")</script>',
          message: 'Test & verify < > " \'',
        },
      ];
      fixture.componentRef.setInput('notifications', specialNotification);
      component.toggle();
      fixture.detectChanges();

      expect(host.textContent).toContain('<script>');
    });

    it('handles rapid toggle clicks', () => {
      for (let i = 0; i < 10; i++) {
        component.toggle();
      }

      expect(component.isOpen()).toBe(false);
    });
  });

  describe('displayedNotifications getter', () => {
    it('returns limited notifications', () => {
      fixture.componentRef.setInput('notifications', mockNotifications);
      fixture.componentRef.setInput('maxNotificationsDisplay', 2);
      fixture.detectChanges();

      const displayed = component.displayedNotifications;
      expect(displayed.length).toBe(2);
      expect(displayed[0].id).toBe('1');
      expect(displayed[1].id).toBe('2');
    });

    it('returns all notifications when limit exceeds count', () => {
      fixture.componentRef.setInput('notifications', mockNotifications);
      fixture.componentRef.setInput('maxNotificationsDisplay', 100);
      fixture.detectChanges();

      expect(component.displayedNotifications.length).toBe(mockNotifications.length);
    });
  });
});
