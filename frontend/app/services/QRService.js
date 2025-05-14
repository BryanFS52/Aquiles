// qrCodeService.js
import { client } from '@lib/apollo-client';
import { GENERATE_QR_CODE } from '@graphql/GenerateQrGraph';

const qrCodeService = {
  generateQRCode: async () => {
    try {
      const { data } = await client.mutate({
        mutation: GENERATE_QR_CODE,
      });

      if (!data?.generateQRCode?.qrCodeBase64) {
        throw new Error("No QR code returned from server");
      }

      const qrCodeImage = `data:image/png;base64,${data.generateQRCode.qrCodeBase64}`;

      return {
        qrCodeImage,
        sessionId: data.generateQRCode.sessionId,
        qrUrl: data.generateQRCode.qrUrl,
      };
    } catch (error) {
      console.error("Error generating QR code:", error);
      throw error;
    }
  },
};

export default qrCodeService;
