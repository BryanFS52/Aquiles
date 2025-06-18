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
      }
      currentPage
      totalPages
      totalItems
    }
  }
`;

export const ADD_ATTENDANCE = gql`
  mutation AddAttendance($input: AttendancesDto!) {
    addAttendance(input: $input) {
      code
      message
      id
    }
  }
`;


export const UPDATE_ATTENDANCE = gql`
  mutation UpdateAttendance($id: Long!, $input: AttendancesDto!) {
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