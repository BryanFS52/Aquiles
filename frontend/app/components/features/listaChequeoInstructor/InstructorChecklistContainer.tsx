'use client'

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useLazyQuery } from "@apollo/client";
import { AppDispatch, RootState } from '@redux/store';
import { fetchChecklists } from '@redux/slices/checklistSlice';
import { fetchStudySheetWithTeamScrum } from '@redux/slices/olympo/studySheetSlice';
import { fetchTeamScrumById } from '@redux/slices/teamScrumSlice';
import { addEvaluation, updateEvaluation } from '@redux/slices/evaluationSlice';
import { 
  SAVE_OR_UPDATE_CHECKLIST_QUALIFICATION,
  GET_CHECKLIST_QUALIFICATIONS_BY_CHECKLIST 
} from '@graphql/checklistQualificationGraph';
import PageTitle from "@components/UI/pageTitle";
import { InformationCards } from './InformationCards';
import { ChecklistControls } from './ChecklistControls';
import { ChecklistTable } from './ChecklistTable';
import { EvaluationSection } from './EvaluationSection';
import { CreateEvaluationModal } from './CreateEvaluationModal';
import { PreviewModal } from './PreviewModal';
import { Checklist, StudySheet, TeamsScrum } from '@graphql/generated';
import { toast } from 'react-toastify';

