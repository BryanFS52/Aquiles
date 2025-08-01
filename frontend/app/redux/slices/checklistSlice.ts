import { clientLAN } from '@lib/apollo-client'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createInitialPaginatedState, RejectedPayload } from '@type/slices/common/generic'
import { GET_ALL_CHECKLISTS, GET_CHECKLIST_BY_ID, ADD_CHECKLIST, UPDATE_CHECKLIST, DELETE_CHECKLIST } from '@graphql/checklistGraph'
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
        remarks: graphqlData.remarks,
        instructorSignature: graphqlData.instructorSignature,
        evaluationCriteria: graphqlData.evaluationCriteria,
        associatedJuries: graphqlData.associatedJuries
    };
};

export const fetchChecklists = createAsyncThunk<GetAllChecklistsQuery['allChecklists'], GetAllChecklistsQueryVariables>(
    'checklist/fetchAll',
    async ({ page, size }) => {
        const { data } = await clientLAN.query<GetAllChecklistsQuery, GetAllChecklistsQueryVariables>({
            query: GET_ALL_CHECKLISTS,
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
            query: GET_CHECKLIST_BY_ID,
            variables: { id },
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
            const { data } = await clientLAN.mutate<UpdateChecklistMutation, UpdateChecklistMutationVariables>({
                mutation: UPDATE_CHECKLIST,
                variables: { id, input },
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
                if (action.payload) {
                    state.data = [transformGraphQLToChecklistItem(action.payload)];
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
                if (action.payload) {
                    // Transforma el payload antes de agregarlo al estado
                    const newChecklist = transformGraphQLToChecklistItem(action.payload);
                    state.data.push(newChecklist);
                }
                state.error = null;
            })
            .addCase(addChecklist.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            })
            // updateChecklist
            .addCase(updateChecklist.fulfilled, (state, action: PayloadAction<UpdateChecklistMutation['updateChecklist']>) => {
                if (action.payload) {
                    // Transforma el payload y actualiza el elemento correspondiente
                    const updatedChecklist = transformGraphQLToChecklistItem(action.payload);
                    const index = state.data.findIndex((checklist: Checklist) => checklist.id === updatedChecklist.id);
                    if (index !== -1) {
                        state.data[index] = updatedChecklist;
                    }
                }
                state.error = null;
            })
            .addCase(updateChecklist.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
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