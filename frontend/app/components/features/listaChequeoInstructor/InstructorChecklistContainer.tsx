'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle, Phone } from "lucide-react";
import { toast } from "react-toastify";
import PageTitle from "@components/UI/pageTitle";
import EmptyState from "@components/UI/emptyState";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  Checklist,
  Evaluation,
  SimulatedChecklistItem,
} from "@/types/checklist";
import { checkListService } from '@redux/slices/checklistSlice';
import { evaluationService } from '@redux/slices/evaluationSlice';

// Import logic classes
import { InstructorChecklistLogic } from './InstructorChecklistLogic';
import { InstructorChecklistHandlers } from './InstructorChecklistHandlers';

// Import componentized parts
import { InformationCards } from './InformationCards';
import { ChecklistControls } from './ChecklistControls';
import { ChecklistTable } from './ChecklistTable';
import { EvaluationSection } from './EvaluationSection';
import { SignatureUpload } from './SignatureUpload';
import { PreviewModal } from './PreviewModal';
import { CreateEvaluationModal } from './CreateEvaluationModal';

export const InstructorChecklistContainer: React.FC = () => {
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
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [firmaAnterior, setFirmaAnterior] = useState<string | null>(null);
  const [firmaNuevo, setFirmaNuevo] = useState<string | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [evaluationObservations, setEvaluationObservations] = useState<string>("");
  const [evaluationRecommendations, setEvaluationRecommendations] = useState<string>("");
  const [evaluationJudgment, setEvaluationJudgment] = useState<string>("PENDIENTE");
  const [loading, setLoading] = useState<boolean>(true);
  const [itemStates, setItemStates] = useState<{ [key: number]: { completed: boolean | null, observations: string } }>({});
  const [isSavingItems, setIsSavingItems] = useState<boolean>(false);
  const [pendingChanges, setPendingChanges] = useState<boolean>(false);

  // Estados para modales
  const [showCreateEvaluationModal, setShowCreateEvaluationModal] = useState(false);
  const [isCreatingEvaluation, setIsCreatingEvaluation] = useState(false);
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isFinalSaved, setIsFinalSaved] = useState(false);
  
  // Refs
  const signatureUpdateRef = useRef<{ type: string; inProgress: boolean }>({ type: '', inProgress: false });
  const saveItemsDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const selectedChecklistRef = useRef<Checklist | null>(selectedChecklist);

  // Update ref when selectedChecklist changes
  useEffect(() => {
    selectedChecklistRef.current = selectedChecklist;
  }, [selectedChecklist]);

  const itemsPerPage = 3;

  // Wrapper functions que usan las clases lógicas
  const loadExistingSignatures = (checklist: Checklist): void => {
    InstructorChecklistLogic.loadExistingSignatures(
      checklist,
      setFirmaAnterior,
      setFirmaNuevo
    );
  };

  const extractItemStatesFromEvaluation = (evaluation: Evaluation) => {
    return InstructorChecklistLogic.extractItemStatesFromEvaluation(evaluation);
  };

  const extractGeneralObservationsFromEvaluation = (evaluation: Evaluation) => {
    return InstructorChecklistLogic.extractGeneralObservationsFromEvaluation(evaluation);
  };

  const loadActiveChecklists = useCallback(async (): Promise<void> => {
    await InstructorChecklistLogic.loadActiveChecklists(
      selectedChecklistRef.current,
      setLoading,
      setActiveChecklists,
      setSelectedChecklist,
      loadExistingSignatures,
      loadEvaluationsForChecklist
    );
  }, []);

  const loadEvaluationsForChecklist = useCallback(async (checklistId: number): Promise<void> => {
    await InstructorChecklistLogic.loadEvaluationsForChecklist(
      checklistId,
      setEvaluations,
      setSelectedEvaluation,
      setEvaluationObservations,
      setEvaluationRecommendations,
      setEvaluationJudgment,
      setItemStates,
      extractItemStatesFromEvaluation,
      extractGeneralObservationsFromEvaluation
    );
  }, []);

  // Obtener items del checklist seleccionado
  const items = useMemo((): SimulatedChecklistItem[] => {
    if (!selectedChecklist || !selectedChecklist.items) {
      // Simulamos items para el checklist seleccionado si no hay items reales
      return [
        { id: 1, indicator: "El software evidencia autenticación y manejo dinámico de roles.", completed: null, observations: "" },
        { id: 2, indicator: "Aplica en el sistema procedimientos almacenados y/o funciones.", completed: null, observations: "" },
        { id: 3, indicator: "Implementa servicios REST siguiendo estándares.", completed: null, observations: "" },
        { id: 4, indicator: "La aplicación implementa patrones de diseño.", completed: null, observations: "" },
        { id: 5, indicator: "Se evidencia el uso de principios SOLID.", completed: null, observations: "" },
        { id: 6, indicator: "Describe la creación de usuarios y privilegios a nivel de base de datos.", completed: null, observations: "" }
      ];
    }

    // Mapear los items reales del checklist a nuestro formato
    return selectedChecklist.items.map((item, index) => {
      const itemId = parseInt(item.id || (index + 1).toString());
      
      // Obtener el estado desde itemStates (datos de BD) o valores por defecto
      const itemState = itemStates[itemId];
      
      return {
        id: itemId,
        indicator: item.indicator,
        completed: itemState ? itemState.completed : null, // Usar datos de BD si existen
        observations: itemState ? itemState.observations : "" // Usar observaciones de BD si existen
      };
    });
  }, [selectedChecklist, itemStates]);

  // Filtrar checklists por trimestre
  const filteredChecklists = useMemo(() => {
    if (selectedTrimester === "todos") {
      return activeChecklists;
    }
    return activeChecklists.filter((checklist: Checklist) => {
      // Convertir ambos valores a string para comparación consistente
      const checklistTrimester = checklist.trimester?.toString();
      const selectedTrimesterStr = selectedTrimester.toString();
      console.log(`Filtering: checklist ${checklist.id} trimester=${checklistTrimester}, selected=${selectedTrimesterStr}`);
      return checklistTrimester === selectedTrimesterStr;
    });
  }, [activeChecklists, selectedTrimester]);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Handler functions usando las clases lógicas
  const handleTrimesterChange = (value: string): void => {
    InstructorChecklistHandlers.handleTrimesterChange(
      value,
      setSelectedTrimester,
      setCurrentPage
    );
  };

  const handleChecklistChange = async (checklistId: string): Promise<void> => {
    await InstructorChecklistHandlers.handleChecklistChange(
      checklistId,
      activeChecklists,
      setCurrentPage,
      setItemStates,
      setSelectedChecklist,
      setFirmaAnterior,
      setFirmaNuevo,
      setEvaluations,
      setSelectedEvaluation,
      setEvaluationObservations,
      setEvaluationRecommendations,
      setEvaluationJudgment,
      setIsFinalSaved,
      loadExistingSignatures,
      loadEvaluationsForChecklist
    );
  };

  const handleItemChange = (id: number, field: string, value: any): void => {
    InstructorChecklistHandlers.handleItemChange(
      id,
      field,
      value,
      itemStates,
      setItemStates,
      isFinalSaved,
      selectedChecklist,
      setPendingChanges,
      saveItemsDebounceRef,
      selectedEvaluation,
      handleAutoSaveItems
    );
  };

  const handleAutoSaveItems = async (currentItemStates: any): Promise<void> => {
    await InstructorChecklistHandlers.handleAutoSaveItems(
      currentItemStates,
      selectedEvaluation,
      selectedChecklist,
      evaluationObservations,
      evaluationRecommendations,
      evaluationJudgment,
      setIsSavingItems,
      setPendingChanges
    );
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const handleSaveChecklist = async (): Promise<void> => {
    setShowPreview(true);
  };

  const handleEnableModification = (): void => {
    setIsFinalSaved(false);
    if (selectedChecklist) {
      localStorage.removeItem(`isFinalSaved_${selectedChecklist.id}`);
    }
    toast.info("📝 Modo de edición habilitado.");
  };

  const handleExportPDF = async (): Promise<void> => {
    if (selectedChecklist) {
      await InstructorChecklistLogic.exportToPDF(selectedChecklist);
    }
  };

  const handleExportExcel = async (): Promise<void> => {
    if (selectedChecklist) {
      await InstructorChecklistLogic.exportToExcel(selectedChecklist);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<string | null>>
  ): Promise<void> => {
    await InstructorChecklistHandlers.handleFileUpload(
      event,
      setFile,
      isFinalSaved
    );
  };

  // Evaluation handlers
  const handleUpdateEvaluationClick = () => {
    setShowEvaluationForm(true);
  };

  const handleCancelUpdate = () => {
    setShowEvaluationForm(false);
  };

  const handleCompleteEvaluation = async (): Promise<void> => {
    await InstructorChecklistHandlers.handleCompleteEvaluation(
      selectedEvaluation,
      selectedChecklist,
      evaluationObservations,
      evaluationRecommendations,
      evaluationJudgment,
      itemStates,
      setSelectedEvaluation,
      setEvaluations,
      setShowEvaluationForm,
      setPendingChanges
    );
  };

  const handleCreateEvaluationFromModal = async () => {
    await InstructorChecklistHandlers.handleCreateEvaluationFromModal(
      selectedChecklist,
      evaluationObservations,
      evaluationRecommendations,
      evaluationJudgment,
      itemStates,
      selectedTeamScrumId,
      setIsCreatingEvaluation,
      setSelectedEvaluation,
      setEvaluations,
      setShowCreateEvaluationModal,
      setPendingChanges
    );
  };

  const handleEvaluationFieldChange = (field: string, value: string) => {
    InstructorChecklistHandlers.handleEvaluationFieldChange(
      field,
      value,
      setEvaluationObservations,
      setEvaluationRecommendations,
      setEvaluationJudgment,
      isFinalSaved,
      selectedChecklist,
      evaluationObservations,
      evaluationRecommendations,
      evaluationJudgment,
      setPendingChanges
    );
  };

  const handleOpenCreateEvaluationModal = () => {
    setShowCreateEvaluationModal(true);
  };

  const handleCloseCreateEvaluationModal = () => {
    setShowCreateEvaluationModal(false);
  };

  // Preview handlers
  const generatePreviewData = () => {
    if (!selectedChecklist) return null;

    const updatedItems = items.map(item => {
      const itemState = itemStates[item.id] || { completed: item.completed, observations: item.observations };
      return {
        ...item,
        completed: itemState.completed,
        observations: itemState.observations
      };
    });

    return {
      checklist: selectedChecklist,
      items: updatedItems,
      evaluation: {
        observations: evaluationObservations,
        recommendations: evaluationRecommendations,
        judgment: evaluationJudgment
      },
      hasEvaluationData: evaluationObservations.trim() || evaluationRecommendations.trim() || (evaluationJudgment && evaluationJudgment !== "PENDIENTE")
    };
  };

  const handleBackToEdit = (): void => {
    setShowPreview(false);
  };

  const handleFinalSave = async (): Promise<void> => {
    try {
      toast.info("💾 Guardando lista de chequeo definitivamente...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsFinalSaved(true);
      setShowPreview(false);

      if (selectedChecklist) {
        localStorage.setItem(`isFinalSaved_${selectedChecklist.id}`, 'true');
        localStorage.removeItem(`evaluationData_${selectedChecklist.id}`);
        localStorage.removeItem(`itemStates_${selectedChecklist.id}`);
      }

      toast.success("✅ Lista de chequeo guardada definitivamente!");
    } catch (error) {
      console.error("Error saving checklist:", error);
      toast.error("❌ Error al guardar la lista de chequeo definitivamente");
    }
  };

  const handleBackToSelection = () => {
    localStorage.removeItem('selectedChecklistId');
    if (selectedChecklist) {
      localStorage.removeItem(`itemStates_${selectedChecklist.id}`);
      localStorage.removeItem(`evaluationData_${selectedChecklist.id}`);
    }
    toast.info("Regresando a la selección de TeamScrum...");
    router.push('/dashboard/InstructorSelection');
  };

  // Simplified useEffects - you would implement the full logic here
  useEffect(() => {
    setIsClientMounted(true);
    const savedTrimester = localStorage.getItem('selectedTrimester');
    if (savedTrimester) {
      setSelectedTrimester(savedTrimester);
    }
  }, []);

  useEffect(() => {
    if (!isClientMounted) return;
    
    const teamScrumId = localStorage.getItem('selectedTeamScrumId');
    const teamScrumName = localStorage.getItem('selectedTeamScrumName');
    const studySheetNumber = localStorage.getItem('selectedStudySheetNumber');
    const studySheetId = localStorage.getItem('selectedStudySheetId');
    
    if (teamScrumId && teamScrumName) {
      setSelectedTeamScrumId(teamScrumId);
      setSelectedTeamScrumName(teamScrumName);
      setSelectedStudySheetNumber(studySheetNumber || "");
      setSelectedStudySheetId(studySheetId || "");
    } else {
      console.log('❌ No hay team scrum seleccionado, redirigiendo a selección');
      window.location.href = '/dashboard/InstructorSelection';
    }
  }, [isClientMounted]);

  // Cargar listas de chequeo activas después de que se establezca la información del instructor
  useEffect(() => {
    if (isClientMounted && selectedStudySheetId && selectedTeamScrumId) {
      console.log('🔄 Loading checklists for instructor sheet:', { id: selectedStudySheetId, number: selectedStudySheetNumber });
      loadActiveChecklists();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClientMounted, selectedStudySheetId, selectedTeamScrumId]);

  // Mostrar loader durante la hidratación del cliente
  if (!isClientMounted) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-[#5cb800] dark:border-blue-500 border-t-transparent rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      {/* Estilos CSS para el diseño hexagonal */}
      <style jsx>{`
        /* Estilos para los hexágonos y diseño */
        .hexagon-container {
          width: 250px;
          height: 250px;
          position: relative;
        }
        
        .hexagon {
          width: 100%;
          height: 100%;
          position: relative;
          border-radius: 20px;
          transform: rotate(45deg);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hexagon:hover {
          transform: rotate(45deg) scale(1.05);
        }
        
        .hexagon-inner {
          width: calc(100% - 8px);
          height: calc(100% - 8px);
          position: absolute;
          top: 4px;
          left: 4px;
          border-radius: 16px;
          transform: rotate(-45deg);
          transition: all 0.3s ease;
        }
        
        .hexagon-inner:hover {
          transform: rotate(-45deg) scale(0.98);
        }
        
        /* Animación de flotación para los hexágonos */
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(45deg); }
          50% { transform: translateY(-10px) rotate(45deg); }
        }
        
        .hexagon-container:hover .hexagon {
          animation: float 2s ease-in-out infinite;
        }
        
        /* Estilos para inputs hexagonales */
        .hexagon-input:focus {
          transform: scale(1.02);
          box-shadow: 0 10px 30px rgba(1, 176, 1, 0.3);
        }
        
        /* Estilos para botones hexagonales */
        .hexagon-button:hover:not(:disabled) {
          box-shadow: 0 15px 40px rgba(1, 176, 1, 0.4);
        }
        
        .hexagon-export:hover:not(:disabled) {
          box-shadow: 0 15px 40px rgba(1, 176, 1, 0.3);
        }
        
        /* Estilos para manejo de texto largo en evaluaciones */
        .evaluation-text {
          word-wrap: break-word;
          word-break: break-word;
          overflow-wrap: break-word;
          white-space: pre-wrap;
          hyphens: auto;
          -webkit-hyphens: auto;
          -moz-hyphens: auto;
          -ms-hyphens: auto;
          max-width: 100%;
          overflow-x: hidden;
        }
        
        /* Soporte para navegadores más antiguos */
        .evaluation-text {
          -ms-word-break: break-all;
          word-break: break-all;
          word-break: break-word;
          -webkit-hyphens: auto;
          -moz-hyphens: auto;
          hyphens: auto;
        }
      `}</style>

      {/* Contenido principal con diseño tipo panal */}
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <PageTitle>Lista de Chequeo - Vista del Instructor</PageTitle>
            
            {/* Indicador de guardado automático */}
            {isSavingItems ? (
              <div className="flex items-center space-x-2 px-3 py-1 bg-[#5cb800]/10 dark:bg-blue-900/30 rounded-full border border-[#5cb800]/30 dark:border-blue-600">
                <div className="animate-spin w-4 h-4 border-2 border-[#5cb800] dark:border-blue-500 border-t-transparent rounded-full"></div>
                <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  Guardando cambios...
                </span>
              </div>
            ) : pendingChanges ? (
              <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full border border-yellow-300 dark:border-yellow-600">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
                  Cambios pendientes
                </span>
              </div>
            ) : selectedEvaluation && Object.keys(itemStates).length > 0 ? (
              <div className="flex items-center space-x-2 px-3 py-1 bg-[#5cb800]/10 dark:bg-blue-900/30 rounded-full border border-[#5cb800]/30 dark:border-blue-600">
                <div className="w-2 h-2 bg-[#5cb800] dark:bg-blue-500 rounded-full"></div>
                <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  Cambios guardados
                </span>
              </div>
            ) : null}
          </div>
          
          {/* Botón para volver a la selección de TeamScrum */}
          <button
            onClick={handleBackToSelection}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Cambiar Team Scrum</span>
          </button>
        </div>

        {/* Cards de información específica */}
        <InformationCards
          selectedTeamScrumName={selectedTeamScrumName}
          selectedStudySheetNumber={selectedStudySheetNumber}
          selectedChecklist={selectedChecklist}
        />

        {/* Controles de filtros y acciones */}
        <ChecklistControls
          selectedTrimester={selectedTrimester}
          filteredChecklists={filteredChecklists}
          selectedChecklist={selectedChecklist}
          activeChecklists={activeChecklists}
          isFinalSaved={isFinalSaved}
          onTrimesterChange={handleTrimesterChange}
          onChecklistChange={handleChecklistChange}
          onSaveChecklist={handleSaveChecklist}
          onEnableModification={handleEnableModification}
          onExportPDF={handleExportPDF}
          onExportExcel={handleExportExcel}
        />

        {/* Estados de carga y vacío */}
        {loading ? (
          <EmptyState 
            message="Cargando listas de chequeo activas..."
          />
        ) : filteredChecklists.length === 0 ? (
          <EmptyState 
            message={selectedTrimester === "todos" 
              ? "No hay listas de chequeo activas disponibles. Las listas de chequeo deben ser activadas desde la vista del coordinador" 
              : `No hay listas de chequeo activas para el trimestre ${selectedTrimester}. Las listas de chequeo deben ser activadas desde la vista del coordinador`}
          />
        ) : !selectedChecklist ? (
          <EmptyState 
            message="Selecciona una lista de chequeo para comenzar la evaluación"
          />
        ) : (
          <>
            {/* DataTable con diseño moderno */}
            <ChecklistTable
              items={items}
              currentItems={currentItems}
              itemStates={itemStates}
              currentPage={currentPage}
              totalPages={totalPages}
              isFinalSaved={isFinalSaved}
              onItemChange={handleItemChange}
              onPageChange={handlePageChange}
            />

            {/* Sección de Evaluación */}
            <EvaluationSection
              selectedChecklist={selectedChecklist}
              selectedEvaluation={selectedEvaluation}
              showEvaluationForm={showEvaluationForm}
              evaluationObservations={evaluationObservations}
              evaluationRecommendations={evaluationRecommendations}
              evaluationJudgment={evaluationJudgment}
              isFinalSaved={isFinalSaved}
              onUpdateClick={handleUpdateEvaluationClick}
              onCancelUpdate={handleCancelUpdate}
              onCompleteEvaluation={handleCompleteEvaluation}
              onCreateEvaluation={handleOpenCreateEvaluationModal}
              onFieldChange={handleEvaluationFieldChange}
              extractGeneralObservationsFromEvaluation={extractGeneralObservationsFromEvaluation}
            />

            {/* Sección de Firmas */}
            <SignatureUpload
              firmaAnterior={firmaAnterior}
              firmaNuevo={firmaNuevo}
              isFinalSaved={isFinalSaved}
              onFileUpload={handleFileUpload}
              setFirmaAnterior={setFirmaAnterior}
              setFirmaNuevo={setFirmaNuevo}
            />
          </>
        )}
      </div>

      {/* Modal de Vista Previa */}
      <PreviewModal
        showPreview={showPreview}
        selectedChecklist={selectedChecklist}
        generatePreviewData={generatePreviewData}
        onBackToEdit={handleBackToEdit}
        onFinalSave={handleFinalSave}
      />

      {/* Modal para crear evaluación */}
      <CreateEvaluationModal
        showModal={showCreateEvaluationModal}
        selectedChecklist={selectedChecklist}
        evaluationObservations={evaluationObservations}
        evaluationRecommendations={evaluationRecommendations}
        evaluationJudgment={evaluationJudgment}
        isFinalSaved={isFinalSaved}
        isCreating={isCreatingEvaluation}
        onClose={handleCloseCreateEvaluationModal}
        onCreate={handleCreateEvaluationFromModal}
        onFieldChange={handleEvaluationFieldChange}
      />
    </div>
  );
};