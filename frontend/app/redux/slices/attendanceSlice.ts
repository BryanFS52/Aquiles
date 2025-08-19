import { clientLAN } from '@lib/apollo-client';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GET_ALL_ATTENDANCES, GET_ATTENDANCES_BY_STUDENT, GET_ATTENDANCES_AND_JUSTIFICATIONS_BY_STUDENT, ADD_ATTENDANCE, UPDATE_ATTENDANCE, DELETE_ATTENDANCE } from '@graphql/attendancesGraph';
import { createInitialPaginatedState, RejectedPayload } from '@type/slices/common/generic';
import {
    Attendance,
    GetAttendancesQuery,
    GetAttendancesQueryVariables,
    AddAttendanceMutation,
    AddAttendanceMutationVariables,
    UpdateAttendanceMutation,
    UpdateAttendanceMutationVariables,
    DeleteAttendanceMutation,
    DeleteAttendanceMutationVariables,
    AllAttendancesByStudentIdQuery,
    AllAttendancesByStudentIdQueryVariables,
} from '@graphql/generated';

const transformGraphQLToAttendanceItem = (graphqlData: any): Attendance => {
    return {
        id: graphqlData.id,
        attendanceDate: graphqlData.attendanceDate,
        attendanceState: {
            id: graphqlData.attendanceState?.id ?? '',
            status: graphqlData.attendanceState?.status ?? '',
        },
        competenceQuarter: graphqlData.competenceQuarter ?? '',
        student: {
            id: graphqlData.student?.id ?? '',
            person: {
                name: graphqlData.student?.person?.name ?? '',
                lastname: graphqlData.student?.person?.lastname ?? '',
                document: graphqlData.student?.person?.document ?? '',
            }
        }
    };
}


export const fetchAttendances = createAsyncThunk<
    GetAttendancesQuery['allAttendances'],
    GetAttendancesQueryVariables
>(
    'attendance/fetchAll',
    async ({ page, size }) => {
        const { data } = await clientLAN.query<GetAttendancesQuery, GetAttendancesQueryVariables>({
            query: GET_ALL_ATTENDANCES,
            variables: { page, size },
            fetchPolicy: 'no-cache',
        });
        return data.allAttendances;
    }
);

export const fetchAttendancesByStudent = createAsyncThunk<
    Attendance[],
    AllAttendancesByStudentIdQueryVariables
>(
    'attendance/fetchByStudent',
    async ({ id, stateId }, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.query<
                AllAttendancesByStudentIdQuery,
                AllAttendancesByStudentIdQueryVariables
            >({
                query: GET_ATTENDANCES_BY_STUDENT,
                variables: { id, stateId },
                fetchPolicy: 'no-cache',
            });

            const raw = data?.allAttendancesByStudentId?.data;

            if (!raw) return [];

            const cleanData = raw.filter((a): a is NonNullable<typeof a> & { id: string } => !!a && !!a.id);

            return cleanData.map(transformGraphQLToAttendanceItem);
        } catch (error) {
            console.error("Error al obtener asistencias por estudiante", error);
            return rejectWithValue({ message: (error as Error).message || 'Unknown error' });
        }
    }
);

export const fetchAttendancesAndJustificationsByStudent = createAsyncThunk<
    any, // Reemplazar con el tipo correcto una vez generado
    { id: number }
>(
    'attendance/fetchWithJustifications',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.query({
                query: GET_ATTENDANCES_AND_JUSTIFICATIONS_BY_STUDENT,
                variables: { id },
                fetchPolicy: 'no-cache',
            });
            return data.allAttendancesByStudentId.data;
        } catch (error) {
            return rejectWithValue({ message: (error as Error).message });
        }
    }
);

export const addAttendance = createAsyncThunk<AddAttendanceMutation['addAttendance'], AddAttendanceMutationVariables['input'],
    { rejectValue: { code: string; message: string } }
