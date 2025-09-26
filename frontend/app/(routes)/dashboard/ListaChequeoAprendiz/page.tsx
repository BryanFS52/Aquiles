"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, FileDown, X, UploadCloud, Eye, Calendar, User, Users } from "lucide-react";
import Image from 'next/image';
import PageTitle from "../../../components/UI/pageTitle";

// Interfaz para los items del checklist
interface ChecklistItem {
  id: number;
  indicator: string;
  completed: boolean | null;
  observations: string;
}

// Interfaz para evaluaciones
interface Evaluation {
  id: string;
  observations: string;
  recommendations: string;
  judgment: string;
  evaluatedBy: string;
  evaluatedAt: string;
}

// Interfaz para listas de chequeo evaluadas
interface EvaluatedChecklist {
  id: string;
  trimester: string;
  component: string;
  teamScrum: string;
  items: ChecklistItem[];
  evaluation?: Evaluation;
  evaluatedBy: string;
  evaluatedAt: string;
  status: 'completada' | 'pendiente';
}

// Datos mock de listas de chequeo evaluadas para el team scrum del aprendiz
const evaluatedChecklistsData: EvaluatedChecklist[] = [
  {
    id: "CL-001",
    trimester: "Trimestre 5",
    component: "Componente Técnico",
    teamScrum: "Team 3",
    evaluatedBy: "Juan Pérez",
    evaluatedAt: "2024-02-15",
    status: "completada",
    items: [
      { id: 1, indicator: "El software evidencia autenticación y manejo dinámico de roles.", completed: true, observations: "Implementación correcta con JWT" },
      { id: 2, indicator: "Aplica en el sistema procedimientos almacenados y/o funciones.", completed: true, observations: "" },
      { id: 3, indicator: "Implementa servicios REST siguiendo estándares.", completed: true, observations: "Excelente documentación con Swagger" },
      { id: 4, indicator: "Describe la creación de usuarios y privilegios a nivel de base de datos.", completed: false, observations: "Falta documentación detallada" }
    ],
    evaluation: {
      id: "EV-001",
      observations: "El equipo demostró un buen dominio de las tecnologías implementadas. La autenticación está bien estructurada y los servicios REST siguen las mejores prácticas.",
      recommendations: "Se recomienda mejorar la documentación de la base de datos y agregar más casos de prueba para los procedimientos almacenados.",
      judgment: "BUENO",
      evaluatedBy: "Juan Pérez",
      evaluatedAt: "2024-02-15"
    }
  },
  {
    id: "CL-002",
    trimester: "Trimestre 5",
    component: "Componente Funcional",
    teamScrum: "Team 3",
    evaluatedBy: "Juan Pérez",
    evaluatedAt: "2024-02-20",
    status: "completada",
    items: [
      { id: 1, indicator: "La aplicación implementa patrones de diseño.", completed: true, observations: "Se evidencia uso de MVC y Repository Pattern" },
      { id: 2, indicator: "Se evidencia el uso de principios SOLID.", completed: true, observations: "Buen nivel de abstracción y responsabilidad única" },
      { id: 3, indicator: "El software evidencia autenticación y manejo dinámico de roles.", completed: true, observations: "" },
      { id: 4, indicator: "Aplica en el sistema procedimientos almacenados y/o funciones.", completed: false, observations: "Implementación parcial" }
    ],
    evaluation: {
      id: "EV-002",
      observations: "Excelente aplicación de patrones de diseño y principios SOLID. El código es limpio y mantenible.",
      recommendations: "Completar la implementación de procedimientos almacenados y agregar más validaciones.",
      judgment: "EXCELENTE",
      evaluatedBy: "Juan Pérez",
      evaluatedAt: "2024-02-20"
    }
  },
  {
    id: "CL-003",
    trimester: "Trimestre 6",
    component: "Componente Técnico",
    teamScrum: "Team 3",
    evaluatedBy: "María González",
    evaluatedAt: "2024-03-10",
    status: "completada",
    items: [
      { id: 1, indicator: "Implementa servicios REST siguiendo estándares.", completed: true, observations: "API bien estructurada" },
      { id: 2, indicator: "Utiliza JWT para la autenticación de servicios.", completed: true, observations: "Implementación segura de JWT" },
      { id: 3, indicator: "Implementa microservicios.", completed: false, observations: "Arquitectura monolítica, no microservicios" },
      { id: 4, indicator: "Utiliza contenedores Docker.", completed: true, observations: "Dockerfiles bien configurados" }
    ],
    evaluation: {
      id: "EV-003",
      observations: "Buena implementación de servicios REST y contenedores. Falta migrar a arquitectura de microservicios.",
      recommendations: "Considerar la migración gradual a microservicios y mejorar la orquestación con Kubernetes.",
      judgment: "ACEPTABLE",
      evaluatedBy: "María González",
      evaluatedAt: "2024-03-10"
    }
  }
];

