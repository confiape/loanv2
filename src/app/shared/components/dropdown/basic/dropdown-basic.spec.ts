import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { describe, expect, it, afterEach, vi } from 'vitest';
import { DropdownBasic } from './dropdown-basic';
import { DropdownBasicItem } from './dropdown-basic-item';
import { DropdownBasicHeader } from './dropdown-basic-header';
import { DropdownBasicFooter } from './dropdown-basic-footer';

// Host component for testing content projection and testid
@Component({
  selector: 'app-test-host',
  standalone: true,
  imports: [DropdownBasic, DropdownBasicItem, DropdownBasicHeader, DropdownBasicFooter],
  template: `
    <app-dropdown-basic
      [attr.data-testid]="testId()"
      [triggerConfig]="triggerConfig()"
      [placement]="placement()"
      [openStrategy]="openStrategy()"
      [closeOnSelect]="closeOnSelect()"
      [minPanelWidth]="minPanelWidth()"
      (openChange)="onOpenChange($event)"
      (itemClick)="onItemClick($event)"
    >
      <span trigger>{{ triggerLabel() }}</span>
      @if (showHeader()) {
        <app-dropdown-basic-header>Header Content</app-dropdown-basic-header>
      }
      @for (item of items(); track item.id) {
        <app-dropdown-basic-item
          [disabled]="item.disabled"
          [value]="item.value"
          (itemClick)="onItemClickDirect($event)"
        >
          {{ item.label }}
        </app-dropdown-basic-item>
      }
      @if (showFooter()) {
        <app-dropdown-basic-footer>Footer Content</app-dropdown-basic-footer>
      }
    </app-dropdown-basic>
  `,
})
class TestHostComponent {
  testId = signal('dropdown');
  triggerLabel = signal('Menu');
  triggerConfig = signal<{ variant?: 'solid' | 'soft' | 'ghost'; size?: 'sm' | 'md' }>({
    variant: 'solid',
    size: 'md',
  });
  placement = signal<'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'>('bottom-end');
  openStrategy = signal<'click' | 'hover'>('click');
  closeOnSelect = signal(true);
  minPanelWidth = signal(176);
  showHeader = signal(false);
  showFooter = signal(false);
  items = signal([
    { id: '1', label: 'Item 1', value: 'value1', disabled: false },
    { id: '2', label: 'Item 2', value: 'value2', disabled: false },
    { id: '3', label: 'Item 3', value: 'value3', disabled: true },
  ]);

  openChangeEvents: boolean[] = [];
  itemClickEvents: unknown[] = [];
  itemClickDirectEvents: unknown[] = [];

  onOpenChange(isOpen: boolean) {
    this.openChangeEvents.push(isOpen);
  }

  onItemClick(value: unknown) {
    this.itemClickEvents.push(value);
  }

  onItemClickDirect(value: unknown) {
    this.itemClickDirectEvents.push(value);
  }
}

