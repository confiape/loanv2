import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Dropdown } from './dropdown';
import { DropdownSection } from './dropdown.types';

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
});
