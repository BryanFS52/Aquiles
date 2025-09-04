import { clientLAN } from '@/lib/apollo-client';
import { 
    GET_ALL_TRAINING_PROJECTS, 
    GET_TRAINING_PROJECTS_BY_PROGRAM,
    GET_TRAINING_PROJECT_BY_ID 
} from '@graphql/olympo/trainingProjectGraph';

const trainingProjectService = {
    getAllTrainingProjects: async ({ name, idProgram, page = 0, size = 10 } = {}) => {
        try {
            const { data } = await clientLAN.query({
                query: GET_ALL_TRAINING_PROJECTS,
                variables: { name, idProgram, page, size },
                fetchPolicy: 'network-only',
            });

            if (data?.allTrainingProjects?.code === '200' || data?.allTrainingProjects?.code === 200) {
                return data.allTrainingProjects;
            } else {
                throw new Error(data?.allTrainingProjects?.message || 'Error fetching training projects');
            }
        } catch (error) {
            console.error('Error fetching training projects:', error);
            throw error;
        }
    },

    getTrainingProjectsByProgram: async ({ idProgram, page = 0, size = 10 }) => {
        try {
            const { data } = await clientLAN.query({
                query: GET_TRAINING_PROJECTS_BY_PROGRAM,
                variables: { idProgram, page, size },
                fetchPolicy: 'network-only',
            });

            if (data?.allTrainingProjects?.code === '200' || data?.allTrainingProjects?.code === 200) {
                return data.allTrainingProjects;
            } else {
                throw new Error(data?.allTrainingProjects?.message || 'Error fetching training projects by program');
            }
        } catch (error) {
            console.error('Error fetching training projects by program:', error);
            throw error;
        }
    },

    getTrainingProjectById: async (id) => {
        try {
            const { data } = await clientLAN.query({
                query: GET_TRAINING_PROJECT_BY_ID,
                variables: { id },
                fetchPolicy: 'network-only',
            });

            if (data?.trainingProjectById?.code === '200' || data?.trainingProjectById?.code === 200) {
                return data.trainingProjectById;
            } else {
                throw new Error(data?.trainingProjectById?.message || 'Error fetching training project');
            }
        } catch (error) {
            console.error('Error fetching training project by id:', error);
            throw error;
        }
    },
}

export default trainingProjectService;
