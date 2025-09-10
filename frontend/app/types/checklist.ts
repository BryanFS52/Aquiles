// Tipos para Checklist y Evaluation basados en el esquema GraphQL
export interface ChecklistItem {
  id?: string;
  code?: string;
  indicator: string;
  active?: boolean;
}

export interface Evaluation {
  id: string;
  observations?: string;
  recommendations?: string;
  valueJudgment?: string;
  checklistId: number;
  teamScrumId?: number;
}

export interface Checklist {
  id: string;
  state: boolean;
  remarks?: string;
  trimester?: string;
  component?: string;
  instructorSignature?: string;
  evaluationCriteria?: boolean;
  studySheets?: string;
  trainingProjectId?: number;
  trainingProjectName?: string;
  evaluations?: Evaluation[];
  items?: ChecklistItem[];
  associatedJuries?: any[];
}

export interface ChecklistPage {
  code: string;
  data: Checklist[];
  date?: string;
  totalPages?: number;
  totalItems?: number;
  currentPage?: number;
  message?: string;
}

export interface ChecklistPageId {
  data: Checklist;
  date?: string;
  code: string;
  message?: string;
}

export interface EvaluationPage {
  code: string;
  data: Evaluation[];
  date?: string;
  totalPages?: number;
  totalItems?: number;
  currentPage?: number;
  message?: string;
}

export interface EvaluationPageId {
  data: Evaluation;
  date?: string;
  code: string;
  message?: string;
}

// Tipos para inputs
export interface ChecklistDto {
  state: boolean;
  remarks: string;
  trimester: string;
  component?: string;
  instructorSignature: string;
  evaluationCriteria: boolean;
  studySheets?: string;
  trainingProjectId?: number;
  evaluations?: EvaluationDto[];
  items?: ItemDto[];
  associatedJuries?: number[];
  deletedItemIds?: number[]; // ← Campo para IDs de items a eliminar
}

export interface EvaluationDto {
  observations?: string;
  recommendations?: string;
  valueJudgment?: string;
  checklistId: number;
  teamScrumId?: number;
}

export interface ItemDto {
  id?: number; // ← Agregar ID para items existentes
  code?: string;
  indicator: string;
  active?: boolean;
}

// Tipos para respuestas de servicios
export interface ApiResponse {
  code: string;
  message?: string;
  id?: string;
  data?: any;
}

// Enums para juicios de valor
export enum ValueJudgment {
  EXCELENTE = "EXCELENTE",
  BUENO = "BUENO",
  ACEPTABLE = "ACEPTABLE",
  DEFICIENTE = "DEFICIENTE",
  RECHAZADO = "RECHAZADO",
  PENDIENTE = "PENDIENTE"
}

// Tipos para el estado del componente
export interface InstructorChecklistState {
  activeChecklists: Checklist[];
  selectedChecklist: Checklist | null;
  selectedTrimester: string;
  selectedTrimestre: string;
  currentPage: number;
  firmaAnterior: string | null;
  firmaNuevo: string | null;
  evaluations: Evaluation[];
  selectedEvaluation: Evaluation | null;
  evaluationObservations: string;
  evaluationRecommendations: string;
  evaluationJudgment: string;
  loading: boolean;
}

// Tipos para items simulados
export interface SimulatedChecklistItem {
  id: number;
  indicator: string;
  completed: boolean | null;
  observations: string;
}
