import { gql } from "@apollo/client";

// Queries and Mutations for Attendances

export const GET_ALL_ATTENDANCES = gql`
  query GetAttendances($page: Int, $size: Int) {
    allAttendances(page: $page, size: $size) {
      date
      code
      message
      data {
        id
        attendanceDate
        attendanceState {
          id
          status
        }
        student {
          id
          person {
            name
            lastname
            document
          }
        }
      }
      currentPage
      totalPages
      totalItems
    }
  }
`;

export const GET_ATTENDANCES_BY_STUDENT = gql`
  query allAttendancesByStudentId($id: Long, $stateId: Long) {
    allAttendancesByStudentId(id: $id, stateId: $stateId) {
      data {
        id
        attendanceDate
        student {
          id
          person {
            name
            lastname
            document
          }
        }
        attendanceState {
          id
          status
        }
      }
    }
  }
`;

export const GET_ATTENDANCES_AND_COMPETENCE_BY_STUDENT = gql`
  query GetAttendancesAndCompetenceByStudentId($id: Long) {
    allAttendancesByStudentId(id: $id) {
      data {
        id
        attendanceDate
        attendanceState{
            status
        }
        competenceQuarter{
                id
                competence {
                    name
                }
            }
      }
    }
  }
`;

export const GET_ATTENDANCES_AND_JUSTIFICATIONS_BY_STUDENT = gql`
  query GetAttendancesAndJustificationsByStudent($id: Long!) {
    allAttendancesByStudentId(id: $id) {
      data {
        id
        justification {
          id
          description
          justificationFile
          absenceDate
          justificationType {
            id
            name
          }
        }
      }
    }
  }
`;

export const GET_ATTENDANCES_BY_COMPETENCE_QUARTER_AND_JUSTIFICATIONS = gql`
  query GetAttendancesByCompetenceQuarterAndJustifications($competenceQuarterId: Long!) {
    allAttendanceByCompetenceQuarterIdWithJustifications(competenceQuarterId: $competenceQuarterId) {
      data {
        id
        justification {
          id
          absenceDate
          justificationDate
          justificationFile
          justificationStatus {
            id
            name
          }
        }
        student {
          person {
            name
            lastname
            document
          }
          studentStudySheets {
            studySheet {
              number
            }
          }
        }
      }
    }
  }
`;

export const ADD_ATTENDANCE = gql`
  mutation AddAttendance($input: AttendanceDto!) {
    addAttendance(input: $input) {
      code
      message
      id
    }
  }
`;

export const UPDATE_ATTENDANCE = gql`
  mutation UpdateAttendance($id: Long!, $input: AttendanceDto!) {
    updateAttendance(id: $id, input: $input) {
      code
      message
      id
    }
  }
`;

export const DELETE_ATTENDANCE = gql`
  mutation DeleteAttendance($id: Long!) {
    deleteAttendance(id: $id) {
      code
      message
      id
    }
  }
`;