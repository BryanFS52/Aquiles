import { gql } from "@apollo/client";

export const SAVE_OR_UPDATE_CHECKLIST_QUALIFICATION = gql`
  mutation SaveOrUpdateChecklistQualification($input: ChecklistQualificationDto!) {
    saveOrUpdateChecklistQualification(input: $input) {
      code
      message
      id
    }
  }
`;

export const GET_CHECKLIST_QUALIFICATIONS_BY_CHECKLIST = gql`
  query GetChecklistQualificationsByChecklist($checklistId: Long!, $teamScrumId: Long!) {
    checklistQualificationsByChecklist(checklistId: $checklistId, teamScrumId: $teamScrumId) {
      id
      qualificationState
      observations
      itemId
      teamScrumId
      checklistId
    }
  }
`;

export const DELETE_CHECKLIST_QUALIFICATION = gql`
  mutation DeleteChecklistQualification($id: Long!) {
    deleteChecklistQualification(id: $id) {
      code
      message
      id
    }
  }
`;
