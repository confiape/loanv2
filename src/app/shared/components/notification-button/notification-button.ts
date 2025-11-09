import { Component, input, output, signal, HostListener, ElementRef, inject } from '@angular/core';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read?: boolean;
  icon?: string;
  iconColor?: string;
  avatar?: string;
  actionUrl?: string;
}

@Component({
  selector: 'app-notification-button',
  standalone: true,
  template: `
    <div class="relative inline-block">
      <!-- Notification Button -->
      <button
        type="button"
        class="p-2 text-text-secondary rounded-lg hover:text-text-primary hover:bg-bg-secondary focus:ring-4 focus:ring-border transition-colors relative"
        (click)="toggle()"
        aria-label="View notifications"
        [attr.aria-expanded]="isOpen()"
        aria-haspopup="true"
      >
        <!-- Bell Icon -->
        <svg
          class="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
          ></path>
        </svg>

        <!-- Badge -->
        @if (showBadge() && unreadCount > 0) {
          <span
            class="absolute top-0 right-0 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-semibold text-white bg-error border-2 border-bg-primary rounded-full"
            [attr.aria-label]="unreadCount + ' unread notifications'"
          >
            {{ unreadCount > 99 ? '99+' : unreadCount }}
          </span>
        }
      </button>

      <!-- Dropdown Menu -->
      @if (isOpen()) {
        <div
          class="absolute right-0 top-full mt-2 z-50 w-96 max-w-[90vw] bg-bg-primary border border-border rounded-xl shadow-lg overflow-hidden"
          role="menu"
          aria-label="Notifications menu"
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-4 bg-bg-secondary border-b border-border">
            <span class="text-base font-medium text-text-primary">Notifications</span>
            @if (notifications().length > 0) {
              <button
                type="button"
                class="text-sm font-medium text-accent hover:text-accent-hover hover:underline transition-colors"
                (click)="onMarkAllAsRead()"
                aria-label="Mark all as read"
              >
                Mark all as read
              </button>
            }
          </div>

          <!-- Notifications List -->
          <div class="max-h-[400px] overflow-y-auto">
            @if (notifications().length === 0) {
              <div class="py-8 px-4 text-center">
                <svg
                  class="w-12 h-12 text-text-secondary mx-auto mb-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
                  ></path>
                </svg>
                <p class="text-text-secondary">{{ emptyMessage() }}</p>
              </div>
            }

            @for (notification of displayedNotifications; track notification.id) {
              <a
                href="#"
                [class]="
                  'block p-3 border-b border-border last:border-b-0 hover:bg-bg-secondary transition-colors ' +
                  (!notification.read ? 'bg-bg-info' : '')
                "
                (click)="onNotificationClick(notification); $event.preventDefault()"
                role="menuitem"
                [attr.aria-label]="notification.title + ': ' + notification.message"
              >
                <div class="flex gap-3">
                  <!-- Icon/Avatar -->
                  <div class="relative flex-shrink-0">
                    @if (notification.avatar) {
                      <img
                        [src]="notification.avatar"
                        [alt]="notification.title"
                        class="w-11 h-11 rounded-full object-cover"
                      />
                    } @else {
                      <div
                        class="w-11 h-11 rounded-full flex items-center justify-center border-2 border-bg-primary"
                        [style.background-color]="notification.iconColor || 'var(--color-accent)'"
                      >
                        @if (notification.icon) {
                          <span [innerHTML]="notification.icon" class="text-white w-3 h-3"></span>
                        } @else {
                          <svg
                            class="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
                            ></path>
                          </svg>
                        }
                      </div>
                    }

                    <!-- Unread Indicator -->
                    @if (!notification.read) {
                      <div
                        class="absolute top-0 right-0 w-3 h-3 bg-accent border-2 border-bg-primary rounded-full"
                        aria-hidden="true"
                      ></div>
                    }
                  </div>

                  <!-- Content -->
                  <div class="flex-1 min-w-0">
                    <div class="text-sm text-text-secondary mb-1">
                      @if (notification.title) {
                        <span class="font-semibold text-text-primary">{{ notification.title }}</span>
                      }
                      {{ notification.message }}
                    </div>
                    <div class="text-xs text-accent font-medium">{{ notification.time }}</div>
                  </div>
                </div>
              </a>
            }
          </div>

          <!-- Footer -->
          @if (notifications().length > 0) {
            <div class="p-2 bg-bg-secondary border-t border-border">
              <button
                type="button"
                class="w-full flex items-center justify-center gap-2 p-2 rounded-md text-text-primary text-sm font-medium hover:bg-bg-primary transition-colors"
                (click)="onViewAll()"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                  <path
                    fill-rule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                View all
              </button>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class NotificationButtonComponent {
  private readonly elementRef = inject(ElementRef);

  // Inputs
  notifications = input<Notification[]>([]);
  badgeCount = input<number>(0);
  showBadge = input<boolean>(true);
  maxNotificationsDisplay = input<number>(5);
  emptyMessage = input<string>('No notifications');

  // Outputs
  notificationClick = output<Notification>();
  markAsRead = output<string>();
  markAllAsRead = output<void>();
  viewAll = output<void>();

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

  onNotificationClick(notification: Notification): void {
    this.notificationClick.emit(notification);
    if (!notification.read) {
      this.markAsRead.emit(notification.id);
    }
  }

  onMarkAllAsRead(): void {
    this.markAllAsRead.emit();
  }

  onViewAll(): void {
    this.viewAll.emit();
    this.close();
  }

  get displayedNotifications(): Notification[] {
    return this.notifications().slice(0, this.maxNotificationsDisplay());
  }

  get unreadCount(): number {
    if (this.badgeCount() > 0) {
      return this.badgeCount();
    }
    return this.notifications().filter((n) => !n.read).length;
  }
}
