import { Component, input, ChangeDetectionStrategy, inject, viewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Accordion } from './accordion';

@Component({
  selector: 'app-accordion-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="accordion-item-wrapper">
      <h2 class="accordion-heading">
        <button
          #accordionButton
          type="button"
          class="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-text-secondary border border-b-0 border-border rounded-t-xl focus:ring-4 focus:ring-bg-surface border-border text-text-secondary hover:bg-bg-surface gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          [class.!rounded-none]="isNotFirst()"
          [class.!border-b]="isLast()"
          [attr.aria-expanded]="isExpanded()"
          [attr.id]="'accordion-button-' + id()"
          (click)="onToggle()"
          (keydown)="onKeyDown($event)"
          [disabled]="disabled()">
          <span><ng-content select="app-accordion-item-header"></ng-content></span>
          <svg
            class="w-3 h-3 rotate-180 shrink-0 transition-transform"
            [class.!rotate-0]="isExpanded()"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6">
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5 5 1 1 5"/>
          </svg>
        </button>
      </h2>
      <div
        class="accordion-body"
        [class.hidden]="!isExpanded()"
        [class.!border-b]="isLast()">
        <ng-content select="app-accordion-item-content"></ng-content>
      </div>
    </div>
  `,
  styleUrl: './accordion.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block'
  }
})
export class AccordionItemComponent {
  readonly id = input.required<string>();
  readonly disabled = input(false);
  readonly expanded = input(false);

  private readonly accordion = inject(Accordion);
  private readonly buttonRef = viewChild<ElementRef<HTMLButtonElement>>('accordionButton');

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
