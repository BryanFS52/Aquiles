import { clientLAN } from '@lib/apollo-client'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { GET_STUDY_SHEETS, GET_STUDY_SHEET_WITH_TEAM_SCRUM_BY_ID, GET_STUDY_SHEET_BY_ID, GET_STUDY_SHEET_BY_TEACHER, GET_STUDY_SHEET_WITH_STUDENTS, GET_STUDY_SHEET_BY_TEACHER_ID_WITH_TEAM_SCRUM, GET_STUDY_SHEET_BY_ID_WITH_ATTENDANCES, GET_STUDY_SHEETS_BY_TRAINING_PROJECT, ADD_STUDY_SHEET, GET_STUDY_SHEETS_WITH_COORDINATION_ID } from '@graphql/olympo/studySheetGraph'
import { createInitialPaginatedState } from '@type/slices/common/generic';
import {
    StudySheet,
    Student,
    TeamsScrum,
    GetStudySheetsQuery,
    GetStudySheetsQueryVariables,
    GetStudySheetWithTeamScrumByIdQuery,
    GetStudySheetWithTeamScrumByIdQueryVariables,
    GetStudySheetByIdQuery,
    GetStudySheetByIdQueryVariables,
    StudySheetByTeacherQuery,
    StudySheetByTeacherQueryVariables,
    GetStudySheetWithStudentsQuery,
    GetStudySheetWithStudentsQueryVariables,
    StudySheetByTeacherIdWithTeamScrumQuery,
    StudySheetByTeacherIdWithTeamScrumQueryVariables,
    GetStudySheetByIdWithAttendancesQuery,
    GetStudySheetByIdWithAttendancesQueryVariables,
    GetStudySheetsWithCoordinationIdQuery,
    GetStudySheetsWithCoordinationIdQueryVariables,
    GetStudySheetsByTrainingProjectQuery,
    GetStudySheetsByTrainingProjectQueryVariables,
    AddStudySheetMutationVariables,
    AddStudySheetMutation
} from '@graphql/generated';

export const fetchStudySheets = createAsyncThunk<GetStudySheetsQuery['allStudySheets'], GetStudySheetsQueryVariables>(
    'studySheet/fetchAll',
    async ({ page = 0, size = 100 }) => {
        const { data } = await clientLAN.query<GetStudySheetsQuery, GetStudySheetsQueryVariables>({
            query: GET_STUDY_SHEETS,
            variables: { 
                page: page ?? 0, 
                size: size ?? 100 
            },
            fetchPolicy: 'no-cache',
        });
        return data.allStudySheets;
    }
);


export const fetchStudySheetWithTeamScrum = createAsyncThunk<GetStudySheetWithTeamScrumByIdQuery['studySheetById'], GetStudySheetWithTeamScrumByIdQueryVariables>(
    'studySheet/fetchTeamScrum',
    async ({ id }) => {
        const { data } = await clientLAN.query<GetStudySheetWithTeamScrumByIdQuery, GetStudySheetWithTeamScrumByIdQueryVariables>({
            query: GET_STUDY_SHEET_WITH_TEAM_SCRUM_BY_ID,
            variables: { id },
            fetchPolicy: 'no-cache',
        });
        return data.studySheetById
    }
);

export const fetchStudySheetById = createAsyncThunk<GetStudySheetByIdQuery['studySheetById'], GetStudySheetByIdQueryVariables>(
    'studySheet/fetchById',
    async ({ id }) => {
        const { data } = await clientLAN.query<GetStudySheetByIdQuery, GetStudySheetByIdQueryVariables>({
            query: GET_STUDY_SHEET_BY_ID,
            variables: { id },
            fetchPolicy: 'no-cache',
        });
        return data.studySheetById;
    }
);

export const fetchStudySheetByTeacher = createAsyncThunk<StudySheetByTeacherQuery['allStudySheets'], StudySheetByTeacherQueryVariables>(
    'studySheet/fetchByTeacher',
    async ({ idTeacher, page = 0, size = 100 }) => {
        const { data } = await clientLAN.query<StudySheetByTeacherQuery, StudySheetByTeacherQueryVariables>({
            query: GET_STUDY_SHEET_BY_TEACHER,
            variables: { 
                idTeacher, 
                page: page ?? 0, 
                size: size ?? 100 
            },
            fetchPolicy: 'no-cache',
        })
        return data.allStudySheets;
    }
);

