import { gql } from '@apollo/client';

// Consulta para obtener todos los estados de justificación con paginación
export const GET_ALL_JUSTIFICATION_STATUS = gql`
  query GetAllJustificationStatus($page: Int, $size: Int) {
    allJustificationsStatus(page: $page, size: $size) {
      date
      code
      message
      data {
        id
        name
        state
      }
      
      totalPages
      totalItems
      currentPage
    }
  }
`;

// Consulta para obtener un estado de justificación por ID
export const GET_JUSTIFICATION_STATUS_BY_ID = gql`
  query GetJustificationStatusById($id: Long!) {
    justificationStatusById(id: $id) {
      date
      code
      message
      data {
        id
        name
        state
      }
    }
  }
`;

// Mutación para agregar un nuevo estado de justificación
export const ADD_JUSTIFICATION_STATUS = gql`
  mutation AddJustificationStatus($input: JustificationStatusDto!) {
    addJustificationStatus(input: $input) {
      id
      code
      message
    }
  }
`;

// Mutación para actualizar un estado de justificación
export const UPDATE_JUSTIFICATION_STATUS = gql`
  mutation UpdateJustificationStatus($id: Long!, $input: JustificationStatusDto!) {
    updateJustificationStatus(id: $id, input: $input) {
      id
      code
      message
    }
  }
`;

// Mutación para eliminar un estado de justificación
export const DELETE_JUSTIFICATION_STATUS = gql`
  mutation DeleteJustificationStatus($id: Long!) {
    deleteJustificationStatus(id: $id) {
      id
      code
      message
    }
  }
`;