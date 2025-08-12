'use client'

import { useState, useEffect, useMemo } from "react";
import { Check, FileDown, Save, UploadCloud, X, AlertTriangle, Phone } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";
import PageTitle from "@components/UI/pageTitle";
import { fetchAllChecklists, fetchChecklistById } from "@services/checkListService.js";
import { fetchEvaluationsByChecklist, fetchEvaluationsByChecklistOld, completeEvaluation } from "@services/evaluationService";
import { exportChecklistToPdf, exportChecklistToExcel, downloadFileFromBase64 } from "@services/exportService";
import { GET_ALL_EVALUATIONS } from '@graphql/evaluationsGraph';
import { clientLAN } from '@/lib/apollo-client';
import { 
  Checklist, 
  Evaluation, 
  SimulatedChecklistItem,
  InstructorChecklistState,
  ValueJudgment
} from "@/types/checklist";

export default function InstructorChecklistView() {
  const [activeChecklists, setActiveChecklists] = useState<Checklist[]>([]);
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(null);
  const [selectedTrimester, setSelectedTrimester] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [firmaAnterior, setFirmaAnterior] = useState<string | null>(null);
  const [firmaNuevo, setFirmaNuevo] = useState<string | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [evaluationObservations, setEvaluationObservations] = useState<string>("");
  const [evaluationRecommendations, setEvaluationRecommendations] = useState<string>("");
  const [evaluationJudgment, setEvaluationJudgment] = useState<string>("PENDIENTE");
  const [loading, setLoading] = useState<boolean>(true);
  const [itemStates, setItemStates] = useState<{[key: number]: {completed: boolean | null, observations: string}}>({});

  const itemsPerPage = 3;

  // Cargar listas de chequeo activas
  useEffect(() => {
    loadActiveChecklists();
  }, []);

  // Auto-cargar evaluaciones cuando cambie el checklist seleccionado
  useEffect(() => {
    if (selectedChecklist) {
      loadEvaluationsForChecklist(parseInt(selectedChecklist.id));
    }
  }, [selectedChecklist]);

  // Función de debugging para ver todas las evaluaciones
  const debugAllEvaluations = async (): Promise<void> => {
    try {
      console.log("=== DEBUGGING ALL EVALUATIONS ===");
      const { data } = await clientLAN.query({
        query: GET_ALL_EVALUATIONS,
        variables: { page: 0, size: 100 },
        fetchPolicy: 'no-cache',
      });
      
      console.log("All evaluations in database:", data);
      if (data.allEvaluations && data.allEvaluations.data) {
        console.log("Total evaluations found:", data.allEvaluations.data.length);
        data.allEvaluations.data.forEach((evaluation: any, index: number) => {
          console.log(`Evaluation ${index + 1}:`, {
            id: evaluation.id,
            checklistId: evaluation.checklistId,
            observations: evaluation.observations,
            recommendations: evaluation.recommendations,
            valueJudgment: evaluation.valueJudgment
          });
        });
        
        if (selectedChecklist) {
          const matchingEvaluations = data.allEvaluations.data.filter(
            (evaluation: any) => evaluation.checklistId == selectedChecklist.id
          );
          console.log(`Evaluations matching checklist ${selectedChecklist.id}:`, matchingEvaluations);
        }
      }
    } catch (error) {
      console.error("Error debugging evaluations:", error);
    }
  };

  const loadActiveChecklists = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetchAllChecklists(0, 100);
      console.log("Raw checklists response:", response); // Debug log
      
      if (response.code === "200" && response.data) {
        // Filtrar solo las listas activas
        const activeLists = response.data.filter((checklist: Checklist) => checklist.state === true);
        console.log("Active checklists found:", activeLists); // Debug log
        console.log("Trimester values:", activeLists.map(cl => ({ id: cl.id, trimester: cl.trimester, type: typeof cl.trimester }))); // Debug log
        
        setActiveChecklists(activeLists);
        if (activeLists.length > 0 && !selectedChecklist) {
          setSelectedChecklist(activeLists[0]);
        }
      }
    } catch (error) {
      console.error("Error loading active checklists:", error);
      toast.error("Error al cargar las listas de chequeo activas");
    } finally {
      setLoading(false);
    }
  };

  const loadEvaluationsForChecklist = async (checklistId: number): Promise<void> => {
    try {
      console.log("=== LOADING EVALUATIONS FOR CHECKLIST ===");
      console.log("Checklist ID:", checklistId);
      console.log("Checklist ID type:", typeof checklistId);
      
      const evaluationsResponse = await fetchEvaluationsByChecklist(checklistId);
      console.log("Raw evaluations response:", evaluationsResponse);
      
      if (evaluationsResponse && evaluationsResponse.code === "200") {
        console.log("Evaluations response successful");
        console.log("Evaluations data:", evaluationsResponse.data);
        
        if (evaluationsResponse.data && evaluationsResponse.data.length > 0) {
          setEvaluations(evaluationsResponse.data);
          console.log("Found evaluations:", evaluationsResponse.data.length);
          
          // Si hay evaluaciones, seleccionar la primera automáticamente
          const firstEvaluation = evaluationsResponse.data[0];
          console.log("First evaluation details:", firstEvaluation);
          console.log("First evaluation checklistId:", firstEvaluation.checklistId);
          
          setSelectedEvaluation(firstEvaluation);
          setEvaluationObservations(firstEvaluation.observations || "");
          setEvaluationRecommendations(firstEvaluation.recommendations || "");
          setEvaluationJudgment(firstEvaluation.valueJudgment || "PENDIENTE");
          
          console.log("✅ Evaluation loaded successfully");
        } else {
          console.log("❌ No evaluations found in response data");
          // Intentar con la función alternativa
          console.log("Trying alternative fetch method...");
          
          try {
            const alternativeResponse = await fetchEvaluationsByChecklistOld(checklistId);
            console.log("Alternative response:", alternativeResponse);
            
            if (alternativeResponse && alternativeResponse.data && alternativeResponse.data.length > 0) {
              setEvaluations(alternativeResponse.data);
              const firstEvaluation = alternativeResponse.data[0];
              setSelectedEvaluation(firstEvaluation);
              setEvaluationObservations(firstEvaluation.observations || "");
              setEvaluationRecommendations(firstEvaluation.recommendations || "");
              setEvaluationJudgment(firstEvaluation.valueJudgment || "PENDIENTE");
              console.log("✅ Evaluation loaded via alternative method");
            } else {
              // Resetear estados de evaluación
              setEvaluations([]);
              setSelectedEvaluation(null);
              setEvaluationObservations("");
              setEvaluationRecommendations("");
              setEvaluationJudgment("PENDIENTE");
              console.log("❌ No evaluations found via alternative method either");
            }
          } catch (altError) {
            console.error("Alternative fetch also failed:", altError);
            setEvaluations([]);
            setSelectedEvaluation(null);
            setEvaluationObservations("");
            setEvaluationRecommendations("");
            setEvaluationJudgment("PENDIENTE");
          }
        }
      } else {
        console.log("❌ Evaluations response failed or no code 200");
        console.log("Response code:", evaluationsResponse?.code);
        console.log("Response message:", evaluationsResponse?.message);
        setEvaluations([]);
        setSelectedEvaluation(null);
        setEvaluationObservations("");
        setEvaluationRecommendations("");
        setEvaluationJudgment("PENDIENTE");
      }
    } catch (error) {
      console.error("❌ Error loading evaluations:", error);
      console.error("Error stack:", error);
      // No mostrar error al usuario, solo resetear estados
      setEvaluations([]);
      setSelectedEvaluation(null);
      setEvaluationObservations("");
      setEvaluationRecommendations("");
      setEvaluationJudgment("PENDIENTE");
    }
  };

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
    return selectedChecklist.items.map((item, index) => ({
      id: parseInt(item.id || (index + 1).toString()),
      indicator: item.indicator,
      completed: null, // Estado inicial
      observations: "" // Observaciones iniciales vacías
    }));
  }, [selectedChecklist]);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleTrimesterChange = (value: string): void => {
    setSelectedTrimester(value);
    setCurrentPage(1);
  };

  const handleChecklistChange = async (checklistId: string): Promise<void> => {
    const checklist = activeChecklists.find((cl: Checklist) => cl.id === checklistId);
    
    // Reiniciar estados
    setCurrentPage(1);
    setItemStates({}); // Resetear el estado de los items
    
    if (checklistId && checklistId !== "") {
      try {
        // Cargar los detalles completos del checklist con sus items
        console.log("Loading checklist details for ID:", checklistId);
        const checklistResponse = await fetchChecklistById(parseInt(checklistId));
        
        if (checklistResponse.code === "200" && checklistResponse.data) {
          console.log("Checklist details loaded:", checklistResponse.data);
          setSelectedChecklist(checklistResponse.data);
        } else {
          // Si no se pueden cargar los detalles, usar el checklist básico
          setSelectedChecklist(checklist || null);
          console.warn("Could not load checklist details, using basic data");
        }
        
        // Las evaluaciones se cargarán automáticamente por el useEffect
        
      } catch (error) {
        console.error("Error loading checklist details:", error);
        // En caso de error, usar el checklist básico y no mostrar error al usuario
        setSelectedChecklist(checklist || null);
      }
    } else {
      setSelectedChecklist(null);
    }
  };

  const handleItemChange = (id: number, field: string, value: any): void => {
    setItemStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
    console.log("Updated item:", { id, field, value });
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>, 
    setFile: React.Dispatch<React.SetStateAction<string | null>>
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setFile(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Función para completar/actualizar la evaluación
  const handleCompleteEvaluation = async (): Promise<void> => {
    if (!selectedEvaluation) {
      toast.error("No hay evaluación seleccionada");
      return;
    }

    // Validar que todos los campos estén completos
    if (!evaluationObservations.trim()) {
      toast.error("Por favor complete las observaciones");
      return;
    }

    if (!evaluationRecommendations.trim()) {
      toast.error("Por favor complete las recomendaciones");
      return;
    }

    if (!evaluationJudgment || evaluationJudgment === "PENDIENTE") {
      toast.error("Por favor seleccione un juicio de valor");
      return;
    }

    try {
      console.log("Guardando evaluación:", {
        id: selectedEvaluation.id,
        observations: evaluationObservations,
        recommendations: evaluationRecommendations,
        valueJudgment: evaluationJudgment
      });

      const response = await completeEvaluation(
        parseInt(selectedEvaluation.id),
        evaluationObservations,
        evaluationRecommendations,
        evaluationJudgment
      );

      if (response.code === "200") {
        toast.success("🎉 Evaluación guardada exitosamente en la base de datos");
        
        // Actualizar el estado local
        setSelectedEvaluation({
          ...selectedEvaluation,
          observations: evaluationObservations,
          recommendations: evaluationRecommendations,
          valueJudgment: evaluationJudgment
        });

        // Actualizar también la lista de evaluaciones
        setEvaluations(prev => prev.map(evaluation => 
          evaluation.id === selectedEvaluation.id 
            ? { ...evaluation, observations: evaluationObservations, recommendations: evaluationRecommendations, valueJudgment: evaluationJudgment }
            : evaluation
        ));

        console.log("Evaluación actualizada exitosamente");
      } else {
        toast.error("Error al guardar la evaluación: " + (response.message || "Error desconocido"));
      }
    } catch (error) {
      console.error("Error updating evaluation:", error);
      toast.error("Error al guardar la evaluación en la base de datos");
    }
  };

  const handleSaveChecklist = async (): Promise<void> => {
    if (!selectedChecklist) {
      toast.error("No hay ninguna lista de chequeo seleccionada");
      return;
    }

    try {
      // Recopilar todos los cambios de los items
      const updatedItems = items.map(item => {
        const itemState = itemStates[item.id] || { completed: item.completed, observations: item.observations };
        return {
          ...item,
          completed: itemState.completed,
          observations: itemState.observations
        };
      });

      console.log("Saving checklist:", { 
        selectedChecklist, 
        updatedItems,
        evaluation: selectedEvaluation,
        itemStates
      });

      // Crear un objeto con los datos actualizados del checklist
      const checklistData = {
        id: selectedChecklist.id,
        state: selectedChecklist.state,
        remarks: selectedChecklist.remarks || '',
        instructorSignature: selectedChecklist.instructorSignature || '',
        evaluationCriteria: selectedChecklist.evaluationCriteria || '',
        trimester: selectedChecklist.trimester,
        component: selectedChecklist.component || '',
        studySheets: selectedChecklist.studySheets || [],
        items: updatedItems
      };

      // Simular guardado exitoso por ahora
      // TODO: Implementar la llamada real al backend cuando esté disponible
      console.log("Checklist data to save:", checklistData);
      
      // Simular una pequeña demora para mostrar feedback
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("📋 La lista de chequeo ha sido guardada exitosamente!");
      
      // También guardar la evaluación si está completa
      if (selectedEvaluation && evaluationObservations && evaluationRecommendations && evaluationJudgment && evaluationJudgment !== "PENDIENTE") {
        await handleCompleteEvaluation();
      }
      
    } catch (error) {
      console.error("Error saving checklist:", error);
      toast.error("Error al guardar la lista de chequeo");
    }
  };

  // Función para exportar a PDF
  const handleExportPDF = async (): Promise<void> => {
    if (!selectedChecklist) {
      toast.error("No hay ninguna lista de chequeo seleccionada para exportar");
      return;
    }

    try {
      toast.info("📄 Generando PDF...");
      
      const base64Data = await exportChecklistToPdf(parseInt(selectedChecklist.id));
      const fileName = `checklist_${selectedChecklist.id}_trimestre_${selectedChecklist.trimester || 'NA'}.pdf`;
      
      downloadFileFromBase64(base64Data, fileName, 'application/pdf');
      
      toast.success("📥 PDF descargado exitosamente");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Error al exportar a PDF");
    }
  };

  // Función para exportar a Excel
  const handleExportExcel = async (): Promise<void> => {
    if (!selectedChecklist) {
      toast.error("No hay ninguna lista de chequeo seleccionada para exportar");
      return;
    }

    try {
      toast.info("📊 Generando Excel...");
      
      const base64Data = await exportChecklistToExcel(parseInt(selectedChecklist.id));
      const fileName = `checklist_${selectedChecklist.id}_trimestre_${selectedChecklist.trimester || 'NA'}.xlsx`;
      
      downloadFileFromBase64(base64Data, fileName, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      
      toast.success("📥 Excel descargado exitosamente");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      toast.error("Error al exportar a Excel");
    }
  };

  return (
    <div className="w-full">
      {/* Contenido principal adaptado al layout */}
      <div className="p-6 space-y-6">
        <PageTitle>Lista de Chequeo - Vista del Instructor</PageTitle>

        {/* Información del centro y datos generales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-black/20 shadow rounded border border-darkGreen/10 dark:border-shadowBlue/30 space-y-2 transition-colors duration-300">
            <p className="text-2xl font-bold text-black dark:text-white">Centro de Formación:</p>
            <p className="text-base text-black dark:text-white">Centro de Servicios Financieros</p>
            <p className="text-2xl font-bold text-black dark:text-white">Fecha:</p>
            <p className="text-base text-black dark:text-white">05/02/2024 - 05/05/2024</p>
          </div>
          <div className="p-4 bg-white dark:bg-black/20 shadow rounded border border-darkGreen/10 dark:border-shadowBlue/30 space-y-2 transition-colors duration-300">
            <p className="text-2xl font-bold text-black dark:text-white">Jornada:</p>
            <p className="text-base text-black dark:text-white">Diurna</p>
            <p className="text-2xl font-bold text-black dark:text-white">Ficha:</p>
            <p className="text-base text-black dark:text-white">2558735</p>
          </div>
          <div className="p-4 bg-white dark:bg-black/20 shadow rounded border border-darkGreen/10 dark:border-shadowBlue/30 space-y-2 transition-colors duration-300">
            <p className="text-2xl font-bold text-black dark:text-white">Instructor Calificador:</p>
            <p className="text-base text-black dark:text-white">Juan Pérez</p>
            <p className="text-2xl font-bold text-black dark:text-white">Lista Seleccionada:</p>
            {selectedChecklist ? (
              <p className="text-base text-black dark:text-white">ID: {selectedChecklist.id} - {selectedChecklist.component || 'N/A'}</p>
            ) : (
              <p className="text-base text-gray-500 dark:text-gray-400">Ninguna lista seleccionada</p>
            )}
          </div>

          {/* Sección de Evaluación */}
          {selectedChecklist && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 shadow rounded border border-green-200 dark:border-green-800 space-y-4 transition-colors duration-300">
              <h3 className="text-xl font-bold text-green-900 dark:text-green-100">
                📋 Evaluación de Lista de Chequeo
              </h3>
              
              {selectedEvaluation ? (
                <div className="space-y-3">
                  {/* Verificar si la evaluación está completa o pendiente */}
                  {(!selectedEvaluation.recommendations || !selectedEvaluation.valueJudgment) ? (
                    <div className="bg-yellow-100 dark:bg-yellow-800 p-3 rounded-md">
                      <p className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
                        📝 <strong>Llenar Evaluación:</strong> Complete los campos para finalizar la evaluación
                      </p>
                    </div>
                  ) : (
                    <div className="bg-green-100 dark:bg-green-800 p-3 rounded-md">
                      <p className="text-green-800 dark:text-green-200 text-sm font-medium">
                        ✅ <strong>Evaluación Completada:</strong> Puede modificar los datos si es necesario
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Observaciones: <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={evaluationObservations}
                      onChange={(e) => setEvaluationObservations(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                      rows={3}
                      placeholder="Ingrese sus observaciones generales sobre la evaluación..."
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Recomendaciones: <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={evaluationRecommendations}
                      onChange={(e) => setEvaluationRecommendations(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                      rows={4}
                      placeholder="Ingrese sus recomendaciones para esta evaluación..."
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Juicio de Valor: <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={evaluationJudgment}
                      onChange={(e) => setEvaluationJudgment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                      required
                    >
                      <option value="">Seleccione un juicio de valor</option>
                      <option value="PENDIENTE">Pendiente</option>
                      <option value="EXCELENTE">Excelente</option>
                      <option value="BUENO">Bueno</option>
                      <option value="ACEPTABLE">Aceptable</option>
                      <option value="DEFICIENTE">Deficiente</option>
                      <option value="RECHAZADO">Rechazado</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={handleCompleteEvaluation}
                      disabled={!evaluationObservations?.trim() || !evaluationRecommendations?.trim() || !evaluationJudgment || evaluationJudgment === "PENDIENTE"}
                      className={`px-6 py-2 rounded-md transition-colors duration-200 flex items-center space-x-2 ${
                        (!evaluationObservations?.trim() || !evaluationRecommendations?.trim() || !evaluationJudgment || evaluationJudgment === "PENDIENTE")
                          ? 'bg-gray-400 cursor-not-allowed text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      <Save className="w-4 h-4" />
                      <span>
                        {(!selectedEvaluation?.recommendations || !selectedEvaluation?.valueJudgment) 
                          ? '💾 Guardar Evaluación' 
                          : '✏️ Actualizar Evaluación'
                        }
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-red-100 dark:bg-red-800 p-3 rounded-md">
                    <p className="text-red-800 dark:text-red-200 text-sm">
                      ❌ No se encontró evaluación asignada para esta lista de chequeo
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      Esta lista puede no tener una evaluación creada automáticamente.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      💡 <strong>Sugerencia:</strong> Contacte al coordinador para que cree una evaluación para esta lista de chequeo.
                    </p>
                    
                    {/* Botones de acción */}
                    <div className="space-y-3">
                      <button
                        onClick={() => toast.info("📞 Contacte al coordinador para crear una evaluación para esta lista de chequeo")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-200 flex items-center space-x-2 mx-auto"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Solicitar Evaluación al Coordinador</span>
                      </button>
                      
                      {/* Botón de debug temporal */}
                      <button
                        onClick={debugAllEvaluations}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-600 transition-colors mx-auto block"
                      >
                        🔍 Debug: Ver todas las evaluaciones
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Controles de filtros y acciones */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <select
              onChange={(e) => handleTrimesterChange(e.target.value)}
              value={selectedTrimester}
              className="p-2 border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 border rounded"
            >
              <option value="todos">Todos los Trimestres</option>
              {[...Array(7)].map((_, i) => (
                <option key={i + 1} value={i + 1}>Trimestre {i + 1}</option>
              ))}
            </select>

            <select
              onChange={(e) => handleChecklistChange(e.target.value)}
              value={selectedChecklist?.id || ""}
              className="p-2 border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 border rounded"
              disabled={filteredChecklists.length === 0}
            >
              <option value="">Seleccionar Lista de Chequeo</option>
              {filteredChecklists.map((checklist) => (
                <option key={checklist.id} value={checklist.id}>
                  ID: {checklist.id} - {checklist.component || 'Lista de Chequeo'} (T{checklist.trimester || 'N/A'})
                </option>
              ))}
            </select>

            <button
              onClick={handleSaveChecklist}
              disabled={!selectedChecklist}
              className={`flex items-center gap-1 px-4 py-2 rounded-md border transition-colors duration-300 ${
                selectedChecklist
                  ? 'hover:border-[#01b001] border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white'
                  : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" /> Guardar Lista de Chequeo
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Listas activas: {activeChecklists.length} | Filtradas: {filteredChecklists.length}
            </span>
            <button 
              onClick={handleExportPDF}
              disabled={!selectedChecklist}
              className={`flex items-center gap-1 px-4 py-2 border-[#0e324b] rounded-md transition-colors duration-300 ${
                selectedChecklist
                  ? 'bg-gradient-to-r from-lime-600 to-lime-500 text-white hover:from-lime-700 hover:to-lime-600'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              } focus:outline-none`}
            >
              <FileDown className="w-4 h-4" /> PDF
            </button>
            <button 
              onClick={handleExportExcel}
              disabled={!selectedChecklist}
              className={`flex items-center gap-1 px-4 py-2 border-[#0e324b] rounded-md transition-colors duration-300 ${
                selectedChecklist
                  ? 'bg-gradient-to-r from-lime-600 to-lime-500 text-white hover:from-lime-700 hover:to-lime-600'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              } focus:outline-none`}
            >
              <FileDown className="w-4 h-4" /> Excel
            </button>
          </div>
        </div>

        {/* Estado de carga o sin listas activas */}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0e324b]"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando listas de chequeo activas...</span>
          </div>
        ) : filteredChecklists.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {selectedTrimester === "todos" 
                ? "No hay listas de chequeo activas disponibles" 
                : `No hay listas de chequeo activas para el trimestre ${selectedTrimester}`
              }
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              Las listas de chequeo deben ser activadas desde la vista del coordinador
            </p>
          </div>
        ) : !selectedChecklist ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Selecciona una lista de chequeo para comenzar la evaluación
            </p>
          </div>
        ) : (
          <>
            {/* Tabla principal */}
            <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-300">
              <table className="min-w-full text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
                <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-600 text-gray-600 dark:text-gray-400">
                  <tr className="font-medium text-gray-900 dark:text-white">
                    <th className="text-xl font-bold p-3 text-center">Item</th>
                    <th className="text-xl font-bold p-3 text-left">Indicadores y/o Variables</th>
                    <th className="text-xl font-bold p-3 text-center">Sí / No</th>
                    <th className="text-xl font-bold p-3 text-left">Observaciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentItems.map((item) => {
                    const itemState = itemStates[item.id] || { completed: item.completed, observations: item.observations };
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                        <td className="p-6 text-center font-medium text-gray-900 dark:text-white">{item.id}</td>
                        <td className="p-6 font-medium text-gray-900 dark:text-white">{item.indicator}</td>
                        <td className="p-6 text-center font-medium text-gray-900 dark:text-white">
                          <div className="flex justify-center space-x-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`completed-${item.id}`}
                                value="yes"
                                onChange={() => handleItemChange(item.id, "completed", true)}
                                checked={itemState.completed === true}
                                className="w-4 h-4 text-green-600 focus:ring-green-500"
                              />
                              <Check className="w-5 h-5 text-green-600" />
                              <span className="text-sm text-green-600 font-medium">Sí</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`completed-${item.id}`}
                                value="no"
                                onChange={() => handleItemChange(item.id, "completed", false)}
                                checked={itemState.completed === false}
                                className="w-4 h-4 text-red-600 focus:ring-red-500"
                              />
                              <X className="w-5 h-5 text-red-600" />
                              <span className="text-sm text-red-600 font-medium">No</span>
                            </label>
                          </div>
                        </td>
                        <td className="p-3">
                          <textarea
                            value={itemState.observations || ""}
                            onChange={(e) => handleItemChange(item.id, "observations", e.target.value)}
                            className="border border-gray-300 dark:border-gray-600 rounded w-full p-3 min-h-[80px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                            placeholder="Agregar observaciones detalladas sobre este item..."
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="flex justify-center items-center space-x-4 mt-4">
              <button
                className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#0e324b] hover:bg-[#01b001] text-white'} transition-colors duration-300`}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ‹ Anterior
              </button>
              <div className="text-lg font-medium">
                Página {currentPage} de {totalPages}
              </div>
              <button
                className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#0e324b] hover:bg-[#01b001] text-white'} transition-colors duration-300`}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Siguiente ›
              </button>
            </div>

            {/* Sección de firmas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Firma Instructor Técnico Anterior */}
              <div className="bg-white p-4 rounded-lg shadow-md border border-gray-300">
                <p className="text-lg font-semibold text-center mb-4">Instructor técnico anterior</p>
                <div className="flex flex-col items-center">
                  <label className="flex flex-col items-center cursor-pointer mb-3 p-4 border-2 border-dashed border-[#00324d] rounded-lg w-full hover:border-[#01b001] transition-colors duration-300">
                    <UploadCloud className="w-8 h-8 hover:text-[#01b001] transition-colors duration-300 mb-2" />
                    <span className="font-semibold text-sm text-center">Subir firma</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setFirmaAnterior)}
                      className="hidden"
                    />
                  </label>
                  {firmaAnterior && (
                    <div className="w-full flex justify-center">
                      <Image
                        src={firmaAnterior}
                        alt="Firma instructor anterior"
                        width={100}
                        height={100}
                        className="max-h-20 max-w-full object-contain border border-[#00324d] rounded-md p-2"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Firma Instructor Técnico Nuevo */}
              <div className="bg-white p-4 rounded-lg shadow-md border border-gray-300">
                <p className="text-lg font-semibold text-center mb-4">Instructor técnico nuevo</p>
                <div className="flex flex-col items-center">
                  <label className="flex flex-col items-center cursor-pointer mb-3 p-4 border-2 border-dashed border-[#00324d] rounded-lg w-full hover:border-[#01b001] transition-colors duration-300">
                    <UploadCloud className="w-8 h-8 hover:text-[#01b001] transition-colors duration-300 mb-2" />
                    <span className="font-semibold text-sm text-center">Subir firma</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setFirmaNuevo)}
                      className="hidden"
                    />
                  </label>
                  {firmaNuevo && (
                    <div className="w-full flex justify-center">
                      <Image
                        src={firmaNuevo}
                        alt="Firma instructor nuevo"
                        height={100}
                        width={100}
                        className="max-h-20 max-w-full object-contain border border-[#00324d] rounded-md p-2"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
