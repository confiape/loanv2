import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  HostAttributeToken,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import {
  DropdownCheckboxChangeEvent,
  DropdownCheckboxItem,
  DropdownFooterAction,
  DropdownHeader,
  DropdownItem,
  DropdownLeafItem,
  DropdownOpenStrategy,
  DropdownPanelPlacement,
  DropdownSearchConfig,
  DropdownSection,
  DropdownSelectEvent,
  DropdownSubmenuItem,
  DropdownTriggerConfig,
} from './dropdown.types';
import { DropdownTriggerComponent } from './dropdown-trigger';
import { DropdownPanelComponent } from './dropdown-panel';

const DATA_TESTID = new HostAttributeToken('data-testid');

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [OverlayModule, DropdownTriggerComponent, DropdownPanelComponent],
  templateUrl: './dropdown.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-flex',
    '[attr.data-testid]': 'componentTestId()',
  },
})
export class Dropdown {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly hostTestId = inject(DATA_TESTID, { optional: true });

  // Inputs
  readonly trigger = input<DropdownTriggerConfig>({
    label: 'Dropdown',
    trailingIcon: 'chevron-down',
    variant: 'solid',
    size: 'md',
    shape: 'rounded',
  });
  readonly sections = input<DropdownSection[]>([]);
  readonly header = input<DropdownHeader | null>(null);
  readonly footerAction = input<DropdownFooterAction | null>(null);
  readonly search = input<DropdownSearchConfig | null>(null);
  readonly openStrategy = input<DropdownOpenStrategy>('click');
  readonly placement = input<DropdownPanelPlacement>('bottom-end');
  readonly panelWidth = input<number | null>(176);
  readonly panelMaxHeight = input<number | null>(null);
  readonly closeOnSelect = input<boolean>(true);
  readonly hoverCloseDelay = input<number>(80);
  readonly searchDebounceDelay = input<number>(300);

  // Outputs
  readonly openChange = output<boolean>();
  readonly selectChange = output<DropdownSelectEvent>();
  readonly checkboxChange = output<DropdownCheckboxChangeEvent>();
  readonly searchTermChange = output<string>();

