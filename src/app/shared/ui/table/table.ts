import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
  HostAttributeToken,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import type {
  TableColumn,
  TableAction,
  TablePagination,
  TableSort,
  TableDensity,
} from './table.models';

const DATA_TESTID = new HostAttributeToken('data-testid');

/**
 * Componente Table reutilizable
 * Soporta ordenamiento, búsqueda, paginación y selección múltiple
 */
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.html',
  styleUrls: ['./table.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Table<T extends Record<string, any> = Record<string, any>> {
  private readonly injectedTestId = inject(DATA_TESTID, { optional: true });

  // Exponer Math para el template
  protected readonly Math = Math;

  // ========== INPUTS ==========

  /**
   * Columnas de la tabla
   */
  readonly columns = input.required<TableColumn<T>[]>();

  /**
   * Datos a mostrar
   */
  readonly data = input.required<T[]>();

  /**
   * Acciones disponibles por fila
   */
  readonly actions = input<TableAction<T>[]>([]);

  /**
   * Habilita hover en las filas
   */
  readonly hoverable = input<boolean>(true);

  /**
   * Habilita selección múltiple
   */
  readonly selectable = input<boolean>(false);

  /**
   * Habilita búsqueda local
   */
  readonly searchable = input<boolean>(false);

  /**
   * Habilita paginación
   */
  readonly paginated = input<boolean>(false);

  /**
   * Tamaño de página inicial
   */
  readonly pageSize = input<number>(10);

  /**
   * Densidad de la tabla
   */
  readonly density = input<TableDensity>('comfortable');

  /**
   * Placeholder del campo de búsqueda
   */
  readonly searchPlaceholder = input<string>('Search...');

  /**
   * Habilita ordenamiento
   */
  readonly sortable = input<boolean>(false);

  // ========== OUTPUTS ==========

  /**
   * Emite las filas seleccionadas
   */
  readonly selectionChange = output<T[]>();

  /**
   * Emite cuando cambia la página
   */
  readonly pageChange = output<number>();

  /**
   * Emite cuando cambia el ordenamiento
   */
  readonly sortChange = output<TableSort>();

  // ========== STATE (SIGNALS) ==========

  /**
   * Término de búsqueda actual
   */
  protected readonly searchTerm = signal<string>('');

  /**
   * Página actual (basada en 1)
   */
  protected readonly currentPage = signal<number>(1);

  /**
   * Conjunto de IDs de filas seleccionadas
   */
  protected readonly selectedRows = signal<Set<number>>(new Set());

  /**
   * Estado de ordenamiento actual
   */
  protected readonly sortState = signal<TableSort>({
    key: '',
    direction: null,
  });

  // ========== COMPUTED SIGNALS ==========

  /**
   * Datos filtrados por búsqueda
   */
  protected readonly filteredData = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term || !this.searchable()) {
      return this.data();
    }

    const columns = this.columns();
    return this.data().filter((row) =>
      columns.some((col) => {
        const value = row[col.key];
        return String(value ?? '').toLowerCase().includes(term);
      })
    );
  });

  /**
   * Datos ordenados
   */
  protected readonly sortedData = computed(() => {
    const data = [...this.filteredData()];
    const sort = this.sortState();

    if (!sort.direction || !sort.key) {
      return data;
    }

    return data.sort((a, b) => {
      const aVal = a[sort.key];
      const bVal = b[sort.key];

      if (aVal === bVal) return 0;
      const comparison = aVal > bVal ? 1 : -1;
      return sort.direction === 'asc' ? comparison : -comparison;
    });
  });

  /**
   * Datos visibles en la página actual
   */
  protected readonly visibleData = computed(() => {
    const data = this.sortedData();
    if (!this.paginated()) {
      return data;
    }

    const page = this.currentPage();
    const size = this.pageSize();
    const start = (page - 1) * size;
    const end = start + size;

    return data.slice(start, end);
  });

  /**
   * Información de paginación
   */
  protected readonly pagination = computed<TablePagination>(() => {
    const totalRecords = this.filteredData().length;
    const size = this.pageSize();
    const totalPages = Math.ceil(totalRecords / size) || 1;
    const currentPage = this.currentPage();

    return {
      currentPage,
      pageSize: size,
      totalRecords,
      totalPages,
    };
  });

  /**
   * Indica si todas las filas visibles están seleccionadas
   */
  protected readonly allSelected = computed(() => {
    if (!this.selectable()) return false;
    const visible = this.visibleData();
    const selected = this.selectedRows();
    return visible.length > 0 && visible.every((_, i) => selected.has(i));
  });

  /**
   * Indica si hay selección parcial
   */
  protected readonly partialSelection = computed(() => {
    if (!this.selectable()) return false;
    const visible = this.visibleData();
    const selected = this.selectedRows();
    const count = visible.filter((_, i) => selected.has(i)).length;
    return count > 0 && count < visible.length;
  });

  /**
   * Test IDs dinámicos para Playwright
   */
  protected readonly testIds = computed(() => {
    const base = this.injectedTestId;
    if (!base) {
      return {
        wrapper: null,
        search: null,
        table: null,
        selectAll: null,
        pagination: null,
      };
    }

    return {
      wrapper: `${base}-wrapper`,
      search: `${base}-search`,
      table: `${base}-table`,
      selectAll: `${base}-select-all`,
      pagination: `${base}-pagination`,
    };
  });

  /**
   * Clases de densidad
   */
  protected readonly densityClasses = computed(() => {
    const density = this.density();
    switch (density) {
      case 'compact':
        return 'px-4 py-2 text-xs';
      case 'spacious':
        return 'px-8 py-5 text-base';
      case 'comfortable':
      default:
        return 'px-6 py-4 text-sm';
    }
  });

  // ========== METHODS ==========

  /**
   * Actualiza el término de búsqueda
   */
  protected onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.currentPage.set(1); // Reset a primera página
  }

  /**
   * Cambia la página actual
   */
  protected goToPage(page: number): void {
    const { totalPages } = this.pagination();
    if (page < 1 || page > totalPages) return;

    this.currentPage.set(page);
    this.pageChange.emit(page);
  }

  /**
   * Togglea la selección de todas las filas visibles
   */
  protected toggleSelectAll(): void {
    const visible = this.visibleData();
    const selected = new Set(this.selectedRows());

    if (this.allSelected()) {
      // Deseleccionar todas
      visible.forEach((_, i) => selected.delete(i));
    } else {
      // Seleccionar todas
      visible.forEach((_, i) => selected.add(i));
    }

    this.selectedRows.set(selected);
    this.emitSelection();
  }

  /**
   * Togglea la selección de una fila
   */
  protected toggleRow(index: number): void {
    const selected = new Set(this.selectedRows());

    if (selected.has(index)) {
      selected.delete(index);
    } else {
      selected.add(index);
    }

    this.selectedRows.set(selected);
    this.emitSelection();
  }

  /**
   * Verifica si una fila está seleccionada
   */
  protected isRowSelected(index: number): boolean {
    return this.selectedRows().has(index);
  }

  /**
   * Emite el cambio de selección
   */
  private emitSelection(): void {
    const selected = Array.from(this.selectedRows())
      .map((i) => this.data()[i])
      .filter(Boolean);
    this.selectionChange.emit(selected);
  }

  /**
   * Ejecuta una acción sobre una fila
   */
  protected executeAction(action: TableAction<T>, row: T): void {
    action.handler(row);
  }

  /**
   * Valida si una acción debe mostrarse
   */
  protected shouldShowAction(action: TableAction<T>, row: T): boolean {
    return action.condition ? action.condition(row) : true;
  }

  /**
   * Obtiene el valor de una celda
   */
  protected getCellValue(row: T, column: TableColumn<T>): string | number {
    if (column.render) {
      return column.render(row[column.key], row);
    }
    return row[column.key] ?? '';
  }

  /**
   * Maneja el ordenamiento de una columna
   */
  protected handleSort(column: TableColumn<T>): void {
    if (!this.sortable() || !column.sortable) return;

    const current = this.sortState();
    let direction: 'asc' | 'desc' | null = 'asc';

    if (current.key === column.key) {
      if (current.direction === 'asc') {
        direction = 'desc';
      } else if (current.direction === 'desc') {
        direction = null;
      }
    }

    const newSort: TableSort = {
      key: direction ? column.key : '',
      direction,
    };

    this.sortState.set(newSort);
    this.sortChange.emit(newSort);
  }

  /**
   * Genera el rango de páginas a mostrar
   */
  protected getPageRange(): number[] {
    const { currentPage, totalPages } = this.pagination();
    const range: number[] = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  }

  /**
   * Obtiene las clases de alineación
   */
  protected getAlignClass(align?: 'left' | 'center' | 'right'): string {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      case 'left':
      default:
        return 'text-left';
    }
  }

  /**
   * Obtiene las clases de variante de acción
   */
  protected getActionClass(
    variant?: 'primary' | 'secondary' | 'danger' | 'success'
  ): string {
    switch (variant) {
      case 'danger':
        return 'text-red-600 hover:text-red-700';
      case 'success':
        return 'text-green-600 hover:text-green-700';
      case 'secondary':
        return 'text-text-secondary hover:text-text-primary';
      case 'primary':
      default:
        return 'text-accent hover:text-accent-hover';
    }
  }
}
