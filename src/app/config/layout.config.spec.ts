import { describe, expect, it } from 'vitest';
import {
  SIDENAV_ITEMS,
  APPS_MENU_ITEMS,
  USER_MENU_ITEMS,
  MOCK_NOTIFICATIONS,
  BOTTOM_NAV_ITEMS,
} from '@loan/app/config/layout.config';

describe('layout.config', () => {
  describe('SIDENAV_ITEMS', () => {
    it('exports an array of sidenav items', () => {
      expect(Array.isArray(SIDENAV_ITEMS)).toBe(true);
      expect(SIDENAV_ITEMS.length).toBeGreaterThan(0);
    });

    it('contains required properties for each item', () => {
      const requiredProps = ['label', 'value'];
      SIDENAV_ITEMS.forEach((item) => {
        if (!item.divider) {
          requiredProps.forEach((prop) => {
            expect(item).toHaveProperty(prop);
          });
        }
      });
    });

    it('includes Dashboard as the first navigation item', () => {
      expect(SIDENAV_ITEMS[0].label).toBe('Dashboard');
      expect(SIDENAV_ITEMS[0].value).toBe('dashboard');
      expect(SIDENAV_ITEMS[0].routerLink).toBe('/dashboard');
    });

    it('includes Loans item with children and badge', () => {
      const loansItem = SIDENAV_ITEMS.find((item) => item.value === 'loans');
      expect(loansItem).toBeDefined();
      expect(loansItem?.badge).toBe('12');
      expect(loansItem?.children).toBeDefined();
      expect(Array.isArray(loansItem?.children)).toBe(true);
      expect(loansItem?.children?.length).toBeGreaterThan(0);
    });

    it('includes nested children for Loans item', () => {
      const loansItem = SIDENAV_ITEMS.find((item) => item.value === 'loans');
      expect(loansItem?.children).toHaveLength(3);
      expect(loansItem?.children?.[0].label).toBe('Active Loans');
      expect(loansItem?.children?.[0].value).toBe('active-loans');
      expect(loansItem?.children?.[0].badge).toBe('8');
    });

    it('includes a divider item', () => {
      const dividerItem = SIDENAV_ITEMS.find((item) => item.divider);
      expect(dividerItem).toBeDefined();
      expect(dividerItem?.divider).toBe(true);
    });

    it('includes Settings and Help items after divider', () => {
      const settings = SIDENAV_ITEMS.find((item) => item.value === 'settings');
      const help = SIDENAV_ITEMS.find((item) => item.value === 'help');
      expect(settings).toBeDefined();
      expect(help).toBeDefined();
    });

    it('all items have icon except dividers', () => {
      SIDENAV_ITEMS.forEach((item) => {
        if (!item.divider) {
          expect(item.icon).toBeDefined();
          expect(typeof item.icon).toBe('string');
        }
      });
    });

    it('all non-divider items have routerLink', () => {
      SIDENAV_ITEMS.forEach((item) => {
        if (!item.divider) {
          expect(item.routerLink).toBeDefined();
          expect(typeof item.routerLink).toBe('string');
        }
      });
    });
  });

  describe('APPS_MENU_ITEMS', () => {
    it('exports an array of app menu items', () => {
      expect(Array.isArray(APPS_MENU_ITEMS)).toBe(true);
      expect(APPS_MENU_ITEMS.length).toBeGreaterThan(0);
    });

    it('contains required properties for each item', () => {
      const requiredProps = ['id', 'label', 'icon', 'href', 'action'];
      APPS_MENU_ITEMS.forEach((item) => {
        requiredProps.forEach((prop) => {
          expect(item).toHaveProperty(prop);
        });
      });
    });

    it('includes Sales app as first item', () => {
      expect(APPS_MENU_ITEMS[0].id).toBe('sales');
      expect(APPS_MENU_ITEMS[0].label).toBe('Sales');
      expect(APPS_MENU_ITEMS[0].action).toBe('sales');
    });

    it('includes common apps like Users, Inbox, Profile, Settings', () => {
      const appIds = APPS_MENU_ITEMS.map((app) => app.id);
      expect(appIds).toContain('users');
      expect(appIds).toContain('inbox');
      expect(appIds).toContain('profile');
      expect(appIds).toContain('settings');
    });

    it('has 6 app items', () => {
      expect(APPS_MENU_ITEMS).toHaveLength(6);
    });

    it('all items have unique IDs', () => {
      const ids = APPS_MENU_ITEMS.map((app) => app.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('USER_MENU_ITEMS', () => {
    it('exports an array of user menu items', () => {
      expect(Array.isArray(USER_MENU_ITEMS)).toBe(true);
      expect(USER_MENU_ITEMS.length).toBeGreaterThan(0);
    });

    it('contains required properties for each non-divider item', () => {
      USER_MENU_ITEMS.forEach((item) => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('label');
        if (!item.divider) {
          expect(item).toHaveProperty('icon');
          expect(item).toHaveProperty('href');
          expect(item).toHaveProperty('action');
        }
      });
    });

    it('includes Profile as first item', () => {
      expect(USER_MENU_ITEMS[0].id).toBe('profile');
      expect(USER_MENU_ITEMS[0].label).toBe('My Profile');
      expect(USER_MENU_ITEMS[0].action).toBe('profile');
    });

    it('includes dividers', () => {
      const dividers = USER_MENU_ITEMS.filter((item) => item.divider);
      expect(dividers.length).toBeGreaterThan(0);
    });

    it('includes logout as last meaningful item', () => {
      const logoutItem = USER_MENU_ITEMS.find((item) => item.action === 'logout');
      expect(logoutItem).toBeDefined();
      expect(logoutItem?.label).toBe('Sign Out');
      expect(logoutItem?.icon).toBe('heroArrowRightOnRectangle');
    });

    it('has 6 items total including dividers', () => {
      expect(USER_MENU_ITEMS).toHaveLength(6);
    });
  });

  describe('MOCK_NOTIFICATIONS', () => {
    it('exports an array of notifications', () => {
      expect(Array.isArray(MOCK_NOTIFICATIONS)).toBe(true);
      expect(MOCK_NOTIFICATIONS.length).toBeGreaterThan(0);
    });

    it('contains required properties for each notification', () => {
      const requiredProps = ['id', 'title', 'message', 'time'];
      MOCK_NOTIFICATIONS.forEach((notification) => {
        requiredProps.forEach((prop) => {
          expect(notification).toHaveProperty(prop);
        });
      });
    });

    it('includes both read and unread notifications', () => {
      const unread = MOCK_NOTIFICATIONS.filter((n) => !n.read);
      const read = MOCK_NOTIFICATIONS.filter((n) => n.read);
      expect(unread.length).toBeGreaterThan(0);
      expect(read.length).toBeGreaterThan(0);
    });

    it('has 4 notification items', () => {
      expect(MOCK_NOTIFICATIONS).toHaveLength(4);
    });

    it('includes notification about new loan application', () => {
      const loanNotification = MOCK_NOTIFICATIONS.find((n) => n.id === '1');
      expect(loanNotification?.title).toBe('New loan application');
      expect(loanNotification?.read).toBe(false);
    });

    it('some notifications have custom iconColor', () => {
      const withColor = MOCK_NOTIFICATIONS.filter((n) => n.iconColor);
      expect(withColor.length).toBeGreaterThan(0);
    });

    it('all notifications have unique IDs', () => {
      const ids = MOCK_NOTIFICATIONS.map((n) => n.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('BOTTOM_NAV_ITEMS', () => {
    it('exports an array of bottom navigation items', () => {
      expect(Array.isArray(BOTTOM_NAV_ITEMS)).toBe(true);
      expect(BOTTOM_NAV_ITEMS.length).toBeGreaterThan(0);
    });

    it('contains required properties for each item', () => {
      const requiredProps = ['id', 'label', 'icon', 'routerLink'];
      BOTTOM_NAV_ITEMS.forEach((item) => {
        requiredProps.forEach((prop) => {
          expect(item).toHaveProperty(prop);
        });
      });
    });

    it('has exactly 4 items for mobile navigation', () => {
      expect(BOTTOM_NAV_ITEMS).toHaveLength(4);
    });

    it('includes Dashboard, Loans, Customers, and Reports', () => {
      const labels = BOTTOM_NAV_ITEMS.map((item) => item.label);
      expect(labels).toContain('Dashboard');
      expect(labels).toContain('Loans');
      expect(labels).toContain('Customers');
      expect(labels).toContain('Reports');
    });

    it('all items have unique IDs', () => {
      const ids = BOTTOM_NAV_ITEMS.map((item) => item.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('all items have router links starting with slash', () => {
      BOTTOM_NAV_ITEMS.forEach((item) => {
        expect(item.routerLink).toMatch(/^\//);
      });
    });
  });

  describe('Configuration Integrity', () => {
    it('all configuration constants are defined', () => {
      expect(SIDENAV_ITEMS).toBeDefined();
      expect(APPS_MENU_ITEMS).toBeDefined();
      expect(USER_MENU_ITEMS).toBeDefined();
      expect(MOCK_NOTIFICATIONS).toBeDefined();
      expect(BOTTOM_NAV_ITEMS).toBeDefined();
    });

    it('all configuration constants are arrays', () => {
      // Verify all exports are arrays
      expect(Array.isArray(SIDENAV_ITEMS)).toBe(true);
      expect(Array.isArray(APPS_MENU_ITEMS)).toBe(true);
      expect(Array.isArray(USER_MENU_ITEMS)).toBe(true);
      expect(Array.isArray(MOCK_NOTIFICATIONS)).toBe(true);
      expect(Array.isArray(BOTTOM_NAV_ITEMS)).toBe(true);
    });
  });
});
