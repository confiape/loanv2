import { render } from '@testing-library/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Dropdown } from './dropdown';
import { DropdownSection } from './dropdown.types';
import { describe, expect, it, afterEach } from 'vitest';

describe('Dropdown', () => {
  let overlayContainer: OverlayContainer | null = null;

  afterEach(() => {
    overlayContainer?.ngOnDestroy();
    overlayContainer = null;
  });

  const baseSections: DropdownSection[] = [
    {
      id: 'actions',
      items: [
        {
          type: 'action',
          id: 'dashboard',
          label: 'Dashboard',
        },
        {
          type: 'action',
          id: 'settings',
          label: 'Settings',
        },
      ],
    },
  ];

  it('should create', async () => {
    const { fixture } = await render(Dropdown, {
      providers: [provideZonelessChangeDetection()],
      componentProperties: {
        sections: baseSections,
      },
    });
    overlayContainer = fixture.debugElement.injector.get(OverlayContainer);

    const component = fixture.componentInstance as Dropdown;
    expect(component).toBeTruthy();
  });

  it('should toggle panel on trigger click', async () => {
    const { fixture } = await render(Dropdown, {
      providers: [provideZonelessChangeDetection()],
      componentProperties: {
        sections: baseSections,
      },
    });
    overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
    const overlayElement = overlayContainer.getContainerElement();

    const trigger = fixture.nativeElement.querySelector('button');
    expect(trigger).toBeTruthy();

    trigger?.dispatchEvent(new MouseEvent('click'));

    const panel = overlayElement.querySelector('.shadow-lg');
    expect(panel).toBeTruthy();

    trigger?.dispatchEvent(new MouseEvent('click'));

    const closedPanel = overlayElement.querySelector('.shadow-lg');
    expect(closedPanel).toBeFalsy();
  });

  it('should emit select event when action item clicked', async () => {
    const { fixture } = await render(Dropdown, {
      providers: [provideZonelessChangeDetection()],
      componentProperties: {
        sections: baseSections,
      },
    });
    overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
    const overlayElement = overlayContainer.getContainerElement();

    const component = fixture.componentInstance as Dropdown;
    let emittedLabel = '';
    component.selectChange.subscribe((event) => {
      emittedLabel = event.item.label;
    });

    const trigger = fixture.nativeElement.querySelector('button');
    trigger?.dispatchEvent(new MouseEvent('click'));

    const itemButton = overlayElement.querySelector('ul li button') as HTMLButtonElement;
    itemButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(emittedLabel).toBe('Dashboard');
  });

  it('should filter items when search term provided', async () => {
    const sections: DropdownSection[] = [
      {
        id: 'searchable',
        items: [
          {
            type: 'action',
            id: 'earnings',
            label: 'Earnings',
          },
          {
            type: 'action',
            id: 'reports',
            label: 'Reports',
          },
        ],
      },
    ];

    const { fixture } = await render(Dropdown, {
      providers: [provideZonelessChangeDetection()],
      componentProperties: {
        sections: sections,
        search: {
          placeholder: 'Buscar',
        },
        searchDebounceDelay: 0, // Disable debounce for test
      },
    });
    overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
    const overlayElement = overlayContainer.getContainerElement();

    const trigger = fixture.nativeElement.querySelector('button');
    trigger?.dispatchEvent(new MouseEvent('click'));

    const searchInput = overlayElement.querySelector('input') as HTMLInputElement;
    searchInput.value = 'ear';
    searchInput.dispatchEvent(new Event('input'));

    // Wait for debounce (even with 0ms, need to wait for next tick)
    await new Promise((resolve) => setTimeout(resolve, 0));

    const items = overlayElement.querySelectorAll('ul li button');
    expect(items.length).toBe(1);
    expect(items[0]?.textContent?.trim()).toBe('Earnings');
  });
});
