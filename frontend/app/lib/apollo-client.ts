import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
    link: new HttpLink({
        uri: 'http://localhost:8083/aquiles/graphql',
    }),
    cache: new InMemoryCache(),
    devtools: {
        enabled: true,
    },
});

// Cliente Lan por medio de la direccion IP
const clientLAN = new ApolloClient({
    link: new HttpLink({
        uri: "http://localhost:4000/graphql",
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache',
        },
        query: {
            fetchPolicy: 'no-cache',
        },
    },
    devtools: {
        enabled: true,
    },
});

export { client, clientLAN };