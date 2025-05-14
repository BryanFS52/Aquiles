import { client } from '@lib/apollo-client';
import { ADD_JUSTIFICATION } from '@graphql/JustificationsGraph';

const justificationService = {
  submitJustification: async (formData) => {
    try {
      const {
        numeroDocumento,
        nombreAprendiz,
        descripcion,
        justificationTypeId,
        justificacionFile,
        notificationId
      } = formData;

      // Función para convertir archivos a Base64
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

      // Fecha actual en ISO (ajústalo si el backend necesita otro formato)
      const justificationDate = new Date().toISOString();

      console.log("Submitting justification:", formData);

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
