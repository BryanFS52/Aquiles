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
