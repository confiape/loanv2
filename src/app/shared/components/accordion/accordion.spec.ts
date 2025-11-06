import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Accordion, AccordionItem } from './accordion';

describe('Accordion', () => {
  let component: Accordion;
  let fixture: ComponentFixture<Accordion>;

  const mockItems: AccordionItem[] = [
    { id: '1', title: 'Item 1', content: 'Content 1' },
    { id: '2', title: 'Item 2', content: 'Content 2' },
    { id: '3', title: 'Item 3', content: 'Content 3' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Accordion]
    }).compileComponents();

    fixture = TestBed.createComponent(Accordion);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
    component.toggleItem('1');
    component.toggleItem('2');
    expect(component.isExpanded('1')).toBe(false);
    expect(component.isExpanded('2')).toBe(true);
  });


  it('should emit itemSelected event when item is toggled', (done) => {
    component.itemSelected.subscribe((itemId: string) => {
      expect(itemId).toBe('1');
      done();
    });

    component.toggleItem('1');
  });

  it('should render all items from input', () => {
    TestBed.runInInjectionContext(() => {
      fixture = TestBed.createComponent(Accordion);
      component = fixture.componentInstance;
    });

    fixture.componentRef.setInput('items', mockItems);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(3);
  });
});
