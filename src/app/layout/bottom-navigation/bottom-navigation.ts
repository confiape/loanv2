import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';

export interface BottomNavItem {
  id: string;
  label: string;
  icon: string;
  routerLink: string;
}

@Component({
  selector: 'app-bottom-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIconComponent],
  template: `
    <nav
      class="bg-bg-primary border-t border-border w-full h-16 flex items-center justify-center lg:hidden"
      role="navigation"
      aria-label="Bottom navigation"
    >
      <div class="flex h-full max-w-lg font-medium w-full">
        @for (item of items(); track item.id) {
          <a
            [routerLink]="item.routerLink"
            routerLinkActive="router-link-active"
            class="flex-1 inline-flex flex-col items-center justify-center px-5 hover:bg-bg-secondary transition-colors group"
            (click)="onItemClick(item)"
            [attr.aria-label]="item.label"
          >
            <ng-icon
              [name]="item.icon"
              size="20"
              class="mb-2 text-text-secondary group-hover:text-accent transition-colors [&.router-link-active]:text-accent"
            ></ng-icon>
            <span
              class="text-sm text-text-secondary group-hover:text-accent transition-colors [&.router-link-active]:text-accent"
            >
              {{ item.label }}
            </span>
          </a>
        } @empty {
          <div class="flex items-center justify-center text-text-secondary text-sm w-full">
            No navigation items
          </div>
        }
      </div>
    </nav>
  `,
  styles: [
    `
      /* Active state for router link */
      :host ::ng-deep .router-link-active ng-icon,
      :host ::ng-deep .router-link-active span {
        color: var(--color-accent) !important;
      }
    `,
  ],
})
export class BottomNavigationComponent {
  // Inputs
  items = input<BottomNavItem[]>([]);

  // Outputs
  itemClick = output<BottomNavItem>();

  onItemClick(item: BottomNavItem): void {
    this.itemClick.emit(item);
  }
}
