import { gql } from '@apollo/client';

// Queries and Mutations for JustificationType
export const GET_ALL_JUSTIFICATION_TYPES = gql`
  query GetAllJustificationTypes($page: Int, $size: Int) {
    allJustificationTypes(page: $page, size: $size) {
      code
      data {
        id
        name
        description
      }
      date
      totalPages
      totalItems
      currentPage
      message
    }
  }
`;

export const GET_JUSTIFICATION_TYPE_BY_ID = gql`
  query GetJustificationTypeById($id: Long!) {
    justificationTypeById(id: $id) {
      code
      data {
        id
        name
        description
      }
      date
      message
    }
  }
`;

export const ADD_JUSTIFICATION_TYPE = gql`
  mutation AddJustificationType($input: JustificationTypeDto!) {
    addJustificationType(input: $input) {
      code
      message
    }
  }
`;

export const UPDATE_JUSTIFICATION_TYPE = gql`
  mutation UpdateJustificationType($id: Long!, $input: JustificationTypeDto!) {
    updateJustificationType(id: $id, input: $input) {
      code
      message
    }
  }
`;

export const DELETE_JUSTIFICATION_TYPE = gql`
  mutation DeleteJustificationType($id: Long!) {
    deleteJustificationType(id: $id) {
      code
      message
    }
  }
`;