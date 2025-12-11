import { client } from '@lib/apollo-client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GET_PROGRAMS } from '@graphql/olympo/programGraph';
import { createInitialPaginatedState } from '@type/slices/common/generic';
import { Program, GetProgramsQuery, GetProgramsQueryVariables } from '@graphql/generated'

export const fetchPrograms = createAsyncThunk<GetProgramsQuery['allPrograms'], GetProgramsQueryVariables>(
    'program/fetchAll',
    async ({ page, size }) => {
        const { data } = await client.query<GetProgramsQuery, GetProgramsQueryVariables>({
            query: GET_PROGRAMS,
            variables: { page, size },
            fetchPolicy: 'no-cache',
        });
        return data.allPrograms;
    }
);

const initialState = createInitialPaginatedState<Program>();
const programSlice = createSlice({
    name: 'program',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPrograms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPrograms.fulfilled, (state, action) => {
                const payload = action.payload;

                if (payload && payload.data) {
                    // Filtra nulls y usa los datos directamente
                    state.data = payload.data
                        .filter((item): item is NonNullable<typeof item> => item !== null) as Program[];
                    state.totalItems = payload.totalItems ?? 0;
                    state.totalPages = payload.totalPages ?? 0;
                    state.currentPage = payload.currentPage ?? 0;
                } else {
                    // fallback en caso de payload vacío o error no atrapado
                    state.data = [];
                    state.totalItems = 0;
                    state.totalPages = 0;
                    state.currentPage = 0;
                }

                state.loading = false;
                state.error = null;
            })
    }
});


export const { } = programSlice.actions;

export default programSlice.reducer;