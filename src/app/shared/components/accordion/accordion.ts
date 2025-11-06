import { Component, input, output, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
  disabled?: boolean;
  expanded?: boolean;
}

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion.html',
  styleUrl: './accordion.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block'
  }
})
export class Accordion {
  readonly items = input<AccordionItem[]>([]);
  readonly allowMultiple = input(false);
  readonly itemSelected = output<string>();

  readonly userExpandedItems = signal<Set<string>>(new Set());

  readonly expandedItems = computed(() => {
    const userExpanded = this.userExpandedItems();
    const initialExpanded = this.items()
      .filter(item => item.expanded)
      .map(item => item.id);

    return userExpanded.size > 0
      ? userExpanded
      : new Set(initialExpanded);
  });

  toggleItem(itemId: string): void {
    const item = this.items().find(i => i.id === itemId);

    if (item?.disabled) {
      return;
    }

    const updated = new Set(this.expandedItems());
    const isCurrentlyExpanded = updated.has(itemId);

    if (isCurrentlyExpanded) {
      // Si está expandido, simplemente ciérralo
      updated.delete(itemId);
    } else {
      // Si no está expandido, cierra los demás si no permitimos múltiples
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
      const items = this.items();
      const currentIndex = items.findIndex(i => i.id === itemId);

      if (event.key === 'ArrowDown' && currentIndex < items.length - 1) {
        const nextItem = items[currentIndex + 1];
        this.focusButton(nextItem.id);
      } else if (event.key === 'ArrowUp' && currentIndex > 0) {
        const prevItem = items[currentIndex - 1];
        this.focusButton(prevItem.id);
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
