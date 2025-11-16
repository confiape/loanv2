import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
  private readonly dataTestId = input<string | null>(null);
  private readonly testIds = generateModalTestIds(this.dataTestId());

  readonly footerTestId = this.testIds.footer;
}
