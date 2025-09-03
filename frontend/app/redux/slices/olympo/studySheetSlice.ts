import { clientLAN } from '@lib/apollo-client'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { GET_STUDY_SHEETS, GET_STUDY_SHEET_WITH_TEAM_SCRUM_BY_ID, GET_STUDY_SHEET_BY_ID, GET_STUDY_SHEET_BY_TEACHER, GET_STUDY_SHEET_WITH_STUDENTS, GET_STUDY_SHEET_BY_TEACHER_ID_WITH_TEAM_SCRUM, GET_STUDY_SHEET_BY_ID_WITH_ATTENDANCES } from '@graphql/olympo/studySheetGraph'
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
    GetStudySheetByIdWithAttendancesQueryVariables
} from '@graphql/generated';

// Función para transformar datos de GraphQL a StudySheet
export const transformGraphQLToStudySheetItem = (graphqlData: any): StudySheet => {
    const result = {
        id: graphqlData.id ?? graphqlData._id ?? "",
        number: graphqlData.number,
        numberStudents: graphqlData.numberStudents,
        startLective: graphqlData.startLective,
        endLective: graphqlData.endLective,
        state: graphqlData.state,

        offer: graphqlData.offer
            ? {
                id: graphqlData.offer.id,
                name: graphqlData.offer.name,
            }
            : null,

        journey: graphqlData.journey
            ? {
                id: graphqlData.journey.id,
                name: graphqlData.journey.name,
            }
            : null,

        quarter: Array.isArray(graphqlData.quarter)
            ? graphqlData.quarter.map((q: any) => ({
                id: q.id,
                name: {
                    number: q.name?.number,
                    extension: q.name?.extension,
                },
            }))
            : graphqlData.quarter?.name
                ? [{
                    id: graphqlData.quarter.id,
                    name: {
                        number: graphqlData.quarter.name.number,
                        extension: graphqlData.quarter.name.extension,
                    },
                }]
                : [],

        trainingProject: graphqlData.trainingProject
            ? {
                id: graphqlData.trainingProject.id,
                name: graphqlData.trainingProject.name,
                program: graphqlData.trainingProject.program
                    ? {
                        id: graphqlData.trainingProject.program.id,
                        name: graphqlData.trainingProject.program.name,
                    }
                    : null,
            }
            : null,

        studentStudySheets: graphqlData.studentStudySheets?.map((ss: any) => ({
            id: ss.id,
            student: {
                id: ss.student?.id,
                person: {
                    id: ss.student?.person?.id,
                    name: ss.student?.person?.name,
                    lastname: ss.student?.person?.lastname,
                    document: ss.student?.person?.document,
                    email: ss.student?.person?.email,
                    phone: ss.student?.person?.phone,
                    blood_type: ss.student?.person?.blood_type,
                    date_birth: ss.student?.person?.date_birth,
                },
                attendances: ss.student?.attendances || [], // <-- AGREGAR ESTA LÍNEA
            },
            studentStudySheetState: ss.studentStudySheetState || null,
        })) || [],

        teacherStudySheets: graphqlData.teacherStudySheets?.map((ts: any) => ({
            id: ts.id,
            competence: ts.competence ? {
                name: ts.competence.name
            } : null,
        })) || [],

        teamsScrum: graphqlData.teamsScrum?.filter((t: any) => t !== null).map((team: any) => ({
            id: team.id,
            teamName: team.teamName,
            projectName: team.projectName,
            processMethodologyId: team.processMethodologyId,
            processMethodology: team.processMethodology ? {
                id: team.processMethodology.id,
                name: team.processMethodology.name,
                description: team.processMethodology.description
            } : null,
            problem: team.problem,
            objectives: team.objectives,
            description: team.description,
            projectJustification: team.projectJustification,
            checklist: team.checklist,
            studySheet: team.studySheet,
            students: team.students?.map((student: any) => ({
                id: student.id,
                person: student.person,
                profiles: student.profiles || [],
            })) || [],
        })) || [],
    };

    return result;
};


export const fetchStudySheets = createAsyncThunk<GetStudySheetsQuery['allStudySheets'], GetStudySheetsQueryVariables>(
    'studySheet/fetchAll',
    async ({ page, size }) => {
        const { data } = await clientLAN.query<GetStudySheetsQuery, GetStudySheetsQueryVariables>({
            query: GET_STUDY_SHEETS,
            variables: { page, size },
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
    async ({ idTeacher, page, size }) => {
        const { data } = await clientLAN.query<StudySheetByTeacherQuery, StudySheetByTeacherQueryVariables>({
            query: GET_STUDY_SHEET_BY_TEACHER,
            variables: { idTeacher, page, size },
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
    async ({ idTeacher, page, size }) => {
        const { data } = await clientLAN.query<StudySheetByTeacherIdWithTeamScrumQuery, StudySheetByTeacherIdWithTeamScrumQueryVariables>({
            query: GET_STUDY_SHEET_BY_TEACHER_ID_WITH_TEAM_SCRUM,
            variables: { idTeacher, page, size },
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

interface ExtendedStudySheetState extends ReturnType<typeof createInitialPaginatedState < StudySheet >> {
    dataForStudents: Record<string, Student[]>,
    dataForTeamScrums: TeamsScrum[]
}

const initialState: ExtendedStudySheetState = {
    ...createInitialPaginatedState<StudySheet>(),
    dataForStudents: {},
    dataForTeamScrums: [],
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
            state.currentPage = 0;
            state.totalItems = 0;
            state.totalPages = 0;
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
                    const transformedData = payload.data
                        .filter((item): item is NonNullable<typeof item> => item !== null)
                        .map(transformGraphQLToStudySheetItem);

                    state.data = transformedData;
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
                state.data = item ? [transformGraphQLToStudySheetItem(item)] : [];
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
                    const transformed = transformGraphQLToStudySheetItem(item);
                    state.data = [transformed];
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
                    const transformedData = payload.data
                        .filter((item): item is NonNullable<typeof item> => item !== null)
                        .map(transformGraphQLToStudySheetItem);

                    state.data = transformedData;
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
                    const transformed = transformGraphQLToStudySheetItem(item.data);

                    // Para FichaAprendiz, simplemente reemplazamos todo el array con la nueva ficha
                    state.data = [transformed];

                    // Asignar estudiantes
                    const sheetId = transformed.id;
                    if (sheetId) {
                        state.dataForStudents[sheetId] = (transformed.studentStudySheets ?? []).filter(Boolean) as Student[];
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
                    const transformedData = payload.data
                        .filter((item): item is NonNullable<typeof item> => item !== null)
                        .map(transformGraphQLToStudySheetItem);

                    state.data = transformedData;
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
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudySheetByIdWithAttendances.fulfilled, (state, action) => {
                const item = action.payload?.data;
                if (item) {
                    const transformed = transformGraphQLToStudySheetItem(item);
                    state.data = [transformed];
                } else {
                    state.data = [];
                }
                state.loading = false;
            })
            .addCase(fetchStudySheetByIdWithAttendances.rejected, (state, action) => {
                state.error = action.error.message ?? 'Error fetching study sheet by id with attendances';
                state.loading = false;
            });
    }
});

export const { clearStudySheetState } = studySheetSlice.actions;

export default studySheetSlice.reducer;
