import { gql } from "@apollo/client";

export const GET_ALL_EVALUATIONS = gql`
  query GetAllEvaluations($page: Int, $size: Int) {
    allEvaluations(page: $page, size: $size) {
      code
      message
      date
      currentPage
      totalPages
      totalItems
      data {
        id
        observations
        recommendations
        valueJudgment
        checklistId
      }
    }
  }
`;

export const GET_EVALUATION_BY_ID = gql`
  query GetEvaluationById($id: Long!) {
    evaluationById(id: $id) {
      code
      message
      date
      data {
        id
        observations
        recommendations
        valueJudgment
        checklistId
      }
    }
  }
`;

export const ADD_EVALUATION = gql`
  mutation AddEvaluation($input: EvaluationDto!) {
    addEvaluation(input: $input) {
      code
      message
      id
    }
  }
`;

export const UPDATE_EVALUATION = gql`
  mutation UpdateEvaluation($id: Long!, $input: EvaluationDto!) {
    updateEvaluation(id: $id, input: $input) {
      code
      message
      id
    }
  }
`;

export const DELETE_EVALUATION = gql`
  mutation DeleteEvaluation($id: Long!) {
    deleteEvaluation(id: $id) {
      code
      message
      id
    }
  }
`;

export const GET_EVALUATIONS_BY_CHECKLIST = gql`
  query GetEvaluationsByChecklist($checklistId: Long!) {
    evaluationsByChecklist(checklistId: $checklistId) {
      code
      message
      date
      currentPage
      totalPages
      totalItems
      data {
        id
        observations
        recommendations
        valueJudgment
        checklistId
      }
    }
  }
`;
