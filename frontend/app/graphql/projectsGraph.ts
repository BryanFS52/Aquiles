import { gql } from "@apollo/client";

// Queries and Mutations for Projects
export const GET_All_PROJECTS = gql`
  query GetProjects($page: Int, $size: Int) {
    allProjects(page: $page, size: $size) {
      date
      code
      message
      data {
        projectId
        description
        problem
        objectives
        justification
        members
      }
      currentPage
      totalPages
      totalItems
    }
  }
`;

export const GET_PROJECT_BY_ID = gql`
  query GetProjectById($id: Long!) {
    projectById(id: $id) {
      date
      code
      message
      data {
        projectId
        description
        problem
        objectives
        justification
        members
      }
    }
  }
`;

export const ADD_PROJECT = gql`
  mutation AddProject($input: ProjectDto!) {
    addProject(input: $input) {
      code
      message
      id
      data 
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: Long!, $input: ProjectDto!) {
    updateProject(id: $id, input: $input) {
      code
      message
      id
      data {
        projectId
        description
        problem
        objectives
        justification
        members
      }
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: Long!) {
    deleteProject(id: $id) {
      code
      message
      id
      data {
        projectId
        description
        problem
        objectives
        justification
        members
      }
    }
  }
`;
