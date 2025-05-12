import { gql } from "@apollo/client";

export const GENERATE_QR_CODE = gql`
  mutation GenerateQRCode {
    generateQRCode {
      sessionId
      qrCodeBase64
      qrUrl
    }
  }
`;
