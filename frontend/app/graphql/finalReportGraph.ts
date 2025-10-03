import { gql } from "@apollo/client";

export const GET_ALL_FINAL_REPORTS = gql`
query GetAllFinalReports($page: Int, $size: Int) {
  allFinalReports(page: $page, size: $size) {
    code
    message
    date
    totalPages
    totalItems
    currentPage
    data {
      id
      fileNumber
      objectives
      disciplinaryOffenses
      conclusions
      annexes
      signature
      state
      competenceQuarter{
        teacher{
            coordinations{
                name
            }
            collaborator{
                person{
                    name
                    lastname
                    email
                }
            }
        }
        studySheet{
            number
            numberStudents
            journey{
                name
            }
        }
        competence{
            name
            learningOutcome{
                name
            }
        }
      }
    }
  }
}
`;

export const GET_FINAL_REPORT_BY_ID = gql`
query GetFinalReportById($id: Long!) {
  finalReportById(id: $id) {
    code
    message
    date
    data {
      id
      fileNumber
      objectives
      disciplinaryOffenses
      conclusions
      annexes
      signature
      state
      competenceQuarter {
        id
        competence{
            name
            learningOutcome{
                name
            } 
        }
      }
    }
  }
}
`;

export const ADD_FINAL_REPORT = gql`
mutation AddFinalReport($input: FinalReportDto) {
  addFinalReport(input: $input) {
    code
    message
    date
  }
}
`;

export const UPDATE_FINAL_REPORT = gql`
mutation UpdateFinalReport($id: Long!, $input: FinalReportDto) {
  updateFinalReport(id: $id, input: $input) {
    code
    message
    date
  }
}
`;

export const DELETE_FINAL_REPORT = gql`
mutation DeleteFinalReport($id: Long!) {
  deleteFinalReport(id: $id) {
    code
    message
    date
  }
}
`;