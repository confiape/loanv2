import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { beforeEach, describe, expect, it, afterEach, vi } from 'vitest';
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
      [attr.data-testid]="testId"
      [triggerConfig]="triggerConfig"
      [placement]="placement"
      [openStrategy]="openStrategy"
      [closeOnSelect]="closeOnSelect"
      [minPanelWidth]="minPanelWidth"
      (openChange)="onOpenChange($event)"
      (itemClick)="onItemClick($event)"
    >
      <span trigger>{{ triggerLabel }}</span>
      @if (showHeader) {
        <app-dropdown-basic-header>Header Content</app-dropdown-basic-header>
      }
      @for (item of items; track item.id) {
        <app-dropdown-basic-item
          [disabled]="item.disabled"
          [value]="item.value"
          (itemClick)="onItemClickDirect($event)"
        >
          {{ item.label }}
        </app-dropdown-basic-item>
      }
      @if (showFooter) {
        <app-dropdown-basic-footer>Footer Content</app-dropdown-basic-footer>
      }
    </app-dropdown-basic>
  `,
})
class TestHostComponent {
  testId = 'dropdown';
  triggerLabel = 'Menu';
  triggerConfig: { variant?: 'solid' | 'soft' | 'ghost'; size?: 'sm' | 'md' } = {
    variant: 'solid',
    size: 'md',
  };
  placement: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' = 'bottom-end';
  openStrategy: 'click' | 'hover' = 'click';
  closeOnSelect = true;
  minPanelWidth = 176;
  showHeader = false;
  showFooter = false;
  items = [
    { id: '1', label: 'Item 1', value: 'value1', disabled: false },
    { id: '2', label: 'Item 2', value: 'value2', disabled: false },
    { id: '3', label: 'Item 3', value: 'value3', disabled: true },
  ];

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
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let dropdownComponent: DropdownBasic;
  let overlayContainer: OverlayContainer;
  let overlayElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();

    // Get the dropdown component instance
    const dropdownDebugElement = fixture.debugElement.children[0];
    dropdownComponent = dropdownDebugElement.componentInstance;

    overlayContainer = TestBed.inject(OverlayContainer);
    overlayElement = overlayContainer.getContainerElement();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function getTriggerButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button') as HTMLButtonElement;
  }

  function getPanel(): HTMLElement | null {
    // Panel is rendered in the overlay container with shadow-lg class
    return overlayElement.querySelector('.shadow-lg');
  }

  function getPanelItems(): HTMLButtonElement[] {
    return Array.from(overlayElement.querySelectorAll('app-dropdown-basic-item button'));
  }

  function clickTrigger() {
    const trigger = getTriggerButton();
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
  }

  function triggerKeydown(key: string) {
    const trigger = getTriggerButton();
    const event = new KeyboardEvent('keydown', { key, bubbles: true });
    trigger.dispatchEvent(event);
    fixture.detectChanges();
  }

  function documentEscape() {
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    document.dispatchEvent(event);
    fixture.detectChanges();
  }

  function getDropdownInternals() {
    return dropdownComponent as unknown as {
      hoverCloseTimeout: ReturnType<typeof setTimeout> | null;
    };
  }

  describe('Component Creation & Initialization', () => {
    it('should create the component successfully', () => {
      expect(dropdownComponent).toBeTruthy();
    });

    it('should render with default configuration', () => {
      const trigger = getTriggerButton();
      expect(trigger).toBeTruthy();
      expect(trigger.textContent?.trim()).toBe('Menu');
      expect(dropdownComponent.isOpen()).toBe(false);
    });

    it('should apply correct trigger classes for solid variant', () => {
      const trigger = getTriggerButton();
      expect(trigger.className).toContain('bg-accent');
      expect(trigger.className).toContain('text-white');
      expect(trigger.className).toContain('hover:bg-accent-hover');
    });

    it('should apply correct trigger classes for medium size', () => {
      const trigger = getTriggerButton();
      expect(trigger.className).toContain('px-4');
      expect(trigger.className).toContain('py-2');
    });

    it('should have inline-flex host class', () => {
      const host = fixture.nativeElement.querySelector('app-dropdown-basic');
      expect(host?.classList.contains('inline-flex')).toBe(true);
    });

    it('should set aria-expanded to false when closed', () => {
      const trigger = getTriggerButton();
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('should set aria-haspopup to true', () => {
      const trigger = getTriggerButton();
      expect(trigger.getAttribute('aria-haspopup')).toBe('true');
    });
  });

  describe('Click Strategy Interaction', () => {
    it('should open panel when trigger clicked', () => {
      expect(dropdownComponent.isOpen()).toBe(false);

      clickTrigger();

      expect(dropdownComponent.isOpen()).toBe(true);
      const panel = getPanel();
      expect(panel).toBeTruthy();
    });

    it('should close panel when trigger clicked again', () => {
      clickTrigger();
      expect(dropdownComponent.isOpen()).toBe(true);

      clickTrigger();
      expect(dropdownComponent.isOpen()).toBe(false);
    });

    it('should emit openChange event when opening', () => {
      clickTrigger();

      expect(hostComponent.openChangeEvents).toContain(true);
    });

    it('should emit openChange event when closing', () => {
      clickTrigger();
      hostComponent.openChangeEvents = [];

      clickTrigger();

      expect(hostComponent.openChangeEvents).toContain(false);
    });

    it('should set aria-expanded to true when opened', () => {
      clickTrigger();

      const trigger = getTriggerButton();
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
    });

    it('should close panel when clicking backdrop', () => {
      clickTrigger();
      expect(dropdownComponent.isOpen()).toBe(true);

      const backdrop = overlayElement.querySelector('.cdk-overlay-backdrop') as HTMLElement;
      backdrop?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      fixture.detectChanges();

      expect(dropdownComponent.isOpen()).toBe(false);
    });

    it('should close panel on Escape key', () => {
      clickTrigger();
      expect(dropdownComponent.isOpen()).toBe(true);

      documentEscape();

      expect(dropdownComponent.isOpen()).toBe(false);
    });

    it('should not respond to mouse hover when using click strategy', () => {
      const trigger = getTriggerButton();
      const wrapper = trigger.parentElement!;

      wrapper.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      fixture.detectChanges();

      expect(dropdownComponent.isOpen()).toBe(false);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should open panel on Enter key press', () => {
      expect(dropdownComponent.isOpen()).toBe(false);

      triggerKeydown('Enter');

      expect(dropdownComponent.isOpen()).toBe(true);
    });

    it('should close panel on Enter key press when open', () => {
      clickTrigger();
      expect(dropdownComponent.isOpen()).toBe(true);

      triggerKeydown('Enter');

      expect(dropdownComponent.isOpen()).toBe(false);
    });

    it('should toggle panel on Space key press', () => {
      triggerKeydown(' ');
      expect(dropdownComponent.isOpen()).toBe(true);

      triggerKeydown(' ');
      expect(dropdownComponent.isOpen()).toBe(false);
    });

    it('should open panel on ArrowDown key press', () => {
      expect(dropdownComponent.isOpen()).toBe(false);

      triggerKeydown('ArrowDown');

      expect(dropdownComponent.isOpen()).toBe(true);
    });

    it('should not close panel on ArrowDown when already open', () => {
      clickTrigger();
      expect(dropdownComponent.isOpen()).toBe(true);

      triggerKeydown('ArrowDown');

      expect(dropdownComponent.isOpen()).toBe(true);
    });

    it('should close panel on ArrowUp key press when open', () => {
      clickTrigger();
      expect(dropdownComponent.isOpen()).toBe(true);

      triggerKeydown('ArrowUp');

      expect(dropdownComponent.isOpen()).toBe(false);
    });

    it('should not open panel on ArrowUp when closed', () => {
      expect(dropdownComponent.isOpen()).toBe(false);

      triggerKeydown('ArrowUp');

      expect(dropdownComponent.isOpen()).toBe(false);
    });

    it('should prevent default on keyboard events', () => {
      const trigger = getTriggerButton();
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      trigger.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Item Click Behavior', () => {
    beforeEach(() => {
      clickTrigger();
    });

    it('should emit itemClick when item is clicked', () => {
      const items = getPanelItems();
      items[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      fixture.detectChanges();

      expect(hostComponent.itemClickEvents).toContain('value1');
    });

    it('should emit itemClick from item component directly', () => {
      const items = getPanelItems();
      items[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      fixture.detectChanges();

      expect(hostComponent.itemClickDirectEvents).toContain('value1');
    });

    it('should close panel after item click when closeOnSelect is true', () => {
      expect(dropdownComponent.isOpen()).toBe(true);

      const items = getPanelItems();
      items[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      fixture.detectChanges();

      expect(dropdownComponent.isOpen()).toBe(false);
    });

    it('should not emit itemClick when item is disabled', () => {
      const items = getPanelItems();
      const disabledItem = items[2]; // Third item is disabled

      disabledItem?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      fixture.detectChanges();

      expect(hostComponent.itemClickEvents).not.toContain('value3');
    });

    it('should apply disabled styles to disabled items', () => {
      const items = getPanelItems();
      const disabledItem = items[2];

      expect(disabledItem?.className).toContain('opacity-50');
      expect(disabledItem?.className).toContain('cursor-not-allowed');
      expect(disabledItem?.disabled).toBe(true);
    });
  });

  describe('Overlay Positioning', () => {
    it('should calculate positions for bottom-end placement', () => {
      const positions = dropdownComponent.overlayPositions();
      expect(positions[0]).toMatchObject({
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
        offsetY: 8,
      });
    });

    it('should include horizontal flip positions', () => {
      const positions = dropdownComponent.overlayPositions();
      expect(positions.length).toBe(3);
      expect(positions[1]).toMatchObject({
        originX: 'start',
        overlayX: 'start',
      });
    });

    it('should include vertical flip positions', () => {
      const positions = dropdownComponent.overlayPositions();
      expect(positions[2]).toMatchObject({
        originY: 'top',
        overlayY: 'bottom',
      });
    });

    it('should apply minPanelWidth style', () => {
      clickTrigger();

      const panel = getPanel();
      const minWidth = panel?.style.minWidth;
      expect(minWidth).toBe('176px');
    });
  });

  describe('Header and Footer Content', () => {
    it('should render items without header or footer by default', () => {
      clickTrigger();

      const header = overlayElement.querySelector('app-dropdown-basic-header');
      const footer = overlayElement.querySelector('app-dropdown-basic-footer');
      const items = getPanelItems();

      expect(header).toBeFalsy();
      expect(footer).toBeFalsy();
      expect(items.length).toBe(3);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid open/close toggling', () => {
      clickTrigger();
      clickTrigger();
      clickTrigger();
      clickTrigger();

      expect(dropdownComponent.isOpen()).toBe(false);
    });

    it('should handle opening when already open (no-op)', () => {
      clickTrigger();
      const openEvents = hostComponent.openChangeEvents.length;

      // Try to open again
      dropdownComponent['open']();
      fixture.detectChanges();

      expect(dropdownComponent.isOpen()).toBe(true);
      expect(hostComponent.openChangeEvents.length).toBe(openEvents);
    });

    it('should handle closing when already closed (no-op)', () => {
      const closeEvents = hostComponent.openChangeEvents.filter((e) => !e).length;

      // Try to close when already closed
      dropdownComponent.close();
      fixture.detectChanges();

      expect(dropdownComponent.isOpen()).toBe(false);
      expect(hostComponent.openChangeEvents.filter((e) => !e).length).toBe(closeEvents);
    });

    it('should not emit duplicate events on no-op operations', () => {
      clickTrigger();
      const eventCount = hostComponent.openChangeEvents.length;

      // Try to open again (should be no-op)
      dropdownComponent['open']();
      fixture.detectChanges();

      expect(hostComponent.openChangeEvents.length).toBe(eventCount);
    });

    it('should stop event propagation on trigger click', () => {
      const trigger = getTriggerButton();
      const event = new MouseEvent('click', { bubbles: true });
      const stopPropagationSpy = vi.spyOn(event, 'stopPropagation');

      trigger.dispatchEvent(event);

      expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it('should stop event propagation on item click', () => {
      clickTrigger();

      const items = getPanelItems();
      const event = new MouseEvent('click', { bubbles: true });
      const stopPropagationSpy = vi.spyOn(event, 'stopPropagation');

      items[0]?.dispatchEvent(event);

      expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it('should clear hover timeout when opening', () => {
      // Simulate hover timeout being set
      getDropdownInternals().hoverCloseTimeout = setTimeout(() => undefined, 100);

      dropdownComponent['open']();

      expect(getDropdownInternals().hoverCloseTimeout).toBeNull();
    });

    it('should reset hover states when closing', () => {
      dropdownComponent.triggerHovering.set(true);
      dropdownComponent.panelHovering.set(true);
      clickTrigger();

      dropdownComponent.close();
      fixture.detectChanges();

      expect(dropdownComponent.triggerHovering()).toBe(false);
      expect(dropdownComponent.panelHovering()).toBe(false);
    });
  });

  describe('Test ID System', () => {
    it('should not render test IDs when no host attribute provided', async () => {
      // Create a new component without test ID
      const noTestIdFixture = TestBed.createComponent(DropdownBasic);
      noTestIdFixture.detectChanges();

      const host = noTestIdFixture.nativeElement.querySelector('[data-testid]');
      expect(host).toBeFalsy();
    });

    it('should return null test IDs when no static attribute provided', () => {
      // HostAttributeToken doesn't work with dynamic binding [attr.data-testid]
      // It only reads static HTML attributes present at compile time
      // In this test, we use dynamic binding which doesn't work with HostAttributeToken
      expect(dropdownComponent.componentTestId()).toBeNull();
      expect(dropdownComponent.triggerTestId()).toBeNull();
      expect(dropdownComponent.panelTestId()).toBeNull();
    });

    it('should not render test ID attributes when HostAttributeToken is null', () => {
      clickTrigger();

      const trigger = getTriggerButton();
      const panel = overlayElement.querySelector('.shadow-lg');

      // Since HostAttributeToken doesn't pick up dynamic binding,
      // the computed test IDs are null and don't render as attributes
      expect(trigger.getAttribute('data-testid')).toBeNull();
      expect(panel?.getAttribute('data-testid')).toBeNull();
    });
  });
});

// Separate test suite for hover strategy to avoid change detection issues
describe('DropdownBasic - Hover Strategy', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let dropdownComponent: DropdownBasic;
  let overlayContainer: OverlayContainer;
  let overlayElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    hostComponent.openStrategy = 'hover'; // Set before initial detection
    fixture.detectChanges();

    const dropdownDebugElement = fixture.debugElement.children[0];
    dropdownComponent = dropdownDebugElement.componentInstance;

    overlayContainer = TestBed.inject(OverlayContainer);
    overlayElement = overlayContainer.getContainerElement();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function getTriggerButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button') as HTMLButtonElement;
  }

  function getPanel(): HTMLElement | null {
    return overlayElement.querySelector('.shadow-lg');
  }

  it('should open panel on mouse enter', () => {
    const trigger = getTriggerButton();
    const wrapper = trigger.parentElement!;

    wrapper.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    fixture.detectChanges();

    expect(dropdownComponent.isOpen()).toBe(true);
    expect(dropdownComponent.triggerHovering()).toBe(true);
  });

  it('should close panel on mouse leave after delay', async () => {
    const trigger = getTriggerButton();
    const wrapper = trigger.parentElement!;

    wrapper.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    fixture.detectChanges();
    expect(dropdownComponent.isOpen()).toBe(true);

    wrapper.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    fixture.detectChanges();
    expect(dropdownComponent.triggerHovering()).toBe(false);

    // Wait for hover close timeout (80ms)
    await new Promise((resolve) => setTimeout(resolve, 100));
    fixture.detectChanges();

    expect(dropdownComponent.isOpen()).toBe(false);
  });

  it('should not close if re-entering trigger before timeout', async () => {
    const trigger = getTriggerButton();
    const wrapper = trigger.parentElement!;

    // Enter
    wrapper.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    fixture.detectChanges();

    // Leave
    wrapper.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    fixture.detectChanges();

    // Re-enter before timeout
    await new Promise((resolve) => setTimeout(resolve, 40));
    wrapper.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    fixture.detectChanges();

    // Wait past original timeout
    await new Promise((resolve) => setTimeout(resolve, 60));
    fixture.detectChanges();

    expect(dropdownComponent.isOpen()).toBe(true);
  });

  it('should not close if hovering over panel', async () => {
    const trigger = getTriggerButton();
    const wrapper = trigger.parentElement!;

    // Open panel
    wrapper.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    fixture.detectChanges();

    // Leave trigger
    wrapper.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    fixture.detectChanges();

    // Hover over panel
    const panel = getPanel();
    panel?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    fixture.detectChanges();
    expect(dropdownComponent.panelHovering()).toBe(true);

    // Wait for timeout
    await new Promise((resolve) => setTimeout(resolve, 100));
    fixture.detectChanges();

    expect(dropdownComponent.isOpen()).toBe(true);
  });

  it('should close when leaving both trigger and panel', async () => {
    const trigger = getTriggerButton();
    const wrapper = trigger.parentElement!;

    // Open panel
    wrapper.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    fixture.detectChanges();

    // Move to panel
    wrapper.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    const panel = getPanel();
    panel?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    fixture.detectChanges();

    // Leave panel
    panel?.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    fixture.detectChanges();

    // Wait for timeout
    await new Promise((resolve) => setTimeout(resolve, 100));
    fixture.detectChanges();

    expect(dropdownComponent.isOpen()).toBe(false);
  });

  it('should not respond to click events when using hover strategy', () => {
    const trigger = getTriggerButton();
    expect(dropdownComponent.isOpen()).toBe(false);

    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(dropdownComponent.isOpen()).toBe(false);
  });

  it('should not create backdrop when using hover strategy', () => {
    const trigger = getTriggerButton();
    const wrapper = trigger.parentElement!;

    wrapper.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    fixture.detectChanges();

    const backdrop = overlayElement.querySelector('.cdk-overlay-backdrop');
    expect(backdrop).toBeFalsy();
  });
});

// Separate test suite for different configurations
describe('DropdownBasic - Different Variants', () => {
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    overlayContainer = TestBed.inject(OverlayContainer);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('should apply soft variant classes', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.triggerConfig = { variant: 'soft', size: 'md' };
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button');
    expect(trigger.className).toContain('bg-bg-secondary');
    expect(trigger.className).toContain('text-text-primary');
    expect(trigger.className).toContain('hover:bg-bg-surface');
  });

  it('should apply ghost variant classes', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.triggerConfig = { variant: 'ghost', size: 'md' };
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button');
    expect(trigger.className).toContain('bg-transparent');
    expect(trigger.className).toContain('text-text-primary');
    expect(trigger.className).toContain('hover:bg-bg-secondary');
  });

  it('should apply small size classes', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.triggerConfig = { variant: 'solid', size: 'sm' };
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button');
    expect(trigger.className).toContain('px-3');
    expect(trigger.className).toContain('py-1.5');
  });

  it('should calculate positions for bottom-start placement', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.placement = 'bottom-start';
    fixture.detectChanges();

    const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;
    const positions = dropdown.overlayPositions();

    expect(positions[0]).toMatchObject({
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 8,
    });
  });

  it('should calculate positions for top-end placement', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.placement = 'top-end';
    fixture.detectChanges();

    const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;
    const positions = dropdown.overlayPositions();

    expect(positions[0]).toMatchObject({
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetY: -8,
    });
  });

  it('should calculate positions for top-start placement', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.placement = 'top-start';
    fixture.detectChanges();

    const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;
    const positions = dropdown.overlayPositions();

    expect(positions[0]).toMatchObject({
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: -8,
    });
  });

  it('should not close panel when closeOnSelect is false', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.closeOnSelect = false;
    fixture.detectChanges();

    const dropdown = fixture.debugElement.children[0].componentInstance as DropdownBasic;
    const trigger = fixture.nativeElement.querySelector('button');

    // Open dropdown
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    expect(dropdown.isOpen()).toBe(true);

    // Click item
    const overlayElement = overlayContainer.getContainerElement();
    const items = Array.from(
      overlayElement.querySelectorAll('app-dropdown-basic-item button'),
    ) as HTMLButtonElement[];
    items[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(dropdown.isOpen()).toBe(true);
  });

  it('should render header when provided', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.showHeader = true;
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button');
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    const overlayElement = overlayContainer.getContainerElement();
    const header = overlayElement.querySelector('app-dropdown-basic-header');
    expect(header).toBeTruthy();
    expect(header?.textContent?.trim()).toBe('Header Content');
  });

  it('should render footer when provided', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.showFooter = true;
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button');
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    const overlayElement = overlayContainer.getContainerElement();
    const footer = overlayElement.querySelector('app-dropdown-basic-footer');
    expect(footer).toBeTruthy();
    expect(footer?.textContent?.trim()).toBe('Footer Content');
  });

  it('should apply custom minPanelWidth', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.minPanelWidth = 300;
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button');
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    const overlayElement = overlayContainer.getContainerElement();
    const panel = overlayElement.querySelector('.shadow-lg') as HTMLElement;
    expect(panel.style.minWidth).toBe('300px');
  });
});
