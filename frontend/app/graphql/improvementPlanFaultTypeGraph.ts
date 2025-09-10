import { gql } from '@apollo/client';

// Query para obtener todos los tipos de fallas
export const GET_ALL_FAULT_TYPES = gql`
  query GetAllImprovementPlanFaultTypes($page: Int, $size: Int) {
    allImprovementPlanFaultTypes(page: $page, size: $size) {
      code
      message
      data {
        id
        name
      }
      totalItems
      totalPages
      currentPage
    }
  }
`;

// Query para obtener tipo de falla por ID
export const GET_FAULT_TYPE_BY_ID = gql`
  query GetImprovementPlanFaultTypeById($id: Long!) {
    improvementPlanFaultTypeById(id: $id) {
      code
      message
      data {
        id
        name
      }
    }
  }
`;
