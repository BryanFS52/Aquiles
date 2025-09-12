'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Check, FileDown, Save, UploadCloud, X, AlertTriangle, Phone, Edit, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";
import PageTitle from "@components/UI/pageTitle";
import { Card, CardGrid } from "@components/UI/Card";
import DataTable from "@components/UI/DataTable";
import { DataTableColumn } from "@components/UI/DataTable/types";
import Modal from "@components/UI/Modal";
import EmptyState from "@components/UI/emptyState";
import { fetchAllChecklists, fetchChecklistById } from "@services/checkListService.js";
import { fetchEvaluationsByChecklist, fetchEvaluationsByChecklistOld, completeEvaluation, createMissingEvaluationForChecklist, createEvaluationForChecklist } from "@services/evaluationService";
import { exportChecklistToPdf, exportChecklistToExcel, downloadFileFromBase64 } from "@services/exportService";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchAllEvaluationsDebug, updateEvaluationItemStates } from '@/redux/slices/evaluationSlice';
import { updateChecklistSignature, fetchChecklistById as fetchChecklistByIdRedux } from '@/redux/slices/checklistSlice';
import {
  Checklist,
  Evaluation,
  SimulatedChecklistItem,
  InstructorChecklistState,
  ValueJudgment
} from "@/types/checklist";

