import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import {
  DropdownCheckboxItem,
  DropdownFooterAction,
  DropdownHeader,
  DropdownLeafItem,
  DropdownSearchConfig,
  DropdownSection,
  DropdownSubmenuItem,
} from './dropdown.types';
import { DropdownHeaderComponent } from './dropdown-header';
import { DropdownSearchComponent } from './dropdown-search';
import { DropdownSectionComponent } from './dropdown-section';
import { DropdownFooterComponent } from './dropdown-footer';

@Component({
  selector: 'app-dropdown-panel',
  standalone: true,
  imports: [
    DropdownHeaderComponent,
    DropdownSearchComponent,
    DropdownSectionComponent,
    DropdownFooterComponent,
  ],
  template: `
    <div
      class="rounded-lg border border-border bg-bg-primary shadow-lg"
      [style.width.px]="panelWidth()"
      [style.maxHeight.px]="panelMaxHeight()"
      [attr.data-testid]="testId()"
      [class.overflow-y-auto]="shouldScroll()"
      (mouseenter)="panelMouseEnter.emit()"
      (mouseleave)="panelMouseLeave.emit()"
    >
      <!-- Header -->
      <app-dropdown-header [header]="header()" />

      <!-- Search -->
      <app-dropdown-search
        [config]="searchConfig()"
        [searchTerm]="searchTerm()"
        [debounceDelay]="searchDebounceDelay()"
        (searchChange)="searchChange.emit($event)"
      />

      <!-- Sections -->
      <div [class.max-h-full]="!panelMaxHeight()">
        <app-dropdown-section
          [sections]="visibleSections()"
          [path]="[]"
          [panelWidth]="panelWidth()"
          [activePath]="activePath()"
          [checkboxStates]="checkboxStates()"
          (itemSelect)="itemSelect.emit($event)"
          (checkboxToggle)="checkboxToggle.emit($event)"
          (submenuEnter)="submenuEnter.emit($event)"
        />
      </div>

      <!-- Footer -->
      <app-dropdown-footer [action]="footerAction()" (footerClick)="footerClick.emit($event)" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownPanelComponent {
  readonly header = input<DropdownHeader | null>(null);
  readonly searchConfig = input<DropdownSearchConfig | null>(null);
  readonly searchTerm = input<string>('');
  readonly searchDebounceDelay = input<number>(300);
  readonly sections = input.required<DropdownSection[]>();
  readonly visibleSections = input.required<DropdownSection[]>();
  readonly footerAction = input<DropdownFooterAction | null>(null);
  readonly panelWidth = input<number | null>(176);
  readonly panelMaxHeight = input<number | null>(null);
  readonly testId = input<string | null>(null);
  readonly activePath = input<string[]>([]);
  readonly checkboxStates = input<Record<string, boolean>>({});

  readonly searchChange = output<string>();
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
  readonly panelMouseEnter = output<void>();
  readonly panelMouseLeave = output<void>();
  readonly footerClick = output<MouseEvent>();

  readonly shouldScroll = computed(() => {
    return !!this.panelMaxHeight();
  });
}
