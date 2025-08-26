import { gql } from "@apollo/client";

export const GET_NOVELTYTYPE_LIST = gql`
  query getNoveltyTypes($page: Int = 0, $size: Int = 10) {
    allNoveltyTypes(page: $page, size: $size) {
      code
      message
      date
      currentPage
      totalItems
      totalPages
      data {
        id
        nameNovelty
        isActive
        description
        procedureDescription
      }
    }
  }
`;
