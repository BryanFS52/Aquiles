import { client } from '@/lib/apollo-client';
import {
    GET_All_PROJECTS,
    GET_PROJECT_BY_ID,
    ADD_PROJECT,
    UPDATE_PROJECT,
    DELETE_PROJECT,
} from '@graphql/projectsGraph';

export const fetchProjects = async (page = 1, size = 10) => {
    try {
        const { data } = await client.query({
            query: GET_All_PROJECTS,
            variables: { page, size },
            fetchPolicy: 'network-only',
        });
        return data.allProjects;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const fetchProjectById = async (id) => {
    try {
        const { data } = await client.query({
            query: GET_PROJECT_BY_ID,
            variables: { id },
            fetchPolicy: 'network-only',
        });
        return data.projectById;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const addProject = async (input) => {
    try {
        const { data } = await client.mutate({
            mutation: ADD_PROJECT,
            variables: { input },
        });
        return data.addProject;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const updateProject = async (id, input) => {
    try {
        const { data } = await client.mutate({
            mutation: UPDATE_PROJECT,
            variables: { id, input },
        });
        return data.updateProject;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const deleteProject = async (id) => {
    try {
        const { data } = await client.mutate({
            mutation: DELETE_PROJECT,
            variables: { id },
        });
        return data.deleteProject;
    } catch (error) {
        throw new Error(error.message);
    }
};