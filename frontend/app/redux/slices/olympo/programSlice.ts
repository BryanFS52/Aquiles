import { clientLAN } from '@lib/apollo-client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GET_PROGRAMS } from '@graphql/olympo/programGraph';
import { createInitialPaginatedState } from '@type/slices/common/generic';
import { Program, GetProgramsQuery, GetProgramsQueryVariables } from '@graphql/generated'

// Service methods integrated into slice
interface GetProgramsServiceParams {
    idCoordination?: number;
    idTrainingLevel?: number;
    name?: string;
    page?: number;
    size?: number;
}

const programService = {
    getPrograms: async ({ idCoordination, idTrainingLevel, name, page = 0, size = 10 }: GetProgramsServiceParams = {}) => {
        try {
            const { data } = await clientLAN.query({
                query: GET_PROGRAMS,
                variables: { idCoordination, idTrainingLevel, name, page, size },
                fetchPolicy: 'network-only',
            });

            if (data?.allPrograms?.code === '200' || data?.allPrograms?.code === 200) {
                return data.allPrograms;
            } else {
                throw new Error(data?.allPrograms?.message || 'Error fetching programs');
            }
        } catch (error) {
            console.error('Error fetching programs:', error);
            throw error;
        }
    },
};

// Función para transformar datos de GraphQL a Program
export const transformGraphQLToProgramItem = (graphqlData: any): Program => {
    return {
        id: graphqlData.id,
        name: graphqlData.name,
        description: graphqlData.description,
        state: graphqlData.state,
        coordination: graphqlData.coordination
            ? {
                id: graphqlData.coordination.id,
                name: graphqlData.coordination.name,
            }
            : null,
        trainingLevel: graphqlData.trainingLevel
            ? {
                id: graphqlData.trainingLevel.id,
                name: graphqlData.trainingLevel.name,
            }
            : null,
    };
};


export const fetchPrograms = createAsyncThunk<GetProgramsQuery['allPrograms'], GetProgramsQueryVariables>(
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
                    state.data = payload.data
                        .filter((item): item is NonNullable<typeof item> => item !== null)
                        .map(transformGraphQLToProgramItem);
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

// Export service methods for compatibility
export { programService };

export default programSlice.reducer;