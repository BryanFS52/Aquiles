"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLazyQuery } from '@apollo/client';
import { AppDispatch, RootState } from '@redux/store';
import { fetchChecklists } from '@redux/slices/checklistSlice';
import { fetchStudySheetWithStudents } from '@redux/slices/olympo/studySheetSlice';
import { GET_CHECKLIST_QUALIFICATIONS_BY_CHECKLIST } from '@graphql/checklistQualificationGraph';
import { GET_EVALUATION_BY_CHECKLIST_AND_TEAM } from '@graphql/evaluationsGraph';
import PageTitle from "@components/UI/pageTitle";
import { Calendar, Users, User, Eye, X } from 'lucide-react';
import { TEMPORAL_APRENDIZ_ID } from '@/temporaryCredential';
import { toast } from 'react-toastify';

// Interfaz para los items del checklist con sus calificaciones
interface ChecklistItemWithQualification {
  id: number;
  indicator: string;
  completed: boolean | null;
  observations: string;
}

// Interfaz para evaluaciones procesadas
interface ProcessedEvaluation {
  id: string;
  observations: string;
  recommendations: string;
  judgment: string;
  evaluatedAt: string;
}

// Interfaz para listas de chequeo evaluadas con datos reales
interface EvaluatedChecklistData {
  checklistId: string;
  checklistName: string;
  trimester: string;
  component: string;
  teamScrumId: string;
  teamScrumName: string;
  items: ChecklistItemWithQualification[];
  evaluation?: ProcessedEvaluation;
  status: 'completada' | 'pendiente';
}

