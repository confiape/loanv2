import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection, signal, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Accordion } from './accordion';
import { AccordionItemComponent } from './accordion-item';
import { AccordionItemHeaderComponent } from './accordion-item-header';
import { AccordionItemContentComponent } from './accordion-item-content';

@Component({
  selector: 'app-test-wrapper',
  standalone: true,
  imports: [
    Accordion,
    AccordionItemComponent,
    AccordionItemHeaderComponent,
    AccordionItemContentComponent,
  ],
  template: `
    <app-accordion [allowMultiple]="allowMultiple()">
      <app-accordion-item [id]="'item1'" [disabled]="item1Disabled()" [expanded]="item1Expanded()">
        <app-accordion-item-header>First Item</app-accordion-item-header>
        <app-accordion-item-content>Content 1</app-accordion-item-content>
      </app-accordion-item>
      <app-accordion-item [id]="'item2'">
        <app-accordion-item-header>Second Item</app-accordion-item-header>
        <app-accordion-item-content>Content 2</app-accordion-item-content>
      </app-accordion-item>
      <app-accordion-item [id]="'item3'">
        <app-accordion-item-header>Third Item</app-accordion-item-header>
        <app-accordion-item-content>Content 3</app-accordion-item-content>
      </app-accordion-item>
    </app-accordion>
  `,
})
class TestWrapperComponent {
  readonly allowMultiple = signal(false);
  readonly item1Disabled = signal(false);
  readonly item1Expanded = signal(false);
}

