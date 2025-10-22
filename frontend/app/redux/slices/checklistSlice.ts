import { clientLAN} from '@lib/apollo-client'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createInitialPaginatedState, RejectedPayload } from '@type/slices/common/generic'
import { GET_ALL_CHECKLISTS_COORDINATOR, GET_CHECKLIST_BY_ID_COORDINATOR, ADD_CHECKLIST, UPDATE_CHECKLIST, DELETE_CHECKLIST, GET_ALL_CHECKLISTS, GET_CHECKLIST_BY_ID } from '@graphql/checklistGraph'
import {
    Checklist,
    GetAllChecklistsQuery,
    GetAllChecklistsQueryVariables,
    GetChecklistByIdQuery,
    GetChecklistByIdQueryVariables,
    AddChecklistMutation,
    AddChecklistMutationVariables,
    UpdateChecklistMutation,
    UpdateChecklistMutationVariables,
    DeleteChecklistMutation,
    DeleteChecklistMutationVariables
} from '@graphql/generated'


// Función para transformar datos de GraphQL a Checklist
const transformGraphQLToChecklistItem = (graphqlData: any): Checklist => {
    return {
        id: graphqlData.id,
        state: graphqlData.state,
        remarks: graphqlData.remarks,
        trimester: graphqlData.trimester,
        component: graphqlData.component,
        instructorSignature: graphqlData.instructorSignature,
        evaluationCriteria: graphqlData.evaluationCriteria,
        studySheets: graphqlData.studySheets,
        associatedJuries: graphqlData.associatedJuries,
        items: graphqlData.items || [],
        evaluations: graphqlData.evaluations || []
    };
};

export const fetchChecklists = createAsyncThunk<GetAllChecklistsQuery['allChecklists'], GetAllChecklistsQueryVariables>(
    'checklist/fetchAll',
    async ({ page, size }) => {
        const { data } = await clientLAN.query<GetAllChecklistsQuery, GetAllChecklistsQueryVariables>({
            query: GET_ALL_CHECKLISTS_COORDINATOR,
            variables: { page, size },
            fetchPolicy: 'no-cache',
        });
        return data.allChecklists;
    }
);

export const fetchChecklistById = createAsyncThunk<GetChecklistByIdQuery['checklistById'], GetChecklistByIdQueryVariables>(
    'checklist/fetchById',
    async ({ id }) => {
        const { data } = await clientLAN.query<GetChecklistByIdQuery, GetChecklistByIdQueryVariables>({
            query: GET_CHECKLIST_BY_ID_COORDINATOR,
            variables: { id },
            fetchPolicy: 'no-cache', // Forzar recarga desde servidor
        });
        return data.checklistById;
    }
);

export const addChecklist = createAsyncThunk<AddChecklistMutation['addChecklist'], AddChecklistMutationVariables['input'],
    { rejectValue: { code: string; message: string } }
