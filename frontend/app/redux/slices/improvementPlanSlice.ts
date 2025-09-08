import { clientLAN } from '@lib/apollo-client'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createInitialPaginatedState, RejectedPayload } from '@type/slices/common/generic'
import { GET_ALL_IMPROVEMENT_PLANS, GET_IMPROVEMENT_PLAN_BY_ID, ADD_IMPROVEMENT_PLAN, UPDATE_IMPROVEMENT_PLAN, DELETE_IMPROVEMENT_PLAN } from '@graphql/improvementPlanGraph'
import {
    ImprovementPlan as BaseImprovementPlan,
    ImprovementPlanFaultType,
    GetAllImprovementPlansQuery,
    GetAllImprovementPlansQueryVariables,
    GetImprovementPlanByIdQuery,
    GetImprovementPlanByIdQueryVariables,
    AddImprovementPlanMutation,
    AddImprovementPlanMutationVariables,
    UpdateImprovementPlanMutation,
    UpdateImprovementPlanMutationVariables,
    DeleteImprovementPlanMutation,
    DeleteImprovementPlanMutationVariables
} from '@graphql/generated'

// Tipo extendido para incluir faultType
export interface ImprovementPlan extends Omit<BaseImprovementPlan, 'faultType'> {
    faultType?: ImprovementPlanFaultType;
}


// Función para transformar datos de GraphQL a ImprovementPlan
const transformGraphQLToImprovementPlanItem = (graphqlData: any): ImprovementPlan => {
  return {
    id: graphqlData.id,
    city: graphqlData.city,
    date: graphqlData.date,
    reason: graphqlData.reason,
    qualification: graphqlData.qualification,
    state: graphqlData.state,
    student: graphqlData.student
      ? {
          id: graphqlData.student.id,
          person: {
            id: graphqlData.student.person?.id,
            name: graphqlData.student.person?.name,
            lastname: graphqlData.student.person?.lastname,
            document: graphqlData.student.person?.document,
          },
        }
      : null,
    teacherCompetence: graphqlData.teacherCompetence
      ? {
          id: graphqlData.teacherCompetence.id,
          competence: {
            id: graphqlData.teacherCompetence.competence?.id,
            name: graphqlData.teacherCompetence.competence?.name,
          },
        }
      : null,
    faultType: graphqlData.faultType
      ? {
          id: graphqlData.faultType.id,
          name: graphqlData.faultType.name,
        }
      : undefined,
  };
};

export const fetchImprovementPlans = createAsyncThunk<GetAllImprovementPlansQuery['allImprovementPlans'], GetAllImprovementPlansQueryVariables>(
    'improvementPlan/fetchAll',
    async ({ page, size, teacherCompetence }) => {
        const { data } = await clientLAN.query<GetAllImprovementPlansQuery, GetAllImprovementPlansQueryVariables>({
            query: GET_ALL_IMPROVEMENT_PLANS,
            variables: { page, size, teacherCompetence },
            fetchPolicy: 'no-cache',
        });
        return data.allImprovementPlans;
    }
);

export const fetchImprovementPlanById = createAsyncThunk<GetImprovementPlanByIdQuery['improvementPlanById'], GetImprovementPlanByIdQueryVariables>(
    'improvementPlan/fetchById',
    async ({ id }) => {
        const { data } = await clientLAN.query<GetImprovementPlanByIdQuery, GetImprovementPlanByIdQueryVariables>({
            query: GET_IMPROVEMENT_PLAN_BY_ID,
            variables: { id },
        });
        return data.improvementPlanById;
    }
);

export const addImprovementPlan = createAsyncThunk<AddImprovementPlanMutation['addImprovementPlan'], AddImprovementPlanMutationVariables['input'],
    { rejectValue: { code: string; message: string } }
>(
    'improvementPlan/add',
    async (input, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.mutate<AddImprovementPlanMutation, AddImprovementPlanMutationVariables>({
                mutation: ADD_IMPROVEMENT_PLAN,
                variables: { input }
            });
            const res = data?.addImprovementPlan;

            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }
            return res;
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

export const updateImprovementPlan = createAsyncThunk<UpdateImprovementPlanMutation['updateImprovementPlan'], UpdateImprovementPlanMutationVariables,
    { rejectValue: { code: string; message: string } }
>(
    'improvementPlan/update',
    async ({ id, input }, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.mutate<UpdateImprovementPlanMutation, UpdateImprovementPlanMutationVariables>({
                mutation: UPDATE_IMPROVEMENT_PLAN,
                variables: { id, input },
            });
            const res = data?.updateImprovementPlan;
            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }

            return res;
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

export const deleteImprovementPlan = createAsyncThunk<string, string,
    { rejectValue: { code: string; message: string } }
>(
    'checklist/delete',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.mutate<DeleteImprovementPlanMutation, DeleteImprovementPlanMutationVariables>({
                mutation: DELETE_IMPROVEMENT_PLAN,
                variables: { id },
            });

            const res = data?.deleteImprovementPlan;
            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }

            return id; // Devolvemos solo el ID borrado para actualizar el estado
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

const initialState = createInitialPaginatedState<ImprovementPlan>();
const improvementPlanSlice = createSlice({
    name: 'improvementPlan',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchImprovementPlans
            .addCase(fetchImprovementPlans.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchImprovementPlans.fulfilled, (state, action: PayloadAction<any>) => {
                if (action.payload?.data) {
                    state.data = action.payload.data
                        .filter((item: any): item is NonNullable<typeof item> => item !== null)
                        .map(transformGraphQLToImprovementPlanItem);
                    state.totalItems = action.payload.totalItems ?? 0;
                    state.totalPages = action.payload.totalPages ?? 0;
                    state.currentPage = action.payload.currentPage ?? 0;
                }
                state.loading = false;
            })
            .addCase(fetchImprovementPlans.rejected, (state, action) => {
                state.error = action.error.message || 'Error fetching improvement plans';
                state.loading = false;
            })
            // fetchImprovementPlanById
            .addCase(fetchImprovementPlanById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchImprovementPlanById.fulfilled, (state, action: PayloadAction<any>) => {
                if (action.payload?.data) {
                    state.data = [transformGraphQLToImprovementPlanItem(action.payload.data)];
                }
                state.loading = false;
            })
            .addCase(fetchImprovementPlanById.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
                state.loading = false;
            })
            // addImprovementPlan
            .addCase(addImprovementPlan.fulfilled, (state, action: PayloadAction<any>) => {
                if (action.payload) {
                    const newItem = transformGraphQLToImprovementPlanItem(action.payload);
                    state.data.push(newItem);
                }
                state.error = null;
            })
            .addCase(addImprovementPlan.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            })
            // updateImprovementPlan
            .addCase(updateImprovementPlan.fulfilled, (state, action: PayloadAction<any>) => {
                if (action.payload) {
                    const updatedItem = transformGraphQLToImprovementPlanItem(action.payload);
                    const index = state.data.findIndex((item: ImprovementPlan) => item.id === updatedItem.id);
                    if (index !== -1) {
                        state.data[index] = updatedItem;
                    }
                }
                state.error = null;
            })
            .addCase(updateImprovementPlan.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            })
            // deleteImprovementPlan
            .addCase(deleteImprovementPlan.fulfilled, (state, action: PayloadAction<string>) => {
                if (action.payload) {
                    state.data = state.data.filter((item: ImprovementPlan) => item.id !== action.payload);
                }
                state.error = null;
            })
            .addCase(deleteImprovementPlan.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            });
    }
});

export const { } = improvementPlanSlice.actions;
export default improvementPlanSlice.reducer;