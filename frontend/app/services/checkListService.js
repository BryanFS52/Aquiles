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

// Función para guardar checklist completo con items evaluados
export const saveChecklistWithEvaluatedItems = async (checklistId, evaluatedItems, evaluationData = null) => {
  try {
    console.log('Saving checklist with evaluated items:', { checklistId, evaluatedItems, evaluationData });
    
    // Primero, obtener el checklist actual
    const currentChecklist = await fetchChecklistById(checklistId);
    
    if (currentChecklist.code !== '200' || !currentChecklist.data) {
      throw new Error('No se pudo obtener la información del checklist');
    }
    
    // Preparar los datos actualizados del checklist
    const updatedChecklistData = {
      state: currentChecklist.data.state,
      remarks: currentChecklist.data.remarks || '',
      instructorSignature: currentChecklist.data.instructorSignature || '',
      evaluationCriteria: currentChecklist.data.evaluationCriteria || '',
      trimester: currentChecklist.data.trimester,
      component: currentChecklist.data.component || '',
      studySheets: currentChecklist.data.studySheets || []
    };
    
    console.log('Updating checklist with data:', updatedChecklistData);
    
    // Actualizar el checklist
    const updateResponse = await updateChecklist(checklistId, updatedChecklistData);
    
    if (updateResponse.code === '200') {
      console.log('Checklist updated successfully');
      
      // TODO: Aquí se podrían actualizar los items individuales si hay una API específica para eso
      // Por ahora, solo actualizamos el checklist principal
      
      return {
        code: '200',
        message: 'Checklist guardado exitosamente',
        data: {
          checklistId,
          evaluatedItems,
          evaluationData
        }
      };
    } else {
      throw new Error(`Error actualizando checklist: ${updateResponse.message}`);
    }
    
  } catch (error) {
    console.error('Error saving checklist with evaluated items:', error);
    throw error;
  }
};

// Función para actualizar la vinculación entre checklist y evaluación
export const updateChecklistEvaluationLink = async (checklistId, evaluationId) => {
  try {
    console.log('🔗 Updating checklist-evaluation link:', { checklistId, evaluationId });
    
    // Obtener los datos actuales del checklist
    const currentChecklistResponse = await fetchChecklistById(checklistId);
    
    if (currentChecklistResponse.code !== "200" || !currentChecklistResponse.data) {
      throw new Error("Could not fetch current checklist data");
    }
    
    const currentChecklist = currentChecklistResponse.data;
    console.log('Current checklist data for linking:', currentChecklist);
    
    // Preparar datos para actualización con el evaluation_id
    const updateData = {
      state: currentChecklist.state,
      remarks: currentChecklist.remarks || "",
      trimester: currentChecklist.trimester,
      component: currentChecklist.component || "",
      evaluationCriteria: currentChecklist.evaluationCriteria || false,
      instructorSignature: currentChecklist.instructorSignature || "",
      studySheets: currentChecklist.studySheets || null,
      associatedJuries: currentChecklist.associatedJuries || null,
      items: currentChecklist.items || [],
      evaluationId: parseInt(evaluationId) // ⭐ CLAVE: Vincular la evaluación
    };
    
    console.log('Updating checklist with evaluation link:', updateData);
    
    const { data } = await clientLAN.mutate({
      mutation: UPDATE_CHECKLIST,
      variables: { 
        id: parseInt(checklistId), 
        input: updateData 
      },
    });
    
    console.log('Checklist-evaluation linking result:', data);
    return data.updateChecklist;
    
  } catch (error) {
    console.error('❌ Error updating checklist-evaluation link:', error);
    throw error;
  }
};