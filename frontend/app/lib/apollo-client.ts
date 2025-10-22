import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Cliente Lan por medio de la direccion IP
const clientLAN = new ApolloClient({
    link: new HttpLink({
        uri: "https://space-judy-gates-only.trycloudflare.com/graphql",
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

export { clientLAN };