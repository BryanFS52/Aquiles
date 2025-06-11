import { gql } from "@apollo/client";

// Queries and Mutations for Attendances
export const GET_ALL_ATTENDANCES = gql`
  query GetAttendances($page: Int, $size: Int) {
    allAttendances(page: $page, size: $size) {
      date
      code
      message
      data {
        attendanceId
        attendanceDate
        stateAttendance {
          id
          name
        }
      }
      currentPage
      totalPages
      totalItems
    }
  }
`;

export const GET_ATTENDANCE_BY_ID = gql`
  query GetAttendanceById($id: Long!) {
    attendanceById(id: $id) {
      date
      code
      message
      data {
        attendanceId
        attendanceDate
        stateAttendance {
          id
          name
        }
      }
    }
  }
`;

export const ADD_ATTENDANCE = gql`
  mutation AddAttendance($input: AttendancesDto!) {
    addAttendance(input: $input) {
      code
      message
      id
      data {
        attendanceId
        attendanceDate
        stateAttendance {
          id
          name
        }
      }
    }
  }
`;

export const UPDATE_ATTENDANCE = gql`
  mutation UpdateAttendance($id: Long!, $input: AttendancesDto!) {
    updateAttendance(id: $id, input: $input) {
      code
      message
      id
      data {
        attendanceId
        attendanceDate
        stateAttendance {
          id
          name
        }
      }
    }
  }
`;

export const DELETE_ATTENDANCE = gql`
  mutation DeleteAttendance($id: Long!) {
    deleteAttendance(id: $id) {
      code
      message
      id
      data {
        attendanceId
        attendanceDate
        stateAttendance {
          id
          name
        }
      }
    }
  }
`;
