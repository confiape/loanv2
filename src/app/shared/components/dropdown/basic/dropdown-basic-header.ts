import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dropdown-basic-header',
  standalone: true,
  template: `
    <div class="px-4 py-3 border-b border-border">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownBasicHeader {}
