import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DropdownSearchConfig } from './dropdown.types';
import { DropdownIcon } from './dropdown-icon';

@Component({
  selector: 'app-dropdown-search',
  standalone: true,
  imports: [DropdownIcon],
  template: `
    @if (config()) {
      <div class="border-b border-border px-4 py-3">
        <label class="sr-only">{{ config()?.ariaLabel || config()?.placeholder }}</label>
        <div class="relative">
          <span
            class="pointer-events-none absolute inset-y-0 start-3 flex items-center text-text-secondary"
          >
            <app-dropdown-icon [name]="'search'" [classes]="'text-text-secondary'" />
          </span>
          <input
            type="text"
            class="w-full rounded-md border border-border bg-bg-secondary py-2 ps-9 pe-3 text-sm text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
            [placeholder]="config()?.placeholder"
            [value]="searchTerm()"
            (input)="onInput($event)"
          />
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownSearchComponent {
  readonly config = input<DropdownSearchConfig | null>(null);
  readonly searchTerm = input<string>('');
  readonly debounceDelay = input<number>(300);

  readonly searchChange = output<string>();

  private debounceTimeout: ReturnType<typeof setTimeout> | null = null;

  onInput(event: Event): void {
    const term = (event.target as HTMLInputElement).value;

    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    this.debounceTimeout = setTimeout(() => {
      this.searchChange.emit(term);
      this.debounceTimeout = null;
    }, this.debounceDelay());
  }
}
