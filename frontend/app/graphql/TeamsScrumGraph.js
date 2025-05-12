import { gql } from "@apollo/client";

export const GET_TEAMS_SCRUMS = gql`
  query GetTeamsScrums($page: Int, $size: Int) {
    allTeamsScrums(page: $page, size: $size) {
      date
      code
      message
      data {
        id
        name
        members
        checklistId
        teamScrumId
      }
      currentPage
      totalPages
      totalItems
    }
  }
`;

export const GET_TEAM_SCRUM_BY_ID = gql`
  query GetTeamScrumById($id: ID!) {
    teamScrumById(id: $id) {
      date
      code
      message
      data {
        id
        name
        members
        checklistId
        teamScrumId
      }
    }
  }
`;

export const ADD_TEAM_SCRUM = gql`
  mutation AddTeamScrum($input: TeamsScrumInput!) {
    addTeamScrum(input: $input) {
      code
      message
      id
      data {
        id
        name
        members
        checklistId
        teamScrumId
      }
    }
  }
`;

export const UPDATE_TEAM_SCRUM = gql`
  mutation UpdateTeamScrum($id: ID!, $input: TeamsScrumInput!) {
    updateTeamScrum(id: $id, input: $input) {
      code
      message
      id
      data {
        id
        name
        members
        checklistId
        teamScrumId
      }
    }
  }
`;

export const DELETE_TEAM_SCRUM = gql`
  mutation DeleteTeamScrum($id: ID!) {
    deleteTeamScrum(id: $id) {
      code
      message
      id
      data {
        id
        name
        members
        checklistId
        teamScrumId
      }
    }
  }
`;
