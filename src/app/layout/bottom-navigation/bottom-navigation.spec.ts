import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
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
    provideRouter([]),
  ];

  describe('initialization', () => {
    it('creates the component', async () => {
      // Arrange & Act
      const { container } = await render(BottomNavigationComponent, {
        providers: defaultProviders,
      });

      // Assert
      expect(container).toBeTruthy();
    });

    it('renders the navigation element', async () => {
      // Arrange & Act
      const { fixture } = await render(BottomNavigationComponent, {
        providers: defaultProviders,
      });

      const nav = fixture.nativeElement.querySelector('nav');

      // Assert
      expect(nav).toBeTruthy();
      expect(nav?.getAttribute('role')).toBe('navigation');
      expect(nav?.getAttribute('aria-label')).toBe('Bottom navigation');
    });

    it('has empty items array by default', async () => {
      // Arrange & Act
      const { fixture } = await render(BottomNavigationComponent, {
        providers: defaultProviders,
      });

      // Assert
      expect(fixture.componentInstance.items()).toEqual([]);
    });

    it('displays empty state when no items provided', async () => {
      // Arrange & Act
      const { fixture } = await render(BottomNavigationComponent, {
        providers: defaultProviders,
      });

      const emptyMessage = fixture.nativeElement.querySelector('.col-span-4');

      // Assert
      expect(emptyMessage?.textContent?.trim()).toBe('No navigation items');
    });
  });

  describe('items input', () => {
    it('renders all navigation items', async () => {
      // Arrange & Act
      const { fixture } = await render(BottomNavigationComponent, {
        componentProperties: { items: mockItems },
        providers: defaultProviders,
      });

      const links = fixture.nativeElement.querySelectorAll('a');

      // Assert
      expect(links.length).toBe(mockItems.length);
    });

    it('displays correct labels for each item', async () => {
      // Arrange & Act
      const { fixture } = await render(BottomNavigationComponent, {
        componentProperties: { items: mockItems },
        providers: defaultProviders,
      });

      const links = fixture.nativeElement.querySelectorAll('a');

      links.forEach((link: HTMLElement, index: number) => {
        // Assert
        expect(link.textContent).toContain(mockItems[index].label);
      });
    });

    it('sets correct router links', async () => {
      // Arrange & Act
      const { fixture } = await render(BottomNavigationComponent, {
        componentProperties: { items: mockItems },
        providers: defaultProviders,
      });

      const links = fixture.nativeElement.querySelectorAll('a');

      links.forEach((link: HTMLElement, index: number) => {
        // Assert
        expect(link.getAttribute('href')).toContain(mockItems[index].routerLink);
      });
    });

    it('renders icons using innerHTML', async () => {
      // Arrange & Act
      const { fixture } = await render(BottomNavigationComponent, {
        componentProperties: { items: mockItems },
        providers: defaultProviders,
      });

      const icons = fixture.nativeElement.querySelectorAll('span[class*="w-5 h-5"]');

      // Assert
      expect(icons.length).toBe(mockItems.length);
      expect(icons[0].innerHTML).toContain('dashboard');
    });

    it('sets aria-label for each link', async () => {
      // Arrange & Act
      const { fixture } = await render(BottomNavigationComponent, {
        componentProperties: { items: mockItems },
        providers: defaultProviders,
      });

      const links = fixture.nativeElement.querySelectorAll('a');

      links.forEach((link: HTMLElement, index: number) => {
        // Assert
        expect(link.getAttribute('aria-label')).toBe(mockItems[index].label);
      });
    });

    it('applies 4-column grid layout', async () => {
      // Arrange & Act
      const { fixture } = await render(BottomNavigationComponent, {
        componentProperties: { items: mockItems },
        providers: defaultProviders,
      });

      const grid = fixture.nativeElement.querySelector('.grid-cols-4');

      // Assert
      expect(grid).toBeTruthy();
    });

    it('updates when items change', async () => {
      // Arrange & Act
      const { fixture } = await render(BottomNavigationComponent, {
        componentProperties: { items: mockItems },
        providers: defaultProviders,
      });

      expect(fixture.nativeElement.querySelectorAll('a').length).toBe(4);

      const newItems = mockItems.slice(0, 2);
      fixture.componentInstance.items.set(newItems);
      fixture.detectChanges();

      // Assert
      expect(fixture.nativeElement.querySelectorAll('a').length).toBe(2);
    });
  });

  describe('itemClick output', () => {
    it('emits itemClick when navigation item is clicked', async () => {
      // Arrange
      const { fixture } = await render(BottomNavigationComponent, {
        componentProperties: { items: mockItems },
        providers: defaultProviders,
      });

      const emitSpy = vi.spyOn(fixture.componentInstance.itemClick, 'emit');
      const firstLink = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;

      // Act
      firstLink.click();

      // Assert
      expect(emitSpy).toHaveBeenCalledOnce();
      expect(emitSpy).toHaveBeenCalledWith(mockItems[0]);
    });

    it('emits correct item data for each click', async () => {
      // Arrange
      const { fixture } = await render(BottomNavigationComponent, {
        componentProperties: { items: mockItems },
        providers: defaultProviders,
      });

      const emitSpy = vi.spyOn(fixture.componentInstance.itemClick, 'emit');
      const links = fixture.nativeElement.querySelectorAll('a');

      // Act
      links[2].dispatchEvent(new Event('click'));

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(mockItems[2]);
    });

    it('emits multiple times for multiple clicks', async () => {
      // Arrange
      const { fixture } = await render(BottomNavigationComponent, {
        componentProperties: { items: mockItems },
        providers: defaultProviders,
      });

      const emitSpy = vi.spyOn(fixture.componentInstance.itemClick, 'emit');
      const firstLink = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;

      // Act
      firstLink.click();
      firstLink.click();

      // Assert
      expect(emitSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('onItemClick method', () => {
    it('calls itemClick.emit with correct item', async () => {
      // Arrange
      const { fixture } = await render(BottomNavigationComponent, {
        providers: defaultProviders,
      });

      const emitSpy = vi.spyOn(fixture.componentInstance.itemClick, 'emit');
      const testItem = mockItems[0];

      // Act
      fixture.componentInstance.onItemClick(testItem);

      // Assert
      expect(emitSpy).toHaveBeenCalledWith(testItem);
    });
  });

  describe('styling and responsive behavior', () => {
    it('hides navigation on large screens (lg:hidden)', async () => {
      // Arrange & Act
      const { fixture } = await render(BottomNavigationComponent, {
        providers: defaultProviders,
      });

      const nav = fixture.nativeElement.querySelector('nav');

      // Assert
      expect(nav?.className).toContain('lg:hidden');
    });

    it('applies correct height (h-16)', async () => {
      // Arrange & Act
      const { fixture } = await render(BottomNavigationComponent, {
        providers: defaultProviders,
      });

      const nav = fixture.nativeElement.querySelector('nav');

      // Assert
      expect(nav?.className).toContain('h-16');
    });

    it('has border-top styling', async () => {
      // Arrange & Act
      const { fixture } = await render(BottomNavigationComponent, {
        providers: defaultProviders,
      });

      const nav = fixture.nativeElement.querySelector('nav');

      // Assert
      expect(nav?.className).toContain('border-t');
      expect(nav?.className).toContain('border-border');
    });

    it('applies hover styles to navigation items', async () => {
      // Arrange & Act
      const { fixture } = await render(BottomNavigationComponent, {
        componentProperties: { items: mockItems },
        providers: defaultProviders,
      });

      const links = fixture.nativeElement.querySelectorAll('a');

      links.forEach((link: HTMLElement) => {
        // Assert
        expect(link.className).toContain('hover:bg-bg-secondary');
        expect(link.className).toContain('transition-colors');
      });
    });

    it('applies group styles for icon and text hover', async () => {
      // Arrange & Act
      const { fixture } = await render(BottomNavigationComponent, {
        componentProperties: { items: mockItems },
        providers: defaultProviders,
      });

      const links = fixture.nativeElement.querySelectorAll('a');

      links.forEach((link: HTMLElement) => {
        // Assert
        expect(link.className).toContain('group');
      });
    });
  });

  describe('accessibility', () => {
    it('has proper ARIA role on navigation', async () => {
      // Arrange & Act
      const { fixture } = await render(BottomNavigationComponent, {
        providers: defaultProviders,
      });

      const nav = fixture.nativeElement.querySelector('nav');

      // Assert
      expect(nav?.getAttribute('role')).toBe('navigation');
    });

    it('has descriptive aria-label on navigation', async () => {
      // Arrange & Act
      const { fixture } = await render(BottomNavigationComponent, {
        providers: defaultProviders,
      });

      const nav = fixture.nativeElement.querySelector('nav');

      // Assert
      expect(nav?.getAttribute('aria-label')).toBe('Bottom navigation');
    });

    it('sets aria-label on each navigation link', async () => {
      // Arrange & Act
      const { fixture } = await render(BottomNavigationComponent, {
        componentProperties: { items: mockItems },
        providers: defaultProviders,
      });

      const links = fixture.nativeElement.querySelectorAll('a');

      links.forEach((link: HTMLElement, index: number) => {
        // Assert
        expect(link.getAttribute('aria-label')).toBe(mockItems[index].label);
      });
    });

    it('uses semantic nav element', async () => {
      // Arrange & Act
      const { fixture } = await render(BottomNavigationComponent, {
        providers: defaultProviders,
      });

      const nav = fixture.nativeElement.querySelector('nav');

      // Assert
      expect(nav).toBeTruthy();
    });
  });

  describe('edge cases', () => {
    it('handles empty items array', async () => {
      // Arrange & Act
      const { fixture } = await render(BottomNavigationComponent, {
        componentProperties: { items: [] },
        providers: defaultProviders,
      });

      const links = fixture.nativeElement.querySelectorAll('a');

      // Assert
      expect(links.length).toBe(0);
      expect(fixture.nativeElement.textContent).toContain('No navigation items');
    });

    it('handles single item', async () => {
      // Arrange & Act
      const { fixture } = await render(BottomNavigationComponent, {
        componentProperties: { items: [mockItems[0]] },
        providers: defaultProviders,
      });

      const links = fixture.nativeElement.querySelectorAll('a');

      // Assert
      expect(links.length).toBe(1);
    });

    it('handles item with missing icon gracefully', async () => {
      // Arrange & Act
      const itemWithoutIcon = [{ ...mockItems[0], icon: '' }];

      const { fixture } = await render(BottomNavigationComponent, {
        componentProperties: { items: itemWithoutIcon },
        providers: defaultProviders,
      });

      const link = fixture.nativeElement.querySelector('a');

      // Assert
      expect(link).toBeTruthy();
      expect(link?.textContent).toContain('Dashboard');
    });

    it('handles very long labels', async () => {
      // Arrange & Act
      const longLabelItem = [
        {
          ...mockItems[0],
          label: 'Very Long Navigation Label That Might Overflow',
        },
      ];

      const { fixture } = await render(BottomNavigationComponent, {
        componentProperties: { items: longLabelItem },
        providers: defaultProviders,
      });

      const link = fixture.nativeElement.querySelector('a');

      // Assert
      expect(link?.textContent).toContain('Very Long Navigation Label');
    });

    it('handles special characters in labels', async () => {
      // Arrange & Act
      const specialCharItem = [
        {
          ...mockItems[0],
          label: 'Reports & Analytics',
        },
      ];

      const { fixture } = await render(BottomNavigationComponent, {
        componentProperties: { items: specialCharItem },
        providers: defaultProviders,
      });

      const link = fixture.nativeElement.querySelector('a');

      // Assert
      expect(link?.textContent).toContain('Reports & Analytics');
    });

    it('maintains item order from input', async () => {
      // Arrange & Act
      const { fixture } = await render(BottomNavigationComponent, {
        componentProperties: { items: mockItems },
        providers: defaultProviders,
      });

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
    it('applies routerLinkActive directive', async () => {
      // Arrange & Act
      const { fixture } = await render(BottomNavigationComponent, {
        componentProperties: { items: mockItems },
        providers: defaultProviders,
      });

      const links = fixture.nativeElement.querySelectorAll('a[routerLinkActive]');

      // Assert
      expect(links.length).toBe(mockItems.length);
    });

    it('adds router-link-active class name', async () => {
      // Arrange & Act
      const { fixture } = await render(BottomNavigationComponent, {
        componentProperties: { items: mockItems },
        providers: defaultProviders,
      });

      const links = fixture.nativeElement.querySelectorAll('a');

      links.forEach((link: HTMLElement) => {
        const activeProp = link.getAttribute('routerLinkActive');
        // Assert
        expect(activeProp).toBe('router-link-active');
      });
    });
  });
});
