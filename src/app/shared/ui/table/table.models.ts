/**
 * Definición de columnas para el componente Table
 */
export interface TableColumn<T = any> {
  /**
   * Identificador único de la columna
   */
  key: string;

  /**
   * Etiqueta visible en el encabezado
   */
  label: string;

  /**
   * Alineación del contenido
   */
  align?: 'left' | 'center' | 'right';

  /**
   * Ancho de la columna (opcional)
   */
  width?: string;

  /**
   * Si la columna es sorteable
   */
  sortable?: boolean;

  /**
   * Función personalizada para renderizar el valor
   */
  render?: (value: any, row: T) => string | number;
}

/**
 * Definición de acciones por fila
 */
export interface TableAction<T = any> {
  /**
   * Etiqueta visible del botón/enlace
   */
  label: string;

  /**
   * Variante de color basada en tokens
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'success';

  /**
   * Callback cuando se ejecuta la acción
   */
  handler: (row: T) => void;

  /**
   * Condición para mostrar la acción
   */
  condition?: (row: T) => boolean;
}

/**
 * Configuración de paginación
 */
export interface TablePagination {
  /**
   * Página actual (basado en 1)
   */
  currentPage: number;

  /**
   * Tamaño de página
   */
  pageSize: number;

  /**
   * Total de registros
   */
  totalRecords: number;

  /**
   * Total de páginas
   */
  totalPages: number;
}

/**
 * Estado de ordenamiento
 */
export interface TableSort {
  /**
   * Columna activa
   */
  key: string;

  /**
   * Dirección de ordenamiento
   */
  direction: 'asc' | 'desc' | null;
}

/**
 * Configuración de densidad de la tabla
 */
export type TableDensity = 'comfortable' | 'compact' | 'spacious';
