import { client } from '@lib/apollo-client'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createInitialPaginatedState, RejectedPayload } from '@type/slices/common/generic'
import { GET_ALL_FAULT_TYPES, GET_FAULT_TYPE_BY_ID, ADD_FAULT_TYPE, UPDATE_FAULT_TYPE, DELETE_FAULT_TYPE } from '@graphql/improvementPlanFaultTypeGraph'
import {
    ImprovementPlanFaultType,
    GetAllImprovementPlanFaultTypesQuery,
    GetAllImprovementPlanFaultTypesQueryVariables,
    GetImprovementPlanFaultTypeByIdQuery,
    GetImprovementPlanFaultTypeByIdQueryVariables,
    AddImprovementPlanFaultTypeMutation,
    AddImprovementPlanFaultTypeMutationVariables,
    UpdateImprovementPlanFaultTypeMutation,
    UpdateImprovementPlanFaultTypeMutationVariables,
    DeleteImprovementPlanFaultTypeMutation,
    DeleteImprovementPlanFaultTypeMutationVariables
} from '@graphql/generated'

export const fetchFaultTypes = createAsyncThunk<GetAllImprovementPlanFaultTypesQuery['allImprovementPlanFaultTypes'], GetAllImprovementPlanFaultTypesQueryVariables
>(
    'faultType/fetchAll',
    async ({ page, size }) => {
        const { data } = await client.query<GetAllImprovementPlanFaultTypesQuery, GetAllImprovementPlanFaultTypesQueryVariables>({
            query: GET_ALL_FAULT_TYPES,
            variables: { page, size },
            fetchPolicy: 'no-cache',
        });
        return data.allImprovementPlanFaultTypes;
    }
);

export const fetchFaultTypeById = createAsyncThunk<GetImprovementPlanFaultTypeByIdQuery['improvementPlanFaultTypeById'], GetImprovementPlanFaultTypeByIdQueryVariables
>(
    'faultType/fetchById',
    async ({ id }) => {
        const { data } = await client.query<GetImprovementPlanFaultTypeByIdQuery, GetImprovementPlanFaultTypeByIdQueryVariables>({
            query: GET_FAULT_TYPE_BY_ID,
            variables: { id },
        });
        return data.improvementPlanFaultTypeById;
    }
);

// export const addFaultType = createAsyncThunk<any, any, {}>(); // Comentado por ahora - se implementará cuando sea necesario

// Helper to normalize GraphQL items to the local ImprovementPlanFaultType shape
const transformGraphQLToFaultTypeItem = (item: any): ImprovementPlanFaultType => {
    // Map known fields and spread the rest to preserve additional properties
    return {
        id: item.id,
        // Accept both backend variants: prefer `name` if present, fall back to `faulType`
        name: item.name ?? item.faulType ?? '',
        description: item.description ?? '',
        ...item,
    } as ImprovementPlanFaultType;
};

export const addFaultType = createAsyncThunk<
    AddImprovementPlanFaultTypeMutation['addImprovementPlanFaultType'],
    AddImprovementPlanFaultTypeMutationVariables
>(
    'faultType/add',
    async (variables) => {
        const { data } = await client.mutate<AddImprovementPlanFaultTypeMutation, AddImprovementPlanFaultTypeMutationVariables>({
            mutation: ADD_FAULT_TYPE,
            variables,
        });
        return data?.addImprovementPlanFaultType as AddImprovementPlanFaultTypeMutation['addImprovementPlanFaultType'];
    }
);

export const updateFaultType = createAsyncThunk<
    UpdateImprovementPlanFaultTypeMutation['updateImprovementPlanFaultType'],
    UpdateImprovementPlanFaultTypeMutationVariables