>(
    'attendance/add',
    async (input, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.mutate<AddAttendanceMutation, AddAttendanceMutationVariables>({
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
            const { data } = await clientLAN.mutate<UpdateAttendanceMutation, UpdateAttendanceMutationVariables>({
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

export const deleteAttendance = createAsyncThunk<string, string,
    { rejectValue: { code: string; message: string } }
>(
    'attendance/delete',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.mutate<DeleteAttendanceMutation, DeleteAttendanceMutationVariables>({
                mutation: DELETE_ATTENDANCE,
                variables: { id },
            });

            const res = data?.deleteAttendance;
            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }

            return id;
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

const initialState = {
    ...createInitialPaginatedState<Attendance>(),
    studentAttendances: {
        data: [] as Attendance[],
        loading: false,
        error: null as string | null,
        showForm: false,
    },
    justifications: [] as any[],
    justificationsLoading: false,
};

const attendanceSlice = createSlice({
    name: 'attendance',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAttendances.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAttendances.fulfilled, (state, action: PayloadAction<GetAttendancesQuery['allAttendances']>) => {
                const payload = action.payload;
                if (payload?.data) {
                    state.data = payload.data
                        .filter((item): item is NonNullable<typeof item> => item !== null)
                        .map(transformGraphQLToAttendanceItem);
                    state.totalItems = payload.totalItems ?? 0;
                    state.totalPages = payload.totalPages ?? 0;
                    state.currentPage = payload.currentPage ?? 0;
                }
                state.loading = false;
            })
            .addCase(fetchAttendances.rejected, (state, action) => {
                state.error = action.error.message || 'Error fetching attendances';
                state.loading = false;
            })
            .addCase(fetchAttendancesByStudent.pending, (state) => {
                state.studentAttendances.loading = true;
                state.studentAttendances.error = null;
            })
            .addCase(fetchAttendancesByStudent.fulfilled, (
                state,
                action: PayloadAction<Attendance[]>
            ) => {
                state.studentAttendances.data = action.payload;
                state.studentAttendances.loading = false;
                state.studentAttendances.error = null;
            })
            .addCase(fetchAttendancesByStudent.rejected, (state, action) => {
                state.studentAttendances.loading = false;
                state.studentAttendances.error = (action.payload as RejectedPayload)?.message ?? action.error.message ?? 'Error al cargar asistencias del estudiante';
            })
            .addCase(fetchAttendancesAndJustificationsByStudent.pending, (state) => {
                state.justificationsLoading = true;
            })
            .addCase(fetchAttendancesAndJustificationsByStudent.fulfilled, (state, action) => {
                const justifications = action.payload
                    .filter((j: any) => j !== null);
                state.justifications = justifications;
                state.loading = false;
            })
            .addCase(fetchAttendancesAndJustificationsByStudent.rejected, (state, action) => {
                state.error = (action.payload as RejectedPayload)?.message ?? 'Error fetching justifications';
                state.loading = false;
            })
            .addCase(addAttendance.fulfilled, (state, action: PayloadAction<AddAttendanceMutation['addAttendance']>) => {
                if (action.payload && action.payload.id) {
                    const newAttendance = transformGraphQLToAttendanceItem(action.payload);
                    state.data.push(newAttendance);
                }
                state.error = null;
            })
            .addCase(addAttendance.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            })
            .addCase(updateAttendance.fulfilled, (state, action: PayloadAction<UpdateAttendanceMutation['updateAttendance']>) => {
                if (action.payload && action.payload.id) {
                    const updatedAttendance = transformGraphQLToAttendanceItem(action.payload);
                    const index = state.data.findIndex((attendance: Attendance) => attendance.id === updatedAttendance.id);
                    if (index !== -1) {
                        state.data[index] = updatedAttendance;
                    }
                }
                state.error = null;
            })
            .addCase(updateAttendance.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            })
            .addCase(deleteAttendance.fulfilled, (state, action: PayloadAction<string>) => {
                if (action.payload) {
                    state.data = state.data.filter((attendance: Attendance) => attendance.id !== action.payload);
                }
                state.error = null;
            })
            .addCase(deleteAttendance.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            });
    }
});

export const { } = attendanceSlice.actions;

export default attendanceSlice.reducer;