import {
  Component,
  input,
  output,
  signal,
  computed,
  HostListener,
  ElementRef,
  inject,
  HostAttributeToken,
} from '@angular/core';

const DATA_TESTID = new HostAttributeToken('data-testid');

export interface AppMenuItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
  action?: string;
}

@Component({
  selector: 'app-apps-menu',
  standalone: true,
  template: `
    <div class="relative inline-block">
      <!-- Apps Button -->
      <button
        type="button"
        class="p-2 text-text-secondary rounded-lg hover:text-text-primary hover:bg-bg-secondary focus:ring-4 focus:ring-border transition-colors"
        [attr.data-testid]="triggerTestId()"
        (click)="toggle()"
        aria-label="View apps"
        [attr.aria-expanded]="isOpen()"
        aria-haspopup="true"
      >
        <svg
          class="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          ></path>
        </svg>
      </button>

      <!-- Dropdown -->
      @if (isOpen()) {
        <div
          class="absolute right-0 top-full mt-2 z-50 w-64 bg-bg-primary border border-border rounded-xl shadow-lg overflow-hidden"
          role="menu"
          [attr.aria-label]="title()"
        >
          <div class="p-4 bg-bg-secondary border-b border-border">
            <span class="text-base font-medium text-text-primary">{{ title() }}</span>
          </div>
          <div class="p-3 grid grid-cols-3 gap-2">
            @for (app of apps(); track app.id; let idx = $index) {
              <a
                [href]="app.href || '#'"
                class="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-bg-secondary transition-colors group"
                [attr.data-testid]="getItemTestId(idx)"
                (click)="onAppClick(app, $event)"
                role="menuitem"
                [attr.aria-label]="app.label"
              >
                <div
                  class="w-7 h-7 mb-2 text-text-secondary group-hover:text-accent transition-colors"
                  [innerHTML]="app.icon"
                ></div>
                <div class="text-xs text-center text-text-primary font-medium">{{ app.label }}</div>
              </a>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class AppsMenuComponent {
  private readonly elementRef = inject(ElementRef);
  private readonly hostTestId = inject(DATA_TESTID, { optional: true });

  // Inputs
  apps = input<AppMenuItem[]>([]);
  title = input<string>('Apps');

  // Outputs
  appClick = output<AppMenuItem>();

  // State
  isOpen = signal(false);

  // Test IDs
  readonly triggerTestId = computed(() => (this.hostTestId ? `${this.hostTestId}-trigger` : null));

  protected getItemTestId(index: number): string | null {
    return this.hostTestId ? `${this.hostTestId}-item-${index}` : null;
  }

  // Click outside to close
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside && this.isOpen()) {
      this.close();
    }
  }

  // Keyboard navigation
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen()) {
      this.close();
    }
  }

  toggle(): void {
    this.isOpen.update((v) => !v);
  }

  close(): void {
    this.isOpen.set(false);
  }

  onAppClick(app: AppMenuItem, event: Event): void {
    event.preventDefault();
    this.appClick.emit(app);
    this.close();
  }
}