describe('DropdownBasic', () => {
  let overlayContainer: OverlayContainer | null = null;

  afterEach(() => {
    overlayContainer?.ngOnDestroy();
    overlayContainer = null;
  });

  describe('Component Creation & Initialization', () => {
    it('should create the component successfully', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);

      const dropdownEl = fixture.nativeElement.querySelector('app-dropdown-basic');
      expect(dropdownEl).toBeTruthy();
    });

    it('should render with default configuration', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);

      const trigger = fixture.nativeElement.querySelector('button');
      const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;

      expect(trigger).toBeTruthy();
      expect(trigger.textContent?.trim()).toBe('Menu');
      expect(dropdown.isOpen()).toBe(false);
    });

    it('should apply correct trigger classes for solid variant', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);

      const trigger = fixture.nativeElement.querySelector('button');
      expect(trigger.className).toContain('bg-accent');
      expect(trigger.className).toContain('text-white');
      expect(trigger.className).toContain('hover:bg-accent-hover');
    });

    it('should apply correct trigger classes for medium size', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);

      const trigger = fixture.nativeElement.querySelector('button');
      expect(trigger.className).toContain('px-4');
      expect(trigger.className).toContain('py-2');
    });

    it('should have inline-flex host class', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);

      const host = fixture.nativeElement.querySelector('app-dropdown-basic');
      expect(host?.classList.contains('inline-flex')).toBe(true);
    });

    it('should set aria-expanded to false when closed', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);

      const trigger = fixture.nativeElement.querySelector('button');
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('should set aria-haspopup to true', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);

      const trigger = fixture.nativeElement.querySelector('button');
      expect(trigger.getAttribute('aria-haspopup')).toBe('true');
    });
  });

  describe('Click Strategy Interaction', () => {
    it('should open panel when trigger clicked', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;
      const overlayElement = overlayContainer.getContainerElement();

      expect(dropdown.isOpen()).toBe(false);

      const trigger = fixture.nativeElement.querySelector('button');
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(dropdown.isOpen()).toBe(true);
      const panel = overlayElement.querySelector('.shadow-lg');
      expect(panel).toBeTruthy();
    });

    it('should close panel when trigger clicked again', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;

      const trigger = fixture.nativeElement.querySelector('button');

      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(dropdown.isOpen()).toBe(true);

      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(dropdown.isOpen()).toBe(false);
    });

    it('should emit openChange event when opening', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const hostComponent = fixture.componentInstance as TestHostComponent;

      const trigger = fixture.nativeElement.querySelector('button');
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(hostComponent.openChangeEvents).toContain(true);
    });

    it('should emit openChange event when closing', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const hostComponent = fixture.componentInstance as TestHostComponent;

      const trigger = fixture.nativeElement.querySelector('button');

      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      hostComponent.openChangeEvents = [];

      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(hostComponent.openChangeEvents).toContain(false);
    });

    it('should set aria-expanded to true when opened', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);

      const trigger = fixture.nativeElement.querySelector('button');
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(trigger.getAttribute('aria-expanded')).toBe('true');
    });

    it('should close panel when clicking backdrop', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;
      const overlayElement = overlayContainer.getContainerElement();

      const trigger = fixture.nativeElement.querySelector('button');
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(dropdown.isOpen()).toBe(true);

      const backdrop = overlayElement.querySelector('.cdk-overlay-backdrop') as HTMLElement;
      backdrop?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(dropdown.isOpen()).toBe(false);
    });

    it('should close panel on Escape key', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;

      const trigger = fixture.nativeElement.querySelector('button');
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(dropdown.isOpen()).toBe(true);

      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      document.dispatchEvent(event);

      expect(dropdown.isOpen()).toBe(false);
    });

    it('should not respond to mouse hover when using click strategy', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;

      const trigger = fixture.nativeElement.querySelector('button');
      const wrapper = trigger.parentElement!;

      wrapper.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

      expect(dropdown.isOpen()).toBe(false);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should open panel on Enter key press', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;

      expect(dropdown.isOpen()).toBe(false);

      const trigger = fixture.nativeElement.querySelector('button');
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      trigger.dispatchEvent(event);

      expect(dropdown.isOpen()).toBe(true);
    });

    it('should close panel on Enter key press when open', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;

      const trigger = fixture.nativeElement.querySelector('button');

      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(dropdown.isOpen()).toBe(true);

      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      trigger.dispatchEvent(event);

      expect(dropdown.isOpen()).toBe(false);
    });

    it('should toggle panel on Space key press', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;

      const trigger = fixture.nativeElement.querySelector('button');

      const event1 = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      trigger.dispatchEvent(event1);
      expect(dropdown.isOpen()).toBe(true);

      const event2 = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      trigger.dispatchEvent(event2);
      expect(dropdown.isOpen()).toBe(false);
    });

    it('should open panel on ArrowDown key press', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;

      expect(dropdown.isOpen()).toBe(false);

      const trigger = fixture.nativeElement.querySelector('button');
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      trigger.dispatchEvent(event);

      expect(dropdown.isOpen()).toBe(true);
    });

    it('should not close panel on ArrowDown when already open', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;

      const trigger = fixture.nativeElement.querySelector('button');

      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(dropdown.isOpen()).toBe(true);

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      trigger.dispatchEvent(event);

      expect(dropdown.isOpen()).toBe(true);
    });

    it('should close panel on ArrowUp key press when open', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;

      const trigger = fixture.nativeElement.querySelector('button');

      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(dropdown.isOpen()).toBe(true);

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
      trigger.dispatchEvent(event);

      expect(dropdown.isOpen()).toBe(false);
    });

    it('should not open panel on ArrowUp when closed', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;

      expect(dropdown.isOpen()).toBe(false);

      const trigger = fixture.nativeElement.querySelector('button');
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
      trigger.dispatchEvent(event);

      expect(dropdown.isOpen()).toBe(false);
    });

    it('should prevent default on keyboard events', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);

      const trigger = fixture.nativeElement.querySelector('button');
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      trigger.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Item Click Behavior', () => {
    it('should emit itemClick when item is clicked', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const hostComponent = fixture.componentInstance as TestHostComponent;
      const overlayElement = overlayContainer.getContainerElement();

      const trigger = fixture.nativeElement.querySelector('button');
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      const items = Array.from(overlayElement.querySelectorAll('app-dropdown-basic-item button')) as HTMLButtonElement[];
      items[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(hostComponent.itemClickEvents).toContain('value1');
    });

    it('should emit itemClick from item component directly', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const hostComponent = fixture.componentInstance as TestHostComponent;
      const overlayElement = overlayContainer.getContainerElement();

      const trigger = fixture.nativeElement.querySelector('button');
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      const items = Array.from(overlayElement.querySelectorAll('app-dropdown-basic-item button')) as HTMLButtonElement[];
      items[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(hostComponent.itemClickDirectEvents).toContain('value1');
    });

    it('should close panel after item click when closeOnSelect is true', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;
      const overlayElement = overlayContainer.getContainerElement();

      const trigger = fixture.nativeElement.querySelector('button');
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(dropdown.isOpen()).toBe(true);

      const items = Array.from(overlayElement.querySelectorAll('app-dropdown-basic-item button')) as HTMLButtonElement[];
      items[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(dropdown.isOpen()).toBe(false);
    });

    it('should not emit itemClick when item is disabled', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const hostComponent = fixture.componentInstance as TestHostComponent;
      const overlayElement = overlayContainer.getContainerElement();

      const trigger = fixture.nativeElement.querySelector('button');
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      const items = Array.from(overlayElement.querySelectorAll('app-dropdown-basic-item button')) as HTMLButtonElement[];
      const disabledItem = items[2]; // Third item is disabled

      disabledItem?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(hostComponent.itemClickEvents).not.toContain('value3');
    });

    it('should apply disabled styles to disabled items', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const overlayElement = overlayContainer.getContainerElement();

      const trigger = fixture.nativeElement.querySelector('button');
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      const items = Array.from(overlayElement.querySelectorAll('app-dropdown-basic-item button')) as HTMLButtonElement[];
      const disabledItem = items[2];

      expect(disabledItem?.className).toContain('opacity-50');
      expect(disabledItem?.className).toContain('cursor-not-allowed');
      expect(disabledItem?.disabled).toBe(true);
    });
  });

  describe('Overlay Positioning', () => {
    it('should calculate positions for bottom-end placement', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;

      const positions = dropdown.overlayPositions();
      expect(positions[0]).toMatchObject({
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
        offsetY: 8,
      });
    });

    it('should include horizontal flip positions', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;

      const positions = dropdown.overlayPositions();
      expect(positions.length).toBe(3);
      expect(positions[1]).toMatchObject({
        originX: 'start',
        overlayX: 'start',
      });
    });

    it('should include vertical flip positions', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;

      const positions = dropdown.overlayPositions();
      expect(positions[2]).toMatchObject({
        originY: 'top',
        overlayY: 'bottom',
      });
    });

    it('should apply minPanelWidth style', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const overlayElement = overlayContainer.getContainerElement();

      const trigger = fixture.nativeElement.querySelector('button');
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      const panel = overlayElement.querySelector('.shadow-lg') as HTMLElement;
      const minWidth = panel?.style.minWidth;
      expect(minWidth).toBe('176px');
    });
  });

  describe('Header and Footer Content', () => {
    it('should render items without header or footer by default', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const overlayElement = overlayContainer.getContainerElement();

      const trigger = fixture.nativeElement.querySelector('button');
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      const header = overlayElement.querySelector('app-dropdown-basic-header');
      const footer = overlayElement.querySelector('app-dropdown-basic-footer');
      const items = Array.from(overlayElement.querySelectorAll('app-dropdown-basic-item button')) as HTMLButtonElement[];

      expect(header).toBeFalsy();
      expect(footer).toBeFalsy();
      expect(items.length).toBe(3);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid open/close toggling', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;

      const trigger = fixture.nativeElement.querySelector('button');

      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(dropdown.isOpen()).toBe(false);
    });

    it('should handle opening when already open (no-op)', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;
      const hostComponent = fixture.componentInstance as TestHostComponent;

      const trigger = fixture.nativeElement.querySelector('button');
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      const openEvents = hostComponent.openChangeEvents.length;

      // Try to open again
      dropdown['open']();

      expect(dropdown.isOpen()).toBe(true);
      expect(hostComponent.openChangeEvents.length).toBe(openEvents);
    });

    it('should handle closing when already closed (no-op)', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;
      const hostComponent = fixture.componentInstance as TestHostComponent;

      const closeEvents = hostComponent.openChangeEvents.filter((e) => !e).length;

      // Try to close when already closed
      dropdown.close();

      expect(dropdown.isOpen()).toBe(false);
      expect(hostComponent.openChangeEvents.filter((e) => !e).length).toBe(closeEvents);
    });

    it('should not emit duplicate events on no-op operations', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;
      const hostComponent = fixture.componentInstance as TestHostComponent;

      const trigger = fixture.nativeElement.querySelector('button');
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      const eventCount = hostComponent.openChangeEvents.length;

      // Try to open again (should be no-op)
      dropdown['open']();

      expect(hostComponent.openChangeEvents.length).toBe(eventCount);
    });

    it('should stop event propagation on trigger click', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);

      const trigger = fixture.nativeElement.querySelector('button');
      const event = new MouseEvent('click', { bubbles: true });
      const stopPropagationSpy = vi.spyOn(event, 'stopPropagation');

      trigger.dispatchEvent(event);

      expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it('should stop event propagation on item click', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const overlayElement = overlayContainer.getContainerElement();

      const trigger = fixture.nativeElement.querySelector('button');
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      const items = Array.from(overlayElement.querySelectorAll('app-dropdown-basic-item button')) as HTMLButtonElement[];
      const event = new MouseEvent('click', { bubbles: true });
      const stopPropagationSpy = vi.spyOn(event, 'stopPropagation');

      items[0]?.dispatchEvent(event);

      expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it('should reset hover states when closing', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;

      dropdown.triggerHovering.set(true);
      dropdown.panelHovering.set(true);

      const trigger = fixture.nativeElement.querySelector('button');
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      dropdown.close();

      expect(dropdown.triggerHovering()).toBe(false);
      expect(dropdown.panelHovering()).toBe(false);
    });
  });

  describe('Test ID System', () => {
    it('should not render test IDs when no host attribute provided', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(DropdownBasic);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);

      const host = fixture.nativeElement.querySelector('[data-testid]');
      expect(host).toBeFalsy();
    });

    it('should return null test IDs when no static attribute provided', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;

      // HostAttributeToken doesn't work with dynamic binding [attr.data-testid]
      // It only reads static HTML attributes present at compile time
      expect(dropdown.componentTestId()).toBeNull();
      expect(dropdown.triggerTestId()).toBeNull();
      expect(dropdown.panelTestId()).toBeNull();
    });

    it('should not render test ID attributes when HostAttributeToken is null', () => {
      const fixture = TestBed.configureTestingModule({
        providers: [provideZonelessChangeDetection()],
      }).createComponent(TestHostComponent);
      TestBed.tick();
      overlayContainer = fixture.debugElement.injector.get(OverlayContainer);
      const overlayElement = overlayContainer.getContainerElement();

      const trigger = fixture.nativeElement.querySelector('button');
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      const panel = overlayElement.querySelector('.shadow-lg');

      // Since HostAttributeToken doesn't pick up dynamic binding,
      // the computed test IDs are null and don't render as attributes
      expect(trigger.getAttribute('data-testid')).toBeNull();
      expect(panel?.getAttribute('data-testid')).toBeNull();
    });
  });
});

