import { gql } from '@apollo/client';

export const GET_ALL_IMPROVEMENT_PLANS = gql`
  query GetAllImprovementPlans($page: Int, $size: Int) {
    allImprovementPlans(page: $page, size: $size) {
      code
      message
      date
      totalPages
      totalItems
      currentPage
      data {
        id
        city
        date
        reason
        number
        state
      }
    }
  }
`;

export const GET_IMPROVEMENT_PLAN_BY_ID = gql`
  query GetImprovementPlanById($id: ID!) {
    improvementPlanById(id: $id) {
      code
      message
      date
      data {
        id
        city
        date
        reason
        number
        state
      }
    }
  }
`;

export const ADD_IMPROVEMENT_PLAN = gql`
  mutation AddImprovementPlan($input: ImprovementPlanInput!) {
    addImprovementPlan(input: $input) {
      code
      message
      date
    }
  }
`;

export const UPDATE_IMPROVEMENT_PLAN = gql`
  mutation UpdateImprovementPlan($id: ID!, $input: ImprovementPlanInput!) {
    updateImprovementPlan(id: $id, input: $input) {
      code
      message
      date
    }
  }
`;

export const DELETE_IMPROVEMENT_PLAN = gql`
  mutation DeleteImprovementPlan($id: ID!) {
    deleteImprovementPlan(id: $id) {
      code
      message
      date
    }
  }
`;
