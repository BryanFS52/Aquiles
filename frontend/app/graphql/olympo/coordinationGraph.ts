import { gql } from "@apollo/client";

export const GET_COORDINATION_BY_COLABORATOR_ID = gql`
query GetCoordinationByCollaborator($collaboratorId: Long!,$page: Int,$size: Int,$state: Boolean) {
  allCoordinations(
    collaboratorId: $collaboratorId,
    page: $page,
    size: $size,
    state: $state
  ) {
    data {
      id
      name
      state
      teachers{
        id
        state
        totalHours
        classTypes {
          id
          name
          state
        }
        collaborator{
            person{
                name
                lastname
                document
            }
        }
      }
      trainingCenter {
        id
        name
      }
    }
    totalItems
    totalPages
    currentPage
  }
}
`;