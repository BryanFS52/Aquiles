// Types for Lista Chequeo Instructor module
import { 
  Checklist, 
  Evaluation, 
  SimulatedChecklistItem, 
  InstructorChecklistState, 
  ValueJudgment 
} from "@type/checklist";

// Base component props interfaces
export interface InformationCardsProps {
  selectedTeamScrumName: string;
  selectedStudySheetNumber: string;
  selectedChecklist: Checklist | null;
}

export interface ChecklistTableProps {
  items: SimulatedChecklistItem[];
  currentItems: SimulatedChecklistItem[];
  itemStates: { [key: string | number]: { completed: boolean | null, observations: string } };
  currentPage: number;
  totalPages: number;
  isFinalSaved: boolean;
  onItemChange: (id: number | string, field: string, value: any) => void;
  onPageChange: (page: number) => void;
}

export interface EvaluationSectionProps {
  selectedChecklist: Checklist | null;
  selectedEvaluation: Evaluation | null;
  showEvaluationForm: boolean;
  evaluationObservations: string;
  evaluationRecommendations: string;
  evaluationJudgment: string;
  evaluationCriteria: boolean | null;
  isFinalSaved: boolean;
  onUpdateClick: () => void;
  onCancelUpdate: () => void;
  onCompleteEvaluation: () => Promise<void>;
  onCreateEvaluation: () => void;
  onFieldChange: (field: string, value: string | boolean) => void;
  extractGeneralObservationsFromEvaluation: (evaluation: Evaluation) => string;
}

export interface SignatureUploadProps {
  firmaAnterior: string | null;
  firmaNuevo: string | null;
  isFinalSaved: boolean;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<string | null>>) => Promise<void>;
  setFirmaAnterior: React.Dispatch<React.SetStateAction<string | null>>;
  setFirmaNuevo: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface PreviewModalProps {
  showPreview: boolean;
  selectedChecklist: Checklist | null;
  generatePreviewData: () => any;
  onBackToEdit: () => void;
  onFinalSave: () => Promise<void>;
}

export interface CreateEvaluationModalProps {
  showModal: boolean;
  selectedChecklist: Checklist | null;
  evaluationObservations: string;
  evaluationRecommendations: string;
  evaluationJudgment: string;
  evaluationCriteria: boolean | null;
  isFinalSaved: boolean;
  isCreating: boolean;
  onClose: () => void;
  onCreate: () => Promise<void>;
  onFieldChange: (field: string, value: string | boolean) => void;
}

export interface ChecklistControlsProps {
  selectedTrimester: string;
  filteredChecklists: Checklist[];
  selectedChecklist: Checklist | null;
  activeChecklists: Checklist[];
  isFinalSaved: boolean;
  onTrimesterChange: (value: string) => void;
  onChecklistChange: (checklistId: string) => Promise<void>;
  onSaveChecklist: () => Promise<void>;
  onEnableModification: () => void;
  onExportPDF: () => Promise<void>;
  onExportExcel: () => Promise<void>;
}

// Main container props interface
export interface InstructorChecklistContainerProps {
  // This will be a standalone component, so no specific props needed
}

// Additional utility types
export interface ItemState {
  completed: boolean | null;
  observations: string;
}

export interface EvaluationData {
  observations: string;
  recommendations: string;
  judgment: string;
}

export interface PreviewData {
  checklist: Checklist;
  items: SimulatedChecklistItem[];
  evaluation: EvaluationData;
  hasEvaluationData: boolean;
}