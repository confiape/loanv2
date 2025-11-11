import {
  Component,
  input,
  ChangeDetectionStrategy,
  inject,
  viewChild,
  ElementRef,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Accordion } from './accordion';

@Component({
  selector: 'app-accordion-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="accordion-item-wrapper" [attr.data-testid]="itemTestId()">
      <h2 class="accordion-heading" [attr.data-testid]="headingTestId()">
        <button
          #accordionButton
          type="button"
          class="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-text-secondary border border-b-0 border-border rounded-t-xl focus:ring-4 focus:ring-bg-surface border-border text-text-secondary hover:bg-bg-surface gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          [class.!rounded-none]="isNotFirst()"
          [class.!border-b]="isLast()"
          [attr.aria-expanded]="isExpanded()"
          [attr.id]="'accordion-button-' + id()"
          [attr.data-testid]="buttonTestId()"
          (click)="onToggle()"
          (keydown)="onKeyDown($event)"
          [disabled]="disabled()"
        >
          <span [attr.data-testid]="headerTestId()"
            ><ng-content select="app-accordion-item-header"></ng-content
          ></span>
          <svg
            class="w-3 h-3 rotate-180 shrink-0 transition-transform"
            [class.!rotate-0]="isExpanded()"
            [attr.data-testid]="iconTestId()"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5 5 1 1 5"
            />
          </svg>
        </button>
      </h2>
      <div
        class="accordion-body"
        [class.hidden]="!isExpanded()"
        [class.!border-b]="isLast()"
        [attr.data-testid]="bodyTestId()"
      >
        <ng-content select="app-accordion-item-content"></ng-content>
      </div>
    </div>
  `,
  styleUrl: './accordion.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class AccordionItemComponent {
  readonly id = input.required<string>();
  readonly disabled = input(false);
  readonly expanded = input(false);

  private readonly accordion = inject(Accordion);
  private readonly buttonRef = viewChild<ElementRef<HTMLButtonElement>>('accordionButton');

  // Test IDs
  private readonly testIdPrefix = computed(() => this.accordion.getTestIdPrefix());

  readonly itemTestId = computed(() => {
    const prefix = this.testIdPrefix();
    return prefix ? `${prefix}-item-${this.id()}` : null;
  });

  readonly headingTestId = computed(() => {
    const prefix = this.testIdPrefix();
    return prefix ? `${prefix}-heading-${this.id()}` : null;
  });

  readonly buttonTestId = computed(() => {
    const prefix = this.testIdPrefix();
    return prefix ? `${prefix}-button-${this.id()}` : null;
  });

  readonly headerTestId = computed(() => {
    const prefix = this.testIdPrefix();
    return prefix ? `${prefix}-header-${this.id()}` : null;
  });

  readonly iconTestId = computed(() => {
    const prefix = this.testIdPrefix();
    return prefix ? `${prefix}-icon-${this.id()}` : null;
  });

  readonly bodyTestId = computed(() => {
    const prefix = this.testIdPrefix();
    return prefix ? `${prefix}-body-${this.id()}` : null;
  });

  isExpanded(): boolean {
    return this.accordion.isExpanded(this.id());
  }

  isNotFirst(): boolean {
    const items = this.accordion.getContentItems();
    return items.indexOf(this) > 0;
  }

  isLast(): boolean {
    const items = this.accordion.getContentItems();
    return items.indexOf(this) === items.length - 1;
  }

  onToggle(): void {
    this.accordion.toggleItem(this.id());
  }

  onKeyDown(event: KeyboardEvent): void {
    this.accordion.onKeyDown(event, this.id());
  }

  focusButton(): void {
    const button = this.buttonRef();
    if (button) {
      button.nativeElement.focus();
    }
  }
}
