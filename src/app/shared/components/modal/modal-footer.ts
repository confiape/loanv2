import { ChangeDetectionStrategy, Component, HostAttributeToken, inject } from '@angular/core';
import { generateModalTestIds } from './modal-helpers';

const DATA_TESTID = new HostAttributeToken('data-testid');

@Component({
  selector: 'app-modal-footer',
  standalone: true,
  template: `
    <div
      class="flex items-center p-4 md:p-5 border-t border-border rounded-b"
    >
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalFooter {}
