import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayFieldMetadata } from '@loan/app/core/models/form-metadata';
import { Button } from '@loan/app/shared/components/button/button';

/**
 * Generic CRUD view component
 * Displays item information in a card format with Edit/Delete actions
 *
 * @example
 * ```typescript
 * <app-generic-crud-view
 *   [item]="item"
 *   [fields]="displayFields"
 *   [itemTypeName]="'company'"
 *   (editClick)="onEdit()"
 *   (deleteClick)="onDelete()"
 * />
 * ```
 */
@Component({
  selector: 'app-generic-crud-view',
  standalone: true,
  imports: [CommonModule, Button],
  templateUrl: './generic-crud-view.html',
})
export class GenericCrudViewComponent<TDto extends { id: string }> {
  // ========== INPUTS ==========

  /** Item to display */
  readonly item = input.required<TDto>();

  /** Display field metadata */
  readonly fields = input.required<DisplayFieldMetadata[]>();

  /** Item type name (singular) for title */
  readonly itemTypeName = input.required<string>();

  /** Test ID for E2E testing (optional) */
  readonly dataTestId = input<string | null>(null);

  // ========== OUTPUTS ==========

  /** Emitted when Edit button is clicked */
  readonly editClick = output<void>();

  /** Emitted when Delete button is clicked */
  readonly deleteClick = output<void>();

  // ========== COMPUTED ==========

  /**
   * Test IDs for child elements
   */
  protected readonly testIds = computed(() => {
    const base = this.dataTestId();
    if (!base) {
      return {
        wrapper: null,
        header: null,
        body: null,
        footer: null,
        btnEdit: null,
        btnDelete: null,
      };
    }

    return {
      wrapper: `${base}-view-wrapper`,
      header: `${base}-view-header`,
      body: `${base}-view-body`,
      footer: `${base}-view-footer`,
      btnEdit: `${base}-btn-edit`,
      btnDelete: `${base}-btn-delete`,
    };
  });

  /**
   * Display title (capitalized item type name)
   */
  protected readonly displayTitle = computed(() => {
    const typeName = this.itemTypeName();
    return typeName.charAt(0).toUpperCase() + typeName.slice(1);
  });

  // ========== METHODS ==========

  /**
   * Get field value from item
   */
  protected getFieldValue(field: DisplayFieldMetadata): string {
    const item = this.item();
    let value: unknown;

    // Get the value using valueGetter or direct key access
    if (field.valueGetter) {
      value = field.valueGetter(item);
    } else {
      value = (item as Record<string, unknown>)[field.key];
    }

    // Format the value if formatter is provided
    if (field.formatter) {
      return field.formatter(value);
    }

    return String(value ?? '');
  }

  /**
   * Handle Edit button click
   */
  protected onEditClick(): void {
    this.editClick.emit();
  }

  /**
   * Handle Delete button click
   */
  protected onDeleteClick(): void {
    this.deleteClick.emit();
  }
}
