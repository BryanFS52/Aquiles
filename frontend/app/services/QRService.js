import axios from 'axios';

const QR_CODE_API_URL = 'http://localhost:8080/api/attendances/generateQRCode';

const qrCodeService = {
  generateQRCode: async (text) => {
    try {
      const response = await axios.get(QR_CODE_API_URL, {
        params: { text },
        responseType: 'arraybuffer',
      });

      const qrCodeImage = `data:image/png;base64,${btoa(
        String.fromCharCode(...new Uint8Array(response.data))
      )}`;

      return qrCodeImage;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error; 
    }
  },
};

export default qrCodeService;
