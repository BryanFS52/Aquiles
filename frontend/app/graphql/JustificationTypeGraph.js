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
  query GetJustificationTypeById($id: ID!) {
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
  mutation AddJustificationType($input: JustificationTypeInput!) {
    addJustificationType(input: $input) {
      code
      message
      success
    }
  }
`;

export const UPDATE_JUSTIFICATION_TYPE = gql`
  mutation UpdateJustificationType($id: ID!, $input: JustificationTypeInput!) {
    updateJustificationType(id: $id, input: $input) {
      code
      message
      success
    }
  }
`;

export const DELETE_JUSTIFICATION_TYPE = gql`
  mutation DeleteJustificationType($id: ID!) {
    deleteJustificationType(id: $id) {
      code
      message
      success
    }
  }
`;

export default {
  GET_ALL_JUSTIFICATION_TYPES,
  GET_JUSTIFICATION_TYPE_BY_ID,
  ADD_JUSTIFICATION_TYPE,
  UPDATE_JUSTIFICATION_TYPE,
  DELETE_JUSTIFICATION_TYPE,
};