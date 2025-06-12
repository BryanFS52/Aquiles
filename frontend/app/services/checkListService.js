import { client } from '@/lib/apollo-client';
import {
  GET_ALL_CHECKLISTS,
  GET_CHECKLIST_BY_ID,
  ADD_CHECKLIST,
  UPDATE_CHECKLIST,
  DELETE_CHECKLIST,
} from '@graphql/checklistGraph';

export const fetchAllChecklists = async (page, size) => {
  const { data } = await client.query({
    query: GET_ALL_CHECKLISTS,
    variables: { page, size },
    fetchPolicy: 'no-cache',
  });
  return data.allChecklists;
};

export const fetchChecklistById = async (id) => {
  const { data } = await client.query({
    query: GET_CHECKLIST_BY_ID,
    variables: { id },
  });
  return data.checklistById;
};

export const addChecklist = async (input) => {
  const { data } = await client.mutate({
    mutation: ADD_CHECKLIST,
    variables: { input },
  });
  return data.addChecklist;
};

export const updateChecklist = async (id, input) => {
  const { data } = await client.mutate({
    mutation: UPDATE_CHECKLIST,
    variables: { id, input },
  });
  return data.updateChecklist;
};

export const deleteChecklist = async (id) => {
  const { data } = await client.mutate({
    mutation: DELETE_CHECKLIST,
    variables: { id },
  });
  return data.deleteChecklist;
};