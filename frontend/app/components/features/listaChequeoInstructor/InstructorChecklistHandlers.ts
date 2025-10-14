import { toast } from "react-toastify";
import { evaluationService } from "@redux/slices/evaluationSlice";
import { client } from "@lib/apollo-client";
import { GET_CHECKLIST_BY_ID } from "@graphql/checklistGraph";
import { InstructorChecklistLogic } from "@components/features/listaChequeoInstructor/InstructorChecklistLogic";
import {
  Checklist,
  Evaluation,
} from "@graphql/generated";

export class InstructorChecklistHandlers {
  // Handler para cambio de trimestre
  static handleTrimesterChange = (
    value: string,
    setSelectedTrimester: (trimester: string) => void,
    setCurrentPage: (page: number) => void
  ): void => {
    setSelectedTrimester(value);
    localStorage.setItem('selectedTrimester', value);
    setCurrentPage(1);
  };

  // Handler para cambio de checklist
  static handleChecklistChange = async (
    checklistId: string,
    activeChecklists: Checklist[],
    setCurrentPage: (page: number) => void,
    setItemStates: (states: any) => void,
    setSelectedChecklist: (checklist: Checklist | null) => void,
    setFirmaAnterior: (firma: string | null) => void,
    setFirmaNuevo: (firma: string | null) => void,
    setEvaluations: (evaluations: Evaluation[]) => void,
    setSelectedEvaluation: (evaluation: Evaluation | null) => void,
    setEvaluationObservations: (observations: string) => void,
    setEvaluationRecommendations: (recommendations: string) => void,
    setEvaluationJudgment: (judgment: string) => void,
    setIsFinalSaved: (saved: boolean) => void,
    loadExistingSignatures: (checklist: Checklist) => void,
    loadEvaluationsForChecklist: (id: number) => Promise<void>
  ): Promise<void> => {
    const checklist = activeChecklists.find((cl: Checklist) => cl.id === checklistId);
    setCurrentPage(1);
    setItemStates({});

    if (checklistId && checklistId !== "") {
      localStorage.setItem('selectedChecklistId', checklistId);
      
      try {
        const { data } = await client.query({
          query: GET_CHECKLIST_BY_ID,
          variables: { id: parseInt(checklistId) }
        });

        if (data?.checklistById?.code === "200" && data?.checklistById?.data) {
          setSelectedChecklist(data.checklistById.data);
          loadExistingSignatures(data.checklistById.data);
          
          // Verificar si tenemos una evaluación guardada localmente
          const localEvaluationData = localStorage.getItem(`evaluationData_${checklistId}`);
          const localItemStates = localStorage.getItem(`itemStates_${checklistId}`);
          const isFinalSaved = localStorage.getItem(`isFinalSaved_${checklistId}`) === 'true';
          
          setIsFinalSaved(isFinalSaved);
          
          if (localEvaluationData && !isFinalSaved) {
            try {
              const parsedData = JSON.parse(localEvaluationData);
              setEvaluationObservations(parsedData.observations || "");
              setEvaluationRecommendations(parsedData.recommendations || "");
              setEvaluationJudgment(parsedData.judgment || "PENDIENTE");
            } catch (error) {
              console.error("Error parsing local evaluation data:", error);
            }
          }
          
          if (localItemStates && !isFinalSaved) {
            try {
              const parsedStates = JSON.parse(localItemStates);
              setItemStates(parsedStates);
            } catch (error) {
              console.error("Error parsing local item states:", error);
            }
          }
          
          // Cargar evaluaciones desde la base de datos
          await loadEvaluationsForChecklist(parseInt(checklistId));
        } else {
          setSelectedChecklist(checklist || null);
          if (checklist) {
            loadExistingSignatures(checklist);
            await loadEvaluationsForChecklist(parseInt(checklistId));
          }
        }
      } catch (error) {
        console.error("Error loading checklist details:", error);
        setSelectedChecklist(checklist || null);
        if (checklist) {
          loadExistingSignatures(checklist);
          await loadEvaluationsForChecklist(parseInt(checklistId));
        }
      }
    } else {
      localStorage.removeItem('selectedChecklistId');
      setSelectedChecklist(null);
      setFirmaAnterior(null);
      setFirmaNuevo(null);
      setEvaluations([]);
      setSelectedEvaluation(null);
      setEvaluationObservations("");
      setEvaluationRecommendations("");
      setEvaluationJudgment("PENDIENTE");
    }
  };

