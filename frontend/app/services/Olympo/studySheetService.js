import { clientLAN } from '@lib/apollo-client'
import { GET_STUDY_SHEETS, GET_STUDY_SHEET_BY_ID } from '@graphql/Olympo/studySheetGraph'

const studySheetService = {
    getStudySheets: async ({ name, idJourney, page = 0, size = 10 } = {}) => {
        try {
            const { data } = await clientLAN.query({
                query: GET_STUDY_SHEETS,
                variables: { name, idJourney, page, size },
                fetchPolicy: 'network-only',
            });

            if (data?.allStudySheets?.code === '200' || data?.allStudySheets?.code === 200) {
                return data.allStudySheets;
            } else {
                throw new Error(data?.allStudySheets?.message || 'Error fetching study sheets');
            }
        } catch (error) {
            console.error('Error fetching study sheets:', error);
            throw error;
        }
    },

    getStudySheetById: async (id) => {
        try {
            const { data } = await clientLAN.query({
                query: GET_STUDY_SHEET_BY_ID,
                variables: { id },
                fetchPolicy: 'network-only',
            });

            if (data?.studySheetById?.code === '200' || data?.studySheetById?.code === 200) {
                console.log("ficha encontrada", data.studySheetById);
                return data.studySheetById;
            } else {
                throw new Error(data?.studySheetById?.message || 'Error fetching study sheet by ID');
            }
        } catch (error) {
            console.error('Error fetching study sheet by ID:', error);
            throw error;
        }
    },
}

export default studySheetService;
