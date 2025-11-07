import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  HostAttributeToken,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';

type DropdownPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
type DropdownOpenStrategy = 'click' | 'hover';

const DATA_TESTID = new HostAttributeToken('data-testid');

@Component({
  selector: 'app-dropdown-basic',
  standalone: true,
  imports: [OverlayModule],
  template: `
    <div
      class="inline-flex"
      (mouseenter)="handleMouseEnter()"
      (mouseleave)="handleMouseLeave()"
    >
      <!-- Trigger button -->
      <button
        #overlayOrigin="cdkOverlayOrigin"
        cdkOverlayOrigin
        type="button"
        [attr.data-testid]="triggerTestId()"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-haspopup]="true"
        [class]="triggerClasses()"
        (click)="onTriggerClick($event)"
        (keydown)="onTriggerKeydown($event)"
      >
        <ng-content select="[trigger]" />
      </button>

      <!-- Overlay panel -->
      <ng-template
        cdkConnectedOverlay
        [cdkConnectedOverlayOrigin]="overlayOrigin"
        [cdkConnectedOverlayOpen]="isOpen()"
        [cdkConnectedOverlayPositions]="overlayPositions()"
        [cdkConnectedOverlayHasBackdrop]="openStrategy() === 'click'"
        [cdkConnectedOverlayBackdropClass]="'cdk-overlay-transparent-backdrop'"
        (overlayOutsideClick)="onOverlayOutsideClick($event)"
        (backdropClick)="close()"
        (detach)="close()"
      >
        <div
          class="rounded-lg border border-border bg-bg-primary shadow-lg"
          [attr.data-testid]="panelTestId()"
          [style.min-width.px]="minPanelWidth()"
          (mouseenter)="onPanelMouseEnter()"
          (mouseleave)="onPanelMouseLeave()"
        >
          <ng-content />
        </div>
      </ng-template>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-flex',
    '[attr.data-testid]': 'componentTestId()',
  },
})
export class DropdownBasic {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly hostTestId = inject(DATA_TESTID, { optional: true });

  // Inputs
  readonly triggerConfig = input<{
    variant?: 'solid' | 'soft' | 'ghost';
    size?: 'sm' | 'md';
  }>({ variant: 'solid' as const, size: 'md' as const });
  readonly placement = input<DropdownPlacement>('bottom-end');
  readonly openStrategy = input<DropdownOpenStrategy>('click');
  readonly closeOnSelect = input<boolean>(true);
  readonly minPanelWidth = input<number>(176);

  // Outputs
  readonly openChange = output<boolean>();
  readonly itemClick = output<any>();

  // State
  readonly isOpen = signal(false);
  readonly panelHovering = signal(false);
  readonly triggerHovering = signal(false);
  private hoverCloseTimeout: ReturnType<typeof setTimeout> | null = null;

  // Computed
  readonly componentTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-dropdown-basic` : null
  );

  readonly triggerTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-trigger` : null
  );

  readonly panelTestId = computed(() =>
    this.hostTestId ? `${this.hostTestId}-panel` : null
  );

  readonly triggerClasses = computed(() => {
    const config = this.triggerConfig();
    const base =
      'inline-flex items-center justify-center gap-2 rounded-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';
    const size = config.size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-sm';

    let variant = '';
    switch (config.variant) {
      case 'soft':
        variant = 'bg-bg-secondary text-text-primary hover:bg-bg-surface';
        break;
      case 'ghost':
        variant = 'bg-transparent text-text-primary hover:bg-bg-secondary';
        break;
      default:
        variant = 'bg-accent text-white hover:bg-accent-hover';
        break;
    }

    return [base, size, variant].filter(Boolean).join(' ');
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

  handleMouseEnter() {
    if (this.openStrategy() !== 'hover') {
      return;
    }
    this.triggerHovering.set(true);
    this.clearHoverCloseTimeout();
    this.open();
  }

  handleMouseLeave() {
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

  notifyItemClick(data: any) {
    this.itemClick.emit(data);
    if (this.closeOnSelect()) {
      this.close();
    }
  }

  // Internal helpers
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
    }, 80);
  }

  private clearHoverCloseTimeout() {
    if (this.hoverCloseTimeout) {
      clearTimeout(this.hoverCloseTimeout);
      this.hoverCloseTimeout = null;
    }
  }
}
