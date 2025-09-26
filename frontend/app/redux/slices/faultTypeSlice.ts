import { clientLAN } from '@lib/apollo-client'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createInitialPaginatedState, RejectedPayload } from '@type/slices/common/generic'
import { GET_ALL_FAULT_TYPES, GET_FAULT_TYPE_BY_ID } from '@graphql/improvementPlanFaultTypeGraph'
import {ImprovementPlanFaultType } from '@graphql/generated'

// Función para transformar datos de GraphQL a ImprovementPlanFaultType
const transformGraphQLToFaultTypeItem = (graphqlData: any): ImprovementPlanFaultType => {
    return {
        id: graphqlData.id,
        name: graphqlData.name,
    };
};

export const fetchFaultTypes = createAsyncThunk<any, any>(
    'faultType/fetchAll',
    async ({ page, size }) => {
        const { data } = await clientLAN.query<any, any>({
            query: GET_ALL_FAULT_TYPES,
            variables: { page, size },
            fetchPolicy: 'no-cache',
        });
        return data.allImprovementPlanFaultTypes;
    }
);

export const fetchFaultTypeById = createAsyncThunk<any, any>(
    'faultType/fetchById',
    async ({ id }) => {
        const { data } = await clientLAN.query<any, any>({
            query: GET_FAULT_TYPE_BY_ID,
            variables: { id },
        });
        return data.improvementPlanFaultTypeById;
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
            })
            .addCase(fetchFaultTypes.fulfilled, (state, action: PayloadAction<any>) => {
                if (action.payload?.data) {
                    state.data = action.payload.data
                        .filter((item: any): item is NonNullable<typeof item> => item !== null)
                        .map(transformGraphQLToFaultTypeItem);
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
            })
            .addCase(fetchFaultTypeById.fulfilled, (state, action: PayloadAction<any>) => {
                if (action.payload?.data) {
                    state.data = [transformGraphQLToFaultTypeItem(action.payload.data)];
                }
                state.loading = false;
            })
            .addCase(fetchFaultTypeById.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
                state.loading = false;
            });
    }
});

export const { } = faultTypeSlice.actions;
export default faultTypeSlice.reducer;
