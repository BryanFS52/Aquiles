import { toast } from "react-toastify";
import { evaluationService } from "@redux/slices/evaluationSlice";
import { fetchChecklists } from "@redux/slices/checklistSlice";
import { exportService } from "@redux/slices/exportSlice";
import { client } from '@lib/apollo-client';
import { GET_ALL_CHECKLISTS } from '@graphql/checklistGraph';
import {
  Checklist,
  Evaluation,
} from "@graphql/generated";

export class InstructorChecklistLogic {
  // Función para cargar firmas existentes desde el checklist
  static loadExistingSignatures = (
    checklist: Checklist,
    setFirmaAnterior: (firma: string | null) => void,
    setFirmaNuevo: (firma: string | null) => void
  ): void => {
    // Limpiar firmas primero
    setFirmaAnterior(null);
    setFirmaNuevo(null);
    
    try {
      if (checklist.instructorSignature && 
          checklist.instructorSignature !== "No signature" && 
          checklist.instructorSignature.trim() !== "") {
        
        // Intentar parsear como JSON
        const signatures = JSON.parse(checklist.instructorSignature);
        
        // Si es un objeto con firmas separadas
        if (typeof signatures === 'object' && signatures !== null) {
          if (signatures.anterior) {
            // Si es base64 puro, agregar prefijo para mostrar
            const anteriorImage = signatures.anterior.startsWith('data:') 
              ? signatures.anterior 
              : `data:image/jpeg;base64,${signatures.anterior}`;
            setFirmaAnterior(anteriorImage);
          }
          
          if (signatures.nuevo) {
            // Si es base64 puro, agregar prefijo para mostrar
            const nuevoImage = signatures.nuevo.startsWith('data:') 
              ? signatures.nuevo 
              : `data:image/jpeg;base64,${signatures.nuevo}`;
            setFirmaNuevo(nuevoImage);
          }
        }
      }
    } catch (error) {
      // Si no es JSON válido, puede ser formato legacy o datos corruptos
    }
  };

  // Funciones auxiliares para extraer y estructurar datos de evaluaciones
  static extractItemStatesFromEvaluation = (evaluation: Evaluation) => {
    const checklistId = evaluation.checklistId;
    
    // Primero intentar cargar desde observaciones (formato legacy con JSON)
    if (evaluation.observations) {
      try {
        const parsed = JSON.parse(evaluation.observations);
        
        if (parsed.itemStates && typeof parsed.itemStates === 'object') {
          // Guardar en localStorage para futuras cargas (migración a nuevo formato)
          if (checklistId) {
            localStorage.setItem(`itemStates_${checklistId}`, JSON.stringify(parsed.itemStates));
          }
          return parsed.itemStates;
        }
      } catch (error) {
        // No es JSON, es el nuevo formato de texto plano
      }
    }
    
    // Si no hay datos en formato legacy, intentar cargar desde localStorage
    if (checklistId) {
      const storedStates = localStorage.getItem(`itemStates_${checklistId}`);
      if (storedStates) {
        try {
          const parsedStates = JSON.parse(storedStates);
          return parsedStates;
        } catch (error) {
          // Error parsing localStorage item states
        }
      }
    }
    
    return {};
  };

  static extractGeneralObservationsFromEvaluation = (evaluation: Evaluation) => {
    if (!evaluation.observations) return "";

    // Si las observaciones no contienen caracteres JSON, asumir que son texto plano (nuevo formato)
    if (!evaluation.observations.includes('{') && !evaluation.observations.includes('"')) {
      return evaluation.observations.trim();
    }

    try {
      const parsed = JSON.parse(evaluation.observations);
      if (parsed.generalObservations && typeof parsed.generalObservations === 'string') {
        // Formato anterior: devolver el texto de generalObservations
        return parsed.generalObservations.trim();
      }
      
      // Si no tiene generalObservations pero es JSON válido, devolver cadena vacía
      if (typeof parsed === 'object') {
        return "";
      }
    } catch (error) {
      // Si no se puede parsear como JSON pero contiene formato JSON, probablemente sea datos corruptos
      if (evaluation.observations.includes('itemStates') || 
          evaluation.observations.includes('generalObservations') || 
          evaluation.observations.startsWith('{')) {
        // Es formato JSON pero no se pudo parsear, devolver cadena vacía
        return "";
      }
      
      // Es texto plano, usar el valor completo (nuevo formato)
      return evaluation.observations.trim();
    }

    // Por defecto, devolver el texto completo si no es JSON válido
    return evaluation.observations.trim();
  };

