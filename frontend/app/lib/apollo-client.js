import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
    link: new HttpLink({
        uri: 'http://localhost:8081/graphql',
    }),
    cache: new InMemoryCache(),
});

// New client for Cloudfare tunnel
const clientCloudfare = new ApolloClient({
    link: new HttpLink({
        uri: "https://antonio-expansys-aa-sacred.trycloudflare.com",
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
    connectToDevTools: true,
});

export { client, clientCloudfare };
