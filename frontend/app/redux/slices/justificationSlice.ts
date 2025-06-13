import { client } from '@lib/apollo-client'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
    GET_ALL_JUSTIFICATIONS,
    GET_JUSTIFICATION_BY_ID,
    ADD_JUSTIFICATION,
    UPDATE_JUSTIFICATION,
    DELETE_JUSTIFICATION
} from '@graphql/justificationsGraph'
import {
    Justification,
    initialJustificationState
} from '@type/slices/justification'
import { RejectedPayload } from '@type/slices/common/errores'
import {
    GetAllJustificationsQuery,
    GetAllJustificationsQueryVariables,
    GetJustificationByIdQuery,
    GetJustificationByIdQueryVariables,
    AddJustificationMutation,
    AddJustificationMutationVariables,
    UpdateJustificationMutation,
    UpdateJustificationMutationVariables,
    DeleteJustificationMutation,
    DeleteJustificationMutationVariables
} from '@graphql/generated'

// Función para transformar datos de GraphQL a JustificationItem
const transformGraphQLToJustificationItem = (graphqlData: any): Justification => {
    return {
        id: graphqlData.justificationId || graphqlData.id,
        description: graphqlData.description,
        justificationDate: graphqlData.justificationDate,
        name: graphqlData.name,
        documentNumber: graphqlData.documentNumber,
        justificationFile: graphqlData.justificationFile,
        justificationHistory: graphqlData.justificationHistory,
        state: graphqlData.state,
        notificationId: graphqlData.notificationId,
        justificationType: graphqlData.justificationType ? {
            id: graphqlData.justificationType.id,
            name: graphqlData.justificationType.name
        } : { id: 0, name: '' }
    };
};

export const fetchJustifications = createAsyncThunk<GetAllJustificationsQuery['allJustifications'], GetAllJustificationsQueryVariables>(
    'justifications/fetchAll',
    async ({ page, size }) => {
        const { data } = await client.query<GetAllJustificationsQuery, GetAllJustificationsQueryVariables>({
            query: GET_ALL_JUSTIFICATIONS,
            variables: { page, size },
            fetchPolicy: 'no-cache',
        });
        return data.allJustifications;
    }
);

export const fetchJustificationById = createAsyncThunk<GetJustificationByIdQuery['justificationById'], GetJustificationByIdQueryVariables>(
    'justifications/fetchById',
    async ({ id }) => {
        const { data } = await client.query<GetJustificationByIdQuery, GetJustificationByIdQueryVariables>({
            query: GET_JUSTIFICATION_BY_ID,
            variables: { id },
        });
        return data.justificationById;
    }
);

export const addJustification = createAsyncThunk<AddJustificationMutation['addJustification'], AddJustificationMutationVariables['input'],
    { rejectValue: { code: string; message: string } }
>(
    'justifications/add',
    async (input, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate<AddJustificationMutation, AddJustificationMutationVariables>({
                mutation: ADD_JUSTIFICATION,
                variables: { input }
            });
            const res = data?.addJustification;

            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }
            return res;
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

export const updateJustification = createAsyncThunk<UpdateJustificationMutation['updateJustification'], UpdateJustificationMutationVariables,
    { rejectValue: { code: string; message: string } }
>(
    'justifications/update',
    async ({ id, input }, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate<UpdateJustificationMutation, UpdateJustificationMutationVariables>({
                mutation: UPDATE_JUSTIFICATION,
                variables: { id, input },
            });

            const res = data?.updateJustification;
            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }

            return res;
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

export const deleteJustification = createAsyncThunk<string, string,
    { rejectValue: { code: string; message: string } }
>(
    'justifications/delete',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate<DeleteJustificationMutation, DeleteJustificationMutationVariables>({
                mutation: DELETE_JUSTIFICATION,
                variables: { id },
            });

            const res = data?.deleteJustification;
            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }

            return id; // Devolvemos solo el ID borrado para actualizar el estado
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

const justificationSlice = createSlice({
    name: 'justifications',
    initialState: initialJustificationState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchJustifications
            .addCase(fetchJustifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchJustifications.fulfilled, (state, action: PayloadAction<GetAllJustificationsQuery['allJustifications']>) => {
                if (action.payload?.data) {
                    // Filtra nulls y transforma los datos
                    state.justifications = action.payload.data
                        .filter((item): item is NonNullable<typeof item> => item !== null)
                        .map(transformGraphQLToJustificationItem);
                    state.totalItems = action.payload.totalItems ?? 0;
                    state.totalPages = action.payload.totalPages ?? 0;
                    state.currentPage = action.payload.currentPage ?? 0;
                }
                state.loading = false;
            })
            .addCase(fetchJustifications.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                state.error = payload?.message || 'Error fetching justifications';
                state.loading = false;
            })
            // fetchJustificationById
            .addCase(fetchJustificationById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchJustificationById.fulfilled, (state, action: PayloadAction<GetJustificationByIdQuery['justificationById']>) => {
                if (action.payload) {
                    state.currentJustification = transformGraphQLToJustificationItem(action.payload);
                }
                state.loading = false;
            })
            .addCase(fetchJustificationById.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                state.error = payload?.message || 'Error fetching justification by id';
                state.loading = false;
            })
            // addJustification
            .addCase(addJustification.fulfilled, (state, action: PayloadAction<AddJustificationMutation['addJustification']>) => {
                if (action.payload) {
                    // Transforma el payload antes de agregarlo al estado
                    const newJustification = transformGraphQLToJustificationItem(action.payload);
                    state.justifications.push(newJustification);
                }
                state.error = null;
            })
            .addCase(addJustification.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                state.error = payload?.message || 'Error adding justification';
            })
            // updateJustification
            .addCase(updateJustification.fulfilled, (state, action: PayloadAction<UpdateJustificationMutation['updateJustification']>) => {
                if (action.payload) {
                    // Transforma el payload y actualiza el elemento correspondiente
                    const updatedJustification = transformGraphQLToJustificationItem(action.payload);
                    const index = state.justifications.findIndex((justification: Justification) => justification.id === updatedJustification.id);
                    if (index !== -1) {
                        state.justifications[index] = updatedJustification;
                    }
                }
                state.error = null;
            })
            .addCase(updateJustification.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                state.error = payload?.message || 'Error updating justification';
            })
            // deleteJustification
            .addCase(deleteJustification.fulfilled, (state, action: PayloadAction<string>) => {
                if (action.payload) {
                    state.justifications = state.justifications.filter((justification: Justification) => String(justification.id) !== action.payload);
                }
                state.error = null;
            })
            .addCase(deleteJustification.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                state.error = payload?.message || 'Error deleting justification';
            })
    }
});

export const { } = justificationSlice.actions;

export default justificationSlice.reducer;
