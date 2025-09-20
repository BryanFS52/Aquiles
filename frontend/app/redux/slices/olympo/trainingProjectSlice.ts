import { clientLAN } from '@lib/apollo-client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { 
    GET_ALL_TRAINING_PROJECTS, 
    GET_TRAINING_PROJECTS_BY_PROGRAM,
    GET_TRAINING_PROJECT_BY_ID 
} from '@graphql/olympo/trainingProjectGraph';
import { createInitialPaginatedState } from '@type/slices/common/generic';
import { 
    TrainingProject, 
    GetAllTrainingProjectsQuery, 
    GetAllTrainingProjectsQueryVariables,
    GetTrainingProjectsByProgramQuery,
    GetTrainingProjectsByProgramQueryVariables,
    GetTrainingProjectByIdQuery,
    GetTrainingProjectByIdQueryVariables
} from '@graphql/generated';

// Service methods integrated into slice
interface GetAllTrainingProjectsServiceParams {
    name?: string;
    idProgram?: number;
    page?: number;
    size?: number;
}

interface GetTrainingProjectsByProgramServiceParams {
    idProgram: number;
    page?: number;
    size?: number;
}

const trainingProjectService = {
    getAllTrainingProjects: async ({ name, idProgram, page = 0, size = 10 }: GetAllTrainingProjectsServiceParams = {}) => {
        try {
            const { data } = await clientLAN.query({
                query: GET_ALL_TRAINING_PROJECTS,
                variables: { name, idProgram, page, size },
                fetchPolicy: 'network-only',
            });

            if (data?.allTrainingProjects?.code === '200' || data?.allTrainingProjects?.code === 200) {
                return data.allTrainingProjects;
            } else {
                throw new Error(data?.allTrainingProjects?.message || 'Error fetching training projects');
            }
        } catch (error) {
            console.error('Error fetching training projects:', error);
            throw error;
        }
    },

    getTrainingProjectsByProgram: async ({ idProgram, page = 0, size = 10 }: GetTrainingProjectsByProgramServiceParams) => {
        try {
            const { data } = await clientLAN.query({
                query: GET_TRAINING_PROJECTS_BY_PROGRAM,
                variables: { idProgram, page, size },
                fetchPolicy: 'network-only',
            });

            if (data?.allTrainingProjects?.code === '200' || data?.allTrainingProjects?.code === 200) {
                return data.allTrainingProjects;
            } else {
                throw new Error(data?.allTrainingProjects?.message || 'Error fetching training projects by program');
            }
        } catch (error) {
            console.error('Error fetching training projects by program:', error);
            throw error;
        }
    },

    getTrainingProjectById: async (id: number) => {
        try {
            const { data } = await clientLAN.query({
                query: GET_TRAINING_PROJECT_BY_ID,
                variables: { page: 0, size: 100 },
                fetchPolicy: 'network-only',
            });

            if (data?.allTrainingProjects?.code === '200' || data?.allTrainingProjects?.code === 200) {
                // Buscar el proyecto específico en la lista de resultados
                const project = data.allTrainingProjects.data.find((p: any) => p.id.toString() === id.toString());
                if (project) {
                    return {
                        ...data.allTrainingProjects,
                        data: project
                    };
                } else {
                    throw new Error('Training project not found');
                }
            } else {
                throw new Error(data?.allTrainingProjects?.message || 'Error fetching training project');
            }
        } catch (error) {
            console.error('Error fetching training project by id:', error);
            throw error;
        }
    },
};

// Función para transformar datos de GraphQL a TrainingProject
export const transformGraphQLToTrainingProjectItem = (graphqlData: any): TrainingProject => {
    return {
        id: graphqlData.id,
        name: graphqlData.name,
        description: graphqlData.description,
        state: graphqlData.state,
        program: graphqlData.program
            ? {
                id: graphqlData.program.id,
                name: graphqlData.program.name,
                description: graphqlData.program.description,
                state: graphqlData.program.state,
                coordination: graphqlData.program.coordination,
                trainingLevel: graphqlData.program.trainingLevel,
            }
            : null,
    };
};