export const fetchStudySheetWithStudents = createAsyncThunk<GetStudySheetWithStudentsQuery['studySheetById'], GetStudySheetWithStudentsQueryVariables>(
    'studySheet/fetchStudents',
    async ({ id }) => {
        const { data } = await clientLAN.query<GetStudySheetWithStudentsQuery, GetStudySheetWithStudentsQueryVariables>({
            query: GET_STUDY_SHEET_WITH_STUDENTS,
            variables: { id },
            fetchPolicy: 'no-cache',
        });
        return data.studySheetById;
    }
);

export const fetchStudySheetByTeacherIdWithTeamScrum = createAsyncThunk<StudySheetByTeacherIdWithTeamScrumQuery['allStudySheets'], StudySheetByTeacherIdWithTeamScrumQueryVariables>(
    'studySheet/fetchByTeacherIdWithTeamScrum',
    async ({ idTeacher, page = 0, size = 100 }) => {
        const { data } = await clientLAN.query<StudySheetByTeacherIdWithTeamScrumQuery, StudySheetByTeacherIdWithTeamScrumQueryVariables>({
            query: GET_STUDY_SHEET_BY_TEACHER_ID_WITH_TEAM_SCRUM,
            variables: { 
                idTeacher, 
                page: page ?? 0, 
                size: size ?? 100 
            },
            fetchPolicy: 'no-cache',
        });
        return data.allStudySheets;
    }
);

export const fetchStudySheetByIdWithAttendances = createAsyncThunk<GetStudySheetByIdWithAttendancesQuery['studySheetById'], GetStudySheetByIdWithAttendancesQueryVariables>(
    'studySheet/fetchByIdWithAttendances',
    async ({ id, competenceId }) => {
        const { data } = await clientLAN.query<GetStudySheetByIdWithAttendancesQuery, GetStudySheetByIdWithAttendancesQueryVariables>({
            query: GET_STUDY_SHEET_BY_ID_WITH_ATTENDANCES,
            variables: { id, competenceId },
            fetchPolicy: 'no-cache',
        });
        return data.studySheetById;
    }
);

export const fetchStudySheetsByTrainingProject = createAsyncThunk<GetStudySheetsByTrainingProjectQuery['allStudySheets'], GetStudySheetsByTrainingProjectQueryVariables & { idTrainingProject: number }>(
    'studySheet/fetchByTrainingProject',
    async ({ idTrainingProject, page = 0, size = 100 }) => {
        const { data } = await clientLAN.query<GetStudySheetsByTrainingProjectQuery, GetStudySheetsByTrainingProjectQueryVariables>({
            query: GET_STUDY_SHEETS_BY_TRAINING_PROJECT,
            variables: { page, size },
            fetchPolicy: 'no-cache',
        });
        
        // Filtrar las fichas por proyecto formativo en el frontend ya que no hay parámetro específico en el backend
        if (data?.allStudySheets?.data) {
            const filteredData = data.allStudySheets.data.filter((studySheet: any) => 
                studySheet?.trainingProject?.id?.toString() === idTrainingProject.toString()
            );
            
            const actualSize = size ?? 100;
            
            return {
                ...data.allStudySheets,
                data: filteredData,
                totalItems: filteredData.length,
                totalPages: Math.ceil(filteredData.length / actualSize),
                currentPage: page ?? 0
            };
        }
        
        return data.allStudySheets;
    }
);


interface ExtendedStudySheetState extends ReturnType<typeof createInitialPaginatedState < StudySheet >> {
    dataForStudents: Record<string, Student[]>,
    dataForTeamScrums: TeamsScrum[],
    selectedForAttendance: StudySheet | null, // Nueva propiedad para la ficha seleccionada para asistencia
    loadingAttendanceSheet: boolean // Estado de carga específico para ficha de asistencia
}

const initialState: ExtendedStudySheetState = {
    ...createInitialPaginatedState<StudySheet>(),
    dataForStudents: {},
    dataForTeamScrums: [],
    selectedForAttendance: null,
    loadingAttendanceSheet: false,
};

