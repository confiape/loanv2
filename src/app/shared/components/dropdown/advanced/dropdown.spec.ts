import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Dropdown } from './dropdown';
import { DropdownSection } from './dropdown.types';

// Wrapper component for testing data-testid attribute
@Component({
  template: `<app-dropdown data-testid="test-dropdown" [sections]="sections" [search]="{ placeholder: 'Search' }"></app-dropdown>`,
  standalone: true,
  imports: [Dropdown],
})
class TestWrapperComponent {
  sections: DropdownSection[] = [
    {
      id: 'actions',
      items: [
        {
          type: 'action',
          id: 'dashboard',
          label: 'Dashboard',
        },
      ],
    },
  ];
}

describe('Dropdown', () => {
  let fixture: ComponentFixture<Dropdown>;
  let component: Dropdown;
  let overlayContainer: OverlayContainer;
  let overlayElement: HTMLElement;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dropdown],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Dropdown);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('sections', baseSections);
    fixture.detectChanges();

    overlayContainer = TestBed.inject(OverlayContainer);
    overlayElement = overlayContainer.getContainerElement();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle panel on trigger click', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const trigger = compiled.querySelector('button');
    expect(trigger).toBeTruthy();

    trigger?.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();

    const panel = overlayElement.querySelector('.shadow-lg');
    expect(panel).toBeTruthy();

    trigger?.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();

    const closedPanel = overlayElement.querySelector('.shadow-lg');
    expect(closedPanel).toBeFalsy();
  });

  it('should emit select event when action item clicked', () => {
    let emittedLabel = '';
    component.selectChange.subscribe((event) => {
      emittedLabel = event.item.label;
    });

    const compiled = fixture.nativeElement as HTMLElement;
    const trigger = compiled.querySelector('button');
    trigger?.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();

    const itemButton = overlayElement.querySelector('ul li button') as HTMLButtonElement;
    itemButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

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

    fixture.componentRef.setInput('sections', sections);
    fixture.componentRef.setInput('search', {
      placeholder: 'Buscar',
    });
    fixture.componentRef.setInput('searchDebounceDelay', 0); // Disable debounce for test
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector('button')?.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();

    const searchInput = overlayElement.querySelector('input') as HTMLInputElement;
    searchInput.value = 'ear';
    searchInput.dispatchEvent(new Event('input'));

    // Wait for debounce (even with 0ms, need to wait for next tick)
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();

    const items = overlayElement.querySelectorAll('ul li button');
    expect(items.length).toBe(1);
    expect(items[0]?.textContent?.trim()).toBe('Earnings');
  });

  describe('data-testid support', () => {
    it('should render test IDs when data-testid attribute is provided', async () => {
      TestBed.resetTestingModule();

      await TestBed.configureTestingModule({
        imports: [TestWrapperComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const wrapperFixture = TestBed.createComponent(TestWrapperComponent);
      wrapperFixture.detectChanges();
      await wrapperFixture.whenStable();

      const wrapperOverlayContainer = TestBed.inject(OverlayContainer);
      const wrapperOverlayElement = wrapperOverlayContainer.getContainerElement();

      const dropdown = wrapperFixture.nativeElement.querySelector('app-dropdown');
      const trigger = dropdown?.querySelector('button');

      // Verify trigger has test ID (same as host)
      expect(trigger?.getAttribute('data-testid')).toBe('test-dropdown');

      // Open dropdown to verify panel and search test IDs
      trigger?.dispatchEvent(new MouseEvent('click'));
      wrapperFixture.detectChanges();
      await wrapperFixture.whenStable();

      // Verify panel test ID on correct element type (div container)
      const panelDivs = wrapperOverlayElement.querySelectorAll('div');
      const panel = Array.from(panelDivs).find(d =>
        d.getAttribute('data-testid') === 'test-dropdown-panel'
      );
      expect(panel).toBeTruthy();

      // Verify search input test ID on correct element type
      const searchInput = wrapperOverlayElement.querySelector('input[type="text"]');
      expect(searchInput?.getAttribute('data-testid')).toBe('test-dropdown-search');

      wrapperOverlayContainer.ngOnDestroy();
    });

    it('should not render test IDs when data-testid attribute is not provided', async () => {
      fixture.componentRef.setInput('sections', baseSections);
      fixture.componentRef.setInput('search', {
        placeholder: 'Search',
      });
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const trigger = compiled.querySelector('button');

      // Verify trigger has NO test ID
      expect(trigger?.hasAttribute('data-testid')).toBe(false);

      // Open dropdown to verify no panel and search test IDs
      trigger?.dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();

      // Verify NO test IDs in overlay
      const elementsWithTestId = overlayElement.querySelectorAll('[data-testid]');
      expect(elementsWithTestId.length).toBe(0);
    });
  });
});
