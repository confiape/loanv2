import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import {
  DropdownCheckboxItem,
  DropdownLeafItem,
  DropdownSection,
  DropdownSubmenuItem,
} from './dropdown.types';
import { DropdownItemComponent } from './dropdown-item';

@Component({
  selector: 'app-dropdown-section',
  standalone: true,
  imports: [DropdownItemComponent],
  template: `
    @for (section of sections(); track section.id) {
      <div class="px-2 py-2">
        @if (section.title) {
          <p class="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-text-secondary">
            {{ section.title }}
          </p>
        }
        @if (section.description) {
          <p class="px-2 pb-2 text-xs text-text-secondary">
            {{ section.description }}
          </p>
        }

        <app-dropdown-item
          [items]="section.items"
          [path]="path()"
          [sectionId]="section.id"
          [panelWidth]="panelWidth()"
          [activePath]="activePath()"
          [checkboxStates]="checkboxStates()"
          (itemSelect)="itemSelect.emit($event)"
          (checkboxToggle)="checkboxToggle.emit($event)"
          (submenuEnter)="submenuEnter.emit($event)"
        />
      </div>

      @if (section.separatorAfter) {
        <div class="my-1 h-px bg-border"></div>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownSectionComponent {
  readonly sections = input.required<DropdownSection[]>();
  readonly path = input<string[]>([]);
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
}