  // Handler para cambio de items
  static handleItemChange = (
    id: number,
    field: string,
    value: any,
    itemStates: any,
    setItemStates: (states: any) => void,
    isFinalSaved: boolean,
    selectedChecklist: Checklist | null,
    setPendingChanges: (pending: boolean) => void,
    saveItemsDebounceRef: React.MutableRefObject<NodeJS.Timeout | null>,
    selectedEvaluation: Evaluation | null,
    handleAutoSaveItems: (states: any) => Promise<void>
  ): void => {
    const updatedStates = {
      ...itemStates,
      [id]: {
        ...itemStates[id],
        [field]: value
      }
    };
    
    setItemStates(updatedStates);
    
    // Guardar en localStorage si no está guardado definitivamente
    if (!isFinalSaved && selectedChecklist) {
      localStorage.setItem(`itemStates_${selectedChecklist.id}`, JSON.stringify(updatedStates));
      setPendingChanges(true);
      
      // Auto-save con debounce
      if (saveItemsDebounceRef.current) {
        clearTimeout(saveItemsDebounceRef.current);
      }
      
      saveItemsDebounceRef.current = setTimeout(async () => {
        if (selectedEvaluation) {
          await handleAutoSaveItems(updatedStates);
        }
      }, 2000);
    }
  };

  // Auto-save de items cuando hay evaluación existente
  static handleAutoSaveItems = async (
    currentItemStates: any,
    selectedEvaluation: Evaluation | null,
    selectedChecklist: Checklist | null,
    evaluationObservations: string,
    evaluationRecommendations: string,
    evaluationJudgment: string,
    setIsSavingItems: (saving: boolean) => void,
    setPendingChanges: (pending: boolean) => void
  ): Promise<void> => {
    if (!selectedEvaluation || !selectedChecklist) return;
    
    try {
      setIsSavingItems(true);
      
      // Guardar solo las observaciones generales como texto plano
      // Los estados de items se manejan separadamente en el frontend
      const observationsToSave = evaluationObservations.trim();
      
      // Guardar estados de items en localStorage para persistencia
      localStorage.setItem(`itemStates_${selectedChecklist.id}`, JSON.stringify(currentItemStates));
      
      const updateResponse = await evaluationService.completeEvaluation(
        parseInt(selectedEvaluation.id || "0"),
        observationsToSave,
        evaluationRecommendations,
        evaluationJudgment
      );
      
      if (updateResponse && updateResponse.code === "200") {
        console.log('✅ Items auto-saved successfully');
        console.log('💾 Item states saved to localStorage');
        setPendingChanges(false);
      }
    } catch (error) {
      console.error("Error auto-saving items:", error);
    } finally {
      setIsSavingItems(false);
    }
  };

