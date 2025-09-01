import { clientLAN } from '@lib/apollo-client';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GET_ALL_ATTENDANCES, GET_ATTENDANCES_BY_STUDENT, GET_ATTENDANCES_AND_COMPETENCE_BY_STUDENT, ADD_ATTENDANCE, UPDATE_ATTENDANCE, DELETE_ATTENDANCE } from '@graphql/attendancesGraph';
import { createInitialPaginatedState, RejectedPayload } from '@type/slices/common/generic';
import {
    Attendance,
    GetAttendancesQuery,
    GetAttendancesQueryVariables,
    GetAttendancesAndCompetenceByStudentIdQuery,
    GetAttendancesAndCompetenceByStudentIdQueryVariables,
    AddAttendanceMutation,
    AddAttendanceMutationVariables,
    UpdateAttendanceMutation,
    UpdateAttendanceMutationVariables,
    DeleteAttendanceMutation,
    DeleteAttendanceMutationVariables,
    AllAttendancesByStudentIdQuery,
    AllAttendancesByStudentIdQueryVariables,
} from '@graphql/generated';

interface FilterOptions {
    selectedFiltro: string;
    searchTerm: string;
}

export interface TransformedAttendanceItem {
    id: string;
    // programa: string;
    // ficha: string;
    // fecha: string;
    estado: string;
    documento: string;
    aprendiz: string;
}

export interface StudentSummary {
    id: number;
    documento: string;
    aprendiz: string;
    cantidad: number; // Total de ausencias e injustificadas
    consecutivas: number;
}

interface StudentAttendances {
    data: Attendance[];
    loading: boolean;
    error: string | null;
    showForm: boolean;
}
interface AttendanceState extends ReturnType<typeof createInitialPaginatedState>{
    studentAttendances: StudentAttendances;
    data: Attendance[];
    transformedData: TransformedAttendanceItem[];
    filteredData: TransformedAttendanceItem[];
    filterOptions: FilterOptions;
    attendanceSummary: StudentSummary[];
}
const transformToComponentFormat = (attendances: Attendance[]): TransformedAttendanceItem[] => {
    return attendances.map((a) => {
        const student = a.student;
        const person = student?.person;

        return {
            id: a.id,
            // programa: "Sin programa", // Dato no disponible en AttendanceItem
            // ficha: "Sin ficha", // Dato no disponible en AttendanceItem
            // fecha: new Date(a.attendanceDate).toLocaleDateString("es-CO"),
            estado: a.attendanceState?.status || "Sin estado",
            documento: person?.document || '',
            aprendiz: `${person?.name || ''} ${person?.lastname || ''}`.trim()
        };
    });
};

const filterAttendances = (
    data: TransformedAttendanceItem[],
    filterOptions: FilterOptions
): TransformedAttendanceItem[] => {
    const { selectedFiltro, searchTerm } = filterOptions;

    if (!searchTerm) return data;

    if (!selectedFiltro || selectedFiltro === "todo") {
        return data.filter((j) =>
            // j.programa.toLowerCase().includes(searchTerm.toLowerCase()) ||
            // j.ficha.toString().includes(searchTerm) ||
            // j.fecha.includes(searchTerm) ||
            j.estado.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    return data.filter((j) => {
        switch (selectedFiltro) {
            // case "programa":
            //     return j.programa.toLowerCase().includes(searchTerm.toLowerCase());
            // case "ficha":
            //     return j.ficha.toString().includes(searchTerm);
            // case "fecha":
            //     return j.fecha.includes(searchTerm);
            case "estado":
                return j.estado.toLowerCase().includes(searchTerm.toLowerCase());
            default:
                return true;
        }
    });
};
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
            },
            studentStudySheets: graphqlData.student?.studentStudySheets ?? []
        }
    };
}

