import axios from 'axios';

const QR_CODE_API_URL = 'http://localhost:8080/api/attendances/generateQRCode';

const qrCodeService = {
  generateQRCode: async (text) => {
    try {
      const response = await axios.get(QR_CODE_API_URL, {
        params: { text },
        responseType: 'arraybuffer', // Importante para manejar la imagen binaria
      });

      // Convertir la respuesta a una imagen en base64
      const qrCodeImage = `data:image/png;base64,${btoa(
        String.fromCharCode(...new Uint8Array(response.data))
      )}`;

      return qrCodeImage;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error; // Lanza el error para que pueda ser manejado en el componente
    }
  },
};

export default qrCodeService;