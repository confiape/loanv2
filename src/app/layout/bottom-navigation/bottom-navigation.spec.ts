// Angular testing
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, inputBinding, outputBinding, signal } from '@angular/core';
import { provideRouter } from '@angular/router';

// Testing library
import { within } from '@testing-library/dom';

// Vitest
import { describe, it, expect, vi } from 'vitest';

// Component and dependencies
import {
  BottomNavigationComponent,
  BottomNavItem,
} from '@loan/app/layout/bottom-navigation/bottom-navigation';

describe('BottomNavigationComponent', () => {
  const mockItems: BottomNavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '<svg>dashboard</svg>',
      routerLink: '/dashboard',
    },
    {
      id: 'loans',
      label: 'Loans',
      icon: '<svg>loans</svg>',
      routerLink: '/loans',
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: '<svg>customers</svg>',
      routerLink: '/customers',
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: '<svg>reports</svg>',
      routerLink: '/reports',
    },
  ];

  const defaultProviders = [
    provideZonelessChangeDetection(),
    provideRouter([
      { path: 'dashboard', component: class {} },
      { path: 'loans', component: class {} },
      { path: 'customers', component: class {} },
      { path: 'reports', component: class {} },
    ]),
  ];

  describe('initialization', () => {
    it('creates the component', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(BottomNavigationComponent);
      TestBed.tick();

      // Assert
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('renders the navigation element', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(BottomNavigationComponent);
      TestBed.tick();

      const nav = fixture.nativeElement.querySelector('nav');

      // Assert
      expect(nav).toBeTruthy();
      expect(nav?.getAttribute('role')).toBe('navigation');
      expect(nav?.getAttribute('aria-label')).toBe('Bottom navigation');
    });

    it('has empty items array by default', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(BottomNavigationComponent);
      TestBed.tick();

      // Assert
      expect(fixture.componentInstance.items()).toEqual([]);
    });

    it('displays empty state when no items provided', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(BottomNavigationComponent);
      TestBed.tick();

      const emptyMessage = fixture.nativeElement.querySelector('.col-span-4');

      // Assert
      expect(emptyMessage?.textContent?.trim()).toBe('No navigation items');
    });
  });

  describe('items input', () => {
    it('renders all navigation items', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(BottomNavigationComponent, {
        bindings: [inputBinding('items', () => mockItems)],
      });
      TestBed.tick();

      const links = fixture.nativeElement.querySelectorAll('a');

      // Assert
      expect(links.length).toBe(mockItems.length);
    });

    it('displays correct labels for each item', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(BottomNavigationComponent, {
        bindings: [inputBinding('items', () => mockItems)],
      });
      TestBed.tick();

      const links = fixture.nativeElement.querySelectorAll('a');

      links.forEach((link: HTMLElement, index: number) => {
        // Assert
        expect(link.textContent).toContain(mockItems[index].label);
      });
    });

    it('sets correct router links', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(BottomNavigationComponent, {
        bindings: [inputBinding('items', () => mockItems)],
      });
      TestBed.tick();

      const links = fixture.nativeElement.querySelectorAll('a');

      links.forEach((link: HTMLElement, index: number) => {
        // Assert
        expect(link.getAttribute('href')).toContain(mockItems[index].routerLink);
      });
    });

    it('renders icons using innerHTML', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(BottomNavigationComponent, {
        bindings: [inputBinding('items', () => mockItems)],
      });
      TestBed.tick();

      const icons = fixture.nativeElement.querySelectorAll('span[class*="w-5 h-5"]');

      // Assert
      expect(icons.length).toBe(mockItems.length);
      expect(icons[0].innerHTML).toContain('dashboard');
    });

    it('sets aria-label for each link', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(BottomNavigationComponent, {
        bindings: [inputBinding('items', () => mockItems)],
      });
      TestBed.tick();

      const links = fixture.nativeElement.querySelectorAll('a');

      links.forEach((link: HTMLElement, index: number) => {
        // Assert
        expect(link.getAttribute('aria-label')).toBe(mockItems[index].label);
      });
    });

    it('applies 4-column grid layout', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(BottomNavigationComponent, {
        bindings: [inputBinding('items', () => mockItems)],
      });
      TestBed.tick();

      const grid = fixture.nativeElement.querySelector('.grid-cols-4');

      // Assert
      expect(grid).toBeTruthy();
    });
  });

  describe('itemClick output', () => {
    it('emits itemClick when navigation item is clicked', () => {
      // Arrange
      const itemClickSignal = signal<BottomNavItem | null>(null);
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(BottomNavigationComponent, {
        bindings: [
          inputBinding('items', () => mockItems),
          outputBinding('itemClick', (item: BottomNavItem) => itemClickSignal.set(item)),
        ],
      });
      TestBed.tick();

      const firstLink = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;

      // Act
      firstLink.click();
      TestBed.tick();

      // Assert
      expect(itemClickSignal()).toEqual(mockItems[0]);
    });

    it('emits correct item data for each click', () => {
      // Arrange
      const itemClickSignal = signal<BottomNavItem | null>(null);
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(BottomNavigationComponent, {
        bindings: [
          inputBinding('items', () => mockItems),
          outputBinding('itemClick', (item: BottomNavItem) => itemClickSignal.set(item)),
        ],
      });
      TestBed.tick();

      const links = fixture.nativeElement.querySelectorAll('a');

      // Act
      links[2].dispatchEvent(new Event('click'));
      TestBed.tick();

      // Assert
      expect(itemClickSignal()).toEqual(mockItems[2]);
    });

    it('emits multiple times for multiple clicks', () => {
      // Arrange
      let clickCount = 0;
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(BottomNavigationComponent, {
        bindings: [
          inputBinding('items', () => mockItems),
          outputBinding('itemClick', () => clickCount++),
        ],
      });
      TestBed.tick();

      const firstLink = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;

      // Act
      firstLink.click();
      firstLink.click();
      TestBed.tick();

      // Assert
      expect(clickCount).toBe(2);
    });
  });

  describe('onItemClick method', () => {
    it('calls itemClick.emit with correct item', () => {
      // Arrange
      const itemClickSignal = signal<BottomNavItem | null>(null);
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(BottomNavigationComponent, {
        bindings: [outputBinding('itemClick', (item: BottomNavItem) => itemClickSignal.set(item))],
      });
      TestBed.tick();

      const testItem = mockItems[0];

      // Act
      fixture.componentInstance.onItemClick(testItem);
      TestBed.tick();

      // Assert
      expect(itemClickSignal()).toEqual(testItem);
    });
  });

  describe('styling and responsive behavior', () => {
    it('hides navigation on large screens (lg:hidden)', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(BottomNavigationComponent);
      TestBed.tick();

      const nav = fixture.nativeElement.querySelector('nav');

      // Assert
      expect(nav?.className).toContain('lg:hidden');
    });

    it('applies correct height (h-16)', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(BottomNavigationComponent);
      TestBed.tick();

      const nav = fixture.nativeElement.querySelector('nav');

      // Assert
      expect(nav?.className).toContain('h-16');
    });

    it('has border-top styling', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(BottomNavigationComponent);
      TestBed.tick();

      const nav = fixture.nativeElement.querySelector('nav');

      // Assert
      expect(nav?.className).toContain('border-t');
      expect(nav?.className).toContain('border-border');
    });

    it('applies hover styles to navigation items', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(BottomNavigationComponent, {
        bindings: [inputBinding('items', () => mockItems)],
      });
      TestBed.tick();

      const links = fixture.nativeElement.querySelectorAll('a');

      links.forEach((link: HTMLElement) => {
        // Assert
        expect(link.className).toContain('hover:bg-bg-secondary');
        expect(link.className).toContain('transition-colors');
      });
    });

    it('applies group styles for icon and text hover', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(BottomNavigationComponent, {
        bindings: [inputBinding('items', () => mockItems)],
      });
      TestBed.tick();

      const links = fixture.nativeElement.querySelectorAll('a');

      links.forEach((link: HTMLElement) => {
        // Assert
        expect(link.className).toContain('group');
      });
    });
  });

  describe('accessibility', () => {
    it('has proper ARIA role on navigation', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(BottomNavigationComponent);
      TestBed.tick();

      const nav = fixture.nativeElement.querySelector('nav');

      // Assert
      expect(nav?.getAttribute('role')).toBe('navigation');
    });

    it('has descriptive aria-label on navigation', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(BottomNavigationComponent);
      TestBed.tick();

      const nav = fixture.nativeElement.querySelector('nav');

      // Assert
      expect(nav?.getAttribute('aria-label')).toBe('Bottom navigation');
    });

    it('sets aria-label on each navigation link', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(BottomNavigationComponent, {
        bindings: [inputBinding('items', () => mockItems)],
      });
      TestBed.tick();

      const links = fixture.nativeElement.querySelectorAll('a');

      links.forEach((link: HTMLElement, index: number) => {
        // Assert
        expect(link.getAttribute('aria-label')).toBe(mockItems[index].label);
      });
    });

    it('uses semantic nav element', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(BottomNavigationComponent);
      TestBed.tick();

      const nav = fixture.nativeElement.querySelector('nav');

      // Assert
      expect(nav).toBeTruthy();
    });
  });

  describe('edge cases', () => {
    it('handles empty items array', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(BottomNavigationComponent, {
        bindings: [inputBinding('items', () => [])],
      });
      TestBed.tick();

      const links = fixture.nativeElement.querySelectorAll('a');

      // Assert
      expect(links.length).toBe(0);
      expect(fixture.nativeElement.textContent).toContain('No navigation items');
    });

    it('handles single item', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(BottomNavigationComponent, {
        bindings: [inputBinding('items', () => [mockItems[0]])],
      });
      TestBed.tick();

      const links = fixture.nativeElement.querySelectorAll('a');

      // Assert
      expect(links.length).toBe(1);
    });

    it('handles item with missing icon gracefully', () => {
      // Arrange
      const itemWithoutIcon = [{ ...mockItems[0], icon: '' }];

      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(BottomNavigationComponent, {
        bindings: [inputBinding('items', () => itemWithoutIcon)],
      });
      TestBed.tick();

      const link = fixture.nativeElement.querySelector('a');

      // Assert
      expect(link).toBeTruthy();
      expect(link?.textContent).toContain('Dashboard');
    });

    it('handles very long labels', () => {
      // Arrange
      const longLabelItem = [
        {
          ...mockItems[0],
          label: 'Very Long Navigation Label That Might Overflow',
        },
      ];

      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(BottomNavigationComponent, {
        bindings: [inputBinding('items', () => longLabelItem)],
      });
      TestBed.tick();

      const link = fixture.nativeElement.querySelector('a');

      // Assert
      expect(link?.textContent).toContain('Very Long Navigation Label');
    });

    it('handles special characters in labels', () => {
      // Arrange
      const specialCharItem = [
        {
          ...mockItems[0],
          label: 'Reports & Analytics',
        },
      ];

      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(BottomNavigationComponent, {
        bindings: [inputBinding('items', () => specialCharItem)],
      });
      TestBed.tick();

      const link = fixture.nativeElement.querySelector('a');

      // Assert
      expect(link?.textContent).toContain('Reports & Analytics');
    });

    it('maintains item order from input', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(BottomNavigationComponent, {
        bindings: [inputBinding('items', () => mockItems)],
      });
      TestBed.tick();

      const labels = Array.from(fixture.nativeElement.querySelectorAll('a')).map(
        (link: any) => link.textContent?.trim() || '',
      );

      mockItems.forEach((item, index) => {
        // Assert
        expect(labels[index]).toContain(item.label);
      });
    });
  });

  describe('router integration', () => {
    it('applies routerLinkActive directive', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(BottomNavigationComponent, {
        bindings: [inputBinding('items', () => mockItems)],
      });
      TestBed.tick();

      const links = fixture.nativeElement.querySelectorAll('a[routerLinkActive]');

      // Assert
      expect(links.length).toBe(mockItems.length);
    });

    it('adds router-link-active class name', () => {
      // Arrange
      const fixture = TestBed.configureTestingModule({
        providers: defaultProviders,
      }).createComponent(BottomNavigationComponent, {
        bindings: [inputBinding('items', () => mockItems)],
      });
      TestBed.tick();

      const links = fixture.nativeElement.querySelectorAll('a');

      links.forEach((link: HTMLElement) => {
        const activeProp = link.getAttribute('routerLinkActive');
        // Assert
        expect(activeProp).toBe('router-link-active');
      });
    });
  });
});
