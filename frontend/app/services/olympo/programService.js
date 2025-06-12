import { clientLAN } from '@/lib/apollo-client';
import { GET_PROGRAMS } from '@graphql/olympo/programGraph';

const programService = {
    getPrograms: async ({ idCoordination, idTrainingLevel, name, page = 0, size = 10 } = {}) => {
        try {
            const { data } = await clientLAN.query({
                query: GET_PROGRAMS,
                variables: { idCoordination, idTrainingLevel, name, page, size },
                fetchPolicy: 'network-only',
            });

            if (data?.allPrograms?.code === '200' || data?.allPrograms?.code === 200) {
                return data.allPrograms;
            } else {
                throw new Error(data?.allPrograms?.message || 'Error fetching programs');
            }
        } catch (error) {
            console.error('Error fetching programs:', error);
            throw error;
        }
    },
}
export default programService;
