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
          teamName
          projectName
          problem
          objectives
          description
          projectJustification
          students{
              id
              person{
                  name
                  lastname
              }
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
        code
        message
        date
        data {
          id
          teamName
          projectName
          problem
          objectives
          description
          projectJustification
        }
      }
  }
  `;

export const GET_TEAM_SCRUM_BY_ID_WITH_STUDENTS = gql`
    query GetTeamScrumByIdWithStudents($id: Long!) {
      teamScrumById(id: $id) {
        code
        message
        date
        data {
          id
          teamName
          projectName
          problem
          objectives
          description
          projectJustification
          studySheet {
            number
            quarter {
              name {
                extension
                number
              }
            }
          }
          students {
            person {
              name
              lastname
            }
            profiles {
              name
            }
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

export const ADD_PROFILE_TO_STUDENT = gql`
  mutation AddProfileToStudent($input: [ProcessMethodologyDto]!) {
    addProfileToStudent(input: $input) {
      code
      message
      id {
        id
        studentId
        profileId
      }
    }
  }
  `;

export const UPDATE_TEAM_SCRUM = gql`
    mutation UpdateTeamScrum($id: Long!, $input: TeamsScrumDto) {
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
