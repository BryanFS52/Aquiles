import { gql } from '@apollo/client';

// Queries and Mutations for ImprovementPlan
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
        city
        date
        reason
        state   
        qualification
        teacherCompetence{
            competence{
                name
            }
        }
        student{
            person{
                id
                name
            }
        }
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
        state
        qualification
        studentId
        teacherCompetence
      }
    }
  }
`;

export const ADD_IMPROVEMENT_PLAN = gql`
  mutation AddImprovementPlan($input: ImprovementPlanDto!) {
    addImprovementPlan(input: $input) {
      code
      message
      id
    }
  }
`;

export const UPDATE_IMPROVEMENT_PLAN = gql`
  mutation UpdateImprovementPlan($id: ID!, $input: ImprovementPlanDto!) {
    updateImprovementPlan(id: $id, input: $input) {
      code
      message
      id
    }
  }
`;

export const DELETE_IMPROVEMENT_PLAN = gql`
  mutation DeleteImprovementPlan($id: ID!) {
    deleteImprovementPlan(id: $id) {
      code
      message
      id
    }
  }
`;
