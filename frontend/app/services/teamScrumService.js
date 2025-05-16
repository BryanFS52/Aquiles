import { client } from '@lib/apollo-client';
import { LIST_TEAMS_SCRUM, CREATE_TEAM_SCRUM, DELETE_TEAM_SCRUM } from '@graphql/TeamsScrumGraph';

const teamScrumService = {
  listTeamsScrum: async () => {
    try {
      const { data } = await client.query({
        query: LIST_TEAMS_SCRUM,
        fetchPolicy: 'network-only',
      });

      if (!data?.listTeamScrum) {
        throw new Error("No se pudo obtener la lista de equipos Scrum.");
      }

      return data.listTeamScrum;
    } catch (error) {
      console.error("Error al obtener equipos Scrum:", error);
      throw error;
    }
  },

  createTeamScrum: async (input) => {
    try {
      const { data } = await client.mutate({
        mutation: CREATE_TEAM_SCRUM,
        variables: { input },
      });

      if (!data?.createTeamScrum?.code) {
        throw new Error("Error al crear el equipo Scrum.");
      }

      return data.createTeamScrum;
    } catch (error) {
      console.error("Error al crear equipo Scrum:", error);
      throw error;
    }
  },

  deleteTeamScrum: async (teamScrumId) => {
    try {
      const { data } = await client.mutate({
        mutation: DELETE_TEAM_SCRUM,
        variables: { teamScrumId },
      });

      if (!data?.deleteTeamScrum?.code) {
        throw new Error("Error al eliminar el equipo Scrum.");
      }

      return data.deleteTeamScrum;
    } catch (error) {
      console.error("Error al eliminar equipo Scrum:", error);
      throw error;
    }
  },
};

export default teamScrumService;
