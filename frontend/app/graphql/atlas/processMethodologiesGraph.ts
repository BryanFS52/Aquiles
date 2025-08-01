import { gql } from "@apollo/client";

// Querys
export const GET_ALL_METHODOLOGIES_AND_PROFILES = gql`
 query GetAllProcessMethodologiesAndProfiles($page: Int, $size: Int, $search: String) {
  allProcessMethodology(page: $page, size: $size, search: $search) {
    data {
      id
      name
      description
      isActive
      methodology {
        id
        name
      }
      profiles {
        id
        name
        description
      }
    }
    currentPage
    totalItems
    totalPages
    message
    code
    date
  }
}
`;