// Separate test suite for hover strategy
describe('DropdownBasic - Hover Strategy', () => {
  let overlayContainerLocal: OverlayContainer | null = null;

  afterEach(() => {
    overlayContainerLocal?.ngOnDestroy();
    overlayContainerLocal = null;
  });

  it('should open panel on mouse enter', async () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(TestHostComponent);
    TestBed.tick();
    overlayContainerLocal = fixture.debugElement.injector.get(OverlayContainer);

    const hostComponent = fixture.componentInstance as TestHostComponent;
    hostComponent.openStrategy.set('hover');

    const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;
    const trigger = fixture.nativeElement.querySelector('button');
    const wrapper = trigger.parentElement!;

    wrapper.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

    expect(dropdown.isOpen()).toBe(true);
    expect(dropdown.triggerHovering()).toBe(true);
  });

  it('should close panel on mouse leave after delay', async () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(TestHostComponent);
    TestBed.tick();
    overlayContainerLocal = fixture.debugElement.injector.get(OverlayContainer);

    const hostComponent = fixture.componentInstance as TestHostComponent;
    hostComponent.openStrategy.set('hover');

    const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;
    const trigger = fixture.nativeElement.querySelector('button');
    const wrapper = trigger.parentElement!;

    wrapper.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(dropdown.isOpen()).toBe(true);

    wrapper.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    expect(dropdown.triggerHovering()).toBe(false);

    // Wait for hover close timeout (80ms)
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(dropdown.isOpen()).toBe(false);
  });

  it('should not close if re-entering trigger before timeout', async () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(TestHostComponent);
    TestBed.tick();
    overlayContainerLocal = fixture.debugElement.injector.get(OverlayContainer);

    const hostComponent = fixture.componentInstance as TestHostComponent;
    hostComponent.openStrategy.set('hover');

    const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;
    const trigger = fixture.nativeElement.querySelector('button');
    const wrapper = trigger.parentElement!;

    // Enter
    wrapper.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

    // Leave
    wrapper.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));

    // Re-enter before timeout
    await new Promise((resolve) => setTimeout(resolve, 40));
    wrapper.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

    // Wait past original timeout
    await new Promise((resolve) => setTimeout(resolve, 60));

    expect(dropdown.isOpen()).toBe(true);
  });

  it('should not close if hovering over panel', async () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(TestHostComponent);
    TestBed.tick();
    overlayContainerLocal = fixture.debugElement.injector.get(OverlayContainer);
    const overlayElement = overlayContainerLocal.getContainerElement();

    const hostComponent = fixture.componentInstance as TestHostComponent;
    hostComponent.openStrategy.set('hover');

    const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;
    const trigger = fixture.nativeElement.querySelector('button');
    const wrapper = trigger.parentElement!;

    // Open panel
    wrapper.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

    // Leave trigger
    wrapper.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));

    // Hover over panel
    const panel = overlayElement.querySelector('.shadow-lg');
    panel?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(dropdown.panelHovering()).toBe(true);

    // Wait for timeout
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(dropdown.isOpen()).toBe(true);
  });

  it('should close when leaving both trigger and panel', async () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(TestHostComponent);
    TestBed.tick();
    overlayContainerLocal = fixture.debugElement.injector.get(OverlayContainer);
    const overlayElement = overlayContainerLocal.getContainerElement();

    const hostComponent = fixture.componentInstance as TestHostComponent;
    hostComponent.openStrategy.set('hover');

    const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;
    const trigger = fixture.nativeElement.querySelector('button');
    const wrapper = trigger.parentElement!;

    // Open panel
    wrapper.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

    // Move to panel
    wrapper.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    const panel = overlayElement.querySelector('.shadow-lg');
    panel?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

    // Leave panel
    panel?.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));

    // Wait for timeout
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(dropdown.isOpen()).toBe(false);
  });

  it('should not respond to click events when using hover strategy', async () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(TestHostComponent);
    TestBed.tick();
    overlayContainerLocal = fixture.debugElement.injector.get(OverlayContainer);

    const hostComponent = fixture.componentInstance as TestHostComponent;
    hostComponent.openStrategy.set('hover');

    const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;
    const trigger = fixture.nativeElement.querySelector('button');

    expect(dropdown.isOpen()).toBe(false);

    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(dropdown.isOpen()).toBe(false);
  });

  it('should not create backdrop when using hover strategy', async () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(TestHostComponent);
    TestBed.tick();
    overlayContainerLocal = fixture.debugElement.injector.get(OverlayContainer);
    const overlayElement = overlayContainerLocal.getContainerElement();

    const hostComponent = fixture.componentInstance as TestHostComponent;
    hostComponent.openStrategy.set('hover');

    const trigger = fixture.nativeElement.querySelector('button');
    const wrapper = trigger.parentElement!;

    wrapper.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

    const backdrop = overlayElement.querySelector('.cdk-overlay-backdrop');
    expect(backdrop).toBeFalsy();
  });
});