export default function InstructorChecklistView() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux selectors
  const evaluationState = useSelector((state: RootState) => state.evaluation);
  const checklistState = useSelector((state: RootState) => state.checklist);
  
  // Selector para obtener errores de Redux
  const reduxError = evaluationState.error || checklistState.error;
  
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

  // Estados para el modal de creación de evaluación
  const [showCreateEvaluationModal, setShowCreateEvaluationModal] = useState(false);
  const [isCreatingEvaluation, setIsCreatingEvaluation] = useState(false);
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);

  // Estados para la vista previa
  const [showPreview, setShowPreview] = useState(false);
  const [isFinalSaved, setIsFinalSaved] = useState(false);
  
  // Flag para controlar si el cambio de checklist fue por actualización de firmas
  const [isSignatureUpdate, setIsSignatureUpdate] = useState(false);
  
  // Ref para rastrear qué tipo de actualización de firma está ocurriendo
  const signatureUpdateRef = useRef<{ type: string; inProgress: boolean }>({ type: '', inProgress: false });
  
  // Ref para debounce de guardado automático de items
  const saveItemsDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const itemsPerPage = 3;

  // Función para cargar firmas existentes desde el checklist
  const loadExistingSignatures = (checklist: Checklist): void => {
    // Limpiar firmas primero
    setFirmaAnterior(null);
    setFirmaNuevo(null);
    
    try {
      if (checklist.instructorSignature && 
          checklist.instructorSignature !== "No signature" && 
          checklist.instructorSignature.trim() !== "") {
        
        // Intentar parsear como JSON
        const signatures = JSON.parse(checklist.instructorSignature);
        
        console.log("Firmas cargadas desde BD:", signatures);
        
        // Si es un objeto con firmas separadas
        if (typeof signatures === 'object' && signatures !== null) {
          if (signatures.anterior) {
            // Si es base64 puro, agregar prefijo para mostrar
            const anteriorImage = signatures.anterior.startsWith('data:') 
              ? signatures.anterior 
              : `data:image/jpeg;base64,${signatures.anterior}`;
            setFirmaAnterior(anteriorImage);
            console.log("Firma anterior cargada");
          }
          
          if (signatures.nuevo) {
            // Si es base64 puro, agregar prefijo para mostrar
            const nuevoImage = signatures.nuevo.startsWith('data:') 
              ? signatures.nuevo 
              : `data:image/jpeg;base64,${signatures.nuevo}`;
            setFirmaNuevo(nuevoImage);
            console.log("Firma nuevo cargada");
          }
        }
      } else {
        console.log("No hay firmas existentes para cargar");
      }
    } catch (error) {
      // Si no es JSON válido, puede ser formato legacy o datos corruptos
      console.log("No se pudo parsear firmas como JSON, iniciando limpio:", error);
    }
  };

  // Funciones auxiliares para extraer y estructurar datos de evaluaciones
  const extractItemStatesFromEvaluation = (evaluation: Evaluation) => {
    console.log('🔍 Extracting item states from evaluation:', evaluation.id);
    console.log('📝 Raw observations:', evaluation.observations);
    
    if (!evaluation.observations) {
      console.log('❌ No observations found in evaluation');
      return {};
    }

    try {
      const parsed = JSON.parse(evaluation.observations);
      console.log('📊 Parsed observations:', parsed);
      
      if (parsed.itemStates && typeof parsed.itemStates === 'object') {
        console.log('✅ Item states found:', parsed.itemStates);
        return parsed.itemStates;
      } else {
        console.log('❌ No itemStates object found in parsed observations');
      }
    } catch (error) {
      console.log('❌ Error parsing observations as JSON:', error.message);
      console.log('Raw observations text:', evaluation.observations);
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
    if (!isClientMounted) return; // Esperar a que se monte el cliente
    
    if (selectedChecklist) {
      // Si es una actualización de firma, no recargar evaluaciones
      if (isSignatureUpdate || signatureUpdateRef.current.inProgress) {
        console.log("=== SIGNATURE UPDATE DETECTED - SKIPPING EVALUATION RELOAD ===");
        console.log("isSignatureUpdate:", isSignatureUpdate);
        console.log("signatureUpdateRef:", signatureUpdateRef.current);
        return;
      }

      console.log("=== CHECKLIST CHANGED - LOADING EVALUATIONS ===");
      // Guardar selección en localStorage para persistencia de navegación
      localStorage.setItem('selectedChecklistId', selectedChecklist.id);
      console.log('💾 Guardando selección de checklist para persistencia:', selectedChecklist.id);

      // Resetear estados de guardado al cambiar de checklist
      setIsFinalSaved(false);
      setShowPreview(false);

      // Inicializar estado del localStorage para el nuevo checklist
      const previousFinalState = localStorage.getItem(`isFinalSaved_${selectedChecklist.id}`);
      if (previousFinalState === 'true') {
        setIsFinalSaved(true);
        console.log('🔒 Estado de guardado definitivo restaurado para checklist:', selectedChecklist.id);
      }

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

      // Cargar estado de guardado definitivo desde localStorage
      const savedFinalState = localStorage.getItem(`isFinalSaved_${selectedChecklist.id}`);
      if (savedFinalState === 'true') {
        setIsFinalSaved(true);
        console.log('🔒 Estado de guardado definitivo restaurado para checklist:', selectedChecklist.id);
      } else {
        setIsFinalSaved(false);
        console.log('🔓 Checklist en modo edición:', selectedChecklist.id);
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
      if (isClientMounted) {
        localStorage.removeItem('selectedChecklistId');
      }
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
  }, [selectedChecklist?.id, isClientMounted]); // Agregar isClientMounted como dependencia

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
        console.log('📋 Setting item states from DB:', itemStatesFromDB);
        setItemStates(itemStatesFromDB);
        console.log('✅ Estados de items actualizados desde BD');
        
        // Limpiar localStorage ya que tenemos datos frescos de BD
        if (selectedChecklist) {
          localStorage.removeItem(`itemStates_${selectedChecklist.id}`);
        }
      } else {
        console.log('❌ No item states found from DB, keeping current state');
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

  // Función para guardar automáticamente los estados de items en la base de datos
  const saveItemStatesToDatabase = async (updatedItemStates: { [key: number]: { completed: boolean | null, observations: string } }) => {
    if (!selectedEvaluation || !selectedChecklist) {
      console.log('❌ No se puede guardar: falta evaluación o checklist seleccionado');
      return;
    }

    if (isFinalSaved) {
      console.log('❌ No se puede guardar: evaluación ya está guardada definitivamente');
      return;
    }

    try {
      setIsSavingItems(true);
      console.log('💾 Guardando estados de items automáticamente en BD...');
      
      // Crear o actualizar evaluación con los nuevos estados de items
      const result = await dispatch(updateEvaluationItemStates({
        id: parseInt(selectedEvaluation.id),
        itemStates: updatedItemStates,
        generalObservations: evaluationObservations,
        recommendations: evaluationRecommendations,
        valueJudgment: evaluationJudgment
      }));

      if (updateEvaluationItemStates.fulfilled.match(result)) {
        console.log('✅ Estados de items guardados automáticamente en BD');
        setPendingChanges(false); // Limpiar indicador de cambios pendientes
        // Mostrar un toast sutil solo la primera vez o cada cierto tiempo
        toast.success('💾 Cambios guardados automáticamente', { 
          position: "bottom-right", 
          autoClose: 2000,
          hideProgressBar: true 
        });
      } else {
        console.warn('⚠️ Error al guardar estados de items automáticamente:', result.payload);
        toast.error('❌ Error al guardar cambios automáticamente');
      }
    } catch (error) {
      console.error('❌ Error guardando estados de items automáticamente:', error);
      toast.error('❌ Error al guardar cambios automáticamente');
    } finally {
      setIsSavingItems(false);
    }
  };

  // Auto-guardado para campos de evaluación
  useEffect(() => {
    if (!isClientMounted) return; // Solo ejecutar en cliente
    
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
  }, [evaluationObservations, evaluationRecommendations, evaluationJudgment, selectedChecklist, isClientMounted]);

  // Manejar errores de Redux
  useEffect(() => {
    if (reduxError) {
      console.error('Redux error detected:', reduxError);
      if (typeof reduxError === 'string') {
        toast.error(`Error: ${reduxError}`);
      } else if (reduxError && typeof reduxError === 'object' && 'message' in reduxError) {
        toast.error(`Error: ${reduxError.message}`);
      }
    }
  }, [reduxError]);

  // Limpiar timeout al desmontar componente
  useEffect(() => {
    return () => {
      if (saveItemsDebounceRef.current) {
        clearTimeout(saveItemsDebounceRef.current);
      }
    };
  }, []);

  // Manejo de hidratación del cliente - cargar datos de localStorage después del mount
  useEffect(() => {
    setIsClientMounted(true);
    
    // Cargar trimestre desde localStorage
    const savedTrimester = localStorage.getItem('selectedTrimester');
    if (savedTrimester) {
      setSelectedTrimester(savedTrimester);
    }
  }, []);



  // Función de debugging para ver todas las evaluaciones usando Redux
  const debugAllEvaluations = async (): Promise<void> => {
    try {
      console.log("=== DEBUGGING ALL EVALUATIONS VIA REDUX ===");
      const result = await dispatch(fetchAllEvaluationsDebug({ page: 0, size: 100 }));

      if (fetchAllEvaluationsDebug.fulfilled.match(result)) {
        const data = result.payload;
        console.log("All evaluations in database:", data);
        
        if (data && data.data) {
          console.log("Total evaluations found:", data.data.length);
          data.data.forEach((evaluation: any, index: number) => {
            console.log(`Evaluation ${index + 1}:`, {
              id: evaluation.id,
              checklistId: evaluation.checklistId,
              observations: evaluation.observations,
              recommendations: evaluation.recommendations,
              valueJudgment: evaluation.valueJudgment
            });
          });

          if (selectedChecklist) {
            const matchingEvaluations = data.data.filter(
              (evaluation: any) => evaluation.checklistId == selectedChecklist.id
            );
            console.log(`Evaluations matching checklist ${selectedChecklist.id}:`, matchingEvaluations);
          }
        }
      } else {
        console.error("Error debugging evaluations:", result.payload);
      }
    } catch (error) {
      console.error("Error debugging evaluations:", error);
    }
  };

  const loadActiveChecklists = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Obtener la ficha del instructor desde localStorage
      const instructorStudySheetId = localStorage.getItem('selectedStudySheetId');
      const instructorStudySheetNumber = localStorage.getItem('selectedStudySheetNumber');
      console.log("🔍 Instructor study sheet:", { id: instructorStudySheetId, number: instructorStudySheetNumber });
      
      const response = await fetchAllChecklists(0, 100);
      console.log("Raw checklists response:", response); // Debug log

      if (response.code === "200" && response.data) {
        // Filtrar solo las listas activas
        let activeLists = response.data.filter((checklist: Checklist) => checklist.state === true);
        console.log("All active checklists:", activeLists.length);
        
        // Si el instructor tiene una ficha asignada, filtrar por esa ficha
        if (instructorStudySheetId) {
          activeLists = activeLists.filter((checklist: Checklist) => {
            if (!checklist.studySheets) {
              console.log(`❌ Checklist ${checklist.id} has no study sheets assigned`);
              return false;
            }
            
            // studySheets es un string con IDs separados por comas
            const assignedSheets = checklist.studySheets.split(',').map(s => s.trim());
            const isAssigned = assignedSheets.includes(instructorStudySheetId);
            
            console.log(`🔍 Checklist ${checklist.id}: assigned sheets [${assignedSheets.join(', ')}], instructor sheet ID: ${instructorStudySheetId}, match: ${isAssigned}`);
            
            return isAssigned;
          });
          
          console.log(`✅ Filtered checklists for instructor's sheet (ID: ${instructorStudySheetId}, Number: ${instructorStudySheetNumber}):`, activeLists.length);
        } else {
          console.log("⚠️ No instructor study sheet ID found, showing all active checklists");
        }

        console.log("Final active checklists:", activeLists); // Debug log
        console.log("Trimester values:", activeLists.map(cl => ({ id: cl.id, trimester: cl.trimester, studySheets: cl.studySheets }))); // Debug log

        setActiveChecklists(activeLists);
        if (activeLists.length > 0 && !selectedChecklist) {
          setSelectedChecklist(activeLists[0]);
        } else if (activeLists.length === 0 && instructorStudySheetId) {
          toast.info(`No hay listas de chequeo asignadas a tu ficha de formación (Ficha ${instructorStudySheetNumber})`);
        }
      }
    } catch (error) {
      console.error("Error loading active checklists:", error);
      toast.error("Error al cargar las listas de chequeo activas");
    } finally {
      setLoading(false);
    }
  }, [selectedChecklist, setActiveChecklists, setSelectedChecklist]);

  // Cargar listas de chequeo activas después de que se establezca la información del instructor
  useEffect(() => {
    if (isClientMounted && selectedStudySheetId) {
      console.log('🔄 Loading checklists for instructor sheet:', { id: selectedStudySheetId, number: selectedStudySheetNumber });
      loadActiveChecklists();
    }
  }, [isClientMounted, selectedStudySheetId, loadActiveChecklists]);

  // Recuperar información del team scrum seleccionado desde localStorage
  useEffect(() => {
    if (!isClientMounted) return; // Esperar a que se monte el cliente
    
    const teamScrumId = localStorage.getItem('selectedTeamScrumId');
    const teamScrumName = localStorage.getItem('selectedTeamScrumName');
    const studySheetNumber = localStorage.getItem('selectedStudySheetNumber');
    const studySheetId = localStorage.getItem('selectedStudySheetId');
    
    if (teamScrumId && teamScrumName) {
      const previousStudySheetId = selectedStudySheetId;
      
      setSelectedTeamScrumId(teamScrumId);
      setSelectedTeamScrumName(teamScrumName);
      setSelectedStudySheetNumber(studySheetNumber || "");
      setSelectedStudySheetId(studySheetId || "");
      
      console.log('🔄 Recuperando información del team scrum:', {
        teamScrumId,
        teamScrumName,
        studySheetNumber,
        studySheetId,
        previousStudySheetId
      });
      
      // Si cambió la ficha del instructor, recargar las listas de chequeo
      if (previousStudySheetId !== studySheetId && previousStudySheetId !== undefined) {
        console.log('🔄 Study sheet changed, reloading checklists');
        loadActiveChecklists();
      }
    } else {
      // Si no hay team scrum seleccionado, redirigir a la página de selección
      console.log('❌ No hay team scrum seleccionado, redirigiendo a selección');
      window.location.href = '/dashboard/InstructorSelection';
    }
  }, [isClientMounted, selectedStudySheetId, loadActiveChecklists]);
  
  const loadEvaluationsForChecklist = async (checklistId: number): Promise<void> => {
    try {
      console.log("=== LOADING EVALUATIONS FROM DATABASE ===");
      console.log("Checklist ID:", checklistId, "Type:", typeof checklistId);

      // Cargar evaluaciones desde la base de datos
      const evaluationsResponse = await fetchEvaluationsByChecklist(checklistId);
      console.log("🔍 Raw evaluations response:", evaluationsResponse);

      if (evaluationsResponse && evaluationsResponse.code === "200") {
        console.log("✅ Evaluations response successful");
        console.log("📊 Response data:", evaluationsResponse.data);

        if (evaluationsResponse.data && evaluationsResponse.data.length > 0) {
          setEvaluations(evaluationsResponse.data);
          console.log("✅ Found evaluations:", evaluationsResponse.data.length);
          console.log("🔍 First evaluation details:", evaluationsResponse.data[0]);

          // Seleccionar la primera evaluación
          const firstEvaluation = evaluationsResponse.data[0];

          setSelectedEvaluation(firstEvaluation);
          console.log("✅ Evaluation loaded successfully, observations:", firstEvaluation.observations);
          return;
        } else {
          console.log("⚠️ No evaluations found in main response, data is empty or null");
          console.log("Data value:", evaluationsResponse.data);
        }
      } else {
        console.log("⚠️ Main evaluations response failed");
        console.log("Response code:", evaluationsResponse?.code);
        console.log("Response message:", evaluationsResponse?.message);
        console.log("Full response:", evaluationsResponse);
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
  }, [selectedChecklist, itemStates]); // Agregar itemStates como dependencia

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Configuración de columnas para DataTable del checklist con diseño de la imagen
  const checklistColumns: DataTableColumn<SimulatedChecklistItem>[] = [
    {
      key: 'id',
      header: 'ITEM',
      className: 'w-20 text-center',
      render: (row: SimulatedChecklistItem) => (
        <span className="text-gray-900 dark:text-white font-medium">#{row.id}</span>
      )
    },
    {
      key: 'indicator',
      header: 'DESCRIPCIÓN DEL INDICADOR',
      className: 'min-w-[300px] text-left',
      render: (row: SimulatedChecklistItem) => (
        <p className="text-gray-900 dark:text-white font-medium leading-relaxed evaluation-text">
          {row.indicator}
        </p>
      )
    },
    {
      key: 'completed',
      header: 'CUMPLE',
      className: 'w-32 text-center',
      render: (row: SimulatedChecklistItem) => {
        const itemState = itemStates[row.id] || { completed: row.completed, observations: row.observations };
        return (
          <div className="flex justify-center space-x-2">
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name={`item-${row.id}`}
                checked={itemState.completed === true}
                onChange={() => handleItemChange(row.id, "completed", true)}
                disabled={isFinalSaved}
                className={`text-blue-600 focus:ring-blue-500 ${isFinalSaved ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              <span className="text-sm font-medium text-blue-600">Sí</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name={`item-${row.id}`}
                checked={itemState.completed === false}
                onChange={() => handleItemChange(row.id, "completed", false)}
                disabled={isFinalSaved}
                className={`text-red-600 focus:ring-red-500 ${isFinalSaved ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              <span className="text-sm font-medium text-red-600">No</span>
            </label>
          </div>
        );
      }
    },
    {
      key: 'observations',
      header: 'OBSERVACIONES',
      className: 'min-w-[250px] text-left',
      render: (row: SimulatedChecklistItem) => {
        const itemState = itemStates[row.id] || { completed: row.completed, observations: row.observations };
        return (
          <textarea
            value={itemState.observations || ''}
            onChange={(e) => handleItemChange(row.id, "observations", e.target.value)}
            disabled={isFinalSaved}
            className={`w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none break-words whitespace-pre-wrap ${
              isFinalSaved ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            }`}
            style={{ overflowWrap: 'anywhere' }}
            rows={2}
            placeholder={isFinalSaved ? "Evaluación guardada" : "Escriba sus observaciones..."}
          />
        );
      }
    }
  ];

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
          // Cargar firmas existentes si las hay
          loadExistingSignatures(checklistResponse.data);
        } else {
          // Si no se pueden cargar los detalles, usar el checklist básico
          setSelectedChecklist(checklist || null);
          if (checklist) {
            loadExistingSignatures(checklist);
          }
          console.warn("Could not load checklist details, using basic data");
        }

        // Las evaluaciones se cargarán automáticamente por el useEffect

      } catch (error) {
        console.error("Error loading checklist details:", error);
        // En caso de error, usar el checklist básico y no mostrar error al usuario
        setSelectedChecklist(checklist || null);
        if (checklist) {
          loadExistingSignatures(checklist);
        }
      }
    } else {
      setSelectedChecklist(null);
      // Limpiar firmas cuando no hay checklist seleccionado
      setFirmaAnterior(null);
      setFirmaNuevo(null);
    }
  };

  const handleItemChange = (id: number, field: string, value: any): void => {
    // Actualizar estado local inmediatamente para feedback visual
    const updatedStates = {
      ...itemStates,
      [id]: {
        ...itemStates[id],
        [field]: value
      }
    };
    
    setItemStates(updatedStates);
    console.log("Updated item:", { id, field, value });
    
    // Guardar en localStorage para persistencia entre recargas
    localStorage.setItem(`itemStates_${selectedChecklist?.id}`, JSON.stringify(updatedStates));
    
    // Cancelar guardado previo si existe
    if (saveItemsDebounceRef.current) {
      clearTimeout(saveItemsDebounceRef.current);
    }
    
    // Programar guardado automático en BD después de 2 segundos de inactividad
    if (selectedEvaluation) {
      setPendingChanges(true); // Marcar que hay cambios pendientes
      
      saveItemsDebounceRef.current = setTimeout(() => {
        console.log('⏰ Ejecutando guardado automático de estados de items...');
        saveItemStatesToDatabase(updatedStates);
      }, 2000); // 2 segundos de debounce
      
      console.log('🕐 Guardado automático programado en 2 segundos...');
    } else {
      // Si no hay evaluación, crear una automáticamente y luego guardar
      console.log('⚠️ No hay evaluación seleccionada, creando una automáticamente...');
      setPendingChanges(true);
      
      saveItemsDebounceRef.current = setTimeout(async () => {
        console.log('⏰ Creando evaluación y guardando estados de items...');
        try {
          // Crear evaluación automáticamente
          if (selectedChecklist) {
            await handleCreateMissingEvaluation();
            // Esperar un poco y luego intentar guardar
            setTimeout(() => {
              if (selectedEvaluation) {
                saveItemStatesToDatabase(updatedStates);
              }
            }, 1500);
          }
        } catch (error) {
          console.error('Error creando evaluación automática:', error);
          setPendingChanges(false);
        }
      }, 3000); // Un poco más de tiempo para crear evaluación
      
      console.log('🕐 Creación de evaluación y guardado programados...');
    }
  };

  // Función para convertir archivo a base64 sin el prefijo data:
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = (e.target?.result as string).split(',')[1]; // Obtener solo el base64 sin prefijo
        resolve(base64);
      };
      reader.onerror = () => reject(new Error('Error al convertir archivo'));
      reader.readAsDataURL(file);
    });
  };

  // Función para guardar firma en la base de datos usando Redux
  const saveSignatureToDatabase = async (base64Data: string, signatureType: 'anterior' | 'nuevo'): Promise<void> => {
    if (!selectedChecklist) {
      toast.error("No hay lista de chequeo seleccionada");
      return;
    }

    try {
      // Marcar que estamos actualizando una firma ANTES de hacer cualquier cambio
      console.log(`=== INICIANDO ACTUALIZACIÓN DE FIRMA ${signatureType.toUpperCase()} ===`);
      setIsSignatureUpdate(true);
      signatureUpdateRef.current = { type: signatureType, inProgress: true };
      
      toast.info(`💾 Guardando firma de instructor ${signatureType}...`);
      
      // Parsear las firmas existentes (si las hay)
      let existingSignatures = {};
      try {
        const currentSignature = selectedChecklist.instructorSignature;
        if (currentSignature && 
            currentSignature !== "No signature" && 
            currentSignature.trim() !== "" &&
            currentSignature !== "{}" &&
            currentSignature !== "{}") {
          
          // Intentar parsear como JSON
          existingSignatures = JSON.parse(currentSignature);
          console.log("Firmas existentes encontradas:", existingSignatures);
        } else {
          console.log("No hay firmas existentes, iniciando objeto vacío");
        }
      } catch (error) {
        console.log("Error parseando firmas existentes, iniciando objeto vacío:", error);
        existingSignatures = {};
      }

      // Actualizar con la nueva firma
      const updatedSignatures = {
        ...existingSignatures,
        [signatureType]: base64Data,
        lastUpdated: new Date().toISOString(),
        updatedBy: "instructor" // Identificar quién actualizó
      };

      // Crear el objeto de datos para actualizar
      // Manejar studySheets correctamente para GraphQL
      let studySheetsData = null;
      if (selectedChecklist.studySheets) {
        if (Array.isArray(selectedChecklist.studySheets)) {
          const validIds = selectedChecklist.studySheets.map((id: any) => parseInt(id.toString(), 10)).filter((id: number) => !isNaN(id));
          studySheetsData = validIds.length > 0 ? validIds : null;
        } else if (typeof selectedChecklist.studySheets === 'number') {
          studySheetsData = [selectedChecklist.studySheets];
        } else if (typeof selectedChecklist.studySheets === 'string') {
          // Si es string, puede ser una lista separada por comas
          const ids = (selectedChecklist.studySheets as string).split(',').map((id: string) => parseInt(id.trim(), 10)).filter((id: number) => !isNaN(id));
          studySheetsData = ids.length > 0 ? ids : null;
        }
      }

      const checklistData = {
        state: selectedChecklist.state,
        remarks: selectedChecklist.remarks || '',
        instructorSignature: JSON.stringify(updatedSignatures), // Guardar como JSON
        evaluationCriteria: selectedChecklist.evaluationCriteria || false,
        trimester: selectedChecklist.trimester,
        component: selectedChecklist.component || '',
        studySheets: studySheetsData
      };

      console.log(`Guardando firma ${signatureType}:`, {
        checklistId: selectedChecklist.id,
        updatedSignatures,
        checklistData,
        studySheetsOriginal: selectedChecklist.studySheets,
        studySheetsProcessed: studySheetsData
      });

      // Usar Redux en lugar de GraphQL directo
      const result = await dispatch(updateChecklistSignature({
        id: parseInt(selectedChecklist.id),
        checklistData
      }));

      if (updateChecklistSignature.fulfilled.match(result)) {
        // Actualizar las firmas locales para la UI
        if (signatureType === 'anterior') {
          const anteriorImage = base64Data.startsWith('data:') 
            ? base64Data 
            : `data:image/jpeg;base64,${base64Data}`;
          setFirmaAnterior(anteriorImage);
        } else if (signatureType === 'nuevo') {
          const nuevoImage = base64Data.startsWith('data:') 
            ? base64Data 
            : `data:image/jpeg;base64,${base64Data}`;
          setFirmaNuevo(nuevoImage);
        }

        toast.success(`✅ Firma de instructor ${signatureType} guardada exitosamente`);
        console.log("Firma guardada exitosamente sin resetear evaluación:", result.payload);
        console.log(`=== FINALIZADA ACTUALIZACIÓN DE FIRMA ${signatureType.toUpperCase()} ===`);
        
        // Opcionalmente recargar el checklist para obtener datos actualizados
        // await dispatch(fetchChecklistByIdRedux({ id: parseInt(selectedChecklist.id) }));
      } else {
        throw new Error(result.payload?.message || "Error al guardar firma");
      }
      
    } catch (error) {
      console.error(`Error guardando firma ${signatureType}:`, error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(`❌ Error al guardar firma de instructor ${signatureType}: ${errorMessage}`);
    } finally {
      // Resetear los flags después de completar la operación
      setTimeout(() => {
        setIsSignatureUpdate(false);
        signatureUpdateRef.current = { type: '', inProgress: false };
        console.log("=== FLAGS DE FIRMA RESETEADOS ===");
      }, 100);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<string | null>>
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar si está bloqueado por guardado definitivo
    if (isFinalSaved) {
      toast.error("No se pueden subir firmas. La lista ha sido guardada definitivamente");
      return;
    }

    // Validaciones
    if (!file.type.startsWith('image/')) {
      toast.error("Por favor seleccione un archivo de imagen válido");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB máximo
      toast.error("El archivo no puede ser mayor a 5MB");
      return;
    }

    try {
      // Mostrar la imagen localmente primero para feedback inmediato
      const reader = new FileReader();
      reader.onload = (e) => {
        setFile(e.target?.result as string);
        console.log("Firma mostrada localmente para feedback inmediato");
      };
      reader.readAsDataURL(file);

      // Convertir a base64 para guardar en BD
      const base64Data = await convertFileToBase64(file);
      
      // Determinar tipo de firma basado en la función setState
      const signatureType = setFile === setFirmaAnterior ? 'anterior' : 'nuevo';
      
      // Guardar en base de datos (esto ya no resetea la evaluación)
      await saveSignatureToDatabase(base64Data, signatureType);

    } catch (error) {
      console.error('Error procesando archivo:', error);
      toast.error("Error al procesar el archivo de imagen");
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
        valueJudgment: evaluationJudgment,
        teamScrumId: selectedTeamScrumId
      });

      const teamScrumIdNumber = selectedTeamScrumId ? parseInt(selectedTeamScrumId) : undefined;
      const response = await completeEvaluation(
        parseInt(selectedEvaluation.id),
        evaluationObservations, // Solo las observaciones en texto plano
        evaluationRecommendations,
        evaluationJudgment,
        teamScrumIdNumber
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

      // Manejar studySheets correctamente para GraphQL
      let studySheetsData = null;
      if (selectedChecklist.studySheets) {
        if (Array.isArray(selectedChecklist.studySheets)) {
          const validIds = selectedChecklist.studySheets.map((id: any) => parseInt(id.toString(), 10)).filter((id: number) => !isNaN(id));
          studySheetsData = validIds.length > 0 ? validIds : null;
        } else if (typeof selectedChecklist.studySheets === 'number') {
          studySheetsData = [selectedChecklist.studySheets];
        } else if (typeof selectedChecklist.studySheets === 'string') {
          // Si es string, puede ser una lista separada por comas
          const ids = (selectedChecklist.studySheets as string).split(',').map((id: string) => parseInt(id.trim(), 10)).filter((id: number) => !isNaN(id));
          studySheetsData = ids.length > 0 ? ids : null;
        }
      }

      // Crear un objeto con los datos actualizados del checklist
      const checklistData = {
        id: selectedChecklist.id,
        state: selectedChecklist.state,
        remarks: selectedChecklist.remarks || '',
        instructorSignature: selectedChecklist.instructorSignature || JSON.stringify({}),
        evaluationCriteria: selectedChecklist.evaluationCriteria || '',
        trimester: selectedChecklist.trimester,
        component: selectedChecklist.component || '',
        studySheets: studySheetsData,
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

      // Guardar el estado de guardado definitivo en localStorage
      if (selectedChecklist) {
        localStorage.setItem(`isFinalSaved_${selectedChecklist.id}`, 'true');
        console.log('💾 Estado de guardado definitivo guardado en localStorage');
        
        // Limpiar otros datos del localStorage después del guardado definitivo
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
    
    // Limpiar el estado del localStorage para permitir edición
    if (selectedChecklist) {
      localStorage.removeItem(`isFinalSaved_${selectedChecklist.id}`);
      console.log('🔓 Estado de guardado definitivo eliminado del localStorage - modo edición habilitado');
    }
    
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

      const teamScrumIdNumber = selectedTeamScrumId ? parseInt(selectedTeamScrumId) : undefined;
      const response = await createMissingEvaluationForChecklist(parseInt(selectedChecklist.id), teamScrumIdNumber);

      if (response && response.code === "200") {
        toast.success("✅ Evaluación creada exitosamente");

        // Recargar las evaluaciones para mostrar la nueva
        await loadEvaluationsForChecklist(parseInt(selectedChecklist.id));
        
        // Si hay estados de items pendientes, guardarlos automáticamente
        if (Object.keys(itemStates).length > 0) {
          console.log('🔄 Guardando estados de items pendientes en la nueva evaluación...');
          setTimeout(() => {
            saveItemStatesToDatabase(itemStates);
          }, 1000); // Dar tiempo para que se cargue la evaluación
        }
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
      const teamScrumIdNumber = selectedTeamScrumId ? parseInt(selectedTeamScrumId) : undefined;
      const newEvaluationResult = await createMissingEvaluationForChecklist(parseInt(selectedChecklist.id), teamScrumIdNumber);

      if (newEvaluationResult && newEvaluationResult.code === "200" && newEvaluationResult.id) {
        console.log('✅ Evaluación base creada con ID:', newEvaluationResult.id);

        // Completar la evaluación con los datos del formulario
        const completeResult = await completeEvaluation(
          parseInt(newEvaluationResult.id),
          evaluationData.observations,
          evaluationData.recommendations,
          evaluationData.valueJudgment,
          teamScrumIdNumber
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
      const teamScrumIdNumber = selectedTeamScrumId ? parseInt(selectedTeamScrumId) : undefined;
      const createResponse = await createMissingEvaluationForChecklist(parseInt(selectedChecklist.id), teamScrumIdNumber);
      console.log("Create response:", createResponse);

      if (createResponse && createResponse.code === "200" && createResponse.id) {
        console.log("✅ Evaluación base creada con ID:", createResponse.id);

        // Completar la evaluación inmediatamente con todos los datos
        console.log("Completando evaluación con datos...");
        
        // Guardar solo las observaciones generales (texto plano) en la base de datos
        const teamScrumIdNumber = selectedTeamScrumId ? parseInt(selectedTeamScrumId) : undefined;
        const completeResponse = await completeEvaluation(
          parseInt(createResponse.id),
          evaluationObservations, // Solo texto plano
          evaluationRecommendations,
          evaluationJudgment,
          teamScrumIdNumber
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

  // Función para volver a la vista de selección de TeamScrum
  const handleBackToSelection = () => {
    // Limpiar localStorage de la sesión actual
    localStorage.removeItem('selectedChecklistId');
    if (selectedChecklist) {
      localStorage.removeItem(`itemStates_${selectedChecklist.id}`);
      localStorage.removeItem(`evaluationData_${selectedChecklist.id}`);
    }
    
    // Mostrar mensaje de confirmación
    toast.info("Regresando a la selección de TeamScrum...");
    
    // Navegar a la vista de selección
    router.push('/dashboard/InstructorSelection');
  };

  // Mostrar loader durante la hidratación del cliente
  if (!isClientMounted) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
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
              <div className="flex items-center space-x-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full border border-blue-300 dark:border-blue-600">
                <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
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
              <div className="flex items-center space-x-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full border border-blue-300 dark:border-blue-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
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

        {/* Cards de información específica con diseño moderno */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card 
            header={<div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm"></span>
              </div>
            </div>}
            body={<div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Centro de Formación</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-tight">Centro de Servicios Financieros</p>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Fecha</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">05/02/2024 - 05/05/2024</p>
              </div>
            </div>}
          />
          <Card 
            header={<div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm"></span>
              </div>
            </div>}
            body={<div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Datos de Formación</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-semibold text-gray-900 dark:text-white">Jornada:</span> Diurna
              </p>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Ficha N°</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">{selectedStudySheetNumber || "No disponible"}</p>
              </div>
            </div>}
          />
          <Card 
            header={<div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm"></span>
              </div>
            </div>}
            body={<div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Team Scrum</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{selectedTeamScrumName || "No seleccionado"}</p>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">Evaluando</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">Equipo de desarrollo</p>
              </div>
            </div>}
          />
          <Card 
            header={<div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm"></span>
              </div>
            </div>}
            body={<div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Instructor Calificador</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Juan Pérez</p>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">Lista Seleccionada</p>
                {selectedChecklist ? (
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-tight">ID: {selectedChecklist.id} - {selectedChecklist.component || 'N/A'}</p>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ninguna lista seleccionada</p>
                )}
              </div>
            </div>}
          />
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
                      ? 'border-blue-500 dark:border-shadowBlue bg-gradient-to-r from-blue-600 to-blue-500 dark:from-shadowBlue dark:to-darkBlue text-white hover:from-blue-500 hover:to-blue-600 dark:hover:from-darkBlue dark:hover:to-shadowBlue'
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
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-shadowBlue dark:to-darkBlue text-white px-4 py-2 rounded-full shadow-md">
                  <span className="text-sm font-semibold">
                    Activas: {activeChecklists.length} | Filtradas: {filteredChecklists.length}
                  </span>
                </div>

                <button
                  onClick={handleExportPDF}
                  disabled={!selectedChecklist}
                  className={`hexagon-export flex items-center gap-2 px-5 py-3 rounded-full transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 ${selectedChecklist
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 dark:from-shadowBlue dark:to-darkBlue text-white hover:from-blue-500 hover:to-blue-600 dark:hover:from-darkBlue dark:hover:to-shadowBlue'
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
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 dark:from-shadowBlue dark:to-darkBlue text-white hover:from-blue-500 hover:to-blue-600 dark:hover:from-darkBlue dark:hover:to-shadowBlue'
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
            {/* DataTable con diseño moderno basado en la referencia */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-[#5cb800] to-[#8fd400] dark:from-secondary dark:to-blue-900 px-6 py-4">
                <h2 className="text-2xl font-bold text-white text-center">
                  Lista de Chequeo
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  {/* Headers personalizados con el diseño de la imagen */}
                  <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <div className="grid grid-cols-12 gap-4 px-6 py-5 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      <div className="col-span-1 text-center">ITEM</div>
                      <div className="col-span-5 text-left">DESCRIPCIÓN DEL INDICADOR</div>
                      <div className="col-span-2 text-center">CUMPLE</div>
                      <div className="col-span-4 text-left">OBSERVACIONES</div>
                    </div>
                  </div>
                  
                  {/* Contenido de la tabla */}
                  <div className="divide-y divide-gray-200 dark:divide-gray-600">
                    {currentItems.map((item, index) => {
                      const itemState = itemStates[item.id] || { completed: item.completed, observations: item.observations };
                      return (
                        <div key={item.id} className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                          {/* ITEM */}
                          <div className="col-span-1 flex items-center justify-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-[#5cb800] to-[#8fd400] rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">{item.id}</span>
                            </div>
                          </div>
                          
                          {/* DESCRIPCIÓN DEL INDICADOR */}
                          <div className="col-span-5 flex items-start">
                            <p className="text-gray-900 dark:text-white font-medium leading-relaxed evaluation-text text-base">
                              {item.indicator}
                            </p>
                          </div>
                          
                          {/* CUMPLE */}
                          <div className="col-span-2 flex items-center justify-center">
                            <div className="flex space-x-6">
                              <label className={`flex items-center space-x-2 cursor-pointer transition-colors duration-200 ${
                                isFinalSaved ? 'opacity-50 cursor-not-allowed' : ''
                              }`}>
                                <input
                                  type="radio"
                                  name={`item-${item.id}`}
                                  checked={itemState.completed === true}
                                  onChange={() => handleItemChange(item.id, "completed", true)}
                                  disabled={isFinalSaved}
                                  className={`w-5 h-5 text-blue-600 focus:ring-blue-500 focus:ring-2 border-gray-300 dark:border-gray-600 ${
                                    isFinalSaved ? 'cursor-not-allowed' : ''
                                  }`}
                                />
                                <span className={`text-base font-medium ${
                                  itemState.completed === true 
                                    ? 'text-blue-700 dark:text-blue-400' 
                                    : 'text-gray-600 dark:text-gray-400'
                                }`}>
                                  Sí
                                </span>
                              </label>
                              
                              <label className={`flex items-center space-x-2 cursor-pointer transition-colors duration-200 ${
                                isFinalSaved ? 'opacity-50 cursor-not-allowed' : ''
                              }`}>
                                <input
                                  type="radio"
                                  name={`item-${item.id}`}
                                  checked={itemState.completed === false}
                                  onChange={() => handleItemChange(item.id, "completed", false)}
                                  disabled={isFinalSaved}
                                  className={`w-5 h-5 text-red-600 focus:ring-red-500 focus:ring-2 border-gray-300 dark:border-gray-600 ${
                                    isFinalSaved ? 'cursor-not-allowed' : ''
                                  }`}
                                />
                                <span className={`text-base font-medium ${
                                  itemState.completed === false 
                                    ? 'text-red-700 dark:text-red-400' 
                                    : 'text-gray-600 dark:text-gray-400'
                                }`}>
                                  No
                                </span>
                              </label>
                            </div>
                          </div>
                          
                          {/* OBSERVACIONES */}
                          <div className="col-span-4 flex items-start">
                            <textarea
                              value={itemState.observations || ''}
                              onChange={(e) => handleItemChange(item.id, "observations", e.target.value)}
                              disabled={isFinalSaved}
                              className={`w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none break-words whitespace-pre-wrap ${
                                isFinalSaved ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-[#5cb800] focus:border-[#5cb800]'
                              }`}
                              style={{ overflowWrap: 'anywhere' }}
                              rows={4}
                              placeholder={isFinalSaved ? "Evaluación guardada" : "Escriba sus observaciones..."}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Paginación integrada */}
                  {totalPages > 1 && (
                    <div className="bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 px-6 py-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Página <span className="font-medium text-gray-900 dark:text-white">{currentPage}</span> de <span className="font-medium text-gray-900 dark:text-white">{totalPages}</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            Anterior
                          </button>
                          <div className="px-4 py-2 text-sm font-medium text-[#5cb800] dark:text-[#8fd400] bg-[#5cb800]/10 dark:bg-[#8fd400]/10 border border-[#5cb800]/30 dark:border-[#8fd400]/30 rounded-lg">
                            {currentPage} / {totalPages}
                          </div>
                          <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            Siguiente
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sección de Evaluación con diseño de tabla */}
            {selectedChecklist && (
              <div className="mt-12 relative">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#5cb800] to-[#8fd400] dark:from-secondary dark:to-blue-900 px-6 py-4">
                    <h3 className="text-2xl font-bold text-white text-center">
                      Evaluación de Lista de Chequeo
                    </h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <div className="min-w-full">
                      {selectedEvaluation ? (
                        // Vista cuando hay evaluación existente
                        showEvaluationForm ? (
                          // Mostrar formulario de actualización en formato tabla
                          <div>
                            {/* Estado de la evaluación */}
                            <div className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-800 dark:to-blue-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                              <p className="text-blue-800 dark:text-blue-200 text-center font-medium">
                                <strong>Actualizar Evaluación:</strong> Modifique los campos que desee cambiar
                              </p>
                            </div>

                            {/* Headers de la tabla */}
                            <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                              <div className="grid grid-cols-12 gap-4 px-6 py-5 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                <div className="col-span-4 text-left">OBSERVACIONES</div>
                                <div className="col-span-4 text-left">RECOMENDACIONES</div>
                                <div className="col-span-2 text-center">JUICIO DE VALOR</div>
                                <div className="col-span-2 text-center">ACCIONES</div>
                              </div>
                            </div>

                            {/* Contenido de la tabla */}
                            <div className="px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                              <div className="grid grid-cols-12 gap-4 items-start">
                                {/* OBSERVACIONES */}
                                <div className="col-span-4">
                                  <textarea
                                    value={evaluationObservations}
                                    onChange={(e) => setEvaluationObservations(e.target.value)}
                                    disabled={isFinalSaved}
                                    className={`w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none break-words whitespace-pre-wrap ${
                                      isFinalSaved ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-[#5cb800] focus:border-[#5cb800]'
                                    }`}
                                    style={{ overflowWrap: 'anywhere' }}
                                    rows={4}
                                    placeholder={isFinalSaved ? "Evaluación guardada definitivamente" : "Ingrese sus observaciones generales..."}
                                    required
                                  />
                                </div>

                                {/* RECOMENDACIONES */}
                                <div className="col-span-4">
                                  <textarea
                                    value={evaluationRecommendations}
                                    onChange={(e) => setEvaluationRecommendations(e.target.value)}
                                    disabled={isFinalSaved}
                                    className={`w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none break-words whitespace-pre-wrap ${
                                      isFinalSaved ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-[#5cb800] focus:border-[#5cb800]'
                                    }`}
                                    style={{ overflowWrap: 'anywhere' }}
                                    rows={4}
                                    placeholder={isFinalSaved ? "Evaluación guardada definitivamente" : "Ingrese sus recomendaciones..."}
                                    required
                                  />
                                </div>

                                {/* JUICIO DE VALOR */}
                                <div className="col-span-2 flex items-center justify-center">
                                  <select
                                    value={evaluationJudgment}
                                    onChange={(e) => setEvaluationJudgment(e.target.value)}
                                    disabled={isFinalSaved}
                                    className={`w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium ${
                                      isFinalSaved ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-[#5cb800] focus:border-[#5cb800]'
                                    }`}
                                    required
                                  >
                                    <option value="">Seleccionar...</option>
                                    <option value="PENDIENTE">Pendiente</option>
                                    <option value="APROBADO">Aprobado</option>
                                    <option value="NO APROBADO">No Aprobado</option>
                                  </select>
                                </div>

                                {/* ACCIONES */}
                                <div className="col-span-2 flex items-center justify-center space-x-2">
                                  <button
                                    onClick={handleCancelUpdate}
                                    disabled={isFinalSaved}
                                    className={`px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-300 flex items-center space-x-2 text-sm font-medium ${
                                      isFinalSaved ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                  >
                                    <X className="w-4 h-4" />
                                    <span>Cancelar</span>
                                  </button>
                                  <button
                                    onClick={handleCompleteEvaluation}
                                    disabled={isFinalSaved || !evaluationObservations?.trim() || !evaluationRecommendations?.trim() || !evaluationJudgment || evaluationJudgment === "PENDIENTE"}
                                    className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 text-sm font-medium ${(isFinalSaved || !evaluationObservations?.trim() || !evaluationRecommendations?.trim() || !evaluationJudgment || evaluationJudgment === "PENDIENTE")
                                        ? 'bg-gray-400 cursor-not-allowed text-white'
                                        : 'bg-gradient-to-r from-[#5cb800] to-[#8fd400] hover:from-[#4a9600] hover:to-[#7bc300] text-white'
                                      }`}
                                  >
                                    <Save className="w-4 h-4" />
                                    <span>{isFinalSaved ? 'Guardado' : 'Guardar'}</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // Mostrar vista de evaluación completada en formato tabla
                          <div>
                            {/* Estado de la evaluación */}
                            <div className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-800 dark:to-blue-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                              <p className="text-blue-800 dark:text-blue-200 text-center font-medium flex items-center justify-center gap-2">
                                <span className="text-2xl">✅</span>
                                <strong>Evaluación Completada</strong>
                              </p>
                            </div>

                            {/* Headers de la tabla */}
                            <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                              <div className="grid grid-cols-12 gap-4 px-6 py-5 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                <div className="col-span-4 text-left">OBSERVACIONES</div>
                                <div className="col-span-4 text-left">RECOMENDACIONES</div>
                                <div className="col-span-2 text-center">JUICIO DE VALOR</div>
                                <div className="col-span-2 text-center">ACCIONES</div>
                              </div>
                            </div>

                            {/* Contenido de la tabla */}
                            <div className="px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                              <div className="grid grid-cols-12 gap-4 items-start">
                                {/* OBSERVACIONES */}
                                <div className="col-span-4">
                                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
                                    <p className="text-base text-gray-900 dark:text-white leading-relaxed break-words whitespace-pre-wrap overflow-wrap-anywhere evaluation-text">
                                      {selectedEvaluation ? extractGeneralObservationsFromEvaluation(selectedEvaluation) || "Sin observaciones" : "Sin observaciones"}
                                    </p>
                                  </div>
                                </div>

                                {/* RECOMENDACIONES */}
                                <div className="col-span-4">
                                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
                                    <p className="text-base text-gray-900 dark:text-white leading-relaxed break-words whitespace-pre-wrap overflow-wrap-anywhere evaluation-text">
                                      {selectedEvaluation.recommendations || "Sin recomendaciones"}
                                    </p>
                                  </div>
                                </div>

                                {/* JUICIO DE VALOR */}
                                <div className="col-span-2 flex items-center justify-center">
                                  <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                                    selectedEvaluation.valueJudgment === 'APROBADO' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
                                    selectedEvaluation.valueJudgment === 'NO APROBADO' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' :
                                    selectedEvaluation.valueJudgment === 'PENDIENTE' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white' :
                                    'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                                  }`}>
                                    {selectedEvaluation.valueJudgment || "PENDIENTE"}
                                  </span>
                                </div>

                                {/* ACCIONES */}
                                <div className="col-span-2 flex items-center justify-center">
                                  <button
                                    onClick={handleUpdateEvaluationClick}
                                    disabled={isFinalSaved}
                                    className={`px-4 py-2 bg-gradient-to-r from-[#5cb800] to-[#8fd400] hover:from-[#4a9600] hover:to-[#7bc300] text-white rounded-lg transition-all duration-300 flex items-center space-x-2 text-sm font-medium ${
                                      isFinalSaved ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                  >
                                    <Edit className="w-4 h-4" />
                                    <span>{isFinalSaved ? 'Guardada' : 'Actualizar'}</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      ) : (
                        // Vista cuando no hay evaluación
                        <div>
                          {/* Headers de la tabla */}
                          <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                            <div className="grid grid-cols-12 gap-4 px-6 py-5 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                              <div className="col-span-12 text-center">EVALUACIÓN PENDIENTE</div>
                            </div>
                          </div>

                          {/* Contenido de la tabla */}
                          <div className="px-6 py-8 text-center">
                            <div className="space-y-6">
                              <div className="w-16 h-16 bg-gradient-to-r from-[#5cb800] to-[#8fd400] rounded-full flex items-center justify-center mx-auto">
                                <span className="text-white text-2xl">📋</span>
                              </div>
                              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Esta lista no tiene evaluación
                              </h4>
                              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                                Se creará automáticamente una <strong>evaluación única</strong> vinculada a esta lista de chequeo (relación 1:1 en la base de datos). 
                                Complete los campos para establecer la evaluación final.
                              </p>

                              {/* Botón principal para crear evaluación */}
                              <button
                                onClick={handleOpenCreateEvaluationModal}
                                disabled={isFinalSaved}
                                className={`px-8 py-4 bg-gradient-to-r from-[#5cb800] to-[#8fd400] hover:from-[#4a9600] hover:to-[#7bc300] text-white rounded-lg transition-all duration-300 flex items-center space-x-3 mx-auto font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 ${
                                  isFinalSaved ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              >
                                <Save className="w-6 h-6" />
                                <span>{isFinalSaved ? 'Evaluación Guardada' : 'Crear Evaluación'}</span>
                              </button>

                              {/* Botón para volver a seleccionar TeamScrum */}
                              {(isFinalSaved || selectedEvaluation) && (
                                <div className="mt-6">
                                  <button
                                    onClick={handleBackToSelection}
                                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-300 flex items-center space-x-2 mx-auto font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                                  >
                                    <ArrowLeft className="w-5 h-5" />
                                    <span>Evaluar Otro Team Scrum</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sección de Firmas con cards individuales */}
            <div className="mt-12 relative">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Firmas Digitales
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Sube las firmas digitales de los instructores. Las firmas se guardarán automáticamente en la base de datos al subirlas.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Card Instructor Técnico Anterior */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-[#5cb800] to-[#8fd400] rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-3xl">👨‍🏫</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                      Instructor Técnico Anterior
                    </h4>
                  </div>
                  
                  <label className={`flex flex-col items-center p-8 border-2 border-dashed rounded-lg w-full transition-all duration-300 group ${
                    isFinalSaved 
                      ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed opacity-60' 
                      : 'border-gray-300 dark:border-gray-600 cursor-pointer hover:border-[#5cb800] hover:bg-gray-50 dark:hover:bg-gray-700/30'
                  }`}>
                    <UploadCloud className={`w-16 h-16 transition-colors duration-300 mb-4 ${
                      isFinalSaved 
                        ? 'text-gray-300 dark:text-gray-600' 
                        : 'text-gray-400 group-hover:text-[#5cb800]'
                    }`} />
                    <span className={`font-medium text-lg text-center transition-colors duration-300 mb-2 ${
                      isFinalSaved 
                        ? 'text-gray-400 dark:text-gray-500' 
                        : 'text-gray-700 dark:text-gray-300 group-hover:text-[#5cb800]'
                    }`}>
                      {isFinalSaved ? 'Lista Guardada Definitivamente' : 'Subir Firma Digital'}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {isFinalSaved ? 'Firmas bloqueadas' : 'Formatos: JPG, PNG, GIF'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setFirmaAnterior)}
                      disabled={isFinalSaved}
                      className="hidden"
                    />
                  </label>
                  
                  {firmaAnterior && (
                    <div className="mt-6 space-y-3">
                      <div className="flex justify-center">
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm">
                          <Image
                            src={firmaAnterior}
                            alt="Firma instructor anterior"
                            width={200}
                            height={120}
                            className="max-h-32 max-w-full object-contain rounded"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <span className="text-green-600 dark:text-green-400 text-lg">✓</span>
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">
                          Firma guardada exitosamente
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Instructor Técnico Nuevo */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-[#5cb800] to-[#8fd400] rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-3xl">👨‍💼</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                      Instructor Técnico Nuevo
                    </h4>
                  </div>
                  
                  <label className={`flex flex-col items-center p-8 border-2 border-dashed rounded-lg w-full transition-all duration-300 group ${
                    isFinalSaved 
                      ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed opacity-60' 
                      : 'border-gray-300 dark:border-gray-600 cursor-pointer hover:border-[#5cb800] hover:bg-gray-50 dark:hover:bg-gray-700/30'
                  }`}>
                    <UploadCloud className={`w-16 h-16 transition-colors duration-300 mb-4 ${
                      isFinalSaved 
                        ? 'text-gray-300 dark:text-gray-600' 
                        : 'text-gray-400 group-hover:text-[#5cb800]'
                    }`} />
                    <span className={`font-medium text-lg text-center transition-colors duration-300 mb-2 ${
                      isFinalSaved 
                        ? 'text-gray-400 dark:text-gray-500' 
                        : 'text-gray-700 dark:text-gray-300 group-hover:text-[#5cb800]'
                    }`}>
                      {isFinalSaved ? 'Lista Guardada Definitivamente' : 'Subir Firma Digital'}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {isFinalSaved ? 'Firmas bloqueadas' : 'Formatos: JPG, PNG, GIF'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setFirmaNuevo)}
                      disabled={isFinalSaved}
                      className="hidden"
                    />
                  </label>
                  
                  {firmaNuevo && (
                    <div className="mt-6 space-y-3">
                      <div className="flex justify-center">
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm">
                          <Image
                            src={firmaNuevo}
                            alt="Firma instructor nuevo"
                            width={200}
                            height={120}
                            className="max-h-32 max-w-full object-contain rounded"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <span className="text-green-600 dark:text-green-400 text-lg">✓</span>
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">
                          Firma guardada exitosamente
                        </span>
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
                                  : 'border-gray-200 bg-gray-50 dark:bg-gray-700'
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
                              <p className="text-gray-700 dark:text-gray-300 text-sm break-words whitespace-pre-wrap overflow-wrap-anywhere word-break-break-word evaluation-text">
                                {previewData.evaluation.observations || 'Sin observaciones'}
                              </p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Recomendaciones:</h4>
                            <div className="bg-white dark:bg-gray-700 p-3 rounded border border-purple-200 dark:border-purple-600">
                              <p className="text-gray-700 dark:text-gray-300 text-sm break-words whitespace-pre-wrap overflow-wrap-anywhere word-break-break-word evaluation-text">
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

      {/* Modal para crear evaluación con diseño moderno */}
      <Modal
        isOpen={showCreateEvaluationModal}
        onClose={handleCloseCreateEvaluationModal}
        title="Crear Evaluación"
        size="xxl"
      >
        {/* Información del checklist con diseño moderno */}
        <Card
          header={<h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">📋 Lista de Chequeo: {selectedChecklist?.trimester ? `Trimestre ${selectedChecklist.trimester}` : 'Sin trimestre'}</h3>}
          body={<p className="text-gray-700 dark:text-gray-300 text-sm">Complete los siguientes campos para crear la evaluación de esta lista de chequeo.</p>}
          className="mb-6"
        />

        {/* Formulario de evaluación con diseño moderno */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <label className="block text-lg font-semibold text-darkBlue dark:text-white mb-2">
              <span className="flex items-center gap-2">
                📝 Observaciones: <span className="text-red-500">*</span>
              </span>
            </label>
            <textarea
              value={evaluationObservations}
              onChange={(e) => setEvaluationObservations(e.target.value)}
              disabled={isFinalSaved || isCreatingEvaluation}
              className={`w-full px-4 py-4 border-2 border-darkBlue dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-lime-600/30 dark:focus:ring-shadowBlue/30 focus:border-lime-600 dark:focus:border-shadowBlue bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 text-darkBlue dark:text-white shadow-inner transition-all duration-300 resize-vertical break-words overflow-wrap-anywhere ${
                isFinalSaved || isCreatingEvaluation ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              rows={4}
              placeholder="Describa sus observaciones sobre la lista de chequeo..."
              style={{
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'pre-wrap'
              }}
            />
          </div>

          <div className="space-y-4">
            <label className="block text-lg font-semibold text-darkBlue dark:text-white mb-2">
              <span className="flex items-center gap-2">
                💡 Recomendaciones: <span className="text-red-500">*</span>
              </span>
            </label>
            <textarea
              value={evaluationRecommendations}
              onChange={(e) => setEvaluationRecommendations(e.target.value)}
              disabled={isCreatingEvaluation}
              className="w-full px-4 py-4 border-2 border-darkBlue dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-lime-600/30 dark:focus:ring-shadowBlue/30 focus:border-lime-600 dark:focus:border-shadowBlue bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 text-darkBlue dark:text-white shadow-inner transition-all duration-300 resize-vertical break-words overflow-wrap-anywhere"
              rows={4}
              placeholder="Agregue sus recomendaciones..."
              style={{
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'pre-wrap'
              }}
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-lg font-semibold text-darkBlue dark:text-white mb-4">
            <span className="flex items-center gap-2">
              ⚖️ Juicio de Valor: <span className="text-red-500">*</span>
            </span>
          </label>
          <select
            value={evaluationJudgment}
            onChange={(e) => setEvaluationJudgment(e.target.value)}
            disabled={isCreatingEvaluation}
            className="w-full px-6 py-4 border-2 border-darkBlue dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-lime-600/30 dark:focus:ring-shadowBlue/30 focus:border-lime-600 dark:focus:border-shadowBlue bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 text-darkBlue dark:text-white font-semibold text-lg shadow-inner transition-all duration-300"
          >
            <option value="">Seleccione un juicio de valor</option>
            <option value="EXCELENTE">Excelente</option>
            <option value="BUENO">Bueno</option>
            <option value="ACEPTABLE">Aceptable</option>
            <option value="DEFICIENTE">Deficiente</option>
            <option value="RECHAZADO">Rechazado</option>
          </select>
        </div>

        {/* Indicador de progreso con diseño moderno */}
        <Card
          header={<h4 className="font-semibold text-gray-900 dark:text-gray-100">📊 Progreso de Evaluación</h4>}
          body={
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
                <div className={`w-4 h-4 rounded-full ${evaluationObservations?.trim() ? 'bg-green-500' : 'bg-gray-300'} transition-colors duration-300`}></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Observaciones</span>
                {evaluationObservations?.trim() && <span className="text-green-500">✓</span>}
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30">
                <div className={`w-4 h-4 rounded-full ${evaluationRecommendations?.trim() ? 'bg-green-500' : 'bg-gray-300'} transition-colors duration-300`}></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Recomendaciones</span>
                {evaluationRecommendations?.trim() && <span className="text-green-500">✓</span>}
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30">
                <div className={`w-4 h-4 rounded-full ${evaluationJudgment && evaluationJudgment !== '' ? 'bg-green-500' : 'bg-gray-300'} transition-colors duration-300`}></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Juicio de Valor</span>
                {evaluationJudgment && evaluationJudgment !== '' && <span className="text-green-500">✓</span>}
              </div>
            </div>
          }
          className="mb-6"
        />

        {/* Botones de acción con diseño moderno */}
        <div className="flex justify-center space-x-6 mt-8">
          <button
            onClick={handleCloseCreateEvaluationModal}
            disabled={isCreatingEvaluation}
            className={`px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-2xl transition-all duration-300 flex items-center space-x-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 ${
              isCreatingEvaluation ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <X className="w-5 h-5" />
            <span>Cancelar</span>
          </button>
          <button
            onClick={handleCreateEvaluationFromModal}
            disabled={isCreatingEvaluation || !evaluationObservations?.trim() || !evaluationRecommendations?.trim() || !evaluationJudgment}
            className={`px-8 py-4 rounded-2xl transition-all duration-300 flex items-center space-x-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 ${(isCreatingEvaluation || !evaluationObservations?.trim() || !evaluationRecommendations?.trim() || !evaluationJudgment)
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue hover:from-lime-500 hover:to-lime-600 dark:hover:from-darkBlue dark:hover:to-shadowBlue text-white'
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
      </Modal>
    </div>
  );
}
