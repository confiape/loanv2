import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  HostListener,
} from '@angular/core';
import { DropdownBasic } from './dropdown-basic';

@Component({
  selector: 'app-dropdown-basic-item',
  standalone: true,
  template: `
    <button
      type="button"
      class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-text-primary hover:bg-bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
      [class.opacity-50]="disabled()"
      [class.cursor-not-allowed]="disabled()"
      [disabled]="disabled()"
    >
      <ng-content />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownBasicItem {
  private readonly dropdown = inject(DropdownBasic, { optional: true });

  readonly disabled = input<boolean>(false);
  readonly value = input<any>();

  readonly itemClick = output<any>();

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.disabled()) {
      return;
    }

    event.stopPropagation();

    const emitValue = this.value() ?? null;
    this.itemClick.emit(emitValue);

    // Notify parent dropdown
    if (this.dropdown) {
      this.dropdown.notifyItemClick(emitValue);
    }
  }
}
