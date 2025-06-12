import { gql } from "@apollo/client";

// Query con filtros y paginación
export const GET_PROGRAMS = gql`
  query GetPrograms($idCoordination: Long, $idTrainingLevel: Long, $name: String, $page: Int, $size: Int) {
    allPrograms(idCoordination: $idCoordination, idTrainingLevel: $idTrainingLevel, name: $name, page: $page, size: $size) {
      date
      code
      message
      data {
        id
        name
        description
        state
        coordination {
          id
          name
        }
        trainingLevel {
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
