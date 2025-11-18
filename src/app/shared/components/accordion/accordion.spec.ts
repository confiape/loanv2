import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Component,
  provideZonelessChangeDetection,
  signal,
  DebugElement,
  inputBinding,
  outputBinding,
} from '@angular/core';
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
  it('should create', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      imports: [Accordion],
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Accordion);
    TestBed.tick();
    const component = fixture.componentInstance;

    // Assert
    expect(component).toBeTruthy();
  });

  it('should initialize with no expanded items', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      imports: [Accordion],
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Accordion);
    TestBed.tick();
    const component = fixture.componentInstance;

    // Assert
    expect(component.expandedItems().size).toBe(0);
  });

  it('should expand item when toggleItem is called', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      imports: [Accordion],
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Accordion);
    TestBed.tick();
    const component = fixture.componentInstance;

    // Act
    component.toggleItem('1');

    // Assert
    expect(component.isExpanded('1')).toBe(true);
  });

  it('should collapse item when toggleItem is called on expanded item', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      imports: [Accordion],
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Accordion);
    TestBed.tick();
    const component = fixture.componentInstance;

    // Act
    component.toggleItem('1');
    component.toggleItem('1');

    // Assert
    expect(component.isExpanded('1')).toBe(false);
  });

  it('should collapse previous item when opening new item in single mode', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      imports: [Accordion],
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Accordion, {
      bindings: [inputBinding('allowMultiple', () => false)],
    });
    TestBed.tick();
    const component = fixture.componentInstance;

    // Act
    component.toggleItem('1');
    component.toggleItem('2');

    // Assert
    expect(component.isExpanded('1')).toBe(false);
    expect(component.isExpanded('2')).toBe(true);
  });

  it('should allow multiple items to be expanded when allowMultiple is true', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      imports: [Accordion],
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Accordion, {
      bindings: [inputBinding('allowMultiple', () => true)],
    });
    TestBed.tick();
    const component = fixture.componentInstance;

    // Act
    component.toggleItem('1');
    component.toggleItem('2');

    // Assert
    expect(component.isExpanded('1')).toBe(true);
    expect(component.isExpanded('2')).toBe(true);
  });

  it('should emit itemSelected event when item is toggled', () => {
    // Arrange
    const itemSelectedSignal = signal<string>('');
    const fixture = TestBed.configureTestingModule({
      imports: [Accordion],
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Accordion, {
      bindings: [outputBinding('itemSelected', (itemId: string) => itemSelectedSignal.set(itemId))],
    });
    TestBed.tick();
    const component = fixture.componentInstance;

    // Act
    component.toggleItem('1');
    TestBed.tick();

    // Assert
    expect(itemSelectedSignal()).toBe('1');
  });

  it('should collapse all items when Escape key is pressed', () => {
    // Arrange
    const fixture = TestBed.configureTestingModule({
      imports: [Accordion],
      providers: [provideZonelessChangeDetection()],
    }).createComponent(Accordion);
    TestBed.tick();
    const component = fixture.componentInstance;

    // Act
    component.toggleItem('1');
    component.toggleItem('2');
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    component.onKeyDown(event, '1');
    TestBed.tick();

    // Assert
    expect(component.isExpanded('1')).toBe(false);
    expect(component.isExpanded('2')).toBe(false);
  });

  describe('with content projection', () => {
    it('should render all projected accordion items', () => {
      // Arrange
      TestBed.configureTestingModule({
        imports: [TestWrapperComponent],
        providers: [provideZonelessChangeDetection()],
      });
      const wrapperFixture = TestBed.createComponent(TestWrapperComponent);
      TestBed.tick();

      // Assert
      const items = wrapperFixture.nativeElement.querySelectorAll('app-accordion-item');
      expect(items.length).toBe(3);
    });

    it('should render correct headers', () => {
      // Arrange
      TestBed.configureTestingModule({
        imports: [TestWrapperComponent],
        providers: [provideZonelessChangeDetection()],
      });
      const wrapperFixture = TestBed.createComponent(TestWrapperComponent);
      TestBed.tick();

      // Assert
      const headers = wrapperFixture.nativeElement.querySelectorAll('button span');
      expect(headers[0].textContent?.trim()).toBe('First Item');
      expect(headers[1].textContent?.trim()).toBe('Second Item');
      expect(headers[2].textContent?.trim()).toBe('Third Item');
    });

    it('should respect expanded input on initial render', () => {
      // Arrange
      TestBed.configureTestingModule({
        imports: [TestWrapperComponent],
        providers: [provideZonelessChangeDetection()],
      });
      const wrapperFixture = TestBed.createComponent(TestWrapperComponent);
      const wrapperComponent = wrapperFixture.componentInstance;
      TestBed.tick();

      // Act
      wrapperComponent.item1Expanded.set(true);
      TestBed.tick();

      // Assert
      const accordionDebugElement: DebugElement = wrapperFixture.debugElement.query(
        By.directive(Accordion),
      );
      const accordionComponent = accordionDebugElement.componentInstance;
      const contentItems = accordionComponent.getContentItems();
      expect(contentItems.length).toBe(3);

      const expanded = accordionComponent.expandedItems();
      expect(expanded.has('item1')).toBe(true);
    });

    it('should not toggle disabled items', () => {
      // Arrange
      TestBed.configureTestingModule({
        imports: [TestWrapperComponent],
        providers: [provideZonelessChangeDetection()],
      });
      const wrapperFixture = TestBed.createComponent(TestWrapperComponent);
      const wrapperComponent = wrapperFixture.componentInstance;
      TestBed.tick();

      // Act
      wrapperComponent.item1Disabled.set(true);
      TestBed.tick();

      const accordionDebugElement: DebugElement = wrapperFixture.debugElement.query(
        By.directive(Accordion),
      );
      const accordionComponent = accordionDebugElement.componentInstance;
      accordionComponent.toggleItem('item1');

      // Assert
      expect(accordionComponent.isExpanded('item1')).toBe(false);
    });

    it('should toggle enabled items', () => {
      // Arrange
      TestBed.configureTestingModule({
        imports: [TestWrapperComponent],
        providers: [provideZonelessChangeDetection()],
      });
      const wrapperFixture = TestBed.createComponent(TestWrapperComponent);
      TestBed.tick();

      // Act
      const accordionDebugElement: DebugElement = wrapperFixture.debugElement.query(
        By.directive(Accordion),
      );
      const accordionComponent = accordionDebugElement.componentInstance;
      accordionComponent.toggleItem('item1');

      // Assert
      expect(accordionComponent.isExpanded('item1')).toBe(true);
    });

    it('should handle single expansion mode with content projection', () => {
      // Arrange
      TestBed.configureTestingModule({
        imports: [TestWrapperComponent],
        providers: [provideZonelessChangeDetection()],
      });
      const wrapperFixture = TestBed.createComponent(TestWrapperComponent);
      const wrapperComponent = wrapperFixture.componentInstance;
      TestBed.tick();

      // Act
      wrapperComponent.allowMultiple.set(false);
      TestBed.tick();

      const accordionDebugElement: DebugElement = wrapperFixture.debugElement.query(
        By.directive(Accordion),
      );
      const accordionComponent = accordionDebugElement.componentInstance;
      accordionComponent.toggleItem('item1');
      accordionComponent.toggleItem('item2');

      // Assert
      expect(accordionComponent.isExpanded('item1')).toBe(false);
      expect(accordionComponent.isExpanded('item2')).toBe(true);
    });

    it('should handle multiple expansion mode with content projection', () => {
      // Arrange
      TestBed.configureTestingModule({
        imports: [TestWrapperComponent],
        providers: [provideZonelessChangeDetection()],
      });
      const wrapperFixture = TestBed.createComponent(TestWrapperComponent);
      const wrapperComponent = wrapperFixture.componentInstance;
      TestBed.tick();

      // Act
      wrapperComponent.allowMultiple.set(true);
      TestBed.tick();

      const accordionDebugElement: DebugElement = wrapperFixture.debugElement.query(
        By.directive(Accordion),
      );
      const accordionComponent = accordionDebugElement.componentInstance;
      accordionComponent.toggleItem('item1');
      accordionComponent.toggleItem('item2');

      // Assert
      expect(accordionComponent.isExpanded('item1')).toBe(true);
      expect(accordionComponent.isExpanded('item2')).toBe(true);
    });
  });
});
