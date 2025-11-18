// Angular testing
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, inputBinding, outputBinding, signal } from '@angular/core';
import { provideRouter } from '@angular/router';

// Testing library
import { within } from '@testing-library/dom';

// Vitest
import { describe, it, expect, vi } from 'vitest';

// Component and dependencies
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

  const defaultProviders = [provideZonelessChangeDetection(), provideRouter([])];

  describe('initialization', () => {
    it('creates the component', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent);
      TestBed.tick();

      // Assert
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('has default input values', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent);
      TestBed.tick();

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

    it('initializes state signals correctly', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent);
      TestBed.tick();

      // Assert
      expect(fixture.componentInstance.isCollapsed()).toBe(false);
      expect(fixture.componentInstance.expandedItems().size).toBe(0);
      expect(fixture.componentInstance.hoveredItem()).toBeNull();
      expect(fixture.componentInstance.selectedItem()).toBe('');
    });

    it('renders aside element with navigation role', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent);
      TestBed.tick();

      // Assert
      const aside = fixture.nativeElement.querySelector('aside');
      expect(aside).toBeTruthy();
      expect(aside?.getAttribute('role')).toBe('navigation');
      expect(aside?.getAttribute('aria-label')).toBe('Sidebar navigation');
    });
  });

  describe('items input', () => {
    it('renders navigation items', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [inputBinding('items', () => mockItems)],
      });
      TestBed.tick();

      // Assert
      const menuItems = fixture.nativeElement.querySelectorAll('li[role="none"]');
      expect(menuItems.length).toBeGreaterThan(0);
    });

    it('displays labels correctly', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [inputBinding('items', () => mockItems)],
      });
      TestBed.tick();

      // Assert
      expect(fixture.nativeElement.textContent).toContain('Dashboard');
      expect(fixture.nativeElement.textContent).toContain('Loans');
      expect(fixture.nativeElement.textContent).toContain('Settings');
    });

    it('renders divider items', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [inputBinding('items', () => mockItems)],
      });
      TestBed.tick();

      // Assert
      const divider = fixture.nativeElement.querySelector('li[role="separator"]');
      expect(divider).toBeTruthy();
    });

    it('displays badges when present', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [inputBinding('items', () => mockItems)],
      });
      TestBed.tick();

      // Assert
      expect(fixture.nativeElement.textContent).toContain('12');
    });
  });

  describe('collapsed state', () => {
    it('syncs isCollapsed with collapsed input', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [inputBinding('collapsed', () => true)],
      });
      TestBed.tick();

      // Assert
      expect(fixture.componentInstance.isCollapsed()).toBe(true);
    });

    it('uses expanded width when not collapsed', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [inputBinding('collapsed', () => false)],
      });
      TestBed.tick();

      // Assert
      expect(fixture.componentInstance.currentWidth()).toBe('16rem');
    });

    it('uses collapsed width when collapsed', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [inputBinding('collapsed', () => true)],
      });
      TestBed.tick();

      // Assert
      expect(fixture.componentInstance.currentWidth()).toBe('4rem');
    });

    it('applies expanded width style when not collapsed', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [inputBinding('collapsed', () => false)],
      });
      TestBed.tick();

      const aside = fixture.nativeElement.querySelector('aside') as HTMLElement;

      // Assert
      expect(aside.style.width).toBe('16rem');
    });

    it('applies collapsed width style when collapsed', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [inputBinding('collapsed', () => true)],
      });
      TestBed.tick();

      const aside = fixture.nativeElement.querySelector('aside') as HTMLElement;

      // Assert
      expect(aside.style.width).toBe('4rem');
    });
  });

  describe('collapsible behavior', () => {
    it('toggles collapse when collapsible', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [inputBinding('collapsible', () => true)],
      });
      TestBed.tick();

      expect(fixture.componentInstance.isCollapsed()).toBe(false);

      // Act
      fixture.componentInstance.toggleCollapse();
      expect(fixture.componentInstance.isCollapsed()).toBe(true);

      fixture.componentInstance.toggleCollapse();

      // Assert
      expect(fixture.componentInstance.isCollapsed()).toBe(false);
    });

    it('does not toggle when not collapsible', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [inputBinding('collapsible', () => false)],
      });
      TestBed.tick();

      // Act
      fixture.componentInstance.toggleCollapse();

      // Assert
      expect(fixture.componentInstance.isCollapsed()).toBe(false);
    });

    it('emits toggleChange when collapsed', () => {
      // Arrange
      const toggleSignal = signal(false);
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [
          inputBinding('collapsible', () => true),
          outputBinding('toggleChange', (value: boolean) => toggleSignal.set(value)),
        ],
      });
      TestBed.tick();

      // Act
      fixture.componentInstance.toggleCollapse();
      TestBed.tick();

      // Assert
      expect(toggleSignal()).toBe(true);
    });

    it('collapses expanded items when collapsing sidenav', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [inputBinding('items', () => mockItems), inputBinding('collapsible', () => true)],
      });
      TestBed.tick();

      // Act
      fixture.componentInstance.toggleItemExpansion('loans');
      expect(fixture.componentInstance.expandedItems().has('loans')).toBe(true);

      fixture.componentInstance.toggleCollapse();

      // Assert
      expect(fixture.componentInstance.expandedItems().size).toBe(0);
    });
  });

  describe('item selection', () => {
    it('syncs selectedItem with selectedValue input', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [inputBinding('selectedValue', () => 'dashboard')],
      });
      TestBed.tick();

      // Assert
      expect(fixture.componentInstance.selectedItem()).toBe('dashboard');
    });

    it('updates selectedItem on item click', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [inputBinding('items', () => mockItems)],
      });
      TestBed.tick();

      const item = mockItems[0];

      // Act
      fixture.componentInstance.onItemClick(item, new Event('click'));

      // Assert
      expect(fixture.componentInstance.selectedItem()).toBe('dashboard');
    });

    it('identifies selected item correctly', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent);
      TestBed.tick();

      // Act
      fixture.componentInstance.selectedItem.set('dashboard');

      // Assert
      expect(fixture.componentInstance.isItemSelected('dashboard')).toBe(true);
      expect(fixture.componentInstance.isItemSelected('loans')).toBe(false);
    });
  });

  describe('item expansion (children)', () => {
    it('toggles item expansion', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent);
      TestBed.tick();

      expect(fixture.componentInstance.isItemExpanded('loans')).toBe(false);

      // Act
      fixture.componentInstance.toggleItemExpansion('loans');
      expect(fixture.componentInstance.isItemExpanded('loans')).toBe(true);

      fixture.componentInstance.toggleItemExpansion('loans');

      // Assert
      expect(fixture.componentInstance.isItemExpanded('loans')).toBe(false);
    });

    it('expands item with children on click', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [inputBinding('items', () => mockItems)],
      });
      TestBed.tick();

      const loansItem = mockItems[1];
      const event = new Event('click');
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      // Act
      fixture.componentInstance.onItemClick(loansItem, event);

      // Assert
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(fixture.componentInstance.isItemExpanded('loans')).toBe(true);
    });

    it('does not select item when expanding children', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [inputBinding('items', () => mockItems)],
      });
      TestBed.tick();

      const loansItem = mockItems[1];

      // Act
      fixture.componentInstance.onItemClick(loansItem, new Event('click'));

      // Assert
      expect(fixture.componentInstance.selectedItem()).not.toBe('loans');
    });

    it('renders children when item is expanded', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [inputBinding('items', () => mockItems)],
      });
      TestBed.tick();

      // Act
      fixture.componentInstance.toggleItemExpansion('loans');
      TestBed.tick();

      // Assert
      expect(fixture.nativeElement.textContent).toContain('Active Loans');
      expect(fixture.nativeElement.textContent).toContain('Pending');
    });

    it('multiple items can be expanded simultaneously', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent);
      TestBed.tick();

      // Act
      fixture.componentInstance.toggleItemExpansion('loans');
      fixture.componentInstance.toggleItemExpansion('reports');

      // Assert
      expect(fixture.componentInstance.isItemExpanded('loans')).toBe(true);
      expect(fixture.componentInstance.isItemExpanded('reports')).toBe(true);
    });
  });

  describe('item click handling', () => {
    it('emits itemClick event', () => {
      // Arrange
      const itemClickSignal = signal<SidenavItem | null>(null);
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [
          inputBinding('items', () => mockItems),
          outputBinding('itemClick', (item: SidenavItem) => itemClickSignal.set(item)),
        ],
      });
      TestBed.tick();

      const item = mockItems[0];

      // Act
      fixture.componentInstance.onItemClick(item, new Event('click'));
      TestBed.tick();

      // Assert
      expect(itemClickSignal()).toEqual(item);
    });

    it('emits selectionChange event', () => {
      // Arrange
      const selectionChangeSignal = signal<SidenavItem | null>(null);
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [
          inputBinding('items', () => mockItems),
          outputBinding('selectionChange', (item: SidenavItem) => selectionChangeSignal.set(item)),
        ],
      });
      TestBed.tick();

      const item = mockItems[0];

      // Act
      fixture.componentInstance.onItemClick(item, new Event('click'));
      TestBed.tick();

      // Assert
      expect(selectionChangeSignal()).toEqual(item);
    });

    it('does not emit or navigate when item is disabled', () => {
      // Arrange
      const itemClickSignal = signal<SidenavItem | null>(null);
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [
          inputBinding('items', () => mockItems),
          outputBinding('itemClick', (item: SidenavItem) => itemClickSignal.set(item)),
        ],
      });
      TestBed.tick();

      const disabledItem = mockItems[3];
      const event = new Event('click');
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      // Act
      fixture.componentInstance.onItemClick(disabledItem, event);
      TestBed.tick();

      // Assert
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(itemClickSignal()).toBeNull();
    });

    it('does not prevent default for items with routerLink', () => {
      // Arrange
      const item = mockItems[0];
      const event = new Event('click');
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent);
      TestBed.tick();

      // Act
      fixture.componentInstance.onItemClick(item, event);

      // Assert
      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('prevents default for items without routerLink', () => {
      // Arrange
      const item = { ...mockItems[0], routerLink: undefined };
      const event = new Event('click');
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent);
      TestBed.tick();

      // Act
      fixture.componentInstance.onItemClick(item, event);

      // Assert
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('hover state', () => {
    it('tracks hovered item', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent);
      TestBed.tick();

      // Act
      fixture.componentInstance.onItemMouseEnter('dashboard');
      expect(fixture.componentInstance.hoveredItem()).toBe('dashboard');

      // Assert
      expect(fixture.componentInstance.isItemHovered('dashboard')).toBe(true);
      expect(fixture.componentInstance.isItemHovered('loans')).toBe(false);
    });

    it('clears hovered item on mouse leave', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent);
      TestBed.tick();

      // Act
      fixture.componentInstance.onItemMouseEnter('dashboard');
      expect(fixture.componentInstance.hoveredItem()).toBe('dashboard');

      fixture.componentInstance.onItemMouseLeave();

      // Assert
      expect(fixture.componentInstance.hoveredItem()).toBeNull();
    });
  });

  describe('keyboard navigation', () => {
    it('handles Enter key to select item', () => {
      // Arrange
      const itemClickSignal = signal<SidenavItem | null>(null);
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [outputBinding('itemClick', (item: SidenavItem) => itemClickSignal.set(item))],
      });
      TestBed.tick();

      const item = mockItems[0];
      const event = new KeyboardEvent('keydown', { key: 'Enter' });

      // Act
      fixture.componentInstance.onKeyDown(event, item);
      TestBed.tick();

      // Assert
      expect(itemClickSignal()).toEqual(item);
    });

    it('handles Space key to select item', () => {
      // Arrange
      const itemClickSignal = signal<SidenavItem | null>(null);
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [outputBinding('itemClick', (item: SidenavItem) => itemClickSignal.set(item))],
      });
      TestBed.tick();

      const item = mockItems[0];
      const event = new KeyboardEvent('keydown', { key: ' ' });

      // Act
      fixture.componentInstance.onKeyDown(event, item);
      TestBed.tick();

      // Assert
      expect(itemClickSignal()).toEqual(item);
    });

    it('handles ArrowRight to expand item with children', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent);
      TestBed.tick();

      const loansItem = mockItems[1];
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      // Act
      fixture.componentInstance.onKeyDown(event, loansItem);

      // Assert
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(fixture.componentInstance.isItemExpanded('loans')).toBe(true);
    });

    it('handles ArrowLeft to collapse expanded item', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent);
      TestBed.tick();

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

    it('does not handle keyboard events for disabled items', () => {
      // Arrange
      const itemClickSignal = signal<SidenavItem | null>(null);
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [outputBinding('itemClick', (item: SidenavItem) => itemClickSignal.set(item))],
      });
      TestBed.tick();

      const disabledItem = mockItems[3];
      const event = new KeyboardEvent('keydown', { key: 'Enter' });

      // Act
      fixture.componentInstance.onKeyDown(event, disabledItem);
      TestBed.tick();

      // Assert
      expect(itemClickSignal()).toBeNull();
    });

    it('does not expand item without children on ArrowRight', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent);
      TestBed.tick();

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
    it('applies left border when position is left', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [inputBinding('position', () => 'left')],
      });
      TestBed.tick();

      // Assert
      const aside = fixture.nativeElement.querySelector('aside');
      expect(aside?.className).toContain('border-r');
    });

    it('applies right border when position is right', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [inputBinding('position', () => 'right')],
      });
      TestBed.tick();

      // Assert
      const aside = fixture.nativeElement.querySelector('aside');
      expect(aside?.className).toContain('border-l');
    });
  });

  describe('header and footer', () => {
    it('renders header when provided', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [inputBinding('header', () => 'Navigation Menu')],
      });
      TestBed.tick();

      // Assert
      expect(fixture.nativeElement.textContent).toContain('Navigation Menu');
    });

    it('renders footer when provided and not collapsed', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [inputBinding('footer', () => 'Version 1.0')],
      });
      TestBed.tick();

      // Assert
      expect(fixture.nativeElement.textContent).toContain('Version 1.0');
    });

    it('hides footer when collapsed', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [
          inputBinding('footer', () => 'Version 1.0'),
          inputBinding('collapsed', () => true),
        ],
      });
      TestBed.tick();

      // Assert
      const footer = fixture.nativeElement.querySelector('.border-t');
      expect(footer).toBeFalsy();
    });
  });

  describe('logo rendering', () => {
    it('renders logo when provided and not collapsed', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [inputBinding('logo', () => 'heroHome')],
      });
      TestBed.tick();

      // Assert
      const logo = fixture.nativeElement.querySelector('ng-icon');
      expect(logo).toBeTruthy();
    });

    it('renders collapsed logo when provided and collapsed', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [
          inputBinding('logo', () => 'heroHome'),
          inputBinding('logoCollapsed', () => 'heroMenu'),
          inputBinding('collapsed', () => true),
        ],
      });
      TestBed.tick();

      // Assert
      const logo = fixture.nativeElement.querySelector('ng-icon');
      expect(logo).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    it('sets correct ARIA attributes on aside', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent);
      TestBed.tick();

      // Assert
      const aside = fixture.nativeElement.querySelector('aside');
      expect(aside?.getAttribute('role')).toBe('navigation');
      expect(aside?.getAttribute('aria-label')).toBe('Sidebar navigation');
    });

    it('sets aria-expanded on collapsible toggle', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [inputBinding('collapsible', () => true), inputBinding('showToggle', () => true)],
      });
      TestBed.tick();

      // Assert
      const toggleButton = fixture.nativeElement.querySelector(
        'button[aria-label="Toggle sidebar"]',
      );
      expect(toggleButton?.getAttribute('aria-expanded')).toBe('true');
    });

    it('sets aria-disabled on disabled items', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [inputBinding('items', () => mockItems)],
      });
      TestBed.tick();

      // Assert
      const disabledItem = Array.from(fixture.nativeElement.querySelectorAll('a')).find(
        (link: any) => link.textContent?.includes('Settings'),
      ) as HTMLElement | undefined;
      expect(disabledItem?.getAttribute('aria-disabled')).toBe('true');
    });

    it('sets tabindex -1 on disabled items', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [inputBinding('items', () => mockItems)],
      });
      TestBed.tick();

      // Assert
      const disabledItem = Array.from(fixture.nativeElement.querySelectorAll('a')).find(
        (link: any) => link.textContent?.includes('Settings'),
      ) as HTMLElement | undefined;
      expect(disabledItem?.getAttribute('tabindex')).toBe('-1');
    });

    it('sets aria-current on selected item', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [
          inputBinding('items', () => mockItems),
          inputBinding('selectedValue', () => 'dashboard'),
        ],
      });
      TestBed.tick();

      // Assert
      const selectedItem = Array.from(fixture.nativeElement.querySelectorAll('a')).find(
        (link: any) => link.textContent?.includes('Dashboard'),
      ) as HTMLElement | undefined;
      expect(selectedItem?.getAttribute('aria-current')).toBe('page');
    });
  });

  describe('edge cases', () => {
    it('handles empty items array', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [inputBinding('items', () => [])],
      });
      TestBed.tick();

      // Assert
      const menuItems = fixture.nativeElement.querySelectorAll('li[role="none"]');
      expect(menuItems.length).toBe(0);
    });

    it('handles item with empty children array', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent);
      TestBed.tick();

      const itemWithEmptyChildren = [{ ...mockItems[0], children: [] }];

      // Act & Assert
      expect(() =>
        fixture.componentInstance.onItemClick(itemWithEmptyChildren[0], new Event('click')),
      ).not.toThrow();
    });

    it('handles multiple rapid toggle calls', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [inputBinding('collapsible', () => true)],
      });
      TestBed.tick();

      // Act
      for (let i = 0; i < 10; i++) {
        fixture.componentInstance.toggleCollapse();
      }

      // Assert
      expect(fixture.componentInstance.isCollapsed()).toBe(false);
    });

    it('handles special characters in labels', () => {
      // Arrange
      const specialItem = [
        {
          label: 'Reports & <Analytics>',
          value: 'reports',
          routerLink: '/reports',
        },
      ];

      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(SidenavComponent, {
        bindings: [inputBinding('items', () => specialItem)],
      });
      TestBed.tick();

      // Assert
      expect(fixture.nativeElement.textContent).toContain('Reports & <Analytics>');
    });
  });
});
