import { clientLAN } from "@lib/apollo-client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createInitialPaginatedState, RejectedPayload } from '@type/slices/common/generic';
import { GET_All_STUDENTS, GET_STUDENT_LIST } from '@graphql/olympo/studentsGraph';
import { StudentItem } from '@type/slices/olympo/student';
import {
    GetStudentsQuery,
    GetStudentsQueryVariables,
    GetStudentListQuery,
    GetStudentListQueryVariables
} from '@graphql/generated'

// Función para transformar datos de GraphQL a StudentItem
export const transformGraphQLToStudentItem = (graphqlData: any): StudentItem => {
    return {
        id: graphqlData.id,
        state: graphqlData.state,
        person: {
            id: graphqlData.person?.id,
            document: graphqlData.person?.document,
            name: graphqlData.person?.name,
            lastname: graphqlData.person?.lastname,
            phone: graphqlData.person?.phone,
            email: graphqlData.person?.email,
            address: graphqlData.person?.address,
        },
        studySheets: graphqlData.studySheets?.map((sheet: any) => ({
            id: sheet.id,
            number: sheet.number,
            state: sheet.state
        }))
    };
};


export const fetchStudents = createAsyncThunk<GetStudentsQuery['allStudents'], GetStudentsQueryVariables>(
    'student/fetchAll',
    async ({ page, size }) => {
        const { data } = await clientLAN.query<GetStudentsQuery, GetStudentsQueryVariables>({
            query: GET_All_STUDENTS,
            variables: { page, size },
            fetchPolicy: 'no-cache',
        });
        return data.allStudents;
    }
);

export const fetchStudentList = createAsyncThunk<GetStudentListQuery['allStudentList'], GetStudentListQueryVariables>(
    'student/fetchList',
    async () => {
        const { data } = await clientLAN.query<GetStudentListQuery, GetStudentListQuery>({
            query: GET_STUDENT_LIST,
            fetchPolicy: 'no-cache',
        });
        return data.allStudentList;
    }
);

const initialState = createInitialPaginatedState<StudentItem>();
const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchStudents: paginado
            .addCase(fetchStudents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudents.fulfilled, (state, action) => {
                const payload = action.payload ?? {};

                state.data = (payload.data ?? [])
                    .filter((item): item is NonNullable<typeof item> => item !== null)
                    .map(transformGraphQLToStudentItem);

                state.totalItems = payload.totalItems ?? 0;
                state.totalPages = payload.totalPages ?? 0;
                state.currentPage = payload.currentPage ?? 0;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchStudents.rejected, (state, action) => {
                const error = action.payload as RejectedPayload | undefined;
                state.error = {
                    code: error?.code ?? 'UNKNOWN_ERROR',
                    message: error?.message ?? 'Error al obtener estudiantes',
                };
                state.loading = false;
            });

        // fetchStudentList: lista no paginada
        builder
            .addCase(fetchStudentList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudentList.fulfilled, (state, action) => {
                const payload = action.payload ?? {};

                state.data = (payload.data ?? [])
                    .filter((item): item is NonNullable<typeof item> => item !== null)
                    .map(transformGraphQLToStudentItem);

                // valores por defecto para compatibilidad
                state.totalItems = payload.totalItems ?? payload.data?.length ?? 0;
                state.totalPages = 1;
                state.currentPage = 1;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchStudentList.rejected, (state, action) => {
                const error = action.payload as RejectedPayload | undefined;
                state.error = {
                    code: error?.code ?? 'UNKNOWN_ERROR',
                    message: error?.message ?? 'Error al obtener lista de estudiantes',
                };
                state.loading = false;
            });
    },
});

export const { } = studentSlice.actions;

export default studentSlice.reducer;