import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  BottomNavigationComponent,
  BottomNavItem,
} from '@loan/app/layout/bottom-navigation/bottom-navigation';

describe('BottomNavigationComponent', () => {
  let fixture: ComponentFixture<BottomNavigationComponent>;
  let component: BottomNavigationComponent;
  let host: HTMLElement;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomNavigationComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BottomNavigationComponent);
    component = fixture.componentInstance;
    host = fixture.nativeElement as HTMLElement;
  });

  describe('initialization', () => {
    it('creates the component', () => {
      expect(component).toBeDefined();
    });

    it('renders the navigation element', () => {
      fixture.detectChanges();
      const nav = host.querySelector('nav');
      expect(nav).toBeTruthy();
      expect(nav?.getAttribute('role')).toBe('navigation');
      expect(nav?.getAttribute('aria-label')).toBe('Bottom navigation');
    });

    it('has empty items array by default', () => {
      expect(component.items()).toEqual([]);
    });

    it('displays empty state when no items provided', () => {
      fixture.detectChanges();
      const emptyMessage = host.querySelector('.col-span-4');
      expect(emptyMessage?.textContent?.trim()).toBe('No navigation items');
    });
  });

  describe('items input', () => {
    it('renders all navigation items', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const links = host.querySelectorAll('a');
      expect(links.length).toBe(mockItems.length);
    });

    it('displays correct labels for each item', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const links = host.querySelectorAll('a');
      links.forEach((link, index) => {
        expect(link.textContent).toContain(mockItems[index].label);
      });
    });

    it('sets correct router links', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const links = host.querySelectorAll('a');
      links.forEach((link, index) => {
        expect(link.getAttribute('href')).toContain(mockItems[index].routerLink);
      });
    });

    it('renders icons using innerHTML', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const icons = host.querySelectorAll('span[class*="w-5 h-5"]');
      expect(icons.length).toBe(mockItems.length);
      expect(icons[0].innerHTML).toContain('dashboard');
    });

    it('sets aria-label for each link', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const links = host.querySelectorAll('a');
      links.forEach((link, index) => {
        expect(link.getAttribute('aria-label')).toBe(mockItems[index].label);
      });
    });

    it('applies 4-column grid layout', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const grid = host.querySelector('.grid-cols-4');
      expect(grid).toBeTruthy();
    });

    it('updates when items change', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();
      expect(host.querySelectorAll('a').length).toBe(4);

      const newItems = mockItems.slice(0, 2);
      fixture.componentRef.setInput('items', newItems);
      fixture.detectChanges();
      expect(host.querySelectorAll('a').length).toBe(2);
    });
  });

  describe('itemClick output', () => {
    it('emits itemClick when navigation item is clicked', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const emitSpy = vi.spyOn(component.itemClick, 'emit');
      const firstLink = host.querySelector('a') as HTMLAnchorElement;

      firstLink.click();

      expect(emitSpy).toHaveBeenCalledOnce();
      expect(emitSpy).toHaveBeenCalledWith(mockItems[0]);
    });

    it('emits correct item data for each click', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const emitSpy = vi.spyOn(component.itemClick, 'emit');
      const links = host.querySelectorAll('a');

      links[2].dispatchEvent(new Event('click'));

      expect(emitSpy).toHaveBeenCalledWith(mockItems[2]);
    });

    it('emits multiple times for multiple clicks', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const emitSpy = vi.spyOn(component.itemClick, 'emit');
      const firstLink = host.querySelector('a') as HTMLAnchorElement;

      firstLink.click();
      firstLink.click();

      expect(emitSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('onItemClick method', () => {
    it('calls itemClick.emit with correct item', () => {
      const emitSpy = vi.spyOn(component.itemClick, 'emit');
      const testItem = mockItems[0];

      component.onItemClick(testItem);

      expect(emitSpy).toHaveBeenCalledWith(testItem);
    });
  });

  describe('styling and responsive behavior', () => {
    it('hides navigation on large screens (lg:hidden)', () => {
      fixture.detectChanges();
      const nav = host.querySelector('nav');
      expect(nav?.className).toContain('lg:hidden');
    });

    it('applies correct height (h-16)', () => {
      fixture.detectChanges();
      const nav = host.querySelector('nav');
      expect(nav?.className).toContain('h-16');
    });

    it('has border-top styling', () => {
      fixture.detectChanges();
      const nav = host.querySelector('nav');
      expect(nav?.className).toContain('border-t');
      expect(nav?.className).toContain('border-border');
    });

    it('applies hover styles to navigation items', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const links = host.querySelectorAll('a');
      links.forEach((link) => {
        expect(link.className).toContain('hover:bg-bg-secondary');
        expect(link.className).toContain('transition-colors');
      });
    });

    it('applies group styles for icon and text hover', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const links = host.querySelectorAll('a');
      links.forEach((link) => {
        expect(link.className).toContain('group');
      });
    });
  });

  describe('accessibility', () => {
    it('has proper ARIA role on navigation', () => {
      fixture.detectChanges();
      const nav = host.querySelector('nav');
      expect(nav?.getAttribute('role')).toBe('navigation');
    });

    it('has descriptive aria-label on navigation', () => {
      fixture.detectChanges();
      const nav = host.querySelector('nav');
      expect(nav?.getAttribute('aria-label')).toBe('Bottom navigation');
    });

    it('sets aria-label on each navigation link', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const links = host.querySelectorAll('a');
      links.forEach((link, index) => {
        expect(link.getAttribute('aria-label')).toBe(mockItems[index].label);
      });
    });

    it('uses semantic nav element', () => {
      fixture.detectChanges();
      const nav = host.querySelector('nav');
      expect(nav).toBeTruthy();
    });
  });

  describe('edge cases', () => {
    it('handles empty items array', () => {
      fixture.componentRef.setInput('items', []);
      fixture.detectChanges();

      const links = host.querySelectorAll('a');
      expect(links.length).toBe(0);
      expect(host.textContent).toContain('No navigation items');
    });

    it('handles single item', () => {
      fixture.componentRef.setInput('items', [mockItems[0]]);
      fixture.detectChanges();

      const links = host.querySelectorAll('a');
      expect(links.length).toBe(1);
    });

    it('handles item with missing icon gracefully', () => {
      const itemWithoutIcon = [{ ...mockItems[0], icon: '' }];
      fixture.componentRef.setInput('items', itemWithoutIcon);
      fixture.detectChanges();

      const link = host.querySelector('a');
      expect(link).toBeTruthy();
      expect(link?.textContent).toContain('Dashboard');
    });

    it('handles very long labels', () => {
      const longLabelItem = [
        {
          ...mockItems[0],
          label: 'Very Long Navigation Label That Might Overflow',
        },
      ];
      fixture.componentRef.setInput('items', longLabelItem);
      fixture.detectChanges();

      const link = host.querySelector('a');
      expect(link?.textContent).toContain('Very Long Navigation Label');
    });

    it('handles special characters in labels', () => {
      const specialCharItem = [
        {
          ...mockItems[0],
          label: 'Reports & Analytics',
        },
      ];
      fixture.componentRef.setInput('items', specialCharItem);
      fixture.detectChanges();

      const link = host.querySelector('a');
      expect(link?.textContent).toContain('Reports & Analytics');
    });

    it('maintains item order from input', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const labels = Array.from(host.querySelectorAll('a')).map(
        (link) => link.textContent?.trim() || '',
      );

      mockItems.forEach((item, index) => {
        expect(labels[index]).toContain(item.label);
      });
    });
  });

  describe('router integration', () => {
    it('applies routerLinkActive directive', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const links = host.querySelectorAll('a[routerLinkActive]');
      expect(links.length).toBe(mockItems.length);
    });

    it('adds router-link-active class name', () => {
      fixture.componentRef.setInput('items', mockItems);
      fixture.detectChanges();

      const links = host.querySelectorAll('a');
      links.forEach((link) => {
        const activeProp = link.getAttribute('routerLinkActive');
        expect(activeProp).toBe('router-link-active');
      });
    });
  });
});