  // Cargar listas de chequeo activas
  static loadActiveChecklists = async (
    selectedChecklist: Checklist | null,
    setLoading: (loading: boolean) => void,
    setActiveChecklists: (checklists: Checklist[]) => void,
    setSelectedChecklist: (checklist: Checklist | null) => void,
    loadExistingSignatures: (checklist: Checklist) => void,
    loadEvaluationsForChecklist: (id: number) => Promise<void>
  ): Promise<void> => {
    try {
      setLoading(true);
      
      // Obtener la ficha del instructor desde localStorage
      const instructorStudySheetId = localStorage.getItem('selectedStudySheetId');
      const instructorStudySheetNumber = localStorage.getItem('selectedStudySheetNumber');
      
      const response = await fetchChecklists.arguments(0, 5);

      const checklistData = response.data?.allChecklists;
      if (checklistData?.code === "200" && checklistData.data) {
        // Filtrar solo las listas activas
        let activeLists = checklistData.data.filter((checklist: Checklist) => checklist.state === true);
        
        // Si el instructor tiene una ficha asignada, filtrar por esa ficha
        if (instructorStudySheetId) {
          activeLists = activeLists.filter((checklist: Checklist) => {
            if (!checklist.studySheets) {
              return false;
            }
            
            // studySheets es un string con IDs separados por comas
            const assignedSheets = checklist.studySheets.split(',').map((s: string) => s.trim());
            const isAssigned = assignedSheets.includes(instructorStudySheetId);
            
            return isAssigned;
          });
        }

        setActiveChecklists(activeLists);
        if (activeLists.length > 0 && !selectedChecklist) {
          const firstChecklist = activeLists[0];
          setSelectedChecklist(firstChecklist);
          loadExistingSignatures(firstChecklist);
          
          // Cargar automáticamente las evaluaciones del primer checklist
          await loadEvaluationsForChecklist(parseInt(firstChecklist.id));
        } else if (activeLists.length === 0 && instructorStudySheetId) {
          toast.info(`No hay listas de chequeo asignadas a tu ficha de formación (Ficha ${instructorStudySheetNumber})`);
        }
        
        // Si había un checklist seleccionado previamente, mantenerlo
        const savedChecklistId = localStorage.getItem('selectedChecklistId');
        if (savedChecklistId) {
          const savedChecklist = activeLists.find((cl: Checklist) => cl.id === savedChecklistId);
          if (savedChecklist) {
            setSelectedChecklist(savedChecklist);
            loadExistingSignatures(savedChecklist);
            await loadEvaluationsForChecklist(parseInt(savedChecklistId));
          }
        }
      }
    } catch (error) {
      toast.error("Error al cargar las listas de chequeo activas");
    } finally {
      setLoading(false);
    }
  };

  // Cargar evaluaciones para un checklist específico
  static loadEvaluationsForChecklist = async (
    checklistId: number,
    setEvaluations: (evaluations: Evaluation[]) => void,
    setSelectedEvaluation: (evaluation: Evaluation | null) => void,
    setEvaluationObservations: (observations: string) => void,
    setEvaluationRecommendations: (recommendations: string) => void,
    setEvaluationJudgment: (judgment: string) => void,
    setItemStates: (states: any) => void,
    extractItemStatesFromEvaluation: (evaluation: Evaluation) => any,
    extractGeneralObservationsFromEvaluation: (evaluation: Evaluation) => string
  ): Promise<void> => {
    try {
      const evaluationsResponse = await evaluationService.fetchEvaluationsByChecklist(checklistId);

      if (evaluationsResponse && evaluationsResponse.code === "200") {
        if (evaluationsResponse.data && evaluationsResponse.data.length > 0) {
          setEvaluations(evaluationsResponse.data);
          const firstEvaluation = evaluationsResponse.data[0];
          setSelectedEvaluation(firstEvaluation);
          
          // Extraer datos de la evaluación
          const extractedItemStates = extractItemStatesFromEvaluation(firstEvaluation);
          const extractedObservations = extractGeneralObservationsFromEvaluation(firstEvaluation);
          
          setItemStates(extractedItemStates);
          setEvaluationObservations(extractedObservations);
          setEvaluationRecommendations(firstEvaluation.recommendations || "");
          setEvaluationJudgment(firstEvaluation.valueJudgment || "PENDIENTE");
          
          // Asegurar que los datos se persistan en localStorage para futuras cargas
          if (Object.keys(extractedItemStates).length > 0) {
            localStorage.setItem(`itemStates_${checklistId}`, JSON.stringify(extractedItemStates));
          }
          
          return;
        }
      }

      // No se encontraron evaluaciones
      setEvaluations([]);
      setSelectedEvaluation(null);
      setEvaluationObservations("");
      setEvaluationRecommendations("");
      setEvaluationJudgment("PENDIENTE");
      setItemStates({});

    } catch (error) {
      setEvaluations([]);
      setSelectedEvaluation(null);
      setEvaluationObservations("");
      setEvaluationRecommendations("");
      setEvaluationJudgment("PENDIENTE");
      setItemStates({});
    }
  };

  // Convertir archivo a base64 sin el prefijo data:
  static convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = (e.target?.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = () => reject(new Error('Error al convertir archivo'));
      reader.readAsDataURL(file);
    });
  };

  // Exportar PDF
  static exportToPDF = async (selectedChecklist: Checklist): Promise<void> => {
    if (!selectedChecklist) return;
    try {
      toast.info("📄 Generando PDF...");
      const base64Data = await exportService.exportChecklistToPdf(parseInt(selectedChecklist.id));
      const fileName = `checklist_${selectedChecklist.id}_trimestre_${selectedChecklist.trimester || 'NA'}.pdf`;
      exportService.downloadFileFromBase64(base64Data, fileName, 'application/pdf');
      toast.success("📥 PDF descargado exitosamente");
    } catch (error) {
      toast.error("Error al exportar a PDF");
    }
  };

  // Exportar Excel
  static exportToExcel = async (selectedChecklist: Checklist): Promise<void> => {
    if (!selectedChecklist) return;
    try {
      toast.info("📊 Generando Excel...");
      const base64Data = await exportService.exportChecklistToExcel(parseInt(selectedChecklist.id));
      const fileName = `checklist_${selectedChecklist.id}_trimestre_${selectedChecklist.trimester || 'NA'}.xlsx`;
      exportService.downloadFileFromBase64(base64Data, fileName, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      toast.success("📥 Excel descargado exitosamente");
    } catch (error) {
      toast.error("Error al exportar a Excel");
    }
  };
}
