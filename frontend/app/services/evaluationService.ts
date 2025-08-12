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

// Función para crear una evaluación automáticamente al crear una lista de chequeo
export const createEvaluationForChecklist = async (
  checklistId: number, 
  checklistData?: any
): Promise<ApiResponse> => {
  try {
    const evaluationInput: EvaluationDto = {
      observations: "", // Iniciar como string vacío en lugar de null
      recommendations: "", // Iniciar como string vacío en lugar de null
      valueJudgment: "", // Iniciar como string vacío en lugar de null
      checklistId: checklistId // Asegurar que sea un número entero
    };

    console.log('Creating evaluation with input:', evaluationInput);

    const { data } = await clientLAN.mutate({
      mutation: ADD_EVALUATION,
      variables: { input: evaluationInput },
    });

    console.log('Evaluation creation response:', data);
    
    // Verificar la respuesta
    if (data && data.addEvaluation) {
      if (data.addEvaluation.code === "200") {
        console.log('Evaluation created successfully');
        return data.addEvaluation;
      } else {
        console.error('Evaluation creation failed with code:', data.addEvaluation.code);
        console.error('Error message:', data.addEvaluation.message);
        throw new Error(`Error creating evaluation: ${data.addEvaluation.message}`);
      }
    } else {
      console.error('Unexpected response format:', data);
      throw new Error('Unexpected response format from evaluation creation');
    }
  } catch (error: any) {
    console.error('Error creating evaluation:', error);
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
    console.log('Fetching evaluations for checklist ID:', checklistId);
    
    // Usar la nueva query específica
    const { data } = await clientLAN.query({
      query: GET_EVALUATIONS_BY_CHECKLIST,
      variables: { checklistId },
      fetchPolicy: 'no-cache',
    });
    
    console.log('Evaluations by checklist response:', data);
    
    // Filtrar por checklistId ya que la query obtiene todas las evaluaciones
    if (data.allEvaluations && data.allEvaluations.data) {
      const filteredEvaluations = data.allEvaluations.data.filter(
        (evaluation: Evaluation) => {
          console.log(`Comparing evaluation checklistId ${evaluation.checklistId} with target ${checklistId}`);
          return evaluation.checklistId == checklistId; // Usar == para comparación más flexible
        }
      );
      
      console.log('Filtered evaluations:', filteredEvaluations);
      
      return {
        ...data.allEvaluations,
        data: filteredEvaluations
      };
    }
    return data.allEvaluations;
  } catch (error) {
    console.error('Error fetching evaluations by checklist:', error);
    throw error;
  }
};

// Función original mantenida para compatibilidad
export const fetchEvaluationsByChecklistOld = async (checklistId: number): Promise<EvaluationPage> => {
  try {
    console.log('Fetching evaluations for checklist ID:', checklistId);
    
    const { data } = await clientLAN.query({
      query: GET_ALL_EVALUATIONS,
      variables: { page: 0, size: 100 }, // Obtener todas las evaluaciones
      fetchPolicy: 'no-cache',
    });
    
    console.log('All evaluations response:', data);
    
    // Filtrar por checklistId ya que no hay query específica
    if (data.allEvaluations && data.allEvaluations.data) {
      const filteredEvaluations = data.allEvaluations.data.filter(
        (evaluation: Evaluation) => evaluation.checklistId == checklistId // Usar == para comparación más flexible
      );
      
      console.log('Filtered evaluations:', filteredEvaluations);
      
      return {
        ...data.allEvaluations,
        data: filteredEvaluations
      };
    }
    return data.allEvaluations;
  } catch (error) {
    console.error('Error fetching evaluations by checklist:', error);
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

// Función para completar una evaluación (que el instructor puede usar)
export const completeEvaluation = async (
  evaluationId: number,
  observations: string,
  recommendations: string,
  valueJudgment: string
): Promise<ApiResponse> => {
  try {
    // Obtener los datos actuales de la evaluación para mantener el checklistId
    const currentEvaluation = await fetchEvaluationById(evaluationId);
    
    const evaluationData: EvaluationDto = {
      observations: observations,
      recommendations: recommendations,
      valueJudgment: valueJudgment,
      checklistId: currentEvaluation.data.checklistId // Mantener el checklistId existente
    };

    return await updateEvaluation(evaluationId, evaluationData);
  } catch (error) {
    console.error('Error completing evaluation:', error);
    throw error;
  }
};
