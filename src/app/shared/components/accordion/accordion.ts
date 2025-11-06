import { Component, input, output, signal, computed, ChangeDetectionStrategy, contentChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionItemComponent } from './accordion-item';

export interface AccordionItem {
  id: string;
  title: string;
  content?: string;
  disabled?: boolean;
  expanded?: boolean;
}

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [CommonModule],
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block'
  }
})
export class Accordion {
  readonly items = input<AccordionItem[]>([]);
  readonly allowMultiple = input(false);
  readonly itemSelected = output<string>();

  readonly contentItems = contentChildren(AccordionItemComponent);

  readonly userExpandedItems = signal<Set<string> | null>(null);

  readonly expandedItems = computed(() => {
    const userExpanded = this.userExpandedItems();

    // If user has interacted, use their selection
    if (userExpanded !== null) {
      return userExpanded;
    }

    // Otherwise, use initial expanded state from inputs
    const initialExpanded = this.getInitialExpanded();
    return new Set(initialExpanded);
  });

  private getInitialExpanded(): string[] {
    const items = this.contentItems();
    if (items.length > 0) {
      return items
        .filter(item => item.expanded())
        .map(item => item.id());
    }
    return this.items().filter(item => item.expanded).map(item => item.id);
  }

  getContentItems(): readonly AccordionItemComponent[] {
    return this.contentItems();
  }

  toggleItem(itemId: string): void {
    const contentItem = this.contentItems().find(i => i.id() === itemId);

    if (contentItem?.disabled()) {
      return;
    }

    // Initialize user expanded items on first interaction if not already done
    if (this.userExpandedItems() === null) {
      this.userExpandedItems.set(new Set(this.getInitialExpanded()));
    }

    const updated = new Set(this.expandedItems());
    const isCurrentlyExpanded = updated.has(itemId);

    if (isCurrentlyExpanded) {
      updated.delete(itemId);
    } else {
      if (!this.allowMultiple()) {
        updated.clear();
      }
      updated.add(itemId);
    }

    this.userExpandedItems.set(updated);
    this.itemSelected.emit(itemId);
  }

  isExpanded(itemId: string): boolean {
    return this.expandedItems().has(itemId);
  }

  onKeyDown(event: KeyboardEvent, itemId: string): void {
    if (event.key === 'Escape') {
      this.userExpandedItems.set(new Set());
      event.preventDefault();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const items = this.contentItems();
      const currentIndex = items.findIndex(i => i.id() === itemId);

      if (event.key === 'ArrowDown' && currentIndex < items.length - 1) {
        const nextItem = items[currentIndex + 1];
        this.focusButton(nextItem.id());
      } else if (event.key === 'ArrowUp' && currentIndex > 0) {
        const prevItem = items[currentIndex - 1];
        this.focusButton(prevItem.id());
      }
    }
  }

  private focusButton(itemId: string): void {
    const button = document.querySelector(
      `button[aria-expanded][aria-expanded="${this.isExpanded(itemId)}"]`
    ) as HTMLButtonElement;
    button?.focus();
  }
}
