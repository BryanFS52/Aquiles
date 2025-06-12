import { clientLAN } from '@/lib/apollo-client'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { GET_STUDY_SHEETS, GET_STUDY_SHEET_BY_ID } from '@/graphql/olympo/studySheetGraph'

export const fetchStudySheets = createAsyncThunk(
    'studySheet/fetchAll',
    async ({ page, size }) => {
        const { data } = await clientLAN.query({
            query: GET_STUDY_SHEETS,
            variables: { page, size },
            fetchPolicy: 'no-cache',
        });
        return data.studySheets;
    }
);

export const fetchStudySheetById = createAsyncThunk(
    'studySheet/fetchById',
    async ({ id }) => {
        const { data } = await clientLAN.query({
            query: GET_STUDY_SHEET_BY_ID,
            variables: { id },
            fetchPolicy: 'no-cache',
        });
        return data.studySheetById;
    }
);

const studySheetSlice = createSlice({
    name: 'studySheet',
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
            // fetchStudySheets
            .addCase(fetchStudySheets.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchStudySheets.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(fetchStudySheets.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })
            // fetchStudySheetById
            .addCase(fetchStudySheetById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchStudySheetById.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(fetchStudySheetById.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            });
    }
});

export const { } = studySheetSlice.actions;

export default studySheetSlice.reducer;
