import { clientLAN } from '@/lib/apollo-client';
import {
  GET_ALL_EVALUATIONS,
  GET_EVALUATION_BY_ID,
  GET_EVALUATIONS_BY_CHECKLIST,
  ADD_EVALUATION,
  UPDATE_EVALUATION,
  DELETE_EVALUATION,
} from '@graphql/evaluationsGraph';
import { 
  EvaluationPage,
  EvaluationPageId,
  EvaluationDto,
  ApiResponse,
  Evaluation
} from '@/types/checklist';

// Función de utilidad para comparar IDs de forma segura
function safeIdComparison(id1: any, id2: any): boolean {
  if (id1 == null || id2 == null) return false;
  
  // Comparación por string (más segura)
  const stringMatch = id1.toString() === id2.toString();
  
  // Comparación numérica como respaldo
  const numericMatch = parseInt(id1) === parseInt(id2) && !isNaN(parseInt(id1)) && !isNaN(parseInt(id2));
  
  return stringMatch || numericMatch;
}

// Función para crear una evaluación automáticamente al crear una lista de chequeo
export const createEvaluationForChecklist = async (
  checklistId: number, 
  checklistData?: any,
  teamScrumId?: number
): Promise<ApiResponse> => {
  try {
    // Asegurar que checklistId es un número entero válido
    const numericChecklistId = parseInt(checklistId.toString());
    console.log('Original checklistId:', checklistId, 'Type:', typeof checklistId);
    console.log('Numeric checklistId:', numericChecklistId, 'Type:', typeof numericChecklistId);
    
    const evaluationInput: EvaluationDto = {
      observations: "", // Iniciar como string vacío en lugar de null
      recommendations: "", // Iniciar como string vacío en lugar de null
      valueJudgment: "PENDIENTE", // Usar valor por defecto más específico
      checklistId: numericChecklistId, // Asegurar que sea un número entero
      teamScrumId: teamScrumId || undefined // Agregar teamScrumId si está disponible
    };

    console.log('Creating evaluation with input:', evaluationInput);
    console.log('Input checklistId type:', typeof evaluationInput.checklistId);

    const { data } = await clientLAN.mutate({
      mutation: ADD_EVALUATION,
      variables: { input: evaluationInput },
    });

    console.log('Evaluation creation response:', data);
    
    // Verificar la respuesta
    if (data && data.addEvaluation) {
      if (data.addEvaluation.code === "200") {
        console.log('✅ Evaluation created successfully with ID:', data.addEvaluation.id);
        console.log('Evaluation linked to checklistId:', numericChecklistId);
        
        // Verificar que la evaluación se creó correctamente consultándola
        if (data.addEvaluation.id) {
          try {
            console.log('Verifying created evaluation...');
            const verification = await fetchEvaluationById(parseInt(data.addEvaluation.id));
            console.log('Verification response:', verification);
            if (verification && verification.data) {
              console.log('✅ Verification successful - Evaluation checklistId:', verification.data.checklistId);
            }
          } catch (verifyError) {
            console.warn('Verification failed, but evaluation was created:', verifyError);
          }
        }
        
        return data.addEvaluation;
      } else {
        console.error('❌ Evaluation creation failed with code:', data.addEvaluation.code);
        console.error('Error message:', data.addEvaluation.message);
        throw new Error(`Error creating evaluation: ${data.addEvaluation.message}`);
      }
    } else {
      console.error('❌ Unexpected response format:', data);
      throw new Error('Unexpected response format from evaluation creation');
    }
  } catch (error: any) {
    console.error('❌ Error creating evaluation:', error);
    console.error('Error details:', error.message);
    if (error.graphQLErrors) {
      console.error('GraphQL Errors:', error.graphQLErrors);
    }
    if (error.networkError) {
      console.error('Network Error:', error.networkError);
    }
    throw error;
  }
};

// Función para obtener evaluaciones por checklist ID
export const fetchEvaluationsByChecklist = async (checklistId: number): Promise<EvaluationPage> => {
  try {
    console.log('🔍 Fetching evaluations for checklist ID:', checklistId, 'Type:', typeof checklistId);
    
    // Usar la nueva query específica
    const { data } = await clientLAN.query({
      query: GET_EVALUATIONS_BY_CHECKLIST,
      variables: { checklistId },
      fetchPolicy: 'no-cache',
    });
    
    console.log('📊 Raw evaluations response:', data);
    
    // Filtrar por checklistId usando comparación segura
    if (data.allEvaluations && data.allEvaluations.data) {
      const allEvaluations = data.allEvaluations.data;
      console.log('📝 Total evaluations to filter:', allEvaluations.length);
      
      // Log detallado de cada evaluación antes del filtrado
      allEvaluations.forEach((evaluation: any, index: number) => {
        console.log(`  Evaluation ${index + 1}: ID=${evaluation.id}, ChecklistId=${evaluation.checklistId} (${typeof evaluation.checklistId})`);
      });
      
      const filteredEvaluations = allEvaluations.filter((evaluation: Evaluation) => {
        const isMatch = safeIdComparison(evaluation.checklistId, checklistId);
        console.log(`🔍 Comparing evaluation ${evaluation.id}: checklistId=${evaluation.checklistId} vs target=${checklistId} → Match: ${isMatch}`);
        return isMatch;
      });
      
      console.log(`✅ Filtered evaluations found: ${filteredEvaluations.length}`);
      filteredEvaluations.forEach((evaluation: any, index: number) => {
        console.log(`  Match ${index + 1}: Evaluation ID=${evaluation.id}, ChecklistId=${evaluation.checklistId}, Status=${evaluation.valueJudgment}`);
      });
      
      return {
        ...data.allEvaluations,
        data: filteredEvaluations
      };
    }
    return data.allEvaluations;
  } catch (error) {
    console.error('❌ Error fetching evaluations by checklist:', error);
    throw error;
  }
};

