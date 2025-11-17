import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { SidenavComponent, SidenavItem } from '@loan/app/layout/sidenav/sidenav';

describe('SidenavComponent', () => {
  const mockItems: SidenavItem[] = [
    {
      label: 'Dashboard',
      icon: 'heroChartPie',
      value: 'dashboard',
      routerLink: '/dashboard',
    },
    {
      label: 'Loans',
      icon: 'heroDocumentText',
      value: 'loans',
      routerLink: '/loans',
      badge: '12',
      children: [
        {
          label: 'Active Loans',
          icon: 'heroCheckCircle',
          value: 'active-loans',
          routerLink: '/loans/active',
          badge: '8',
        },
        {
          label: 'Pending',
          icon: 'heroClock',
          value: 'pending-loans',
          routerLink: '/loans/pending',
        },
      ],
    },
    {
      label: 'divider',
      value: 'divider-1',
      divider: true,
    },
    {
      label: 'Settings',
      icon: 'heroCog',
      value: 'settings',
      routerLink: '/settings',
      disabled: true,
    },
  ];

  const defaultProviders = [
    provideZonelessChangeDetection(),
    provideRouter([]),
  ];

  describe('initialization', () => {
    it('creates the component', async () => {
      // Arrange & Act
      const { container } = await render(SidenavComponent, {
        providers: defaultProviders,
      });

      // Assert
      expect(container).toBeTruthy();
    });

    it('has default input values', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        providers: defaultProviders,
      });

      // Assert
      expect(fixture.componentInstance.items()).toEqual([]);
      expect(fixture.componentInstance.position()).toBe('left');
      expect(fixture.componentInstance.variant()).toBe('default');
      expect(fixture.componentInstance.collapsed()).toBe(false);
      expect(fixture.componentInstance.collapsible()).toBe(false);
      expect(fixture.componentInstance.showToggle()).toBe(true);
      expect(fixture.componentInstance.width()).toBe('16rem');
      expect(fixture.componentInstance.collapsedWidth()).toBe('4rem');
    });

    it('initializes state signals correctly', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        providers: defaultProviders,
      });

      // Assert
      expect(fixture.componentInstance.isCollapsed()).toBe(false);
      expect(fixture.componentInstance.expandedItems().size).toBe(0);
      expect(fixture.componentInstance.hoveredItem()).toBeNull();
      expect(fixture.componentInstance.selectedItem()).toBe('');
    });

    it('renders aside element with navigation role', async () => {
      // Arrange & Act
      const { container } = await render(SidenavComponent, {
        providers: defaultProviders,
      });

      // Assert
      const aside = container.querySelector('aside');
      expect(aside).toBeTruthy();
      expect(aside?.getAttribute('role')).toBe('navigation');
      expect(aside?.getAttribute('aria-label')).toBe('Sidebar navigation');
    });
  });

  describe('items input', () => {
    it('renders navigation items', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        componentProperties: { items: mockItems },
        providers: defaultProviders,
      });

      // Assert
      const menuItems = fixture.nativeElement.querySelectorAll('li[role="none"]');
      expect(menuItems.length).toBeGreaterThan(0);
    });

    it('displays labels correctly', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        componentProperties: { items: mockItems },
        providers: defaultProviders,
      });

      // Assert
      expect(fixture.nativeElement.textContent).toContain('Dashboard');
      expect(fixture.nativeElement.textContent).toContain('Loans');
      expect(fixture.nativeElement.textContent).toContain('Settings');
    });

    it('renders divider items', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        componentProperties: { items: mockItems },
        providers: defaultProviders,
      });

      // Assert
      const divider = fixture.nativeElement.querySelector('li[role="separator"]');
      expect(divider).toBeTruthy();
    });

    it('displays badges when present', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        componentProperties: { items: mockItems },
        providers: defaultProviders,
      });

      // Assert
      expect(fixture.nativeElement.textContent).toContain('12');
    });
  });

  describe('collapsed state', () => {
    it('syncs isCollapsed with collapsed input', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        componentProperties: { collapsed: true },
        providers: defaultProviders,
      });

      // Assert
      expect(fixture.componentInstance.isCollapsed()).toBe(true);
    });

    it('updates currentWidth based on collapsed state', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        providers: defaultProviders,
      });

      expect(fixture.componentInstance.currentWidth()).toBe('16rem');

      fixture.componentInstance.collapsed.set(true);
      fixture.detectChanges();

      // Assert
      expect(fixture.componentInstance.currentWidth()).toBe('4rem');
    });

    it('applies correct width styles', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        providers: defaultProviders,
      });

      const aside = fixture.nativeElement.querySelector('aside') as HTMLElement;
      expect(aside.style.width).toBe('16rem');

      fixture.componentInstance.collapsed.set(true);
      fixture.detectChanges();

      // Assert
      expect(aside.style.width).toBe('4rem');
    });
  });

  describe('collapsible behavior', () => {
    it('toggles collapse when collapsible', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        componentProperties: { collapsible: true },
        providers: defaultProviders,
      });

      expect(fixture.componentInstance.isCollapsed()).toBe(false);

      fixture.componentInstance.toggleCollapse();

      expect(fixture.componentInstance.isCollapsed()).toBe(true);

      fixture.componentInstance.toggleCollapse();

      // Assert
      expect(fixture.componentInstance.isCollapsed()).toBe(false);
    });

    it('does not toggle when not collapsible', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        componentProperties: { collapsible: false },
        providers: defaultProviders,
      });

      fixture.componentInstance.toggleCollapse();

      // Assert
      expect(fixture.componentInstance.isCollapsed()).toBe(false);
    });

    it('emits toggleChange when collapsed', async () => {
      // Arrange
      const { fixture } = await render(SidenavComponent, {
        componentProperties: { collapsible: true },
        providers: defaultProviders,
      });

      const emitSpy = vi.spyOn(fixture.componentInstance.toggleChange, 'emit');

      // Act
      fixture.componentInstance.toggleCollapse();

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(true);
    });

    it('collapses expanded items when collapsing sidenav', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        componentProperties: { items: mockItems, collapsible: true },
        providers: defaultProviders,
      });

      fixture.componentInstance.toggleItemExpansion('loans');
      expect(fixture.componentInstance.expandedItems().has('loans')).toBe(true);

      fixture.componentInstance.toggleCollapse();

      // Assert
      expect(fixture.componentInstance.expandedItems().size).toBe(0);
    });
  });

  describe('item selection', () => {
    it('syncs selectedItem with selectedValue input', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        componentProperties: { selectedValue: 'dashboard' },
        providers: defaultProviders,
      });

      // Assert
      expect(fixture.componentInstance.selectedItem()).toBe('dashboard');
    });

    it('updates selectedItem on item click', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        componentProperties: { items: mockItems },
        providers: defaultProviders,
      });

      const item = mockItems[0];
      fixture.componentInstance.onItemClick(item, new Event('click'));

      // Assert
      expect(fixture.componentInstance.selectedItem()).toBe('dashboard');
    });

    it('identifies selected item correctly', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        providers: defaultProviders,
      });

      fixture.componentInstance.selectedItem.set('dashboard');

      // Assert
      expect(fixture.componentInstance.isItemSelected('dashboard')).toBe(true);
      expect(fixture.componentInstance.isItemSelected('loans')).toBe(false);
    });
  });

  describe('item expansion (children)', () => {
    it('toggles item expansion', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        providers: defaultProviders,
      });

      expect(fixture.componentInstance.isItemExpanded('loans')).toBe(false);

      fixture.componentInstance.toggleItemExpansion('loans');
      expect(fixture.componentInstance.isItemExpanded('loans')).toBe(true);

      fixture.componentInstance.toggleItemExpansion('loans');

      // Assert
      expect(fixture.componentInstance.isItemExpanded('loans')).toBe(false);
    });

    it('expands item with children on click', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        componentProperties: { items: mockItems },
        providers: defaultProviders,
      });

      const loansItem = mockItems[1];
      const event = new Event('click');
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      fixture.componentInstance.onItemClick(loansItem, event);

      // Assert
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(fixture.componentInstance.isItemExpanded('loans')).toBe(true);
    });

    it('does not select item when expanding children', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        componentProperties: { items: mockItems },
        providers: defaultProviders,
      });

      const loansItem = mockItems[1];
      fixture.componentInstance.onItemClick(loansItem, new Event('click'));

      // Assert
      expect(fixture.componentInstance.selectedItem()).not.toBe('loans');
    });

    it('renders children when item is expanded', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        componentProperties: { items: mockItems },
        providers: defaultProviders,
      });

      fixture.componentInstance.toggleItemExpansion('loans');
      fixture.detectChanges();

      // Assert
      expect(fixture.nativeElement.textContent).toContain('Active Loans');
      expect(fixture.nativeElement.textContent).toContain('Pending');
    });

    it('multiple items can be expanded simultaneously', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        providers: defaultProviders,
      });

      fixture.componentInstance.toggleItemExpansion('loans');
      fixture.componentInstance.toggleItemExpansion('reports');

      // Assert
      expect(fixture.componentInstance.isItemExpanded('loans')).toBe(true);
      expect(fixture.componentInstance.isItemExpanded('reports')).toBe(true);
    });
  });

  describe('item click handling', () => {
    it('emits itemClick event', async () => {
      // Arrange
      const { fixture } = await render(SidenavComponent, {
        componentProperties: { items: mockItems },
        providers: defaultProviders,
      });

      const emitSpy = vi.spyOn(fixture.componentInstance.itemClick, 'emit');
      const item = mockItems[0];

      // Act
      fixture.componentInstance.onItemClick(item, new Event('click'));

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(item);
    });

    it('emits selectionChange event', async () => {
      // Arrange
      const { fixture } = await render(SidenavComponent, {
        componentProperties: { items: mockItems },
        providers: defaultProviders,
      });

      const emitSpy = vi.spyOn(fixture.componentInstance.selectionChange, 'emit');
      const item = mockItems[0];

      // Act
      fixture.componentInstance.onItemClick(item, new Event('click'));

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(item);
    });

    it('does not emit or navigate when item is disabled', async () => {
      // Arrange
      const { fixture } = await render(SidenavComponent, {
        componentProperties: { items: mockItems },
        providers: defaultProviders,
      });

      const emitSpy = vi.spyOn(fixture.componentInstance.itemClick, 'emit');
      const disabledItem = mockItems[3];
      const event = new Event('click');
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      // Act
      fixture.componentInstance.onItemClick(disabledItem, event);

      // Assert
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('does not prevent default for items with routerLink', async () => {
      // Arrange
      const item = mockItems[0];
      const event = new Event('click');
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      const { fixture } = await render(SidenavComponent, {
        providers: defaultProviders,
      });

      // Act
      fixture.componentInstance.onItemClick(item, event);

      // Assert
      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('prevents default for items without routerLink', async () => {
      // Arrange
      const item = { ...mockItems[0], routerLink: undefined };
      const event = new Event('click');
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      const { fixture } = await render(SidenavComponent, {
        providers: defaultProviders,
      });

      // Act
      fixture.componentInstance.onItemClick(item, event);

      // Assert
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('hover state', () => {
    it('tracks hovered item', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        providers: defaultProviders,
      });

      fixture.componentInstance.onItemMouseEnter('dashboard');
      expect(fixture.componentInstance.hoveredItem()).toBe('dashboard');

      // Assert
      expect(fixture.componentInstance.isItemHovered('dashboard')).toBe(true);
      expect(fixture.componentInstance.isItemHovered('loans')).toBe(false);
    });

    it('clears hovered item on mouse leave', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        providers: defaultProviders,
      });

      fixture.componentInstance.onItemMouseEnter('dashboard');
      expect(fixture.componentInstance.hoveredItem()).toBe('dashboard');

      fixture.componentInstance.onItemMouseLeave();

      // Assert
      expect(fixture.componentInstance.hoveredItem()).toBeNull();
    });
  });

  describe('keyboard navigation', () => {
    it('handles Enter key to select item', async () => {
      // Arrange
      const { fixture } = await render(SidenavComponent, {
        providers: defaultProviders,
      });

      const item = mockItems[0];
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const emitSpy = vi.spyOn(fixture.componentInstance.itemClick, 'emit');

      // Act
      fixture.componentInstance.onKeyDown(event, item);

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(item);
    });

    it('handles Space key to select item', async () => {
      // Arrange
      const { fixture } = await render(SidenavComponent, {
        providers: defaultProviders,
      });

      const item = mockItems[0];
      const event = new KeyboardEvent('keydown', { key: ' ' });
      const emitSpy = vi.spyOn(fixture.componentInstance.itemClick, 'emit');

      // Act
      fixture.componentInstance.onKeyDown(event, item);

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(item);
    });

    it('handles ArrowRight to expand item with children', async () => {
      // Arrange
      const { fixture } = await render(SidenavComponent, {
        providers: defaultProviders,
      });

      const loansItem = mockItems[1];
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      // Act
      fixture.componentInstance.onKeyDown(event, loansItem);

      // Assert
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(fixture.componentInstance.isItemExpanded('loans')).toBe(true);
    });

    it('handles ArrowLeft to collapse expanded item', async () => {
      // Arrange
      const { fixture } = await render(SidenavComponent, {
        providers: defaultProviders,
      });

      fixture.componentInstance.toggleItemExpansion('loans');
      expect(fixture.componentInstance.isItemExpanded('loans')).toBe(true);

      const loansItem = mockItems[1];
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      // Act
      fixture.componentInstance.onKeyDown(event, loansItem);

      // Assert
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(fixture.componentInstance.isItemExpanded('loans')).toBe(false);
    });

    it('does not handle keyboard events for disabled items', async () => {
      // Arrange
      const { fixture } = await render(SidenavComponent, {
        providers: defaultProviders,
      });

      const disabledItem = mockItems[3];
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const emitSpy = vi.spyOn(fixture.componentInstance.itemClick, 'emit');

      // Act
      fixture.componentInstance.onKeyDown(event, disabledItem);

      // Assert
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('does not expand item without children on ArrowRight', async () => {
      // Arrange
      const { fixture } = await render(SidenavComponent, {
        providers: defaultProviders,
      });

      const dashboardItem = mockItems[0];
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      // Act
      fixture.componentInstance.onKeyDown(event, dashboardItem);

      // Assert
      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
  });

  describe('position input', () => {
    it('applies left border when position is left', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        componentProperties: { position: 'left' },
        providers: defaultProviders,
      });

      const aside = fixture.nativeElement.querySelector('aside');

      // Assert
      expect(aside?.className).toContain('border-r');
    });

    it('applies right border when position is right', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        componentProperties: { position: 'right' },
        providers: defaultProviders,
      });

      const aside = fixture.nativeElement.querySelector('aside');

      // Assert
      expect(aside?.className).toContain('border-l');
    });
  });

  describe('header and footer', () => {
    it('renders header when provided', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        componentProperties: { header: 'Navigation Menu' },
        providers: defaultProviders,
      });

      // Assert
      expect(fixture.nativeElement.textContent).toContain('Navigation Menu');
    });

    it('renders footer when provided and not collapsed', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        componentProperties: { footer: 'Version 1.0' },
        providers: defaultProviders,
      });

      // Assert
      expect(fixture.nativeElement.textContent).toContain('Version 1.0');
    });

    it('hides footer when collapsed', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        componentProperties: { footer: 'Version 1.0', collapsed: true },
        providers: defaultProviders,
      });

      const footer = fixture.nativeElement.querySelector('.border-t');

      // Assert
      expect(footer).toBeFalsy();
    });
  });

  describe('logo rendering', () => {
    it('renders logo when provided and not collapsed', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        componentProperties: { logo: 'heroHome' },
        providers: defaultProviders,
      });

      const logo = fixture.nativeElement.querySelector('ng-icon');

      // Assert
      expect(logo).toBeTruthy();
    });

    it('renders collapsed logo when provided and collapsed', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        componentProperties: { logo: 'heroHome', logoCollapsed: 'heroMenu', collapsed: true },
        providers: defaultProviders,
      });

      const logo = fixture.nativeElement.querySelector('ng-icon');

      // Assert
      expect(logo).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('sets correct ARIA attributes on aside', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        providers: defaultProviders,
      });

      const aside = fixture.nativeElement.querySelector('aside');

      // Assert
      expect(aside?.getAttribute('role')).toBe('navigation');
      expect(aside?.getAttribute('aria-label')).toBe('Sidebar navigation');
    });

    it('sets aria-expanded on collapsible toggle', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        componentProperties: { collapsible: true, showToggle: true },
        providers: defaultProviders,
      });

      const toggleButton = fixture.nativeElement.querySelector('button[aria-label="Toggle sidebar"]');

      // Assert
      expect(toggleButton?.getAttribute('aria-expanded')).toBe('true');
    });

    it('sets aria-disabled on disabled items', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        componentProperties: { items: mockItems },
        providers: defaultProviders,
      });

      const disabledItem = Array.from(fixture.nativeElement.querySelectorAll('a')).find((link: any) =>
        link.textContent?.includes('Settings'),
      );

      // Assert
      expect(disabledItem?.getAttribute('aria-disabled')).toBe('true');
    });

    it('sets tabindex -1 on disabled items', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        componentProperties: { items: mockItems },
        providers: defaultProviders,
      });

      const disabledItem = Array.from(fixture.nativeElement.querySelectorAll('a')).find((link: any) =>
        link.textContent?.includes('Settings'),
      );

      // Assert
      expect(disabledItem?.getAttribute('tabindex')).toBe('-1');
    });

    it('sets aria-current on selected item', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        componentProperties: { items: mockItems, selectedValue: 'dashboard' },
        providers: defaultProviders,
      });

      const selectedItem = Array.from(fixture.nativeElement.querySelectorAll('a')).find((link: any) =>
        link.textContent?.includes('Dashboard'),
      );

      // Assert
      expect(selectedItem?.getAttribute('aria-current')).toBe('page');
    });
  });

  describe('edge cases', () => {
    it('handles empty items array', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        componentProperties: { items: [] },
        providers: defaultProviders,
      });

      const menuItems = fixture.nativeElement.querySelectorAll('li[role="none"]');

      // Assert
      expect(menuItems.length).toBe(0);
    });

    it('handles item with empty children array', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        providers: defaultProviders,
      });

      const itemWithEmptyChildren = [{ ...mockItems[0], children: [] }];

      // Act & Assert
      expect(() => fixture.componentInstance.onItemClick(itemWithEmptyChildren[0], new Event('click'))).not.toThrow();
    });

    it('handles multiple rapid toggle calls', async () => {
      // Arrange & Act
      const { fixture } = await render(SidenavComponent, {
        componentProperties: { collapsible: true },
        providers: defaultProviders,
      });

      for (let i = 0; i < 10; i++) {
        fixture.componentInstance.toggleCollapse();
      }

      // Assert
      expect(fixture.componentInstance.isCollapsed()).toBe(false);
    });

    it('handles special characters in labels', async () => {
      // Arrange & Act
      const specialItem = [
        {
          label: 'Reports & <Analytics>',
          value: 'reports',
          routerLink: '/reports',
        },
      ];

      const { fixture } = await render(SidenavComponent, {
        componentProperties: { items: specialItem },
        providers: defaultProviders,
      });

      // Assert
      expect(fixture.nativeElement.textContent).toContain('Reports & <Analytics>');
    });
  });
});
