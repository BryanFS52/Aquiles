import { client } from '@lib/apollo-client'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RejectedPayload } from '@type/slices/common/generic'
import { GET_ALL_IMPROVEMENT_PLAN_ACTIVITIES, ADD_IMPROVEMENT_PLAN_ACTIVITY } from '@graphql/improvementPlanActivityGraph'
import { ImprovementPlanDelivery, ImprovementPlanEvidenceType } from '@graphql/generated'

export const fetchImprovementPlanActivities = createAsyncThunk<any, { page?: number; size?: number; id?: number }>(
    'improvementPlanActivity/fetchActivities',
    async ({ page = 0, size = 100, id }) => {
        const { data } = await client.query({
            query: GET_ALL_IMPROVEMENT_PLAN_ACTIVITIES,
            variables: { page, size, id },
            fetchPolicy: 'no-cache'
        });
        return data.allImprovementPlanActivities;
    }
);

export const addImprovementPlanActivity = createAsyncThunk<any, any, { rejectValue: { code: string; message: string } }>(
    'improvementPlanActivity/add',
    async (input, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate({
                mutation: ADD_IMPROVEMENT_PLAN_ACTIVITY,
                variables: { input }
            });
            const res = data?.addImprovementPlanActivity;
            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Error al crear actividad' });
            }
            return res;
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

type ActivityState = {
    deliveries: ImprovementPlanDelivery[];
    evidenceTypes: ImprovementPlanEvidenceType[];
    loading: boolean;
    error: any | null;
}

const initialState: ActivityState = {
    deliveries: [],
    evidenceTypes: [],
    loading: false,
    error: null,
}

const slice = createSlice({
    name: 'improvementPlanActivity',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // activities -> extract deliveries and evidence types
            .addCase(fetchImprovementPlanActivities.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchImprovementPlanActivities.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const items = action.payload?.data || [];
                // collect unique deliveries
                const deliveriesMap = new Map<string, any>();
                const evidenceMap = new Map<string, any>();

                items.forEach((it: any) => {
                    const d = it?.improvementPlanDelivery;
                    if (d && d.id != null) deliveriesMap.set(String(d.id), d);
                    const evs = it?.evidenceTypes || [];
                    evs.forEach((ev: any) => {
                        if (ev && ev.id != null) evidenceMap.set(String(ev.id), ev);
                    });
                });

                state.deliveries = Array.from(deliveriesMap.values()).map((d: any) => ({ id: d.id, deliveryFormat: d.deliveryFormat })) as ImprovementPlanDelivery[];
                state.evidenceTypes = Array.from(evidenceMap.values()).map((ev: any) => ({ id: ev.id, name: ev.name })) as ImprovementPlanEvidenceType[];
            })
            .addCase(fetchImprovementPlanActivities.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

            // add activity
            .addCase(addImprovementPlanActivity.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(addImprovementPlanActivity.fulfilled, (state) => { state.loading = false; state.error = null; })
            .addCase(addImprovementPlanActivity.rejected, (state, action) => {
                state.loading = false;
                const payload = action.payload as RejectedPayload;
                state.error = payload || { message: action.error.message };
            })
            ;
    }
});

export default slice.reducer;
