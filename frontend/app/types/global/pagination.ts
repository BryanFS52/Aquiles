// Types/general.types.ts

// Tipo general para paginación que se puede reutilizar
export interface PaginationState {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
}

export interface PaginationHandlers {
    onPageChange: (page: number) => void;
    onNextPage: () => void;
    onPrevPage: () => void;
    onFirstPage: () => void;
    onLastPage: () => void;
}

export interface PaginationProps extends PaginationState, PaginationHandlers {
    showInfo?: boolean;
    showFirstLast?: boolean;
    maxVisiblePages?: number;
}

// Tipo genérico para elementos paginables
export interface PaginatedData<T> {
    items: T[];
    pagination: PaginationState;
}

// Tipo para respuestas de API paginadas
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}