import { gql } from '@apollo/client';

// Query para obtener todos los tipos de justificación con paginación
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

// Query para obtener un tipo de justificación específico por ID
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

// Mutación para crear un nuevo tipo de justificación
export const ADD_JUSTIFICATION_TYPE = gql`
  mutation AddJustificationType($input: JustificationTypeInput!) {
    addJustificationType(input: $input) {
      code
      message
      success
    }
  }
`;

// Mutación para actualizar un tipo de justificación existente
export const UPDATE_JUSTIFICATION_TYPE = gql`
  mutation UpdateJustificationType($id: ID!, $input: JustificationTypeInput!) {
    updateJustificationType(id: $id, input: $input) {
      code
      message
      success
    }
  }
`;

// Mutación para eliminar un tipo de justificación
export const DELETE_JUSTIFICATION_TYPE = gql`
  mutation DeleteJustificationType($id: ID!) {
    deleteJustificationType(id: $id) {
      code
      message
      success
    }
  }
`;