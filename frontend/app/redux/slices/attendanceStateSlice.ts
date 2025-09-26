import { clientLAN } from '@lib/apollo-client'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GET_ALL_ATTENDANCES_STATE, ADD_ATTENDANCE_STATE, UPDATE_ATTENDANCE_STATE, DELETE_ATTENDANCE_STATE } from '@graphql/attendanceStateGraph'
import { createInitialPaginatedState, RejectedPayload } from '@type/slices/common/generic'
import {
    AttendanceState,
    GetStateAttendanceQuery,
    GetStateAttendanceQueryVariables,
    AddStateAttendanceMutation,
    AddStateAttendanceMutationVariables,
    UpdateStateAttendanceMutation,
    UpdateStateAttendanceMutationVariables,
    DeleteStateAttendanceMutation,
    DeleteStateAttendanceMutationVariables
} from '@graphql/generated'

export const fetchAttendanceState = createAsyncThunk<GetStateAttendanceQuery['allStateAttendances'], GetStateAttendanceQueryVariables>(
    'attendanceState/fetchAll',
    async ({ page, size }) => {
        try {
            const { data } = await clientLAN.query<GetStateAttendanceQuery, GetStateAttendanceQueryVariables>({
                query: GET_ALL_ATTENDANCES_STATE,
                variables: { page, size },
                fetchPolicy: 'no-cache',
            });

            return data.allStateAttendances;
        } catch (error: any) {
            console.error('Error fetching attendance states:', error);
            throw error;
        }
    }
);

export const addAttendanceState = createAsyncThunk<AddStateAttendanceMutation['addStateAttendance'], AddStateAttendanceMutationVariables['input'],
    { rejectValue: { code: string; message: string } }
>(
    'attendanceState/add',
    async (input, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.mutate<AddStateAttendanceMutation, AddStateAttendanceMutationVariables>({
                mutation: ADD_ATTENDANCE_STATE,
                variables: { input }
            });
            const res = data?.addStateAttendance;

            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }
            return res;
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

export const updateAttendanceState = createAsyncThunk<UpdateStateAttendanceMutation['updateStateAttendance'],
    UpdateStateAttendanceMutationVariables,
    { rejectValue: { code: string; message: string } }
>(
    'attendanceState/update',
    async ({ id, input }, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.mutate<UpdateStateAttendanceMutation, UpdateStateAttendanceMutationVariables>({
                mutation: UPDATE_ATTENDANCE_STATE,
                variables: { id, input },
            });

            const res = data?.updateStateAttendance;
            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }

            return res;
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

export const deleteAttendanceState = createAsyncThunk<string, string,
    { rejectValue: { code: string; message: string } }
>(
    'attendanceState/delete',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.mutate<DeleteStateAttendanceMutation, DeleteStateAttendanceMutationVariables>({
                mutation: DELETE_ATTENDANCE_STATE,
                variables: { id },
            });

            const res = data?.deleteStateAttendance;

            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }

            return id; // Devolvemos solo el ID borrado para actualizar el estado
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);


const initialState = createInitialPaginatedState<AttendanceState>();
const attendanceStateSlice = createSlice({
    name: 'attendanceState',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            // fetchAttendanceState
            .addCase(fetchAttendanceState.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAttendanceState.fulfilled, (state, action: PayloadAction<GetStateAttendanceQuery['allStateAttendances']>) => {
                if (action.payload?.data) {
                    // Filtra nulls y usa los datos directamente
                    state.data = action.payload.data
                        .filter((item): item is NonNullable<typeof item> => item !== null);
                    state.totalItems = action.payload.totalItems ?? 0;
                    state.totalPages = action.payload.totalPages ?? 0;
                    state.currentPage = action.payload.currentPage ?? 0;
                }
                state.loading = false;
            })
            .addCase(fetchAttendanceState.rejected, (state, action) => {
                state.error = action.error.message || 'Error fetching attendance states';
                state.loading = false;
            })
            // addAttendanceState
            .addCase(addAttendanceState.fulfilled, (state, action: PayloadAction<AddStateAttendanceMutation['addStateAttendance']>) => {
                if (action.payload) {
                    // Usa el payload directamente sin transformación
                    state.data.push(action.payload as AttendanceState);
                }
                state.error = null;
            })
            .addCase(addAttendanceState.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            })
            // updateAttendanceState
            .addCase(updateAttendanceState.fulfilled, (state, action: PayloadAction<UpdateStateAttendanceMutation['updateStateAttendance']>) => {
                if (action.payload) {
                    // Usa el payload directamente y actualiza el elemento correspondiente
                    const updatedAttendanceState = action.payload as AttendanceState;
                    const index = state.data.findIndex((attendanceState: AttendanceState) => attendanceState.id === updatedAttendanceState.id);
                    if (index !== -1) {
                        state.data[index] = updatedAttendanceState;
                    }
                }
                state.error = null;
            })
            .addCase(updateAttendanceState.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            })
            // deleteAttendanceState
            .addCase(deleteAttendanceState.fulfilled, (state, action: PayloadAction<string>) => {
                if (action.payload) {
                    state.data = state.data.filter((attendanceState: AttendanceState) => attendanceState.id !== action.payload);
                }
                state.error = null;
            })
            .addCase(deleteAttendanceState.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            })
    },
})
export const { } = attendanceStateSlice.actions;

export default attendanceStateSlice.reducer;