const studySheetSlice = createSlice({
    name: 'studySheet',
    initialState,
    reducers: {
        clearStudySheetState: (state) => {
            state.data = [];
            state.loading = false;
            state.error = null;
            state.dataForStudents = {};
            state.dataForTeamScrums = [];
            state.selectedForAttendance = null;
            state.loadingAttendanceSheet = false;
            state.currentPage = 0;
            state.totalItems = 0;
            state.totalPages = 0;
        },
        clearAttendanceSelection: (state) => {
            state.selectedForAttendance = null;
            state.loadingAttendanceSheet = false;
        }
    },
    extraReducers: (builder) => {
        // Fetch all Study Sheets
        builder
            .addCase(fetchStudySheets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudySheets.fulfilled, (state, action) => {
                const payload = action.payload;

                if (payload?.data) {
                    // Filtra nulls y usa los datos directamente
                    state.data = payload.data
                        .filter((item): item is NonNullable<typeof item> => item !== null) as StudySheet[];

                    state.totalItems = payload.totalItems ?? 0;
                    state.totalPages = payload.totalPages ?? 0;
                    state.currentPage = payload.currentPage ?? 0;
                } else {
                    // fallback en caso de payload vacío
                    state.data = [];
                    state.totalItems = 0;
                    state.totalPages = 0;
                    state.currentPage = 0;
                }
                state.loading = false;
            })
            .addCase(fetchStudySheets.rejected, (state, action) => {
                state.error = action.error.message ?? 'Error fetching study sheets';
                state.loading = false;
            });

        // Fetch StudySheetbyID
        builder
            .addCase(fetchStudySheetById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudySheetById.fulfilled, (state, action) => {
                const item = action.payload?.data;
                state.data = item ? [item as StudySheet] : [];
                state.loading = false;
            })
            .addCase(fetchStudySheetById.rejected, (state, action) => {
                state.error = action.error.message ?? 'Error fetching study sheet by ID';
                state.loading = false;
            });

        // Fetch StudySheet with TeamScrum
        builder
            .addCase(fetchStudySheetWithTeamScrum.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudySheetWithTeamScrum.fulfilled, (state, action) => {
                const item = action.payload?.data;

                if (item) {
                    state.data = [item as StudySheet];
                } else {
                    state.data = [];
                }
                state.loading = false;
            })
            .addCase(fetchStudySheetWithTeamScrum.rejected, (state, action) => {
                state.error = action.error.message ?? 'Error fetching study sheet with team scrum';
                state.loading = false;
            });

        // Fetch StudySheetbyTeacher
        builder
            .addCase(fetchStudySheetByTeacher.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudySheetByTeacher.fulfilled, (state, action) => {
                const payload = action.payload;

                if (payload?.data) {
                    // Filtra nulls y usa los datos directamente
                    state.data = payload.data
                        .filter((item): item is NonNullable<typeof item> => item !== null) as StudySheet[];

                    state.totalItems = payload.totalItems ?? 0;
                    state.totalPages = payload.totalPages ?? 0;
                    state.currentPage = payload.currentPage ?? 0;

                } else {
                    // fallback en caso de payload vacío
                    state.data = [];
                    state.totalItems = 0;
                    state.totalPages = 0;
                    state.currentPage = 0;
                }
                state.loading = false;
            })
            .addCase(fetchStudySheetByTeacher.rejected, (state, action) => {
                state.error = action.error.message ?? 'Error fetching study sheets by teacher';
                state.loading = false;
            });

        // Fetch StudySheet with Students
        builder
            .addCase(fetchStudySheetWithStudents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudySheetWithStudents.fulfilled, (state, action) => {
                const item = action.payload;

                if (item?.data) {
                    const studySheet = item.data as StudySheet;

                    // Para FichaAprendiz, simplemente reemplazamos todo el array con la nueva ficha
                    state.data = [studySheet];

                    // Asignar estudiantes
                    const sheetId = studySheet.id;
                    if (sheetId) {
                        state.dataForStudents[sheetId] = (studySheet.studentStudySheets ?? []).filter(Boolean) as Student[];
                    }
                }

                state.loading = false;
            })
            .addCase(fetchStudySheetWithStudents.rejected, (state, action) => {
                state.error = action.error.message ?? 'Error fetching study sheet with students';
                state.loading = false;
            });

        // Fetch StudySheet by Teacher ID with TeamScrum
        builder
            .addCase(fetchStudySheetByTeacherIdWithTeamScrum.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudySheetByTeacherIdWithTeamScrum.fulfilled, (state, action) => {
                const payload = action.payload;
                if (payload?.data) {
                    // Filtra nulls y usa los datos directamente
                    state.data = payload.data
                        .filter((item): item is NonNullable<typeof item> => item !== null) as StudySheet[];

                    state.totalItems = payload.totalItems ?? 0;
                    state.totalPages = payload.totalPages ?? 0;
                    state.currentPage = payload.currentPage ?? 0;
                } else {
                    state.data = [];
                    state.totalItems = 0;
                    state.totalPages = 0;
                    state.currentPage = 0;
                }
                state.loading = false;
            })
            .addCase(fetchStudySheetByTeacherIdWithTeamScrum.rejected, (state, action) => {
                state.error = action.error.message ?? 'Error fetching study sheets by teacher with team scrum';
                state.loading = false;
            });
        // Fetch StudySheetByIdWithAttendances
        builder
            .addCase(fetchStudySheetByIdWithAttendances.pending, (state) => {
                state.loadingAttendanceSheet = true;
                state.error = null;
            })
            .addCase(fetchStudySheetByIdWithAttendances.fulfilled, (state, action) => {
                const item = action.payload?.data;
                if (item) {
                    // Guardamos la ficha seleccionada para asistencia sin afectar la lista principal
                    state.selectedForAttendance = item as StudySheet;
                } else {
                    state.selectedForAttendance = null;
                }
                state.loadingAttendanceSheet = false;
            })
            .addCase(fetchStudySheetByIdWithAttendances.rejected, (state, action) => {
                state.error = action.error.message ?? 'Error fetching study sheet by id with attendances';
                state.loadingAttendanceSheet = false;
                state.selectedForAttendance = null;
            });

        // Fetch StudySheets by Training Project
        builder
            .addCase(fetchStudySheetsByTrainingProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudySheetsByTrainingProject.fulfilled, (state, action) => {
                const payload = action.payload;
                if (payload?.data) {
                    // Filtra nulls y usa los datos directamente
                    state.data = payload.data
                        .filter((item): item is NonNullable<typeof item> => item !== null) as StudySheet[];

                    state.totalItems = payload.totalItems ?? 0;
                    state.totalPages = payload.totalPages ?? 0;
                    state.currentPage = payload.currentPage ?? 0;
                } else {
                    state.data = [];
                    state.totalItems = 0;
                    state.totalPages = 0;
                    state.currentPage = 0;
                }
                state.loading = false;
            })
            .addCase(fetchStudySheetsByTrainingProject.rejected, (state, action) => {
                state.error = action.error.message ?? 'Error fetching study sheets by training project';
                state.loading = false;
            });
    }
});

export const { clearStudySheetState, clearAttendanceSelection } = studySheetSlice.actions;

// Service methods for compatibility with existing components
export const studySheetService = {
    getStudySheetsByTrainingProject: async ({ idTrainingProject, page = 0, size = 100 }: { idTrainingProject: number; page?: number; size?: number }) => {
        try {
            const { data } = await clientLAN.query({
                query: GET_STUDY_SHEETS_BY_TRAINING_PROJECT,
                variables: { page, size },
                fetchPolicy: 'network-only',
            });

            if (data?.allStudySheets?.code === '200' || data?.allStudySheets?.code === 200) {
                // Filtrar las fichas por proyecto formativo
                const filteredData = data.allStudySheets.data?.filter((studySheet: any) => 
                    studySheet?.trainingProject?.id?.toString() === idTrainingProject.toString()
                ) || [];

                return {
                    ...data.allStudySheets,
                    data: filteredData
                };
            } else {
                throw new Error(data?.allStudySheets?.message || 'Error fetching study sheets by training project');
            }
        } catch (error) {
            console.error('Error fetching study sheets by training project:', error);
            throw error;
        }
    }
};

export default studySheetSlice.reducer;
