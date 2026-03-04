'use client'
import React from "react";
import {InstructorChecklistContainer} from "@components/features/listaChequeoInstructor";
import { ApolloProvider } from '@apollo/client';
import { client } from '../../../lib/apollo-client';

const ListaChequeoInstructorPage: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <InstructorChecklistContainer />
    </ApolloProvider>
  );
};

export default ListaChequeoInstructorPage;
