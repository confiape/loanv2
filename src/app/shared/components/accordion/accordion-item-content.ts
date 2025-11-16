import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { AccordionItemComponent } from './accordion-item';

@Component({
  selector: 'app-accordion-item-content',
  standalone: true,
  template: `
    <div
      class="p-5 border border-b-0 border-border text-text-secondary"
      [attr.data-testid]="contentTestId()"
    >
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class AccordionItemContentComponent {
  private readonly accordionItem = inject(AccordionItemComponent, { optional: true });

  readonly contentTestId = computed(() => {
    const item = this.accordionItem;
    if (!item) return null;
    const bodyTestId = item.bodyTestId();
    return bodyTestId ? `${bodyTestId}-content` : null;
  });
}
