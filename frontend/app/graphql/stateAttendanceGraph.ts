import { gql } from "@apollo/client";

// Queries and Mutations for Attendance State
export const GET_ALL_STATE_ATTENDANCES = gql`
  query GetStateAttendance($page: Int, $size: Int) {
    allStateAttendances(page: $page, size: $size) {
      code
      date
      message
      totalPages
      totalItems
      currentPage
      data {
        id
        status
      }
    }
  }
`;

export const ADD_STATE_ATTENDANCE = gql`
  mutation AddStateAttendance($input: AttendanceStateDto!) {
    addStateAttendance(input: $input) {
      code
      message
      id
    }
  }
`;

export const UPDATE_STATE_ATTENDANCE = gql`
  mutation UpdateStateAttendance($id: Long!, $input: AttendanceStateDto!) {
    updateStateAttendance(id: $id, input: $input) {
      code
      message
      id
    }
  }
`;

export const DELETE_STATE_ATTENDANCE = gql`
  mutation DeleteStateAttendance($id: Long!) {
    deleteStateAttendance(id: $id) {
      code
      message
      id
    }
  }
`;