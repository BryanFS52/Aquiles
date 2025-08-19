import { gql } from '@apollo/client';

// Queries and Mutations for Justifications
export const GET_ALL_JUSTIFICATIONS = gql`
  query GetAllJustifications($page: Int, $size: Int) {
    allJustifications(page: $page, size: $size) {
      code
      message
      date
      totalPages
      totalItems
      currentPage
      data {
        id
        description
        justificationFile
        absenceDate
        justificationDate
        state
        justificationType {
          id
          name
        }
        justificationStatus {
          id
          name
          state
        }
        attendance {
          student {
            id
            person {
              name
              lastname
              document
            }
          }
        }
      }
    }
  }
`;

export const GET_JUSTIFICATION_BY_ID = gql`
  query GetJustificationById($id: Long!) {
    justificationById(id: $id) {
      code
      message
      data {
        id
        description
        justificationFile
        absenceDate
        justificationDate
        state
        justificationType {
          id
          name
        }
        justificationStatus {
          id
          name
          state
        }
        attendance {
          id
        }
      }
    }
  }
`;

export const GET_JUSTIFICATION_BY_STUDY_SHEET_BY_ID = gql`
  query GetJustificationByStudySheetId($id: Long!) {
    studySheetById(id: $id) {
      code
      message
      data {
        id
        number
        trainingProject {
          program {
            id
            name
          }
        }
        studentStudySheets {
          student {
            id
            person {
              id
              document
              name
              lastname
            }
            attendances {
              id
              justification {
                id
                description
                justificationFile
                absenceDate
                justificationDate
                state
                justificationType {
                  id
                  name
                }
                justificationStatus {
                  id
                  name
                  state
                }
              }
            }
          }
          studentStudySheetState {
            id
            name
          }
        }
      }
    }
  }
`;



export const ADD_JUSTIFICATION = gql`
  mutation AddJustification($input: JustificationDto!) {
    addJustification(input: $input) {
      code
      message
    }
  }
`;

export const UPDATE_JUSTIFICATION = gql`
  mutation UpdateJustification($id: Long!, $input: JustificationDto!) {
    updateJustification(id: $id, input: $input) {
      code
      message
    }
  }
`;

export const DELETE_JUSTIFICATION = gql`
  mutation DeleteJustification($id: Long!) {
    deleteJustification(id: $id) {
      code
      message
    }
  }
`;

// export const UPDATE_JUSTIFICATION_STATUS_BY_ID = gql`
//   mutation UpdateJustificationStatusById($id: Long!, $input: JustificationStatusDto!) {
//     updateJustificationStatus(id: $id, input: $input) {
//       code
//       message
//     }
//   }
// `;