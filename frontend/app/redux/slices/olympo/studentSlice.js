import { clientLAN } from "@/lib/apollo-client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GET_All_STUDENTS, GET_STUDENT_LIST } from '@graphql/olympo/studentsGraph';

export const fetchStudents = createAsyncThunk(
    'student/fetchAll',
    async ({ page, size }) => {
        const { data } = await clientLAN.query({
            query: GET_All_STUDENTS,
            variables: { page, size },
            fetchPolicy: 'no-cache',
        });
        return data.students;
    }
);

export const fetchStudentList = createAsyncThunk(
    'student/fetchList',
    async () => {
        const { data } = await clientLAN.query({
            query: GET_STUDENT_LIST,
            fetchPolicy: 'no-cache',
        });
        return data.studentList;
    }
);

const studentSlice = createSlice({
    name: 'student',
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
            // fetchStudents
            .addCase(fetchStudents.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchStudents.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(fetchStudents.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })
            // fetchStudentList
            .addCase(fetchStudentList.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchStudentList.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(fetchStudentList.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            });
    }
});

export const { } = studentSlice.actions;

export default studentSlice.reducer;
