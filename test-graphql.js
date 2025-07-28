// Script de prueba para verificar la conectividad GraphQL
const fetch = require('node-fetch');

async function testGraphQL() {
    try {
        const response = await fetch('http://localhost:8080/aquiles/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:4000'
            },
            body: JSON.stringify({
                query: `
                    query GetAllChecklists($page: Int, $size: Int) {
                        allChecklists(page: $page, size: $size) {
                            date
                            code
                            message
                            currentPage
                            totalPages
                            totalItems
                            data {
                                id
                                state
                                remarks
                            }
                        }
                    }
                `,
                variables: { page: 0, size: 10 }
            })
        });

        const data = await response.json();
        console.log('Response status:', response.status);
        console.log('Response data:', JSON.stringify(data, null, 2));
        
        if (response.ok) {
            console.log('✅ GraphQL endpoint is working correctly!');
        } else {
            console.log('❌ GraphQL endpoint returned an error');
        }
    } catch (error) {
        console.error('❌ Error connecting to GraphQL:', error.message);
    }
}

testGraphQL();