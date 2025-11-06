import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Dropdown } from './dropdown';
import { DropdownSection } from './dropdown.types';

describe('Dropdown', () => {
  let fixture: ComponentFixture<Dropdown>;
  let component: Dropdown;

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

    const panel = compiled.querySelector('.shadow-lg');
    expect(panel).toBeTruthy();

    trigger?.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();

    const closedPanel = compiled.querySelector('.shadow-lg');
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

    const itemButton = compiled.querySelector(
      'ul li button'
    ) as HTMLButtonElement;
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
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector('button')?.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();

    const searchInput = compiled.querySelector('input') as HTMLInputElement;
    searchInput.value = 'ear';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const items = compiled.querySelectorAll('ul li button');
    expect(items.length).toBe(1);
    expect(items[0]?.textContent?.trim()).toBe('Earnings');
  });
});
