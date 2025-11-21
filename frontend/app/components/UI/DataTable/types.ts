
// Tipos genéricos para DataTable
export interface DataTableColumn<T> {
    key: keyof T | string;
    header: string;
    className?: string;
    render?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
    columns: DataTableColumn<T>[];
    data: T[];
    isDarkMode?: boolean;
    pageSize?: number;
    filterPlaceholder?: string;
    filterFunction?: (row: T, filter: string) => boolean;
    className?: string;
    onRowClick?: (row: T) => void;
    // Opcionales para personalizar el botón de añadir que aparece junto al filtro
    onAddClick?: () => void;
    addButtonText?: string;
    addButtonClassName?: string;
    // Paginación controlada (opcional). Si se provee `externalPage`, la tabla usará
    // ese valor en lugar de su estado interno y llamará a `onExternalPageChange`
    // cuando el usuario cambie de página.
    externalPage?: number;
    onExternalPageChange?: (page: number) => void;
    // Se puede pasar un componente paginador personalizado
    paginator?: React.FC<any>;
    // Si el paginado lo controla el servidor (backend), pasar el total de páginas
    // para que el componente no lo calcule localmente a partir de `data.length`.
    externalTotalPages?: number;
}