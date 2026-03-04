import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    documents: ['app/graphql/**/*.{ts,tsx,js,jsx}'],
    schema: 'http://localhost:8080/graphql', // Asegúrate de que esta URL apunte a tu backend GraphQL
    generates: {
        'app/graphql/generated.ts': {
            plugins: [
                'typescript',
                'typescript-operations',
                'typescript-react-apollo',
            ],
            config: {
                withHooks: true,
                withHOC: false,
                withComponent: false,
                skipTypename: true,
                omitTypename: true,
            },
        },
    },
};

export default config;