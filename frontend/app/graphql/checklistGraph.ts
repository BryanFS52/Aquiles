import { gql } from "@apollo/client";

export const GET_ALL_CHECKLISTS = gql`
  query GetAllChecklists($page: Int, $size: Int) {
    allChecklists(page: $page, size: $size) {
      date
      code
      message
      currentPage
      totalPages
      totalItems
      data {
        id
        state
        remarks
        instructorSignature
        evaluationCriteria
        trimester
        component
        studySheets
        items {
          id
          code
          indicator
          active
        }
      }
    }
  }
`;

export const GET_CHECKLIST_BY_ID = gql`
  query GetChecklistById($id: Long!) {
    checklistById(id: $id) {
      code
      date
      message
      data {
        id
        state
        remarks
        instructorSignature
        evaluationCriteria
        trimester
        component
        studySheets
        items {
          id
          code
          indicator
          active
        }
        evaluations {
          id
          observations
          recommendations
          valueJudgment
          checklistId
        }
        associatedJuries {
          id
        }
      }
    }
  }
`;

export const ADD_CHECKLIST = gql`
  mutation AddChecklist($input: ChecklistDto!) {
    addChecklist(input: $input) {
      code
      message
      id
    }
  }
`;

export const UPDATE_CHECKLIST = gql`
  mutation UpdateChecklist($id: Long!, $input: ChecklistDto!) {
    updateChecklist(id: $id, input: $input) {
      code
      message
      id
    }
  }
`;

export const DELETE_CHECKLIST = gql`
  mutation DeleteChecklist($id: Long!) {
    deleteChecklist(id: $id) {
      code
      message
      id
    }
  }
`;

export const UPDATE_ITEM_STATUS = gql`
  mutation UpdateItemStatus($itemId: Long!, $active: Boolean!) {
    updateItemStatus(itemId: $itemId, active: $active) {
      code
      message
      id
    }
  }
`;
