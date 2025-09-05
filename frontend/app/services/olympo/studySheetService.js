import { clientLAN } from '@/lib/apollo-client'
import { 
    GET_STUDY_SHEETS, 
    GET_STUDY_SHEET_BY_ID, 
    GET_STUDY_SHEETS_BY_TRAINING_PROJECT 
} from '@/graphql/olympo/studySheetGraph'

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

            const response = data?.studySheetById;

            if (response?.code === '200' || response?.code === 200) {
                return response.data;
            } else {
                throw new Error(response?.message || 'Error obteniendo la ficha');
            }
        } catch (error) {
            const status = error.networkError?.statusCode || 500;
            const message = `[${status}] Error de red o microservicio inactivo`;
            console.error('Error Apollo:', message, error);
            throw new Error(message);
        }
    },

    getStudySheetsByTrainingProject: async ({ idTrainingProject, page = 0, size = 100 }) => {
        try {
            const { data } = await clientLAN.query({
                query: GET_STUDY_SHEETS_BY_TRAINING_PROJECT,
                variables: { page, size },
                fetchPolicy: 'network-only',
            });

            if (data?.allStudySheets?.code === '200' || data?.allStudySheets?.code === 200) {
                // Filtrar las fichas que pertenecen específicamente a este proyecto formativo
                const filteredSheets = data.allStudySheets.data.filter(sheet => 
                    sheet.trainingProject?.id?.toString() === idTrainingProject.toString()
                );
                
                const filteredData = {
                    ...data.allStudySheets,
                    data: filteredSheets,
                    totalItems: filteredSheets.length,
                    totalPages: Math.ceil(filteredSheets.length / size)
                };
                
                return filteredData;
            } else {
                throw new Error(data?.allStudySheets?.message || 'Error fetching study sheets by training project');
            }
        } catch (error) {
            console.error('Error fetching study sheets by training project:', error);
            throw error;
        }
    }

}

export default studySheetService;