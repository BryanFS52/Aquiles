import { client } from "@/lib/apollo-client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    GET_ALL_CHECKLISTS, GET_CHECKLIST_BY_ID, ADD_CHECKLIST, UPDATE_CHECKLIST,
    DELETE_CHECKLIST,
} from '@graphql/checklistGraph';
import {
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
} from '@/generated'

export const fetchChecklists = createAsyncThunk<GetAllChecklistsQuery['allChecklists'],
    GetAllChecklistsQueryVariables
>(
    'checklist/fetchAll',
    async ({ page, size }) => {
        const { data } = await client.query<GetAllChecklistsQuery, GetAllChecklistsQueryVariables>({
            query: GET_ALL_CHECKLISTS,
            variables: { page, size },
            fetchPolicy: 'no-cache',
        });
        return data.allChecklists;
    }
);

export const fetchChecklistById = createAsyncThunk<GetChecklistByIdQuery['checklistById'],
    GetChecklistByIdQueryVariables
>(
    'checklist/fetchById',
    async ({ id }) => {
        const { data } = await client.query<GetChecklistByIdQuery, GetChecklistByIdQueryVariables>({
            query: GET_CHECKLIST_BY_ID,
            variables: { id },
        });
        return data.checklistById;
    }
);

export const addChecklist = createAsyncThunk<AddChecklistMutation['addChecklist'],
    AddChecklistMutationVariables['input']
>(
    'checklist/add',
    async (input, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate<AddChecklistMutation, AddChecklistMutationVariables>({
                mutation: ADD_CHECKLIST,
                variables: { input }
            });
            const res = data?.addChecklist;
            // Verificamos el código de la respuesta
            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }
            // Si el código es 200, retornamos los datos
            return res;
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

export const updateChecklist = createAsyncThunk<UpdateChecklistMutation['updateChecklist'],
    UpdateChecklistMutationVariables,
    { rejectValue: { code: string; message: string } }
>(
    'checklist/update',
    async ({ id, input }, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate<UpdateChecklistMutation, UpdateChecklistMutationVariables>({
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
            const { data } = await client.mutate<DeleteChecklistMutation, DeleteChecklistMutationVariables>({
                mutation: DELETE_CHECKLIST,
                variables: { id },
            });
            const res = data?.deleteChecklist;
            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }

            return id;

        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

/*
const checklistSlice = createSlice({
    name: 'checklist',
    initialState: {
        data: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: 0,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchChecklists
            .addCase(fetchChecklists.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchChecklists.fulfilled, (state, action) => {
                state.data = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.loading = false;
            })
            .addCase(fetchChecklists.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })
            // fetchChecklistById
            .addCase(fetchChecklistById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchChecklistById.fulfilled, (state, action) => {
                state.data = action.payload; // Guardamos la información del checklist
                state.loading = false;
            })
            .addCase(fetchChecklistById.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
                state.loading = false;
            })
            // addChecklist
            .addCase(addChecklist.fulfilled, (state, action) => {
                state.data.push(action.payload);
                state.error = null;
            })
            .addCase(addChecklist.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
            })
            // updateChecklist
            .addCase(updateChecklist.fulfilled, (state, action) => {
                const { id, input } = action.payload;
                const index = state.data.findIndex((checklist) => checklist.id === id);
                if (index !== -1) {
                    state.data[index] = { ...state.data[index], ...input };
                }
                state.error = null;
            })
            .addCase(updateChecklist.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
            })
            // deleteChecklist
            .addCase(deleteChecklist.fulfilled, (state, action) => {
                state.data = state.data.filter((checklist) => checklist.id !== action.payload);
                state.error = null;
            })
            .addCase(deleteChecklist.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
            });
    }
});

export const { } = checklistSlice.actions;
export default checklistSlice.reducer;
*/
