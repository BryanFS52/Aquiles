import { gql } from "@apollo/client";

export const GET_All_STUDENTS = gql`
    query GetStudents($name : String, $idStudySheet : Long, $page : Int , $size : Int) {
        allStudents(name : $name, idStudySheet : $idStudySheet, page : $page , size : $size) {
            date
            code
            message
            data {
                id
                state
                person {
                    id
                    document
                    name
                    lastname
                    phone
                    email
                    address
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
                    lastname
                    document
                }
            }
            totalItems
        }
    }
`;