export const processAndSummarizeAttendances = (attendances: Attendance[]): StudentSummary[] => {
    if (!attendances) return [];

    // Agrupar asistencias por estudiante
    const grouped: Record<string, Attendance[]> = {};
    attendances.forEach(a => {
        const studentId = a.student?.id;
        if (!studentId) return;
        if (!grouped[studentId]) grouped[studentId] = [];
        grouped[studentId].push(a);
    });

    const result: StudentSummary[] = [];
    Object.entries(grouped).forEach(([studentId, attendances]) => {
        const person = attendances[0]?.student?.person;
        // Filtrar ausencias e injustificadas
        const absences = attendances.filter(a => {
            const status = a.attendanceState?.status?.toLowerCase();
            return (status === 'ausente' || status === 'injustificado') && !!a.attendanceDate;
        });
        
        // // Debug: log de estados encontrados para este estudiante
        // if (attendances.length > 0) {
        //     const person = attendances[0]?.student?.person;
        //     const allStatuses = attendances.map(a => a.attendanceState?.status).filter(Boolean);
        //     const uniqueStatuses = [...new Set(allStatuses)];
        //     console.log(`Estados de asistencia para ${person?.name} ${person?.lastname}:`, uniqueStatuses);
        //     console.log(`Total ausencias + injustificadas encontradas: ${absences.length}`);
        // }
        // Ordenar por fecha (solo si la fecha existe)
        absences.sort((a, b) => {
            const dateA = a.attendanceDate ? new Date(a.attendanceDate).getTime() : 0;
            const dateB = b.attendanceDate ? new Date(b.attendanceDate).getTime() : 0;
            return dateA - dateB;
        });

        // Detectar 3 ausencias seguidas
        let maxConsecutive = 0;
        let currentConsecutive = 1;
        for (let i = 1; i < absences.length; i++) {
            const prevDateStr = absences[i - 1].attendanceDate;
            const currDateStr = absences[i].attendanceDate;
            if (!prevDateStr || !currDateStr) {
                currentConsecutive = 1;
                continue;
            }
            const prevDate = new Date(prevDateStr);
            const currDate = new Date(currDateStr);
            // Si la ausencia es el día siguiente
            if ((currDate.getTime() - prevDate.getTime()) <= 1000 * 60 * 60 * 24 + 1000 * 60 * 60 * 12) { // 1.5 días tolerancia
                currentConsecutive++;
                maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
            } else {
                currentConsecutive = 1;
            }
        }
        if (maxConsecutive === 0 && absences.length > 0) maxConsecutive = 1;

        // Detectar si supera el límite (contando ausencias e injustificadas)
        const totalAbsences = absences.length;
        result.push({
            id: parseInt(studentId),
            documento: person?.document || '',
            aprendiz: `${person?.name || ''} ${person?.lastname || ''}`.trim(),
            cantidad: totalAbsences, // Total de ausencias + injustificadas
            consecutivas: maxConsecutive
        });
    });
    return result;
};

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

export const fetchAttendanceAndCompetenceByStudent = createAsyncThunk<GetAttendancesAndCompetenceByStudentIdQuery['allAttendancesByStudentId'], GetAttendancesAndCompetenceByStudentIdQueryVariables>(
    'attendance/fetchWithCompetence',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.query<GetAttendancesAndCompetenceByStudentIdQuery, GetAttendancesAndCompetenceByStudentIdQueryVariables>({
                query: GET_ATTENDANCES_AND_COMPETENCE_BY_STUDENT,
                variables: { id },
                fetchPolicy: 'no-cache',
            });
            return data.allAttendancesByStudentId;
        } catch (error) {
            console.error("Error al obtener asistencias y competencias por estudiante", error);
            return rejectWithValue({ message: (error as Error).message || 'Unknown error' });
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

const initialState: AttendanceState = {
    ...createInitialPaginatedState<Attendance>(),
    studentAttendances: {
        data: [] as any[],
        loading: false,
        error: null as string | null,
        showForm: false,
    },
    transformedData: [],
    filteredData: [],
    filterOptions: {
        selectedFiltro: '',
        searchTerm: ''
    },
    attendanceSummary: []
};

const attendanceSlice = createSlice({
    name: 'attendance',
    initialState,
    reducers: {
        updateAttendanceSummary: (state) => {
            state.attendanceSummary = processAndSummarizeAttendances(state.data);
        }
    },
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
                    // Procesar resumen de asistencias automáticamente
                    state.attendanceSummary = processAndSummarizeAttendances(state.data);
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
            .addCase(fetchAttendanceAndCompetenceByStudent.pending, (state) => {
                state.studentAttendances.loading = true;
                state.studentAttendances.error = null;
            })
            .addCase(fetchAttendanceAndCompetenceByStudent.fulfilled, (state, action) => {
                const payload = action.payload;
                if (payload?.data) {
                    const cleanData = payload.data.filter((item): item is NonNullable<typeof item> & { id: string } => !!item && !!item.id);
                    state.studentAttendances.data = cleanData.map(transformGraphQLToAttendanceItem);
                }
                state.studentAttendances.loading = false;
                state.studentAttendances.error = null;
            })
            .addCase(fetchAttendanceAndCompetenceByStudent.rejected, (state, action) => {
                state.studentAttendances.loading = false;
                state.studentAttendances.error = (action.payload as RejectedPayload)?.message ?? action.error.message ?? 'Error al cargar asistencias y competencias del estudiante';
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

export const { updateAttendanceSummary } = attendanceSlice.actions;

export default attendanceSlice.reducer;