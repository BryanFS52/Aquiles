import { client } from '@/lib/apollo-client'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { GET_ALL_ATTENDANCES, GET_ATTENDANCE_BY_ID, ADD_ATTENDANCE, UPDATE_ATTENDANCE, DELETE_ATTENDANCE } from '@graphql/attendancesGraph'

export const fetchAttendances = createAsyncThunk(
    'attendance/fetchAll',
    async ({ page, size }) => {
        const { data } = await client.query({
            query: GET_ALL_ATTENDANCES,
            variables: { page, size },
            fetchPolicy: 'no-cache',
        });
        return data.allAttendances;
    }
);

export const fetchAttendanceById = createAsyncThunk(
    'attendance/fetchById',
    async ({ id }) => {
        const { data } = await client.query({
            query: GET_ATTENDANCE_BY_ID,
            variables: { id },
        });
        return data.attendanceById;
    }
);

export const addAttendance = createAsyncThunk(
    'attendance/add',
    async (input, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate({
                mutation: ADD_ATTENDANCE,
                variables: { input }
            });
            const { addAttendance } = data;
            if (addAttendance.code !== "200") {
                return rejectWithValue({ code: addAttendance.code, message: addAttendance.message });
            }
            return { ...input, id: addAttendance.id };
        } catch (error) {
            return rejectWithValue({ code: "500", message: error.message });
        }
    }
);

export const updateAttendance = createAsyncThunk(
    'attendance/update',
    async ({ id, input }, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate({
                mutation: UPDATE_ATTENDANCE,
                variables: { id, input },
            });
            return data.updateAttendance;
        } catch (error) {
            return rejectWithValue({ code: "500", message: error.message })
        }
    }
);

export const deleteAttendance = createAsyncThunk(
    'attendance/delete',
    async (id, { rejectWithValue }) => {
        try {
            await client.mutate({
                mutation: DELETE_ATTENDANCE,
                variables: { id },
            });
            return id;
        } catch (error) {
            return rejectWithValue({ code: "500", message: error.message })
        }
    }
);

const attendanceSlice = createSlice({
    name: 'attendance',
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
                state.data = action.payload; // Guardamos la información del attendance
                state.loading = false;
            })
            .addCase(fetchAttendanceById.rejected, (state, action) => {
                const { code, message } = action.payload || {};
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
                const index = state.data.findIndex((attendance) => attendance.id === id);
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
                state.data = state.data.filter((attendance) => attendance.id !== action.payload);
                state.error = null;
            })
            .addCase(deleteAttendance.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
            });
    }
});

export const { } = attendanceSlice.actions;

export default attendanceSlice.reducer;