>(
    'faultType/update',
    async (variables) => {
        const { data } = await client.mutate<UpdateImprovementPlanFaultTypeMutation, UpdateImprovementPlanFaultTypeMutationVariables>({
            mutation: UPDATE_FAULT_TYPE,
            variables,
        });
        return data?.updateImprovementPlanFaultType as UpdateImprovementPlanFaultTypeMutation['updateImprovementPlanFaultType'];
    }
);

export const deleteFaultType = createAsyncThunk<
    DeleteImprovementPlanFaultTypeMutation['deleteImprovementPlanFaultType'],
    DeleteImprovementPlanFaultTypeMutationVariables
>(
    'faultType/delete',
    async (variables) => {
        const { data } = await client.mutate<DeleteImprovementPlanFaultTypeMutation, DeleteImprovementPlanFaultTypeMutationVariables>({
            mutation: DELETE_FAULT_TYPE,
            variables,
        });
        return data?.deleteImprovementPlanFaultType as DeleteImprovementPlanFaultTypeMutation['deleteImprovementPlanFaultType'];
    }
);

const initialState = createInitialPaginatedState<ImprovementPlanFaultType>();

const faultTypeSlice = createSlice({
    name: 'faultType',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchFaultTypes
            .addCase(fetchFaultTypes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFaultTypes.fulfilled, (state, action: PayloadAction<any>) => {
                if (action.payload?.data) {
                    // Filtrar items null y transformar
                    const mappedItems = action.payload.data
                        .filter((item: any): item is NonNullable<typeof item> => item !== null)
                        .map(transformGraphQLToFaultTypeItem);

                    // Eliminar duplicados basados en ID
                    const uniqueItems = Array.from(
                        new Map(mappedItems.map((item: ImprovementPlanFaultType) => [item.id, item])).values()
                    ) as ImprovementPlanFaultType[];

                    console.log('Tipos de falta después de eliminar duplicados:', uniqueItems);
                    state.data = uniqueItems;
                    state.totalItems = action.payload.totalItems ?? 0;
                    state.totalPages = action.payload.totalPages ?? 0;
                    state.currentPage = action.payload.currentPage ?? 0;
                }
                state.loading = false;
            })
            .addCase(fetchFaultTypes.rejected, (state, action) => {
                state.error = action.error.message || 'Error fetching fault types';
                state.loading = false;
            })
            // fetchFaultTypeById
            .addCase(fetchFaultTypeById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFaultTypeById.fulfilled, (state, action: PayloadAction<GetImprovementPlanFaultTypeByIdQuery['improvementPlanFaultTypeById']>) => {
                const payload = action.payload;
                if (payload?.data) {
                    // Normalize the single item using the same transformer
                    const item = payload.data;
                    const mapped = transformGraphQLToFaultTypeItem(item);
                    state.data = [mapped];
                }
                state.loading = false;
            })
            .addCase(fetchFaultTypeById.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
                state.loading = false;
            })
            // addFaultType
            .addCase(addFaultType.fulfilled, (state, action: PayloadAction<AddImprovementPlanFaultTypeMutation['addImprovementPlanFaultType']>) => {
                state.error = null;
            })
            .addCase(addFaultType.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            })
            // updateFaultType
            .addCase(updateFaultType.fulfilled, (state, action: PayloadAction<UpdateImprovementPlanFaultTypeMutation['updateImprovementPlanFaultType']>) => {
                state.error = null;
            })
            .addCase(updateFaultType.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            })
            // deleteFaultType
            .addCase(deleteFaultType.fulfilled, (state, action) => {
                // action.payload is the mutation result (likely an object with an `id`), so read id safely
                const payload = action.payload as DeleteImprovementPlanFaultTypeMutation['deleteImprovementPlanFaultType'] | null | undefined;
                const id = payload?.id as string | undefined;
                if (id) {
                    state.data = state.data.filter((faultType: ImprovementPlanFaultType) => faultType.id !== id);
                }
                state.error = null;
            })
            .addCase(deleteFaultType.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            });
    }
});

export const { } = faultTypeSlice.actions;
export default faultTypeSlice.reducer;