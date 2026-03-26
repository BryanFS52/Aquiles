import { ApolloClient, InMemoryCache, HttpLink, from, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getTokenFromStorage } from './tokenPersistence';

const AQUILES_URI = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/aquiles/graphql";
const OLYMPO_URI = process.env.NEXT_PUBLIC_OLYMPO_URL || "http://10.1.180.72:5232/olympo/graphql";
const ATLAS_URI = process.env.NEXT_PUBLIC_ATLAS_URL || "http://localhost:8080/atlas/graphql";
const THEMIS_URI = process.env.NEXT_PUBLIC_THEMIS_URL || "http://localhost:8080/themis/graphql";

const aquilesHttpLink = new HttpLink({ uri: AQUILES_URI });
const olympoHttpLink = new HttpLink({ uri: OLYMPO_URI });
const atlasHttpLink = new HttpLink({ uri: ATLAS_URI });
const themisHttpLink = new HttpLink({ uri: THEMIS_URI });

const authLink = setContext((_, { headers }) => {
    const token = getTokenFromStorage();
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        }
    };
});

// Operaciones de los microservicios

const olympoOperations = [
    'GetCoordinationByCollaborator',
    'GetPrograms',
    'GetStudents',
    'GetStudentList',
    'GetStudySheets',
    'GetStudySheetById',
    'GetAllTrainingProjects'
];

const atlasOperations = [
    'GetAllProcessMethodologiesAndProfiles',
    'GetAllProfiles',
];

const themisOperations = [
    'AddNovelty',
    'getNoveltyTypes',
];

const splitLink = split(
    (operation) => olympoOperations.includes(operation.operationName) || operation.getContext().service === 'olympo',
    olympoHttpLink,
    split(
        (operation) => atlasOperations.includes(operation.operationName) || operation.getContext().service === 'atlas',
        atlasHttpLink,
        split(
            (operation) => themisOperations.includes(operation.operationName) || operation.getContext().service === 'themis',
            themisHttpLink,
            aquilesHttpLink // Por defecto, todo lo demás va para Aquiles
        )
    )
);

const client = new ApolloClient({
    link: from([authLink, splitLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: { fetchPolicy: 'no-cache' },
        query: { fetchPolicy: 'no-cache' },
    },
    devtools: {enabled: true}
});

export { client };