import { gql } from '@apollo/client';

// Queries and Mutations for Justifications
export const GET_ALL_JUSTIFICATIONS = gql`
  query GetAllJustifications($page: Int, $size: Int) {
    allJustifications(page: $page, size: $size) {
      code
      message
      date
      totalPages
      totalItems
      currentPage
      data {
        id
        description
        justificationFile
        justificationDate
        state
        justificationType {
          id
          name
        }
        attendance{
            student{
                id
                person{
                    name
                    lastname
                    document
                }
            }
        }
      }
    }
  }
`;

export const GET_JUSTIFICATIONS_BY_STUDENT = gql`
  query GetAllJustificationsByStudent($studentId: Long!) {
    allJustificationsByStudent(studentId: $studentId) {
      code
      message
      data {
        id
        description
        justificationFile
        justificationDate
        state
        justificationType {
          id
          name
        }
      }
    }
  }
`;

export const GET_JUSTIFICATION_BY_ID = gql`
  query GetJustificationById($id: Long!) {
    justificationById(id: $id) {
      code
      message
      data {
        id
        description
        justificationFile
        justificationDate
        state
        justificationType {
          id
          name
        }
      }
    }
  }
`;

export const ADD_JUSTIFICATION = gql`
  mutation AddJustification($input: JustificationDto!) {
    addJustification(input: $input) {
      code
      message
    }
  }
`;

export const UPDATE_JUSTIFICATION = gql`
  mutation UpdateJustification($id: Long!, $input: JustificationDto!) {
    updateJustification(id: $id, input: $input) {
      code
      message
    }
  }
`;

export const DELETE_JUSTIFICATION = gql`
  mutation DeleteJustification($id: Long!) {
    deleteJustification(id: $id) {
      code
      message
    }
  }
`;
