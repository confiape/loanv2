import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form
      (submit)="onSearchSubmit($event)"
      class="relative"
      [class.hidden]="!showOnMobile() && 'md:block'"
      role="search"
      aria-label="Search form"
    >
      <label [attr.for]="'search-input'" class="sr-only">{{ placeholder() }}</label>
      <div class="relative">
        <!-- Search Icon -->
        <div
          class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none text-text-secondary"
          aria-hidden="true"
        >
          <svg
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            ></path>
          </svg>
        </div>

        <!-- Input -->
        <input
          id="search-input"
          type="text"
          [class]="inputClasses"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          (input)="onSearchInput()"
          (focus)="onFocus()"
          (blur)="onBlur()"
          [attr.aria-label]="placeholder()"
        />

        <!-- Clear Button -->
        @if (searchQuery() && !disabled()) {
          <button
            type="button"
            class="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-text-secondary rounded-md hover:bg-bg-secondary hover:text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
            (click)="clearSearch()"
            aria-label="Clear search"
          >
            <svg
              class="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        }
      </div>
    </form>
  `,
})
export class SearchBarComponent {
  // Inputs
  placeholder = input<string>('Search');
  disabled = input<boolean>(false);
  showOnMobile = input<boolean>(false);
  size = input<'sm' | 'md' | 'lg'>('md');

  // Outputs
  searchChange = output<string>();
  searchSubmit = output<string>();

  // State
  searchQuery = signal('');
  isFocused = signal(false);

  get inputClasses(): string {
    const base =
      'bg-bg-secondary border border-border text-text-primary rounded-lg focus:ring-2 focus:ring-accent focus:border-accent block w-full pl-10 transition-colors disabled:bg-bg-disabled disabled:cursor-not-allowed disabled:opacity-60';

    const sizeClasses = {
      sm: 'text-xs p-1.5 pr-8',
      md: 'text-sm p-2.5 pr-10',
      lg: 'text-base p-3 pr-12',
    };

    return `${base} ${sizeClasses[this.size()]}`;
  }

  onSearchInput(): void {
    this.searchChange.emit(this.searchQuery());
  }

  onSearchSubmit(event: Event): void {
    event.preventDefault();
    this.searchSubmit.emit(this.searchQuery());
  }

  onFocus(): void {
    this.isFocused.set(true);
  }

  onBlur(): void {
    this.isFocused.set(false);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.searchChange.emit('');
  }
}
