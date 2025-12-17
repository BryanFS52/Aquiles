import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getTokenFromStorage } from './tokenPersistence';

// Obtener URL del backend desde variables de entorno o usar default
const GRAPHQL_URI = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql";

console.log("🔗 Apollo Client URI:", GRAPHQL_URI);

// Link HTTP para GraphQL
const httpLink = new HttpLink({
    uri: GRAPHQL_URI,
    fetchOptions: {
        mode: 'cors',
    },
});

// Auth Link para agregar el token a cada petición
const authLink = setContext((_, { headers }) => {
    // Obtener token de sessionStorage/cookies
    const token = getTokenFromStorage();
    
    // Log detallado para debug
    if (token) {
        console.log('🔑 [Apollo] Token encontrado y agregado a headers');
        console.log('🔑 [Apollo] Token length:', token.length);
        console.log('🔑 [Apollo] Token preview:', token.substring(0, 50) + '...');
    } else {
        console.warn('⚠️ [Apollo] NO HAY TOKEN DISPONIBLE - La petición se enviará sin autenticación');
        console.warn('⚠️ [Apollo] Verificar sessionStorage y cookies');
    }

    // Retornar headers con token si existe
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        }
    };
});

// Cliente Lan por medio de la direccion IP
const client = new ApolloClient({
    link: from([authLink, httpLink]),
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

export { client };