export const fetchAllTrainingProjects = createAsyncThunk<GetAllTrainingProjectsQuery['allTrainingProjects'], GetAllTrainingProjectsQueryVariables>(
    'trainingProject/fetchAll',
    async ({ name, idProgram, page, size }) => {
        const { data } = await clientLAN.query<GetAllTrainingProjectsQuery, GetAllTrainingProjectsQueryVariables>({
            query: GET_ALL_TRAINING_PROJECTS,
            variables: { name, idProgram, page, size },
            fetchPolicy: 'no-cache',
        });
        return data.allTrainingProjects;
    }
);

export const fetchTrainingProjectsByProgram = createAsyncThunk<GetTrainingProjectsByProgramQuery['allTrainingProjects'], GetTrainingProjectsByProgramQueryVariables>(
    'trainingProject/fetchByProgram',
    async ({ idProgram, page, size }) => {
        const { data } = await clientLAN.query<GetTrainingProjectsByProgramQuery, GetTrainingProjectsByProgramQueryVariables>({
            query: GET_TRAINING_PROJECTS_BY_PROGRAM,
            variables: { idProgram, page, size },
            fetchPolicy: 'no-cache',
        });
        return data.allTrainingProjects;
    }
);

export const fetchTrainingProjectById = createAsyncThunk<GetTrainingProjectByIdQuery['allTrainingProjects'], { id: number; page?: number; size?: number }>(
    'trainingProject/fetchById',
    async ({ id, page, size }) => {
        const { data } = await clientLAN.query<GetTrainingProjectByIdQuery, GetTrainingProjectByIdQueryVariables>({
            query: GET_TRAINING_PROJECT_BY_ID,
            variables: { page: page || 0, size: size || 100 },
            fetchPolicy: 'no-cache',
        });

        if (data?.allTrainingProjects?.data) {
            // Buscar el proyecto específico en la lista de resultados
            const project = data.allTrainingProjects.data.find((p: any) => p?.id?.toString() === id?.toString());
            if (project) {
                return {
                    ...data.allTrainingProjects,
                    data: [project] // Convertir a array para mantener consistencia
                };
            } else {
                throw new Error('Training project not found');
            }
        }
        
        return data.allTrainingProjects;
    }
);

const initialState = createInitialPaginatedState<TrainingProject>();

const trainingProjectSlice = createSlice({
    name: 'trainingProject',
    initialState,
    reducers: {
        clearTrainingProjects: (state) => {
            state.data = [];
            state.loading = false;
            state.error = null;
            state.currentPage = 0;
            state.totalItems = 0;
            state.totalPages = 0;
        }
    },
    extraReducers: (builder) => {
        // Fetch all training projects
        builder
            .addCase(fetchAllTrainingProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllTrainingProjects.fulfilled, (state, action) => {
                const payload = action.payload;

                if (payload && payload.data) {
                    state.data = payload.data
                        .filter((item): item is NonNullable<typeof item> => item !== null)
                        .map(transformGraphQLToTrainingProjectItem);
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
                state.error = null;
            })
            .addCase(fetchAllTrainingProjects.rejected, (state, action) => {
                state.error = action.error.message ?? 'Error fetching training projects';
                state.loading = false;
            });

        // Fetch training projects by program
        builder
            .addCase(fetchTrainingProjectsByProgram.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTrainingProjectsByProgram.fulfilled, (state, action) => {
                const payload = action.payload;

                if (payload && payload.data) {
                    state.data = payload.data
                        .filter((item): item is NonNullable<typeof item> => item !== null)
                        .map(transformGraphQLToTrainingProjectItem);
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
                state.error = null;
            })
            .addCase(fetchTrainingProjectsByProgram.rejected, (state, action) => {
                state.error = action.error.message ?? 'Error fetching training projects by program';
                state.loading = false;
            });

        // Fetch training project by ID
        builder
            .addCase(fetchTrainingProjectById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTrainingProjectById.fulfilled, (state, action) => {
                const payload = action.payload;

                if (payload && payload.data) {
                    state.data = payload.data
                        .filter((item): item is NonNullable<typeof item> => item !== null)
                        .map(transformGraphQLToTrainingProjectItem);
                } else {
                    state.data = [];
                }

                state.loading = false;
                state.error = null;
            })
            .addCase(fetchTrainingProjectById.rejected, (state, action) => {
                state.error = action.error.message ?? 'Error fetching training project by ID';
                state.loading = false;
            });
    }
});

export const { clearTrainingProjects } = trainingProjectSlice.actions;

// Export service methods for compatibility
export { trainingProjectService };

export default trainingProjectSlice.reducer;
