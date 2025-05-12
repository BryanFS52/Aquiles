import { gql } from "@apollo/client";

export const GET_EXCUSES = gql`
  query GetExcuses($page: Int, $size: Int) {
    allExcuses(page: $page, size: $size) {
      date
      code
      message
      data {
        excuseId
        excuseDescription
        excuseDocument
      }
      currentPage
      totalPages
      totalItems
    }
  }
`;

export const GET_EXCUSE_BY_ID = gql`
  query GetExcuseById($id: ID!) {
    excuseById(id: $id) {
      date
      code
      message
      data {
        excuseId
        excuseDescription
        excuseDocument
      }
    }
  }
`;

export const ADD_EXCUSE = gql`
  mutation AddExcuse($input: ExcuseInput!) {
    addExcuse(input: $input) {
      code
      message
      id
      data {
        excuseId
        excuseDescription
        excuseDocument
      }
    }
  }
`;

export const UPDATE_EXCUSE = gql`
  mutation UpdateExcuse($id: ID!, $input: ExcuseInput!) {
    updateExcuse(id: $id, input: $input) {
      code
      message
      id
      data {
        excuseId
        excuseDescription
        excuseDocument
      }
    }
  }
`;

export const DELETE_EXCUSE = gql`
  mutation DeleteExcuse($id: ID!) {
    deleteExcuse(id: $id) {
      code
      message
      id
      data {
        excuseId
        excuseDescription
        excuseDocument
      }
    }
  }
`;