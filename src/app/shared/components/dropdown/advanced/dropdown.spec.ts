import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, inputBinding, outputBinding, signal } from '@angular/core';
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

  it('should create', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Dropdown, {
      bindings: [inputBinding('sections', () => baseSections)],
    });
    TestBed.tick();

    overlayContainer = fixture.debugElement.injector.get(OverlayContainer);

    // Assert
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should toggle panel on trigger click', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Dropdown, {
      bindings: [inputBinding('sections', () => baseSections)],
    });
    TestBed.tick();

    overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
    const overlayElement = overlayContainer.getContainerElement();

    const trigger = fixture.nativeElement.querySelector('button');
    expect(trigger).toBeTruthy();

    // Act - Open panel
    trigger?.dispatchEvent(new MouseEvent('click'));

    // Assert - Panel is open
    const panel = overlayElement.querySelector('.shadow-lg');
    expect(panel).toBeTruthy();

    // Act - Close panel
    trigger?.dispatchEvent(new MouseEvent('click'));

    // Assert - Panel is closed
    const closedPanel = overlayElement.querySelector('.shadow-lg');
    expect(closedPanel).toBeFalsy();
  });

  it('should emit select event when action item clicked', () => {
    // Arrange
    const selectedItemSignal = signal<{ id: string; label: string } | null>(null);
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Dropdown, {
      bindings: [
        inputBinding('sections', () => baseSections),
        outputBinding('selectChange', (event: any) => selectedItemSignal.set(event.item)),
      ],
    });
    TestBed.tick();

    overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
    const overlayElement = overlayContainer.getContainerElement();

    const trigger = fixture.nativeElement.querySelector('button');

    // Act
    trigger?.dispatchEvent(new MouseEvent('click'));

    const itemButton = overlayElement.querySelector('ul li button') as HTMLButtonElement;
    itemButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    // Assert
    expect(selectedItemSignal()?.label).toBe('Dashboard');
  });

  it('should filter items when search term provided', async () => {
    // Arrange
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

    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Dropdown, {
      bindings: [
        inputBinding('sections', () => sections),
        inputBinding('search', () => ({ placeholder: 'Buscar' })),
        inputBinding('searchDebounceDelay', () => 0), // Disable debounce for test
      ],
    });
    TestBed.tick();

    overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
    const overlayElement = overlayContainer.getContainerElement();

    const trigger = fixture.nativeElement.querySelector('button');

    // Act
    trigger?.dispatchEvent(new MouseEvent('click'));

    const searchInput = overlayElement.querySelector('input') as HTMLInputElement;
    searchInput.value = 'ear';
    searchInput.dispatchEvent(new Event('input'));

    // Wait for debounce (even with 0ms, need to wait for next tick)
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Assert
    const items = overlayElement.querySelectorAll('ul li button');
    expect(items.length).toBe(1);
    expect(items[0]?.textContent?.trim()).toBe('Earnings');
  });
});
