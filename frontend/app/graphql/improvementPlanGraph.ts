import { gql } from '@apollo/client';

// Queries and Mutations for ImprovementPlan
export const GET_ALL_IMPROVEMENT_PLANS = gql`
query GetAllImprovementPlans($page: Int, $size: Int, $teacherCompetence: Long, $idStudySheet: Long, $id: Long) {
  allImprovementPlans(page: $page, size: $size, teacherCompetence: $teacherCompetence, idStudySheet: $idStudySheet, id: $id) {
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
      state
      qualification
      student {
        id
        person {
          name
          lastname
          document
        }
      }
      teacherCompetence {
        id
        competence {
          id
          name
        }
      }
      faultType {
        id
        name
      }
    }
  }
}
`;

export const GET_IMPROVEMENT_PLAN_BY_ID = gql`
  query GetImprovementPlanById($id: Long!) {
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
        student {
          id
          person {
            name
            lastname
            document
          }
        }
        teacherCompetence {
          id
          competence {
            id
            name
          }
        }
        faultType {
          id
          name
        }
      }
    }
  }
`;

export const ADD_IMPROVEMENT_PLAN = gql`
  mutation AddImprovementPlan($input: ImprovementPlanDto!) {
    addImprovementPlan(input: $input) {
      code
      message
    }
  }
`;

export const UPDATE_IMPROVEMENT_PLAN = gql`
  mutation UpdateImprovementPlan($id: Long!, $input: ImprovementPlanDto!) {
    updateImprovementPlan(id: $id, input: $input) {
      code
      message
    }
  }
`;

export const DELETE_IMPROVEMENT_PLAN = gql`
  mutation DeleteImprovementPlan($id: Long!) {
    deleteImprovementPlan(id: $id) {
      code
      message
    }
  }
`;