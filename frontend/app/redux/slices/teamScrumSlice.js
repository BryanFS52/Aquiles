import { client } from '@lib/apollo-client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    GET_TEAMS_SCRUMS,
    GET_TEAM_SCRUM_BY_ID,
    ADD_TEAM_SCRUM,
    UPDATE_TEAM_SCRUM,
    DELETE_TEAM_SCRUM,
} from '@graphql/teamsScrumGraph';

export const fetchTeamsScrums = createAsyncThunk(
    'teamScrum/fetchAll',
    async ({ page, size }) => {
        const { data } = await client.query({
            query: GET_TEAMS_SCRUMS,
            variables: { page, size },
            fetchPolicy: 'no-cache',
        });
        return data.allTeamsScrum;
    }
);

export const fetchTeamScrumById = createAsyncThunk(
    'teamScrum/fetchById',
    async ({ id }) => {
        const { data } = await client.query({
            query: GET_TEAM_SCRUM_BY_ID,
            variables: { id },
        });
        return data.teamScrumById;
    }
);

export const addTeamScrum = createAsyncThunk(
    'teamScrum/add',
    async (input, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate({
                mutation: ADD_TEAM_SCRUM,
                variables: { input }
            });
            const { addMacroRegion } = data;
            // Verificamos el código de la respuesta
            if (addMacroRegion.code !== "200") {
                // Si el código no es 200, retornamos el mensaje de error
                return rejectWithValue({ code: addMacroRegion.code, message: addMacroRegion.message });
            }
            // Si el código es 200, retornamos los datos
            return { ...input, id: addMacroRegion.id };
        } catch (error) {
            return rejectWithValue({ code: "500", message: error.message });
        }
    }
);

export const updateTeamScrum = createAsyncThunk(
    'teamScrum/update',
    async ({ id, input }, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate({
                mutation: UPDATE_TEAM_SCRUM,
                variables: { id, input },
            });
            return data.updateTeamScrum;
        } catch (error) {
            return rejectWithValue({ code: "500", message: error.message })
        }
    }
);

export const deleteTeamScrum = createAsyncThunk(
    'teamScrum/delete',
    async (id, { rejectWithValue }) => {
        try {
            await client.mutate({
                mutation: DELETE_TEAM_SCRUM,
                variables: { id },
            });
            return id;
        } catch (error) {
            return rejectWithValue({ code: "500", message: error.message })
        }
    }
);

const teamScrumSlice = createSlice({
    name: 'teamScrum',
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
            // fetchTeamsScrums
            .addCase(fetchTeamsScrums.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTeamsScrums.fulfilled, (state, action) => {
                state.data = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.loading = false;
            })
            .addCase(fetchTeamsScrums.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })
            // fetchTeamScrumById
            .addCase(fetchTeamScrumById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTeamScrumById.fulfilled, (state, action) => {
                state.data = action.payload; // Guardamos la información del teamScrum
                state.loading = false;
            })
            .addCase(fetchTeamScrumById.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
                state.loading = false;
            })
            // addTeamScrum
            .addCase(addTeamScrum.fulfilled, (state, action) => {
                state.data.push(action.payload);
                state.error = null;
            })
            .addCase(addTeamScrum.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
            })
            .addCase(updateTeamScrum.fulfilled, (state, action) => {
                const { id, input } = action.payload;
                const index = state.data.findIndex((teamScrum) => teamScrum.id === id);
                if (index !== -1) {
                    state.data[index] = { ...state.data[index], ...input };
                }
                state.error = null;
            })
            .addCase(updateTeamScrum.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
            })
            .addCase(deleteTeamScrum.fulfilled, (state, action) => {
                state.data = state.data.filter((teamScrum) => teamScrum.id !== action.payload);
                state.error = null;
            })
            .addCase(deleteTeamScrum.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
            });
    }
});

export const { } = teamScrumSlice.actions;

export default teamScrumSlice.reducer;