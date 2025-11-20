import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { generateModalTestIds } from './modal-helpers';

@Component({
  selector: 'app-modal-body',
  standalone: true,
  template: `
    <div [attr.data-testid]="bodyTestId()" class="p-4 md:p-5 space-y-4">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalBody {
  readonly dataTestId = input<string | null>(null);
  private readonly testIds = generateModalTestIds(this.dataTestId); // Pass signal, not value

  readonly bodyTestId = this.testIds.body;
}
