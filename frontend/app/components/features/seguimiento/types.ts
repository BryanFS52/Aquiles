/**
 * Types para el módulo de Seguimiento
 * Define las interfaces y tipos utilizados en los componentes
 */

import { StudySheetWithCompetence } from "@/components/features/fichasInstructor";

// ============================================================================
// Component Props Types
// ============================================================================

export interface StudySheetCardProps {
    /** Datos de la ficha de estudio */
    studySheet: StudySheetWithCompetence;
    /** Índice de la tarjeta para animaciones escalonadas */
    index: number;
    /** Callback opcional cuando se navega a la ficha */
    onNavigate?: (studySheet: StudySheetWithCompetence) => void;
}

export interface StudySheetGridProps {
    /** Array de fichas de estudio a mostrar */
    studySheets: StudySheetWithCompetence[];
    /** Indica si los datos están cargando */
    loading?: boolean;
    /** Mensaje de error si existe */
    error?: string | null;
    /** Callback para navegación desde las tarjetas */
    onCardNavigate?: (studySheet: StudySheetWithCompetence) => void;
}

export interface StudySheetHeaderProps {
    /** Título principal del dashboard */
    title: string;
    /** Subtítulo o descripción */
    subtitle?: string;
    /** Valor actual del campo de búsqueda */
    searchValue?: string;
    /** Callback cuando cambia el valor de búsqueda */
    onSearchChange?: (value: string) => void;
    /** Total de items para mostrar en el contador */
    totalItems?: number;
}

// ============================================================================
// UI Component Props Types
// ============================================================================

export interface InfoRowProps {
    /** Icono a mostrar */
    icon: React.ReactNode;
    /** Etiqueta descriptiva */
    label: string;
    /** Valor a mostrar */
    value: string;
}

export interface DateInfoProps {
    /** Etiqueta de la fecha */
    label: string;
    /** Fecha formateada */
    date: string;
    /** Tipo de fecha para aplicar estilos */
    type: 'start' | 'end';
}

// ============================================================================
// Filter Types
// ============================================================================

export type FilterField =
    | 'programName'
    | 'fichaNumber'
    | 'journey'
    | 'offer'
    | 'quarter'
    | 'state';

export interface FilterOptions {
    /** Campo por el que filtrar */
    field: FilterField;
    /** Valor de búsqueda */
    value: string;
}

export interface SortOptions {
    /** Campo por el que ordenar */
    field: FilterField;
    /** Dirección del ordenamiento */
    direction: 'asc' | 'desc';
}

// ============================================================================
// Status Types
// ============================================================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface UIState {
    /** Estado de carga actual */
    loadingState: LoadingState;
    /** Mensaje de error si existe */
    errorMessage?: string;
    /** Indica si hay una búsqueda activa */
    isSearching: boolean;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Tipo helper para extraer valores opcionales de forma segura
 */
export type SafeString<T> = T extends string ? T : never;

/**
 * Tipo para formateo de fechas
 */
export type DateFormat = 'short' | 'long' | 'iso';

/**
 * Opciones de formato de fecha
 */
export interface DateFormatOptions {
    format: DateFormat;
    locale?: string;
}

// ============================================================================
// Event Handler Types
// ============================================================================

export type SearchChangeHandler = (value: string) => void;
export type CardNavigateHandler = (studySheet: StudySheetWithCompetence) => void;
export type FilterChangeHandler = (filters: FilterOptions[]) => void;
export type SortChangeHandler = (sort: SortOptions) => void;

// ============================================================================
// Constants
// ============================================================================

export const DEFAULT_PAGE_SIZE = 50;
export const SEARCH_DEBOUNCE_MS = 300;
export const ANIMATION_STAGGER_MS = 100;

/**
 * Colores del sistema SENA
 */
export const SENA_COLORS = {
    primary: '#398F0F',
    lightGreen: '#39A900',
    secondary: '#00304D',
    darkBlue: '#005386',
    lightGray: '#E4E4E5',
    darkGray: '#5e5c5c',
    darkGreen: '#007832',
    darkBackground: '#001829',
} as const;

export type SenaColor = keyof typeof SENA_COLORS;