describe('Accordion', () => {
  let component: Accordion;
  let fixture: ComponentFixture<Accordion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Accordion],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Accordion);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with no expanded items', () => {
    expect(component.expandedItems().size).toBe(0);
  });

  it('should expand item when toggleItem is called', () => {
    component.toggleItem('1');
    expect(component.isExpanded('1')).toBe(true);
  });

  it('should collapse item when toggleItem is called on expanded item', () => {
    component.toggleItem('1');
    component.toggleItem('1');
    expect(component.isExpanded('1')).toBe(false);
  });

  it('should collapse previous item when opening new item in single mode', () => {
    fixture.componentRef.setInput('allowMultiple', false);
    component.toggleItem('1');
    component.toggleItem('2');
    expect(component.isExpanded('1')).toBe(false);
    expect(component.isExpanded('2')).toBe(true);
  });

  it('should allow multiple items to be expanded when allowMultiple is true', () => {
    fixture.componentRef.setInput('allowMultiple', true);
    component.toggleItem('1');
    component.toggleItem('2');
    expect(component.isExpanded('1')).toBe(true);
    expect(component.isExpanded('2')).toBe(true);
  });

  it('should emit itemSelected event when item is toggled', async () => {
    const promise = new Promise<string>((resolve) => {
      component.itemSelected.subscribe((itemId: string) => {
        resolve(itemId);
      });
    });
    component.toggleItem('1');
    const itemId = await promise;
    expect(itemId).toBe('1');
  });

  it('should collapse all items when Escape key is pressed', () => {
    component.toggleItem('1');
    component.toggleItem('2');

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    component.onKeyDown(event, '1');

    expect(component.isExpanded('1')).toBe(false);
    expect(component.isExpanded('2')).toBe(false);
  });

  describe('with content projection', () => {
    let wrapperFixture: ComponentFixture<TestWrapperComponent>;
    let wrapperComponent: TestWrapperComponent;
    let accordionComponent: Accordion;

    beforeEach(async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [TestWrapperComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      wrapperFixture = TestBed.createComponent(TestWrapperComponent);
      wrapperComponent = wrapperFixture.componentInstance;
      wrapperFixture.detectChanges();

      const accordionDebugElement: DebugElement = wrapperFixture.debugElement.query(
        By.directive(Accordion),
      );
      accordionComponent = accordionDebugElement.componentInstance;
    });

    it('should render all projected accordion items', () => {
      const items = wrapperFixture.nativeElement.querySelectorAll('app-accordion-item');
      expect(items.length).toBe(3);
    });

    it('should render correct headers', () => {
      const headers = wrapperFixture.nativeElement.querySelectorAll('button span');
      expect(headers[0].textContent?.trim()).toBe('First Item');
      expect(headers[1].textContent?.trim()).toBe('Second Item');
      expect(headers[2].textContent?.trim()).toBe('Third Item');
    });

    it('should respect expanded input on initial render', () => {
      wrapperComponent.item1Expanded.set(true);
      wrapperFixture.detectChanges();

      const contentItems = accordionComponent.getContentItems();
      expect(contentItems.length).toBe(3);

      const expanded = accordionComponent.expandedItems();
      expect(expanded.has('item1')).toBe(true);
    });

    it('should not toggle disabled items', () => {
      wrapperComponent.item1Disabled.set(true);
      wrapperFixture.detectChanges();

      accordionComponent.toggleItem('item1');
      expect(accordionComponent.isExpanded('item1')).toBe(false);
    });

    it('should toggle enabled items', () => {
      accordionComponent.toggleItem('item1');
      expect(accordionComponent.isExpanded('item1')).toBe(true);
    });

    it('should handle single expansion mode with content projection', () => {
      wrapperComponent.allowMultiple.set(false);
      wrapperFixture.detectChanges();

      accordionComponent.toggleItem('item1');
      accordionComponent.toggleItem('item2');

      expect(accordionComponent.isExpanded('item1')).toBe(false);
      expect(accordionComponent.isExpanded('item2')).toBe(true);
    });

    it('should handle multiple expansion mode with content projection', () => {
      wrapperComponent.allowMultiple.set(true);
      wrapperFixture.detectChanges();

      accordionComponent.toggleItem('item1');
      accordionComponent.toggleItem('item2');

      expect(accordionComponent.isExpanded('item1')).toBe(true);
      expect(accordionComponent.isExpanded('item2')).toBe(true);
    });
  });

  describe('data-testid support', () => {
    it('should render test IDs with wrapper pattern when data-testid attribute is provided', async () => {
      @Component({
        template: `
          <app-accordion [testId]="'test-accordion'">
            <app-accordion-item [id]="'shipping'">
              <app-accordion-item-header>Shipping Info</app-accordion-item-header>
              <app-accordion-item-content>Shipping content</app-accordion-item-content>
            </app-accordion-item>
            <app-accordion-item [id]="'payment'">
              <app-accordion-item-header>Payment</app-accordion-item-header>
              <app-accordion-item-content>Payment content</app-accordion-item-content>
            </app-accordion-item>
          </app-accordion>
        `,
        standalone: true,
        imports: [
          Accordion,
          AccordionItemComponent,
          AccordionItemHeaderComponent,
          AccordionItemContentComponent,
        ],
      })
      class TestWrapper {}

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [TestWrapper],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const wrapperFixture = TestBed.createComponent(TestWrapper);
      wrapperFixture.detectChanges();
      await wrapperFixture.whenStable();

      const hostElement = wrapperFixture.nativeElement.querySelector('app-accordion');

      // Verify host has -wrapper suffix
      expect(hostElement.getAttribute('data-testid')).toBe('test-accordion-wrapper');

      // Verify container has original ID
      const container = hostElement.querySelector('div.space-y-2');
      expect(container?.getAttribute('data-testid')).toBe('test-accordion');

      // Verify trigger test IDs on correct element types (buttons)
      const allButtons = hostElement.querySelectorAll('button');
      const shippingTrigger = (Array.from(allButtons) as Element[]).find(b =>
        b.getAttribute('data-testid') === 'test-accordion-trigger-shipping'
      );
      expect(shippingTrigger).toBeTruthy();

      const paymentTrigger = (Array.from(allButtons) as Element[]).find(b =>
        b.getAttribute('data-testid') === 'test-accordion-trigger-payment'
      );
      expect(paymentTrigger).toBeTruthy();

      // Verify panel test IDs on correct element types (divs)
      const allDivs = hostElement.querySelectorAll('div');
      const shippingPanel = (Array.from(allDivs) as Element[]).find(d =>
        d.getAttribute('data-testid') === 'test-accordion-panel-shipping'
      );
      expect(shippingPanel).toBeTruthy();

      const paymentPanel = (Array.from(allDivs) as Element[]).find(d =>
        d.getAttribute('data-testid') === 'test-accordion-panel-payment'
      );
      expect(paymentPanel).toBeTruthy();
    });

    it('should not render test IDs when data-testid attribute is not provided', async () => {
      @Component({
        template: `
          <app-accordion>
            <app-accordion-item [id]="'item1'">
              <app-accordion-item-header>Header</app-accordion-item-header>
              <app-accordion-item-content>Content</app-accordion-item-content>
            </app-accordion-item>
          </app-accordion>
        `,
        standalone: true,
        imports: [
          Accordion,
          AccordionItemComponent,
          AccordionItemHeaderComponent,
          AccordionItemContentComponent,
        ],
      })
      class TestWrapper {}

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [TestWrapper],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const wrapperFixture = TestBed.createComponent(TestWrapper);
      wrapperFixture.detectChanges();
      await wrapperFixture.whenStable();

      // Verify NO test IDs are rendered
      const element = wrapperFixture.nativeElement;
      const elementsWithTestId = element.querySelectorAll('[data-testid]');
      expect(elementsWithTestId.length).toBe(0);
    });
  });
});