// Función original mantenida para compatibilidad
export const fetchEvaluationsByChecklistOld = async (checklistId: number): Promise<EvaluationPage> => {
  try {
    console.log('🔍 [OLD] Fetching evaluations for checklist ID:', checklistId, 'Type:', typeof checklistId);
    
    const { data } = await clientLAN.query({
      query: GET_ALL_EVALUATIONS,
      variables: { page: 0, size: 100 }, // Obtener todas las evaluaciones
      fetchPolicy: 'no-cache',
    });
    
    console.log('📊 [OLD] All evaluations response:', data);
    
    // Filtrar por checklistId usando comparación segura
    if (data.allEvaluations && data.allEvaluations.data) {
      const allEvaluations = data.allEvaluations.data;
      console.log('📝 [OLD] Total evaluations to filter:', allEvaluations.length);
      
      const filteredEvaluations = allEvaluations.filter((evaluation: Evaluation) => {
        const isMatch = safeIdComparison(evaluation.checklistId, checklistId);
        console.log(`🔍 [OLD] Comparing evaluation ${evaluation.id}: checklistId=${evaluation.checklistId} vs target=${checklistId} → Match: ${isMatch}`);
        return isMatch;
      });
      
      console.log(`✅ [OLD] Filtered evaluations found: ${filteredEvaluations.length}`);
      
      return {
        ...data.allEvaluations,
        data: filteredEvaluations
      };
    }
    return data.allEvaluations;
  } catch (error) {
    console.error('❌ [OLD] Error fetching evaluations by checklist:', error);
    throw error;
  }
};

// Función para obtener una evaluación por ID
export const fetchEvaluationById = async (id: number): Promise<EvaluationPageId> => {
  try {
    const { data } = await clientLAN.query({
      query: GET_EVALUATION_BY_ID,
      variables: { id },
      fetchPolicy: 'no-cache',
    });
    return data.evaluationById;
  } catch (error) {
    console.error('Error fetching evaluation by ID:', error);
    throw error;
  }
};

// Función para actualizar una evaluación
export const updateEvaluation = async (
  id: number, 
  evaluationData: EvaluationDto
): Promise<ApiResponse> => {
  try {
    const { data } = await clientLAN.mutate({
      mutation: UPDATE_EVALUATION,
      variables: { id, input: evaluationData },
    });
    return data.updateEvaluation;
  } catch (error) {
    console.error('Error updating evaluation:', error);
    throw error;
  }
};

// Función para crear una evaluación si no existe para un checklist específico
export const createMissingEvaluationForChecklist = async (
  checklistId: number, 
  teamScrumId?: number
): Promise<ApiResponse | null> => {
  try {
    console.log('🔍 Checking if evaluation exists for checklist:', checklistId);
    
    // Primero verificar si ya existe una evaluación
    const existingEvaluations = await fetchEvaluationsByChecklist(checklistId);
    
    if (existingEvaluations && existingEvaluations.data && existingEvaluations.data.length > 0) {
      console.log('✅ Evaluation already exists for checklist:', checklistId);
      return null; // Ya existe, no necesita crear
    }
    
    console.log('📝 No evaluation found, creating new one for checklist:', checklistId);
    
    // No existe, crear una nueva
    const newEvaluationResponse = await createEvaluationForChecklist(checklistId, undefined, teamScrumId);
    
    // Si la evaluación se creó exitosamente, intentar vincularla al checklist
    if (newEvaluationResponse && newEvaluationResponse.code === "200" && newEvaluationResponse.id) {
      console.log('🔗 Attempting to link new evaluation to checklist...');
      
      try {
        // Importar el servicio de checklist para actualizar la vinculación
        const { updateChecklistEvaluationLink } = await import('@services/checkListService');
        
        if (updateChecklistEvaluationLink) {
          const linkResult = await updateChecklistEvaluationLink(checklistId, parseInt(newEvaluationResponse.id));
          console.log('Linking result:', linkResult);
          
          if (linkResult && linkResult.code === "200") {
            console.log('✅ Evaluation successfully linked to checklist');
          } else {
            console.warn('⚠️ Evaluation created but linking failed');
          }
        }
      } catch (linkingError) {
        console.warn('⚠️ Could not link evaluation to checklist, but evaluation was created:', linkingError);
      }
    }
    
    return newEvaluationResponse;
    
  } catch (error) {
    console.error('❌ Error checking/creating missing evaluation:', error);
    throw error;
  }
};

// Función para completar una evaluación (que el instructor puede usar)
export const completeEvaluation = async (
  evaluationId: number,
  observations: string,
  recommendations: string,
  valueJudgment: string,
  teamScrumId?: number
): Promise<ApiResponse> => {
  try {
    // Obtener los datos actuales de la evaluación para mantener el checklistId
    const currentEvaluation = await fetchEvaluationById(evaluationId);
    
    const evaluationData: EvaluationDto = {
      observations: observations,
      recommendations: recommendations,
      valueJudgment: valueJudgment,
      checklistId: currentEvaluation.data.checklistId, // Mantener el checklistId existente
      teamScrumId: teamScrumId || currentEvaluation.data.teamScrumId // Usar teamScrumId proporcionado o mantener el existente
    };

    return await updateEvaluation(evaluationId, evaluationData);
  } catch (error) {
    console.error('Error completing evaluation:', error);
    throw error;
  }
};
