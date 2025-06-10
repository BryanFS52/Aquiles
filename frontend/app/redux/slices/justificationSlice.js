import { client } from '@lib/apollo-client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    GET_ALL_JUSTIFICATIONS,
    GET_JUSTIFICATION_BY_ID,
    ADD_JUSTIFICATION,
    UPDATE_JUSTIFICATION,
    DELETE_JUSTIFICATION,
} from '@graphql/justificationsGraph';

export const fetchJustifications = createAsyncThunk(
    'justification/fetchAll',
    async ({ page, size }) => {
        const { data } = await client.query({
            query: GET_ALL_JUSTIFICATIONS,
            variables: { page, size },
            fetchPolicy: 'no-cache',
        });
        return data.allJustifications;
    }
);

export const fetchJustificationById = createAsyncThunk(
    'justification/fetchById',
    async ({ id }) => {
        const { data } = await client.query({
            query: GET_JUSTIFICATION_BY_ID,
            variables: { id },
        });
        return data.justificationById;
    }
);

export const addJustification = createAsyncThunk(
    'justification/add',
    async (input, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate({
                mutation: ADD_JUSTIFICATION,
                variables: { input }
            });
            const { addJustification } = data;
            // Verificamos el código de la respuesta
            if (addJustification.code !== "200") {
                // Si el código no es 200, retornamos el mensaje de error
                return rejectWithValue({ code: addJustification.code, message: addJustification.message });
            }
            // Si el código es 200, retornamos los datos
            return { ...input, id: addJustification.id };
        } catch (error) {
            return rejectWithValue({ code: "500", message: error.message });
        }
    }
);

export const updateJustification = createAsyncThunk(
    'justification/update',
    async ({ id, input }, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate({
                mutation: UPDATE_JUSTIFICATION,
                variables: { id, input },
            });
            return data.updateJustification;
        } catch (error) {
            return rejectWithValue({ code: "500", message: error.message })
        }
    }
);

export const deleteJustification = createAsyncThunk(
    'justification/delete',
    async (id, { rejectWithValue }) => {
        try {
            await client.mutate({
                mutation: DELETE_JUSTIFICATION,
                variables: { id },
            });
            return id;
        } catch (error) {
            return rejectWithValue({ code: "500", message: error.message })
        }
    }
);

const justificationSlice = createSlice({
    name: 'justification',
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
            // fetchJustifications
            .addCase(fetchJustifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchJustifications.fulfilled, (state, action) => {
                state.data = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.loading = false;
            })
            .addCase(fetchJustifications.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })
            // fetchJustificationById
            .addCase(fetchJustificationById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchJustificationById.fulfilled, (state, action) => {
                state.data = action.payload; // Guardamos la información de la justificación
                state.loading = false;
            })
            .addCase(fetchJustificationById.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
                state.loading = false;
            })
            // addJustification
            .addCase(addJustification.fulfilled, (state, action) => {
                state.data.push(action.payload);
                state.error = null;
            })
            .addCase(addJustification.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
            })
            // updateJustification
            .addCase(updateJustification.fulfilled, (state, action) => {
                const { id, input } = action.payload;
                const index = state.data.findIndex((justification) => justification.id === id);
                if (index !== -1) {
                    state.data[index] = { ...state.data[index], ...input };
                }
                state.error = null;
            })
            .addCase(updateJustification.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
            })
            // deleteJustification
            .addCase(deleteJustification.fulfilled, (state, action) => {
                state.data = state.data.filter((justification) => justification.id !== action.payload);
                state.error = null;
            })
            .addCase(deleteJustification.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
            });
    }
});

export const { } = justificationSlice.actions;

export default justificationSlice.reducer;
