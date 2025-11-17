import { describe, it, expect, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, inputBinding } from '@angular/core';
import {
  NotificationButtonComponent,
  Notification,
} from '@loan/app/shared/components/notification-button/notification-button';

describe('NotificationButtonComponent', () => {
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

  function renderComponent(props?: Record<string, unknown>) {
    const bindings = props
      ? Object.entries(props).map(([key, value]) => inputBinding(key, () => value))
      : [];

    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(NotificationButtonComponent, {
      bindings,
    });
    TestBed.tick();

    return { fixture, container: fixture.nativeElement };
  }

  describe('initialization', () => {
    it('creates the component', () => {
      const { fixture } = renderComponent();
      expect(fixture.componentInstance).toBeDefined();
    });

    it('has empty notifications by default', () => {
      const { fixture } = renderComponent();
      expect(fixture.componentInstance.notifications()).toEqual([]);
    });

    it('has default input values', () => {
      const { fixture } = renderComponent();
      expect(fixture.componentInstance.badgeCount()).toBe(0);
      expect(fixture.componentInstance.showBadge()).toBe(true);
      expect(fixture.componentInstance.maxNotificationsDisplay()).toBe(5);
      expect(fixture.componentInstance.emptyMessage()).toBe('No notifications');
    });

    it('starts with menu closed', () => {
      const { fixture } = renderComponent();
      expect(fixture.componentInstance.isOpen()).toBe(false);
    });

    it('renders the notification button', () => {
      const { container } = renderComponent();
      const button = container.querySelector('button');
      expect(button).toBeTruthy();
      expect(button?.getAttribute('aria-label')).toBe('View notifications');
    });
  });

  describe('notifications input', () => {
    it('accepts notifications array', () => {
      const { fixture } = renderComponent({ notifications: mockNotifications });

      expect(fixture.componentInstance.notifications()).toEqual(mockNotifications);
    });

    it('displays notifications when menu is open', () => {
      const { container, fixture } = renderComponent({ notifications: mockNotifications });
      fixture.componentInstance.toggle();
      TestBed.tick();

      mockNotifications.slice(0, 5).forEach((notification) => {
        expect(container.textContent).toContain(notification.title);
      });
    });

    it('limits displayed notifications based on maxNotificationsDisplay', () => {
      const { fixture } = renderComponent({
        notifications: mockNotifications,
        maxNotificationsDisplay: 2,
      });

      expect(fixture.componentInstance.displayedNotifications.length).toBe(2);
    });

    it('calculates unread count correctly', () => {
      const { fixture } = renderComponent({ notifications: mockNotifications });

      const unreadCount = mockNotifications.filter((n) => !n.read).length;
      expect(fixture.componentInstance.unreadCount).toBe(unreadCount);
    });

    it('uses badgeCount when provided', () => {
      const { fixture } = renderComponent({ badgeCount: 10 });

      expect(fixture.componentInstance.unreadCount).toBe(10);
    });
  });

  describe('badge display', () => {
    it('shows badge when showBadge is true and there are unread notifications', () => {
      const { container } = renderComponent({
        notifications: mockNotifications,
        showBadge: true,
      });

      const badge = container.querySelector('.bg-error');
      expect(badge).toBeTruthy();
    });

    it('hides badge when showBadge is false', () => {
      const { container } = renderComponent({
        notifications: mockNotifications,
        showBadge: false,
      });

      const badge = container.querySelector('.bg-error');
      expect(badge).toBeFalsy();
    });

    it('displays correct unread count on badge', () => {
      const { container } = renderComponent({ notifications: mockNotifications });

      const unreadCount = mockNotifications.filter((n) => !n.read).length;
      const badge = container.querySelector('.bg-error');
      expect(badge?.textContent?.trim()).toBe(String(unreadCount));
    });

    it('displays "99+" when unread count exceeds 99', () => {
      const { container } = renderComponent({ badgeCount: 150 });

      const badge = container.querySelector('.bg-error');
      expect(badge?.textContent?.trim()).toBe('99+');
    });

    it('does not show badge when unread count is 0', () => {
      const allReadNotifications = mockNotifications.map((n) => ({ ...n, read: true }));
      const { container } = renderComponent({ notifications: allReadNotifications });

      const badge = container.querySelector('.bg-error');
      expect(badge).toBeFalsy();
    });

    it('sets aria-label on badge with unread count', () => {
      const { container } = renderComponent({ badgeCount: 5 });

      const badge = container.querySelector('.bg-error');
      expect(badge?.getAttribute('aria-label')).toBe('5 unread notifications');
    });
  });

  describe('menu toggle', () => {
    it('opens menu when toggle is called', () => {
      const { fixture } = renderComponent();
      expect(fixture.componentInstance.isOpen()).toBe(false);

      fixture.componentInstance.toggle();

      expect(fixture.componentInstance.isOpen()).toBe(true);
    });

    it('closes menu when toggle is called again', () => {
      const { fixture } = renderComponent();
      fixture.componentInstance.toggle();
      expect(fixture.componentInstance.isOpen()).toBe(true);

      fixture.componentInstance.toggle();
      expect(fixture.componentInstance.isOpen()).toBe(false);
    });

    it('shows dropdown when menu is open', () => {
      const { container, fixture } = renderComponent();
      fixture.componentInstance.toggle();
      TestBed.tick();

      const dropdown = container.querySelector('div[role="menu"]');
      expect(dropdown).toBeTruthy();
    });

    it('hides dropdown when menu is closed', () => {
      const { container } = renderComponent();

      const dropdown = container.querySelector('div[role="menu"]');
      expect(dropdown).toBeFalsy();
    });

    it('sets aria-expanded attribute correctly', () => {
      const { container, fixture } = renderComponent();
      const button = container.querySelector('button');

      expect(button?.getAttribute('aria-expanded')).toBe('false');

      fixture.componentInstance.toggle();
      TestBed.tick();

      expect(button?.getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('close method', () => {
    it('closes the menu', () => {
      const { fixture } = renderComponent();
      fixture.componentInstance.toggle();
      expect(fixture.componentInstance.isOpen()).toBe(true);

      fixture.componentInstance.close();

      expect(fixture.componentInstance.isOpen()).toBe(false);
    });
  });

  describe('notificationClick output', () => {
    it('emits notification when clicked', () => {
      const { fixture } = renderComponent({ notifications: mockNotifications });
      const emitSpy = vi.spyOn(fixture.componentInstance.notificationClick, 'emit');

      fixture.componentInstance.onNotificationClick(mockNotifications[0]);

      expect(emitSpy).toHaveBeenCalledWith(mockNotifications[0]);
    });

    it('emits markAsRead for unread notifications', () => {
      const { fixture } = renderComponent();
      const unreadNotification = mockNotifications[0];
      const emitSpy = vi.spyOn(fixture.componentInstance.markAsRead, 'emit');

      fixture.componentInstance.onNotificationClick(unreadNotification);

      expect(emitSpy).toHaveBeenCalledWith(unreadNotification.id);
    });

    it('does not emit markAsRead for already read notifications', () => {
      const { fixture } = renderComponent();
      const readNotification = mockNotifications[2];
      const emitSpy = vi.spyOn(fixture.componentInstance.markAsRead, 'emit');

      fixture.componentInstance.onNotificationClick(readNotification);

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe('mark all as read', () => {
    it('emits markAllAsRead event', () => {
      const { fixture } = renderComponent();
      const emitSpy = vi.spyOn(fixture.componentInstance.markAllAsRead, 'emit');

      fixture.componentInstance.onMarkAllAsRead();

      expect(emitSpy).toHaveBeenCalledOnce();
    });

    it('shows mark all as read button when there are notifications', () => {
      const { container, fixture } = renderComponent({ notifications: mockNotifications });
      fixture.componentInstance.toggle();
      TestBed.tick();

      const markAllButton = Array.from(container.querySelectorAll('button')).find((btn) =>
        btn.textContent?.includes('Mark all as read'),
      );
      expect(markAllButton).toBeTruthy();
    });

    it('hides mark all as read button when there are no notifications', () => {
      const { container, fixture } = renderComponent({ notifications: [] });
      fixture.componentInstance.toggle();
      TestBed.tick();

      const markAllButton = Array.from(container.querySelectorAll('button')).find((btn) =>
        btn.textContent?.includes('Mark all as read'),
      );
      expect(markAllButton).toBeFalsy();
    });
  });

  describe('view all', () => {
    it('emits viewAll event', () => {
      const { fixture } = renderComponent();
      const emitSpy = vi.spyOn(fixture.componentInstance.viewAll, 'emit');

      fixture.componentInstance.onViewAll();

      expect(emitSpy).toHaveBeenCalledOnce();
    });

    it('closes menu after view all is clicked', () => {
      const { fixture } = renderComponent();
      fixture.componentInstance.toggle();
      expect(fixture.componentInstance.isOpen()).toBe(true);

      fixture.componentInstance.onViewAll();

      expect(fixture.componentInstance.isOpen()).toBe(false);
    });

    it('shows view all button in footer', () => {
      const { container, fixture } = renderComponent({ notifications: mockNotifications });
      fixture.componentInstance.toggle();
      TestBed.tick();

      const viewAllButton = Array.from(container.querySelectorAll('button')).find((btn) =>
        btn.textContent?.includes('View all'),
      );
      expect(viewAllButton).toBeTruthy();
    });
  });

  describe('empty state', () => {
    it('displays empty message when no notifications', () => {
      const { container, fixture } = renderComponent({ notifications: [] });
      fixture.componentInstance.toggle();
      TestBed.tick();

      expect(container.textContent).toContain('No notifications');
    });

    it('displays custom empty message', () => {
      const { container, fixture } = renderComponent({
        notifications: [],
        emptyMessage: 'All caught up!',
      });
      fixture.componentInstance.toggle();
      TestBed.tick();

      expect(container.textContent).toContain('All caught up!');
    });

    it('shows empty state icon', () => {
      const { container, fixture } = renderComponent({ notifications: [] });
      fixture.componentInstance.toggle();
      TestBed.tick();

      const emptyIcon = container.querySelector('.text-text-secondary.mx-auto');
      expect(emptyIcon).toBeTruthy();
    });

    it('hides footer when no notifications', () => {
      const { container, fixture } = renderComponent({ notifications: [] });
      fixture.componentInstance.toggle();
      TestBed.tick();

      const footer = container.querySelector('.border-t');
      expect(footer).toBeFalsy();
    });
  });

  describe('notification rendering', () => {
    it('renders notification title and message', () => {
      const { container, fixture } = renderComponent({ notifications: [mockNotifications[0]] });
      fixture.componentInstance.toggle();
      TestBed.tick();

      expect(container.textContent).toContain(mockNotifications[0].title);
      expect(container.textContent).toContain(mockNotifications[0].message);
    });

    it('renders notification time', () => {
      const { container, fixture } = renderComponent({ notifications: [mockNotifications[0]] });
      fixture.componentInstance.toggle();
      TestBed.tick();

      expect(container.textContent).toContain(mockNotifications[0].time);
    });

    it('applies different background for unread notifications', () => {
      const { container, fixture } = renderComponent({ notifications: mockNotifications });
      fixture.componentInstance.toggle();
      TestBed.tick();

      const links = container.querySelectorAll('a[role="menuitem"]');
      const unreadLink = links[0] as HTMLElement;
      expect(unreadLink.className).toContain('bg-bg-info');
    });

    it('shows unread indicator for unread notifications', () => {
      const { container, fixture } = renderComponent({ notifications: [mockNotifications[0]] });
      fixture.componentInstance.toggle();
      TestBed.tick();

      const unreadIndicator = container.querySelector('.bg-accent');
      expect(unreadIndicator).toBeTruthy();
    });

    it('hides unread indicator for read notifications', () => {
      const { container, fixture } = renderComponent({ notifications: [mockNotifications[2]] });
      fixture.componentInstance.toggle();
      TestBed.tick();

      const notificationElement = container.querySelector('a[role="menuitem"]');
      const unreadIndicator = notificationElement?.querySelector('.bg-accent');
      expect(unreadIndicator).toBeFalsy();
    });

    it('renders custom icon color when provided', () => {
      const { container, fixture } = renderComponent({ notifications: [mockNotifications[0]] });
      fixture.componentInstance.toggle();
      TestBed.tick();

      const iconCircle = container.querySelector('div[class*="w-11 h-11 rounded-full"]') as HTMLElement;
      expect(iconCircle.style.backgroundColor).toBe('var(--color-accent)');
    });

    it('renders avatar when provided', () => {
      const notificationWithAvatar = {
        ...mockNotifications[0],
        avatar: 'https://example.com/avatar.jpg',
      };
      const { container, fixture } = renderComponent({ notifications: [notificationWithAvatar] });
      fixture.componentInstance.toggle();
      TestBed.tick();

      const avatar = container.querySelector('img[alt]');
      expect(avatar).toBeTruthy();
      expect(avatar?.getAttribute('src')).toBe('https://example.com/avatar.jpg');
    });
  });

  describe('click outside to close', () => {
    it('closes menu when clicking outside', () => {
      const { fixture } = renderComponent();
      fixture.componentInstance.toggle();
      expect(fixture.componentInstance.isOpen()).toBe(true);

      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      outsideElement.dispatchEvent(clickEvent);

      fixture.componentInstance.onDocumentClick(clickEvent);

      expect(fixture.componentInstance.isOpen()).toBe(false);

      document.body.removeChild(outsideElement);
    });

    it('does not close menu when clicking inside', () => {
      const { container, fixture } = renderComponent();
      fixture.componentInstance.toggle();
      TestBed.tick();

      const button = container.querySelector('button') as HTMLButtonElement;
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });

      Object.defineProperty(clickEvent, 'target', {
        value: button,
        writable: false,
      });

      fixture.componentInstance.onDocumentClick(clickEvent);

      expect(fixture.componentInstance.isOpen()).toBe(true);
    });
  });

  describe('keyboard navigation', () => {
    it('closes menu on Escape key', () => {
      const { fixture } = renderComponent();
      fixture.componentInstance.toggle();
      expect(fixture.componentInstance.isOpen()).toBe(true);

      fixture.componentInstance.onEscapeKey();

      expect(fixture.componentInstance.isOpen()).toBe(false);
    });

    it('does nothing on Escape when menu is closed', () => {
      const { fixture } = renderComponent();
      expect(fixture.componentInstance.isOpen()).toBe(false);

      fixture.componentInstance.onEscapeKey();

      expect(fixture.componentInstance.isOpen()).toBe(false);
    });
  });

  describe('accessibility', () => {
    it('sets correct ARIA attributes on button', () => {
      const { container } = renderComponent();
      const button = container.querySelector('button');

      expect(button?.getAttribute('aria-label')).toBe('View notifications');
      expect(button?.getAttribute('aria-haspopup')).toBe('true');
    });

    it('sets role="menu" on dropdown', () => {
      const { container, fixture } = renderComponent();
      fixture.componentInstance.toggle();
      TestBed.tick();

      const dropdown = container.querySelector('div[role="menu"]');
      expect(dropdown).toBeTruthy();
      expect(dropdown?.getAttribute('aria-label')).toBe('Notifications menu');
    });

    it('sets role="menuitem" on each notification', () => {
      const { container, fixture } = renderComponent({ notifications: mockNotifications });
      fixture.componentInstance.toggle();
      TestBed.tick();

      const menuItems = container.querySelectorAll('a[role="menuitem"]');
      expect(menuItems.length).toBeGreaterThan(0);
    });

    it('sets descriptive aria-label on each notification', () => {
      const { container, fixture } = renderComponent({ notifications: [mockNotifications[0]] });
      fixture.componentInstance.toggle();
      TestBed.tick();

      const link = container.querySelector('a[role="menuitem"]');
      expect(link?.getAttribute('aria-label')).toContain(mockNotifications[0].title);
      expect(link?.getAttribute('aria-label')).toContain(mockNotifications[0].message);
    });

    it('hides decorative elements from screen readers', () => {
      const { container } = renderComponent();
      const bellIcon = container.querySelector('button svg');
      expect(bellIcon?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('edge cases', () => {
    it('handles empty notifications array', () => {
      const { container, fixture } = renderComponent({ notifications: [] });
      fixture.componentInstance.toggle();
      TestBed.tick();

      expect(container.textContent).toContain('No notifications');
    });

    it('handles notification with missing title', () => {
      const notificationWithoutTitle = [
        { ...mockNotifications[0], title: '' },
      ];
      const { container, fixture } = renderComponent({ notifications: notificationWithoutTitle });
      fixture.componentInstance.toggle();
      TestBed.tick();

      expect(container.textContent).toContain(mockNotifications[0].message);
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
      const { container, fixture } = renderComponent({ notifications: plainNotification });
      fixture.componentInstance.toggle();
      TestBed.tick();

      expect(container.textContent).toContain('Plain');
    });

    it('handles maxNotificationsDisplay of 0', () => {
      const { fixture } = renderComponent({
        notifications: mockNotifications,
        maxNotificationsDisplay: 0,
      });

      expect(fixture.componentInstance.displayedNotifications.length).toBe(0);
    });

    it('handles very long notification messages', () => {
      const longMessage = 'A'.repeat(500);
      const longNotification = [
        {
          ...mockNotifications[0],
          message: longMessage,
        },
      ];
      const { container, fixture } = renderComponent({ notifications: longNotification });
      fixture.componentInstance.toggle();
      TestBed.tick();

      expect(container.textContent).toContain(longMessage);
    });

    it('handles special characters in notifications', () => {
      const specialNotification = [
        {
          ...mockNotifications[0],
          title: '<script>alert("xss")</script>',
          message: 'Test & verify < > " \'',
        },
      ];
      const { container, fixture } = renderComponent({ notifications: specialNotification });
      fixture.componentInstance.toggle();
      TestBed.tick();

      expect(container.textContent).toContain('<script>');
    });

    it('handles rapid toggle clicks', () => {
      const { fixture } = renderComponent();
      for (let i = 0; i < 10; i++) {
        fixture.componentInstance.toggle();
      }

      expect(fixture.componentInstance.isOpen()).toBe(false);
    });
  });

  describe('displayedNotifications getter', () => {
    it('returns limited notifications', () => {
      const { fixture } = renderComponent({
        notifications: mockNotifications,
        maxNotificationsDisplay: 2,
      });

      const displayed = fixture.componentInstance.displayedNotifications;
      expect(displayed.length).toBe(2);
      expect(displayed[0].id).toBe('1');
      expect(displayed[1].id).toBe('2');
    });

    it('returns all notifications when limit exceeds count', () => {
      const { fixture } = renderComponent({
        notifications: mockNotifications,
        maxNotificationsDisplay: 100,
      });

      expect(fixture.componentInstance.displayedNotifications.length).toBe(mockNotifications.length);
    });
  });
});
