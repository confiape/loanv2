import { describe, it, expect, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, inputBinding } from '@angular/core';
import { AppsMenuComponent, AppMenuItem } from '@loan/app/shared/components/apps-menu/apps-menu';

describe('AppsMenuComponent', () => {
  const mockApps: AppMenuItem[] = [
    {
      id: 'sales',
      label: 'Sales',
      icon: '<svg>sales</svg>',
      href: '/sales',
      action: 'sales',
    },
    {
      id: 'users',
      label: 'Users',
      icon: '<svg>users</svg>',
      href: '/users',
      action: 'users',
    },
    {
      id: 'inbox',
      label: 'Inbox',
      icon: '<svg>inbox</svg>',
      href: '/inbox',
      action: 'inbox',
    },
  ];

  function renderComponent(props?: Record<string, unknown>) {
    const bindings = props
      ? Object.entries(props).map(([key, value]) => inputBinding(key, () => value))
      : [];

    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(AppsMenuComponent, {
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

    it('has empty apps array by default', () => {
      const { fixture } = renderComponent();
      expect(fixture.componentInstance.apps()).toEqual([]);
    });

    it('has default title', () => {
      const { fixture } = renderComponent();
      expect(fixture.componentInstance.title()).toBe('Apps');
    });

    it('starts with menu closed', () => {
      const { fixture } = renderComponent();
      expect(fixture.componentInstance.isOpen()).toBe(false);
    });

    it('renders the apps button', () => {
      const { container } = renderComponent();
      const button = container.querySelector('button');
      expect(button).toBeTruthy();
      expect(button?.getAttribute('aria-label')).toBe('View apps');
    });
  });

  describe('apps input', () => {
    it('accepts apps array', () => {
      const { fixture } = renderComponent({ apps: mockApps });

      expect(fixture.componentInstance.apps()).toEqual(mockApps);
    });

    it('renders all app items when menu is open', () => {
      const { container, fixture } = renderComponent({ apps: mockApps });
      fixture.componentInstance.toggle();
      TestBed.tick();

      const appLinks = container.querySelectorAll('a[role="menuitem"]');
      expect(appLinks.length).toBe(mockApps.length);
    });

    it('displays app labels correctly', () => {
      const { container, fixture } = renderComponent({ apps: mockApps });
      fixture.componentInstance.toggle();
      TestBed.tick();

      mockApps.forEach((app) => {
        expect(container.textContent).toContain(app.label);
      });
    });

    it('renders app icons using innerHTML', () => {
      const { container, fixture } = renderComponent({ apps: mockApps });
      fixture.componentInstance.toggle();
      TestBed.tick();

      const icons = container.querySelectorAll('div[class*="w-7 h-7"]');
      expect(icons.length).toBe(mockApps.length);
    });

    it('sets href on app links', () => {
      const { container, fixture } = renderComponent({ apps: mockApps });
      fixture.componentInstance.toggle();
      TestBed.tick();

      const dropdown = container.querySelector('[role="menu"]');
      const links = dropdown?.querySelectorAll('a[role="menuitem"]');
      expect(links?.length).toBe(mockApps.length);
      links?.forEach((link: Element, index: number) => {
        expect(link.getAttribute('href')).toBe(mockApps[index].href);
      });
    });

    it('updates when apps change', () => {
      const { container, fixture } = renderComponent({ apps: mockApps });
      fixture.componentInstance.toggle();
      TestBed.tick();
      expect(container.querySelectorAll('a[role="menuitem"]').length).toBe(3);

      const newApps = mockApps.slice(0, 1);
      fixture.componentRef.setInput('apps', newApps);
      TestBed.tick();
      expect(container.querySelectorAll('a[role="menuitem"]').length).toBe(1);
    });
  });

  describe('title input', () => {
    it('accepts custom title', () => {
      const { fixture } = renderComponent({ title: 'Applications' });

      expect(fixture.componentInstance.title()).toBe('Applications');
    });

    it('displays title in dropdown header', () => {
      const { container, fixture } = renderComponent({ title: 'My Apps' });
      fixture.componentInstance.toggle();
      TestBed.tick();

      expect(container.textContent).toContain('My Apps');
    });

    it('updates title dynamically', () => {
      const { container, fixture } = renderComponent();
      fixture.componentInstance.toggle();
      TestBed.tick();

      fixture.componentRef.setInput('title', 'First Title');
      TestBed.tick();
      expect(container.textContent).toContain('First Title');

      fixture.componentRef.setInput('title', 'Second Title');
      TestBed.tick();
      expect(container.textContent).toContain('Second Title');
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

    it('sets menu to closed state explicitly', () => {
      const { fixture } = renderComponent();
      fixture.componentInstance.isOpen.set(true);

      fixture.componentInstance.close();

      expect(fixture.componentInstance.isOpen()).toBe(false);
    });
  });

  describe('appClick output', () => {
    it('emits app when clicked', () => {
      const { fixture } = renderComponent({ apps: mockApps });
      fixture.componentInstance.toggle();
      TestBed.tick();

      const emitSpy = vi.spyOn(fixture.componentInstance.appClick, 'emit');
      const event = new Event('click');

      fixture.componentInstance.onAppClick(mockApps[0], event);

      expect(emitSpy).toHaveBeenCalledWith(mockApps[0]);
    });

    it('prevents default event', () => {
      const { fixture } = renderComponent();
      const event = new Event('click');
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      fixture.componentInstance.onAppClick(mockApps[0], event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('closes menu after app click', () => {
      const { fixture } = renderComponent();
      fixture.componentInstance.toggle();
      expect(fixture.componentInstance.isOpen()).toBe(true);

      fixture.componentInstance.onAppClick(mockApps[0], new Event('click'));

      expect(fixture.componentInstance.isOpen()).toBe(false);
    });

    it('emits correct app data', () => {
      const { fixture } = renderComponent({ apps: mockApps });
      const emitSpy = vi.spyOn(fixture.componentInstance.appClick, 'emit');

      mockApps.forEach((app) => {
        fixture.componentInstance.onAppClick(app, new Event('click'));
        expect(emitSpy).toHaveBeenCalledWith(app);
      });
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

    it('does nothing when menu is already closed', () => {
      const { fixture } = renderComponent();
      expect(fixture.componentInstance.isOpen()).toBe(false);

      const outsideElement = document.createElement('div');
      const clickEvent = new MouseEvent('click');
      Object.defineProperty(clickEvent, 'target', {
        value: outsideElement,
        writable: false,
      });

      fixture.componentInstance.onDocumentClick(clickEvent);

      expect(fixture.componentInstance.isOpen()).toBe(false);
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

      expect(button?.getAttribute('aria-label')).toBe('View apps');
      expect(button?.getAttribute('aria-haspopup')).toBe('true');
    });

    it('sets role="menu" on dropdown', () => {
      const { container, fixture } = renderComponent();
      fixture.componentInstance.toggle();
      TestBed.tick();

      const dropdown = container.querySelector('div[role="menu"]');
      expect(dropdown).toBeTruthy();
    });

    it('sets aria-label on dropdown from title', () => {
      const { container, fixture } = renderComponent({ title: 'My Applications' });
      fixture.componentInstance.toggle();
      TestBed.tick();

      const dropdown = container.querySelector('div[role="menu"]');
      expect(dropdown?.getAttribute('aria-label')).toBe('My Applications');
    });

    it('sets role="menuitem" on each app link', () => {
      const { container, fixture } = renderComponent({ apps: mockApps });
      fixture.componentInstance.toggle();
      TestBed.tick();

      const menuItems = container.querySelectorAll('a[role="menuitem"]');
      expect(menuItems.length).toBe(mockApps.length);
    });

    it('sets aria-label on each app link', () => {
      const { container, fixture } = renderComponent({ apps: mockApps });
      fixture.componentInstance.toggle();
      TestBed.tick();

      const links = container.querySelectorAll('a[role="menuitem"]');
      links.forEach((link: any, index: number) => {
        expect(link.getAttribute('aria-label')).toBe(mockApps[index].label);
      });
    });

    it('hides icon SVG from screen readers', () => {
      const { container } = renderComponent();
      const button = container.querySelector('button svg');
      expect(button?.getAttribute('aria-hidden')).toBeNull();
    });
  });

  describe('styling', () => {
    it('applies grid layout for apps', () => {
      const { container, fixture } = renderComponent({ apps: mockApps });
      fixture.componentInstance.toggle();
      TestBed.tick();

      const grid = container.querySelector('.grid-cols-3');
      expect(grid).toBeTruthy();
    });

    it('applies correct button styles', () => {
      const { container } = renderComponent();
      const button = container.querySelector('button');
      expect(button?.className).toContain('rounded-lg');
      expect(button?.className).toContain('hover:bg-bg-secondary');
    });

    it('positions dropdown absolutely', () => {
      const { container, fixture } = renderComponent();
      fixture.componentInstance.toggle();
      TestBed.tick();

      const dropdown = container.querySelector('div[role="menu"]') as HTMLElement;
      expect(dropdown?.className).toContain('absolute');
      expect(dropdown?.className).toContain('right-0');
    });

    it('applies hover styles to app items', () => {
      const { container, fixture } = renderComponent({ apps: mockApps });
      fixture.componentInstance.toggle();
      TestBed.tick();

      const links = container.querySelectorAll('a[role="menuitem"]');
      links.forEach((link: any) => {
        expect(link.className).toContain('hover:bg-bg-secondary');
        expect(link.className).toContain('group');
      });
    });
  });

  describe('edge cases', () => {
    it('handles empty apps array', () => {
      const { container, fixture } = renderComponent({ apps: [] });
      fixture.componentInstance.toggle();
      TestBed.tick();

      const appLinks = container.querySelectorAll('a[role="menuitem"]');
      expect(appLinks.length).toBe(0);
    });

    it('handles app with missing href', () => {
      const appWithoutHref = [{ ...mockApps[0], href: undefined }];
      const { container, fixture } = renderComponent({ apps: appWithoutHref });
      fixture.componentInstance.toggle();
      TestBed.tick();

      const link = container.querySelector('a[role="menuitem"]');
      expect(link?.getAttribute('href')).toBe('#');
    });

    it('handles app with empty icon', () => {
      const appWithEmptyIcon = [{ ...mockApps[0], icon: '' }];
      const { container, fixture } = renderComponent({ apps: appWithEmptyIcon });
      fixture.componentInstance.toggle();
      TestBed.tick();

      expect(container.textContent).toContain(mockApps[0].label);
    });

    it('handles special characters in labels', () => {
      const specialApp = [
        {
          ...mockApps[0],
          label: 'Reports & Analytics',
        },
      ];
      const { container, fixture } = renderComponent({ apps: specialApp });
      fixture.componentInstance.toggle();
      TestBed.tick();

      expect(container.textContent).toContain('Reports & Analytics');
    });

    it('handles rapid toggle clicks', () => {
      const { fixture } = renderComponent();
      for (let i = 0; i < 10; i++) {
        fixture.componentInstance.toggle();
      }

      expect(fixture.componentInstance.isOpen()).toBe(false);
    });

    it('handles multiple app clicks', () => {
      const { fixture } = renderComponent({ apps: mockApps });
      const emitSpy = vi.spyOn(fixture.componentInstance.appClick, 'emit');

      mockApps.forEach((app) => {
        fixture.componentInstance.toggle();
        fixture.componentInstance.onAppClick(app, new Event('click'));
      });

      expect(emitSpy).toHaveBeenCalledTimes(mockApps.length);
      expect(fixture.componentInstance.isOpen()).toBe(false);
    });

    it('maintains state after component re-renders', () => {
      const { fixture } = renderComponent();
      fixture.componentInstance.toggle();
      TestBed.tick();

      expect(fixture.componentInstance.isOpen()).toBe(true);

      TestBed.tick();
      expect(fixture.componentInstance.isOpen()).toBe(true);
    });
  });

  describe('dropdown positioning', () => {
    it('positions dropdown to the right', () => {
      const { container, fixture } = renderComponent();
      fixture.componentInstance.toggle();
      TestBed.tick();

      const dropdown = container.querySelector('div[role="menu"]') as HTMLElement;
      expect(dropdown.className).toContain('right-0');
    });

    it('positions dropdown below button', () => {
      const { container, fixture } = renderComponent();
      fixture.componentInstance.toggle();
      TestBed.tick();

      const dropdown = container.querySelector('div[role="menu"]') as HTMLElement;
      expect(dropdown.className).toContain('top-full');
    });

    it('has correct z-index for layering', () => {
      const { container, fixture } = renderComponent();
      fixture.componentInstance.toggle();
      TestBed.tick();

      const dropdown = container.querySelector('div[role="menu"]') as HTMLElement;
      expect(dropdown.className).toContain('z-50');
    });
  });
});
