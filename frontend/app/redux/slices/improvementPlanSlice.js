import { client } from '@lib/apollo-client'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { GET_ALL_IMPROVEMENT_PLANS, GET_IMPROVEMENT_PLAN_BY_ID, ADD_IMPROVEMENT_PLAN, UPDATE_IMPROVEMENT_PLAN, DELETE_IMPROVEMENT_PLAN } from '@graphql/improvementPlanGraph'

export const fetchImprovementPlans = createAsyncThunk(
    'improvementPlan/fetchAll',
    async ({ page, size }) => {
        const { data } = await client.query({
            query: GET_ALL_IMPROVEMENT_PLANS,
            variables: { page, size },
            fetchPolicy: 'no-cache',
        });
        return data.allImprovementPlans;
    }
);

export const fetchImprovementPlanById = createAsyncThunk(
    'improvementPlan/fetchById',
    async ({ id }) => {
        const { data } = await client.query({
            query: GET_IMPROVEMENT_PLAN_BY_ID,
            variables: { id },
        });
        return data.improvementPlanById;
    }
);

export const addImprovementPlan = createAsyncThunk(
    'improvementPlan/add',
    async (input, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate({
                mutation: ADD_IMPROVEMENT_PLAN,
                variables: { input }
            });
            const { addImprovementPlan } = data;
            if (addImprovementPlan.code !== "200") {
                return rejectWithValue({ code: addImprovementPlan.code, message: addImprovementPlan.message });
            }
            return { ...input, id: addImprovementPlan.id };
        } catch (error) {
            return rejectWithValue({ code: "500", message: error.message });
        }
    }
);

export const updateImprovementPlan = createAsyncThunk(
    'improvementPlan/update',
    async ({ id, input }, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate({
                mutation: UPDATE_IMPROVEMENT_PLAN,
                variables: { id, input },
            });
            return data.updateImprovementPlan;
        } catch (error) {
            return rejectWithValue({ code: "500", message: error.message })
        }
    }
);

export const deleteImprovementPlan = createAsyncThunk(
    'improvementPlan/delete',
    async (id, { rejectWithValue }) => {
        try {
            await client.mutate({
                mutation: DELETE_IMPROVEMENT_PLAN,
                variables: { id },
            });
            return id;
        } catch (error) {
            return rejectWithValue({ code: "500", message: error.message })
        }
    }
);

const improvementPlanSlice = createSlice({
    name: 'improvementPlan',
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
            // fetchImprovementPlans
            .addCase(fetchImprovementPlans.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchImprovementPlans.fulfilled, (state, action) => {
                state.data = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.loading = false;
            })
            .addCase(fetchImprovementPlans.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })
            // fetchImprovementPlanById
            .addCase(fetchImprovementPlanById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchImprovementPlanById.fulfilled, (state, action) => {
                state.data = action.payload; // Guardamos la información del improvementPlan
                state.loading = false;
            })
            .addCase(fetchImprovementPlanById.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
                state.loading = false;
            })
            // addImprovementPlan
            .addCase(addImprovementPlan.fulfilled, (state, action) => {
                state.data.push(action.payload);
                state.error = null;
            })
            .addCase(addImprovementPlan.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
            })
            // updateImprovementPlan
            .addCase(updateImprovementPlan.fulfilled, (state, action) => {
                const { id, input } = action.payload;
                const index = state.data.findIndex((improvementPlan) => improvementPlan.id === id);
                if (index !== -1) {
                    state.data[index] = { ...state.data[index], ...input };
                }
                state.error = null;
            })
            .addCase(updateImprovementPlan.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
            })
            // deleteImprovementPlan
            .addCase(deleteImprovementPlan.fulfilled, (state, action) => {
                state.data = state.data.filter((improvementPlan) => improvementPlan.id !== action.payload);
                state.error = null;
            })
            .addCase(deleteImprovementPlan.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
            });
    }
});

export const { } = improvementPlanSlice.actions;

export default improvementPlanSlice.reducer;
