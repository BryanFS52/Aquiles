import { clientLAN } from '@lib/apollo-client';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createInitialPaginatedState, RejectedPayload } from '@type/slices/common/generic';
import { GET_ALL_IMPROVEMENT_PLANS, GET_IMPROVEMENT_PLAN_BY_ID, ADD_IMPROVEMENT_PLAN, UPDATE_IMPROVEMENT_PLAN, DELETE_IMPROVEMENT_PLAN } from '@graphql/improvementPlanGraph';
import { GET_TEACHER_COMPETENCES_BY_STUDY_SHEET } from '@graphql/olympo/studySheetGraph';
import {
    ImprovementPlan,
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

// Tipo para competencias del instructor
export interface TeacherCompetence {
    id: string;
    competence: {
        id: string;
        name: string;
    };
}

export const fetchImprovementPlans = createAsyncThunk<GetAllImprovementPlansQuery['allImprovementPlans'], GetAllImprovementPlansQueryVariables>(
    'improvementPlan/fetchAll',
    async ({ page, size, teacherCompetence }) => {
        try {
            const { data } = await clientLAN.query<GetAllImprovementPlansQuery, GetAllImprovementPlansQueryVariables>({
                query: GET_ALL_IMPROVEMENT_PLANS,
                variables: {
                    page,
                    size,
                    teacherCompetence: teacherCompetence as any,
                } as any,
                fetchPolicy: 'no-cache',
            });
            return data.allImprovementPlans;
        } catch (error: any) {
            console.error("Error fetching improvement plans:", error);
            throw error;
        }
    }
);

export const fetchImprovementPlanById = createAsyncThunk<GetImprovementPlanByIdQuery['improvementPlanById'], GetImprovementPlanByIdQueryVariables, { rejectValue: { code: string; message: string } }>(
    'improvementPlan/fetchById',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.query<GetImprovementPlanByIdQuery, GetImprovementPlanByIdQueryVariables>({
                query: GET_IMPROVEMENT_PLAN_BY_ID,
                variables: { id },
                fetchPolicy: 'no-cache',
            });
            return data.improvementPlanById;
        } catch (error: any) {
            console.error("Apollo error:", error);
            return rejectWithValue({ code: '500', message: error.message });
        }
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
    'improvementPlan/delete',
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

            return id;
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

// Nuevo thunk para obtener competencias del instructor por ficha
export const fetchTeacherCompetencesByStudySheet = createAsyncThunk<TeacherCompetence[], { studySheetId: string; teacherId: string }>(
    'improvementPlan/fetchTeacherCompetencesByStudySheet',
    async ({ studySheetId, teacherId }) => {
        try {
            const { data } = await clientLAN.query({
                query: GET_TEACHER_COMPETENCES_BY_STUDY_SHEET,
                variables: { id: parseInt(studySheetId), teacherId: parseInt(teacherId) },
                fetchPolicy: 'no-cache',
            });
            
            const result = data.studySheetById?.data?.teacherStudySheets?.map((item: any) => ({
                id: item.id,
                competence: {
                    id: item.competence.id,
                    name: item.competence.name,
                },
            })) || [];
            
            return result;
        } catch (error) {
            console.error('Error fetching teacher competences:', error);
            throw error;
        }
    }
);

const initialState = {
    ...createInitialPaginatedState<ImprovementPlan>(),
    teacherCompetences: [] as TeacherCompetence[],
    loadingCompetences: false,
};

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
            .addCase(fetchImprovementPlans.fulfilled, (state, action) => {
                if (action.payload?.data) {
                    state.data = action.payload.data
                        .filter((item): item is NonNullable<typeof item> => item !== null);

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
            .addCase(fetchImprovementPlanById.fulfilled, (state, action: PayloadAction<GetImprovementPlanByIdQuery['improvementPlanById']>) => {
                if (action.payload?.data) {
                    state.data = [action.payload.data as ImprovementPlan];
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
            .addCase(addImprovementPlan.fulfilled, (state, action: PayloadAction<AddImprovementPlanMutation['addImprovementPlan']>) => {
                if (action.payload) {
                    state.data.push(action.payload as ImprovementPlan);
                }
                state.error = null;
            })
            .addCase(addImprovementPlan.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            })
            // updateImprovementPlan
            .addCase(updateImprovementPlan.fulfilled, (state, action: PayloadAction<UpdateImprovementPlanMutation['updateImprovementPlan']>) => {
                if (action.payload) {
                    const updatedItem = action.payload as ImprovementPlan;
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
            })
            // fetchTeacherCompetencesByStudySheet
            .addCase(fetchTeacherCompetencesByStudySheet.pending, (state) => {
                state.loadingCompetences = true;
            })
            .addCase(fetchTeacherCompetencesByStudySheet.fulfilled, (state, action: PayloadAction<TeacherCompetence[]>) => {
                state.teacherCompetences = action.payload;
                state.loadingCompetences = false;
            })
            .addCase(fetchTeacherCompetencesByStudySheet.rejected, (state, action) => {
                state.error = action.error.message || 'Error fetching teacher competences';
                state.loadingCompetences = false;
            });
    }
});

export const { } = improvementPlanSlice.actions;
export default improvementPlanSlice.reducer;