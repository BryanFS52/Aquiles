import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
    link: new HttpLink({
        uri: 'http://localhost:8080/aquiles/graphql',
    }),
    cache: new InMemoryCache({
        addTypename: false
    }),
});

// Cliente Lan por medio de la direccion IP
const clientLAN = new ApolloClient({
    link: new HttpLink({
        uri: "https://phillips-wu-anna-released.trycloudflare.com/graphql",
    }),
    cache: new InMemoryCache({
        addTypename: false,
    }),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache',
        },
        query: {
            fetchPolicy: 'no-cache',
        },
    },
    connectToDevTools: true,
});

export { client, clientLAN };