import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-accordion-item-header',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class AccordionItemHeaderComponent {}