>(
    'checklist/add',
    async (input, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.mutate<AddChecklistMutation, AddChecklistMutationVariables>({
                mutation: ADD_CHECKLIST,
                variables: { input }
            });
            const res = data?.addChecklist;

            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }
            return res;
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

export const updateChecklist = createAsyncThunk<UpdateChecklistMutation['updateChecklist'], UpdateChecklistMutationVariables,
    { rejectValue: { code: string; message: string } }
>(
    'checklist/update',
    async ({ id, input }, { rejectWithValue }) => {
        try {
            console.log('=== REDUX UPDATE CHECKLIST ===');
            console.log('ID:', id);
            console.log('Input data:', input);
            console.log('Input items:', input.items);
            
            const { data } = await clientLAN.mutate<UpdateChecklistMutation, UpdateChecklistMutationVariables>({
                mutation: UPDATE_CHECKLIST,
                variables: { id, input },
            });

            console.log('GraphQL update response:', data);
            
            const res = data?.updateChecklist;
            if (!res || res.code !== '200') {
                console.log('Update failed with response:', res);
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }

            console.log('✅ Update successful in Redux:', res);
            return res;
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

export const updateChecklistState = createAsyncThunk<UpdateChecklistMutation['updateChecklist'], { id: string; state: boolean },
    { rejectValue: { code: string; message: string } }
>(
    'checklist/updateState',
    async ({ id, state }, { rejectWithValue, getState }) => {
        try {
            // Obtener el checklist actual del estado para mantener sus datos originales
            const currentState = getState() as any;
            const currentChecklist = currentState.checklist.data.find((item: any) => item.id === id);
            
            const input = {
                state,
                remarks: currentChecklist?.remarks || "Sin observaciones",
                trimester: currentChecklist?.trimester || "1",
                component: currentChecklist?.component || "temporal",
                evaluationCriteria: currentChecklist?.evaluationCriteria || false,
                instructorSignature: currentChecklist?.instructorSignature || "No signature",
                studySheets: currentChecklist?.studySheets || null,
                evaluations: currentChecklist?.evaluations || null,
                associatedJuries: currentChecklist?.associatedJuries || null,
                items: currentChecklist?.items || []
            };

            const { data } = await clientLAN.mutate<UpdateChecklistMutation, UpdateChecklistMutationVariables>({
                mutation: UPDATE_CHECKLIST,
                variables: { id: parseInt(id), input },
            });

            const res = data?.updateChecklist;
            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }

            return res;
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

export const updateChecklistSignature = createAsyncThunk<UpdateChecklistMutation['updateChecklist'], 
    { id: number; checklistData: any },
    { rejectValue: { code: string; message: string } }
>(
    'checklist/updateSignature',
    async ({ id, checklistData }, { rejectWithValue }) => {
        try {
            console.log('=== REDUX UPDATE CHECKLIST SIGNATURE ===');
            console.log('ID:', id);
            console.log('Checklist data:', checklistData);
            
            const { data } = await clientLAN.mutate<UpdateChecklistMutation, UpdateChecklistMutationVariables>({
                mutation: UPDATE_CHECKLIST,
                variables: { id, input: checklistData },
            });

            console.log('GraphQL signature update response:', data);
            
            const res = data?.updateChecklist;
            if (!res || res.code !== '200') {
                console.log('Signature update failed with response:', res);
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }

            console.log('✅ Signature update successful in Redux:', res);
            return res;
        } catch (error: any) {
            console.error('Error updating checklist signature:', error);
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

export const deleteChecklist = createAsyncThunk<string, string,
    { rejectValue: { code: string; message: string } }
>(
    'checklist/delete',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.mutate<DeleteChecklistMutation, DeleteChecklistMutationVariables>({
                mutation: DELETE_CHECKLIST,
                variables: { id },
            });

            const res = data?.deleteChecklist;
            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }

            return id; // Devolvemos solo el ID borrado para actualizar el estado
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

const initialState = createInitialPaginatedState<Checklist>();
const checklistSlice = createSlice({
    name: 'checklist',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchChecklists
            .addCase(fetchChecklists.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchChecklists.fulfilled, (state, action: PayloadAction<GetAllChecklistsQuery['allChecklists']>) => {
                if (action.payload?.data) {
                    // Filtra nulls y transforma los datos
                    state.data = action.payload.data
                        .filter((item): item is NonNullable<typeof item> => item !== null)
                        .map(transformGraphQLToChecklistItem);
                    state.totalItems = action.payload.totalItems ?? 0;
                    state.totalPages = action.payload.totalPages ?? 0;
                    state.currentPage = action.payload.currentPage ?? 0;
                }
                state.loading = false;
            })
            .addCase(fetchChecklists.rejected, (state, action) => {
                state.error = action.error.message || 'Error fetching checklists';
                state.loading = false;
            })
            // fetchChecklistById
            .addCase(fetchChecklistById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchChecklistById.fulfilled, (state, action: PayloadAction<GetChecklistByIdQuery['checklistById']>) => {
                console.log('fetchChecklistById.fulfilled - payload:', action.payload); // Debug log
                if (action.payload && action.payload.data) {
                    const transformedData = transformGraphQLToChecklistItem(action.payload.data);
                    console.log('fetchChecklistById.fulfilled - transformed data:', transformedData); // Debug log
                    console.log('fetchChecklistById.fulfilled - transformed data items:', transformedData.items); // Debug log
                    
                    // Actualizar el checklist específico en el array existente en lugar de sobrescribir todo
                    const existingIndex = state.data.findIndex(item => item.id === transformedData.id);
                    if (existingIndex >= 0) {
                        // Actualizar checklist existente
                        state.data[existingIndex] = transformedData;
                    } else {
                        // Si no existe, agregarlo al array (solo durante operaciones de edición donde se necesita)
                        // Nota: En la mayoría de casos, este checklist ya debería existir en el array
                        console.log('Adding new checklist to existing data from fetchById'); // Debug log
                        state.data.push(transformedData);
                    }
                }
                state.loading = false;
            })
            .addCase(fetchChecklistById.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
                state.loading = false;
            })
            // addChecklist
            .addCase(addChecklist.fulfilled, (state, action: PayloadAction<AddChecklistMutation['addChecklist']>) => {
                // Solo marcamos que el estado de error es null, la recarga de datos se hace desde el componente
                state.error = null;
            })
            .addCase(addChecklist.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            })
            // updateChecklist
            .addCase(updateChecklist.fulfilled, (state, action: PayloadAction<UpdateChecklistMutation['updateChecklist']>) => {
                console.log('=== REDUX REDUCER UPDATE FULFILLED ===');
                console.log('Update completed successfully, action payload:', action.payload);
                
                state.loading = false;
                state.error = null;
                
                console.log('✅ Update successful - state will be refreshed from component');
                // Los datos se recargan desde el componente para asegurar consistencia
            })
            .addCase(updateChecklist.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            })
            // updateChecklistState
            .addCase(updateChecklistState.fulfilled, (state, action) => {
                // Actualizar el estado local del checklist
                const { id, state: newState } = action.meta.arg;
                const index = state.data.findIndex((checklist: any) => checklist.id === id);
                if (index !== -1) {
                    state.data[index].state = newState;
                }
                state.error = null;
            })
            .addCase(updateChecklistState.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            })
            // updateChecklistSignature
            .addCase(updateChecklistSignature.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateChecklistSignature.fulfilled, (state, action) => {
                console.log('=== REDUX SIGNATURE UPDATE FULFILLED ===');
                console.log('Signature update completed successfully');
                
                state.loading = false;
                state.error = null;
                
                // La mutación solo devuelve { code, message, id }, no los datos completos
                // El componente debe recargar los datos del checklist para obtener la firma actualizada
                console.log('✅ Signature update successful - component should refetch data');
            })
            .addCase(updateChecklistSignature.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
                state.loading = false;
            })
            // deleteChecklist
            .addCase(deleteChecklist.fulfilled, (state, action: PayloadAction<string>) => {
                if (action.payload) {
                    state.data = state.data.filter((checklist: Checklist) => checklist.id !== action.payload);
                }
                state.error = null;
            })
            .addCase(deleteChecklist.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            })
    }
});

export const { } = checklistSlice.actions;
export default checklistSlice.reducer;