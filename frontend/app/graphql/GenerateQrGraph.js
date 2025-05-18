import { gql } from "@apollo/client";

// Mutation for Generating QR Code
export const GENERATE_QR_CODE = gql`
  mutation GenerateQRCode {
    generateQRCode {
      sessionId
      qrCodeBase64
      qrUrl
    }
  }
`;
