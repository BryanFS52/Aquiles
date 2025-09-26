import { gql } from "@apollo/client";

// Los campos trainingProjectId y trainingProjectName están implementados
// tanto en el backend como en el frontend para soportar la asociación de
// listas de chequeo con proyectos formativos y fichas de formación.

// ============================================================================
// CONSULTAS PARA EL COORDINADOR (con campos de proyecto formativo)
// ============================================================================

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

// ============================================================================
// CONSULTAS PARA EL COORDINADOR (con campos de proyecto formativo)
// ============================================================================

export const GET_ALL_CHECKLISTS_COORDINATOR = gql`
  query GetAllChecklistsCoordinator($page: Int, $size: Int) {
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
        trainingProjectId
        trainingProjectName
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

export const GET_CHECKLIST_BY_ID_COORDINATOR = gql`
  query GetChecklistByIdCoordinator($id: Long!) {
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
        trainingProjectId
        trainingProjectName
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

// ============================================================================
// CONSULTAS PARA EL INSTRUCTOR (sin campos de proyecto formativo)
// ============================================================================

export const GET_ALL_CHECKLISTS_INSTRUCTOR = gql`
  query GetAllChecklistsInstructor($page: Int, $size: Int) {
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

export const GET_CHECKLIST_BY_ID_INSTRUCTOR = gql`
  query GetChecklistByIdInstructor($id: Long!) {
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

// ============================================================================
// MUTACIONES (compartidas entre coordinador e instructor)
// ============================================================================

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

export const EXPORT_CHECKLIST_PDF = gql`
  query ExportChecklistToPdf($id: Long!) {
    exportChecklistToPdf(id: $id)
  }
`;

export const EXPORT_CHECKLIST_EXCEL = gql`
  query ExportChecklistToExcel($id: Long!) {
    exportChecklistToExcel(id: $id)
  }
`;
