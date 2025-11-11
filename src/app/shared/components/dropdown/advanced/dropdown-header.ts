import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DropdownHeader } from './dropdown.types';

@Component({
  selector: 'app-dropdown-header',
  standalone: true,
  template: `
    @if (header()) {
      <div class="px-4 py-3 border-b border-border">
        <div class="flex items-center gap-3">
          @if (header()?.avatar?.imageUrl) {
            <img
              class="h-8 w-8 rounded-full object-cover"
              [src]="header()?.avatar?.imageUrl"
              [alt]="header()?.avatar?.name"
            />
          } @else if (header()?.avatar?.initials) {
            <div
              class="h-8 w-8 rounded-full bg-bg-secondary flex items-center justify-center text-sm font-medium text-text-primary"
            >
              {{ header()?.avatar?.initials }}
            </div>
          }
          <div class="min-w-0">
            <p class="text-sm font-medium text-text-primary leading-tight">
              {{ header()?.title }}
            </p>
            @if (header()?.subtitle) {
              <p class="text-xs text-text-secondary leading-tight">
                {{ header()?.subtitle }}
              </p>
            }
            @if (header()?.helperText) {
              <p class="mt-1 text-xs text-text-secondary leading-tight">
                {{ header()?.helperText }}
              </p>
            }
          </div>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownHeaderComponent {
  readonly header = input<DropdownHeader | null>(null);
}