// Separate test suite for different configurations
describe('DropdownBasic - Different Variants', () => {
  let overlayContainerLocal: OverlayContainer | null = null;

  afterEach(() => {
    overlayContainerLocal?.ngOnDestroy();
    overlayContainerLocal = null;
  });

  it('should apply soft variant classes', () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(TestHostComponent);
    TestBed.tick();
    overlayContainerLocal = fixture.debugElement.injector.get(OverlayContainer);

    const hostComponent = fixture.componentInstance as TestHostComponent;
    hostComponent.triggerConfig.set({ variant: 'soft', size: 'md' });

    const trigger = fixture.nativeElement.querySelector('button');
    expect(trigger.className).toContain('bg-bg-secondary');
    expect(trigger.className).toContain('text-text-primary');
    expect(trigger.className).toContain('hover:bg-bg-surface');
  });

  it('should apply ghost variant classes', () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(TestHostComponent);
    TestBed.tick();
    overlayContainerLocal = fixture.debugElement.injector.get(OverlayContainer);

    const hostComponent = fixture.componentInstance as TestHostComponent;
    hostComponent.triggerConfig.set({ variant: 'ghost', size: 'md' });

    const trigger = fixture.nativeElement.querySelector('button');
    expect(trigger.className).toContain('bg-transparent');
    expect(trigger.className).toContain('text-text-primary');
    expect(trigger.className).toContain('hover:bg-bg-secondary');
  });

  it('should apply small size classes', () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(TestHostComponent);
    TestBed.tick();
    overlayContainerLocal = fixture.debugElement.injector.get(OverlayContainer);

    const hostComponent = fixture.componentInstance as TestHostComponent;
    hostComponent.triggerConfig.set({ variant: 'solid', size: 'sm' });

    const trigger = fixture.nativeElement.querySelector('button');
    expect(trigger.className).toContain('px-3');
    expect(trigger.className).toContain('py-1.5');
  });

  it('should calculate positions for bottom-start placement', () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(TestHostComponent);
    TestBed.tick();
    overlayContainerLocal = fixture.debugElement.injector.get(OverlayContainer);

    const hostComponent = fixture.componentInstance as TestHostComponent;
    hostComponent.placement.set('bottom-start');

    const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;
    const positions = dropdown.overlayPositions();

    expect(positions[0]).toMatchObject({
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 8,
    });
    TestBed.tick();
  });

  it('should calculate positions for top-end placement', () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(TestHostComponent);
    TestBed.tick();
    overlayContainerLocal = fixture.debugElement.injector.get(OverlayContainer);

    const hostComponent = fixture.componentInstance as TestHostComponent;
    hostComponent.placement.set('top-end');

    const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;
    const positions = dropdown.overlayPositions();

    expect(positions[0]).toMatchObject({
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetY: -8,
    });
    TestBed.tick();
  });

  it('should calculate positions for top-start placement', () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(TestHostComponent);
    TestBed.tick();
    overlayContainerLocal = fixture.debugElement.injector.get(OverlayContainer);

    const hostComponent = fixture.componentInstance as TestHostComponent;
    hostComponent.placement.set('top-start');

    const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;
    const positions = dropdown.overlayPositions();

    expect(positions[0]).toMatchObject({
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: -8,
    });
    TestBed.tick();
  });

  it('should not close panel when closeOnSelect is false', () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(TestHostComponent);
    TestBed.tick();
    overlayContainerLocal = fixture.debugElement.injector.get(OverlayContainer);
    const overlayElement = overlayContainerLocal.getContainerElement();

    const hostComponent = fixture.componentInstance as TestHostComponent;
    hostComponent.closeOnSelect.set(false);

    const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;
    const trigger = fixture.nativeElement.querySelector('button');

    // Open dropdown
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(dropdown.isOpen()).toBe(true);

    // Click item
    const items = Array.from(
      overlayElement.querySelectorAll('app-dropdown-basic-item button'),
    ) as HTMLButtonElement[];
    items[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(dropdown.isOpen()).toBe(true);
  });

  it('should render header when provided', () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(TestHostComponent);
    TestBed.tick();
    overlayContainerLocal = fixture.debugElement.injector.get(OverlayContainer);
    const overlayElement = overlayContainerLocal.getContainerElement();

    const hostComponent = fixture.componentInstance as TestHostComponent;
    hostComponent.showHeader.set(true);

    const trigger = fixture.nativeElement.querySelector('button');
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const header = overlayElement.querySelector('app-dropdown-basic-header');
    expect(header).toBeTruthy();
    expect(header?.textContent?.trim()).toBe('Header Content');
  });

  it('should render footer when provided', () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(TestHostComponent);
    TestBed.tick();
    overlayContainerLocal = fixture.debugElement.injector.get(OverlayContainer);
    const overlayElement = overlayContainerLocal.getContainerElement();

    const hostComponent = fixture.componentInstance as TestHostComponent;
    hostComponent.showFooter.set(true);

    const trigger = fixture.nativeElement.querySelector('button');
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const footer = overlayElement.querySelector('app-dropdown-basic-footer');
    expect(footer).toBeTruthy();
    expect(footer?.textContent?.trim()).toBe('Footer Content');
  });

  it('should apply custom minPanelWidth', () => {
    const fixture = TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    }).createComponent(TestHostComponent);
    TestBed.tick();
    overlayContainerLocal = fixture.debugElement.injector.get(OverlayContainer);
    const overlayElement = overlayContainerLocal.getContainerElement();

    const hostComponent = fixture.componentInstance as TestHostComponent;
    hostComponent.minPanelWidth.set(300);

    const trigger = fixture.nativeElement.querySelector('button');
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const panel = overlayElement.querySelector('.shadow-lg') as HTMLElement;
    expect(panel.style.minWidth).toBe('300px');
  });
});
