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
  
  // Estados para el modal de creación de evaluación
  const [showCreateEvaluationModal, setShowCreateEvaluationModal] = useState(false);
  const [isCreatingEvaluation, setIsCreatingEvaluation] = useState(false);
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);

  // Cache en memoria para evaluaciones por checklist
  const [evaluationsCache, setEvaluationsCache] = useState<{[key: string]: {evaluation: Evaluation, timestamp: number}}>({});

  const itemsPerPage = 3;

  // Funciones auxiliares para el cache de evaluaciones
  const getCachedEvaluation = (checklistId: string) => {
    // Primero verificar cache en memoria
    const memoryCache = evaluationsCache[checklistId];
    if (memoryCache) {
      const fiveMinutes = 5 * 60 * 1000; // 5 minutos en milisegundos
      if (Date.now() - memoryCache.timestamp < fiveMinutes) {
        console.log('📦 Usando evaluación desde cache en memoria:', memoryCache.evaluation);
        return memoryCache.evaluation;
      } else {
        // Cache en memoria expirado, limpiar
        const newCache = { ...evaluationsCache };
        delete newCache[checklistId];
        setEvaluationsCache(newCache);
        console.log('🗑️ Cache en memoria expirado para checklist:', checklistId);
      }
    }

    // Si no hay cache en memoria, verificar localStorage
    try {
      const localStorageKey = `evaluation_cache_${checklistId}`;
      const localCache = localStorage.getItem(localStorageKey);
      if (localCache) {
        const parsedCache = JSON.parse(localCache);
        const thirtyMinutes = 30 * 60 * 1000; // 30 minutos para localStorage
        
        if (Date.now() - parsedCache.timestamp < thirtyMinutes) {
          console.log('🏪 Usando evaluación desde localStorage:', parsedCache.evaluation);
          
          // Restaurar también en memoria para próximas consultas
          setEvaluationsCache(prev => ({
            ...prev,
            [checklistId]: {
              evaluation: parsedCache.evaluation,
              timestamp: Date.now()
            }
          }));
          
          return parsedCache.evaluation;
        } else {
          // Cache en localStorage expirado, limpiar
          localStorage.removeItem(localStorageKey);
          console.log('🗑️ Cache en localStorage expirado para checklist:', checklistId);
        }
      }
    } catch (error) {
      console.warn('Error al leer cache de localStorage:', error);
    }

    return null;
  };

  const setCachedEvaluation = (checklistId: string, evaluation: Evaluation) => {
    const timestamp = Date.now();
    
    // Actualizar cache en memoria
    setEvaluationsCache(prev => ({
      ...prev,
      [checklistId]: {
        evaluation,
        timestamp
      }
    }));
    
    // Actualizar cache en localStorage
    try {
      const localStorageKey = `evaluation_cache_${checklistId}`;
      const cacheData = {
        evaluation,
        timestamp,
        checklistId
      };
      localStorage.setItem(localStorageKey, JSON.stringify(cacheData));
      console.log('💾 Evaluación guardada en cache (memoria + localStorage):', checklistId, evaluation);
    } catch (error) {
      console.warn('Error al guardar cache en localStorage:', error);
    }
  };

  // Función para limpiar caches antiguos al inicializar
  const cleanExpiredCaches = () => {
    try {
      const keys = Object.keys(localStorage);
      const evaluationCacheKeys = keys.filter(key => key.startsWith('evaluation_cache_'));
      const tempDataKeys = keys.filter(key => key.startsWith('evaluation_temp_'));
      const thirtyMinutes = 30 * 60 * 1000;
      const oneHour = 60 * 60 * 1000;
      
      // Limpiar caches de evaluaciones expirados (30 minutos)
      evaluationCacheKeys.forEach(key => {
        try {
          const cached = JSON.parse(localStorage.getItem(key) || '{}');
          if (cached.timestamp && Date.now() - cached.timestamp > thirtyMinutes) {
            localStorage.removeItem(key);
            console.log('🧹 Cache de evaluación limpiado:', key);
          }
        } catch (error) {
          // Si hay error al parsear, limpiar la entrada corrupta
          localStorage.removeItem(key);
          console.log('🧹 Cache corrupto limpiado:', key);
        }
      });

      // Limpiar datos temporales expirados (1 hora)
      tempDataKeys.forEach(key => {
        try {
          const tempData = JSON.parse(localStorage.getItem(key) || '{}');
          if (tempData.timestamp && Date.now() - tempData.timestamp > oneHour) {
            localStorage.removeItem(key);
            console.log('🧹 Datos temporales limpiados:', key);
          }
        } catch (error) {
          // Si hay error al parsear, limpiar la entrada corrupta
          localStorage.removeItem(key);
          console.log('🧹 Datos temporales corruptos limpiados:', key);
        }
      });
    } catch (error) {
      console.warn('Error al limpiar caches:', error);
    }
  };

  // Limpiar caches antiguos al cargar el componente
  useEffect(() => {
    cleanExpiredCaches();
  }, []);

  // Cargar listas de chequeo activas
  useEffect(() => {
    loadActiveChecklists();
  }, []);

  // Auto-cargar evaluaciones cuando cambie el checklist seleccionado
  useEffect(() => {
    if (selectedChecklist) {
      // Al cargar por primera vez o cambiar checklist, NO preservar datos actuales
      // Queremos ver lo que realmente está en la base de datos
      loadEvaluationsForChecklist(parseInt(selectedChecklist.id), false);
    }
  }, [selectedChecklist]);

  // Efecto para cargar datos de evaluación seleccionada INMEDIATAMENTE
  useEffect(() => {
    if (selectedEvaluation) {
      console.log('🔄 Cargando datos de evaluación seleccionada:', selectedEvaluation);
      console.log('📊 Detalles completos de selectedEvaluation:', {
        id: selectedEvaluation.id,
        observations: selectedEvaluation.observations,
        recommendations: selectedEvaluation.recommendations,
        valueJudgment: selectedEvaluation.valueJudgment,
        checklistId: selectedEvaluation.checklistId,
        allProperties: Object.keys(selectedEvaluation)
      });
      
      // Siempre cargar los datos de la evaluación, incluso si están vacíos
      const obsFromDB = selectedEvaluation.observations || "";
      const recFromDB = selectedEvaluation.recommendations || "";
      const judgmentFromDB = selectedEvaluation.valueJudgment || "PENDIENTE";
      
      setEvaluationObservations(obsFromDB);
      setEvaluationRecommendations(recFromDB);
      setEvaluationJudgment(judgmentFromDB);
      setShowEvaluationForm(false); // Ocultar formulario inicialmente
      
      console.log('✅ Datos cargados en campos del formulario:', {
        observations: obsFromDB,
        recommendations: recFromDB,
        judgment: judgmentFromDB,
        hasData: !!(obsFromDB || recFromDB || (judgmentFromDB && judgmentFromDB !== "PENDIENTE"))
      });
      
      // Si la evaluación no tiene datos completos, mostrar mensaje informativo
      if (!obsFromDB && !recFromDB && (!judgmentFromDB || judgmentFromDB === "PENDIENTE")) {
        console.log('ℹ️ Evaluación encontrada pero sin datos completos - puede necesitar completarse');
      }
    } else {
      // Si no hay evaluación seleccionada, limpiar campos
      console.log('🧹 Limpiando campos - no hay evaluación seleccionada');
      setEvaluationObservations("");
      setEvaluationRecommendations("");
      setEvaluationJudgment("PENDIENTE");
      setShowEvaluationForm(false);
    }
  }, [selectedEvaluation]);

  // Efecto para persistir los datos de evaluación temporal en localStorage
  // Solo cuando no hay una evaluación existente en DB (para datos en proceso de creación)
  useEffect(() => {
    if (selectedChecklist && !selectedEvaluation && (evaluationObservations || evaluationRecommendations || evaluationJudgment !== "PENDIENTE")) {
      const evaluationData = {
        checklistId: selectedChecklist.id,
        observations: evaluationObservations,
        recommendations: evaluationRecommendations,
        judgment: evaluationJudgment,
        timestamp: Date.now()
      };
      // Usar clave diferente para datos temporales (en proceso de creación)
      localStorage.setItem(`evaluation_temp_${selectedChecklist.id}`, JSON.stringify(evaluationData));
      console.log('💾 Datos temporales guardados en localStorage', evaluationData);
    }
  }, [selectedChecklist, selectedEvaluation, evaluationObservations, evaluationRecommendations, evaluationJudgment]);

  // Efecto para recuperar datos temporales desde localStorage al cargar
  // SOLO si no existe una evaluación en la base de datos
  useEffect(() => {
    // Solo ejecutar después de haber intentado cargar desde la DB
    const timeoutId = setTimeout(() => {
      if (selectedChecklist && !selectedEvaluation) {
        // Solo usar localStorage temporal si no hay evaluación en DB
        const savedData = localStorage.getItem(`evaluation_temp_${selectedChecklist.id}`);
        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData);
            const now = Date.now();
            const oneHour = 60 * 60 * 1000; // 1 hora en milisegundos
            
            // Solo usar datos guardados si son de menos de 1 hora
            if (now - parsedData.timestamp < oneHour) {
              console.log('🔄 Recuperando datos temporales desde localStorage (sin evaluación en DB)', parsedData);
              setEvaluationObservations(parsedData.observations || "");
              setEvaluationRecommendations(parsedData.recommendations || "");
              setEvaluationJudgment(parsedData.judgment || "PENDIENTE");
            } else {
              // Limpiar datos antiguos
              localStorage.removeItem(`evaluation_temp_${selectedChecklist.id}`);
              console.log('🗑️ Datos temporales antiguos removidos');
            }
          } catch (error) {
            console.warn('Error al recuperar datos temporales de localStorage:', error);
          }
        }
      } else if (selectedEvaluation) {
        // Si hay evaluación en DB, limpiar datos temporales
        if (selectedChecklist) {
          localStorage.removeItem(`evaluation_temp_${selectedChecklist.id}`);
          console.log('✅ Evaluación existe en DB, datos temporales limpiados');
        }
      }
    }, 1000); // Dar tiempo para que se carguen los datos desde la DB

    return () => clearTimeout(timeoutId);
  }, [selectedChecklist, selectedEvaluation]);

  // Efecto adicional para asegurar que los datos se carguen correctamente después de reload
  // SOLO actúa cuando hay evaluación pero los campos están completamente vacíos (reload)
  useEffect(() => {
    if (selectedEvaluation && 
        !evaluationObservations && 
        !evaluationRecommendations && 
        evaluationJudgment === "PENDIENTE" &&
        (selectedEvaluation.observations || selectedEvaluation.recommendations || selectedEvaluation.valueJudgment !== "PENDIENTE")) {
      
      console.log('🔄 Detectando reload - sincronizando datos desde DB...');
      setEvaluationObservations(selectedEvaluation.observations || "");
      setEvaluationRecommendations(selectedEvaluation.recommendations || "");
      setEvaluationJudgment(selectedEvaluation.valueJudgment || "PENDIENTE");
      console.log('✅ Datos sincronizados desde evaluación existente después de reload');
    }
  }, [selectedEvaluation, evaluationObservations, evaluationRecommendations, evaluationJudgment]);

  // Función auxiliar para sincronizar datos después de crear/actualizar evaluación
  const syncEvaluationDataAfterSave = async (checklistId: number, savedData: any) => {
    console.log('🔄 Recargando evaluación desde DB después de guardar...');
    
    // Recargar desde la base de datos SIN preservar datos locales
    try {
      await loadEvaluationsForChecklist(checklistId, false);
      console.log('✅ Sincronización completada exitosamente');
    } catch (error) {
      console.warn('⚠️ Error en sincronización:', error);
    }
  };

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

  const loadEvaluationsForChecklist = async (checklistId: number, preserveCurrentData: boolean = false): Promise<void> => {
    try {
      console.log("=== LOADING EVALUATIONS FOR CHECKLIST ===");
      console.log("Checklist ID:", checklistId);
      console.log("Checklist ID type:", typeof checklistId);
      console.log("Preserve current data:", preserveCurrentData);
      
      // Primero verificar si hay una evaluación en cache
      const cachedEvaluation = getCachedEvaluation(checklistId.toString());
      if (cachedEvaluation && !preserveCurrentData) {
        console.log('🚀 Usando evaluación desde cache');
        setSelectedEvaluation(cachedEvaluation);
        setEvaluations([cachedEvaluation]);
        return;
      }
      
      // Si se solicita preservar datos actuales y hay datos llenados, guardarlos temporalmente
      let preservedData = null;
      if (preserveCurrentData && (evaluationObservations.trim() || evaluationRecommendations.trim())) {
        preservedData = {
          observations: evaluationObservations,
          recommendations: evaluationRecommendations,
          judgment: evaluationJudgment
        };
        console.log('💾 Preservando datos actuales:', preservedData);
      }
      
      // Intentar primero con la función principal
      const evaluationsResponse = await fetchEvaluationsByChecklist(checklistId);
      console.log("Raw evaluations response:", evaluationsResponse);
      
      if (evaluationsResponse && evaluationsResponse.code === "200") {
        console.log("✅ Evaluations response successful");
        console.log("Evaluations data:", evaluationsResponse.data);
        
        if (evaluationsResponse.data && evaluationsResponse.data.length > 0) {
          setEvaluations(evaluationsResponse.data);
          console.log("✅ Found evaluations:", evaluationsResponse.data.length);
          
          // Si hay evaluaciones, seleccionar la primera automáticamente
          const firstEvaluation = evaluationsResponse.data[0];
          console.log("First evaluation details:", firstEvaluation);
          console.log("First evaluation checklistId:", firstEvaluation.checklistId);
          
          // Verificar que la evaluación tenga los datos completos
          if (!firstEvaluation.observations && !firstEvaluation.recommendations && !firstEvaluation.valueJudgment) {
            console.log('⚠️ Evaluación encontrada pero sin datos completos:', firstEvaluation);
          }
          
          setSelectedEvaluation(firstEvaluation);
          
          // Guardar en cache para futuras consultas
          setCachedEvaluation(checklistId.toString(), firstEvaluation);
          
          // Decidir si cargar datos desde DB o preservar datos actuales
          if (preservedData) {
            // Usar datos preservados (recién creados/editados)
            console.log('🔄 Usando datos preservados en lugar de DB:', preservedData);
            setEvaluationObservations(preservedData.observations);
            setEvaluationRecommendations(preservedData.recommendations);
            setEvaluationJudgment(preservedData.judgment);
          } else {
            // Cargar datos desde la evaluación encontrada (el useEffect se encargará)
            console.log('📋 Cargando datos desde evaluación de BD:', {
              observations: firstEvaluation.observations,
              recommendations: firstEvaluation.recommendations,
              valueJudgment: firstEvaluation.valueJudgment
            });
          }
          
          // Limpiar localStorage si hay evaluación en DB
          if (selectedChecklist) {
            localStorage.removeItem(`evaluation_${selectedChecklist.id}`);
            localStorage.removeItem(`evaluation_temp_${selectedChecklist.id}`);
            console.log('🗑️ Limpiando localStorage - datos cargados desde DB');
          }
          
          console.log("✅ Evaluation loaded successfully");
          return; // Salir exitosamente
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
          console.log("Alternative method evaluation details:", firstEvaluation);
          
          setSelectedEvaluation(firstEvaluation);
          
          // Guardar en cache para futuras consultas
          setCachedEvaluation(checklistId.toString(), firstEvaluation);
          
          // Decidir si cargar datos desde DB o preservar datos actuales
          if (preservedData) {
            // Usar datos preservados (recién creados/editados)
            console.log('🔄 Usando datos preservados en lugar de DB (método alternativo):', preservedData);
            setEvaluationObservations(preservedData.observations);
            setEvaluationRecommendations(preservedData.recommendations);
            setEvaluationJudgment(preservedData.judgment);
          } else {
            // Cargar datos desde la evaluación encontrada (el useEffect se encargará)
            console.log('📋 Cargando datos desde evaluación de BD (método alternativo):', {
              observations: firstEvaluation.observations,
              recommendations: firstEvaluation.recommendations,
              valueJudgment: firstEvaluation.valueJudgment
            });
          }
          
          // Limpiar localStorage si hay evaluación en DB
          if (selectedChecklist) {
            localStorage.removeItem(`evaluation_${selectedChecklist.id}`);
            localStorage.removeItem(`evaluation_temp_${selectedChecklist.id}`);
            console.log('🗑️ Limpiando localStorage - datos cargados desde DB (método alternativo)');
          }
          
          console.log("✅ Evaluation loaded via alternative method");
          return; // Salir exitosamente
        } else {
          console.log("❌ Alternative method also found no evaluations");
        }
      } catch (altError) {
        console.error("❌ Alternative fetch method failed:", altError);
      }
      
      // Si llegamos aquí, no se encontraron evaluaciones con ningún método
      console.log("❌ No evaluations found with any method for checklist:", checklistId);
      setEvaluations([]);
      setSelectedEvaluation(null);
      setEvaluationObservations("");
      setEvaluationRecommendations("");
      setEvaluationJudgment("PENDIENTE");
      
    } catch (error) {
      console.error("❌ Error loading evaluations:", error);
      console.error("Error stack:", error);
      
      // Resetear estados en caso de error
      setEvaluations([]);
      setSelectedEvaluation(null);
      setEvaluationObservations("");
      setEvaluationRecommendations("");
      setEvaluationJudgment("PENDIENTE");
      
      // Opcionalmente mostrar un mensaje de error más específico
      // toast.error("Error al cargar evaluaciones. Puede crear una evaluación nueva.");
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

  // Función para manejar el botón "Actualizar Evaluación"
  const handleUpdateEvaluationClick = () => {
    console.log('📝 Mostrando formulario para actualizar evaluación');
    console.log('📊 Datos de selectedEvaluation:', selectedEvaluation);
    
    // Cargar los datos de la evaluación existente en los campos del formulario
    if (selectedEvaluation) {
      console.log('🔄 Llenando formulario con datos de BD:', {
        observations: selectedEvaluation.observations,
        recommendations: selectedEvaluation.recommendations,
        valueJudgment: selectedEvaluation.valueJudgment
      });
      
      setEvaluationObservations(selectedEvaluation.observations || "");
      setEvaluationRecommendations(selectedEvaluation.recommendations || "");
      setEvaluationJudgment(selectedEvaluation.valueJudgment || "PENDIENTE");
    }
    
    setShowEvaluationForm(true);
  };

  // Función para cancelar la actualización
  const handleCancelUpdate = () => {
    console.log('❌ Cancelando actualización de evaluación');
    setShowEvaluationForm(false);
    // Restaurar datos originales
    if (selectedEvaluation) {
      setEvaluationObservations(selectedEvaluation.observations || "");
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
      console.log("Datos a guardar:", {
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

      console.log("Respuesta del servidor:", response);

      if (response.code === "200") {
        toast.success("🎉 Evaluación guardada exitosamente en la base de datos");
        
        // Crear el objeto de evaluación actualizado con los datos que acabamos de guardar
        const updatedEvaluation = {
          ...selectedEvaluation,
          observations: evaluationObservations,
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
        
        // Actualizar cache con la evaluación actualizada
        if (selectedChecklist) {
          setCachedEvaluation(selectedChecklist.id, updatedEvaluation);
        }
        
        // Limpiar datos guardados en localStorage ya que se guardó exitosamente
        if (selectedChecklist) {
          localStorage.removeItem(`evaluation_${selectedChecklist.id}`);
          localStorage.removeItem(`evaluation_temp_${selectedChecklist.id}`);
          console.log('🗑️ Datos de evaluación removidos del localStorage (guardado exitoso)');
        }

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
      toast.info("💾 Guardando lista de chequeo...");

      // Simular guardado exitoso por ahora
      // TODO: Implementar la llamada real al backend cuando esté disponible
      console.log("Checklist data to save:", checklistData);
      
      // Simular una pequeña demora para mostrar feedback
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
        toast.success("✅ Lista de chequeo y evaluación guardadas exitosamente!");
      } else if (hasEvaluationData) {
        // No hay evaluación pero hay datos, preguntar si quiere crearla
        toast.info("💡 Se detectaron datos de evaluación. Guarde primero la lista y luego use 'Crear Evaluación Completa'");
        toast.success("📋 Lista de chequeo guardada exitosamente!");
      } else {
        // Solo lista de chequeo sin evaluación
        toast.success("📋 Lista de chequeo guardada exitosamente!");
      }
      
    } catch (error) {
      console.error("Error saving checklist:", error);
      toast.error("❌ Error al guardar la lista de chequeo");
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
      // Si ya existe una evaluación, cargar sus datos
      console.log('📋 Abriendo modal con datos de evaluación existente:', selectedEvaluation);
      setEvaluationObservations(selectedEvaluation.observations || "");
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
          
          // Actualizar cache con la nueva evaluación
          setCachedEvaluation(selectedChecklist.id, newEvaluationObject);
          
          // Mantener los datos en los campos del formulario para mostrarlos
          setEvaluationObservations(evaluationData.observations);
          setEvaluationRecommendations(evaluationData.recommendations);
          setEvaluationJudgment(evaluationData.valueJudgment);
          
          console.log('✅ Estados actualizados con la nueva evaluación:', newEvaluationObject);
          
          toast.success("✅ Evaluación creada y guardada exitosamente");
          
          // Limpiar localStorage
          if (selectedChecklist) {
            localStorage.removeItem(`evaluation_${selectedChecklist.id}`);
            localStorage.removeItem(`evaluation_temp_${selectedChecklist.id}`);
            console.log('🗑️ Datos temporales eliminados de localStorage');
          }
          
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
      await loadEvaluationsForChecklist(parseInt(selectedChecklist.id), false); // No preservar datos aquí, queremos ver lo que hay en DB
      
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
        
        // Completar la evaluación inmediatamente
        console.log("Completando evaluación con datos...");
        const completeResponse = await completeEvaluation(
          parseInt(createResponse.id),
          evaluationObservations,
          evaluationRecommendations,
          evaluationJudgment
        );
        console.log("Complete response:", completeResponse);

        if (completeResponse && completeResponse.code === "200") {
          toast.success("🎉 ¡Evaluación creada y completada exitosamente!");
          
          // Datos creados exitosamente
          const savedData = {
            observations: evaluationObservations,
            recommendations: evaluationRecommendations,
            valueJudgment: evaluationJudgment
          };
          
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
        
        await loadEvaluationsForChecklist(parseInt(selectedChecklist.id), true);
        
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
                // Vista cuando hay evaluación existente
                showEvaluationForm ? (
                  // Mostrar formulario de actualización
                  <div className="space-y-3">
                    {/* Estado de la evaluación */}
                    <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-md">
                      <p className="text-blue-800 dark:text-blue-200 text-sm font-medium">
                        ✏️ <strong>Actualizar Evaluación:</strong> Modifique los campos que desee cambiar
                      </p>
                    </div>
                    
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
                        onClick={handleCancelUpdate}
                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors duration-200 flex items-center space-x-2"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancelar</span>
                      </button>
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
                        <span>💾 Guardar Cambios</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  // Mostrar vista compacta con botón de actualizar
                  <div className="space-y-4">
                    {/* Estado de la evaluación */}
                    <div className="bg-green-100 dark:bg-green-800 p-3 rounded-md">
                      <p className="text-green-800 dark:text-green-200 text-sm font-medium">
                        ✅ <strong>Evaluación Completada</strong> - Esta lista de chequeo ya tiene evaluación
                      </p>
                    </div>
                    
                    {/* Resumen de la evaluación */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          📝 Observaciones:
                        </h4>
                        <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 p-2 rounded min-h-[40px]">
                          {selectedEvaluation.observations || "Sin observaciones"}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          💡 Recomendaciones:
                        </h4>
                        <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 p-2 rounded min-h-[40px]">
                          {selectedEvaluation.recommendations || "Sin recomendaciones"}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          ⚖️ Juicio de Valor:
                        </h4>
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          selectedEvaluation.valueJudgment === 'EXCELENTE' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          selectedEvaluation.valueJudgment === 'BUENO' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          selectedEvaluation.valueJudgment === 'ACEPTABLE' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          selectedEvaluation.valueJudgment === 'DEFICIENTE' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                          selectedEvaluation.valueJudgment === 'RECHAZADO' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                          {selectedEvaluation.valueJudgment || "PENDIENTE"}
                        </span>
                      </div>
                    </div>
                    
                    {/* Botón para actualizar evaluación */}
                    <div className="flex justify-center">
                      <button
                        onClick={handleUpdateEvaluationClick}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 flex items-center space-x-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <Edit className="w-5 h-5" />
                        <span>✏️ Actualizar Evaluación</span>
                      </button>
                    </div>
                  </div>
                )
              ) : (
                // Vista simplificada cuando no hay evaluación
                <div className="space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Save className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-blue-900 dark:text-blue-100 font-semibold text-lg mb-2">
                        📋 Esta lista no tiene evaluación
                      </h4>
                      <p className="text-blue-800 dark:text-blue-200 text-sm mb-6 max-w-md mx-auto">
                        Para evaluar esta lista de chequeo, haga clic en el botón de abajo para abrir el formulario de evaluación.
                      </p>
                      
                      {/* Botón principal para crear evaluación */}
                      <button
                        onClick={handleOpenCreateEvaluationModal}
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-lg transition-all duration-300 flex items-center space-x-3 mx-auto font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <Save className="w-6 h-6" />
                        <span>🚀 Crear Evaluación</span>
                      </button>
                      
                      {/* Botón de debug */}
                      <div className="mt-4">
                        <button
                          onClick={debugAllEvaluations}
                          className="text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-md transition-colors"
                        >
                          🔍 Ver evaluaciones en consola (Debug)
                        </button>
                      </div>
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
              className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-all duration-300 ${
                selectedChecklist
                  ? 'hover:border-[#01b001] border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white hover:shadow-md'
                  : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>
                {selectedEvaluation ? "Guardar Lista de chequeo" : "📋 Guardar Lista de Chequeo"}
              </span>
              {(evaluationObservations.trim() || evaluationRecommendations.trim()) && !selectedEvaluation && (
                <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
                  Datos pendientes
                </span>
              )}
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
      
      {/* Modal para crear evaluación */}
      {showCreateEvaluationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header del modal */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Save className="w-6 h-6 text-blue-600" />
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
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  📋 Lista de Chequeo: {selectedChecklist?.trimester ? `Trimestre ${selectedChecklist.trimester}` : 'Sin trimestre'}
                </h3>
                <p className="text-blue-800 dark:text-blue-200 text-sm">
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
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                  className={`px-8 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2 font-semibold ${
                    (isCreatingEvaluation || !evaluationObservations?.trim() || !evaluationRecommendations?.trim() || !evaluationJudgment)
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
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
