import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation loginUser($input: LoginInput ) {
    login(input: $input) {
      token
      user {
        id
        documento
        tipoDocumento
      }
    }
  }
`;