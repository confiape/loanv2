import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  HostAttributeToken,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DropdownCheckboxChangeEvent,
  DropdownCheckboxItem,
  DropdownFooterAction,
  DropdownHeader,
  DropdownIconName,
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

const DATA_TESTID = new HostAttributeToken('data-testid');

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-flex',
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
  private readonly checkboxState = signal<Record<string, boolean>>({});

  constructor() {
    effect(() => {
      const list = this.sections();
      const initialState: Record<string, boolean> = {};

      const collect = (items: DropdownItem[]) => {
        for (const item of items) {
          if (item.type === 'checkbox') {
            initialState[item.id] = item.checked ?? false;
          } else if (item.type === 'submenu') {
            collect(item.children);
          }
        }
      };

      for (const section of list) {
        collect(section.items);
      }

      this.checkboxState.set(initialState);
    });

    effect(() => {
      if (!this.isOpen()) {
        this.activePath.set([]);
        this.searchTerm.set('');
      }
    });
  }

  // Computed
  readonly searchConfig = computed(() => this.search());

  readonly triggerTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-trigger` : null
  );

  readonly panelTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-panel` : null
  );

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

  readonly shouldScroll = computed(() => {
    if (this.panelMaxHeight()) {
      return true;
    }
    return false;
  });

  // Host listeners
  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: Event) {
    if (!this.isOpen()) {
      return;
    }
    if (this.host.nativeElement.contains(event.target as Node)) {
      return;
    }
    this.close();
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    if (this.isOpen()) {
      this.close();
    }
  }

  // Template helpers
  panelWidthPx(): number | null {
    return this.panelWidth();
  }

  panelMaxHeightPx(): number | null {
    return this.panelMaxHeight();
  }

  fallbackTrailingIcon(): DropdownIconName | null {
    if (this.trigger().variant === 'icon') {
      return null;
    }
    return 'chevron-down';
  }

  triggerClasses(): string {
    const trigger = this.trigger();
    const base =
      'inline-flex items-center justify-center gap-2 rounded-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';
    const size = trigger.size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-sm';

    const shape =
      trigger.shape === 'pill'
        ? 'rounded-full'
        : trigger.shape === 'circle'
          ? 'rounded-full px-0'
          : 'rounded-md';

    let variant = '';
    switch (trigger.variant) {
      case 'soft':
        variant =
          'bg-bg-secondary text-text-primary hover:bg-bg-surface';
        break;
      case 'ghost':
        variant =
          'bg-transparent text-text-primary hover:bg-bg-secondary';
        break;
      case 'icon':
        variant =
          'h-10 w-10 rounded-full bg-bg-secondary text-text-primary hover:bg-bg-surface';
        break;
      default:
        variant =
          'bg-accent text-white hover:bg-accent-hover';
        break;
    }

    const width = trigger.fullWidth ? 'w-full' : '';

    return [base, size, shape, variant, width].filter(Boolean).join(' ');
  }

  triggerIconClass(): string {
    const variant = this.trigger().variant ?? 'solid';
    if (variant === 'solid') {
      return 'text-white';
    }
    if (variant === 'soft' || variant === 'icon' || variant === 'ghost') {
      return 'text-text-primary';
    }
    return 'text-text-secondary';
  }

  footerIconClass(action: DropdownFooterAction): string {
    if (action.intent === 'accent') {
      return 'text-accent';
    }
    if (action.intent === 'danger') {
      return 'text-error';
    }
    return 'text-text-primary';
  }

  isPlacementEndAligned(): boolean {
    return this.placement() === 'bottom-end' || this.placement() === 'top-end';
  }

  isPlacementTop(): boolean {
    return this.placement() === 'top-start' || this.placement() === 'top-end';
  }

  buildPath(path: string[], sectionId: string, id: string): string[] {
    return [...path, sectionId, id];
  }

  isPathActive(path: string[]): boolean {
    const active = this.activePath();
    return path.every((segment, index) => active[index] === segment);
  }

  isCheckboxChecked(item: DropdownCheckboxItem): boolean {
    const state = this.checkboxState();
    if (state[item.id] !== undefined) {
      return state[item.id];
    }
    return item.checked ?? false;
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
    if (this.openStrategy() === 'hover') {
      this.open();
    }
  }

  handleHostMouseLeave() {
    if (this.openStrategy() === 'hover' && !this.panelHovering()) {
      this.close();
    }
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
  }

  openSubmenu(path: string[]) {
    this.activePath.set(path);
  }

  onItemSelect(item: DropdownLeafItem | DropdownSubmenuItem, path: string[], event: Event) {
    event.stopPropagation();
    if (item.type === 'submenu') {
      this.activePath.set(path);
      return;
    }
    this.selectChange.emit({ item, path });
    if (this.closeOnSelect() && item.type !== 'checkbox') {
      this.close();
    }
  }

  onCheckboxToggle(item: DropdownCheckboxItem, path: string[], event: Event) {
    event.stopPropagation();
    const input = event.target as HTMLInputElement;
    this.checkboxState.update((state) => ({
      ...state,
      [item.id]: input.checked,
    }));
    this.checkboxChange.emit({
      item,
      path,
      checked: input.checked,
    });
  }

  onFooterClick(event: MouseEvent, action: DropdownFooterAction) {
    if (!action.href) {
      event.preventDefault();
      this.close();
    }
  }

  onSearch(event: Event) {
    const term = (event.target as HTMLInputElement).value;
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
    this.isOpen.set(true);
    this.openChange.emit(true);
  }

  private close() {
    if (!this.isOpen()) {
      return;
    }
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
}