export const InstructorChecklistContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: checklists, loading, error } = useSelector((state: RootState) => state.checklist);
  const { data: studySheets } = useSelector((state: RootState) => state.studySheet);
  const { dataForTeamScrumById: selectedTeamScrum } = useSelector((state: RootState) => state.teamScrum);
  
  // Mutations y queries
  const [saveOrUpdateQualification] = useMutation(SAVE_OR_UPDATE_CHECKLIST_QUALIFICATION);
  const [loadQualifications, { data: qualificationsData }] = useLazyQuery(GET_CHECKLIST_QUALIFICATIONS_BY_CHECKLIST);
  
  // Estados locales
  const [selectedTrimester, setSelectedTrimester] = useState<string>("");
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(null);
  const [selectedStudySheet, setSelectedStudySheet] = useState<StudySheet | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFinalSaved, setIsFinalSaved] = useState(false);
  const [itemStates, setItemStates] = useState<{ [key: number]: { completed: boolean | null, observations: string } }>({});

  // Estados para la evaluación
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [showCreateEvaluationModal, setShowCreateEvaluationModal] = useState(false);
  const [evaluationObservations, setEvaluationObservations] = useState("");
  const [evaluationRecommendations, setEvaluationRecommendations] = useState("");
  const [evaluationJudgment, setEvaluationJudgment] = useState("");
  const [evaluationCriteria, setEvaluationCriteria] = useState<boolean | null>(null);
  const [isCreatingEvaluation, setIsCreatingEvaluation] = useState(false);

  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchChecklists({ page: 0, size: 50 }));
  }, [dispatch]);

  // Cargar calificaciones cuando se selecciona un checklist y teamScrum
  useEffect(() => {
    const loadChecklistQualifications = async () => {
      if (selectedChecklist && selectedTeamScrum) {
        try {
          const result = await loadQualifications({
            variables: {
              checklistId: parseInt(selectedChecklist.id as string),
              teamScrumId: parseInt(selectedTeamScrum.id as string)
            }
          });

          if (result.data?.checklistQualificationsByChecklist) {
            const qualifications = result.data.checklistQualificationsByChecklist;
            
            // Mapear las calificaciones a itemStates
            const newItemStates: { [key: number]: { completed: boolean | null, observations: string } } = {};
            
            // Inicializar todos los items
            selectedChecklist.items?.forEach((item: any) => {
              if (item && item.id) {
                newItemStates[item.id] = {
                  completed: null,
                  observations: ""
                };
              }
            });

            // Sobrescribir con las calificaciones existentes
            qualifications.forEach((qual: any) => {
              if (qual.itemId) {
                newItemStates[qual.itemId] = {
                  completed: qual.qualificationState,
                  observations: qual.observations || ""
                };
              }
            });

            setItemStates(newItemStates);
          }
        } catch (error) {
          console.error("Error al cargar calificaciones:", error);
        }
      }
    };

    loadChecklistQualifications();
  }, [selectedChecklist, selectedTeamScrum, loadQualifications]);

  // Obtener trimestres únicos dinámicamente de las listas creadas por el coordinador
  const availableTrimester = useMemo(() => {
    const trimesters = checklists
      .map((checklist: Checklist) => checklist.trimester)
      .filter((trimester: string | null | undefined): trimester is string => Boolean(trimester))
      .filter((trimester: string, index: number, array: string[]) => array.indexOf(trimester) === index);
    
    return trimesters.sort();
  }, [checklists]);

  // Listas filtradas por trimestre
  const filteredChecklists = useMemo(() => {
    if (!selectedTrimester) return checklists;
    return checklists.filter((checklist: Checklist) => checklist.trimester === selectedTrimester);
  }, [checklists, selectedTrimester]);

  const activeChecklists = useMemo(() => {
    return checklists.filter((checklist: Checklist) => checklist.state === true);
  }, [checklists]);

  // Items paginados
  const currentItems = useMemo(() => {
    if (!selectedChecklist?.items) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return selectedChecklist.items.slice(startIndex, startIndex + itemsPerPage);
  }, [selectedChecklist, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    if (!selectedChecklist?.items) return 0;
    return Math.ceil(selectedChecklist.items.length / itemsPerPage);
  }, [selectedChecklist, itemsPerPage]);

  // Funciones de manejo
  const handleChecklistChange = async (checklistId: string) => {
    if (!checklistId) {
      setSelectedChecklist(null);
      setSelectedStudySheet(null);
      setItemStates({});
      setCurrentPage(1);
      return;
    }
    
    const checklist = checklists.find((c: Checklist) => c.id === checklistId);
    if (checklist) {
      console.log("🔍 Checklist seleccionado:", checklist);
      
      setSelectedChecklist(checklist);
      setCurrentPage(1);
      
      // Cargar información de la ficha de estudio asociada
      if (checklist.studySheets) {
        try {
          const studySheetResponse = await dispatch(fetchStudySheetWithTeamScrum({ 
            id: parseInt(checklist.studySheets) 
          })).unwrap();
          
          if (studySheetResponse?.data) {
            setSelectedStudySheet(studySheetResponse.data as StudySheet);
            
            // Si la ficha tiene equipos scrum, obtener el primero (o el seleccionado)
            const teams = (studySheetResponse.data as StudySheet).teamsScrum;
            if (teams && teams.length > 0 && teams[0]?.id) {
              await dispatch(fetchTeamScrumById({ id: teams[0].id }));
            }
          }
        } catch (error) {
          console.error("Error al cargar ficha de estudio:", error);
        }
      }
      
      // Cargar datos de evaluación si existe
      const evaluation = (checklist as any).evaluations;
      
      if (evaluation) {
        setEvaluationObservations(evaluation.observations || "");
        setEvaluationRecommendations(evaluation.recommendations || "");
        setEvaluationJudgment(evaluation.valueJudgment || "");
      } else {
        // Limpiar campos si no hay evaluación
        setEvaluationObservations("");
        setEvaluationRecommendations("");
        setEvaluationJudgment("");
        setEvaluationCriteria(null);
      }
      
      // Los itemStates se cargarán automáticamente en el useEffect cuando selectedTeamScrum cambie
    }
  };

  const handleItemChange = async (id: number, field: string, value: any) => {
    if (isFinalSaved) return;
    
    // Obtener el estado actual del item
    const currentItemState = itemStates[id] || { completed: null, observations: "" };
    
    // Actualizar estado local inmediatamente para mejor UX
    const updatedState = {
      ...currentItemState,
      [field]: value
    };
    
    setItemStates(prev => ({
      ...prev,
      [id]: updatedState
    }));

    // Validar que tengamos los datos necesarios
    if (!selectedChecklist || !selectedTeamScrum) {
      toast.error("Error: No se ha seleccionado un checklist o team scrum");
      return;
    }

    // Guardar en la base de datos
    try {
      const qualificationInput = {
        itemId: parseInt(id.toString()),
        teamScrumId: parseInt(selectedTeamScrum.id as string),
        checklistId: parseInt(selectedChecklist.id as string),
        qualificationState: updatedState.completed,
        observations: updatedState.observations || ""
      };

      const result = await saveOrUpdateQualification({
        variables: { input: qualificationInput }
      });

      if (result.data?.saveOrUpdateChecklistQualification?.code === "200") {
        // Guardado exitoso - podemos mostrar un indicador sutil
        console.log("✅ Calificación guardada automáticamente");
      }
    } catch (error: any) {
      console.error("Error al guardar calificación:", error);
      toast.error(`Error al guardar: ${error.message || 'Error desconocido'}`);
      
      // Revertir el cambio en caso de error
      setItemStates(prev => ({
        ...prev,
        [id]: currentItemState
      }));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSaveChecklist = async () => {
    if (!selectedChecklist) return;
    setShowPreview(true);
  };

  const handleEnableModification = () => {
    setIsFinalSaved(false);
  };

  const handleExportPDF = async () => {
    if (!selectedChecklist) return;
    console.log("Exportando PDF...");
    // TODO: Implementar exportación PDF
  };

  const handleExportExcel = async () => {
    if (!selectedChecklist) return;
    console.log("Exportando Excel...");
    // TODO: Implementar exportación Excel
  };

  const generatePreviewData = () => {
    if (!selectedChecklist) return null;

    const items = selectedChecklist.items?.map((item: any) => {
      if (!item) return null;
      return {
        ...item,
        completed: itemStates[item.id]?.completed ?? (item as any).completed,
        observations: itemStates[item.id]?.observations ?? (item as any).observations
      };
    }).filter(Boolean) || [];

    // Verificar si hay datos de evaluación
    const evaluation = (selectedChecklist as any).evaluations;
    const hasEvaluation = !!evaluation;

    return {
      checklist: selectedChecklist,
      items,
      evaluation: hasEvaluation ? {
        observations: evaluation.observations || "",
        recommendations: evaluation.recommendations || "",
        judgment: evaluation.valueJudgment || "PENDIENTE"
      } : {
        observations: "",
        recommendations: "",
        judgment: "PENDIENTE"
      },
      hasEvaluationData: hasEvaluation
    };
  };

  const handleFinalSave = async () => {
    try {
      // TODO: Implementar guardado final
      console.log("Guardando definitivamente...");
      setIsFinalSaved(true);
      setShowPreview(false);
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  // Datos dinámicos basados en la selección actual
  const getStudySheetInfo = () => {
    if (!selectedStudySheet) {
      return {
        fichaNumber: "No disponible",
        jornada: "No disponible",
        fechas: "No disponible",
        programa: "No disponible"
      };
    }

    return {
      fichaNumber: selectedStudySheet.number?.toString() || "No disponible",
      jornada: selectedStudySheet.journey?.name || "No disponible", 
      fechas: selectedStudySheet.startLective && selectedStudySheet.endLective 
        ? `${selectedStudySheet.startLective} - ${selectedStudySheet.endLective}`
        : "No disponible",
      programa: selectedStudySheet.trainingProject?.name || "No disponible"
    };
  };

  const getTeamScrumInfo = () => {
    if (!selectedTeamScrum) {
      return {
        teamName: "No seleccionado",
        projectName: "No disponible"
      };
    }

    return {
      teamName: selectedTeamScrum.teamName || "Sin nombre",
      projectName: selectedTeamScrum.projectName || selectedChecklist?.trainingProjectName || "Sin proyecto"
    };
  };

  const studySheetInfo = getStudySheetInfo();
  const teamScrumInfo = getTeamScrumInfo();

  // Funciones para manejo de evaluación
  const handleEvaluationFieldChange = (field: string, value: string | boolean) => {
    switch (field) {
      case 'observations':
        setEvaluationObservations(value as string);
        break;
      case 'recommendations':
        setEvaluationRecommendations(value as string);
        break;
      case 'judgment':
        setEvaluationJudgment(value as string);
        break;
      case 'criteria':
        setEvaluationCriteria(value as boolean);
        break;
    }
  };

  const handleCreateEvaluation = () => {
    setShowCreateEvaluationModal(true);
  };

  const handleCreateEvaluationSubmit = async () => {
    if (!selectedChecklist) return;
    
    setIsCreatingEvaluation(true);
    try {
      const evaluationInput = {
        observations: evaluationObservations.trim(),
        recommendations: evaluationRecommendations.trim(),
        valueJudgment: evaluationJudgment,
        checklistId: parseInt(selectedChecklist.id as string),
        teamScrumId: selectedTeamScrum?.id ? parseInt(selectedTeamScrum.id as string) : undefined
      };

      const response = await dispatch(addEvaluation(evaluationInput)).unwrap();
      
      setShowCreateEvaluationModal(false);
      toast.success("✅ Evaluación creada exitosamente!");
      
      // Actualizar el checklist con la evaluación usando los valores que ya tenemos
      const updatedChecklist = {
        ...selectedChecklist,
        evaluations: {
          id: response?.id || '',
          observations: evaluationObservations.trim(),
          recommendations: evaluationRecommendations.trim(),
          valueJudgment: evaluationJudgment,
          checklistId: parseInt(selectedChecklist.id as string)
        }
      };
      
      // Forzar actualización del estado
      setSelectedChecklist(updatedChecklist as Checklist);
      
    } catch (error: any) {
      console.error("Error al crear evaluación:", error);
      toast.error(`❌ Error al crear la evaluación: ${error.message || 'Error desconocido'}`);
    } finally {
      setIsCreatingEvaluation(false);
    }
  };

  const handleUpdateEvaluationClick = () => {
    setShowEvaluationForm(true);
  };

  const handleCancelUpdate = () => {
    setShowEvaluationForm(false);
  };

  const handleCompleteEvaluation = async () => {
    if (!selectedChecklist || !(selectedChecklist as any).evaluations) return;
    
    try {
      const evaluationInput = {
        observations: evaluationObservations.trim(),
        recommendations: evaluationRecommendations.trim(),
        valueJudgment: evaluationJudgment,
        checklistId: parseInt(selectedChecklist.id as string),
        teamScrumId: selectedTeamScrum?.id ? parseInt(selectedTeamScrum.id as string) : undefined
      };

      const evaluationId = (selectedChecklist as any).evaluations.id;
      if (!evaluationId) {
        toast.error("❌ No se encontró el ID de la evaluación");
        return;
      }

      await dispatch(updateEvaluation({ 
        id: parseInt(evaluationId as string), 
        input: evaluationInput 
      })).unwrap();
      
      setShowEvaluationForm(false);
      toast.success("✅ Evaluación actualizada exitosamente!");
      
      // Actualizar el checklist con la evaluación usando los valores actualizados
      const updatedChecklist = {
        ...selectedChecklist,
        evaluations: {
          id: evaluationId,
          observations: evaluationObservations.trim(),
          recommendations: evaluationRecommendations.trim(),
          valueJudgment: evaluationJudgment,
          checklistId: parseInt(selectedChecklist.id as string)
        }
      };
      
      // Forzar actualización del estado
      setSelectedChecklist(updatedChecklist as Checklist);
      
    } catch (error: any) {
      console.error("Error al actualizar evaluación:", error);
      toast.error(`❌ Error al actualizar la evaluación: ${error.message || 'Error desconocido'}`);
    }
  };

  const extractGeneralObservationsFromEvaluation = (evaluation: any) => {
    return evaluation?.observations || "";
  };

  return (
    <div className="p-8 dark:bg-[#00111f] min-h-screen text-gray-900 dark:text-white">
      <PageTitle>Lista de Chequeo - Instructor</PageTitle>

      {/* Tarjetas de información */}
      <InformationCards 
        selectedTeamScrumName={teamScrumInfo.teamName}
        selectedStudySheetNumber={studySheetInfo.fichaNumber}
        selectedChecklist={selectedChecklist}
        studySheetInfo={studySheetInfo}
        teamScrumInfo={teamScrumInfo}
      />

      {/* Controles de filtros y acciones */}
      <ChecklistControls
        selectedTrimester={selectedTrimester}
        filteredChecklists={filteredChecklists}
        selectedChecklist={selectedChecklist}
        activeChecklists={activeChecklists}
        availableTrimester={availableTrimester}
        isFinalSaved={isFinalSaved}
        onTrimesterChange={setSelectedTrimester}
        onChecklistChange={handleChecklistChange}
        onSaveChecklist={handleSaveChecklist}
        onEnableModification={handleEnableModification}
        onExportPDF={handleExportPDF}
        onExportExcel={handleExportExcel}
      />

      {/* Tabla de lista de chequeo */}
      {selectedChecklist && currentItems.length > 0 && (
        <ChecklistTable
          items={selectedChecklist.items || []}
          currentItems={currentItems}
          itemStates={itemStates}
          currentPage={currentPage}
          totalPages={totalPages}
          isFinalSaved={isFinalSaved}
          onItemChange={handleItemChange}
          onPageChange={handlePageChange}
        />
      )}

      {/* Sección de Evaluación */}
      {selectedChecklist && currentItems.length > 0 && (
        <EvaluationSection
          selectedChecklist={selectedChecklist}
          selectedEvaluation={(selectedChecklist as any).evaluations || null}
          showEvaluationForm={showEvaluationForm}
          evaluationObservations={evaluationObservations}
          evaluationRecommendations={evaluationRecommendations}
          evaluationJudgment={evaluationJudgment}
          evaluationCriteria={evaluationCriteria}
          isFinalSaved={isFinalSaved}
          onUpdateClick={handleUpdateEvaluationClick}
          onCancelUpdate={handleCancelUpdate}
          onCompleteEvaluation={handleCompleteEvaluation}
          onCreateEvaluation={handleCreateEvaluation}
          onFieldChange={handleEvaluationFieldChange}
          extractGeneralObservationsFromEvaluation={extractGeneralObservationsFromEvaluation}
        />
      )}

      {/* Modal de Crear Evaluación */}
      <CreateEvaluationModal
        showModal={showCreateEvaluationModal}
        selectedChecklist={selectedChecklist}
        evaluationObservations={evaluationObservations}
        evaluationRecommendations={evaluationRecommendations}
        evaluationJudgment={evaluationJudgment}
        evaluationCriteria={evaluationCriteria}
        isFinalSaved={isFinalSaved}
        isCreating={isCreatingEvaluation}
        onClose={() => setShowCreateEvaluationModal(false)}
        onCreate={handleCreateEvaluationSubmit}
        onFieldChange={handleEvaluationFieldChange}
      />

      {/* Estado de carga */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5cb800] dark:border-shadowBlue"></div>
        </div>
      )}

      {/* Estado de error */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">Error al cargar las listas de chequeo:</p>
          <p className="text-sm">{typeof error === 'string' ? error : 'Error desconocido'}</p>
        </div>
      )}

      {/* Estado vacío cuando no hay checklists */}
      {!loading && !error && checklists.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No hay listas de chequeo disponibles
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Las listas de chequeo creadas por el coordinador aparecerán aquí.
          </p>
        </div>
      )}

      {/* Estado cuando se selecciona una lista pero no tiene items */}
      {selectedChecklist && (!selectedChecklist.items || selectedChecklist.items.length === 0) && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-yellow-200 dark:bg-yellow-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Lista de chequeo sin items
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Esta lista de chequeo no tiene items para evaluar.
          </p>
        </div>
      )}

      {/* Modal de vista previa */}
      <PreviewModal
        showPreview={showPreview}
        selectedChecklist={selectedChecklist}
        generatePreviewData={generatePreviewData}
        onBackToEdit={() => setShowPreview(false)}
        onFinalSave={handleFinalSave}
      />
    </div>
  );
};



