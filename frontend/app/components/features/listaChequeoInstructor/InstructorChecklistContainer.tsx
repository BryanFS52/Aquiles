'use client'

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@redux/store';
import { fetchChecklists } from '@redux/slices/checklistSlice';
import { fetchStudySheetWithTeamScrum } from '@redux/slices/olympo/studySheetSlice';
import { fetchTeamScrumById } from '@redux/slices/teamScrumSlice';
import { addEvaluation, updateEvaluation } from '@redux/slices/evaluationSlice';
import { 
  SAVE_OR_UPDATE_CHECKLIST_QUALIFICATION,
  GET_CHECKLIST_QUALIFICATIONS_BY_CHECKLIST 
} from '@graphql/checklistQualificationGraph';
import { GET_EVALUATION_BY_CHECKLIST_AND_TEAM } from '@graphql/evaluationsGraph';
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
  const router = useRouter();
  const { data: checklists, loading, error } = useSelector((state: RootState) => state.checklist);
  const { data: studySheets } = useSelector((state: RootState) => state.studySheet);
  const { dataForTeamScrumById: selectedTeamScrum } = useSelector((state: RootState) => state.teamScrum);
  
  // Mutations y queries
  const [saveOrUpdateQualification] = useMutation(SAVE_OR_UPDATE_CHECKLIST_QUALIFICATION);
  const [loadQualifications, { data: qualificationsData }] = useLazyQuery(GET_CHECKLIST_QUALIFICATIONS_BY_CHECKLIST);
  const [loadEvaluation, { data: evaluationData }] = useLazyQuery(GET_EVALUATION_BY_CHECKLIST_AND_TEAM);
  
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

  // Cargar datos del localStorage cuando el componente se monta
  useEffect(() => {
    const loadFromLocalStorage = async () => {
      const studySheetId = localStorage.getItem('selectedStudySheetId');
      const teamScrumId = localStorage.getItem('selectedTeamScrumId');

      if (studySheetId) {
        try {
          const studySheetResponse = await dispatch(fetchStudySheetWithTeamScrum({ 
            id: parseInt(studySheetId) 
          })).unwrap();
          
          if (studySheetResponse?.data) {
            setSelectedStudySheet(studySheetResponse.data as StudySheet);
          }
        } catch (error) {
          toast.error("Error al cargar la ficha seleccionada");
        }
      }

      if (teamScrumId) {
        try {
          await dispatch(fetchTeamScrumById({ id: teamScrumId }));
        } catch (error) {
          toast.error("Error al cargar el Team Scrum seleccionado");
        }
      }
    };

    loadFromLocalStorage();
  }, [dispatch]);

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
          // Error al cargar calificaciones
        }
      }
    };

    loadChecklistQualifications();
  }, [selectedChecklist, selectedTeamScrum, loadQualifications]);

  // Efecto para actualizar los campos de evaluación cuando llegue la data del backend
  useEffect(() => {
    if (evaluationData?.evaluationByChecklistAndTeam?.data) {
      const evaluation = evaluationData.evaluationByChecklistAndTeam.data;
      setEvaluationObservations(evaluation.observations || "");
      setEvaluationRecommendations(evaluation.recommendations || "");
      setEvaluationJudgment(evaluation.valueJudgment || "");
      
      // ✅ Cargar el estado isFinalized desde la base de datos
      if (evaluation.isFinalized !== undefined && evaluation.isFinalized !== null) {
        setIsFinalSaved(evaluation.isFinalized);
      } else {
        setIsFinalSaved(false);
      }
    } else {
      // Limpiar campos si no hay evaluación
      setEvaluationObservations("");
      setEvaluationRecommendations("");
      setEvaluationJudgment("");
      setEvaluationCriteria(null);
      setIsFinalSaved(false);
    }
  }, [evaluationData]);

  // Filtrar listas de chequeo por la ficha seleccionada del instructor
  const checklistsForStudySheet = useMemo(() => {
    if (!selectedStudySheet?.id) return checklists;
    
    const filtered = checklists.filter((checklist: Checklist) => {
      // Verificar si la lista tiene fichas asociadas
      if (!checklist.studySheets || checklist.studySheets.length === 0) {
        return false;
      }
      
      // Verificar si la ficha del instructor está en la lista de fichas asociadas
      const studySheetIds = checklist.studySheets.split(',').map(id => id.trim());
      const isMatch = studySheetIds.includes(selectedStudySheet?.id?.toString() || '');
      
      return isMatch;
    });
    
    return filtered;
  }, [checklists, selectedStudySheet]);

  // Obtener trimestres únicos dinámicamente de las listas asignadas a esta ficha
  const availableTrimester = useMemo(() => {
    const trimesters = checklistsForStudySheet
      .map((checklist: Checklist) => checklist.trimester)
      .filter((trimester: string | null | undefined): trimester is string => Boolean(trimester))
      .filter((trimester: string, index: number, array: string[]) => array.indexOf(trimester) === index);
    
    return trimesters.sort();
  }, [checklistsForStudySheet]);

  // Listas filtradas por trimestre (solo las de esta ficha)
  const filteredChecklists = useMemo(() => {
    if (!selectedTrimester) return checklistsForStudySheet;
    return checklistsForStudySheet.filter((checklist: Checklist) => checklist.trimester === selectedTrimester);
  }, [checklistsForStudySheet, selectedTrimester]);

  const activeChecklists = useMemo(() => {
    return checklistsForStudySheet.filter((checklist: Checklist) => checklist.state === true);
  }, [checklistsForStudySheet]);

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
      setItemStates({});
      setCurrentPage(1);
      return;
    }
    
    const checklist = checklists.find((c: Checklist) => c.id === checklistId);
    if (checklist) {
      setSelectedChecklist(checklist);
      setCurrentPage(1);
      
      // NO sobrescribir selectedStudySheet ni selectedTeamScrum
      // Estos ya fueron cargados desde localStorage y deben mantenerse
      
      // Cargar evaluación específica para este checklist y team scrum
      if (selectedTeamScrum?.id && checklist.id) {
        loadEvaluation({
          variables: {
            checklistId: checklist.id,
            teamScrumId: selectedTeamScrum.id
          }
        });
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
      }
    } catch (error: any) {
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
    // TODO: Implementar exportación PDF
  };

  const handleExportExcel = async () => {
    if (!selectedChecklist) return;
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

    // Verificar si hay datos de evaluación (usar evaluationData en lugar de checklist.evaluations)
    const evaluation = evaluationData?.evaluationByChecklistAndTeam?.data;
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
    if (!selectedChecklist || !selectedTeamScrum?.id || !evaluationData?.evaluationByChecklistAndTeam?.data) {
      toast.error("❌ Debe existir una evaluación antes de guardar definitivamente");
      return;
    }

    try {
      const evaluation = evaluationData.evaluationByChecklistAndTeam.data;
      const evaluationId = evaluation.id;

      if (!evaluationId) {
        toast.error("❌ No se encontró el ID de la evaluación");
        return;
      }

      // ✅ Actualizar la evaluación con isFinalized: true en la base de datos
      const evaluationInput = {
        observations: evaluationObservations.trim(),
        recommendations: evaluationRecommendations.trim(),
        valueJudgment: evaluationJudgment,
        checklistId: parseInt(selectedChecklist.id as string),
        teamScrumId: parseInt(selectedTeamScrum.id as string),
        isFinalized: true // ✅ Marcar como finalizada en la DB
      };

      await dispatch(updateEvaluation({ 
        id: parseInt(evaluationId as string), 
        input: evaluationInput 
      })).unwrap();
      
      // ✅ Recargar la evaluación desde el servidor para confirmar el cambio
      await loadEvaluation({
        variables: {
          checklistId: parseInt(selectedChecklist.id as string),
          teamScrumId: parseInt(selectedTeamScrum.id as string)
        },
        fetchPolicy: 'network-only' // Forzar datos frescos del servidor
      });

      setIsFinalSaved(true);
      setShowPreview(false);
      toast.success("Lista de chequeo guardada definitivamente");
      
    } catch (error: any) {
      toast.error(`❌ Error al guardar: ${error.message || 'Error desconocido'}`);
    }
  };

  // Función para volver a la selección de fichas
  const handleBackToStudySheets = () => {
    // Limpiar localStorage
    localStorage.removeItem('selectedStudySheetId');
    localStorage.removeItem('selectedTeamScrumId');
    localStorage.removeItem('selectedStudySheetNumber');
    localStorage.removeItem('selectedTeamScrumName');
    
    // Navegar a la página de selección de fichas
    router.push('/dashboard/InstructorSelection');
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

    const info = {
      fichaNumber: selectedStudySheet.number?.toString() || "No disponible",
      jornada: selectedStudySheet.journey?.name || "No disponible", 
      fechas: selectedStudySheet.startLective && selectedStudySheet.endLective 
        ? `${selectedStudySheet.startLective} - ${selectedStudySheet.endLective}`
        : "No disponible",
      programa: selectedStudySheet.trainingProject?.name || "No disponible"
    };

    return info;
  };

  const getTeamScrumInfo = () => {
    if (!selectedTeamScrum) {
      return {
        teamName: "No seleccionado",
        projectName: "No disponible"
      };
    }

    const info = {
      teamName: selectedTeamScrum.teamName || "Sin nombre",
      projectName: selectedTeamScrum.projectName || selectedChecklist?.trainingProjectName || "Sin proyecto"
    };

    return info;
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
    if (!selectedChecklist || !selectedTeamScrum?.id) return;
    
    setIsCreatingEvaluation(true);
    try {
      const evaluationInput = {
        observations: evaluationObservations.trim(),
        recommendations: evaluationRecommendations.trim(),
        valueJudgment: evaluationJudgment,
        checklistId: parseInt(selectedChecklist.id as string),
        teamScrumId: parseInt(selectedTeamScrum.id as string),
        isFinalized: false // ✅ Nueva evaluación siempre empieza sin finalizar
      };

      await dispatch(addEvaluation(evaluationInput)).unwrap();
      
      setShowCreateEvaluationModal(false);
      toast.success("✅ Evaluación creada exitosamente!");
      
      // Recargar la evaluación para este checklist y team scrum
      loadEvaluation({
        variables: {
          checklistId: parseInt(selectedChecklist.id as string),
          teamScrumId: parseInt(selectedTeamScrum.id as string)
        },
        fetchPolicy: 'network-only'
      });
      
    } catch (error: any) {
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
    if (!selectedChecklist || !selectedTeamScrum?.id || !evaluationData?.evaluationByChecklistAndTeam?.data) return;
    
    try {
      const evaluation = evaluationData.evaluationByChecklistAndTeam.data;
      const evaluationInput = {
        observations: evaluationObservations.trim(),
        recommendations: evaluationRecommendations.trim(),
        valueJudgment: evaluationJudgment,
        checklistId: parseInt(selectedChecklist.id as string),
        teamScrumId: parseInt(selectedTeamScrum.id as string),
        isFinalized: false // ✅ Mantener false al actualizar (solo "Guardar Definitivamente" lo pone en true)
      };

      const evaluationId = evaluation.id;
      if (!evaluationId) {
        toast.error("❌ No se encontró el ID de la evaluación");
        return;
      }

      await dispatch(updateEvaluation({ 
        id: parseInt(evaluationId as string), 
        input: evaluationInput 
      })).unwrap();
      
      setShowEvaluationForm(false);
      toast.success("Evaluación actualizada exitosamente!");
      
      // Recargar la evaluación actualizada forzando traer datos frescos del servidor
      await loadEvaluation({
        variables: {
          checklistId: parseInt(selectedChecklist.id as string),
          teamScrumId: parseInt(selectedTeamScrum.id as string)
        },
        fetchPolicy: 'network-only' // Forzar traer datos del servidor, no del cache
      });
      
    } catch (error: any) {
      toast.error(`❌ Error al actualizar la evaluación: ${error.message || 'Error desconocido'}`);
    }
  };

  const extractGeneralObservationsFromEvaluation = (evaluation: any) => {
    return evaluation?.observations || "";
  };

  return (
    <div className="p-8 dark:bg-[#00111f] min-h-screen text-gray-900 dark:text-white">
      {/* Botón Volver a Fichas */}
      <button
        onClick={handleBackToStudySheets}
        className="mb-6 flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-[#5cb800] dark:hover:text-[#6bc500] transition-colors duration-200"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M10 19l-7-7m0 0l7-7m-7 7h18" 
          />
        </svg>
        <span className="font-medium">Volver a Fichas</span>
      </button>

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
          selectedEvaluation={evaluationData?.evaluationByChecklistAndTeam?.data || null}
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

      {/* Estado cuando hay listas pero ninguna está asignada a esta ficha */}
      {!loading && !error && checklists.length > 0 && checklistsForStudySheet.length === 0 && selectedStudySheet && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No hay listas de chequeo asignadas a tu ficha
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            La ficha {selectedStudySheet.number || selectedStudySheet.id} no tiene listas de chequeo asignadas.
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
            Contacta al coordinador para que asigne listas de chequeo a esta ficha.
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



