import { ChangeDetectionStrategy, Component } from '@angular/core';

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
