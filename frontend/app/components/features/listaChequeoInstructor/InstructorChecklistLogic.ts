import { toast } from "react-toastify";
import { evaluationService } from "@redux/slices/evaluationSlice";
import { checkListService } from "@redux/slices/checklistSlice";
import { exportService } from "@redux/slices/exportSlice";
import {
  Checklist,
  Evaluation,
} from "@/types/checklist";

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
      console.log("No se pudo parsear firmas como JSON, iniciando limpio:", error);
    }
  };

  // Funciones auxiliares para extraer y estructurar datos de evaluaciones
  static extractItemStatesFromEvaluation = (evaluation: Evaluation) => {
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
      console.log('❌ Error parsing observations as JSON:', error instanceof Error ? error.message : String(error));
      console.log('Raw observations text:', evaluation.observations);
    }

    return {};
  };

  static extractGeneralObservationsFromEvaluation = (evaluation: Evaluation) => {
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
      console.log("🔍 Instructor study sheet:", { id: instructorStudySheetId, number: instructorStudySheetNumber });
      
      const response = await checkListService.fetchAllChecklists(0, 100);
      console.log("Raw checklists response:", response);

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

        setActiveChecklists(activeLists);
        if (activeLists.length > 0 && !selectedChecklist) {
          setSelectedChecklist(activeLists[0]);
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
      console.error("Error loading active checklists:", error);
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
      console.log("=== LOADING EVALUATIONS FROM DATABASE ===");
      console.log("Checklist ID:", checklistId, "Type:", typeof checklistId);

      const evaluationsResponse = await evaluationService.fetchEvaluationsByChecklist(checklistId);
      console.log("🔍 Raw evaluations response:", evaluationsResponse);

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
          
          console.log("✅ Evaluation loaded successfully");
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
      console.error("❌ Error loading evaluations:", error);
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
      console.error("Error exporting PDF:", error);
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
      console.error("Error exporting Excel:", error);
      toast.error("Error al exportar a Excel");
    }
  };
}
