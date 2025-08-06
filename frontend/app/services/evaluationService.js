/*
import { client } from '@/lib/apollo-client';
import { gql } from '@apollo/client';

// GraphQL Queries y Mutations para Evaluaciones


// Función para crear una evaluación automáticamente al crear una lista de chequeo
export const createEvaluationForChecklist = async (checklistId, checklistData) => {
  try {
    const evaluationInput = {
      observations: "", // Iniciar como string vacío en lugar de null
      recommendations: "", // Iniciar como string vacío en lugar de null
      valueJudgment: "", // Iniciar como string vacío en lugar de null
      checklistId: parseInt(checklistId) // Asegurar que sea un número entero
    };

    console.log('Creating evaluation with input:', evaluationInput); // Debug log
    console.log('Using GraphQL mutation:', ADD_EVALUATION); // Debug log

    const { data } = await client.mutate({
      mutation: ADD_EVALUATION,
      variables: { input: evaluationInput },
    });

    console.log('Evaluation creation response:', data); // Debug log
    
    // Verificar la respuesta
    if (data && data.addEvaluation) {
      if (data.addEvaluation.code === "200") {
        console.log('Evaluation created successfully'); // Debug log
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
  } catch (error) {
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

// Función para obtener evaluaciones por checklist
export const fetchEvaluationsByChecklist = async (checklistId) => {
  try {
    console.log('Fetching evaluations for checklist:', checklistId); // Debug log
    
    const { data } = await client.query({
      query: GET_EVALUATIONS_BY_CHECKLIST,
      fetchPolicy: 'no-cache',
    });
    
    console.log('All evaluations response:', data); // Debug log
    
    // Filtrar por checklistId ya que no hay query específica
    if (data.allEvaluations && data.allEvaluations.data) {
      const filteredEvaluations = data.allEvaluations.data.filter(
        evaluation => evaluation.checklistId == checklistId // Usar == para comparación más flexible
      );
      
      console.log('Filtered evaluations:', filteredEvaluations); // Debug log
      
      return {
        ...data.allEvaluations,
        data: filteredEvaluations
      };
    }
    return data.allEvaluations;
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    throw error;
  }
};

// Función para obtener una evaluación por ID
export const fetchEvaluationById = async (id) => {
  try {
    const { data } = await client.query({
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
export const updateEvaluation = async (id, evaluationData) => {
  try {
    const { data } = await client.mutate({
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
export const completeEvaluation = async (evaluationId, observations, recommendations, valueJudgment) => {
  try {
    // Obtener los datos actuales de la evaluación para mantener el checklistId
    const currentEvaluation = await fetchEvaluationById(evaluationId);
    
    const evaluationData = {
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
*/