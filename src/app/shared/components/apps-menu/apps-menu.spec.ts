import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { AppsMenuComponent, AppMenuItem } from '@loan/app/shared/components/apps-menu/apps-menu';

describe('AppsMenuComponent', () => {
  let fixture: ComponentFixture<AppsMenuComponent>;
  let component: AppsMenuComponent;
  let host: HTMLElement;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppsMenuComponent],
      providers: [
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppsMenuComponent);
    component = fixture.componentInstance;
    host = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  describe('initialization', () => {
    it('creates the component', () => {
      expect(component).toBeDefined();
    });

    it('has empty apps array by default', () => {
      expect(component.apps()).toEqual([]);
    });

    it('has default title', () => {
      expect(component.title()).toBe('Apps');
    });

    it('starts with menu closed', () => {
      expect(component.isOpen()).toBe(false);
    });

    it('renders the apps button', () => {
      const button = host.querySelector('button');
      expect(button).toBeTruthy();
      expect(button?.getAttribute('aria-label')).toBe('View apps');
    });
  });

  describe('apps input', () => {
    it('accepts apps array', () => {
      fixture.componentRef.setInput('apps', mockApps);
      fixture.detectChanges();

      expect(component.apps()).toEqual(mockApps);
    });

    it('renders all app items when menu is open', () => {
      fixture.componentRef.setInput('apps', mockApps);
      component.toggle();
      fixture.detectChanges();

      const appLinks = host.querySelectorAll('a[role="menuitem"]');
      expect(appLinks.length).toBe(mockApps.length);
    });

    it('displays app labels correctly', () => {
      fixture.componentRef.setInput('apps', mockApps);
      component.toggle();
      fixture.detectChanges();

      mockApps.forEach((app) => {
        expect(host.textContent).toContain(app.label);
      });
    });

    it('renders app icons using innerHTML', () => {
      fixture.componentRef.setInput('apps', mockApps);
      component.toggle();
      fixture.detectChanges();

      const icons = host.querySelectorAll('div[class*="w-7 h-7"]');
      expect(icons.length).toBe(mockApps.length);
    });

    it('sets href on app links', () => {
      fixture.componentRef.setInput('apps', mockApps);
      component.toggle();
      fixture.detectChanges();

      const dropdown = host.querySelector('[role="menu"]');
      const links = dropdown?.querySelectorAll('a[role="menuitem"]');
      expect(links?.length).toBe(mockApps.length);
      links?.forEach((link, index) => {
        expect(link.getAttribute('href')).toBe(mockApps[index].href);
      });
    });

    it('updates when apps change', () => {
      fixture.componentRef.setInput('apps', mockApps);
      component.toggle();
      fixture.detectChanges();
      expect(host.querySelectorAll('a[role="menuitem"]').length).toBe(3);

      const newApps = mockApps.slice(0, 1);
      fixture.componentRef.setInput('apps', newApps);
      fixture.detectChanges();
      expect(host.querySelectorAll('a[role="menuitem"]').length).toBe(1);
    });
  });

  describe('title input', () => {
    it('accepts custom title', () => {
      fixture.componentRef.setInput('title', 'Applications');
      fixture.detectChanges();

      expect(component.title()).toBe('Applications');
    });

    it('displays title in dropdown header', () => {
      fixture.componentRef.setInput('title', 'My Apps');
      component.toggle();
      fixture.detectChanges();

      expect(host.textContent).toContain('My Apps');
    });

    it('updates title dynamically', () => {
      component.toggle();
      fixture.detectChanges();

      fixture.componentRef.setInput('title', 'First Title');
      fixture.detectChanges();
      expect(host.textContent).toContain('First Title');

      fixture.componentRef.setInput('title', 'Second Title');
      fixture.detectChanges();
      expect(host.textContent).toContain('Second Title');
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

    it('sets menu to closed state explicitly', () => {
      component.isOpen.set(true);

      component.close();

      expect(component.isOpen()).toBe(false);
    });
  });

  describe('appClick output', () => {
    it('emits app when clicked', () => {
      fixture.componentRef.setInput('apps', mockApps);
      component.toggle();
      fixture.detectChanges();

      const emitSpy = vi.spyOn(component.appClick, 'emit');
      const event = new Event('click');

      component.onAppClick(mockApps[0], event);

      expect(emitSpy).toHaveBeenCalledWith(mockApps[0]);
    });

    it('prevents default event', () => {
      const event = new Event('click');
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.onAppClick(mockApps[0], event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('closes menu after app click', () => {
      component.toggle();
      expect(component.isOpen()).toBe(true);

      component.onAppClick(mockApps[0], new Event('click'));

      expect(component.isOpen()).toBe(false);
    });

    it('emits correct app data', () => {
      fixture.componentRef.setInput('apps', mockApps);
      const emitSpy = vi.spyOn(component.appClick, 'emit');

      mockApps.forEach((app) => {
        component.onAppClick(app, new Event('click'));
        expect(emitSpy).toHaveBeenCalledWith(app);
      });
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

    it('does nothing when menu is already closed', () => {
      expect(component.isOpen()).toBe(false);

      const outsideElement = document.createElement('div');
      const clickEvent = new MouseEvent('click');
      Object.defineProperty(clickEvent, 'target', {
        value: outsideElement,
        writable: false,
      });

      component.onDocumentClick(clickEvent);

      expect(component.isOpen()).toBe(false);
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

      expect(button?.getAttribute('aria-label')).toBe('View apps');
      expect(button?.getAttribute('aria-haspopup')).toBe('true');
    });

    it('sets role="menu" on dropdown', () => {
      component.toggle();
      fixture.detectChanges();

      const dropdown = host.querySelector('div[role="menu"]');
      expect(dropdown).toBeTruthy();
    });

    it('sets aria-label on dropdown from title', () => {
      fixture.componentRef.setInput('title', 'My Applications');
      component.toggle();
      fixture.detectChanges();

      const dropdown = host.querySelector('div[role="menu"]');
      expect(dropdown?.getAttribute('aria-label')).toBe('My Applications');
    });

    it('sets role="menuitem" on each app link', () => {
      fixture.componentRef.setInput('apps', mockApps);
      component.toggle();
      fixture.detectChanges();

      const menuItems = host.querySelectorAll('a[role="menuitem"]');
      expect(menuItems.length).toBe(mockApps.length);
    });

    it('sets aria-label on each app link', () => {
      fixture.componentRef.setInput('apps', mockApps);
      component.toggle();
      fixture.detectChanges();

      const links = host.querySelectorAll('a[role="menuitem"]');
      links.forEach((link, index) => {
        expect(link.getAttribute('aria-label')).toBe(mockApps[index].label);
      });
    });

    it('hides icon SVG from screen readers', () => {
      const button = host.querySelector('button svg');
      expect(button?.getAttribute('aria-hidden')).toBeNull();
    });
  });

  describe('styling', () => {
    it('applies grid layout for apps', () => {
      fixture.componentRef.setInput('apps', mockApps);
      component.toggle();
      fixture.detectChanges();

      const grid = host.querySelector('.grid-cols-3');
      expect(grid).toBeTruthy();
    });

    it('applies correct button styles', () => {
      const button = host.querySelector('button');
      expect(button?.className).toContain('rounded-lg');
      expect(button?.className).toContain('hover:bg-bg-secondary');
    });

    it('positions dropdown absolutely', () => {
      component.toggle();
      fixture.detectChanges();

      const dropdown = host.querySelector('div[role="menu"]') as HTMLElement;
      expect(dropdown?.className).toContain('absolute');
      expect(dropdown?.className).toContain('right-0');
    });

    it('applies hover styles to app items', () => {
      fixture.componentRef.setInput('apps', mockApps);
      component.toggle();
      fixture.detectChanges();

      const links = host.querySelectorAll('a[role="menuitem"]');
      links.forEach((link) => {
        expect(link.className).toContain('hover:bg-bg-secondary');
        expect(link.className).toContain('group');
      });
    });
  });

  describe('edge cases', () => {
    it('handles empty apps array', () => {
      fixture.componentRef.setInput('apps', []);
      component.toggle();
      fixture.detectChanges();

      const appLinks = host.querySelectorAll('a[role="menuitem"]');
      expect(appLinks.length).toBe(0);
    });

    it('handles app with missing href', () => {
      const appWithoutHref = [{ ...mockApps[0], href: undefined }];
      fixture.componentRef.setInput('apps', appWithoutHref);
      component.toggle();
      fixture.detectChanges();

      const link = host.querySelector('a[role="menuitem"]');
      expect(link?.getAttribute('href')).toBe('#');
    });

    it('handles app with empty icon', () => {
      const appWithEmptyIcon = [{ ...mockApps[0], icon: '' }];
      fixture.componentRef.setInput('apps', appWithEmptyIcon);
      component.toggle();
      fixture.detectChanges();

      expect(host.textContent).toContain(mockApps[0].label);
    });

    it('handles special characters in labels', () => {
      const specialApp = [
        {
          ...mockApps[0],
          label: 'Reports & Analytics',
        },
      ];
      fixture.componentRef.setInput('apps', specialApp);
      component.toggle();
      fixture.detectChanges();

      expect(host.textContent).toContain('Reports & Analytics');
    });

    it('handles rapid toggle clicks', () => {
      for (let i = 0; i < 10; i++) {
        component.toggle();
      }

      expect(component.isOpen()).toBe(false);
    });

    it('handles multiple app clicks', () => {
      fixture.componentRef.setInput('apps', mockApps);
      const emitSpy = vi.spyOn(component.appClick, 'emit');

      mockApps.forEach((app) => {
        component.toggle();
        component.onAppClick(app, new Event('click'));
      });

      expect(emitSpy).toHaveBeenCalledTimes(mockApps.length);
      expect(component.isOpen()).toBe(false);
    });

    it('maintains state after component re-renders', () => {
      component.toggle();
      fixture.detectChanges();

      expect(component.isOpen()).toBe(true);

      fixture.detectChanges();
      expect(component.isOpen()).toBe(true);
    });
  });

  describe('dropdown positioning', () => {
    it('positions dropdown to the right', () => {
      component.toggle();
      fixture.detectChanges();

      const dropdown = host.querySelector('div[role="menu"]') as HTMLElement;
      expect(dropdown.className).toContain('right-0');
    });

    it('positions dropdown below button', () => {
      component.toggle();
      fixture.detectChanges();

      const dropdown = host.querySelector('div[role="menu"]') as HTMLElement;
      expect(dropdown.className).toContain('top-full');
    });

    it('has correct z-index for layering', () => {
      component.toggle();
      fixture.detectChanges();

      const dropdown = host.querySelector('div[role="menu"]') as HTMLElement;
      expect(dropdown.className).toContain('z-50');
    });
  });
});
