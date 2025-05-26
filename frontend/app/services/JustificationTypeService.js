import { client } from '@lib/apollo-client';
import JustificationGraphQL from '@graphql/justificationTypeGraph';

const justificationTypeService = {
    // Obtener todos los tipos con paginación
    getAll: async (page = 1, size = 10) => {
        try {
            const { data } = await client.query({
                query: JustificationGraphQL.GET_ALL_JUSTIFICATION_TYPES,
                variables: { page, size },
                fetchPolicy: 'network-only',
            });
            return data.allJustificationTypes;
        } catch (error) {
            console.error('Error fetching justification types:', error);
            throw error;
        }
    },

    // Obtener un tipo específico por ID
    getById: async (id) => {
        try {
            const { data } = await client.query({
                query: JustificationGraphQL.GET_JUSTIFICATION_TYPE_BY_ID,
                variables: { id },
                fetchPolicy: 'network-only',
            });
            return data.justificationTypeById;
        } catch (error) {
            console.error('Error fetching justification type by ID:', error);
            throw error;
        }
    },

    // Crear un nuevo tipo de justificación
    create: async (input) => {
        try {
            const { data } = await client.mutate({
                mutation: JustificationGraphQL.ADD_JUSTIFICATION_TYPE,
                variables: { input },
            });
            return data.addJustificationType;
        } catch (error) {
            console.error('Error creating justification type:', error);
            throw error;
        }
    },

    // Actualizar un tipo existente
    update: async (id, input) => {
        try {
            const { data } = await client.mutate({
                mutation: JustificationGraphQL.UPDATE_JUSTIFICATION_TYPE,
                variables: { id, input },
            });
            return data.updateJustificationType;
        } catch (error) {
            console.error('Error updating justification type:', error);
            throw error;
        }
    },

    // Eliminar un tipo de justificación
    remove: async (id) => {
        try {
            const { data } = await client.mutate({
                mutation: JustificationGraphQL.DELETE_JUSTIFICATION_TYPE,
                variables: { id },
            });
            return data.deleteJustificationType;
        } catch (error) {
            console.error('Error deleting justification type:', error);
            throw error;
        }
    },
};

export default justificationTypeService;