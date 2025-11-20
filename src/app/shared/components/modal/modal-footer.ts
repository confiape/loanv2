import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { generateModalTestIds } from './modal-helpers';

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
  readonly dataTestId = input<string | null>(null);
  private readonly testIds = generateModalTestIds(this.dataTestId); // Pass signal, not value

  readonly footerTestId = this.testIds.footer;
}
