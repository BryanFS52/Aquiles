import { gql } from "@apollo/client";

// Mutation for sending email notification
export const SEND_EMAIL_NOTIFICATION = gql`
  mutation SendNotification($emailRequest: EmailRequest!) {
    sendNotification(emailRequest: $emailRequest)
  }
`;
