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
        documentNumber
        name
        description
        justificationFile
        justificationDate
        justificationHistory
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
  query GetJustificationById($id: ID!) {
    justificationById(id: $id) {
      code
      message
      date
      data {
        id
        documentNumber
        name
        description
        justificationFile
        justificationDate
        justificationHistory
        state
        notificationId
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
  mutation UpdateJustification($id: ID!, $input: JustificationDto!) {
    updateJustification(id: $id, input: $input) {
      code
      message
    }
  }
`;

export const DELETE_JUSTIFICATION = gql`
  mutation DeleteJustification($id: ID!) {
    deleteJustification(id: $id) {
      code
      message
    }
  }
`;