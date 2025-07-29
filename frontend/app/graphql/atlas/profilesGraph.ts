import { gql } from "@apollo/client";

// Querys
export const GET_ALL_PROFILES = gql`
  query GetAllProfiles($page: Int, $size: Int) {
    allProfiles(page: $page, size: $size) {
      data {
        id
        name
        description
        isActive
        isUnique
      }
      totalItems
      totalPages
      currentPage
    }
  }
`;

export const GET_PROFILE_BY_ID = gql`
    query GetProfileById($id: String!) {
        ProfileById(id: $id) {
          data{
            id
            name
            description
            isActive
            isUnique
          }
        }
    }
`;