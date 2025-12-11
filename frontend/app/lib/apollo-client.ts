import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Obtener URL del backend desde variables de entorno o usar default
const GRAPHQL_URI = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql";

console.log("🔗 Apollo Client URI:", GRAPHQL_URI);

// Cliente Lan por medio de la direccion IP
const clientLAN = new ApolloClient({
    link: new HttpLink({
        uri: GRAPHQL_URI,
        fetchOptions: {
            mode: 'cors',
        },
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