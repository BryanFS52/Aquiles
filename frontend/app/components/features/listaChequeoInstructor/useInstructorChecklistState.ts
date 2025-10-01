import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { checkListService } from "@redux/slices/checklistSlice";
import { evaluationService } from "@redux/slices/evaluationSlice";
import { exportService } from "@redux/slices/exportSlice";
import {
  Checklist,
  Evaluation,
  SimulatedChecklistItem,
} from "@/types/checklist";

export const useInstructorChecklistState = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux selectors
  const evaluationState = useSelector((state: RootState) => state.evaluation);
  const checklistState = useSelector((state: RootState) => state.checklist);
  const reduxError = evaluationState.error || checklistState.error;
  
  // Estados principales
  const [activeChecklists, setActiveChecklists] = useState<Checklist[]>([]);
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(null);
  const [selectedTrimester, setSelectedTrimester] = useState<string>("todos");
  const [isClientMounted, setIsClientMounted] = useState(false);
  
  // Estados para el team scrum seleccionado
  const [selectedTeamScrumId, setSelectedTeamScrumId] = useState<string | null>(null);
  const [selectedTeamScrumName, setSelectedTeamScrumName] = useState<string>("");
  const [selectedStudySheetNumber, setSelectedStudySheetNumber] = useState<string>("");
  const [selectedStudySheetId, setSelectedStudySheetId] = useState<string>("");
  
  // Estados de paginación y UI
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSavingItems, setIsSavingItems] = useState<boolean>(false);
  const [pendingChanges, setPendingChanges] = useState<boolean>(false);
  
  // Estados de firmas
  const [firmaAnterior, setFirmaAnterior] = useState<string | null>(null);
  const [firmaNuevo, setFirmaNuevo] = useState<string | null>(null);
  const [isSignatureUpdate, setIsSignatureUpdate] = useState(false);
  
  // Estados de evaluaciones
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [evaluationObservations, setEvaluationObservations] = useState<string>("");
  const [evaluationRecommendations, setEvaluationRecommendations] = useState<string>("");
  const [evaluationJudgment, setEvaluationJudgment] = useState<string>("PENDIENTE");
  
  // Estados de modales
  const [showCreateEvaluationModal, setShowCreateEvaluationModal] = useState(false);
  const [isCreatingEvaluation, setIsCreatingEvaluation] = useState(false);
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isFinalSaved, setIsFinalSaved] = useState(false);
  
  // Estados de items
  const [itemStates, setItemStates] = useState<{ [key: number]: { completed: boolean | null, observations: string } }>({});
  
  // Refs
  const signatureUpdateRef = useRef<{ type: string; inProgress: boolean }>({ type: '', inProgress: false });
  const saveItemsDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const itemsPerPage = 3;

  return {
    // Router y dispatch
    router,
    dispatch,
    
    // Redux state
    evaluationState,
    checklistState,
    reduxError,
    
    // Estados principales
    activeChecklists,
    setActiveChecklists,
    selectedChecklist,
    setSelectedChecklist,
    selectedTrimester,
    setSelectedTrimester,
    isClientMounted,
    setIsClientMounted,
    
    // Team scrum
    selectedTeamScrumId,
    setSelectedTeamScrumId,
    selectedTeamScrumName,
    setSelectedTeamScrumName,
    selectedStudySheetNumber,
    setSelectedStudySheetNumber,
    selectedStudySheetId,
    setSelectedStudySheetId,
    
    // UI states
    currentPage,
    setCurrentPage,
    loading,
    setLoading,
    isSavingItems,
    setIsSavingItems,
    pendingChanges,
    setPendingChanges,
    
    // Firmas
    firmaAnterior,
    setFirmaAnterior,
    firmaNuevo,
    setFirmaNuevo,
    isSignatureUpdate,
    setIsSignatureUpdate,
    
    // Evaluaciones
    evaluations,
    setEvaluations,
    selectedEvaluation,
    setSelectedEvaluation,
    evaluationObservations,
    setEvaluationObservations,
    evaluationRecommendations,
    setEvaluationRecommendations,
    evaluationJudgment,
    setEvaluationJudgment,
    
    // Modales
    showCreateEvaluationModal,
    setShowCreateEvaluationModal,
    isCreatingEvaluation,
    setIsCreatingEvaluation,
    showEvaluationForm,
    setShowEvaluationForm,
    showPreview,
    setShowPreview,
    isFinalSaved,
    setIsFinalSaved,
    
    // Items
    itemStates,
    setItemStates,
    
    // Refs
    signatureUpdateRef,
    saveItemsDebounceRef,
    
    // Constants
    itemsPerPage,
  };
};
