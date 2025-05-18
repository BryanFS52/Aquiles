import { gql } from "@apollo/client";

// Queries and Mutations for Attendances
export const GET_ATTENDANCES = gql`
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
  query GetAttendanceById($id: ID!) {
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
  mutation AddAttendance($input: AttendanceInput!) {
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
  mutation UpdateAttendance($id: ID!, $input: AttendanceInput!) {
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
  mutation DeleteAttendance($id: ID!) {
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
