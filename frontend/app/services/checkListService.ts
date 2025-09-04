import { clientLAN } from '@/lib/apollo-client';
import {
  GET_ALL_CHECKLISTS,
  GET_CHECKLIST_BY_ID,
  ADD_CHECKLIST,
  UPDATE_CHECKLIST,
  DELETE_CHECKLIST,
} from '@graphql/checklistGraph';
import { 
  ChecklistPage,
  ChecklistPageId,
  ChecklistDto,
  ApiResponse 
} from '@/types/checklist';

export const fetchAllChecklists = async (page: number, size: number): Promise<ChecklistPage> => {
  const { data } = await clientLAN.query({
    query: GET_ALL_CHECKLISTS,
    variables: { page, size },
    fetchPolicy: 'no-cache',
  });
  
  console.log('fetchAllChecklists raw response:', data);
  console.log('fetchAllChecklists allChecklists data:', data.allChecklists);
  
  if (data.allChecklists && data.allChecklists.data) {
    console.log('First checklist sample with items:', data.allChecklists.data[0]);
    if (data.allChecklists.data[0] && data.allChecklists.data[0].items) {
      console.log('First checklist items:', data.allChecklists.data[0].items);
    }
  }
  
  return data.allChecklists;
};

export const fetchChecklistById = async (id: number): Promise<ChecklistPageId> => {
  try {
    const { data } = await clientLAN.query({
      query: GET_CHECKLIST_BY_ID,
      variables: { id },
    });
    
    console.log('fetchChecklistById service response:', data);
    console.log('fetchChecklistById checklistById:', data.checklistById);
    
    const res = data?.checklistById;
    
    if (!res || res.code !== '200') {
      console.error('fetchChecklistById error response:', res);
      return { code: res?.code || '500', message: res?.message || 'Unknown error' } as ChecklistPageId;
    }

    console.log('fetchChecklistById response data:', res.data);
    if (res.data && res.data.items) {
      console.log('fetchChecklistById data items:', res.data.items);
    } else {
      console.warn('fetchChecklistById: No items found in response data');
    }

    return res;
  } catch (error) {
    console.error('fetchChecklistById error:', error);
    throw error;
  }
};

export const addChecklist = async (input: ChecklistDto): Promise<ApiResponse> => {
  try {
    const { data } = await clientLAN.mutate({
      mutation: ADD_CHECKLIST,
      variables: { input },
    });
    
    const res = data?.addChecklist;
    console.log('Service response:', res);
    
    if (!res || res.code !== '200') {
      throw new Error(res?.message ?? 'Unknown error');
    }
    
    return res;
  } catch (error) {
    console.error('Service error:', error);
    throw error;
  }
};

export const updateChecklist = async (id: number, input: ChecklistDto): Promise<ApiResponse> => {
  try {
    console.log('updateChecklist service - ID:', id, 'Input:', input);
    
    const { data } = await clientLAN.mutate({
      mutation: UPDATE_CHECKLIST,
      variables: { id, input },
    });
    
    console.log('updateChecklist service response:', data);
    
    const res = data?.updateChecklist;
    
    if (!res || res.code !== '200') {
      throw new Error(res?.message ?? 'Unknown error');
    }
    
    return res;
  } catch (error) {
    console.error('Update service error:', error);
    throw error;
  }
};

export const deleteChecklist = async (id: number): Promise<ApiResponse> => {
  try {
    const { data } = await clientLAN.mutate({
      mutation: DELETE_CHECKLIST,
      variables: { id },
    });
    
    const res = data?.deleteChecklist;
    
    if (!res || res.code !== '200') {
      throw new Error(res?.message ?? 'Unknown error');
    }
    
    return res;
  } catch (error) {
    console.error('Delete service error:', error);
    throw error;
  }
};

// Función auxiliar para vincular evaluaciones con checklists
export const updateChecklistEvaluationLink = async (checklistId: number, evaluationId: number): Promise<ApiResponse> => {
  try {
    console.log('🔗 Linking evaluation', evaluationId, 'to checklist', checklistId);
    
    // Esta función puede ser implementada más adelante si el backend requiere vinculación explícita
    // Por ahora, las evaluaciones se vinculan automáticamente por el campo checklistId en la entidad Evaluation
    
    return {
      code: '200',
      message: 'Evaluation linked successfully (automatic via checklistId foreign key)'
    } as ApiResponse;
    
  } catch (error) {
    console.error('Error linking evaluation to checklist:', error);
    throw error;
  }
};

// Función para verificar que la evaluación se creó correctamente para un checklist
export const verifyChecklistEvaluationLink = async (checklistId: number): Promise<boolean> => {
  try {
    console.log('🔍 Verifying evaluation exists for checklist:', checklistId);
    
    // Importar dinámicamente para evitar dependencias circulares
    const { fetchEvaluationsByChecklist } = await import('@services/evaluationService');
    
    const evaluations = await fetchEvaluationsByChecklist(checklistId);
    
    if (evaluations && evaluations.data && evaluations.data.length > 0) {
      console.log('✅ Verification successful - Found', evaluations.data.length, 'evaluation(s) for checklist', checklistId);
      evaluations.data.forEach((evaluation, index) => {
        console.log(`  Evaluation ${index + 1}: ID=${evaluation.id}, Status=${evaluation.valueJudgment}, ChecklistId=${evaluation.checklistId}`);
      });
      return true;
    } else {
      console.log('❌ Verification failed - No evaluations found for checklist', checklistId);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error verifying evaluation link:', error);
    return false;
  }
};
