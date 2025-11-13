import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { SidenavComponent, SidenavItem } from '@loan/app/layout/sidenav/sidenav';

describe('SidenavComponent', () => {
  let fixture: ComponentFixture<SidenavComponent>;
  let component: SidenavComponent;
  let host: HTMLElement;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidenavComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    host = fixture.nativeElement as HTMLElement;
  });

  describe('initialization', () => {
    it('creates the component', () => {
      expect(component).toBeDefined();
    });

    it('has default input values', () => {
      expect(component.items()).toEqual([]);
      expect(component.position()).toBe('left');
      expect(component.variant()).toBe('default');
      expect(component.collapsed()).toBe(false);
      expect(component.collapsible()).toBe(false);
      expect(component.showToggle()).toBe(true);
      expect(component.width()).toBe('16rem');
      expect(component.collapsedWidth()).toBe('4rem');
    });

    it('initializes state signals correctly', () => {
      expect(component.isCollapsed()).toBe(false);
      expect(component.expandedItems().size).toBe(0);
      expect(component.hoveredItem()).toBeNull();
      expect(component.selectedItem()).toBe('');
    });

    it('renders aside element with navigation role', () => {
      fixture.detectChanges();
      const aside = host.querySelector('aside');
      expect(aside).toBeTruthy();
      expect(aside?.getAttribute('role')).toBe('navigation');
      expect(aside?.getAttribute('aria-label')).toBe('Sidebar navigation');
    });
  });

  describe('items input', () => {
    it('renders navigation items', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const menuItems = host.querySelectorAll('li[role="none"]');
      expect(menuItems.length).toBeGreaterThan(0);
    });

    it('displays labels correctly', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      expect(host.textContent).toContain('Dashboard');
      expect(host.textContent).toContain('Loans');
      expect(host.textContent).toContain('Settings');
    });

    it('renders divider items', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const divider = host.querySelector('li[role="separator"]');
      expect(divider).toBeTruthy();
    });

    it('displays badges when present', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      expect(host.textContent).toContain('12');
    });
  });

  describe('collapsed state', () => {
    it('syncs isCollapsed with collapsed input', () => {
      fixture.componentRef.setInput('collapsed', true);
      fixture.detectChanges();

      expect(component.isCollapsed()).toBe(true);
    });

    it('updates currentWidth based on collapsed state', () => {
      expect(component.currentWidth()).toBe('16rem');

      fixture.componentRef.setInput('collapsed', true);
      fixture.detectChanges();

      expect(component.currentWidth()).toBe('4rem');
    });

    it('applies correct width styles', () => {
      fixture.detectChanges();
      const aside = host.querySelector('aside') as HTMLElement;
      expect(aside.style.width).toBe('16rem');

      fixture.componentRef.setInput('collapsed', true);
      fixture.detectChanges();
      expect(aside.style.width).toBe('4rem');
    });
  });

  describe('collapsible behavior', () => {
    it('toggles collapse when collapsible', () => {
      fixture.componentRef.setInput('collapsible', true);
      fixture.detectChanges();

      expect(component.isCollapsed()).toBe(false);

      component.toggleCollapse();
      expect(component.isCollapsed()).toBe(true);

      component.toggleCollapse();
      expect(component.isCollapsed()).toBe(false);
    });

    it('does not toggle when not collapsible', () => {
      fixture.componentRef.setInput('collapsible', false);
      fixture.detectChanges();

      component.toggleCollapse();
      expect(component.isCollapsed()).toBe(false);
    });

    it('emits toggleChange when collapsed', () => {
      fixture.componentRef.setInput('collapsible', true);
      fixture.detectChanges();

      const emitSpy = vi.spyOn(component.toggleChange, 'emit');

      component.toggleCollapse();

      expect(emitSpy).toHaveBeenCalledWith(true);
    });

    it('collapses expanded items when collapsing sidenav', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('collapsible', true);
      fixture.detectChanges();

      component.toggleItemExpansion('loans');
      expect(component.expandedItems().has('loans')).toBe(true);

      component.toggleCollapse();
      expect(component.expandedItems().size).toBe(0);
    });
  });

  describe('item selection', () => {
    it('syncs selectedItem with selectedValue input', () => {
      fixture.componentRef.setInput('selectedValue', 'dashboard');
      fixture.detectChanges();

      expect(component.selectedItem()).toBe('dashboard');
    });

    it('updates selectedItem on item click', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const item = mockItems[0];
      component.onItemClick(item, new Event('click'));

      expect(component.selectedItem()).toBe('dashboard');
    });

    it('identifies selected item correctly', () => {
      component.selectedItem.set('dashboard');

      expect(component.isItemSelected('dashboard')).toBe(true);
      expect(component.isItemSelected('loans')).toBe(false);
    });
  });

  describe('item expansion (children)', () => {
    it('toggles item expansion', () => {
      expect(component.isItemExpanded('loans')).toBe(false);

      component.toggleItemExpansion('loans');
      expect(component.isItemExpanded('loans')).toBe(true);

      component.toggleItemExpansion('loans');
      expect(component.isItemExpanded('loans')).toBe(false);
    });

    it('expands item with children on click', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const loansItem = mockItems[1];
      const event = new Event('click');
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.onItemClick(loansItem, event);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(component.isItemExpanded('loans')).toBe(true);
    });

    it('does not select item when expanding children', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const loansItem = mockItems[1];
      component.onItemClick(loansItem, new Event('click'));

      expect(component.selectedItem()).not.toBe('loans');
    });

    it('renders children when item is expanded', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      component.toggleItemExpansion('loans');
      fixture.detectChanges();

      expect(host.textContent).toContain('Active Loans');
      expect(host.textContent).toContain('Pending');
    });

    it('multiple items can be expanded simultaneously', () => {
      component.toggleItemExpansion('loans');
      component.toggleItemExpansion('reports');

      expect(component.isItemExpanded('loans')).toBe(true);
      expect(component.isItemExpanded('reports')).toBe(true);
    });
  });

  describe('item click handling', () => {
    it('emits itemClick event', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const emitSpy = vi.spyOn(component.itemClick, 'emit');
      const item = mockItems[0];

      component.onItemClick(item, new Event('click'));

      expect(emitSpy).toHaveBeenCalledWith(item);
    });

    it('emits selectionChange event', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const emitSpy = vi.spyOn(component.selectionChange, 'emit');
      const item = mockItems[0];

      component.onItemClick(item, new Event('click'));

      expect(emitSpy).toHaveBeenCalledWith(item);
    });

    it('does not emit or navigate when item is disabled', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const emitSpy = vi.spyOn(component.itemClick, 'emit');
      const disabledItem = mockItems[3];
      const event = new Event('click');
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.onItemClick(disabledItem, event);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('does not prevent default for items with routerLink', () => {
      const item = mockItems[0];
      const event = new Event('click');
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.onItemClick(item, event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('prevents default for items without routerLink', () => {
      const item = { ...mockItems[0], routerLink: undefined };
      const event = new Event('click');
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.onItemClick(item, event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('hover state', () => {
    it('tracks hovered item', () => {
      component.onItemMouseEnter('dashboard');
      expect(component.hoveredItem()).toBe('dashboard');

      expect(component.isItemHovered('dashboard')).toBe(true);
      expect(component.isItemHovered('loans')).toBe(false);
    });

    it('clears hovered item on mouse leave', () => {
      component.onItemMouseEnter('dashboard');
      expect(component.hoveredItem()).toBe('dashboard');

      component.onItemMouseLeave();
      expect(component.hoveredItem()).toBeNull();
    });
  });

  describe('keyboard navigation', () => {
    it('handles Enter key to select item', () => {
      const item = mockItems[0];
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const emitSpy = vi.spyOn(component.itemClick, 'emit');

      component.onKeyDown(event, item);

      expect(emitSpy).toHaveBeenCalledWith(item);
    });

    it('handles Space key to select item', () => {
      const item = mockItems[0];
      const event = new KeyboardEvent('keydown', { key: ' ' });
      const emitSpy = vi.spyOn(component.itemClick, 'emit');

      component.onKeyDown(event, item);

      expect(emitSpy).toHaveBeenCalledWith(item);
    });

    it('handles ArrowRight to expand item with children', () => {
      const loansItem = mockItems[1];
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.onKeyDown(event, loansItem);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(component.isItemExpanded('loans')).toBe(true);
    });

    it('handles ArrowLeft to collapse expanded item', () => {
      component.toggleItemExpansion('loans');
      expect(component.isItemExpanded('loans')).toBe(true);

      const loansItem = mockItems[1];
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.onKeyDown(event, loansItem);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(component.isItemExpanded('loans')).toBe(false);
    });

    it('does not handle keyboard events for disabled items', () => {
      const disabledItem = mockItems[3];
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const emitSpy = vi.spyOn(component.itemClick, 'emit');

      component.onKeyDown(event, disabledItem);

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('does not expand item without children on ArrowRight', () => {
      const dashboardItem = mockItems[0];
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.onKeyDown(event, dashboardItem);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
  });

  describe('position input', () => {
    it('applies left border when position is left', () => {
      fixture.componentRef.setInput('position', 'left');
      fixture.detectChanges();

      const aside = host.querySelector('aside');
      expect(aside?.className).toContain('border-r');
    });

    it('applies right border when position is right', () => {
      fixture.componentRef.setInput('position', 'right');
      fixture.detectChanges();

      const aside = host.querySelector('aside');
      expect(aside?.className).toContain('border-l');
    });
  });

  describe('header and footer', () => {
    it('renders header when provided', () => {
      fixture.componentRef.setInput('header', 'Navigation Menu');
      fixture.detectChanges();

      expect(host.textContent).toContain('Navigation Menu');
    });

    it('renders footer when provided and not collapsed', () => {
      fixture.componentRef.setInput('footer', 'Version 1.0');
      fixture.detectChanges();

      expect(host.textContent).toContain('Version 1.0');
    });

    it('hides footer when collapsed', () => {
      fixture.componentRef.setInput('footer', 'Version 1.0');
      fixture.componentRef.setInput('collapsed', true);
      fixture.detectChanges();

      const footer = host.querySelector('.border-t');
      expect(footer).toBeFalsy();
    });
  });

  describe('logo rendering', () => {
    it('renders logo when provided and not collapsed', () => {
      fixture.componentRef.setInput('logo', 'heroHome');
      fixture.detectChanges();

      const logo = host.querySelector('ng-icon');
      expect(logo).toBeTruthy();
    });

    it('renders collapsed logo when provided and collapsed', () => {
      fixture.componentRef.setInput('logo', 'heroHome');
      fixture.componentRef.setInput('logoCollapsed', 'heroMenu');
      fixture.componentRef.setInput('collapsed', true);
      fixture.detectChanges();

      const logo = host.querySelector('ng-icon');
      expect(logo).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('sets correct ARIA attributes on aside', () => {
      fixture.detectChanges();
      const aside = host.querySelector('aside');

      expect(aside?.getAttribute('role')).toBe('navigation');
      expect(aside?.getAttribute('aria-label')).toBe('Sidebar navigation');
    });

    it('sets aria-expanded on collapsible toggle', () => {
      fixture.componentRef.setInput('collapsible', true);
      fixture.componentRef.setInput('showToggle', true);
      fixture.detectChanges();

      const toggleButton = host.querySelector('button[aria-label="Toggle sidebar"]');
      expect(toggleButton?.getAttribute('aria-expanded')).toBe('true');
    });

    it('sets aria-disabled on disabled items', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const disabledItem = Array.from(host.querySelectorAll('a')).find((link) =>
        link.textContent?.includes('Settings'),
      );
      expect(disabledItem?.getAttribute('aria-disabled')).toBe('true');
    });

    it('sets tabindex -1 on disabled items', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const disabledItem = Array.from(host.querySelectorAll('a')).find((link) =>
        link.textContent?.includes('Settings'),
      );
      expect(disabledItem?.getAttribute('tabindex')).toBe('-1');
    });

    it('sets aria-current on selected item', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.componentRef.setInput('selectedValue', 'dashboard');
      fixture.detectChanges();

      const selectedItem = Array.from(host.querySelectorAll('a')).find((link) =>
        link.textContent?.includes('Dashboard'),
      );
      expect(selectedItem?.getAttribute('aria-current')).toBe('page');
    });
  });

  describe('edge cases', () => {
    it('handles empty items array', () => {
      fixture.componentRef.setInput('items', []);
      fixture.detectChanges();

      const menuItems = host.querySelectorAll('li[role="none"]');
      expect(menuItems.length).toBe(0);
    });

    it('handles item with empty children array', () => {
      const itemWithEmptyChildren = [{ ...mockItems[0], children: [] }];
      fixture.componentRef.setInput('items', itemWithEmptyChildren);
      fixture.detectChanges();

      expect(() => component.onItemClick(itemWithEmptyChildren[0], new Event('click'))).not.toThrow();
    });

    it('handles multiple rapid toggle calls', () => {
      fixture.componentRef.setInput('collapsible', true);

      for (let i = 0; i < 10; i++) {
        component.toggleCollapse();
      }

      expect(component.isCollapsed()).toBe(false);
    });

    it('handles special characters in labels', () => {
      const specialItem = [
        {
          label: 'Reports & <Analytics>',
          value: 'reports',
          routerLink: '/reports',
        },
      ];
      fixture.componentRef.setInput('items', specialItem);
      fixture.detectChanges();

      expect(host.textContent).toContain('Reports & <Analytics>');
    });
  });
});
