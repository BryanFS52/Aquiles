import { client } from '@lib/apollo-client';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createInitialPaginatedState, RejectedPayload } from '@type/slices/common/generic';
import { GET_ALL_FINAL_REPORTS, GET_FINAL_REPORT_BY_ID, ADD_FINAL_REPORT, UPDATE_FINAL_REPORT, DELETE_FINAL_REPORT } from '@graphql/finalReportGraph';
import {
    FinalReport,
    GetAllFinalReportsQuery,
    GetAllFinalReportsQueryVariables,
    GetFinalReportByIdQuery,
    GetFinalReportByIdQueryVariables,
    AddFinalReportMutation,
    AddFinalReportMutationVariables,
    UpdateFinalReportMutation,
    UpdateFinalReportMutationVariables,
    DeleteFinalReportMutation,
    DeleteFinalReportMutationVariables,
} from '@graphql/generated';


export const fetchFinalReport = createAsyncThunk<GetAllFinalReportsQuery['allFinalReports'], GetAllFinalReportsQueryVariables
>(
    'finalReport/fetchAll',
    async ({ page, size }) => {
        const { data } = await client.query<GetAllFinalReportsQuery, GetAllFinalReportsQueryVariables>({
            query: GET_ALL_FINAL_REPORTS,
            variables: { page, size },
            fetchPolicy: 'no-cache',
        });
        return data.allFinalReports;
    }
);

export const fetchFinalReportById = createAsyncThunk<GetFinalReportByIdQuery['finalReportById'], GetFinalReportByIdQueryVariables,
    { rejectValue: { code: string; message: string } }
>(
    'finalReport/fetchById',
    async ({ id }, { rejectWithValue }) => {
        try {

            const { data } = await client.query<GetFinalReportByIdQuery, GetFinalReportByIdQueryVariables>({
                query: GET_FINAL_REPORT_BY_ID,
                variables: { id },
                fetchPolicy: 'no-cache',
            });
            return data.finalReportById;
        } catch (error: any) {
            console.error("Error fetching final report by ID:", error);
            return rejectWithValue({ code: '500', message: "Error fetching final report by ID" });
        }
    }
);


export const addFinalReport = createAsyncThunk<AddFinalReportMutation['addFinalReport'], AddFinalReportMutationVariables['input']
>(
    'finalReport/add',
    async (input, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate<AddFinalReportMutation, AddFinalReportMutationVariables>({
                mutation: ADD_FINAL_REPORT,
                variables: { input },
            });
            const res = data?.addFinalReport;
            // Aceptar 200/201 como éxito
            if (!res || (res.code !== '200' && res.code !== '201')) {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? "Error adding final report" });
            }
            return res;
        } catch (error: any) {
            console.error("Error adding final report:", error);
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

export const updateFinalReport = createAsyncThunk<UpdateFinalReportMutation['updateFinalReport'], UpdateFinalReportMutationVariables,
    { rejectValue: { code: string; message: string } }
>(
    'finalReport/update',
    async ({ id, input }, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate<UpdateFinalReportMutation, UpdateFinalReportMutationVariables>({
                mutation: UPDATE_FINAL_REPORT,
                variables: { id, input },
            });
            const res = data?.updateFinalReport;

            if (!res || res.code !== '200') {
                return rejectWithValue({ code: '500', message: "Error updating final report" });
            }
            return res;
        } catch (error: any) {
            console.error("Error updating final report:", error);
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);
// Delete: devolvemos el id eliminado en fulfilled para filtrar del estado
export const deleteFinalReport = createAsyncThunk<string | number, DeleteFinalReportMutationVariables['id'], { rejectValue: { code: string; message: string } }>(
    'finalReport/delete',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate<DeleteFinalReportMutation, DeleteFinalReportMutationVariables>({
                mutation: DELETE_FINAL_REPORT,
                variables: { id },
            });
            const res = data?.deleteFinalReport;
            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Error deleting final report' });
            }
            return id as string | number;
        } catch (error: any) {
            console.error('Error deleting final report:', error);
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

// Estado
interface FinalReportState extends ReturnType<typeof createInitialPaginatedState<FinalReport>> {
    selected: FinalReport | null;
}

const initialState: FinalReportState = {
    ...createInitialPaginatedState<FinalReport>(),
    selected: null,
};

const finalReportSlice = createSlice({
    name: 'finalReport',
    initialState,
    reducers: {
        clearSelectedFinalReport: (state) => {
            state.selected = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchFinalReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchFinalReport.fulfilled,
                (state, action: PayloadAction<GetAllFinalReportsQuery['allFinalReports']>) => {
                    const payload = action.payload;
                    if (payload?.data) {
                        state.data = payload.data.filter((i): i is NonNullable<typeof i> => i !== null) as FinalReport[];
                        state.totalItems = payload.totalItems ?? 0;
                        state.totalPages = payload.totalPages ?? 0;
                        state.currentPage = payload.currentPage ?? 0;
                    } else {
                        state.data = [] as FinalReport[];
                    }
                    state.loading = false;
                }
            )
            .addCase(fetchFinalReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Error fetching final reports';
            })

            // Fetch by id
            .addCase(fetchFinalReportById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchFinalReportById.fulfilled,
                (state, action: PayloadAction<GetFinalReportByIdQuery['finalReportById']>) => {
                    const payload = action.payload;
                    state.selected = (payload?.data ?? null) as FinalReport | null;
                    state.loading = false;
                }
            )
            .addCase(fetchFinalReportById.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as RejectedPayload)?.message ?? action.error.message ?? 'Error fetching final report by ID';
            })

            // Add
            .addCase(addFinalReport.fulfilled, (state, action: PayloadAction<AddFinalReportMutation['addFinalReport']>) => {
                state.error = null;
            })
            .addCase(addFinalReport.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            })

            // Update
            .addCase(updateFinalReport.fulfilled, (state, action: PayloadAction<UpdateFinalReportMutation['updateFinalReport']>) => {
                state.error = null;
            })
            .addCase(updateFinalReport.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            })

            // Delete
            .addCase(deleteFinalReport.fulfilled, (state, action: PayloadAction<string | number>) => {
                const removedId = action.payload;
                if (removedId !== undefined && removedId !== null) {
                    state.data = (state.data as FinalReport[]).filter((fr) => String(fr.id) !== String(removedId));
                }
                state.error = null;
            })
            .addCase(deleteFinalReport.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            });
    },
});

export const { } = finalReportSlice.actions;

export default finalReportSlice.reducer;