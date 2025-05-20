import { clientCloudfare } from '@lib/apollo-client'
import { GET_STUDENTS, GET_STUDENT_LIST } from '@graphql/Olympo/studentsGraph';

const studentService = {
    getStudents: async ({ name, idStudySheet, page = 0, size = 10 } = {}) => {
        try {
            const { data } = await clientCloudfare.query({
                query: GET_STUDENTS,
                variables: { name, idStudySheet, page, size },
                fetchPolicy: 'network-only',
            });

            if (data?.allStudents?.code === '200' || data?.allStudents?.code === 200) {
                return data.allStudents;
            } else {
                throw new Error(data?.allStudents?.message || 'Error fetching students');
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            throw error;
        }
    },

    getStudentList: async () => {
        try {
            const { data } = await clientCloudfare.query({
                query: GET_STUDENT_LIST,
                fetchPolicy: 'network-only',
            });

            if (data?.allStudentList?.code === '200' || data?.allStudentList?.code === 200) {
                return data.allStudentList;
            } else {
                throw new Error(data?.allStudentList?.message || 'Error fetching student list');
            }
        } catch (error) {
            console.error('Error fetching student list:', error);
            throw error;
        }
    },
};

export default studentService;