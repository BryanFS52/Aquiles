import { gql } from "@apollo/client";

// Querys
export const GET_ALL_METHODOLOGIES = gql`
  query GetAllMethodologies($page: Int, $size: Int) {
    allMethodologies(page: $page, size: $size) {
      data {
        id
        name
      }
      totalItems
      totalPages
      currentPage
    }
  }
`;
