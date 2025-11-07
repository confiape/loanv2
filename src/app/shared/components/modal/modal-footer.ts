import { ChangeDetectionStrategy, Component, HostAttributeToken, inject } from '@angular/core';
import { generateModalTestIds } from './modal-helpers';

const DATA_TESTID = new HostAttributeToken('data-testid');

@Component({
  selector: 'app-modal-footer',
  standalone: true,
  template: `
    <div
      [attr.data-testid]="footerTestId()"
      class="flex items-center p-4 md:p-5 border-t border-border rounded-b"
    >
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalFooter {
  private readonly hostTestId = inject(DATA_TESTID, { optional: true });
  private readonly testIds = generateModalTestIds(this.hostTestId);

  readonly footerTestId = this.testIds.footer;
}
