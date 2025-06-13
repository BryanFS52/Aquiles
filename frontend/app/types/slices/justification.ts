// Tipos para el slice de justifications
export interface JustificationItem {
    id: string;
    documentNumber: string;
    name: string;
    description: string;
    justificationFile: string;
    justificationDate: Date;
    justificationHistory: String;
    state: boolean;
    archivoAdjunto: string;
    archivoMime: string;
}

export interface JustificationState {
    data: JustificationItem[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    loading: boolean;
    error: {
        code: string;
        message: string;
    } | string | null;
    selectedFiltro: string;
    searchTerm: string;
    itemsPerPage: number;
    filteredData: JustificationItem[];
}

export interface DownloadFilePayload {
    base64Data: string;
    fileName: string;
    mimeType?: string;
}
// Tipos para filtros
export type FiltroType = "programa" | "ficha" | "documento" | "aprendiz" | "fecha" | "";

// Estado inicial tipado
export const initialJustificationState: JustificationState = {
    data: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    loading: false,
    error: null,
    selectedFiltro: "",
    searchTerm: "",
    itemsPerPage: 6,
    filteredData: [],
};