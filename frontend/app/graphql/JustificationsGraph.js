import { gql } from '@apollo/client';

export const GET_ALL_JUSTIFICATIONS = gql`
  query GetAllJustifications($page: Int, $size: Int) {
    allJustifications(page: $page, size: $size) {
      code
      message
      date
      data {
        id
        description
        justificationDate
        justificationHistory
        state
        notificationId
        justificationTypeId
      }
      totalPages
      totalItems
      currentPage
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
        description
        justificationDate
        justificationHistory
        state
        notificationId
        justificationTypeId
      }
    }
  }
`;

export const ADD_JUSTIFICATION = gql`
  mutation AddJustification($input: JustificationInput) {
    addJustification(input: $input) {
      code
      message
    }
  }
`;

export const UPDATE_JUSTIFICATION = gql`
  mutation UpdateJustification($id: ID!, $input: JustificationInput) {
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
