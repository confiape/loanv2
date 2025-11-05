import { Component, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
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

  readonly expandedItems = signal<Set<string>>(new Set());

  toggleItem(itemId: string): void {
    const updated = new Set(this.expandedItems());

    if (!this.allowMultiple()) {
      updated.clear();
    }

    if (updated.has(itemId)) {
      updated.delete(itemId);
    } else {
      updated.add(itemId);
    }

    this.expandedItems.set(updated);
    this.itemSelected.emit(itemId);
  }

  isExpanded(itemId: string): boolean {
    return this.expandedItems().has(itemId);
  }
}
