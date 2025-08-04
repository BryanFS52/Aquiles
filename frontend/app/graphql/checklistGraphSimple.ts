import { gql } from "@apollo/client";

// Queries simplificadas para Checklist (sin campos problemáticos)
export const GET_ALL_CHECKLISTS_SIMPLE = gql`
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
        studySheets
        evaluations {
          id
              recommendations
          valueJudgment
        }
        items {
          id
          code
          indicator
          active  
        }
        associatedJuries {
          id
        }
      }
    }
  }
`;

export const GET_CHECKLIST_BY_ID_SIMPLE = gql`
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
        studySheets
        evaluations
        items {
          id
          code
          indicator
          active
        }
        associatedJuries {
          id
        }
      }
    }
  }
`;

export const ADD_CHECKLIST_SIMPLE = gql`
  mutation AddChecklist($input: ChecklistDto!) {
    addChecklist(input: $input) {
      code
      message
      id
    }
  }
`;

export const UPDATE_CHECKLIST_SIMPLE = gql`
  mutation UpdateChecklist($id: Long!, $input: ChecklistDto!) {
    updateChecklist(id: $id, input: $input) {
      code
      message
      id
    }
  }
`;

export const DELETE_CHECKLIST_SIMPLE = gql`
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