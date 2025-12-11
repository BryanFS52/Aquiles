// Re-export types from GraphQL generated file and define additional types

import { Checklist as GQLChecklist, Evaluation as GQLEvaluation } from '@graphql/generated';

// Re-export GraphQL types
export type Checklist = GQLChecklist;
export type Evaluation = GQLEvaluation;

// Value judgment type for evaluations
export type ValueJudgment = 'Excelente' | 'Bueno' | 'Regular' | 'Deficiente' | string;

// Simulated checklist item for UI
export interface SimulatedChecklistItem {
  id: number | string;
  code: string;
  indicator: string;
  active: boolean;
  completed?: boolean | null;
  observations?: string;
  itemType?: {
    id: string;
    name: string;
  };
}

// Instructor checklist state
export interface InstructorChecklistState {
  selectedChecklist: Checklist | null;
  selectedEvaluation: Evaluation | null;
  loading: boolean;
  error: string | null;
  items: SimulatedChecklistItem[];
  itemStates: { [key: string | number]: { completed: boolean | null; observations: string } };
  isFinalSaved: boolean;
  showPreview: boolean;
  showEvaluationForm: boolean;
  evaluationObservations: string;
  evaluationRecommendations: string;
  evaluationJudgment: string;
  evaluationCriteria: boolean | null;
}
