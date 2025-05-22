import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
    link: new HttpLink({
        uri: 'http://localhost:8081/graphql',
    }),
    cache: new InMemoryCache(),
});

// Cliente Lan por medio de la direccion IP
const clientLAN = new ApolloClient({
    link: new HttpLink({
        uri: "http://10.1.172.62:8091/olympo/graphql",
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


export { client, clientLAN };
