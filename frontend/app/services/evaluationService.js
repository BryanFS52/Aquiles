import { client } from '@/lib/apollo-client';
import { gql } from '@apollo/client';

// GraphQL Queries y Mutations para Evaluaciones
const ADD_EVALUATION = gql`
  mutation AddEvaluation($input: EvaluationInput!) {
    addEvaluation(input: $input) {
      code
      date
      message
      data {
        id
        recommendations
        valueJudgment
        checklistId
      }
    }
  }
`;

const GET_EVALUATIONS_BY_CHECKLIST = gql`
  query GetEvaluationsByChecklist($checklistId: Long!) {
    evaluationsByChecklist(checklistId: $checklistId) {
      code
      date
      message
      data {
        id
        recommendations
        valueJudgment
        checklistId
      }
    }
  }
`;

const UPDATE_EVALUATION = gql`
  mutation UpdateEvaluation($id: Long!, $input: EvaluationInput!) {
    updateEvaluation(id: $id, input: $input) {
      code
      date
      message
      data {
        id
        recommendations
        valueJudgment
        checklistId
      }
    }
  }
`;

// Función para crear una evaluación automáticamente al crear una lista de chequeo
export const createEvaluationForChecklist = async (checklistId, checklistData) => {
  try {
    const evaluationInput = {
      recommendations: `Evaluación automática creada para la lista de chequeo del ${checklistData.trimester}° Trimestre - ${checklistData.component}`,
      valueJudgment: "PENDIENTE", // Valor inicial
      checklistId: checklistId
    };

    const { data } = await client.mutate({
      mutation: ADD_EVALUATION,
      variables: { input: evaluationInput },
    });

    return data.addEvaluation;
  } catch (error) {
    console.error('Error creating evaluation:', error);
    throw error;
  }
};

// Función para obtener evaluaciones por checklist
export const fetchEvaluationsByChecklist = async (checklistId) => {
  try {
    const { data } = await client.query({
      query: GET_EVALUATIONS_BY_CHECKLIST,
      variables: { checklistId },
      fetchPolicy: 'no-cache',
    });
    return data.evaluationsByChecklist;
  } catch (error) {
    console.error('Error fetching evaluations:', error);
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
export const completeEvaluation = async (evaluationId, recommendations, valueJudgment) => {
  try {
    const evaluationData = {
      recommendations: recommendations,
      valueJudgment: valueJudgment
    };

    return await updateEvaluation(evaluationId, evaluationData);
  } catch (error) {
    console.error('Error completing evaluation:', error);
    throw error;
  }
};
