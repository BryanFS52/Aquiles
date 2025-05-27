import { gql } from "@apollo/client";

// Queries and Mutations for TeamsScrum
export const GET_TEAMS_SCRUMS = gql`
  query GetTeamsScrums($page: Int, $size: Int) {
    allTeamsScrums(page: $page, size: $size) {
      date
      code
      message
      currentPage
      totalPages
      totalItems
      data {
        id
        name
        members
        checklist {
          id
          remarks
        }
        project {
          projectId
          description
        }
      }
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
        checklist {
          id
          remarks
        }
        project {
          projectId
          description
        }
      }
    }
  }
`;

export const ADD_TEAM_SCRUM = gql`
  mutation AddTeamScrum($input: TeamsScrumDto!) {
    addTeamScrum(input: $input) {
      code
      message
      data 
    }
  }
`;

export const UPDATE_TEAM_SCRUM = gql`
  mutation UpdateTeamScrum($id: ID!, $input: TeamsScrumDto!) {
    updateTeamScrum(id: $id, input: $input) {
      code
      message
      data {
        id
        name
        members
      }
    }
  }
`;

export const DELETE_TEAM_SCRUM = gql`
  mutation DeleteTeamScrum($id: ID!) {
    deleteTeamScrum(id: $id) {
      code
      message
      data 
    }
  }
`;
