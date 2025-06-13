// Tipo para un elemento de improvement plan individual
export interface ImprovementPlanItem {
    id: string;
    city: string;
    date: string;
    reason: string;
    number: number;
    state: boolean;
    [key: string]: any;
}

// Estado del slice de improvement plans
export interface ImprovementPlanState {
    data: ImprovementPlanItem[];
    loading: boolean;
    error: string | { code?: string; message?: string } | null;
    currentPage: number;
    totalItems: number;
    totalPages: number;
}

// Estado inicial
export const initialImprovementPlanState: ImprovementPlanState = {
    data: [],
    loading: false,
    error: null,
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
};
