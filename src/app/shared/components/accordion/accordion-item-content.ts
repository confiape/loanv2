import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-accordion-item-content',
  standalone: true,
  template: `
    <div class="p-5 border border-b-0 border-border text-text-secondary">
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block'
  }
})
export class AccordionItemContentComponent {}
