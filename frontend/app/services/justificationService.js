// src/services/justificationService.js
import { client } from '../lib/apollo-client';
import { ADD_JUSTIFICATION } from '../graphql/JustificationsGraph';

const justificationService = {
  submitJustification: async (formData) => {
    try {
      const { numeroDocumento, nombreAprendiz, tipoNovedad, justificacionFile, firmaFile } = formData;
      console.log("Submitting justification:", formData);
      const { data } = await client.mutate({
        mutation: ADD_JUSTIFICATION,
        variables: {
          numeroDocumento,
          nombreAprendiz,
          tipoNovedad,
          justificacionFile,
          firmaFile,
        },
      });

      if (!data?.addJustification?.code) {
        throw new Error("Error adding justification");
      }

      return data.addJustification; // Devuelve la respuesta de la mutación
    } catch (error) {
      console.error("Error adding justification:", error);
      throw error;
    }
  },
};

export default justificationService;