  // Handler para completar evaluación
  static handleCompleteEvaluation = async (
    selectedEvaluation: Evaluation | null,
    selectedChecklist: Checklist | null,
    evaluationObservations: string,
    evaluationRecommendations: string,
    evaluationJudgment: string,
    itemStates: any,
    setSelectedEvaluation: (evaluation: Evaluation) => void,
    setEvaluations: (evaluations: Evaluation[]) => void,
    setShowEvaluationForm: (show: boolean) => void,
    setPendingChanges: (pending: boolean) => void
  ): Promise<void> => {
    if (!selectedEvaluation || !selectedChecklist) {
      toast.error("No hay evaluación o checklist seleccionado");
      return;
    }

    if (!evaluationObservations.trim() || !evaluationRecommendations.trim()) {
      toast.error("Por favor complete las observaciones y recomendaciones");
      return;
    }

    if (!evaluationJudgment || evaluationJudgment === "PENDIENTE") {
      toast.error("Por favor seleccione un juicio de valor");
      return;
    }

    try {
      toast.info("💾 Guardando evaluación...");
      
      // Guardar solo las observaciones generales como texto plano
      // Los estados de items se manejan separadamente en el frontend
      const observationsToSave = evaluationObservations.trim();

      // Guardar estados de items en localStorage para persistencia
      localStorage.setItem(`itemStates_${selectedChecklist.id}`, JSON.stringify(itemStates));

      const response = await evaluationService.completeEvaluation(
        parseInt(selectedEvaluation.id || "0"),
        observationsToSave,
        evaluationRecommendations,
        evaluationJudgment
      );

      if (response && response.code === "200") {
        toast.success("✅ Evaluación actualizada exitosamente");
        
        // Actualizar el objeto de evaluación local
        const updatedEvaluation = {
          ...selectedEvaluation,
          observations: observationsToSave,
          recommendations: evaluationRecommendations,
          valueJudgment: evaluationJudgment
        };
        
        setSelectedEvaluation(updatedEvaluation);
        setEvaluations([updatedEvaluation]);
        
        // Limpiar localStorage después del guardado exitoso
        if (selectedChecklist) {
          localStorage.removeItem(`evaluationData_${selectedChecklist.id}`);
          localStorage.removeItem(`itemStates_${selectedChecklist.id}`);
        }
        
        setShowEvaluationForm(false);
        setPendingChanges(false);
      } else {
        throw new Error(response?.message || "Error al guardar la evaluación");
      }
    } catch (error: any) {
      console.error("Error completing evaluation:", error);
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        toast.error(`❌ Error: ${error.graphQLErrors[0].message}`);
      } else if (error.networkError) {
        toast.error(`❌ Error de red: ${error.networkError.message}`);
      } else {
        toast.error(`❌ Error: ${error.message || 'Error desconocido'}`);
      }
    }
  };

  // Handler para crear evaluación desde modal
  static handleCreateEvaluationFromModal = async (
    selectedChecklist: Checklist | null,
    evaluationObservations: string,
    evaluationRecommendations: string,
    evaluationJudgment: string,
    itemStates: any,
    selectedTeamScrumId: string | null,
    setIsCreatingEvaluation: (creating: boolean) => void,
    setSelectedEvaluation: (evaluation: any) => void,
    setEvaluations: (evaluations: any[]) => void,
    setShowCreateEvaluationModal: (show: boolean) => void,
    setPendingChanges: (pending: boolean) => void
  ): Promise<void> => {
    if (!selectedChecklist) {
      toast.error("No hay ninguna lista de chequeo seleccionada");
      return;
    }

    if (!selectedTeamScrumId) {
      toast.error("Por favor seleccione un Team Scrum antes de crear la evaluación");
      return;
    }

    if (!evaluationObservations.trim() || !evaluationRecommendations.trim()) {
      toast.error("Por favor complete las observaciones y recomendaciones");
      return;
    }

    if (!evaluationJudgment || evaluationJudgment === "PENDIENTE") {
      toast.error("Por favor seleccione un juicio de valor");
      return;
    }

    setIsCreatingEvaluation(true);
    try {
      toast.info("🚀 Creando evaluación...");

      const teamScrumIdNumber = selectedTeamScrumId ? parseInt(selectedTeamScrumId) : undefined;
      
      if (!teamScrumIdNumber) {
        toast.error("ID de Team Scrum inválido");
        setIsCreatingEvaluation(false);
        return;
      }

      const newEvaluationResult = await evaluationService.createEvaluationForChecklist(
        parseInt(selectedChecklist.id), 
        teamScrumIdNumber
      );

      if (newEvaluationResult && newEvaluationResult.code === "200" && newEvaluationResult.id) {
        // Guardar solo las observaciones generales como texto plano
        // Los estados de items se manejan separadamente en el frontend
        const observationsToSave = evaluationObservations.trim();

        // Guardar estados de items en localStorage para persistencia
        localStorage.setItem(`itemStates_${selectedChecklist.id}`, JSON.stringify(itemStates));

        const completeResult = await evaluationService.completeEvaluation(
          parseInt(newEvaluationResult.id),
          observationsToSave,
          evaluationRecommendations,
          evaluationJudgment
        );

        if (completeResult && completeResult.code === "200") {
          const newEvaluationObject = {
            id: newEvaluationResult.id,
            checklistId: parseInt(selectedChecklist.id),
            observations: observationsToSave,
            recommendations: evaluationRecommendations,
            valueJudgment: evaluationJudgment,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          setSelectedEvaluation(newEvaluationObject);
          setEvaluations([newEvaluationObject]);

          // Limpiar localStorage después del guardado exitoso
          if (selectedChecklist) {
            localStorage.removeItem(`evaluationData_${selectedChecklist.id}`);
            localStorage.removeItem(`itemStates_${selectedChecklist.id}`);
          }

          toast.success("✅ Evaluación creada exitosamente");
          setShowCreateEvaluationModal(false);
          setPendingChanges(false);
        } else {
          throw new Error(completeResult?.message || "Error al completar la evaluación");
        }
      } else {
        throw new Error(newEvaluationResult?.message || "Error al crear evaluación");
      }
    } catch (error: any) {
      console.error('❌ Error creating evaluation from modal:', error);
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        toast.error(`❌ Error: ${error.graphQLErrors[0].message}`);
      } else if (error.networkError) {
        toast.error(`❌ Error de red: ${error.networkError.message}`);
      } else {
        toast.error(`❌ Error: ${error.message || 'Error desconocido'}`);
      }
    } finally {
      setIsCreatingEvaluation(false);
    }
  };

  // Handler para cambio de campos de evaluación
  static handleEvaluationFieldChange = (
    field: string,
    value: string,
    setEvaluationObservations: (observations: string) => void,
    setEvaluationRecommendations: (recommendations: string) => void,
    setEvaluationJudgment: (judgment: string) => void,
    isFinalSaved: boolean,
    selectedChecklist: Checklist | null,
    evaluationObservations: string,
    evaluationRecommendations: string,
    evaluationJudgment: string,
    setPendingChanges: (pending: boolean) => void
  ) => {
    switch (field) {
      case 'observations':
        setEvaluationObservations(value);
        break;
      case 'recommendations':
        setEvaluationRecommendations(value);
        break;
      case 'judgment':
        setEvaluationJudgment(value);
        break;
    }
    
    // Guardar en localStorage si no está guardado definitivamente
    if (!isFinalSaved && selectedChecklist) {
      const evaluationData = {
        observations: field === 'observations' ? value : evaluationObservations,
        recommendations: field === 'recommendations' ? value : evaluationRecommendations,
        judgment: field === 'judgment' ? value : evaluationJudgment
      };
      localStorage.setItem(`evaluationData_${selectedChecklist.id}`, JSON.stringify(evaluationData));
      setPendingChanges(true);
    }
  };

  // Handler para subida de archivos
  static handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<string | null>>,
    isFinalSaved: boolean
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (isFinalSaved) {
      toast.error("No se pueden subir firmas. La lista ha sido guardada definitivamente");
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error("Por favor seleccione un archivo de imagen válido");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("El archivo no puede ser mayor a 5MB");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFile(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      const base64Data = await InstructorChecklistLogic.convertFileToBase64(file);
      // Implement signature saving logic here
      
    } catch (error) {
      console.error('Error procesando archivo:', error);
      toast.error("Error al procesar el archivo de imagen");
    }
  };
}
