import { client } from "@/lib/apollo-client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    GET_ALL_CHECKLISTS,
    GET_CHECKLIST_BY_ID,
    ADD_CHECKLIST,
    UPDATE_CHECKLIST,
    DELETE_CHECKLIST,
} from '@graphql/checklistGraph';

export const fetchChecklists = createAsyncThunk(
    'checklist/fetchAll',
    async ({ page, size }) => {
        const { data } = await client.query({
            query: GET_ALL_CHECKLISTS,
            variables: { page, size },
            fetchPolicy: 'no-cache',
        });
        return data.allChecklists;
    }
);

export const fetchChecklistById = createAsyncThunk(
    'checklist/fetchById',
    async ({ id }) => {
        const { data } = await client.query({
            query: GET_CHECKLIST_BY_ID,
            variables: { id },
        });
        return data.checklistById;
    }
);

export const addChecklist = createAsyncThunk(
    'checklist/add',
    async (input, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate({
                mutation: ADD_CHECKLIST,
                variables: { input }
            });
            const { addChecklist } = data;
            // Verificamos el código de la respuesta
            if (addChecklist.code !== "200") {
                // Si el código no es 200, retornamos el mensaje de error
                return rejectWithValue({ code: addChecklist.code, message: addChecklist.message });
            }
            // Si el código es 200, retornamos los datos
            return { ...input, id: addChecklist.id };
        } catch (error) {
            return rejectWithValue({ code: "500", message: error.message });
        }
    }
);

export const updateChecklist = createAsyncThunk(
    'checklist/update',
    async ({ id, input }, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate({
                mutation: UPDATE_CHECKLIST,
                variables: { id, input },
            });
            return data.updateChecklist;
        } catch (error) {
            return rejectWithValue({ code: "500", message: error.message })
        }
    }
);

export const deleteChecklist = createAsyncThunk(
    'checklist/delete',
    async (id, { rejectWithValue }) => {
        try {
            await client.mutate({
                mutation: DELETE_CHECKLIST,
                variables: { id },
            });
            return id;
        } catch (error) {
            return rejectWithValue({ code: "500", message: error.message })
        }
    }
);

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
