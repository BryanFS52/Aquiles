/*
import { gql } from "@apollo/client";

// Queries para Training Projects
export const GET_ALL_TRAINING_PROJECTS = gql`
  query GetAllTrainingProjects($name: String, $idProgram: Long, $page: Int, $size: Int) {
    allTrainingProjects(name: $name, idProgram: $idProgram, page: $page, size: $size) {
      date
      code
      message
      data {
        id
        name
        description
        state
        program {
          id
          name
          description
          coordination {
            id
            name
          }
          trainingLevel {
            id
            name
          }
        }
      }
      currentPage
      totalPages
      totalItems
    }
  }
`;

export const GET_TRAINING_PROJECTS_BY_PROGRAM = gql`
  query GetTrainingProjectsByProgram($idProgram: Long!, $page: Int, $size: Int) {
    allTrainingProjects(idProgram: $idProgram, page: $page, size: $size) {
      date
      code
      message
      data {
        id
        name
        description
        state
        program {
          id
          name
        }
      }
      currentPage
      totalPages
      totalItems
    }
  }
`;

export const GET_TRAINING_PROJECT_BY_ID = gql`
  query GetTrainingProjectById($id: Long!) {
    trainingProjectById(id: $id) {
      code
      message
      data {
        id
        name
        description
        state
        program {
          id
          name
          description
          coordination {
            id
            name
          }
          trainingLevel {
            id
            name
          }
        }
      }
    }
  }
`;
*/
