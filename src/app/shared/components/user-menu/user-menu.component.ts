import { Component, input, output, signal, HostListener, ElementRef, inject } from '@angular/core';

export interface UserMenuItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  action?: string;
  divider?: boolean;
}

@Component({
  selector: 'app-user-menu',
  standalone: true,
  template: `
    <div class="relative inline-block">
      <!-- User Button -->
      <button
        type="button"
        class="flex mx-3 text-sm bg-accent rounded-full md:mr-0 focus:ring-4 focus:ring-border"
        (click)="toggle()"
        aria-label="Open user menu"
        [attr.aria-expanded]="isOpen()"
        aria-haspopup="true"
      >
        @if (userAvatar()) {
          <img [src]="userAvatar()" [alt]="userName()" class="w-8 h-8 rounded-full" />
        } @else {
          <div class="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-semibold text-sm">
            {{ getUserInitials() }}
          </div>
        }
      </button>

      <!-- Dropdown -->
      @if (isOpen()) {
        <div
          class="absolute right-0 top-full mt-2 z-50 w-56 bg-bg-primary border border-border rounded-xl shadow-lg overflow-hidden"
          role="menu"
          aria-label="User menu"
        >
          <!-- User Info -->
          <div class="p-4 bg-bg-secondary border-b border-border">
            <span class="block text-sm font-semibold text-text-primary">{{ userName() }}</span>
            @if (userEmail()) {
              <span class="block text-xs text-text-secondary truncate">{{ userEmail() }}</span>
            }
          </div>

          <!-- Menu Items -->
          <div class="py-2">
            @for (item of menuItems(); track item.id) {
              @if (item.divider) {
                <div class="h-px bg-border my-2" role="separator"></div>
              } @else {
                <a
                  [href]="item.href || '#'"
                  class="flex items-center gap-3 px-4 py-2 text-sm text-text-primary hover:bg-bg-secondary transition-colors"
                  (click)="onMenuItemClick(item, $event)"
                  role="menuitem"
                >
                  @if (item.icon) {
                    <span class="w-5 h-5 text-text-secondary" [innerHTML]="item.icon"></span>
                  }
                  <span>{{ item.label }}</span>
                </a>
              }
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class UserMenuComponent {
  private readonly elementRef = inject(ElementRef);

  // Inputs
  userName = input<string>('User');
  userEmail = input<string>('');
  userAvatar = input<string>('');
  menuItems = input<UserMenuItem[]>([]);

  // Outputs
  menuItemClick = output<UserMenuItem>();

  // State
  isOpen = signal(false);

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

  onMenuItemClick(item: UserMenuItem, event: Event): void {
    if (item.divider) return;
    event.preventDefault();
    this.menuItemClick.emit(item);
    this.close();
  }

  getUserInitials(): string {
    const name = this.userName();
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
}
