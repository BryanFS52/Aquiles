import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: 'http://localhost:8081/aquiles/graphql',
    documents: ['app/graphql/**/*.{ts,tsx,js,jsx}'],
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
            },
        },
    },
};

export default config;