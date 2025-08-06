import { gql } from "@apollo/client";

// Querys
export const GET_ALL_METHODOLOGIES_AND_PROFILES = gql`
 query GetAllProcessMethodologiesAndProfiles($page: Int, $size: Int, $search: String) {
  allProcessMethodology(page: $page, size: $size, search: $search) {
    data {
      id
      name
      description
      methodology {
        id
        name
      }
      profiles {
        id
        name
        description
        isActive
        isUnique
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
