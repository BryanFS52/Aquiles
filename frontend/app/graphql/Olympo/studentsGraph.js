const { gql } = require("@apollo/client");

export const GET_STUDENTS = gql`
    query GetStudents($name : String, $idStudySheet : ID, $page : Int , $size : Int) {
        allStudents(name : $name, idStudySheet : $idStudySheet, page : $page , size : $size) {
            date
            code
            message
            data {
                id
                state
                person {
                    personKey{
                    id
                    document}
                    name
                    lastname
                    phone
                    email
                    address
                }
                studySheets {
                    id
                    number
                    state
                }
            }
            currentPage
            totalPages
            totalItems
        }
    }
`;

export const GET_STUDENT_LIST = gql`
    query GetStudentList {
        allStudentList {
            code
            message
            data {
                id
                state
                person {
                    id
                    name
                    lastName
                    documentType
                    documentNumber
                    phone
                    email
                    address
                }
                studySheet {
                    id
                    name
                    state
                }
            }
            totalItems
        }
    }
`;