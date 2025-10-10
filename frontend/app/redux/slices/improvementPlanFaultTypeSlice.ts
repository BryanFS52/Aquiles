import { clientLAN } from '@lib/apollo-client'
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

export const fetchFaultTypes = createAsyncThunk<GetAllImprovementPlanFaultTypesQuery['allImprovementPlanFaultTypes'],GetAllImprovementPlanFaultTypesQueryVariables
>(
    'faultType/fetchAll',
    async ({ page, size }) => {
        const { data } = await clientLAN.query<GetAllImprovementPlanFaultTypesQuery, GetAllImprovementPlanFaultTypesQueryVariables>({
            query: GET_ALL_FAULT_TYPES,
            variables: { page, size },
            fetchPolicy: 'no-cache',
        });
        return data.allImprovementPlanFaultTypes;
    }
);

export const fetchFaultTypeById = createAsyncThunk<GetImprovementPlanFaultTypeByIdQuery['improvementPlanFaultTypeById'],GetImprovementPlanFaultTypeByIdQueryVariables
>(
    'faultType/fetchById',
    async ({ id }) => {
        const { data } = await clientLAN.query<GetImprovementPlanFaultTypeByIdQuery, GetImprovementPlanFaultTypeByIdQueryVariables>({
            query: GET_FAULT_TYPE_BY_ID,
            variables: { id },
        });
        return data.improvementPlanFaultTypeById;
    }
);

export const addFaultType = createAsyncThunk<AddImprovementPlanFaultTypeMutation['addImprovementPlanFaultType'],AddImprovementPlanFaultTypeMutationVariables['input'],
    { rejectValue: { code: string; message: string } }
>(
    'faultType/add',
    async (input, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.mutate<AddImprovementPlanFaultTypeMutation, AddImprovementPlanFaultTypeMutationVariables>({
                mutation: ADD_FAULT_TYPE,
                variables: { input },
            });
            const res = data?.addImprovementPlanFaultType;
            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }
            return res;
        } catch (error: any) {
            return rejectWithValue({ code: error?.code ?? '500', message: error?.message ?? 'Unknown error' });
        }
    }
);

export const updateFaultType = createAsyncThunk<UpdateImprovementPlanFaultTypeMutation['updateImprovementPlanFaultType'],UpdateImprovementPlanFaultTypeMutationVariables,
    { rejectValue: { code: string; message: string } }
>(
    'faultType/update',
    async ({ id, input }, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.mutate<UpdateImprovementPlanFaultTypeMutation, UpdateImprovementPlanFaultTypeMutationVariables>({
                mutation: UPDATE_FAULT_TYPE,
                variables: { id, input },
            });
            const res = data?.updateImprovementPlanFaultType;
            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }
            return res;
        } catch (error: any) {
            return rejectWithValue({ code: error?.code ?? '500', message: error?.message ?? 'Unknown error' });
        }
    }
);

export const deleteFaultType = createAsyncThunk<string, string,
    { rejectValue: { code: string; message: string } }
>(
    'faultType/delete',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.mutate<DeleteImprovementPlanFaultTypeMutation, DeleteImprovementPlanFaultTypeMutationVariables>({
                mutation: DELETE_FAULT_TYPE,
                variables: { id },
            });
            const res = data?.deleteImprovementPlanFaultType;
            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }
            return id;
        } catch (error: any) {
            return rejectWithValue({ code: error?.code ?? '500', message: error?.message ?? 'Unknown error' });
        }
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
            .addCase(fetchFaultTypes.fulfilled, (state, action: PayloadAction<GetAllImprovementPlanFaultTypesQuery['allImprovementPlanFaultTypes']>) => {
                const payload = action.payload;
                if (payload?.data) {
                    state.data = payload.data.filter((item): item is NonNullable<typeof item> => item !== null) as ImprovementPlanFaultType[];
                    state.totalItems = payload.totalItems ?? 0;
                    state.totalPages = payload.totalPages ?? 0;
                    state.currentPage = payload.currentPage ?? 0;
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
                    state.data = [payload.data].filter((item): item is NonNullable<typeof item> => item !== null) as ImprovementPlanFaultType[];
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
            .addCase(deleteFaultType.fulfilled, (state, action: PayloadAction<string>) => {
                if (action.payload) {
                    state.data = state.data.filter((faultType: ImprovementPlanFaultType) => faultType.id !== action.payload);
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