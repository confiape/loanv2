import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-modal-body',
  standalone: true,
  template: `
    <div class="p-4 md:p-5 space-y-4">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalBody {}
