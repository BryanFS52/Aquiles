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
        processMethodology{
          id
          name
        }
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
        teacherStudySheets{
                id
                competence {
                    name
                }
            }
      }
    }
  }
`;


export const GET_STUDY_SHEET_BY_TEACHER = gql`
  query studySheetByTeacher($idTeacher: Long, $page: Int, $size: Int) {
    allStudySheets(page: $page, size: $size, idTeacher: $idTeacher) {
      date
      code
      message
      data {
        id
        number
        startLective
        endLective
        state
        journey{
          name
        }
        trainingProject {
          name
          program {
            name
          }
        }
        studentStudySheets {
          student {
            id
            person {
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

export const GET_STUDY_SHEET_BY_TEACHER_ID_WITH_TEAM_SCRUM = gql`
query studySheetByTeacherIdWithTeamScrum($idTeacher: Long, $page: Int, $size: Int) {
    allStudySheets(page: $page, size: $size, idTeacher: $idTeacher) {
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
        quarter{
            id
            name{
                extension
                number
            }
        }
        trainingProject {
          name
          program {
            name
          }
        }
        teamsScrum{
            id
            teamName
            students{
                id
                person{
                    lastname
                    name
                    document
                }
            }
        }
      }
      currentPage
      totalPages
      totalItems
    }
  }
`;

export const GET_STUDY_SHEET_BY_ID_WITH_ATTENDANCES = gql`
query GetStudySheetByIdWithAttendances($id: Long!, $competenceId : Long) {
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
        attendances(competenceQuarterId :$competenceId ) {
            attendanceDate
            attendanceState{
                status
            }
        }
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
      teacherStudySheets {
        id
        competence {
          name
        }
      }
    }
  }
}
`;
