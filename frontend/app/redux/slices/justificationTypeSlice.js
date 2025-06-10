import { client } from '@lib/apollo-client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    GET_ALL_JUSTIFICATION_TYPES,
    GET_JUSTIFICATION_TYPE_BY_ID,
    ADD_JUSTIFICATION_TYPE,
    UPDATE_JUSTIFICATION_TYPE,
    DELETE_JUSTIFICATION_TYPE,
} from '@graphql/justificationTypeGraph';

export const fetchJustificationTypes = createAsyncThunk(
    'justificationType/fetchAll',
    async ({ page, size }) => {
        const { data } = await client.query({
            query: GET_ALL_JUSTIFICATION_TYPES,
            variables: { page, size },
            fetchPolicy: 'no-cache',
        });
        return data.allJustificationTypes;
    }
);

export const fetchJustificationTypeById = createAsyncThunk(
    'justificationType/fetchById',
    async ({ id }) => {
        const { data } = await client.query({
            query: GET_JUSTIFICATION_TYPE_BY_ID,
            variables: { id },
        });
        return data.justificationTypeById;
    }
);

export const addJustificationType = createAsyncThunk(
    'justificationType/add',
    async (input, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate({
                mutation: ADD_JUSTIFICATION_TYPE,
                variables: { input }
            });
            const { addJustificationType } = data;
            // Verificamos el código de la respuesta
            if (addJustificationType.code !== "200") {
                // Si el código no es 200, retornamos el mensaje de error
                return rejectWithValue({ code: addJustificationType.code, message: addJustificationType.message });
            }
            // Si el código es 200, retornamos los datos
            return { ...input, id: addJustificationType.id };
        } catch (error) {
            return rejectWithValue({ code: "500", message: error.message });
        }
    }
);

export const updateJustificationType = createAsyncThunk(
    'justificationType/update',
    async ({ id, input }, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate({
                mutation: UPDATE_JUSTIFICATION_TYPE,
                variables: { id, input },
            });
            return data.updateJustificationType;
        } catch (error) {
            return rejectWithValue({ code: "500", message: error.message })
        }
    }
);

export const deleteJustificationType = createAsyncThunk(
    'justificationType/delete',
    async (id, { rejectWithValue }) => {
        try {
            await client.mutate({
                mutation: DELETE_JUSTIFICATION_TYPE,
                variables: { id },
            });
            return id;
        } catch (error) {
            return rejectWithValue({ code: "500", message: error.message })
        }
    }
);

const justificationTypeSlice = createSlice({
    name: 'justificationType',
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
            // fetchJustificationTypes
            .addCase(fetchJustificationTypes.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchJustificationTypes.fulfilled, (state, action) => {
                state.data = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.loading = false;
            })
            .addCase(fetchJustificationTypes.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })
            // fetchJustificationTypeById
            .addCase(fetchJustificationTypeById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchJustificationTypeById.fulfilled, (state, action) => {
                state.data = action.payload; // Guardamos la información del tipo de justificación
                state.loading = false;
            })
            .addCase(fetchJustificationTypeById.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
                state.loading = false;
            })
            // addJustificationType
            .addCase(addJustificationType.fulfilled, (state, action) => {
                state.data.push(action.payload);
                state.error = null;
            })
            .addCase(addJustificationType.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
            })
            // updateJustificationType
            .addCase(updateJustificationType.fulfilled, (state, action) => {
                const { id, input } = action.payload;
                const index = state.data.findIndex((justificationType) => justificationType.id === id);
                if (index !== -1) {
                    state.data[index] = { ...state.data[index], ...input };
                }
                state.error = null;
            })
            .addCase(updateJustificationType.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
            })
            // deleteJustificationType
            .addCase(deleteJustificationType.fulfilled, (state, action) => {
                state.data = state.data.filter((justificationType) => justificationType.id !== action.payload);
                state.error = null;
            })
            .addCase(deleteJustificationType.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
            });
    }
});

export const { } = justificationTypeSlice.actions;

export default justificationTypeSlice.reducer;
