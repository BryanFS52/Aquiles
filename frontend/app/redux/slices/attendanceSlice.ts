import { client } from '@lib/apollo-client'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { GET_ALL_ATTENDANCES, GET_ATTENDANCE_BY_ID, ADD_ATTENDANCE, UPDATE_ATTENDANCE, DELETE_ATTENDANCE } from '@graphql/attendancesGraph'
import {
    GetAttendancesQuery,
    GetAttendancesQueryVariables,
    GetAttendanceByIdQuery,
    GetAttendanceByIdQueryVariables,
    AddAttendanceMutation,
    AddAttendanceMutationVariables,
    UpdateAttendanceMutation,
    UpdateAttendanceMutationVariables,
    DeleteAttendanceMutation,
    DeleteAttendanceMutationVariables
} from '@graphql/generated'
import { AttendanceState, AttendanceItem, initialAttendanceState, RejectedPayload } from '@type/Slices/attendance'


export const fetchAttendances = createAsyncThunk<GetAttendancesQuery['allAttendances'], GetAttendancesQueryVariables>(
    'attendance/fetchAll',
    async ({ page, size }) => {
        const { data } = await client.query<GetAttendancesQuery, GetAttendancesQueryVariables>({
            query: GET_ALL_ATTENDANCES,
            variables: { page, size },
            fetchPolicy: 'no-cache',
        });
        return data.allAttendances;
    }
);

export const fetchAttendanceById = createAsyncThunk<GetAttendanceByIdQuery['attendanceById'], GetAttendanceByIdQueryVariables>(
    'attendance/fetchById',
    async ({ id }) => {
        const { data } = await client.query<GetAttendanceByIdQuery, GetAttendanceByIdQueryVariables>({
            query: GET_ATTENDANCE_BY_ID,
            variables: { id },
        });
        return data.attendanceById;
    }
);

export const addAttendance = createAsyncThunk<AddAttendanceMutation['addAttendance'], AddAttendanceMutationVariables['input'],
    { rejectValue: { code: string; message: string } }
>(
    'attendance/add',
    async (input, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate<AddAttendanceMutation, AddAttendanceMutationVariables>({
                mutation: ADD_ATTENDANCE,
                variables: { input }
            });
            const res = data?.addAttendance;

            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }
            return res;
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

export const updateAttendance = createAsyncThunk<UpdateAttendanceMutation['updateAttendance'], UpdateAttendanceMutationVariables,
    { rejectValue: { code: string; message: string } }
>(
    'attendance/update',
    async ({ id, input }, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate<UpdateAttendanceMutation, UpdateAttendanceMutationVariables>({
                mutation: UPDATE_ATTENDANCE,
                variables: { id, input },
            });

            const res = data?.updateAttendance;
            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }

            return res;
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

export const deleteAttendance = createAsyncThunk<DeleteAttendanceMutationVariables['id'],
    { rejectValue: { code: string; message: string } }
>(
    'attendance/delete',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate<DeleteAttendanceMutation, DeleteAttendanceMutationVariables>({
                mutation: DELETE_ATTENDANCE,
                variables: { id },
            });

            const res = data?.deleteAttendance;
            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }

            return id; // Devolvemos solo el ID borrado para actualizar el estado
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

const attendanceSlice = createSlice({
    name: 'attendance',
    initialState: initialAttendanceState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchAttendances
            .addCase(fetchAttendances.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAttendances.fulfilled, (state, action) => {
                state.data = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.loading = false;
            })
            .addCase(fetchAttendances.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })
            // fetchAttendanceById
            .addCase(fetchAttendanceById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAttendanceById.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(fetchAttendanceById.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
                state.loading = false;
            })
            // addAttendance
            .addCase(addAttendance.fulfilled, (state, action) => {
                state.data.push(action.payload);
                state.error = null;
            })
            .addCase(addAttendance.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
            })
            // updateAttendance
            .addCase(updateAttendance.fulfilled, (state, action) => {
                const { id, input } = action.payload;
                const index = state.data.findIndex((attendance: AttendanceItem) => attendance.id === id);
                if (index !== -1) {
                    state.data[index] = { ...state.data[index], ...input };
                }
                state.error = null;
            })
            .addCase(updateAttendance.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
            })
            // deleteAttendance
            .addCase(deleteAttendance.fulfilled, (state, action) => {
                state.data = state.data.filter((attendance: AttendanceItem) => attendance.id !== action.payload);
                state.error = null;
            })
            .addCase(deleteAttendance.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            })
    }
});

export const { } = attendanceSlice.actions;

export default attendanceSlice.reducer;