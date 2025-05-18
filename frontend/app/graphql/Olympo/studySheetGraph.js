import { gql } from "@apollo/client";
// Olympo
// Queries and Mutations for Study Sheets
export const GET_STUDY_SHEETS = gql`
    query GetStudySheets($name: String, $idJourney: Int, $page: Int, $size: Int) {
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
    query GetStudySheetById($id: ID!) {
        studySheetById(id: $id) {
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
                    extension
                    number}
                }
                trainingProject {
                    id
                    name
                }
                students {
                    id
                    person {
                        personKey {
                        id 
                        document}
                        name
                        lastname
                    }
                }
            }
        }
    }
`;