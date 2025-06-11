import { client } from "@lib/apollo-client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GET_All_PROJECTS, GET_PROJECT_BY_ID, ADD_PROJECT, UPDATE_PROJECT, DELETE_PROJECT } from '@graphql/projectsGraph'

export const fetchProjects = createAsyncThunk(
    'project/fetchAll',
    async ({ page, size }) => {
        const { data } = await client.query({
            query: GET_All_PROJECTS,
            variables: { page, size },
            fetchPolicy: 'no-cache',
        });
        return data.allProjects;
    }
);

export const fetchProjectById = createAsyncThunk(
    'project/fetchById',
    async ({ id }) => {
        const { data } = await client.query({
            query: GET_PROJECT_BY_ID,
            variables: { id },
        });
        return data.projectById;
    }
);

export const addProject = createAsyncThunk(
    'project/add',
    async (input, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate({
                mutation: ADD_PROJECT,
                variables: { input }
            });
            const { addProject } = data;
            if (addProject.code !== "200") {
                return rejectWithValue({ code: addProject.code, message: addProject.message });
            }
            return { ...input, id: addProject.id };
        } catch (error) {
            return rejectWithValue({ code: "500", message: error.message });
        }
    }
);

export const updateProject = createAsyncThunk(
    'project/update',
    async ({ id, input }, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate({
                mutation: UPDATE_PROJECT,
                variables: { id, input },
            });
            return data.updateProject;
        } catch (error) {
            return rejectWithValue({ code: "500", message: error.message })
        }
    }
);

export const deleteProject = createAsyncThunk(
    'project/delete',
    async (id, { rejectWithValue }) => {
        try {
            await client.mutate({
                mutation: DELETE_PROJECT,
                variables: { id },
            });
            return id;
        } catch (error) {
            return rejectWithValue({ code: "500", message: error.message })
        }
    }
);

const projectSlice = createSlice({
    name: 'project',
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
            // fetchProjects
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.data = action.payload.data;
                state.totalItems = action.payload.totalItems;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.loading = false;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })
            // fetchProjectById
            .addCase(fetchProjectById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProjectById.fulfilled, (state, action) => {
                state.data = action.payload; // Guardamos la información del project
                state.loading = false;
            })
            .addCase(fetchProjectById.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
                state.loading = false;
            })
            // addProject
            .addCase(addProject.fulfilled, (state, action) => {
                state.data.push(action.payload);
                state.error = null;
            })
            .addCase(addProject.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
            })
            // updateProject
            .addCase(updateProject.fulfilled, (state, action) => {
                const { id, input } = action.payload;
                const index = state.data.findIndex((project) => project.id === id);
                if (index !== -1) {
                    state.data[index] = { ...state.data[index], ...input };
                }
                state.error = null;
            })
            .addCase(updateProject.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
            })
            // deleteProject
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.data = state.data.filter((project) => project.id !== action.payload);
                state.error = null;
            })
            .addCase(deleteProject.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
            });
    }
});

export const { } = projectSlice.actions;

export default projectSlice.reducer;
