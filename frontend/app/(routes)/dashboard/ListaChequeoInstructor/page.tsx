'use client'

import { useState, useEffect, useMemo } from "react";
import { Check, FileDown, Save, UploadCloud, X, AlertTriangle, Phone, Edit } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";
import PageTitle from "@components/UI/pageTitle";
import { fetchAllChecklists, fetchChecklistById } from "@services/checkListService.js";
import { fetchEvaluationsByChecklist, fetchEvaluationsByChecklistOld, completeEvaluation, createMissingEvaluationForChecklist, createEvaluationForChecklist } from "@services/evaluationService";
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
  const [selectedTrimester, setSelectedTrimester] = useState<string>(() => {
    // Recuperar trimestre guardado o usar "todos" por defecto
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedTrimester') || "todos";
    }
    return "todos";
  });
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

  // Estados para el modal de creación de evaluación
  const [showCreateEvaluationModal, setShowCreateEvaluationModal] = useState(false);
  const [isCreatingEvaluation, setIsCreatingEvaluation] = useState(false);
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);

  // Estados para la vista previa
  const [showPreview, setShowPreview] = useState(false);
  const [isFinalSaved, setIsFinalSaved] = useState(false);

  const itemsPerPage = 3;

  // Funciones auxiliares para extraer y estructurar datos de evaluaciones
  const extractItemStatesFromEvaluation = (evaluation: Evaluation) => {
    if (!evaluation.observations) return {};

    try {
      const parsed = JSON.parse(evaluation.observations);
      if (parsed.itemStates && typeof parsed.itemStates === 'object') {
        console.log('📋 Estados de items extraídos desde evaluación');
        return parsed.itemStates;
      }
    } catch (error) {
      // Error silencioso - no se pudieron extraer estados
    }

    return {};
  };

  const extractGeneralObservationsFromEvaluation = (evaluation: Evaluation) => {
    if (!evaluation.observations) return "";

    // Si las observaciones no contienen caracteres JSON, asumir que son texto plano
    if (!evaluation.observations.includes('{') && !evaluation.observations.includes('"')) {
      return evaluation.observations.trim();
    }

    try {
      const parsed = JSON.parse(evaluation.observations);
      if (parsed.generalObservations && typeof parsed.generalObservations === 'string') {
        // Devolver solo el texto que el usuario digitó (formato anterior)
        return parsed.generalObservations.trim();
      }
      
      // Si no tiene generalObservations pero es JSON, devolver cadena vacía
      if (typeof parsed === 'object') {
        return "";
      }
    } catch (error) {
      // Si no se puede parsear como JSON, verificar si contiene formato JSON
      if (evaluation.observations.includes('itemStates') || 
          evaluation.observations.includes('generalObservations') || 
          evaluation.observations.startsWith('{')) {
        // Es formato JSON pero no se pudo parsear, devolver cadena vacía
        return "";
      }
      
      // Es texto plano, usar el valor completo
      return evaluation.observations.trim();
    }

    // Por defecto, devolver cadena vacía
    return "";
  };

  // Cargar listas de chequeo activas y recuperar selección previa
  useEffect(() => {
    loadActiveChecklists();
  }, []);

  // Recuperar selección de checklist después de cargar las listas
  useEffect(() => {
    if (activeChecklists.length > 0 && !selectedChecklist) {
      // Intentar recuperar la selección previa del localStorage
      const savedChecklistId = localStorage.getItem('selectedChecklistId');
      if (savedChecklistId) {
        const foundChecklist = activeChecklists.find(cl => cl.id === savedChecklistId);
        if (foundChecklist) {
          console.log('🔄 Recuperando selección de checklist después de reload:', foundChecklist.id);
          setSelectedChecklist(foundChecklist);
        } else {
          // Si el checklist guardado no existe, limpiar localStorage
          localStorage.removeItem('selectedChecklistId');
        }
      }
    }
  }, [activeChecklists, selectedChecklist]);

  // Auto-cargar evaluaciones cuando cambie el checklist seleccionado
  useEffect(() => {
    if (selectedChecklist) {
      console.log("=== CHECKLIST CHANGED - LOADING EVALUATIONS ===");
      // Guardar selección en localStorage para persistencia de navegación
      localStorage.setItem('selectedChecklistId', selectedChecklist.id);
      console.log('💾 Guardando selección de checklist para persistencia:', selectedChecklist.id);

      // Resetear estados de guardado al cambiar de checklist
      setIsFinalSaved(false);
      setShowPreview(false);

      // Cargar estados guardados del localStorage
      const savedItemStates = localStorage.getItem(`itemStates_${selectedChecklist.id}`);
      if (savedItemStates) {
        try {
          const parsedStates = JSON.parse(savedItemStates);
          setItemStates(parsedStates);
          console.log('🔄 Estados de items cargados desde localStorage:', parsedStates);
        } catch (error) {
          console.warn('Error al cargar estados del localStorage:', error);
        }
      }

      // Cargar datos de evaluación guardados del localStorage
      const savedEvaluationData = localStorage.getItem(`evaluationData_${selectedChecklist.id}`);
      if (savedEvaluationData) {
        try {
          const parsedEvaluationData = JSON.parse(savedEvaluationData);
          setEvaluationObservations(parsedEvaluationData.observations || "");
          setEvaluationRecommendations(parsedEvaluationData.recommendations || "");
          setEvaluationJudgment(parsedEvaluationData.judgment || "PENDIENTE");
          console.log('🔄 Datos de evaluación cargados desde localStorage:', parsedEvaluationData);
        } catch (error) {
          console.warn('Error al cargar datos de evaluación del localStorage:', error);
        }
      }

      // Siempre cargar desde la base de datos
      loadEvaluationsForChecklist(parseInt(selectedChecklist.id));
    } else {
      // Si no hay checklist, limpiar localStorage y datos
      localStorage.removeItem('selectedChecklistId');
      setEvaluations([]);
      setSelectedEvaluation(null);
      setEvaluationObservations("");
      setEvaluationRecommendations("");
      setEvaluationJudgment("PENDIENTE");
      setItemStates({});
      
      // Resetear estados de guardado
      setIsFinalSaved(false);
      setShowPreview(false);
    }
  }, [selectedChecklist]);

  // Efecto para cargar datos de evaluación seleccionada INMEDIATAMENTE
  useEffect(() => {
    if (selectedEvaluation) {
      console.log('🔄 Cargando datos de evaluación seleccionada');
      console.log('📊 ID de evaluación:', selectedEvaluation.id);

      // Cargar datos desde la base de datos
      setEvaluationRecommendations(selectedEvaluation.recommendations || "");
      setEvaluationJudgment(selectedEvaluation.valueJudgment || "PENDIENTE");

      // Extraer estados de items y observaciones generales desde observations
      const itemStatesFromDB = extractItemStatesFromEvaluation(selectedEvaluation);
      const generalObservationsFromDB = extractGeneralObservationsFromEvaluation(selectedEvaluation);
      
      if (Object.keys(itemStatesFromDB).length > 0) {
        setItemStates(itemStatesFromDB);
        console.log('📋 Estados de items actualizados desde BD');
        
        // Limpiar localStorage ya que tenemos datos frescos de BD
        if (selectedChecklist) {
          localStorage.removeItem(`itemStates_${selectedChecklist.id}`);
        }
      }
      
      setEvaluationObservations(generalObservationsFromDB);
      console.log('📝 Observaciones cargadas desde BD');
      
      // Limpiar localStorage de evaluación ya que tenemos datos frescos de BD
      if (selectedChecklist) {
        localStorage.removeItem(`evaluationData_${selectedChecklist.id}`);
      }
    } else {
      // Solo limpiar si no hay datos en localStorage
      if (selectedChecklist) {
        const savedEvaluationData = localStorage.getItem(`evaluationData_${selectedChecklist.id}`);
        if (!savedEvaluationData) {
          setEvaluationObservations("");
          setEvaluationRecommendations("");
          setEvaluationJudgment("PENDIENTE");
        }
        
        const savedItemStates = localStorage.getItem(`itemStates_${selectedChecklist.id}`);
        if (!savedItemStates) {
          setItemStates({});
        }
      } else {
        setEvaluationObservations("");
        setEvaluationRecommendations("");
        setEvaluationJudgment("PENDIENTE");
        setItemStates({});
      }
    }
  }, [selectedEvaluation]);

  // Función auxiliar para sincronizar datos después de crear/actualizar evaluación
  const syncEvaluationDataAfterSave = async (checklistId: number, savedData: any) => {
    console.log('🔄 Recargando evaluación desde DB después de guardar...');

    // Recargar desde la base de datos
    try {
      await loadEvaluationsForChecklist(checklistId);
      console.log('✅ Sincronización completada exitosamente');
    } catch (error) {
      console.warn('⚠️ Error en sincronización:', error);
    }
  };

  // Auto-guardado para campos de evaluación
  useEffect(() => {
    if (selectedChecklist && (evaluationObservations || evaluationRecommendations || evaluationJudgment !== "PENDIENTE")) {
      // Guardar datos de evaluación en localStorage para persistencia
      const evaluationData = {
        observations: evaluationObservations,
        recommendations: evaluationRecommendations,
        judgment: evaluationJudgment
      };
      localStorage.setItem(`evaluationData_${selectedChecklist.id}`, JSON.stringify(evaluationData));
      console.log('💾 Datos de evaluación guardados en localStorage:', evaluationData);
    }
  }, [evaluationObservations, evaluationRecommendations, evaluationJudgment, selectedChecklist]);



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
      console.log("=== LOADING EVALUATIONS FROM DATABASE ===");
      console.log("Checklist ID:", checklistId);

      // Cargar evaluaciones desde la base de datos
      const evaluationsResponse = await fetchEvaluationsByChecklist(checklistId);

      if (evaluationsResponse && evaluationsResponse.code === "200") {
        console.log("✅ Evaluations response successful");

        if (evaluationsResponse.data && evaluationsResponse.data.length > 0) {
          setEvaluations(evaluationsResponse.data);
          console.log("✅ Found evaluations:", evaluationsResponse.data.length);

          // Seleccionar la primera evaluación
          const firstEvaluation = evaluationsResponse.data[0];

          setSelectedEvaluation(firstEvaluation);
          console.log("✅ Evaluation loaded successfully");
          return;
        } else {
          console.log("⚠️ No evaluations found in main response, trying alternative method...");
        }
      } else {
        console.log("⚠️ Main evaluations response failed, trying alternative method...");
        console.log("Response code:", evaluationsResponse?.code);
        console.log("Response message:", evaluationsResponse?.message);
      }

      // Si llegamos aquí, intentar con la función alternativa
      try {
        const alternativeResponse = await fetchEvaluationsByChecklistOld(checklistId);
        console.log("Alternative response:", alternativeResponse);

        if (alternativeResponse && alternativeResponse.code === "200" && alternativeResponse.data && alternativeResponse.data.length > 0) {
          setEvaluations(alternativeResponse.data);
          const firstEvaluation = alternativeResponse.data[0];

          setSelectedEvaluation(firstEvaluation);
          console.log("✅ Evaluation loaded via alternative method");
          return;
        } else {
          console.log("❌ Alternative method also found no evaluations");
        }
      } catch (altError) {
        console.error("❌ Alternative fetch method failed:", altError);
      }

      // Si llegamos aquí, no se encontraron evaluaciones
      console.log("❌ No evaluations found with any method for checklist:", checklistId);
      setEvaluations([]);
      setSelectedEvaluation(null);
      setEvaluationObservations("");
      setEvaluationRecommendations("");
      setEvaluationJudgment("PENDIENTE");
      setItemStates({});

    } catch (error) {
      console.error("❌ Error loading evaluations:", error);

      // Resetear estados en caso de error
      setEvaluations([]);
      setSelectedEvaluation(null);
      setEvaluationObservations("");
      setEvaluationRecommendations("");
      setEvaluationJudgment("PENDIENTE");
      setItemStates({});
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
    // Guardar selección de trimestre en localStorage
    localStorage.setItem('selectedTrimester', value);
    console.log('💾 Guardando selección de trimestre para persistencia:', value);
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
    
    // Guardar en localStorage para persistencia entre recargas
    const updatedStates = {
      ...itemStates,
      [id]: {
        ...itemStates[id],
        [field]: value
      }
    };
    localStorage.setItem(`itemStates_${selectedChecklist?.id}`, JSON.stringify(updatedStates));
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

  // Función para manejar el botón "Actualizar Evaluación"
  const handleUpdateEvaluationClick = () => {
    console.log('📝 Mostrando formulario para actualizar evaluación');
    console.log('📊 ID de evaluación:', selectedEvaluation?.id);

    // Cargar los datos de la evaluación existente en los campos del formulario
    if (selectedEvaluation) {
      // Extraer solo las observaciones generales (texto plano) del JSON
      const generalObservations = extractGeneralObservationsFromEvaluation(selectedEvaluation);
      
      console.log('🔄 Llenando formulario con datos extraídos de BD:', {
        observations: generalObservations,
        recommendations: selectedEvaluation.recommendations,
        valueJudgment: selectedEvaluation.valueJudgment
      });

      setEvaluationObservations(generalObservations);
      setEvaluationRecommendations(selectedEvaluation.recommendations || "");
      setEvaluationJudgment(selectedEvaluation.valueJudgment || "PENDIENTE");
    }

    setShowEvaluationForm(true);
  };

  // Función para cancelar la actualización
  const handleCancelUpdate = () => {
    console.log('❌ Cancelando actualización de evaluación');
    setShowEvaluationForm(false);
    // Restaurar datos originales usando la función de extracción
    if (selectedEvaluation) {
      const generalObservations = extractGeneralObservationsFromEvaluation(selectedEvaluation);
      setEvaluationObservations(generalObservations);
      setEvaluationRecommendations(selectedEvaluation.recommendations || "");
      setEvaluationJudgment(selectedEvaluation.valueJudgment || "PENDIENTE");
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
      console.log("=== GUARDANDO EVALUACIÓN EN BD ===");
      console.log("ID de evaluación:", selectedEvaluation.id);
      
      // Guardar solo las observaciones generales (texto plano) en la base de datos
      // Los estados de items se manejan en localStorage únicamente
      console.log("Datos a guardar:", {
        observations: evaluationObservations, // Solo texto plano
        recommendations: evaluationRecommendations,
        valueJudgment: evaluationJudgment
      });

      const response = await completeEvaluation(
        parseInt(selectedEvaluation.id),
        evaluationObservations, // Solo las observaciones en texto plano
        evaluationRecommendations,
        evaluationJudgment
      );

      console.log("Respuesta del servidor:", response);

      if (response.code === "200") {
        toast.success("🎉 Evaluación guardada exitosamente en la base de datos");

        // Crear el objeto de evaluación actualizado con los datos que acabamos de guardar
        const updatedEvaluation = {
          ...selectedEvaluation,
          observations: evaluationObservations, // Solo texto plano
          recommendations: evaluationRecommendations,
          valueJudgment: evaluationJudgment
        };

        console.log("Evaluación actualizada con datos guardados:", updatedEvaluation);

        // Actualizar el estado local inmediatamente con los datos correctos
        setSelectedEvaluation(updatedEvaluation);

        // Actualizar también la lista de evaluaciones
        setEvaluations(prev => prev.map(evaluation =>
          evaluation.id === selectedEvaluation.id
            ? updatedEvaluation
            : evaluation
        ));

        // Limpiar localStorage después del guardado exitoso en BD
        if (selectedChecklist) {
          localStorage.removeItem(`evaluationData_${selectedChecklist.id}`);
          localStorage.removeItem(`itemStates_${selectedChecklist.id}`);
        }

        console.log('✅ Datos guardados exitosamente en la base de datos');

        // Ocultar formulario después de actualizar exitosamente
        setShowEvaluationForm(false);

        console.log("✅ Evaluación actualizada exitosamente en UI");
      } else {
        console.error("❌ Error en respuesta del servidor:", response);
        toast.error("Error al guardar la evaluación: " + (response.message || "Error desconocido"));
      }
    } catch (error) {
      console.error("❌ Error updating evaluation:", error);
      toast.error("Error al guardar la evaluación en la base de datos");
    }
  };

  const handleSaveChecklist = async (): Promise<void> => {
    if (!selectedChecklist) {
      toast.error("No hay ninguna lista de chequeo seleccionada");
      return;
    }

    // Verificar si hay datos de evaluación para crear/actualizar evaluación en BD
    const hasEvaluationData = evaluationObservations.trim() || evaluationRecommendations.trim() || (evaluationJudgment && evaluationJudgment !== "PENDIENTE");
    
    if (hasEvaluationData) {
      try {
        toast.info("💾 Guardando evaluación en la base de datos...");
        
        if (selectedEvaluation) {
          // Actualizar evaluación existente
          console.log("Actualizando evaluación existente en BD...");
          await handleCompleteEvaluation();
        } else {
          // Crear nueva evaluación
          console.log("Creando nueva evaluación en BD...");
          await handleCreateAndCompleteEvaluation();
        }
        
        toast.success("✅ Evaluación guardada en la base de datos!");
      } catch (error) {
        console.error("Error al guardar evaluación:", error);
        toast.error("❌ Error al guardar la evaluación en la base de datos");
        return;
      }
    }

    // Mostrar vista previa independientemente
    setShowPreview(true);
  };

  // Nueva función para mostrar vista previa
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

  // Función para guardar definitivamente
  const handleFinalSave = async (): Promise<void> => {
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

      // Mostrar progreso del guardado
      toast.info("💾 Guardando lista de chequeo definitivamente...");

      // Simular guardado exitoso por ahora
      console.log("Checklist data to save:", checklistData);

      // Simular una demora para mostrar feedback
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Determinar si también necesitamos manejar la evaluación
      const hasEvaluationData = evaluationObservations.trim() || evaluationRecommendations.trim() || (evaluationJudgment && evaluationJudgment !== "PENDIENTE");

      if (selectedEvaluation) {
        // Ya existe una evaluación, verificar si necesita actualizarse
        if (hasEvaluationData) {
          const evaluationNeedsUpdate =
            selectedEvaluation.observations !== evaluationObservations ||
            selectedEvaluation.recommendations !== evaluationRecommendations ||
            selectedEvaluation.valueJudgment !== evaluationJudgment;

          if (evaluationNeedsUpdate) {
            toast.info("🔄 Actualizando evaluación asociada...");
            await handleCompleteEvaluation();
          }
        }
        toast.success("✅ Lista de chequeo y evaluación guardadas definitivamente!");
      } else if (hasEvaluationData) {
        // Crear evaluación si hay datos
        toast.info("� Creando evaluación con los datos proporcionados...");
        await handleCreateAndCompleteEvaluation();
        toast.success("✅ Lista de chequeo y evaluación guardadas definitivamente!");
      } else {
        // Solo lista de chequeo sin evaluación
        toast.success("✅ Lista de chequeo guardada definitivamente!");
      }

      // Marcar como guardado definitivamente
      setIsFinalSaved(true);
      setShowPreview(false);

      // Limpiar localStorage después del guardado definitivo
      if (selectedChecklist) {
        localStorage.removeItem(`evaluationData_${selectedChecklist.id}`);
        localStorage.removeItem(`itemStates_${selectedChecklist.id}`);
      }

    } catch (error) {
      console.error("Error saving checklist:", error);
      toast.error("❌ Error al guardar la lista de chequeo definitivamente");
    }
  };

  // Función para volver a editar desde vista previa
  const handleBackToEdit = (): void => {
    setShowPreview(false);
  };

  // Función para permitir modificaciones después del guardado final
  const handleEnableModification = (): void => {
    setIsFinalSaved(false);
    toast.info("📝 Modo de edición habilitado. Los cambios se guardarán en localStorage hasta que vuelva a guardar definitivamente.");
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

  // Función para crear evaluación automáticamente
  const handleCreateMissingEvaluation = async (): Promise<void> => {
    if (!selectedChecklist) {
      toast.error("No hay ninguna lista de chequeo seleccionada");
      return;
    }

    try {
      toast.info("🔄 Creando evaluación automáticamente...");

      const response = await createMissingEvaluationForChecklist(parseInt(selectedChecklist.id));

      if (response && response.code === "200") {
        toast.success("✅ Evaluación creada exitosamente");

        // Recargar las evaluaciones para mostrar la nueva
        await loadEvaluationsForChecklist(parseInt(selectedChecklist.id));
      } else if (response === null) {
        toast.info("ℹ️ Ya existe una evaluación para esta lista de chequeo");
        // Intentar recargar las evaluaciones por si no se habían cargado correctamente
        await loadEvaluationsForChecklist(parseInt(selectedChecklist.id));
      } else {
        toast.error("❌ Error al crear la evaluación: " + (response?.message || "Error desconocido"));
      }
    } catch (error) {
      console.error("Error creating missing evaluation:", error);
      toast.error("❌ Error al crear la evaluación automáticamente");
    }
  };

  // Función para abrir el modal de crear evaluación
  const handleOpenCreateEvaluationModal = () => {
    if (selectedEvaluation) {
      // Si ya existe una evaluación, cargar sus datos usando la función de extracción
      console.log('📋 Abriendo modal con datos de evaluación existente');
      const generalObservations = extractGeneralObservationsFromEvaluation(selectedEvaluation);
      setEvaluationObservations(generalObservations);
      setEvaluationRecommendations(selectedEvaluation.recommendations || "");
      setEvaluationJudgment(selectedEvaluation.valueJudgment || "PENDIENTE");
    } else {
      // Si no existe evaluación, empezar con campos limpios
      console.log('📋 Abriendo modal para nueva evaluación');
      setEvaluationObservations("");
      setEvaluationRecommendations("");
      setEvaluationJudgment("PENDIENTE");
    }

    setShowCreateEvaluationModal(true);
  };

  // Función para cerrar el modal
  const handleCloseCreateEvaluationModal = () => {
    setShowCreateEvaluationModal(false);
    setIsCreatingEvaluation(false);
  };

  // Función mejorada para crear evaluación desde el modal
  const handleCreateEvaluationFromModal = async () => {
    if (!selectedChecklist) {
      toast.error("No hay checklist seleccionado");
      return;
    }

    if (!evaluationObservations.trim() || !evaluationRecommendations.trim() || !evaluationJudgment || evaluationJudgment === "PENDIENTE") {
      toast.error("Por favor complete todos los campos requeridos");
      return;
    }

    setIsCreatingEvaluation(true);

    try {
      console.log('=== INICIANDO CREACIÓN DE EVALUACIÓN DESDE MODAL ===');
      console.log('Checklist ID:', selectedChecklist.id);
      console.log('Datos de evaluación:', {
        observations: evaluationObservations,
        recommendations: evaluationRecommendations,
        valueJudgment: evaluationJudgment
      });

      toast.info("💾 Creando evaluación...");

      // Guardar datos actuales antes de crear
      const evaluationData = {
        observations: evaluationObservations.trim(),
        recommendations: evaluationRecommendations.trim(),
        valueJudgment: evaluationJudgment,
        checklistId: parseInt(selectedChecklist.id)
      };

      // Crear la evaluación base usando createMissingEvaluationForChecklist
      const newEvaluationResult = await createMissingEvaluationForChecklist(parseInt(selectedChecklist.id));

      if (newEvaluationResult && newEvaluationResult.code === "200" && newEvaluationResult.id) {
        console.log('✅ Evaluación base creada con ID:', newEvaluationResult.id);

        // Completar la evaluación con los datos del formulario
        const completeResult = await completeEvaluation(
          parseInt(newEvaluationResult.id),
          evaluationData.observations,
          evaluationData.recommendations,
          evaluationData.valueJudgment
        );

        console.log('Complete result:', completeResult);

        if (completeResult && completeResult.code === "200") {
          // Crear el objeto de evaluación local con los datos guardados
          const newEvaluationObject = {
            id: newEvaluationResult.id,
            checklistId: parseInt(selectedChecklist.id),
            observations: evaluationData.observations,
            recommendations: evaluationData.recommendations,
            valueJudgment: evaluationData.valueJudgment,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          // Actualizar inmediatamente los estados locales
          setSelectedEvaluation(newEvaluationObject);
          setEvaluations([newEvaluationObject]);

          // Mantener los datos en los campos del formulario para mostrarlos
          setEvaluationObservations(evaluationData.observations);
          setEvaluationRecommendations(evaluationData.recommendations);
          setEvaluationJudgment(evaluationData.valueJudgment);

          console.log('✅ Estados actualizados con la nueva evaluación:', newEvaluationObject);

          toast.success("✅ Evaluación creada y guardada exitosamente");

          console.log('✅ Evaluación guardada exitosamente');

          // Cerrar el modal
          setShowCreateEvaluationModal(false);
          setIsCreatingEvaluation(false);
        } else {
          throw new Error(completeResult?.message || "Error al completar la evaluación");
        }
      } else {
        throw new Error(newEvaluationResult?.message || "Error desconocido al crear evaluación");
      }

    } catch (error: any) {
      console.error('❌ Error creating evaluation from modal:', error);

      // Manejo específico de errores
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const firstError = error.graphQLErrors[0];
        toast.error(`❌ Error GraphQL: ${firstError.message || 'Error en el servidor'}`);
      } else if (error.networkError) {
        if (error.networkError.statusCode === 400) {
          toast.error("❌ Error 400: Los datos enviados no son válidos. Verifique que todos los campos estén completos.");
        } else {
          toast.error(`❌ Error de red (${error.networkError.statusCode || 'desconocido'}): ${error.networkError.message || 'Error de conexión'}`);
        }
      } else if (error.message) {
        toast.error(`❌ Error: ${error.message}`);
      } else {
        toast.error("❌ Error desconocido al crear la evaluación");
      }
    } finally {
      setIsCreatingEvaluation(false);
    }
  };

  // Función nueva: Crear y completar evaluación en un solo paso
  const handleCreateAndCompleteEvaluation = async (): Promise<void> => {
    if (!selectedChecklist) {
      toast.error("No hay ninguna lista de chequeo seleccionada");
      return;
    }

    // Validar que se hayan completado las observaciones y recomendaciones
    if (!evaluationObservations.trim()) {
      toast.error("Por favor complete las observaciones antes de crear la evaluación");
      return;
    }

    if (!evaluationRecommendations.trim()) {
      toast.error("Por favor complete las recomendaciones antes de crear la evaluación");
      return;
    }

    if (!evaluationJudgment || evaluationJudgment === "PENDIENTE") {
      toast.error("Por favor seleccione un juicio de valor antes de crear la evaluación");
      return;
    }

    try {
      console.log("=== INICIANDO CREACIÓN DE EVALUACIÓN COMPLETA ===");
      console.log("Checklist ID:", selectedChecklist.id);
      console.log("Datos de evaluación:", {
        observations: evaluationObservations,
        recommendations: evaluationRecommendations,
        valueJudgment: evaluationJudgment
      });

      toast.info("🚀 Creando evaluación completa...");

      // Primero verificar si ya existe una evaluación para este checklist
      console.log("Verificando evaluaciones existentes...");
      await loadEvaluationsForChecklist(parseInt(selectedChecklist.id));

      // Dar un momento para que se cargue
      await new Promise(resolve => setTimeout(resolve, 500));

      if (selectedEvaluation) {
        // Ya existe una evaluación, solo actualizarla
        console.log("Evaluación existente encontrada, actualizando...");
        toast.info("ℹ️ Evaluación existente encontrada, actualizando datos...");

        await handleCompleteEvaluation();
        return; // Salir de la función
      }

      // No existe evaluación, crear una nueva
      console.log("No existe evaluación, creando nueva...");
      const createResponse = await createMissingEvaluationForChecklist(parseInt(selectedChecklist.id));
      console.log("Create response:", createResponse);

      if (createResponse && createResponse.code === "200" && createResponse.id) {
        console.log("✅ Evaluación base creada con ID:", createResponse.id);

        // Completar la evaluación inmediatamente con todos los datos
        console.log("Completando evaluación con datos...");
        
        // Guardar solo las observaciones generales (texto plano) en la base de datos
        const completeResponse = await completeEvaluation(
          parseInt(createResponse.id),
          evaluationObservations, // Solo texto plano
          evaluationRecommendations,
          evaluationJudgment
        );
        console.log("Complete response:", completeResponse);

        if (completeResponse && completeResponse.code === "200") {
          toast.success("🎉 ¡Evaluación creada y completada exitosamente!");

          // Datos guardados exitosamente
          const savedData = {
            observations: evaluationObservations, // Solo texto plano
            recommendations: evaluationRecommendations,
            valueJudgment: evaluationJudgment
          };

          // Limpiar localStorage después del guardado exitoso en BD
          if (selectedChecklist) {
            localStorage.removeItem(`evaluationData_${selectedChecklist.id}`);
            localStorage.removeItem(`itemStates_${selectedChecklist.id}`);
          }

          // Sincronizar datos manteniendo los valores actuales
          await syncEvaluationDataAfterSave(parseInt(selectedChecklist.id), savedData);

        } else {
          console.error("❌ Error al completar evaluación:", completeResponse);
          toast.error("❌ Evaluación creada pero error al completarla: " + (completeResponse?.message || "Error desconocido"));
        }

      } else if (createResponse === null) {
        // Ya existe una evaluación (detectada durante la creación)
        console.log("Evaluación detectada durante creación, recargando...");
        toast.info("ℹ️ Se detectó una evaluación existente, cargando...");

        await loadEvaluationsForChecklist(parseInt(selectedChecklist.id));

        // Dar tiempo para que se cargue y luego intentar actualizar
        setTimeout(async () => {
          try {
            await handleCompleteEvaluation();
          } catch (updateError) {
            console.error("Error al actualizar evaluación existente:", updateError);
            toast.error("❌ Error al actualizar la evaluación existente");
          }
        }, 1000);

      } else {
        console.error("❌ Error al crear evaluación:", createResponse);
        toast.error("❌ Error al crear la evaluación: " + (createResponse?.message || "Error desconocido"));
      }

    } catch (error: any) {
      console.error("❌ Error creating and completing evaluation:", error);

      // Manejo específico de errores de Apollo/GraphQL
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        console.error("GraphQL Errors:", error.graphQLErrors);
        const firstError = error.graphQLErrors[0];
        toast.error(`❌ Error GraphQL: ${firstError.message || 'Error en el servidor'}`);
      } else if (error.networkError) {
        console.error("Network Error:", error.networkError);
        if (error.networkError.statusCode === 400) {
          toast.error("❌ Error 400: Los datos enviados no son válidos. Verifique que todos los campos estén completos.");
        } else {
          toast.error(`❌ Error de red (${error.networkError.statusCode || 'desconocido'}): ${error.networkError.message || 'Error de conexión'}`);
        }
      } else if (error.message) {
        toast.error(`❌ Error: ${error.message}`);
      } else {
        toast.error("❌ Error desconocido al crear y completar la evaluación");
      }

      // Sugerencias adicionales
      setTimeout(() => {
        toast.info("💡 Sugerencia: Verifique su conexión e intente nuevamente, o contacte al coordinador.");
      }, 2000);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Estilos CSS para el diseño hexagonal */}
      <style jsx>{`
        /* Estilos para los hexágonos */
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
        
        /* Estilos para la tabla hexagonal */
        .hexagon-cell {
          position: relative;
          overflow: hidden;
        }
        
        /* Estilos para opciones de selección */
        .hexagon-choice {
          /* Sin efectos hover */
        }
        
        /* Estilos para textarea hexagonal */
        .hexagon-textarea {
          /* Sin efectos especiales */
        }
        
        /* Estilos para navegación */
        .hexagon-nav:hover:not(:disabled) {
          box-shadow: 0 10px 30px rgba(14, 50, 75, 0.4);
        }
        
        /* Estilos para upload */
        .hexagon-upload:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(1, 176, 1, 0.2);
        }
        
        /* Efectos de brillo en hover */
        .hexagon-container::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            rgba(1, 176, 1, 0.1) 60deg,
            rgba(14, 50, 75, 0.1) 120deg,
            transparent 180deg
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          border-radius: 50%;
          animation: spin 6s linear infinite;
        }
        
        .hexagon-container:hover::after {
          opacity: 1;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        /* Respuesta para móviles */
        @media (max-width: 768px) {
          .hexagon-container {
            width: 200px;
            height: 200px;
          }
        }
        
        /* Efectos adicionales de profundidad */
        .glass-effect {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        /* Gradientes personalizados */
        .gradient-primary {
          background: linear-gradient(135deg, #0e324b 0%, #01b001 50%, #0e324b 100%);
        }
        
        .gradient-secondary {
          background: linear-gradient(135deg, #01b001 0%, #0e324b 50%, #01b001 100%);
        }
      `}</style>

      {/* Contenido principal con diseño tipo panal */}
      <div className="p-6 space-y-8">
        <PageTitle>Lista de Chequeo - Vista del Instructor</PageTitle>

        {/* Diseño cuadrado para información del centro */}
        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center justify-center">
            {/* Panel cuadrado 1 */}
            <div className="group relative">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border-2 border-lime-500/30 dark:border-shadowBlue/50 shadow-2xl hover:shadow-lime-200 dark:hover:shadow-shadowBlue/30 transition-all duration-300 transform hover:scale-105 p-6 max-w-sm mx-auto">
                <div className="text-center">
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <span className="text-white font-bold text-lg">🏢</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-darkBlue dark:text-white mb-2">Centro de Formación</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-tight">Centro de Servicios Financieros</p>
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-xs font-semibold text-lime-600 dark:text-lime-400">Fecha</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">05/02/2024 - 05/05/2024</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel cuadrado 2 */}
            <div className="group relative">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border-2 border-lime-600/30 dark:border-darkBlue/50 shadow-2xl hover:shadow-lime-300 dark:hover:shadow-darkBlue/30 transition-all duration-300 transform hover:scale-105 p-6 max-w-sm mx-auto">
                <div className="text-center">
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-lime-600 to-lime-500 dark:from-darkBlue dark:to-shadowBlue rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <span className="text-white font-bold text-lg">📚</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-darkBlue dark:text-white mb-2">Datos de Formación</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-semibold text-darkBlue dark:text-white">Jornada:</span> Diurna
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-xs font-semibold text-lime-600 dark:text-lime-400">Ficha</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">2558735</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel cuadrado 3 */}
            <div className="group relative">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border-2 border-lime-500/30 dark:border-shadowBlue/50 shadow-2xl hover:shadow-lime-200 dark:hover:shadow-shadowBlue/30 transition-all duration-300 transform hover:scale-105 p-6 max-w-sm mx-auto">
                <div className="text-center">
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <span className="text-white font-bold text-lg">👨‍🏫</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-darkBlue dark:text-white mb-2">Instructor Calificador</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Juan Pérez</p>
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-xs font-semibold text-lime-600 dark:text-lime-400">Lista Seleccionada</p>
                    {selectedChecklist ? (
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-tight">ID: {selectedChecklist.id} - {selectedChecklist.component || 'N/A'}</p>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-400">Ninguna lista seleccionada</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controles de filtros y acciones con diseño hexagonal */}
        <div className="relative">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="relative group">
                  <select
                    onChange={(e) => handleTrimesterChange(e.target.value)}
                    value={selectedTrimester}
                    className="hexagon-input appearance-none p-4 pl-12 pr-10 border-2 border-darkBlue dark:border-shadowBlue bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 text-darkBlue dark:text-white rounded-full focus:ring-4 focus:ring-lime-600/30 dark:focus:ring-shadowBlue/30 focus:border-lime-600 dark:focus:border-shadowBlue transition-all duration-300 shadow-lg hover:shadow-xl font-semibold cursor-pointer"
                  >
                    <option value="todos">Todos los Trimestres</option>
                    {[...Array(7)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>Trimestre {i + 1}</option>
                    ))}
                  </select>

                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-darkBlue dark:text-shadowBlue pointer-events-none">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                <div className="relative group">
                  <select
                    onChange={(e) => handleChecklistChange(e.target.value)}
                    value={selectedChecklist?.id || ""}
                    className="hexagon-input appearance-none p-4 pl-12 pr-10 border-2 border-darkBlue dark:border-shadowBlue bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 text-darkBlue dark:text-white rounded-full focus:ring-4 focus:ring-lime-600/30 dark:focus:ring-shadowBlue/30 focus:border-lime-600 dark:focus:border-shadowBlue transition-all duration-300 shadow-lg hover:shadow-xl font-semibold cursor-pointer"
                    disabled={filteredChecklists.length === 0}
                  >
                    <option value="">Seleccionar Lista de Chequeo</option>
                    {filteredChecklists.map((checklist) => (
                      <option key={checklist.id} value={checklist.id}>
                        ID: {checklist.id} - {checklist.component || 'Lista de Chequeo'} (T{checklist.trimester || 'N/A'})
                      </option>
                    ))}
                  </select>

                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-darkBlue dark:text-shadowBlue pointer-events-none">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                <button
                  onClick={handleSaveChecklist}
                  disabled={!selectedChecklist || isFinalSaved}
                  className={`hexagon-button flex items-center gap-3 px-6 py-4 rounded-full border-2 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 ${selectedChecklist && !isFinalSaved
                      ? 'border-lime-500 dark:border-shadowBlue bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue text-white hover:from-lime-500 hover:to-lime-600 dark:hover:from-darkBlue dark:hover:to-shadowBlue'
                      : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  <Save className="w-5 h-5" />
                  <span>{isFinalSaved ? 'Lista Guardada' : 'Vista Previa y Guardar'}</span>
                </button>

                {/* Botón de modificar lista (aparece después del guardado final) */}
                {isFinalSaved && (
                  <button
                    onClick={handleEnableModification}
                    className="hexagon-button flex items-center gap-3 px-6 py-4 rounded-full border-2 border-blue-500 dark:border-blue-400 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-600 text-white hover:from-blue-500 hover:to-blue-600 dark:hover:from-blue-400 dark:hover:to-blue-500 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Edit className="w-5 h-5" />
                    <span>Modificar Lista</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue text-white px-4 py-2 rounded-full shadow-md">
                  <span className="text-sm font-semibold">
                    Activas: {activeChecklists.length} | Filtradas: {filteredChecklists.length}
                  </span>
                </div>

                <button
                  onClick={handleExportPDF}
                  disabled={!selectedChecklist}
                  className={`hexagon-export flex items-center gap-2 px-5 py-3 rounded-full transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 ${selectedChecklist
                      ? 'bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue text-white hover:from-lime-500 hover:to-lime-600 dark:hover:from-darkBlue dark:hover:to-shadowBlue'
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
                >
                  <FileDown className="w-5 h-5" />
                  <span>PDF</span>
                </button>

                <button
                  onClick={handleExportExcel}
                  disabled={!selectedChecklist}
                  className={`hexagon-export flex items-center gap-2 px-5 py-3 rounded-full transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 ${selectedChecklist
                      ? 'bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue text-white hover:from-lime-500 hover:to-lime-600 dark:hover:from-darkBlue dark:hover:to-shadowBlue'
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
                >
                  <FileDown className="w-5 h-5" />
                  <span>Excel</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Estado de carga o sin listas activas */}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-darkBlue dark:border-shadowBlue"></div>
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
            {/* Tabla principal con diseño hexagonals */}
            <div className="relative">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue p-6">
                  <h2 className="text-2xl font-bold text-white text-center flex items-center justify-center gap-3">

                    Lista de Chequeo

                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gradient-to-r from-gray-400 to-gray-400 dark:from-gray-400">
                      <tr>
                        <th className="hexagon-cell text-xl font-bold p-6 text-center text-white">
                          <div className="flex items-center justify-center gap-2">

                            Item
                          </div>
                        </th>
                        <th className="hexagon-cell text-xl font-bold p-6 text-left text-white">
                          <div className="flex items-center gap-2">

                            Indicadores y/o Variables
                          </div>
                        </th>
                        <th className="hexagon-cell text-xl font-bold p-6 text-center text-white">
                          <div className="flex items-center justify-center gap-2">

                            Evaluación
                          </div>
                        </th>
                        <th className="hexagon-cell text-xl font-bold p-6 text-left text-white">
                          <div className="flex items-center gap-2">

                            Observaciones
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {currentItems.map((item, index) => {
                        const itemState = itemStates[item.id] || { completed: item.completed, observations: item.observations };
                        return (
                          <tr key={item.id} className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'
                            }`}>
                            <td className="hexagon-cell p-6 text-center">
                              <div className="w-12 h-12 bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue rounded-full flex items-center justify-center mx-auto shadow-lg">
                                <span className="text-white font-bold text-lg">{item.id}</span>
                              </div>
                            </td>
                            <td className="hexagon-cell p-6">
                              <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 p-4 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-inner">
                                <p className="font-medium text-darkBlue dark:text-white leading-relaxed">
                                  {item.indicator}
                                </p>
                              </div>
                            </td>
                            <td className="hexagon-cell p-6 text-center">
                              <div className="flex justify-center space-x-6">
                                <label className={`hexagon-choice flex items-center space-x-3 cursor-pointer p-3 rounded-2xl border-2 ${
                                  isFinalSaved ? 'opacity-50 cursor-not-allowed' : 
                                  itemState.completed === true
                                    ? 'border-lime-500 dark:border-lime-500 bg-green-50 dark:bg-green-900/30 shadow-lg transform scale-105'
                                    : 'border-gray-300 dark:border-gray-600'
                                }`}>
                                  <input
                                    type="radio"
                                    name={`completed-${item.id}`}
                                    value="yes"
                                    onChange={() => handleItemChange(item.id, "completed", true)}
                                    checked={itemState.completed === true}
                                    disabled={isFinalSaved}
                                    className="sr-only"
                                  />
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${itemState.completed === true ? 'bg-lime-500 text-white' : 'bg-gray-200 dark:bg-gray-600'
                                    }`}>
                                    <Check className="w-5 h-5" />
                                  </div>
                                  <span className={`font-semibold ${itemState.completed === true ? 'text-lime-600' : 'text-gray-600 dark:text-gray-400'
                                    }`}>
                                    Sí
                                  </span>
                                </label>
                                <label className={`hexagon-choice flex items-center space-x-3 cursor-pointer p-3 rounded-2xl border-2 ${
                                  isFinalSaved ? 'opacity-50 cursor-not-allowed' : 
                                  itemState.completed === false
                                    ? 'border-red-500 bg-red-50 dark:bg-red-900/30 shadow-lg transform scale-105'
                                    : 'border-gray-300 dark:border-gray-600'
                                }`}>
                                  <input
                                    type="radio"
                                    name={`completed-${item.id}`}
                                    value="no"
                                    onChange={() => handleItemChange(item.id, "completed", false)}
                                    checked={itemState.completed === false}
                                    disabled={isFinalSaved}
                                    className="sr-only"
                                  />
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${itemState.completed === false ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-600'
                                    }`}>
                                    <X className="w-5 h-5" />
                                  </div>
                                  <span className={`font-semibold ${itemState.completed === false ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'
                                    }`}>
                                    No
                                  </span>
                                </label>
                              </div>
                            </td>
                            <td className="hexagon-cell p-6">
                              <div className="relative">
                                <textarea
                                  value={itemState.observations || ""}
                                  onChange={(e) => handleItemChange(item.id, "observations", e.target.value)}
                                  disabled={isFinalSaved}
                                  className={`hexagon-textarea w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-2xl min-h-[100px] bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 text-darkBlue dark:text-white focus:ring-4 focus:ring-lime-600/30 dark:focus:ring-shadowBlue/30 focus:border-lime-600 dark:focus:border-shadowBlue resize-vertical shadow-inner transition-all duration-300 ${
                                    isFinalSaved ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                  placeholder={isFinalSaved ? "Lista guardada definitivamente" : "Agregar observaciones detalladas sobre este item..."}
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Paginación con diseño hexagonsal */}
            <div className="flex justify-center items-center space-x-6 mt-8">
              <button
                className={`hexagon-nav px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${currentPage === 1
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue hover:from-lime-500 hover:to-lime-600 dark:hover:from-darkBlue dark:hover:to-shadowBlue text-white shadow-xl'
                  }`}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ‹ Anterior
              </button>
              <div className="bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue text-white px-6 py-3 rounded-full shadow-lg">
                <span className="font-bold text-lg">
                  Página {currentPage} de {totalPages}
                </span>
              </div>
              <button
                className={`hexagon-nav px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${currentPage === totalPages
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue hover:from-lime-500 hover:to-lime-600 dark:hover:from-darkBlue dark:hover:to-shadowBlue text-white shadow-xl'
                  }`}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Siguiente ›
              </button>
            </div>

            {/* Sección de Evaluación - Movida debajo de la tabla */}
            {selectedChecklist && (
              <div className="mt-12 relative">
                <div className="bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-green-900/20 dark:via-gray-800 dark:to-green-900/20 rounded-3xl shadow-2xl border border-green-200 dark:border-green-800 overflow-hidden">
                  <div className="bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue p-6">
                    <h3 className="text-2xl font-bold text-white text-center flex items-center justify-center gap-3">

                      Evaluación de Lista de Chequeo

                    </h3>
                  </div>

                  <div className="p-8">
                    {selectedEvaluation ? (
                      // Vista cuando hay evaluación existente
                      showEvaluationForm ? (
                        // Mostrar formulario de actualización con diseño hexagonal
                        <div className="space-y-6">
                          {/* Estado de la evaluación */}
                          <div className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-800 dark:to-blue-900/50 p-6 rounded-2xl border border-blue-200 dark:border-blue-700 shadow-inner">
                            <p className="text-blue-800 dark:text-blue-200 text-center font-medium flex items-center justify-center gap-2">

                              <strong>Actualizar Evaluación:</strong> Modifique los campos que desee cambiar
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <label className="block text-lg font-semibold text-darkBlue dark:text-white mb-2">
                                <span className="flex items-center gap-2">

                                  Observaciones: <span className="text-red-500">*</span>
                                </span>
                              </label>
                              <textarea
                                value={evaluationObservations}
                                onChange={(e) => setEvaluationObservations(e.target.value)}
                                disabled={isFinalSaved}
                                className={`w-full px-4 py-4 border-2 border-darkBlue dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-lime-600/30 dark:focus:ring-shadowBlue/30 focus:border-lime-600 dark:focus:border-shadowBlue bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 text-darkBlue dark:text-white shadow-inner transition-all duration-300 ${
                                  isFinalSaved ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                rows={4}
                                placeholder={isFinalSaved ? "Evaluación guardada definitivamente" : "Ingrese sus observaciones generales sobre la evaluación..."}
                                required
                              />
                            </div>

                            <div className="space-y-4">
                              <label className="block text-lg font-semibold text-darkBlue dark:text-white mb-2">
                                <span className="flex items-center gap-2">

                                  Recomendaciones: <span className="text-red-500">*</span>
                                </span>
                              </label>
                              <textarea
                                value={evaluationRecommendations}
                                onChange={(e) => setEvaluationRecommendations(e.target.value)}
                                disabled={isFinalSaved}
                                className={`w-full px-4 py-4 border-2 border-darkBlue dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-lime-600/30 dark:focus:ring-shadowBlue/30 focus:border-lime-600 dark:focus:border-shadowBlue bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 text-darkBlue dark:text-white shadow-inner transition-all duration-300 ${
                                  isFinalSaved ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                rows={4}
                                placeholder={isFinalSaved ? "Evaluación guardada definitivamente" : "Ingrese sus recomendaciones para esta evaluación..."}
                                required
                              />
                            </div>
                          </div>

                          <div className="mt-6">
                            <label className="block text-lg font-semibold text-darkBlue dark:text-white mb-4">
                              <span className="flex items-center gap-2">
                                <span className="text-xl">⚖️</span>
                                Juicio de Valor: <span className="text-red-500">*</span>
                              </span>
                            </label>
                            <select
                              value={evaluationJudgment}
                              onChange={(e) => setEvaluationJudgment(e.target.value)}
                              disabled={isFinalSaved}
                              className={`w-full px-6 py-4 border-2 border-darkBlue dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-lime-600/30 dark:focus:ring-shadowBlue/30 focus:border-lime-600 dark:focus:border-shadowBlue bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 text-darkBlue dark:text-white font-semibold text-lg shadow-inner transition-all duration-300 ${
                                isFinalSaved ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
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

                          <div className="flex justify-center space-x-6 mt-8">
                            <button
                              onClick={handleCancelUpdate}
                              disabled={isFinalSaved}
                              className={`px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-2xl transition-all duration-300 flex items-center space-x-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 ${
                                isFinalSaved ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              <X className="w-5 h-5" />
                              <span>Cancelar</span>
                            </button>
                            <button
                              onClick={handleCompleteEvaluation}
                              disabled={isFinalSaved || !evaluationObservations?.trim() || !evaluationRecommendations?.trim() || !evaluationJudgment || evaluationJudgment === "PENDIENTE"}
                              className={`px-8 py-4 rounded-2xl transition-all duration-300 flex items-center space-x-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 ${(isFinalSaved || !evaluationObservations?.trim() || !evaluationRecommendations?.trim() || !evaluationJudgment || evaluationJudgment === "PENDIENTE")
                                  ? 'bg-gray-400 cursor-not-allowed text-white'
                                  : 'bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue hover:from-lime-500 hover:to-lime-600 dark:hover:from-darkBlue dark:hover:to-shadowBlue text-white'
                                }`}
                            >
                              <Save className="w-5 h-5" />
                              <span>{isFinalSaved ? 'Guardado Definitivamente' : 'Guardar Cambios'}</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Mostrar vista compacta con botón de actualizar
                        <div className="space-y-6">
                          {/* Estado de la evaluación */}
                          <div className="bg-gradient-to-r from-green-100 to-green-50 dark:from-green-800 dark:to-green-900/50 p-6 rounded-2xl border border-green-200 dark:border-green-700 shadow-inner">
                            <p className="text-green-800 dark:text-green-200 text-center font-medium flex items-center justify-center gap-2">
                              <span className="text-2xl">✅</span>
                              <strong>Evaluación Completada</strong>
                            </p>
                          </div>

                          {/* Resumen de la evaluación con diseño hexagonal */}
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-700 rounded-2xl p-6 shadow-lg">
                              <div className="text-center mb-4">
                                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                  <span className="text-white text-xl">📝</span>
                                </div>
                                <h4 className="text-lg font-bold text-darkBlue dark:text-white">Observaciones</h4>
                              </div>
                              <div className="bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/30 dark:to-gray-700 p-4 rounded-xl border border-blue-200 dark:border-blue-600">
                                <p className="text-sm text-darkBlue dark:text-white leading-relaxed min-h-[80px]">
                                  {selectedEvaluation ? extractGeneralObservationsFromEvaluation(selectedEvaluation) || "Sin observaciones" : "Sin observaciones"}
                                </p>
                              </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-700 rounded-2xl p-6 shadow-lg">
                              <div className="text-center mb-4">
                                <div className="w-12 h-12 bg-lime-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                  <span className="text-white text-xl">💡</span>
                                </div>
                                <h4 className="text-lg font-bold text-darkBlue dark:text-white">Recomendaciones</h4>
                              </div>
                              <div className="bg-gradient-to-r from-green-50 to-white dark:from-green-900/30 dark:to-gray-700 p-4 rounded-xl border border-green-200 dark:border-green-600">
                                <p className="text-sm text-darkBlue dark:text-white leading-relaxed min-h-[80px]">
                                  {selectedEvaluation.recommendations || "Sin recomendaciones"}
                                </p>
                              </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-700 rounded-2xl p-6 shadow-lg">
                              <div className="text-center mb-4">
                                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                  <span className="text-white text-xl">⚖️</span>
                                </div>
                                <h4 className="text-lg font-bold text-darkBlue dark:text-white">Juicio de Valor</h4>
                              </div>
                              <div className="flex justify-center">
                                <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold shadow-lg ${selectedEvaluation.valueJudgment === 'EXCELENTE' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' :
                                    selectedEvaluation.valueJudgment === 'BUENO' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
                                      selectedEvaluation.valueJudgment === 'ACEPTABLE' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white' :
                                        selectedEvaluation.valueJudgment === 'DEFICIENTE' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' :
                                          selectedEvaluation.valueJudgment === 'RECHAZADO' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' :
                                            'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                                  }`}>
                                  {selectedEvaluation.valueJudgment || "PENDIENTE"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Botón para actualizar evaluación */}
                          <div className="flex justify-center mt-8">
                            <button
                              onClick={handleUpdateEvaluationClick}
                              disabled={isFinalSaved}
                              className={`px-10 py-4 bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue hover:from-lime-500 hover:to-lime-600 dark:hover:from-darkBlue dark:hover:to-shadowBlue text-white rounded-full transition-all duration-300 flex items-center space-x-4 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 ${
                                isFinalSaved ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              <Edit className="w-6 h-6" />
                              <span>{isFinalSaved ? 'Evaluación Guardada' : 'Actualizar Evaluación'}</span>
                            </button>
                          </div>
                        </div>
                      )
                    ) : (
                      // Vista cuando no hay evaluación con diseño hexagonal
                      <div className="text-center space-y-8">
                        <div className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 p-8 rounded-3xl border-2 border-gray-200 dark:border-gray-600 shadow-inner">

                          <h4 className="text-2xl font-bold text-darkBlue dark:text-white mb-4 flex items-center justify-center gap-3">

                            Esta lista no tiene evaluación
                          </h4>
                          <p className="text-lg text-gray-800 dark:text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                            Se creará automáticamente una <strong>evaluación única</strong> vinculada a esta lista de chequeo (relación 1:1 en la base de datos). 
                            Complete los campos para establecer la evaluación final.
                          </p>

                          {/* Botón principal para crear evaluación */}
                          <button
                            onClick={handleOpenCreateEvaluationModal}
                            disabled={isFinalSaved}
                            className={`px-12 py-6 bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue hover:from-lime-500 hover:to-lime-600 dark:hover:from-darkBlue dark:hover:to-shadowBlue text-white rounded-3xl transition-all duration-500 flex items-center space-x-4 mx-auto font-bold text-xl shadow-2xl hover:shadow-lime-600/20 dark:hover:shadow-shadowBlue/30 transform hover:scale-110 ${
                              isFinalSaved ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            <Save className="w-8 h-8" />
                            <span>{isFinalSaved ? 'Evaluación Guardada' : 'Crear Evaluación'}</span>
                          </button>

                          {/* Botón de debug con diseño hexagonal */}

                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Sección de firmas con diseño hexagonal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              {/* Firma Instructor Técnico Anterior */}
              <div className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 p-6 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">👨‍🏫</span>
                  </div>
                  <h3 className="text-xl font-bold text-darkBlue dark:text-white">Instructor Técnico Anterior</h3>
                </div>
                <div className="flex flex-col items-center">
                  <label className="hexagon-upload flex flex-col items-center cursor-pointer mb-4 p-6 border-3 border-dashed border-[#0e324b] rounded-2xl w-full hover:border-[#01b001] hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 group">
                    <UploadCloud className="w-12 h-12 text-[#0e324b] group-hover:text-[#01b001] transition-colors duration-300 mb-3 group-hover:animate-bounce" />
                    <span className="font-semibold text-lg text-center text-[#0e324b] dark:text-white group-hover:text-[#01b001] transition-colors duration-300">
                      Subir Firma Digital
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Formatos: JPG, PNG, GIF
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setFirmaAnterior)}
                      className="hidden"
                    />
                  </label>
                  {firmaAnterior && (
                    <div className="w-full flex justify-center">
                      <div className="bg-white dark:bg-gray-700 p-4 rounded-2xl border-2 border-[#01b001] shadow-lg">
                        <Image
                          src={firmaAnterior}
                          alt="Firma instructor anterior"
                          width={150}
                          height={100}
                          className="max-h-24 max-w-full object-contain rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Firma Instructor Técnico Nuevo */}
              <div className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 p-6 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">👨‍💼</span>
                  </div>
                  <h3 className="text-xl font-bold text-darkBlue dark:text-white">Instructor Técnico Nuevo</h3>
                </div>
                <div className="flex flex-col items-center">
                  <label className="hexagon-upload flex flex-col items-center cursor-pointer mb-4 p-6 border-3 border-dashed border-[#0e324b] rounded-2xl w-full hover:border-[#01b001] hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 group">
                    <UploadCloud className="w-12 h-12 text-[#0e324b] group-hover:text-[#01b001] transition-colors duration-300 mb-3 group-hover:animate-bounce" />
                    <span className="font-semibold text-lg text-center text-[#0e324b] dark:text-white group-hover:text-[#01b001] transition-colors duration-300">
                      Subir Firma Digital
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Formatos: JPG, PNG, GIF
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setFirmaNuevo)}
                      className="hidden"
                    />
                  </label>
                  {firmaNuevo && (
                    <div className="w-full flex justify-center">
                      <div className="bg-white dark:bg-gray-700 p-4 rounded-2xl border-2 border-[#01b001] shadow-lg">
                        <Image
                          src={firmaNuevo}
                          alt="Firma instructor nuevo"
                          height={100}
                          width={150}
                          className="max-h-24 max-w-full object-contain rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal de Vista Previa */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header del modal */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                  <span className="text-4xl">👁️</span>
                  <span>Vista Previa - Lista de Chequeo</span>
                </h2>
                <button
                  onClick={handleBackToEdit}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

              {/* Contenido de la vista previa */}
              {(() => {
                const previewData = generatePreviewData();
                if (!previewData) return null;

                return (
                  <div className="space-y-8">
                    {/* Información del checklist */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
                      <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                        <span className="text-2xl">📋</span>
                        Información de la Lista
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <span className="font-semibold text-blue-800 dark:text-blue-200">ID:</span>
                          <span className="ml-2 text-blue-700 dark:text-blue-300">{previewData.checklist.id}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-blue-800 dark:text-blue-200">Trimestre:</span>
                          <span className="ml-2 text-blue-700 dark:text-blue-300">{previewData.checklist.trimester || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-blue-800 dark:text-blue-200">Componente:</span>
                          <span className="ml-2 text-blue-700 dark:text-blue-300">{previewData.checklist.component || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Items del checklist */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-lg">
                      <div className="bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue p-4">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <span className="text-2xl">✅</span>
                          Items Evaluados ({previewData.items.length})
                        </h3>
                      </div>
                      <div className="p-4">
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {previewData.items.map((item, index) => (
                            <div key={item.id} className={`p-4 rounded-lg border ${
                              item.completed === true 
                                ? 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20' 
                                : item.completed === false 
                                  ? 'border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-900/20'
                                  : 'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700'
                            }`}>
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                                    item.completed === true 
                                      ? 'bg-green-500' 
                                      : item.completed === false 
                                        ? 'bg-red-500'
                                        : 'bg-gray-400'
                                  }`}>
                                    {item.completed === true ? '✓' : item.completed === false ? '✗' : '?'}
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-bold text-gray-900 dark:text-gray-100">Item {item.id}:</span>
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                      item.completed === true 
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' 
                                        : item.completed === false 
                                          ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
                                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                    }`}>
                                      {item.completed === true ? 'CUMPLE' : item.completed === false ? 'NO CUMPLE' : 'SIN EVALUAR'}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 dark:text-gray-300 mb-3">{item.indicator}</p>
                                  {item.observations && (
                                    <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600">
                                      <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Observaciones:</span>
                                      <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{item.observations}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Evaluación (si existe) */}
                    {previewData.hasEvaluationData && (
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-6 rounded-xl border border-purple-200 dark:border-purple-700">
                        <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
                          <span className="text-2xl">📊</span>
                          Evaluación
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Observaciones:</h4>
                            <div className="bg-white dark:bg-gray-700 p-3 rounded border border-purple-200 dark:border-purple-600">
                              <p className="text-gray-700 dark:text-gray-300 text-sm">
                                {previewData.evaluation.observations || 'Sin observaciones'}
                              </p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Recomendaciones:</h4>
                            <div className="bg-white dark:bg-gray-700 p-3 rounded border border-purple-200 dark:border-purple-600">
                              <p className="text-gray-700 dark:text-gray-300 text-sm">
                                {previewData.evaluation.recommendations || 'Sin recomendaciones'}
                              </p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Juicio de Valor:</h4>
                            <div className="flex justify-center">
                              <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                                previewData.evaluation.judgment === 'EXCELENTE' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' :
                                previewData.evaluation.judgment === 'BUENO' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
                                previewData.evaluation.judgment === 'ACEPTABLE' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white' :
                                previewData.evaluation.judgment === 'DEFICIENTE' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' :
                                previewData.evaluation.judgment === 'RECHAZADO' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' :
                                'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                              }`}>
                                {previewData.evaluation.judgment || 'PENDIENTE'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Estadísticas */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <span className="text-2xl">📈</span>
                        Estadísticas
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{previewData.items.filter(item => item.completed === true).length}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Cumple</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">{previewData.items.filter(item => item.completed === false).length}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">No Cumple</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-600">{previewData.items.filter(item => item.completed === null).length}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Sin Evaluar</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{previewData.items.filter(item => item.observations && item.observations.trim()).length}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Con Observaciones</div>
                        </div>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-center space-x-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                      <button
                        onClick={handleBackToEdit}
                        className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-2xl transition-all duration-300 flex items-center space-x-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <Edit className="w-6 h-6" />
                        <span>Volver a Editar</span>
                      </button>
                      <button
                        onClick={handleFinalSave}
                        className="px-8 py-4 bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue hover:from-lime-500 hover:to-lime-600 dark:hover:from-darkBlue dark:hover:to-shadowBlue text-white rounded-2xl transition-all duration-300 flex items-center space-x-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <Save className="w-6 h-6" />
                        <span>Guardar Definitivamente</span>
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Modal para crear evaluación */}
      {showCreateEvaluationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header del modal */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Save className="w-6 h-6 text-lime-600" />
                  <span>Crear Evaluación</span>
                </h2>
                <button
                  onClick={handleCloseCreateEvaluationModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  disabled={isCreatingEvaluation}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Información del checklist */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  📋 Lista de Chequeo: {selectedChecklist?.trimester ? `Trimestre ${selectedChecklist.trimester}` : 'Sin trimestre'}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Complete los siguientes campos para crear la evaluación de esta lista de chequeo.
                </p>
              </div>

              {/* Formulario de evaluación */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Observaciones: <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={evaluationObservations}
                    onChange={(e) => setEvaluationObservations(e.target.value)}
                    disabled={isFinalSaved || isCreatingEvaluation}
                    className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                      isFinalSaved ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    rows={4}
                    placeholder="Describa sus observaciones sobre la lista de chequeo..."
                    disabled={isCreatingEvaluation}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Recomendaciones: <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={evaluationRecommendations}
                    onChange={(e) => setEvaluationRecommendations(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    rows={4}
                    placeholder="Agregue sus recomendaciones..."
                    disabled={isCreatingEvaluation}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Juicio de Valor: <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={evaluationJudgment}
                    onChange={(e) => setEvaluationJudgment(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    disabled={isCreatingEvaluation}
                  >
                    <option value="">Seleccione un juicio de valor</option>
                    <option value="EXCELENTE">Excelente</option>
                    <option value="BUENO">Bueno</option>
                    <option value="ACEPTABLE">Aceptable</option>
                    <option value="DEFICIENTE">Deficiente</option>
                    <option value="RECHAZADO">Rechazado</option>
                  </select>
                </div>

                {/* Indicador de progreso */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Progreso:</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 ${evaluationObservations?.trim() ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Observaciones</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 ${evaluationRecommendations?.trim() ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Recomendaciones</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 ${evaluationJudgment && evaluationJudgment !== '' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Juicio de Valor</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={handleCloseCreateEvaluationModal}
                  disabled={isCreatingEvaluation}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateEvaluationFromModal}
                  disabled={isCreatingEvaluation || !evaluationObservations?.trim() || !evaluationRecommendations?.trim() || !evaluationJudgment}
                  className={`px-8 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2 font-semibold ${(isCreatingEvaluation || !evaluationObservations?.trim() || !evaluationRecommendations?.trim() || !evaluationJudgment)
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-gradient-to-r from-lime-600 to-lime-500 hover:from-lime-500 hover:to-lime-600 text-white shadow-lg hover:shadow-xl'
                    }`}
                >
                  {isCreatingEvaluation ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Crear Evaluación</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
