import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    documents: ['app/graphql/**/*.{ts,tsx,js,jsx}'],
    schema: 'http://10.1.172.62:4000/graphql',
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
