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
                    id
                    name
                }
                journey {
                    id
                    name
                }
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
                }
            }
            currentPage
            totalPages
            totalItems
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
                    program{
                        id
                        name
                    }
                }
                students {
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
            }
        }
    }
`;