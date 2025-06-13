// Tipo para un elemento de checklist individual
export interface ChecklistItem {
    id: string;
    // Agrega aquí los campos específicos de ChecklistItem
    [key: string]: any;
}

// Estado del slice de checklists
export interface ChecklistState {
    data: ChecklistItem[];
    loading: boolean;
    error: string | { code?: string; message?: string } | null;
    currentPage: number;
    totalItems: number;
    totalPages: number;
}

// Estado inicial
export const initialChecklistState: ChecklistState = {
    data: [],
    loading: false,
    error: null,
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
};
