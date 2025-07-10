import { clientLAN } from '@lib/apollo-client'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { GET_STUDY_SHEETS, GET_STUDY_SHEET_WITH_TEAM_SCRUM_BY_ID, GET_STUDY_SHEET_BY_ID, GET_STUDY_SHEET_BY_TEACHER } from '@graphql/olympo/studySheetGraph'
import { createInitialPaginatedState } from '@type/slices/common/generic';
import { StudySheetItem } from '@type/slices/olympo/studySheet'
import {
    GetStudySheetsQuery,
    GetStudySheetsQueryVariables,
    GetStudySheetWithTeamScrumByIdQuery,
    GetStudySheetWithTeamScrumByIdQueryVariables,
    GetStudySheetByIdQuery,
    GetStudySheetByIdQueryVariables,
    StudySheetByTeacherQuery,
    StudySheetByTeacherQueryVariables
} from '@graphql/generated';

// Función para transformar datos de GraphQL a StudySheetItem
export const transformGraphQLToStudySheetItem = (graphqlData: any): StudySheetItem => {
    return {
        id: graphqlData.id,
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
            : [],

        trainingProject: graphqlData.trainingProject
            ? {
                id: graphqlData.trainingProject.id,
                name: graphqlData.trainingProject.name,
                program: graphqlData.trainingProject.program
                    ? {
                        id: graphqlData.trainingProject.program.id,
                        name: graphqlData.trainingProject.program.name
                    }
                    : null
            }
            : null,

        students: graphqlData.students?.filter((s: any) => s !== null).map((student: any) => ({
            id: student.id,
            person: {
                id: student.person.id,
                document: student.person.document,
                name: student.person.name,
                lastname: student.person.lastname,
                email: student.person.email,
                phone: student.person.phone,
                blood_type: student.person.blood_type,
                date_birth: student.person.date_birth,
            },
        })),

        teamsScrum: graphqlData.teamsScrum?.filter((t: any) => t !== null).map((team: any) => ({
            id: team.id,
            teamName: team.teamName,
            projectName: team.projectName,
            problem: team.problem,
            objectives: team.objectives,
            description: team.description,
            projectJustification: team.projectJustification,
            checklist: team.checklist,
            studySheet: team.studySheet,
            students: team.students || [],
        })) || []

    };
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
    async ({ IdTeacher, page, size }) => {
        const { data } = await clientLAN.query<StudySheetByTeacherQuery, StudySheetByTeacherQueryVariables>({
            query: GET_STUDY_SHEET_BY_TEACHER,
            variables: { IdTeacher, page, size },
            fetchPolicy: 'no-cache',
        })
        return data.allStudySheets;
    }
);

const initialState = createInitialPaginatedState<StudySheetItem>();
const studySheetSlice = createSlice({
    name: 'studySheet',
    initialState,
    reducers: {},
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
                    state.data = payload.data
                        .filter((item): item is NonNullable<typeof item> => item !== null)
                        .map(transformGraphQLToStudySheetItem);
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
                state.data = item ? [transformGraphQLToStudySheetItem(item)] : [];
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
                    state.data = payload.data
                        .filter((item): item is NonNullable<typeof item> => item !== null)
                        .map(transformGraphQLToStudySheetItem);
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
    }
});

export const { } = studySheetSlice.actions;

export default studySheetSlice.reducer;
