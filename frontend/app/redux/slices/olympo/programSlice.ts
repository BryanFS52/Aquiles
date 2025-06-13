import { clientLAN } from '@lib/apollo-client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GET_PROGRAMS } from '@graphql/olympo/programGraph';
import { GetProgramsQuery, GetProgramsQueryVariables, GetStudentsQueryVariables } from '@graphql/generated'

export const fetchPrograms = createAsyncThunk<GetProgramsQuery['allPrograms'], GetStudentsQueryVariables>(
    'program/fetchAll',
    async ({ page, size }) => {
        const { data } = await clientLAN.query<GetProgramsQuery, GetProgramsQueryVariables>({
            query: GET_PROGRAMS,
            variables: { page, size },
            fetchPolicy: 'no-cache',
        });
        return data.allPrograms;
    }
);

const programSlice = createSlice({
    name: 'program',
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
            // fetchPrograms
            .addCase(fetchPrograms.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPrograms.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(fetchPrograms.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            });
    }
});

export const { } = programSlice.actions;

export default programSlice.reducer;