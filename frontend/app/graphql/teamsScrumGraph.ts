import { gql } from "@apollo/client";

// Queries and Mutations for TeamsScrum
export const GET_TEAMS_SCRUMS = gql`
  query GetTeamsScrums($page: Int, $size: Int) {
    allTeamsScrums(page: $page, size: $size) {
      date
      code
      message
      data {
        id
        name
        checklist {
          id
          remarks
        }
      }
      currentPage
      totalPages
      totalItems
    }
  }
`;

export const GET_TEAM_SCRUM_BY_ID = gql`
  query GetTeamScrumById($id: Long!) {
    teamScrumById(id: $id) {
      date
      code
      message
      data {
        id
        name
        
        checklist {
          id
          remarks
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
      id 
    }
  }
`;

export const UPDATE_TEAM_SCRUM = gql`
  mutation UpdateTeamScrum($id: Long!, $input: TeamsScrumDto!) {
    updateTeamScrum(id: $id, input: $input) {
      code
      message
      id
    }
  }
`;

export const DELETE_TEAM_SCRUM = gql`
  mutation DeleteTeamScrum($id: Long!) {
    deleteTeamScrum(id: $id) {
      code
      message
      id 
    }
  }
`;
