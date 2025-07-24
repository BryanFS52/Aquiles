import { gql } from "@apollo/client";

// Queries and Mutations for Study Sheets
export const GET_STUDY_SHEETS = gql`
    query GetStudySheets($name: String, $idJourney: Long, $page: Int, $size: Int) {
        allStudySheets(name: $name, idJourney: $idJourney, page: $page, size: $size) {
            date
            code
            message
            data {
                id
                number
                numberStudents
                startLective
                endLective
                state
                offer {
                    name
                }
                journey {
                    name
                }
                quarter {
                    name {
                      extension
                    number
                    }
                }
                trainingProject {
                    name
                    program {
                        id
                        name
                    }
                }
            }
            currentPage
            totalPages
            totalItems
        }
    }
`;

export const GET_STUDY_SHEET_WITH_TEAM_SCRUM_BY_ID = gql`
    query GetStudySheetWithTeamScrumById($id: Long) {
    studySheetById(id: $id) {
    data {
      id
      number
      teamsScrum {
        id
        teamName
        projectName
        students {
          id
          person {
            name
            lastname
            document
            email
          }
          profiles{
            name
            description
            isActive
            isUnique
          }
        }
      }
    }
  }
}
`;

export const GET_STUDY_SHEET_BY_ID = gql`
  query GetStudySheetById($id: Long!) {
    studySheetById(id: $id) {
      code
      message
      data {
        id
        number
        numberStudents
        quarter {
          id
          name {
            number
            extension
          }
        }
        trainingProject {
          id
          name
          program {
            id
            name
          }
        }
        studentStudySheets {
          id
          student {
            id
            person {
              id
              document
              name
              lastname
              email
              phone
            }
          }
          studentStudySheetState {

            id
            name
          }
        }
      }
    }
  }
`;


export const GET_STUDY_SHEET_BY_TEACHER = gql`
  query studySheetByTeacher($IdTeacher: Long, $page: Int, $size: Int) {
    allStudySheets(page: $page, size: $size, idTeacher: $IdTeacher) {
      date
      code
      message
      data {
        id
        number
        startLective
        endLective
        state
        journey {
          name
        }
        trainingProject {
          name
          program {
            id
            name
          }
        }
        studentStudySheets {
          student {
            person {
              id
              document
              name
              lastname
              phone
              email
              blood_type
              date_birth
            }
          }
          studentStudySheetState {
            id
            name
          }
        }
      }
      currentPage
      totalPages
      totalItems
    }
  }
`;

export const GET_STUDY_SHEET_WITH_STUDENTS = gql`
  query GetStudySheetWithStudents($id: Long!) {
    studySheetById(id: $id) {
      code
      message
      data {
        id
        number
        journey{
            name
        }
        trainingProject{
            program{
                name
            }
        }
        studentStudySheets {
          id
          student {
            id
            person {
              name
              lastname
              email
            }
          }
          studentStudySheetState {
            id
            name
          }
        }
      }
    }
  }
`;

