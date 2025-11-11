import {
  Component,
  input,
  output,
  signal,
  computed,
  inject,
  DestroyRef,
  ChangeDetectionStrategy,
  ElementRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NgIcon } from '@ng-icons/core';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon],
  templateUrl: './user-menu.html',
})
export class UserMenuComponent {
  private readonly elementRef = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  // Inputs
  readonly userName = input<string>('User');
  readonly userEmail = input<string>('');
  readonly userAvatar = input<string>('');
  readonly menuItems = input<UserMenuItem[]>([]);

  // Outputs
  readonly menuItemClick = output<UserMenuItem>();
  readonly menuOpened = output<void>();
  readonly menuClosed = output<void>();

  // State
  readonly isOpen = signal(false);

  // Computed signals - mejor que métodos en template
  readonly userInitials = computed(() => {
    const name = this.userName();
    if (!name) return 'U';

    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  });

  readonly hasUserInfo = computed(() => {
    return Boolean(this.userName() || this.userEmail());
  });

  readonly visibleMenuItems = computed(() => {
    return this.menuItems().filter((item) => !item.divider);
  });

  constructor() {
    this.setupClickOutsideListener();
    this.setupEscapeKeyListener();
  }

  private setupClickOutsideListener(): void {
    fromEvent<MouseEvent>(document, 'click')
      .pipe(
        // Solo procesar clicks cuando el menú está abierto
        filter(() => this.isOpen()),
        filter((event) => {
          const clickedInside = this.elementRef.nativeElement.contains(event.target);
          return !clickedInside;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.close();
      });
  }

  private setupEscapeKeyListener(): void {
    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        filter(() => this.isOpen()),
        filter((event) => event.key === 'Escape'),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.close();
      });
  }

  toggle(): void {
    this.isOpen.update((current) => !current);

    // Emitir eventos aquí directamente
    if (this.isOpen()) {
      this.menuOpened.emit();
      this.focusFirstMenuItem();
    } else {
      this.menuClosed.emit();
    }
  }

  open(): void {
    if (this.isOpen()) return; // Ya está abierto

    this.isOpen.set(true);
    this.menuOpened.emit();
    this.focusFirstMenuItem();
  }

  close(): void {
    if (!this.isOpen()) return; // Ya está cerrado

    this.isOpen.set(false);
    this.menuClosed.emit();
  }

  onMenuItemClick(item: UserMenuItem, event: Event): void {
    if (item.divider) return;

    // Prevenir navegación solo si hay una acción o no hay href
    if (item.action || !item.href) {
      event.preventDefault();
    }

    this.menuItemClick.emit(item);
    this.close();
  }

  private focusFirstMenuItem(): void {
    // Usar setTimeout para esperar a que el DOM se actualice
    setTimeout(() => {
      const firstMenuItem = this.elementRef.nativeElement.querySelector('[role="menuitem"]');
      if (firstMenuItem) {
        (firstMenuItem as HTMLElement).focus();
      }
    }, 0);
  }

  // Método helper para template (si es necesario)
  trackByItemId(index: number, item: UserMenuItem): string {
    return item.id;
  }
}