export default function AprendizChecklistView() {
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux state
  const { data: checklists, loading: loadingChecklists } = useSelector((state: RootState) => state.checklist);
  const { dataForStudents: studySheetData } = useSelector((state: RootState) => state.studySheet);
  
  // Queries para obtener calificaciones y evaluaciones
  const [loadQualifications] = useLazyQuery(GET_CHECKLIST_QUALIFICATIONS_BY_CHECKLIST);
  const [loadEvaluation] = useLazyQuery(GET_EVALUATION_BY_CHECKLIST_AND_TEAM);
  
  // State management
  const [selectedTrimester, setSelectedTrimester] = useState<string>("todos");
  const [selectedComponent, setSelectedComponent] = useState<string>("todos");
  const [evaluatedChecklists, setEvaluatedChecklists] = useState<EvaluatedChecklistData[]>([]);
  const [filteredChecklists, setFilteredChecklists] = useState<EvaluatedChecklistData[]>([]);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [selectedChecklistForPreview, setSelectedChecklistForPreview] = useState<EvaluatedChecklistData | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  
  const itemsPerPage = 5;
  
  // Obtener el team scrum del aprendiz desde su ficha
  const studentTeamScrum = useMemo(() => {
    if (!studySheetData?.studentStudySheets) return null;
    
    // Buscar el estudiante actual
    const currentStudent: any = studySheetData.studentStudySheets.find(
      (sss: any) => sss.student?.id === TEMPORAL_APRENDIZ_ID
    );
    
    if (!currentStudent) return null;
    
    // Obtener el team scrum del estudiante
    const student = currentStudent.student;
    const teamScrums = student?.teamScrums || [];
    return teamScrums.length > 0 ? teamScrums[0] : null;
  }, [studySheetData]);

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        // Cargar todas las listas de chequeo
        await dispatch(fetchChecklists({ page: 0, size: 100 })).unwrap();
        
        // Cargar la ficha con estudiantes para obtener el team scrum del aprendiz
        // Aquí deberías obtener el studySheetId de alguna manera (contexto, localStorage, etc.)
        // Por ahora uso un ID temporal, ajusta según tu lógica
        const studySheetId = localStorage.getItem('selectedStudySheetId');
        if (studySheetId) {
          await dispatch(fetchStudySheetWithStudents({ 
            id: parseInt(studySheetId) 
          })).unwrap();
        }
      } catch (error) {
        console.error("Error cargando datos iniciales:", error);
        toast.error("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [dispatch]);

  // Cargar las evaluaciones y calificaciones cuando tengamos el team scrum
  useEffect(() => {
    const loadEvaluatedChecklists = async () => {
      if (!studentTeamScrum || !checklists.length) return;

      setLoading(true);
      const processedChecklists: EvaluatedChecklistData[] = [];

      try {
        // Procesar cada lista de chequeo
        for (const checklist of checklists) {
          if (!checklist.id || !checklist.items || checklist.items.length === 0) continue;

          try {
            // Cargar calificaciones de los items
            const qualificationsResult = await loadQualifications({
              variables: {
                checklistId: parseInt(checklist.id as string),
                teamScrumId: parseInt(studentTeamScrum.id as string)
              }
            });

            const qualifications = qualificationsResult.data?.checklistQualificationsByChecklist || [];

            // Si no hay calificaciones, esta lista no ha sido evaluada para este team
            if (qualifications.length === 0) continue;

            // Mapear items con sus calificaciones
            const itemsWithQualifications: ChecklistItemWithQualification[] = checklist.items.map((item: any) => {
              const qualification = qualifications.find((q: any) => q.itemId === item.id);
              return {
                id: item.id,
                indicator: item.indicator || '',
                completed: qualification?.qualificationState ?? null,
                observations: qualification?.observations || ''
              };
            });

            // Cargar evaluación general
            const evaluationResult = await loadEvaluation({
              variables: {
                checklistId: parseInt(checklist.id as string),
                teamScrumId: parseInt(studentTeamScrum.id as string)
              }
            });

            const evaluationData = evaluationResult.data?.evaluationByChecklistAndTeam?.data;

            // Determinar el status
            const hasEvaluation = !!evaluationData && evaluationData.isFinalized;
            const allItemsEvaluated = itemsWithQualifications.every(item => item.completed !== null);
            const status = hasEvaluation ? 'completada' : 'pendiente';

            // Solo agregar si tiene datos de evaluación
            if (qualifications.length > 0) {
              processedChecklists.push({
                checklistId: checklist.id as string,
                checklistName: `Lista de Chequeo ${checklist.id}`,
                trimester: checklist.trimester || 'Sin trimestre',
                component: checklist.component || checklist.remarks || 'Sin componente',
                teamScrumId: studentTeamScrum.id as string,
                teamScrumName: studentTeamScrum.teamName || `Team ${studentTeamScrum.id}`,
                items: itemsWithQualifications,
                evaluation: evaluationData ? {
                  id: evaluationData.id as string,
                  observations: evaluationData.observations || '',
                  recommendations: evaluationData.recommendations || '',
                  judgment: evaluationData.valueJudgment || '',
                  evaluatedAt: new Date().toISOString() // Ajustar si tienes fecha real
                } : undefined,
                status: status as 'completada' | 'pendiente'
              });
            }
          } catch (error) {
            console.error(`Error procesando checklist ${checklist.id}:`, error);
          }
        }

        setEvaluatedChecklists(processedChecklists);
      } catch (error) {
        console.error("Error cargando listas evaluadas:", error);
        toast.error("Error al cargar las evaluaciones");
      } finally {
        setLoading(false);
      }
    };

    loadEvaluatedChecklists();
  }, [studentTeamScrum, checklists, loadQualifications, loadEvaluation]);

  // Obtener trimestres y componentes únicos
  const availableTrimesters = useMemo(() => 
    Array.from(new Set(evaluatedChecklists.map(item => item.trimester)))
  , [evaluatedChecklists]);

  const availableComponents = useMemo(() => 
    Array.from(new Set(evaluatedChecklists.map(item => item.component)))
  , [evaluatedChecklists]);

  // Filtrar listas de chequeo
  useEffect(() => {
    let filtered = [...evaluatedChecklists];

    if (selectedTrimester !== "todos") {
      filtered = filtered.filter(checklist => checklist.trimester === selectedTrimester);
    }

    if (selectedComponent !== "todos") {
      filtered = filtered.filter(checklist => checklist.component === selectedComponent);
    }

    setFilteredChecklists(filtered);
    setCurrentPage(1);
  }, [selectedTrimester, selectedComponent, evaluatedChecklists]);

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filteredChecklists.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredChecklists.slice(indexOfFirstItem, indexOfLastItem);

  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  // Generar datos para vista previa
  const generatePreviewData = () => {
    if (!selectedChecklistForPreview) return null;

    return {
      checklist: {
        id: selectedChecklistForPreview.checklistId,
        name: selectedChecklistForPreview.checklistName,
        trimester: selectedChecklistForPreview.trimester,
        component: selectedChecklistForPreview.component,
        teamScrum: selectedChecklistForPreview.teamScrumName,
        evaluatedAt: selectedChecklistForPreview.evaluation?.evaluatedAt || ''
      },
      items: selectedChecklistForPreview.items,
      hasEvaluationData: !!selectedChecklistForPreview.evaluation,
      evaluation: selectedChecklistForPreview.evaluation
    };
  };

  // Handlers para vista previa
  const handleOpenPreview = (checklist: EvaluatedChecklistData) => {
    setSelectedChecklistForPreview(checklist);
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setSelectedChecklistForPreview(null);
  };

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Sin fecha';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para obtener color del badge de status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completada':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
      case 'pendiente':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  // Función para obtener color del juicio de valor
  const getJudgmentColor = (judgment: string) => {
    switch (judgment) {
      case 'EXCELENTE':
      case 'BUENO':
      case 'ACEPTABLE':
        return 'text-green-600 dark:text-green-400';
      case 'DEFICIENTE':
      case 'RECHAZADO':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Información del estudiante desde studySheetData
  const studentInfo = useMemo(() => {
    if (!studySheetData) return null;
    
    // studySheetData puede tener una estructura anidada
    const sheet: any = studySheetData;
    
    return {
      centroFormacion: "Centro de Servicios Financieros",
      programa: sheet?.trainingProject?.program?.name || "Análisis y Desarrollo de Software",
      jornada: sheet?.journey?.name || "Diurna",
      fichaNumber: sheet?.number?.toString() || "Sin número"
    };
  }, [studySheetData]);

  if (loading || loadingChecklists) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5cb800] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando evaluaciones...</p>
        </div>
      </div>
    );
  }

  if (!studentTeamScrum) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No perteneces a un Team Scrum
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Debes ser asignado a un equipo Scrum para ver las evaluaciones
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      {/* Contenido principal */}
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <PageTitle>Mis Listas de Chequeo Evaluadas</PageTitle>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-[#5cb800]/10 dark:bg-[#5cb800]/20 rounded-full border border-[#5cb800]/30">
              <Users className="w-5 h-5 text-[#5cb800]" />
              <span className="font-semibold text-[#5cb800]">{studentTeamScrum.teamName}</span>
            </div>
          </div>
        </div>

        {/* Cards de información */}
        {studentInfo && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="w-16 h-16 bg-[#5cb800]/10 dark:bg-[#5cb800]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-8 h-8 bg-[#5cb800] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Centro de Formación</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-tight">{studentInfo.centroFormacion}</p>
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-xs font-semibold text-[#5cb800]">Programa</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">{studentInfo.programa}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Datos de Formación</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-semibold text-gray-900 dark:text-white">Jornada:</span> {studentInfo.jornada}
                </p>
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-xs font-semibold text-blue-500">Ficha N°</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">{studentInfo.fichaNumber}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Team Scrum</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{studentTeamScrum.teamName}</p>
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">Proyecto</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-tight">
                    {studentTeamScrum.projectName || 'Sin proyecto asignado'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <select
                className="w-full sm:w-[200px] p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#5cb800] focus:border-transparent transition-all duration-300"
                value={selectedTrimester}
                onChange={(e) => setSelectedTrimester(e.target.value)}
              >
                <option value="todos">Todos los trimestres</option>
                {availableTrimesters.map((trimester) => (
                  <option key={trimester} value={trimester}>
                    {trimester}
                  </option>
                ))}
              </select>

              <select
                className="w-full sm:w-[200px] p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#5cb800] focus:border-transparent transition-all duration-300"
                value={selectedComponent}
                onChange={(e) => setSelectedComponent(e.target.value)}
              >
                <option value="todos">Todos los componentes</option>
                {availableComponents.map((component) => (
                  <option key={component} value={component}>
                    {component}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-[#5cb800] to-[#8fd400] text-white px-4 py-2 rounded-full shadow-md">
                <span className="text-sm font-semibold">{filteredChecklists.length} Lista(s) Evaluada(s)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de evaluaciones */}
        {filteredChecklists.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No hay listas de chequeo evaluadas
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {evaluatedChecklists.length === 0 
                ? "Aún no se han realizado evaluaciones para tu equipo"
                : "No se encontraron evaluaciones para los filtros seleccionados"}
            </p>
          </div>
        ) : (
          <>
            {/* Grid de listas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentItems.map((checklist) => (
                <div
                  key={checklist.checklistId}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Header de la card */}
                  <div className="bg-gradient-to-r from-[#5cb800] to-[#8fd400] p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white">{checklist.trimester}</h3>
                        <p className="text-sm text-white/80">{checklist.component}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeColor(checklist.status)}`}>
                        {checklist.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Contenido de la card */}
                  <div className="p-6 space-y-4">
                    {/* Información de evaluación */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Team:</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{checklist.teamScrumName}</span>
                      </div>
                      {checklist.evaluation && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Fecha:</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {formatDate(checklist.evaluation.evaluatedAt)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Estadísticas rápidas */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          {checklist.items.filter(item => item.completed === true).length}
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400">Cumple</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <div className="text-lg font-bold text-red-600 dark:text-red-400">
                          {checklist.items.filter(item => item.completed === false).length}
                        </div>
                        <div className="text-xs text-red-600 dark:text-red-400">No Cumple</div>
                      </div>
                    </div>

                    {/* Juicio de valor */}
                    {checklist.evaluation && (
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Juicio de Valor</div>
                        <div className={`text-sm font-bold ${getJudgmentColor(checklist.evaluation.judgment)}`}>
                          {checklist.evaluation.judgment}
                        </div>
                      </div>
                    )}

                    {/* Botón de vista previa */}
                    <button
                      onClick={() => handleOpenPreview(checklist)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#5cb800] to-[#8fd400] hover:from-[#4a9600] hover:to-[#7bc300] text-white rounded-lg transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Ver Detalles</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg transition-all duration-300 ${
                    currentPage === 1
                      ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Anterior
                </button>
                <div className="text-lg text-gray-900 dark:text-white">
                  Página {currentPage} de {totalPages}
                </div>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg transition-all duration-300 ${
                    currentPage === totalPages
                      ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de Vista Previa - (Reutilizando el modal existente) */}
      {showPreview && selectedChecklistForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all duration-300 ease-out">
          <div className="bg-gradient-to-br from-white via-white to-gray-50 dark:from-shadowBlue dark:via-shadowBlue dark:to-darkBlue rounded-3xl shadow-2xl w-full max-w-7xl h-[95vh] flex flex-col border border-gray-200/80 dark:border-shadowBlue/60 transform transition-all duration-500 ease-out">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-8 pb-6 border-b border-gray-200/60 dark:border-shadowBlue/50 bg-gradient-to-r from-transparent to-gray-50/50 dark:to-darkBlue/30 flex-shrink-0">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-2 rounded-full bg-gradient-to-b from-[#5cb800] to-[#8fd400] dark:from-shadowBlue dark:to-darkBlue"></div>
                <div>
                  <h2 className="text-3xl font-bold text-darkBlue dark:text-white flex items-center space-x-3 tracking-tight">
                    <span className="text-4xl">📋</span>
                    <span>Detalles de Evaluación</span>
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Lista de chequeo evaluada para {selectedChecklistForPreview.teamScrumName}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClosePreview}
                className="group relative rounded-2xl p-3 transition-all duration-300 bg-gray-100/80 dark:bg-shadowBlue/70 hover:bg-gray-200 dark:hover:bg-darkBlue/80 hover:shadow-lg transform hover:scale-105 active:scale-95 flex-shrink-0"
              >
                <X className="w-8 h-8 text-gray-500 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
              </button>
            </div>

            {/* Contenido scrolleable */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              <div className="p-8 space-y-8">
                {(() => {
                  const previewData = generatePreviewData();
                  if (!previewData) return null;

                  return (
                    <div className="space-y-8">
                      {/* Información del checklist */}
                      <div className="bg-gradient-to-br from-[#5cb800]/10 via-[#6bc500]/5 to-[#8fd400]/10 dark:from-[#5cb800]/20 dark:via-[#6bc500]/10 dark:to-[#8fd400]/20 p-8 rounded-3xl border border-[#5cb800]/40 dark:border-[#5cb800]/30 shadow-lg hover:shadow-xl transition-all duration-300">
                        <h3 className="text-2xl font-bold text-darkBlue dark:text-white mb-6 flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#5cb800] to-[#8fd400] rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-2xl">📋</span>
                          </div>
                          <span>Información de la Lista</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          <div className="bg-white/70 dark:bg-[#5cb800]/10 p-4 rounded-2xl border border-[#5cb800]/30 dark:border-[#5cb800]/20">
                            <span className="font-bold text-darkBlue dark:text-[#8fd400] text-sm uppercase tracking-wide">ID:</span>
                            <div className="text-xl font-bold text-[#5cb800] dark:text-[#8fd400] mt-1">{previewData.checklist.id}</div>
                          </div>
                          <div className="bg-white/70 dark:bg-[#5cb800]/10 p-4 rounded-2xl border border-[#5cb800]/30 dark:border-[#5cb800]/20">
                            <span className="font-bold text-darkBlue dark:text-[#8fd400] text-sm uppercase tracking-wide">Trimestre:</span>
                            <div className="text-xl font-bold text-[#5cb800] dark:text-[#8fd400] mt-1">{previewData.checklist.trimester}</div>
                          </div>
                          <div className="bg-white/70 dark:bg-[#5cb800]/10 p-4 rounded-2xl border border-[#5cb800]/30 dark:border-[#5cb800]/20">
                            <span className="font-bold text-darkBlue dark:text-[#8fd400] text-sm uppercase tracking-wide">Componente:</span>
                            <div className="text-xl font-bold text-[#5cb800] dark:text-[#8fd400] mt-1">{previewData.checklist.component}</div>
                          </div>
                          <div className="bg-white/70 dark:bg-[#5cb800]/10 p-4 rounded-2xl border border-[#5cb800]/30 dark:border-[#5cb800]/20">
                            <span className="font-bold text-darkBlue dark:text-[#8fd400] text-sm uppercase tracking-wide">Team:</span>
                            <div className="text-xl font-bold text-[#5cb800] dark:text-[#8fd400] mt-1">{previewData.checklist.teamScrum}</div>
                          </div>
                        </div>
                      </div>

                      {/* Items del checklist */}
                      <div className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-shadowBlue/40 dark:via-darkBlue/30 dark:to-shadowBlue/40 border border-gray-200/60 dark:border-shadowBlue/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                        <div className="bg-gradient-to-r from-[#5cb800] via-[#6bc500] to-[#8fd400] dark:from-shadowBlue dark:via-darkBlue dark:to-shadowBlue p-6 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                          <h3 className="text-2xl font-bold text-white flex items-center gap-3 relative z-10">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                              <span className="text-2xl">📊</span>
                            </div>
                            <span>Items Evaluados ({previewData.items.length})</span>
                          </h3>
                        </div>
                        <div className="p-6">
                          <div className="space-y-6">
                            {previewData.items.map((item, index) => (
                              <div 
                                key={item.id} 
                                className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${
                                  item.completed === true 
                                    ? 'border-[#5cb800]/60 bg-[#5cb800]/10 dark:border-[#5cb800]/40 dark:bg-[#5cb800]/20' 
                                    : item.completed === false 
                                      ? 'border-red-500/60 bg-red-50/50 dark:border-red-500/40 dark:bg-red-900/20'
                                      : 'border-gray-300/60 bg-gray-50 dark:border-gray-600/40 dark:bg-gray-800/40'
                                }`}
                              >
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg ${
                                      item.completed === true 
                                        ? 'bg-gradient-to-br from-[#5cb800] to-[#8fd400]' 
                                        : item.completed === false 
                                          ? 'bg-gradient-to-br from-red-500 to-red-600'
                                          : 'bg-gradient-to-br from-gray-400 to-gray-500'
                                    }`}>
                                      {index + 1}
                                    </div>
                                    <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${
                                      item.completed === true 
                                        ? 'bg-gradient-to-r from-[#5cb800] to-[#8fd400] text-white' 
                                        : item.completed === false 
                                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                                          : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                                    }`}>
                                      {item.completed === true ? 'CUMPLE' : item.completed === false ? 'NO CUMPLE' : 'SIN EVALUAR'}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-darkBlue dark:text-gray-200 mb-4 text-base leading-relaxed font-medium">
                                  {item.indicator}
                                </p>
                                {item.observations && (
                                  <div className="bg-white/80 dark:bg-[#5cb800]/5 p-4 rounded-2xl border border-gray-200/60 dark:border-[#5cb800]/20 backdrop-blur-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="w-6 h-6 bg-gradient-to-br from-[#5cb800] to-[#8fd400] rounded-lg flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">📝</span>
                                      </div>
                                      <span className="text-sm font-bold text-darkBlue dark:text-[#8fd400] uppercase tracking-wide">Observaciones</span>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                      {item.observations}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Evaluación (si existe) */}
                      {previewData.hasEvaluationData && previewData.evaluation && (
                        <div className="bg-gradient-to-br from-[#5cb800]/10 via-[#6bc500]/5 to-[#8fd400]/10 dark:from-[#5cb800]/20 dark:via-[#6bc500]/10 dark:to-[#8fd400]/20 p-8 rounded-3xl border border-[#5cb800]/40 dark:border-[#5cb800]/30 shadow-lg hover:shadow-xl transition-all duration-300">
                          <h3 className="text-2xl font-bold text-darkBlue dark:text-white mb-6 flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#5cb800] to-[#8fd400] rounded-2xl flex items-center justify-center shadow-lg">
                              <span className="text-2xl">📊</span>
                            </div>
                            <span>Evaluación del Jurado</span>
                          </h3>
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1">
                              <div className="bg-white/80 dark:bg-[#5cb800]/10 p-6 rounded-2xl border border-[#5cb800]/30 dark:border-[#5cb800]/20 h-full">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-8 h-8 bg-gradient-to-br from-[#5cb800] to-[#8fd400] rounded-xl flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">📝</span>
                                  </div>
                                  <h4 className="font-bold text-darkBlue dark:text-[#8fd400] text-lg">Observaciones</h4>
                                </div>
                                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-[#5cb800]/5 dark:to-[#8fd400]/5 p-4 rounded-2xl border border-gray-200/60 dark:border-[#5cb800]/20 min-h-[120px]">
                                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed break-words whitespace-pre-wrap">
                                    {previewData.evaluation.observations || 'Sin observaciones'}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="lg:col-span-1">
                              <div className="bg-white/80 dark:bg-[#5cb800]/10 p-6 rounded-2xl border border-[#5cb800]/30 dark:border-[#5cb800]/20 h-full">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">💡</span>
                                  </div>
                                  <h4 className="font-bold text-darkBlue dark:text-[#8fd400] text-lg">Recomendaciones</h4>
                                </div>
                                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-[#5cb800]/5 dark:to-[#8fd400]/5 p-4 rounded-2xl border border-gray-200/60 dark:border-[#5cb800]/20 min-h-[120px]">
                                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed break-words whitespace-pre-wrap">
                                    {previewData.evaluation.recommendations || 'Sin recomendaciones'}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="lg:col-span-1">
                              <div className="bg-white/80 dark:bg-[#5cb800]/10 p-6 rounded-2xl border border-[#5cb800]/30 dark:border-[#5cb800]/20 h-full">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">⚖️</span>
                                  </div>
                                  <h4 className="font-bold text-darkBlue dark:text-[#8fd400] text-lg">Juicio de Valor</h4>
                                </div>
                                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-[#5cb800]/5 dark:to-[#8fd400]/5 p-6 rounded-2xl border border-gray-200/60 dark:border-[#5cb800]/20 flex items-center justify-center min-h-[120px]">
                                  <div className="text-center">
                                    <div className={`text-3xl font-extrabold mb-2 ${getJudgmentColor(previewData.evaluation.judgment)}`}>
                                      {previewData.evaluation.judgment || 'SIN EVALUAR'}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Veredicto Final</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Estadísticas */}
                      <div className="bg-gradient-to-br from-[#5cb800]/10 via-[#6bc500]/5 to-[#8fd400]/10 dark:from-[#5cb800]/20 dark:via-[#6bc500]/10 dark:to-[#8fd400]/20 p-8 rounded-3xl border border-[#5cb800]/40 dark:border-[#5cb800]/30 shadow-lg hover:shadow-xl transition-all duration-300">
                        <h3 className="text-2xl font-bold text-darkBlue dark:text-white mb-6 flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#5cb800] to-[#8fd400] rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-2xl">📈</span>
                          </div>
                          <span>Estadísticas de Evaluación</span>
                        </h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                          <div className="bg-gradient-to-br from-[#5cb800]/20 to-[#8fd400]/30 dark:from-[#5cb800]/30 dark:to-[#8fd400]/20 p-6 rounded-2xl border border-[#5cb800]/60 dark:border-[#5cb800]/40 shadow-lg hover:shadow-xl transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-[#5cb800] to-[#8fd400] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <span className="text-2xl">✅</span>
                              </div>
                              <div className="text-3xl font-bold text-[#5cb800] dark:text-[#8fd400] group-hover:scale-110 transition-transform duration-300">
                                {previewData.items.filter(item => item.completed === true).length}
                              </div>
                            </div>
                            <div className="text-sm font-bold text-[#5cb800] dark:text-[#8fd400] uppercase tracking-wide">Cumple</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Items aprobados</div>
                          </div>
                          <div className="bg-gradient-to-br from-red-100/50 to-red-200/50 dark:from-red-900/20 dark:to-red-800/20 p-6 rounded-2xl border border-red-500/60 dark:border-red-500/40 shadow-lg hover:shadow-xl transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <span className="text-2xl">❌</span>
                              </div>
                              <div className="text-3xl font-bold text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform duration-300">
                                {previewData.items.filter(item => item.completed === false).length}
                              </div>
                            </div>
                            <div className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">No Cumple</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Items rechazados</div>
                          </div>
                          <div className="bg-gradient-to-br from-gray-100 to-slate-200 dark:from-gray-800/40 dark:to-slate-700/30 p-6 rounded-2xl border border-gray-300/60 dark:border-gray-600/40 shadow-lg hover:shadow-xl transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <span className="text-2xl">⏳</span>
                              </div>
                              <div className="text-3xl font-bold text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform duration-300">
                                {previewData.items.filter(item => item.completed === null).length}
                              </div>
                            </div>
                            <div className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Sin Evaluar</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Items pendientes</div>
                          </div>
                          <div className="bg-gradient-to-br from-[#5cb800]/20 to-[#8fd400]/30 dark:from-[#5cb800]/30 dark:to-[#8fd400]/20 p-6 rounded-2xl border border-[#5cb800]/60 dark:border-[#5cb800]/40 shadow-lg hover:shadow-xl transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <span className="text-2xl">📊</span>
                              </div>
                              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                                {previewData.items.length}
                              </div>
                            </div>
                            <div className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide">Total Items</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Items evaluados</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
