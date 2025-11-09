import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dropdown-basic-footer',
  standalone: true,
  template: `
    <div class="border-t border-border bg-bg-secondary px-4 py-3">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownBasicFooter {}