export default function AprendizChecklistView() {
  // State management
  const [selectedTrimester, setSelectedTrimester] = useState<string>("todos");
  const [selectedComponent, setSelectedComponent] = useState<string>("todos");
  const [filteredChecklists, setFilteredChecklists] = useState<EvaluatedChecklist[]>(evaluatedChecklistsData);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [selectedChecklistForPreview, setSelectedChecklistForPreview] = useState<EvaluatedChecklist | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const itemsPerPage = 5;
  const currentUserTeamScrum = "Team 3"; // Esto vendría del contexto del usuario autenticado

  // Obtener trimestres únicos
  const availableTrimesters = Array.from(new Set(evaluatedChecklistsData.map(item => item.trimester)));
  const availableComponents = Array.from(new Set(evaluatedChecklistsData.map(item => item.component)));

  // Filtrar listas de chequeo
  useEffect(() => {
    let filtered = evaluatedChecklistsData.filter(checklist => 
      checklist.teamScrum === currentUserTeamScrum
    );

    if (selectedTrimester !== "todos") {
      filtered = filtered.filter(checklist => checklist.trimester === selectedTrimester);
    }

    if (selectedComponent !== "todos") {
      filtered = filtered.filter(checklist => checklist.component === selectedComponent);
    }

    setFilteredChecklists(filtered);
    setCurrentPage(1);
  }, [selectedTrimester, selectedComponent, currentUserTeamScrum]);

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
        id: selectedChecklistForPreview.id,
        trimester: selectedChecklistForPreview.trimester,
        component: selectedChecklistForPreview.component,
        teamScrum: selectedChecklistForPreview.teamScrum,
        evaluatedBy: selectedChecklistForPreview.evaluatedBy,
        evaluatedAt: selectedChecklistForPreview.evaluatedAt
      },
      items: selectedChecklistForPreview.items.map(item => ({
        id: item.id,
        indicator: item.indicator,
        completed: item.completed,
        observations: item.observations
      })),
      hasEvaluationData: !!selectedChecklistForPreview.evaluation,
      evaluation: selectedChecklistForPreview.evaluation as Evaluation
    };
  };

  // Handlers para vista previa
  const handleOpenPreview = (checklist: EvaluatedChecklist) => {
    setSelectedChecklistForPreview(checklist);
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setSelectedChecklistForPreview(null);
  };

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
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
              <span className="font-semibold text-[#5cb800]">{currentUserTeamScrum}</span>
            </div>
          </div>
        </div>

        {/* Cards de información */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="w-16 h-16 bg-[#5cb800]/10 dark:bg-[#5cb800]/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="w-8 h-8 bg-[#5cb800] rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Centro de Formación</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-tight">Centro de Servicios Financieros</p>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <p className="text-xs font-semibold text-[#5cb800]">Programa</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">Análisis y Desarrollo de Software</p>
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
                <span className="font-semibold text-gray-900 dark:text-white">Jornada:</span> Diurna
              </p>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <p className="text-xs font-semibold text-blue-500">Ficha N°</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">2558735</p>
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
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{currentUserTeamScrum}</p>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">Integrantes</p>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-tight">Andres Ruiz, Alejandra González, Juan Pullido, Sebastian Pineda</p>
              </div>
            </div>
          </div>
        </div>

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
              No se encontraron evaluaciones para los filtros seleccionados
            </p>
          </div>
        ) : (
          <>
            {/* Grid de listas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentItems.map((checklist) => (
                <div
                  key={checklist.id}
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
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Evaluado por:</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{checklist.evaluatedBy}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Fecha:</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatDate(checklist.evaluatedAt)}</span>
                      </div>
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

      {/* Modal de Vista Previa */}
      {showPreview && selectedChecklistForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all duration-300 ease-out">
          <div className="bg-gradient-to-br from-white via-white to-gray-50 dark:from-shadowBlue dark:via-shadowBlue dark:to-darkBlue rounded-3xl shadow-2xl w-full max-w-7xl h-[95vh] flex flex-col border border-gray-200/80 dark:border-shadowBlue/60 transform transition-all duration-500 ease-out">
            {/* Header del modal mejorado */}
            <div className="flex items-center justify-between p-8 pb-6 border-b border-gray-200/60 dark:border-shadowBlue/50 bg-gradient-to-r from-transparent to-gray-50/50 dark:to-darkBlue/30 flex-shrink-0">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-2 rounded-full bg-gradient-to-b from-[#5cb800] to-[#8fd400] dark:from-shadowBlue dark:to-darkBlue"></div>
                <div>
                  <h2 className="text-3xl font-bold text-darkBlue dark:text-white flex items-center space-x-3 tracking-tight">
                    <span className="text-4xl">📋</span>
                    <span>Detalles de Evaluación</span>
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Lista de chequeo evaluada para {currentUserTeamScrum}</p>
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
                      {/* Información del checklist mejorada */}
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
                            <div className="text-xl font-bold text-[#5cb800] dark:text-[#8fd400] mt-1">{previewData.checklist.trimester || 'N/A'}</div>
                          </div>
                          <div className="bg-white/70 dark:bg-[#5cb800]/10 p-4 rounded-2xl border border-[#5cb800]/30 dark:border-[#5cb800]/20">
                            <span className="font-bold text-darkBlue dark:text-[#8fd400] text-sm uppercase tracking-wide">Componente:</span>
                            <div className="text-xl font-bold text-[#5cb800] dark:text-[#8fd400] mt-1">{previewData.checklist.component || 'N/A'}</div>
                          </div>
                          <div className="bg-white/70 dark:bg-[#5cb800]/10 p-4 rounded-2xl border border-[#5cb800]/30 dark:border-[#5cb800]/20">
                            <span className="font-bold text-darkBlue dark:text-[#8fd400] text-sm uppercase tracking-wide">Jurado:</span>
                            <div className="text-xl font-bold text-[#5cb800] dark:text-[#8fd400] mt-1">{previewData.checklist.evaluatedBy}</div>
                          </div>
                        </div>
                      </div>

                      {/* Items del checklist mejorados */}
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
                              <div key={item.id} className={`group p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                                item.completed === true 
                                  ? 'border-green-500/60 bg-gradient-to-br from-green-100/50 via-green-50/50 to-green-100/50 dark:border-green-500/40 dark:from-green-900/20 dark:via-green-800/10 dark:to-green-900/20' 
                                  : item.completed === false 
                                    ? 'border-red-500/60 bg-gradient-to-br from-red-100/50 via-red-50/50 to-red-100/50 dark:border-red-500/40 dark:from-red-900/20 dark:via-red-800/10 dark:to-red-900/20'
                                    : 'border-gray-300/60 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 dark:border-gray-600/40 dark:from-gray-800/40 dark:via-slate-800/30 dark:to-gray-700/40'
                              }`}>
                                <div className="flex items-start gap-6">
                                  <div className="flex-shrink-0">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg transform transition-all duration-300 group-hover:scale-110 ${
                                      item.completed === true 
                                        ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-green-500/30' 
                                        : item.completed === false 
                                          ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/30'
                                          : 'bg-gradient-to-br from-gray-400 to-slate-500 shadow-gray-500/30'
                                    }`}>
                                      {item.completed === true ? '✓' : item.completed === false ? '✗' : '?'}
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-3 mb-3">
                                      <span className="font-bold text-darkBlue dark:text-white text-lg">Item {item.id}</span>
                                      <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-md transition-all duration-300 ${
                                        item.completed === true 
                                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/30' 
                                          : item.completed === false 
                                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/30'
                                            : 'bg-gradient-to-r from-gray-400 to-slate-500 text-white shadow-gray-500/30'
                                      }`}>
                                        {item.completed === true ? 'CUMPLE' : item.completed === false ? 'NO CUMPLE' : 'SIN EVALUAR'}
                                      </span>
                                    </div>
                                    <p className="text-darkBlue dark:text-gray-200 mb-4 text-base leading-relaxed font-medium">{item.indicator}</p>
                                    {item.observations && (
                                      <div className="bg-white/80 dark:bg-[#5cb800]/5 p-4 rounded-2xl border border-gray-200/60 dark:border-[#5cb800]/20 backdrop-blur-sm">
                                        <div className="flex items-center gap-2 mb-2">
                                          <div className="w-6 h-6 bg-gradient-to-br from-[#5cb800] to-[#8fd400] rounded-lg flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">📝</span>
                                          </div>
                                          <span className="font-bold text-darkBlue dark:text-white text-sm uppercase tracking-wide">Observaciones</span>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{item.observations}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Evaluación mejorada (si existe) */}
                      {previewData.hasEvaluationData && (
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
                                  <div className="w-8 h-8 bg-gradient-to-br from-[#5cb800] to-[#8fd400] rounded-xl flex items-center justify-center">
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
                                  <div className="w-8 h-8 bg-gradient-to-br from-[#5cb800] to-[#8fd400] rounded-xl flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">⚖️</span>
                                  </div>
                                  <h4 className="font-bold text-darkBlue dark:text-[#8fd400] text-lg">Juicio de Valor</h4>
                                </div>
                                <div className="bg-gradient-to-br from-gray-50 to-white dark:from-[#5cb800]/5 dark:to-[#8fd400]/5 p-4 rounded-2xl border border-gray-200/60 dark:border-[#5cb800]/20 min-h-[120px] flex items-center justify-center">
                                  <span className={`inline-flex px-6 py-4 rounded-2xl text-lg font-bold shadow-lg transform transition-all duration-300 hover:scale-105 ${
                                    previewData.evaluation.judgment === 'EXCELENTE' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/30' :
                                    previewData.evaluation.judgment === 'BUENO' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/30' :
                                    previewData.evaluation.judgment === 'ACEPTABLE' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/30' :
                                    previewData.evaluation.judgment === 'DEFICIENTE' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/30' :
                                    previewData.evaluation.judgment === 'RECHAZADO' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/30' :
                                    'bg-gradient-to-r from-gray-500 to-slate-600 text-white shadow-gray-500/30'
                                  }`}>
                                    {previewData.evaluation.judgment || 'PENDIENTE'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Estadísticas mejoradas */}
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
                              <div className="w-10 h-10 bg-gradient-to-br from-[#5cb800] to-[#8fd400] rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold">✓</span>
                              </div>
                              <div className="text-3xl font-bold text-[#5cb800] dark:text-[#8fd400] group-hover:scale-110 transition-transform duration-300">
                                {previewData.items.filter(item => item.completed === true).length}
                              </div>
                            </div>
                            <div className="text-sm font-bold text-[#5cb800] dark:text-[#8fd400] uppercase tracking-wide">Cumple</div>
                            <div className="text-xs text-[#5cb800]/80 dark:text-[#8fd400]/80 mt-1">Items aprobados</div>
                          </div>
                          <div className="bg-gradient-to-br from-red-100/50 to-red-200/50 dark:from-red-900/20 dark:to-red-800/20 p-6 rounded-2xl border border-red-500/60 dark:border-red-500/40 shadow-lg hover:shadow-xl transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold">✗</span>
                              </div>
                              <div className="text-3xl font-bold text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform duration-300">
                                {previewData.items.filter(item => item.completed === false).length}
                              </div>
                            </div>
                            <div className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">No Cumple</div>
                            <div className="text-xs text-red-600/80 dark:text-red-400/80 mt-1">Items reprobados</div>
                          </div>
                          <div className="bg-gradient-to-br from-gray-100 to-slate-200 dark:from-gray-800/40 dark:to-slate-700/30 p-6 rounded-2xl border border-gray-300/60 dark:border-gray-600/40 shadow-lg hover:shadow-xl transition-all duration-300 group">
                            <div className="flex items-center justify-between mb-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-slate-600 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold">?</span>
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
                              <div className="w-10 h-10 bg-gradient-to-br from-[#5cb800] to-[#8fd400] rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold">📝</span>
                              </div>
                              <div className="text-3xl font-bold text-[#5cb800] dark:text-[#8fd400] group-hover:scale-110 transition-transform duration-300">
                                {previewData.items.filter(item => item.observations && item.observations.trim()).length}
                              </div>
                            </div>
                            <div className="text-sm font-bold text-[#5cb800] dark:text-[#8fd400] uppercase tracking-wide">Con Observaciones</div>
                            <div className="text-xs text-[#5cb800]/80 dark:text-[#8fd400]/80 mt-1">Items comentados</div>
                          </div>
                        </div>
                      </div>

                      {/* Información del jurado */}
                      <div className="bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-blue-100/50 dark:from-blue-900/20 dark:via-indigo-900/10 dark:to-blue-800/20 p-8 rounded-3xl border border-blue-200/60 dark:border-blue-800/40 shadow-lg hover:shadow-xl transition-all duration-300">
                        <h3 className="text-2xl font-bold text-darkBlue dark:text-white mb-6 flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-2xl">👨‍🏫</span>
                          </div>
                          <span>Información del Jurado</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white/70 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-200/30 dark:border-blue-800/20">
                            <div className="flex items-center gap-3 mb-3">
                              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              <span className="font-bold text-darkBlue dark:text-blue-200 text-sm uppercase tracking-wide">Evaluador:</span>
                            </div>
                            <div className="text-xl font-bold text-blue-700 dark:text-blue-300">{previewData.checklist.evaluatedBy}</div>
                          </div>
                          <div className="bg-white/70 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-200/30 dark:border-blue-800/20">
                            <div className="flex items-center gap-3 mb-3">
                              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              <span className="font-bold text-darkBlue dark:text-blue-200 text-sm uppercase tracking-wide">Fecha de Evaluación:</span>
                            </div>
                            <div className="text-xl font-bold text-blue-700 dark:text-blue-300">{formatDate(previewData.checklist.evaluatedAt)}</div>
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
