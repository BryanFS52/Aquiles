import { clientLAN } from '@lib/apollo-client';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GET_TEAMS_SCRUMS, GET_TEAM_SCRUM_BY_ID, ADD_TEAM_SCRUM, UPDATE_TEAM_SCRUM, DELETE_TEAM_SCRUM, } from '@graphql/teamsScrumGraph';
import { createInitialPaginatedState, RejectedPayload } from '@type/slices/common/generic'
import {
    TeamsScrum,
    GetTeamsScrumsQuery,
    GetTeamsScrumsQueryVariables,
    GetTeamScrumByIdQuery,
    GetTeamScrumByIdQueryVariables,
    AddTeamScrumMutation,
    AddTeamScrumMutationVariables,
    UpdateTeamScrumMutation,
    UpdateTeamScrumMutationVariables,
    DeleteTeamScrumMutation,
    DeleteTeamScrumMutationVariables
} from '@graphql/generated'

// Función para transformar datos de GraphQL a TeamsScrum
const transformGraphQLToTeamScrumItem = (graphqlData: any): TeamsScrum => {
    const teamData = graphqlData?.teamScrum || graphqlData;
    return {
        id: teamData.id,
        teamName: teamData.teamName,
        projectName: teamData.projectName,
        problem: teamData.problem,
        objectives: teamData.objectives,
        description: teamData.description,
        projectJustification: teamData.projectJustification,
        checklist: teamData.checklist,
        studySheet: teamData.studySheet,
        students: teamData.students || [],
    };
};


export const fetchTeamsScrums = createAsyncThunk<GetTeamsScrumsQuery['allTeamsScrums'], GetTeamsScrumsQueryVariables>(
    'teamScrum/fetchAll',
    async ({ page, size }) => {
        const { data } = await clientLAN.query<GetTeamsScrumsQuery, GetTeamsScrumsQueryVariables>({
            query: GET_TEAMS_SCRUMS,
            variables: { page, size },
            fetchPolicy: 'no-cache',
        });
        return data.allTeamsScrums;
    }
);

export const fetchTeamScrumById = createAsyncThunk<GetTeamScrumByIdQuery['teamScrumById'], GetTeamScrumByIdQueryVariables,
    { rejectValue: { code: string; message: string } }
>(
    'teamScrum/fetchById',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.query<GetTeamScrumByIdQuery, GetTeamScrumByIdQueryVariables>({
                query: GET_TEAM_SCRUM_BY_ID,
                variables: { id },
            });

            return data.teamScrumById;
        } catch (error: any) {
            console.error("Apollo error:", error);
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);



export const addTeamScrum = createAsyncThunk<AddTeamScrumMutation['addTeamScrum'], AddTeamScrumMutationVariables['input'],
    { rejectValue: { code: string; message: string } }
>(
    'teamScrum/add',
    async (input, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.mutate<AddTeamScrumMutation, AddTeamScrumMutationVariables>({
                mutation: ADD_TEAM_SCRUM,
                variables: { input }
            });
            const res = data?.addTeamScrum;

            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }
            return res;
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

export const updateTeamScrum = createAsyncThunk<UpdateTeamScrumMutation['updateTeamScrum'], UpdateTeamScrumMutationVariables,
    { rejectValue: { code: string; message: string } }
>(
    'teamScrum/update',
    async ({ id, input }, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.mutate<UpdateTeamScrumMutation, UpdateTeamScrumMutationVariables>({
                mutation: UPDATE_TEAM_SCRUM,
                variables: { id, input },
            });

            const res = data?.updateTeamScrum;
            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }

            return res;
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

export const deleteTeamScrum = createAsyncThunk<string, string,
    { rejectValue: { code: string; message: string } }
>(
    'teamScrum/delete',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.mutate<DeleteTeamScrumMutation, DeleteTeamScrumMutationVariables>({
                mutation: DELETE_TEAM_SCRUM,
                variables: { id },
            });
            const res = data?.deleteTeamScrum;
            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }

            return id;
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

interface ExtendedTeamScrumState extends ReturnType<typeof createInitialPaginatedState<TeamsScrum>> {
    dataForTeamScrumById: TeamsScrum | null;
}

const initialState: ExtendedTeamScrumState = {
    ...createInitialPaginatedState<TeamsScrum>(),
    dataForTeamScrumById: null
};
const teamScrumSlice = createSlice({
    name: 'teamScrum',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchTeamsScrums
            .addCase(fetchTeamsScrums.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTeamsScrums.fulfilled, (state, action) => {
                if (action.payload?.data) {
                    // Filtra nulls y transforma los datos
                    state.data = action.payload.data
                        .filter((item): item is NonNullable<typeof item> => item !== null)
                        .map(transformGraphQLToTeamScrumItem);

                    state.totalItems = action.payload.totalItems ?? 0;
                    state.totalPages = action.payload.totalPages ?? 0;
                    state.currentPage = action.payload.currentPage ?? 0;
                }

                state.loading = false;
            })

            .addCase(fetchTeamsScrums.rejected, (state, action) => {
                state.error = action.error.message || 'Error fetching team scrums';
                state.loading = false;
            })
            // fetchTeamScrumById
            .addCase(fetchTeamScrumById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTeamScrumById.fulfilled, (state, action: PayloadAction<GetTeamScrumByIdQuery['teamScrumById']>) => {
                if (action.payload) {
                    state.dataForTeamScrumById = transformGraphQLToTeamScrumItem(action.payload.data);
                }
                state.loading = false;
            })
            .addCase(fetchTeamScrumById.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
                state.loading = false;
            })
            // addTeamScrum
            .addCase(addTeamScrum.fulfilled, (state, action: PayloadAction<AddTeamScrumMutation['addTeamScrum']>) => {
                if (action.payload) {
                    state.data.push(action.payload as any);
                }
                state.error = null;
            })
            .addCase(addTeamScrum.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            })
            // updateTeamScrum
            .addCase(updateTeamScrum.fulfilled, (state, action: PayloadAction<UpdateTeamScrumMutation['updateTeamScrum']>) => {
                if (action.payload) {
                    const updatedTeamScrum = transformGraphQLToTeamScrumItem(action.payload);
                    const index = state.data.findIndex((teamScrum: any) => teamScrum.id === updatedTeamScrum.id);
                    if (index !== -1) {
                        state.data[index] = updatedTeamScrum;
                    }
                }
                state.error = null;
            })
            .addCase(updateTeamScrum.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            })
            // deleteTeamScrum
            .addCase(deleteTeamScrum.fulfilled, (state, action: PayloadAction<string>) => {
                if (action.payload) {
                    state.data = state.data.filter((teamScrum: any) => teamScrum.id !== action.payload);
                }
                state.error = null;
            })
            .addCase(deleteTeamScrum.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            })
    }
});

export const { } = teamScrumSlice.actions;

export default teamScrumSlice.reducer;