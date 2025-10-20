import { gql } from '@apollo/client';

export const GET_ALL_FAULT_TYPES = gql`
  query GetAllImprovementPlanFaultTypes($page: Int, $size: Int) {
    allImprovementPlanFaultTypes(page: $page, size: $size) {
      code
      message
      totalItems
      totalPages
      currentPage
      data {
        id
        name
      }
    }
  }
`;

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

export const ADD_FAULT_TYPE = gql`
  mutation AddImprovementPlanFaultType($input: ImprovementPlanFaultTypeDto) {
    addImprovementPlanFaultType(input: $input) {
      code
      message
    }
  }
`;

export const UPDATE_FAULT_TYPE = gql`
  mutation UpdateImprovementPlanFaultType($id: Long!, $input: ImprovementPlanFaultTypeDto) {
    updateImprovementPlanFaultType(id: $id, input: $input) {
      code
      message
    }
  }
`;

export const DELETE_FAULT_TYPE = gql`
  mutation DeleteImprovementPlanFaultType($id: Long!) {
    deleteImprovementPlanFaultType(id: $id) {
      code
      message
    }
  }
`;
