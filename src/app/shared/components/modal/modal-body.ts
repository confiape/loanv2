import { ChangeDetectionStrategy, Component, HostAttributeToken, inject } from '@angular/core';
import { generateModalTestIds } from './modal-helpers';

const DATA_TESTID = new HostAttributeToken('data-testid');

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
