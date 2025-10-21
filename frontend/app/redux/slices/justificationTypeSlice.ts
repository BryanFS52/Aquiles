import { clientLAN } from '@lib/apollo-client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createInitialPaginatedState, RejectedPayload } from '@type/slices/common/generic'
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

export const fetchJustificationTypes = createAsyncThunk<GetAllJustificationTypesQuery['allJustificationTypes'], GetAllJustificationTypesQueryVariables>(
    'justificationType/fetchAll',
    async ({ page, size }) => {
        try {
            const { data } = await clientLAN.query<GetAllJustificationTypesQuery, GetAllJustificationTypesQueryVariables>({
                query: GET_ALL_JUSTIFICATION_TYPES,
                variables: { page, size },
                fetchPolicy: 'no-cache',
            });
            return data.allJustificationTypes;
        } catch (error: any) {
            console.error('Error fetching justification types:', error);
            throw error;
        }
    }
);

export const fetchJustificationTypeById = createAsyncThunk<GetJustificationTypeByIdQuery['justificationTypeById'], GetJustificationTypeByIdQueryVariables,
    { rejectValue: { code: string; message: string } }
>(
    'justificationType/fetchById',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.query<GetJustificationTypeByIdQuery, GetJustificationTypeByIdQueryVariables>({
                query: GET_JUSTIFICATION_TYPE_BY_ID,
                variables: { id },
            });
            return data.justificationTypeById;
        } catch (error: any) {
            console.error('Error fetching justification type by ID:', error);
            return rejectWithValue({ code: '500', message: error.message });
        }
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
    'justificationType/delete',
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

            return id;
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

interface ExtendedJustificationTypeState extends ReturnType<typeof createInitialPaginatedState<JustificationType>> {
    selected: JustificationType | null;
}

const initialState: ExtendedJustificationTypeState = {
    ...createInitialPaginatedState<JustificationType>(),
    selected: null,
};

const justificationTypeSlice = createSlice({
    name: 'justificationType',
    initialState,
    reducers: {
        clearSelected: (state) => {
            state.selected = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // FETCH ALL
            .addCase(fetchJustificationTypes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJustificationTypes.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.data = action.payload.data as JustificationType[] || [];
                    state.totalItems = action.payload.totalItems || 0;
                    state.totalPages = action.payload.totalPages || 0;
                    state.currentPage = action.payload.currentPage || 0;
                }
            })
            .addCase(fetchJustificationTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Error de red o servidor';
            })

            // FETCH BY ID
            .addCase(fetchJustificationTypeById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJustificationTypeById.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.data) {
                    state.selected = action.payload.data as JustificationType;
                }
            })
            .addCase(fetchJustificationTypeById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Error de red o servidor';
            })

            // ADD
            .addCase(addJustificationType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addJustificationType.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.data.push(action.payload as JustificationType);
                }
                state.error = null;
            })
            .addCase(addJustificationType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Error al crear tipo de justificación';
            })

            // UPDATE
            .addCase(updateJustificationType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateJustificationType.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    const updatedType = action.payload as JustificationType;
                    const index = state.data.findIndex((type: JustificationType) => type.id === updatedType.id);
                    if (index !== -1) {
                        state.data[index] = updatedType;
                    }
                    if (state.selected?.id === updatedType.id) {
                        state.selected = updatedType;
                    }
                }
                state.error = null;
            })
            .addCase(updateJustificationType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Error al actualizar tipo de justificación';
            })

            // DELETE
            .addCase(deleteJustificationType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteJustificationType.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = action.payload;
                state.data = state.data.filter((item: JustificationType) => item.id !== deletedId);
                if (state.selected?.id === deletedId) {
                    state.selected = null;
                }
            })
            .addCase(deleteJustificationType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Error al eliminar tipo de justificación';
            });
    }
});

export const { } = justificationTypeSlice.actions;

export default justificationTypeSlice.reducer;