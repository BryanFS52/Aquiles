import { client } from '../lib/apollo-client';
import { ADD_JUSTIFICATION } from '../graphql/JustificationsGraph';

const justificationService = {
  submitJustification: async (formData) => {
    try {
      const {
        tipoNovedad,
        justificacionFile,
        firmaFile
      } = formData;

      // Convierte los archivos a base64 si existen
      let justificacionFileBase64 = null;
      if (justificacionFile) {
        const reader = new FileReader();
        justificacionFileBase64 = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result.split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(justificacionFile);
        });
      }

      let firmaFileBase64 = null;
      if (firmaFile) {
        const reader = new FileReader();
        firmaFileBase64 = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result.split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(firmaFile);
        });
      }

      // Si la fecha no se proporciona, usa la fecha actual (o ajusta según lo necesario)
      const justificationDate = new Date().toISOString(); // o cualquier formato que el backend espera

      console.log("Submitting justification:", formData);

      const { data } = await client.mutate({
        mutation: ADD_JUSTIFICATION,
        variables: {
          input: {
            description: "",
            justificationFile: justificacionFileBase64,
            justificationDate,
            justificationHistory: "",
            state: true,
            notificationId: "",
            firmaFile: firmaFileBase64
          }
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
};

export default justificationService;