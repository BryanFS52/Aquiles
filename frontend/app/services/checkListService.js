import { clientLAN } from '@/lib/apollo-client';
import {
  GET_ALL_CHECKLISTS,
  GET_CHECKLIST_BY_ID,
  ADD_CHECKLIST,
  UPDATE_CHECKLIST,
  DELETE_CHECKLIST,
} from '@graphql/checklistGraph';

export const fetchAllChecklists = async (page, size) => {
  const { data } = await clientLAN.query({
    query: GET_ALL_CHECKLISTS,
    variables: { page, size },
    fetchPolicy: 'no-cache',
  });
  
  console.log('fetchAllChecklists raw response:', data); // Debug log
  console.log('fetchAllChecklists allChecklists data:', data.allChecklists); // Debug log
  
  if (data.allChecklists && data.allChecklists.data) {
    console.log('First checklist sample with items:', data.allChecklists.data[0]); // Debug log
    if (data.allChecklists.data[0] && data.allChecklists.data[0].items) {
      console.log('First checklist items:', data.allChecklists.data[0].items); // Debug log
    }
  }
  
  return data.allChecklists;
};

export const fetchChecklistById = async (id) => {
  try {
    const { data } = await clientLAN.query({
      query: GET_CHECKLIST_BY_ID,
      variables: { id },
    });
    
    console.log('fetchChecklistById service response:', data); // Debug log
    console.log('fetchChecklistById checklistById:', data.checklistById); // Debug log
    
    const res = data?.checklistById;
    
    if (!res || res.code !== '200') {
      console.error('fetchChecklistById error response:', res); // Debug log
      return { code: res?.code || '500', message: res?.message || 'Unknown error' };
    }

    console.log('fetchChecklistById response data:', res.data); // Debug log
    if (res.data && res.data.items) {
      console.log('fetchChecklistById data items:', res.data.items); // Debug log
    } else {
      console.warn('fetchChecklistById: No items found in response data'); // Debug log
    }

    return res;
  } catch (error) {
    console.error('fetchChecklistById error:', error); // Debug log
    throw error;
  }
};

export const addChecklist = async (input) => {
  try {
    const { data } = await clientLAN.mutate({
      mutation: ADD_CHECKLIST,
      variables: { input },
    });
    
    const res = data?.addChecklist;
    console.log('Service response:', res); // Debug log
    
    if (!res || res.code !== '200') {
      throw new Error(res?.message ?? 'Unknown error');
    }
    
    return res;
  } catch (error) {
    console.error('Service error:', error);
    throw error;
  }
};

export const updateChecklist = async (id, input) => {
  try {
    console.log('updateChecklist service - ID:', id, 'Input:', input); // Debug log
    
    const { data } = await clientLAN.mutate({
      mutation: UPDATE_CHECKLIST,
      variables: { id, input },
    });
    
    console.log('updateChecklist service response:', data); // Debug log
    
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

export const deleteChecklist = async (id) => {
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