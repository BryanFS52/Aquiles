import { gql } from "@apollo/client";

// Queries and Mutations for ImprovementPlan
export const GET_ALL_IMPROVEMENT_PLANS = gql`
query GetAllImprovementPlans($page: Int, $size: Int, $teacherCompetence: Long, $id: Long, $studySheetId: Long) {
  allImprovementPlans(page: $page, size: $size, teacherCompetence: $teacherCompetence, id: $id, studySheetId: $studySheetId) {
    code
    message
    date
    totalPages
    totalItems
    currentPage
    data {
      id
      actNumber
      city
      date
      startTime
      endTime
      place
      reason
      state
      additionalJustification
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
      learningOutcome {
        id
      }
      improvementPlanFile
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
        actNumber
        city
        date
        startTime
        endTime
        place
        reason
        state
        additionalJustification
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
        learningOutcome {
          id
        }
        improvementPlanFile
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
      id
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

export const CHECK_STUDENT_HAS_ACTIVE_PLAN = gql`
  query CheckStudentHasActivePlan($studentId: ID!, $page: Int, $size: Int) {
    allImprovementPlans(page: $page, size: $size) {
      data {
        id
        state
        student {
          id
        }
      }
    }
  }
`;
