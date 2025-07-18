import { clientLAN } from '@lib/apollo-client';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GenericPaginatedState, createInitialPaginatedState, RejectedPayload } from '@type/slices/common/generic'
import { GET_ALL_JUSTIFICATION_TYPES, GET_JUSTIFICATION_TYPE_BY_ID, ADD_JUSTIFICATION_TYPE, UPDATE_JUSTIFICATION_TYPE, DELETE_JUSTIFICATION_TYPE, } from '@graphql/justificationTypeGraph';
import {
    JustificationType,
    GetAllJustificationTypesQuery,
    GetAllJustificationTypesQueryVariables,
    GetJustificationTypeByIdQuery,
    GetJustificationTypeByIdQueryVariables,
    AddJustificationTypeMutation,
    AddJustificationTypeMutationVariables,
    UpdateJustificationTypeMutation,
    UpdateJustificationTypeMutationVariables,
    DeleteJustificationTypeMutation,
    DeleteJustificationTypeMutationVariables
} from '@graphql/generated'

type LocalJustificationState = GenericPaginatedState<JustificationType> & {
    selected?: JustificationType | null;
};

// Función para transformar datos de GraphQL a JustificationType
export const transformGraphQLToJustificationTypeItem = (data: any): JustificationType => {
    return {
        id: data.id,
        name: data.name,
        description: data.description,
    };
};

export const fetchJustificationTypes = createAsyncThunk<GetAllJustificationTypesQuery['allJustificationTypes'], GetAllJustificationTypesQueryVariables>(
    'justificationType/fetchAll',
    async ({ page, size }) => {
        const { data } = await clientLAN.query<GetAllJustificationTypesQuery, GetAllJustificationTypesQueryVariables>({
            query: GET_ALL_JUSTIFICATION_TYPES,
            variables: { page, size },
            fetchPolicy: 'no-cache',
        });
        return data.allJustificationTypes;
    }
);

export const fetchJustificationTypeById = createAsyncThunk<GetJustificationTypeByIdQuery['justificationTypeById'], GetJustificationTypeByIdQueryVariables>(
    'justificationType/fetchById',
    async ({ id }) => {
        const { data } = await clientLAN.query<GetJustificationTypeByIdQuery, GetJustificationTypeByIdQueryVariables>({
            query: GET_JUSTIFICATION_TYPE_BY_ID,
            variables: { id },
        });
        return data.justificationTypeById;
    }
);

export const addJustificationType = createAsyncThunk<AddJustificationTypeMutation['addJustificationType'], AddJustificationTypeMutationVariables['input'],
    { rejectValue: { code: string; message: string } }
>(
    'justificationType/add',
    async (input, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.mutate<AddJustificationTypeMutation, AddJustificationTypeMutationVariables>({
                mutation: ADD_JUSTIFICATION_TYPE,
                variables: { input }
            });
            const res = data?.addJustificationType
            // Verificamos el código de la respuesta
            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }
            return res;
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

export const updateJustificationType = createAsyncThunk<UpdateJustificationTypeMutation['updateJustificationType'], UpdateJustificationTypeMutationVariables,
    { rejectValue: RejectedPayload }
>(
    'justificationType/update',
    async ({ id, input }, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.mutate<UpdateJustificationTypeMutation, UpdateJustificationTypeMutationVariables>({
                mutation: UPDATE_JUSTIFICATION_TYPE,
                variables: { id, input },
            });

            const res = data?.updateJustificationType;
            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }

            return res;
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

export const deleteJustificationType = createAsyncThunk<string, string,
    { rejectValue: { code: string; message: string } }
>(
    'checklist/delete',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.mutate<DeleteJustificationTypeMutation, DeleteJustificationTypeMutationVariables>({
                mutation: DELETE_JUSTIFICATION_TYPE,
                variables: { id },
            });

            const res = data?.deleteJustificationType;
            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }

            return id; // Devolvemos solo el ID borrado para actualizar el estado
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

const initialState: LocalJustificationState = {
    ...createInitialPaginatedState<JustificationType>(),
    selected: null,
};
const justificationTypeSlice = createSlice({
    name: 'justificationType',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // FETCH ALL
            .addCase(fetchJustificationTypes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJustificationTypes.fulfilled, (state, action) => {
                const payload = action.payload;

                if (!payload || payload.code !== '200') {
                    state.error = payload?.message ?? 'Error inesperado al obtener tipos de justificación.';
                    state.loading = false;
                    return;
                }

                state.data = payload.data?.map(transformGraphQLToJustificationTypeItem) ?? [];
                state.totalItems = payload.totalItems ?? 0;
                state.totalPages = payload.totalPages ?? 0;
                state.currentPage = payload.currentPage ?? 0;
                state.loading = false;
            })
            .addCase(fetchJustificationTypes.rejected, (state, action) => {
                const error = action.error?.message ?? 'Error de red o servidor';
                state.error = error;
                state.loading = false;
            })

            // FETCH BY ID
            .addCase(fetchJustificationTypeById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJustificationTypeById.fulfilled, (state, action) => {
                const payload = action.payload;

                if (!payload || payload.code !== '200') {
                    state.error = payload?.message ?? 'Error inesperado al obtener detalle de tipo de justificación.';
                    state.loading = false;
                    return;
                }

                const item = payload.data ? transformGraphQLToJustificationTypeItem(payload.data) : null;
                state.selected = item;
                state.loading = false;
            })
            .addCase(fetchJustificationTypeById.rejected, (state, action) => {
                const error = action.error?.message ?? 'Error de red o servidor';
                state.error = error;
                state.loading = false;
            })

            // ADD
            .addCase(addJustificationType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addJustificationType.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addJustificationType.rejected, (state, action: PayloadAction<RejectedPayload | undefined>) => {
                state.error = action.payload?.message ?? 'Error al crear tipo de justificación';
                state.loading = false;
            })

            // UPDATE
            .addCase(updateJustificationType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateJustificationType.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateJustificationType.rejected, (state, action: PayloadAction<RejectedPayload | undefined>) => {
                state.error = action.payload?.message ?? 'Error al actualizar tipo de justificación';
                state.loading = false;
            })

            // DELETE
            .addCase(deleteJustificationType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteJustificationType.fulfilled, (state, action: PayloadAction<string>) => {
                state.data = state.data.filter(item => item.id !== action.payload);
                state.loading = false;
            })
            .addCase(deleteJustificationType.rejected, (state, action: PayloadAction<RejectedPayload | undefined>) => {
                state.error = action.payload?.message ?? 'Error al eliminar tipo de justificación';
                state.loading = false;
            });
    }
});


export const { } = justificationTypeSlice.actions;

export default justificationTypeSlice.reducer;