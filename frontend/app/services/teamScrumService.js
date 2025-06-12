import { client } from '@/lib/apollo-client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  GET_TEAMS_SCRUMS,
  GET_TEAM_SCRUM_BY_ID,
  ADD_TEAM_SCRUM,
  UPDATE_TEAM_SCRUM,
  DELETE_TEAM_SCRUM,
} from '@graphql/teamsScrumGraph';

export const fetchTeamsScrums = async (page, size) => {
  const { data } = await client.query({
    query: GET_TEAMS_SCRUMS,
    variables: { page, size },
    fetchPolicy: 'no-cache',
  });
  return data.allTeamsScrums;
};

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

export const addTeamScrum = async (input) => {
  const { data } = await client.mutate({
    mutation: ADD_TEAM_SCRUM,
    variables: { input },
  });
  return data.addTeamScrum;
};

export const updateTeamScrum = async (id, input) => {
  const { data } = await client.mutate({
    mutation: UPDATE_TEAM_SCRUM,
    variables: { id, input },
  });
  return data.updateTeamScrum;
};

export const deleteTeamScrum = async (id) => {
  const { data } = await client.mutate({
    mutation: DELETE_TEAM_SCRUM,
    variables: { id },
  });
  return data.deleteTeamScrum;
};