  // State
  readonly isOpen = signal(false);
  readonly activePath = signal<string[]>([]);
  readonly searchTerm = signal('');
  readonly panelHovering = signal(false);
  readonly triggerHovering = signal(false);
  private readonly userCheckboxState = signal<Record<string, boolean>>({});
  private hoverCloseTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      if (!this.isOpen()) {
        this.activePath.set([]);
        this.searchTerm.set('');
      }
    });
  }

  // Computed checkbox state from sections
  readonly checkboxState = computed(() => {
    const list = this.sections();
    const userState = this.userCheckboxState();
    const initialState: Record<string, boolean> = {};

    const collect = (items: DropdownItem[]) => {
      for (const item of items) {
        if (item.type === 'checkbox') {
          initialState[item.id] = userState[item.id] ?? item.checked ?? false;
        } else if (item.type === 'submenu') {
          collect(item.children);
        }
      }
    };

    for (const section of list) {
      collect(section.items);
    }

    return initialState;
  });

  // Computed
  readonly searchConfig = computed(() => this.search());

  readonly componentTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-dropdown` : null,
  );

  readonly triggerTestId = computed(() => (this.hostTestId ? `${this.hostTestId}-trigger` : null));

  readonly panelTestId = computed(() => (this.hostTestId ? `${this.hostTestId}-panel` : null));

  readonly visibleSections = computed(() => {
    const sections = this.sections();
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return sections;
    }

    const filtered: DropdownSection[] = [];
    for (const section of sections) {
      const items = this.filterItemsByTerm(section.items, term);
      if (items.length > 0) {
        filtered.push({
          ...section,
          items,
        });
      }
    }
    return filtered;
  });

  readonly overlayPositions = computed<ConnectedPosition[]>(() => {
    const placement = this.placement();
    const isTop = placement.startsWith('top');
    const isEnd = placement.endsWith('end');
    const verticalOffset = isTop ? -8 : 8;

    const primary: ConnectedPosition = {
      originX: isEnd ? 'end' : 'start',
      originY: isTop ? 'top' : 'bottom',
      overlayX: isEnd ? 'end' : 'start',
      overlayY: isTop ? 'bottom' : 'top',
      offsetY: verticalOffset,
    };

    const horizontalFlip: ConnectedPosition = {
      originX: isEnd ? 'start' : 'end',
      originY: isTop ? 'top' : 'bottom',
      overlayX: isEnd ? 'start' : 'end',
      overlayY: isTop ? 'bottom' : 'top',
      offsetY: verticalOffset,
    };

    const verticalFlip: ConnectedPosition = {
      originX: isEnd ? 'end' : 'start',
      originY: isTop ? 'bottom' : 'top',
      overlayX: isEnd ? 'end' : 'start',
      overlayY: isTop ? 'top' : 'bottom',
      offsetY: -verticalOffset,
    };

    return [primary, horizontalFlip, verticalFlip];
  });

  // Host listeners
  @HostListener('document:keydown.escape')
  handleEscape() {
    if (this.isOpen()) {
      this.close();
    }
  }

  // Events
  onTriggerClick(event: MouseEvent) {
    if (this.openStrategy() === 'hover') {
      return;
    }
    event.stopPropagation();
    this.toggle();
  }

  handleHostMouseEnter() {
    if (this.openStrategy() !== 'hover') {
      return;
    }
    this.triggerHovering.set(true);
    this.clearHoverCloseTimeout();
    this.open();
  }

  handleHostMouseLeave() {
    if (this.openStrategy() !== 'hover') {
      return;
    }
    this.triggerHovering.set(false);
    this.scheduleHoverClose();
  }

  onTriggerKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggle();
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!this.isOpen()) {
        this.open();
      }
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.isOpen()) {
        this.close();
      }
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      // Could be enhanced to focus first/last item
    }
  }

  onPanelMouseEnter() {
    this.panelHovering.set(true);
    this.clearHoverCloseTimeout();
  }

  onPanelMouseLeave() {
    this.panelHovering.set(false);
    this.scheduleHoverClose();
  }

  onOverlayOutsideClick(_event: MouseEvent) {
    this.close();
  }

  openSubmenu(path: string[]) {
    this.activePath.set(path);
  }

  onItemSelect(event: {
    item: DropdownLeafItem | DropdownSubmenuItem;
    path: string[];
    event: Event;
  }) {
    event.event.stopPropagation();
    if (event.item.type === 'submenu') {
      this.activePath.set(event.path);
      return;
    }
    this.selectChange.emit({ item: event.item, path: event.path });
    if (this.closeOnSelect() && event.item.type !== 'checkbox') {
      this.close();
    }
  }

  onCheckboxToggle(event: { item: DropdownCheckboxItem; path: string[]; event: Event }) {
    event.event.stopPropagation();
    const input = event.event.target as HTMLInputElement;
    this.userCheckboxState.update((state) => ({
      ...state,
      [event.item.id]: input.checked,
    }));
    this.checkboxChange.emit({
      item: event.item,
      path: event.path,
      checked: input.checked,
    });
  }

  onFooterClick(_event: MouseEvent) {
    this.close();
  }

  onSearch(term: string) {
    this.searchTerm.set(term);
    this.searchTermChange.emit(term);
  }

  // Internal helpers
  private filterItemsByTerm(items: DropdownItem[], term: string): DropdownItem[] {
    const filtered: DropdownItem[] = [];

    for (const item of items) {
      if (item.type === 'divider') {
        continue;
      }

      if (item.type === 'submenu') {
        const children = this.filterItemsByTerm(item.children, term);
        if (children.length > 0) {
          filtered.push({
            ...item,
            children,
          });
        }
        continue;
      }

      const matches =
        item.label.toLowerCase().includes(term) ||
        (item.description ? item.description.toLowerCase().includes(term) : false) ||
        (item.meta ? item.meta.toLowerCase().includes(term) : false);

      if (matches) {
        filtered.push(item);
      }
    }

    return filtered;
  }

  private open() {
    if (this.isOpen()) {
      return;
    }
    this.clearHoverCloseTimeout();
    this.isOpen.set(true);
    this.openChange.emit(true);
  }

  close() {
    if (!this.isOpen()) {
      return;
    }
    this.clearHoverCloseTimeout();
    this.panelHovering.set(false);
    this.triggerHovering.set(false);
    this.isOpen.set(false);
    this.openChange.emit(false);
  }

  private toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  private scheduleHoverClose() {
    if (this.openStrategy() !== 'hover') {
      return;
    }
    this.clearHoverCloseTimeout();
    this.hoverCloseTimeout = setTimeout(() => {
      if (!this.triggerHovering() && !this.panelHovering()) {
        this.close();
      }
    }, this.hoverCloseDelay());
  }

  private clearHoverCloseTimeout() {
    if (this.hoverCloseTimeout) {
      clearTimeout(this.hoverCloseTimeout);
      this.hoverCloseTimeout = null;
    }
  }
}
