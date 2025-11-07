import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { DropdownIconName } from './dropdown.types';

@Component({
  selector: 'app-dropdown-icon',
  standalone: true,
  imports: [NgClass],
  template: `
    @switch (name()) {
      @case ('chevron-down') {
        <svg
          class="h-4 w-4"
          [ngClass]="classes()"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      }
      @case ('chevron-right') {
        <svg
          class="h-4 w-4"
          [ngClass]="classes()"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      }
      @case ('chevron-left') {
        <svg
          class="h-4 w-4"
          [ngClass]="classes()"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path d="M12.5 5L7.5 10L12.5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      }
      @case ('dots-vertical') {
        <svg
          class="h-5 w-5"
          [ngClass]="classes()"
          viewBox="0 0 4 15"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M3.5 1.5A1.5 1.5 0 1 1 .5 1.5a1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
        </svg>
      }
      @case ('dots-horizontal') {
        <svg
          class="h-5 w-5"
          [ngClass]="classes()"
          viewBox="0 0 16 3"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
        </svg>
      }
      @case ('plus') {
        <svg
          class="h-4 w-4"
          [ngClass]="classes()"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 4a1 1 0 0 1 1 1v4h4a1 1 0 0 1 0 2h-4v4a1 1 0 1 1-2 0v-4H5a1 1 0 1 1 0-2h4V5a1 1 0 0 1 1-1Z" />
        </svg>
      }
      @case ('minus') {
        <svg
          class="h-4 w-4"
          [ngClass]="classes()"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5 9a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2H5Z" />
        </svg>
      }
      @case ('search') {
        <svg
          class="h-4 w-4"
          [ngClass]="classes()"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="m17 17-3.5-3.5m0 0a5 5 0 1 0-7.071-7.071 5 5 0 0 0 7.071 7.071Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      }
      @default {
        <span class="block h-4 w-4"></span>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownIcon {
  readonly name = input.required<DropdownIconName>();
  readonly classes = input<string>('text-text-secondary');
}
