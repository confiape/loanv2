import { ChangeDetectionStrategy, Component, computed, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import type {
  TableColumn,
  TableAction,
  TablePagination,
  TableSort,
  TableDensity,
} from './table.models';
import { generateItemTestId } from '@loan/app/shared/utils/test-id.utils';
import { Checkbox } from '../../components/checkbox';

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
  readonly dataTestId = input<string | null>(null);

  // Exponer Math para el template
  protected readonly Math = Math;

  // ========== INPUTS ==========

  /**
   * Columnas de la tabla
   */
  readonly columns = input.required<TableColumn<T>[]>();

  /**
   * Datos a mostrar (pueden estar paginados)
   */
  readonly data = input.required<T[]>();

  /**
   * Todos los datos disponibles (sin paginar)
   * Necesario para sincronización cuando externalSelectedIds cambia
   * Si no se proporciona, se usa data
   */
  readonly allData = input<T[] | null>(null);

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

  /**
   * Campo usado como identificador único para cada fila
   * Por defecto usa 'id'
   */
  readonly idField = input<string>('id');

  /**
   * IDs de items seleccionados externamente (desde el servicio)
   * Usado para sincronizar selección cuando cambia desde afuera
   * (ej: cuando se presiona "Clear all")
   */
  readonly externalSelectedIds = input<Set<string> | null>(null);

  /**
   * Función para obtener el nombre a mostrar de cada item
   * Usado en los badges de selección
   */
  readonly getItemDisplayName = input<(item: T) => string>((item) => String(item['name'] || ''));

  /**
   * Callback cuando se hace bulk delete
   */
  readonly onBulkDelete = input<(() => void) | null>(null);

  /**
   * Callback cuando se remueve un item de la selección
   */
  readonly onRemoveFromSelection = input<((id: string) => void) | null>(null);

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

  /**
   * Emite cuando cambia el tamaño de página
   */
  readonly pageSizeChange = output<number>();

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
   * Tamaño de página actualmente seleccionado
   * Se inicializa desde el input pageSize, pero puede cambiar internamente
   */
  protected readonly currentPageSize = signal<number>(this.pageSize());

  /**
   * Mapa de filas seleccionadas: ID -> objeto completo
   * Se almacena el objeto completo para poder emitir la selección
   * independientemente de los datos paginados que se reciben como input
   */
  protected readonly selectedRows = signal<Map<string, T>>(new Map());

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
        return String(value ?? '')
          .toLowerCase()
          .includes(term);
      }),
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
    const size = this.currentPageSize();
    const start = (page - 1) * size;
    const end = start + size;

    return data.slice(start, end);
  });

  /**
   * Información de paginación
   */
  protected readonly pagination = computed<TablePagination>(() => {
    const totalRecords = this.filteredData().length;
    const size = this.currentPageSize();
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
    const idField = this.idField();
    return visible.length > 0 && visible.every((row) => {
      const rowId = String(row[idField]);
      return selected.has(rowId);
    });
  });

  /**
   * Indica si hay selección parcial
   */
  protected readonly partialSelection = computed(() => {
    if (!this.selectable()) return false;
    const visible = this.visibleData();
    const selected = this.selectedRows();
    const idField = this.idField();
    const count = visible.filter((row) => {
      const rowId = String(row[idField]);
      return selected.has(rowId);
    }).length;
    return count > 0 && count < visible.length;
  });

  /**
   * Test IDs dinámicos para Playwright
   */
  protected readonly testIds = computed(() => {
    const base = this.dataTestId();
    if (!base) {
      return {
        wrapper: null,
        search: null,
        table: null,
        header: null,
        body: null,
        selectAll: null,
        pagination: null,
      };
    }

    return {
      wrapper: `${base}-wrapper`,
      search: `${base}-search`,
      table: base,
      header: `${base}-header`,
      body: `${base}-body`,
      selectAll: `${base}-select-all`,
      pagination: `${base}-pagination`
    };
  });

  /**
   * Opciones disponibles para tamaño de página
   */
  protected readonly pageSizeOptions = computed(() => {
    return [10, 25, 50, 100];
  });

  /**
   * Array de objetos seleccionados para usar en el template
   */
  protected readonly selectedItemsData = computed(() => {
    return Array.from(this.selectedRows().values());
  });

  /**
   * Indica si hay selección activa
   */
  protected readonly hasSelection = computed(() => {
    return this.selectedRows().size > 0;
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

  // ========== SYNCHRONIZATION EFFECT ==========

  /**
   * Sincroniza selectedRows cuando externalSelectedIds cambia
   * Esto es necesario para que cambios externos (como "Clear all")
   * se reflejen en los checkboxes de la tabla
   */
  protected syncExternalSelection = effect(() => {
    const externalIds = this.externalSelectedIds();
    const idField = this.idField();

    if (externalIds === null) {
      // No hay sincronización externa
      return;
    }

    const allAvailable = this.allData() || this.data();
    const newSelected = new Map<string, T>();

    // Reconstruir el Map con solo los items que están en externalIds
    allAvailable.forEach((row) => {
      const rowId = String(row[idField]);
      if (externalIds.has(rowId)) {
        newSelected.set(rowId, row);
      }
    });

    // Actualizar solo si cambió
    const current = this.selectedRows();
    if (current.size !== newSelected.size ||
        Array.from(newSelected.keys()).some(id => !current.has(id))) {
      this.selectedRows.set(newSelected);
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
   * Cambia el tamaño de página
   */
  protected changePageSize(newSize: number): void {
    this.currentPageSize.set(newSize);
    this.currentPage.set(1); // Reset a primera página
    this.pageSizeChange.emit(newSize);
  }

  /**
   * Limpia toda la selección
   */
  protected clearSelection(): void {
    this.selectedRows.set(new Map());
    this.emitSelection();
  }

  /**
   * Remueve un item específico de la selección
   */
  protected removeFromSelection(id: string): void {
    const selected = new Map(this.selectedRows());
    selected.delete(id);
    this.selectedRows.set(selected);
    this.emitSelection();

    // Llamar al callback si existe
    const callback = this.onRemoveFromSelection();
    if (callback) {
      callback(id);
    }
  }

  /**
   * Ejecuta el callback de bulk delete
   */
  protected onBulkDeleteClick(): void {
    const callback = this.onBulkDelete();
    if (callback) {
      callback();
    }
  }

  /**
   * Convierte a string un ID
   */
  protected getStringId(id: any): string {
    return String(id);
  }

  /**
   * Togglea la selección de todas las filas visibles
   */
  protected toggleSelectAll(): void {
    const visible = this.visibleData();
    const selected = new Map(this.selectedRows());
    const idField = this.idField();

    if (this.allSelected()) {
      // Deseleccionar todas
      visible.forEach((row) => {
        selected.delete(String(row[idField]));
      });
    } else {
      // Seleccionar todas
      visible.forEach((row) => {
        const rowId = String(row[idField]);
        selected.set(rowId, row);
      });
    }

    this.selectedRows.set(selected);
    this.emitSelection();
  }

  /**
   * Togglea la selección de una fila
   */
  protected toggleRow(row: T): void {
    const selected = new Map(this.selectedRows());
    const idField = this.idField();
    const rowId = String(row[idField]);

    if (selected.has(rowId)) {
      selected.delete(rowId);
    } else {
      selected.set(rowId, row);
    }

    this.selectedRows.set(selected);
    this.emitSelection();
  }

  /**
   * Verifica si una fila está seleccionada
   */
  protected isRowSelected(row: T): boolean {
    const idField = this.idField();
    const rowId = String(row[idField]);
    return this.selectedRows().has(rowId);
  }

  /**
   * Emite el cambio de selección
   * Emite directamente los objetos almacenados en el Map
   * Sin necesidad de buscar en this.data(), funciona correctamente
   * incluso cuando los datos paginados cambian
   */
  private emitSelection(): void {
    const selectedMap = this.selectedRows();
    const selected = Array.from(selectedMap.values());
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
  protected getActionClass(variant?: 'primary' | 'secondary' | 'danger' | 'success'): string {
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
