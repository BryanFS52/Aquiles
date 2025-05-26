import { client } from '@lib/apollo-client';
import {
  GET_ALL_JUSTIFICATIONS,
  GET_JUSTIFICATION_BY_ID,
  ADD_JUSTIFICATION,
  UPDATE_JUSTIFICATION,
  DELETE_JUSTIFICATION,
} from '@graphql/justificationsGraph';

const justificationService = {
  getAllJustifications: async (page = 0, size = 10) => {
    try {
      const { data } = await client.query({
        query: GET_ALL_JUSTIFICATIONS,
        variables: { page, size },
        fetchPolicy: 'network-only',
      });
      return data.allJustifications;
    } catch (error) {
      console.error("Error fetching all justifications:", error);
      throw error;
    }
  },

  getJustificationById: async (id) => {
    try {
      const { data } = await client.query({
        query: GET_JUSTIFICATION_BY_ID,
        variables: { id },
        fetchPolicy: 'network-only',
      });
      return data.justificationById;
    } catch (error) {
      console.error("Error fetching justification by id:", error);
      throw error;
    }
  },

  submitJustification: async (formData) => {
    try {
      const {
        numeroDocumento,
        nombreAprendiz,
        descripcion,
        justificationTypeId,
        justificacionFile,
        notificationId,
      } = formData;

      // Convierte archivo a Base64
      const toBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = (error) => reject(error);
        });

      const justificationFileBase64 = justificacionFile
        ? await toBase64(justificacionFile)
        : null;

      const justificationDate = new Date().toISOString();

      const { data } = await client.mutate({
        mutation: ADD_JUSTIFICATION,
        variables: {
          input: {
            documentNumber: numeroDocumento,
            name: nombreAprendiz,
            description: descripcion,
            justificationFile: justificationFileBase64,
            justificationTypeId,
            justificationDate,
            justificationHistory: "tipoNovedad",
            state: true,
            notificationId,
          },
        },
      });

      if (!data?.addJustification?.code) {
        throw new Error("Error adding justification");
      }

      return data.addJustification;
    } catch (error) {
      console.error("Error adding justification:", error);
      throw error;
    }
  },

  updateJustification: async (id, formData) => {
    try {
      const {
        numeroDocumento,
        nombreAprendiz,
        descripcion,
        justificationTypeId,
        justificacionFile,
        notificationId,
      } = formData;

      // Convierte archivo a Base64 solo si hay archivo nuevo
      const toBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = (error) => reject(error);
        });

      const justificationFileBase64 = justificacionFile
        ? await toBase64(justificacionFile)
        : null;

      const justificationDate = new Date().toISOString();

      const { data } = await client.mutate({
        mutation: UPDATE_JUSTIFICATION,
        variables: {
          id,
          input: {
            documentNumber: numeroDocumento,
            name: nombreAprendiz,
            description: descripcion,
            justificationFile: justificationFileBase64,
            justificationTypeId,
            justificationDate,
            justificationHistory: "tipoNovedad",
            state: true,
            notificationId,
          },
        },
      });

      if (!data?.updateJustification?.code) {
        throw new Error("Error updating justification");
      }

      return data.updateJustification;
    } catch (error) {
      console.error("Error updating justification:", error);
      throw error;
    }
  },

  deleteJustification: async (id) => {
    try {
      const { data } = await client.mutate({
        mutation: DELETE_JUSTIFICATION,
        variables: { id },
      });

      if (!data?.deleteJustification?.code) {
        throw new Error("Error deleting justification");
      }

      return data.deleteJustification;
    } catch (error) {
      console.error("Error deleting justification:", error);
      throw error;
    }
  },
};

export default justificationService;
