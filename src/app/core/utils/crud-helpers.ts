import { TableAction } from '@loan/app/shared/ui/table/table.models';

/**
 * Helper functions for CRUD operations
 */

/**
 * Create standard row actions for CRUD table (Edit, Delete)
 */
export function createStandardRowActions<T>(
  onEdit: (item: T) => void,
  onDelete: (item: T) => void,
): TableAction<T>[] {
  return [
    {
      label: 'Edit',
      variant: 'primary',
      handler: onEdit,
    },
    {
      label: 'Delete',
      variant: 'danger',
      handler: onDelete,
    },
  ];
}

/**
 * Create a primary action for toolbar (e.g., "New Item")
 */
export interface ToolbarAction {
  label: string;
  icon?: string;
  handler: () => void;
}

export function createPrimaryAction(label: string, handler: () => void): ToolbarAction {
  return {
    label,
    handler,
  };
}

/**
 * Create bulk actions for toolbar
 */
export function createBulkActions(): ToolbarAction[] {
  return [
    {
      label: 'Delete Selected',
      handler: () => {
        // This will be handled by the parent component
      },
    },
  ];
}
