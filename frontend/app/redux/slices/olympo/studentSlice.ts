import { client } from "@lib/apollo-client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createInitialPaginatedState, RejectedPayload } from '@type/slices/common/generic';
import { ADD_STUDENT, GET_All_STUDENTS, GET_STUDENT_LIST } from '@graphql/olympo/studentsGraph';
import {
    Student,
    GetStudentsQuery,
    GetStudentsQueryVariables,
    GetStudentListQuery,
    GetStudentListQueryVariables,
    AddStudentMutation,
    AddStudentMutationVariables,
} from '@graphql/generated'


export const fetchStudents = createAsyncThunk<GetStudentsQuery['allStudents'], GetStudentsQueryVariables>(
    'student/fetchAll',
    async ({ page, size }) => {
        const { data } = await client.query<GetStudentsQuery, GetStudentsQueryVariables>({
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
        const { data } = await client.query<GetStudentListQuery, GetStudentListQuery>({
            query: GET_STUDENT_LIST,
            fetchPolicy: 'no-cache',
        });
        return data.allStudentList;
    }
);

export const addStudent = createAsyncThunk<AddStudentMutation['addStudent'], AddStudentMutationVariables['input'],
    { rejectValue: { code: string; message: string } }
>(
    'student/addStudent',
    async (Input, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate<AddStudentMutation, AddStudentMutationVariables>({
                mutation: ADD_STUDENT,
                variables: { input: Input },
            });
            const res = data?.addStudent;

            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }
            return res;
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

const initialState = createInitialPaginatedState<Student>();
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

                // Filtra nulls y usa los datos directamente
                state.data = (payload.data ?? [])
                    .filter((item): item is NonNullable<typeof item> => item !== null) as Student[];

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

                // Filtra nulls y usa los datos directamente
                state.data = (payload.data ?? [])
                    .filter((item): item is NonNullable<typeof item> => item !== null) as Student[];

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
        // addStudent
        builder
            .addCase(addStudent.fulfilled, (state, action: PayloadAction<AddStudentMutation['addStudent']>) => {
                state.error = null;
            })
            .addCase(addStudent.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            });
    },
});

export const { } = studentSlice.actions;

export default studentSlice.reducer;