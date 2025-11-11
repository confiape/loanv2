import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import {
  DropdownCheckboxItem,
  DropdownItem,
  DropdownLeafItem,
  DropdownSubmenuItem,
} from './dropdown.types';
import { DropdownIcon } from './dropdown-icon';

@Component({
  selector: 'app-dropdown-item',
  standalone: true,
  imports: [DropdownIcon],
  template: `
    <ul class="flex flex-col gap-0.5">
      @for (item of items(); track item.id) {
        @switch (item.type) {
          @case ('divider') {
            <li>
              <div class="mx-2 my-1 h-px bg-border" [class.my-0]="item.spacing === 'compact'"></div>
            </li>
          }
          @case ('submenu') {
            @let currentPath = buildPath(item.id);
            <li
              class="relative"
              (mouseenter)="submenuEnter.emit(currentPath)"
              (focusin)="submenuEnter.emit(currentPath)"
            >
              <button
                type="button"
                class="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-text-primary hover:bg-bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                (click)="itemSelect.emit({ item, path: currentPath, event: $event })"
              >
                <span class="flex items-center gap-2">
                  {{ item.label }}
                </span>
                <app-dropdown-icon [name]="'chevron-right'" [classes]="'text-text-secondary'" />
              </button>

              @if (isPathActive(currentPath)) {
                <div class="absolute start-full top-0 z-30 ms-2" [style.width.px]="panelWidth()">
                  <div class="rounded-lg border border-border bg-bg-primary shadow-lg">
                    <app-dropdown-item
                      [items]="item.children"
                      [path]="currentPath"
                      [sectionId]="sectionId()"
                      [panelWidth]="panelWidth()"
                      [activePath]="activePath()"
                      [checkboxStates]="checkboxStates()"
                      (itemSelect)="itemSelect.emit($event)"
                      (checkboxToggle)="checkboxToggle.emit($event)"
                      (submenuEnter)="submenuEnter.emit($event)"
                    />
                  </div>
                </div>
              }
            </li>
          }
          @case ('checkbox') {
            @let currentPath = buildPath(item.id);
            <li>
              <label
                class="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-text-primary hover:bg-bg-secondary"
              >
                <input
                  type="checkbox"
                  class="h-4 w-4 rounded border-border text-accent focus:ring-2 focus:ring-accent"
                  [checked]="isCheckboxChecked(item)"
                  (change)="checkboxToggle.emit({ item, path: currentPath, event: $event })"
                  [disabled]="item.disabled"
                />
                <span class="flex-1">
                  <span>{{ item.label }}</span>
                  @if (item.description) {
                    <span class="block text-xs text-text-secondary">{{ item.description }}</span>
                  }
                </span>
                @if (item.meta) {
                  <span class="text-xs text-text-secondary">{{ item.meta }}</span>
                }
              </label>
            </li>
          }
          @case ('user') {
            @let currentPath = buildPath(item.id);
            <li>
              <button
                type="button"
                class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-text-primary hover:bg-bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                (click)="itemSelect.emit({ item, path: currentPath, event: $event })"
              >
                <img
                  class="h-6 w-6 rounded-full object-cover"
                  [src]="item.avatar.imageUrl"
                  [alt]="item.avatar.name"
                />
                <span class="flex-1 text-start">{{ item.label }}</span>
                @if (item.meta) {
                  <span class="text-xs text-text-secondary">{{ item.meta }}</span>
                }
              </button>
            </li>
          }
          @default {
            @let currentPath = buildPath(item.id);
            <li>
              <button
                type="button"
                class="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-text-primary hover:bg-bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                [class.opacity-50]="item.disabled"
                [class.cursor-not-allowed]="item.disabled"
                (click)="itemSelect.emit({ item, path: currentPath, event: $event })"
                [disabled]="item.disabled"
              >
                <span class="flex items-center gap-2">
                  {{ item.label }}
                  @if (item.description) {
                    <span class="block text-xs text-text-secondary">{{ item.description }}</span>
                  }
                </span>
                @if (item.meta) {
                  <span class="text-xs text-text-secondary">{{ item.meta }}</span>
                }
              </button>
            </li>
          }
        }
      }
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownItemComponent {
  readonly items = input.required<DropdownItem[]>();
  readonly path = input<string[]>([]);
  readonly sectionId = input.required<string>();
  readonly panelWidth = input<number | null>(176);
  readonly activePath = input<string[]>([]);
  readonly checkboxStates = input<Record<string, boolean>>({});

  readonly itemSelect = output<{
    item: DropdownLeafItem | DropdownSubmenuItem;
    path: string[];
    event: Event;
  }>();
  readonly checkboxToggle = output<{
    item: DropdownCheckboxItem;
    path: string[];
    event: Event;
  }>();
  readonly submenuEnter = output<string[]>();

  buildPath(id: string): string[] {
    return [...this.path(), this.sectionId(), id];
  }

  isPathActive(path: string[]): boolean {
    const active = this.activePath();
    return path.every((segment, index) => active[index] === segment);
  }

  isCheckboxChecked(item: DropdownCheckboxItem): boolean {
    const states = this.checkboxStates();
    if (states[item.id] !== undefined) {
      return states[item.id];
    }
    return item.checked ?? false;
  }
}
