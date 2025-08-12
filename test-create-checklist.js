// Script de prueba para crear una checklist
const fetch = require('node-fetch');

async function testCreateChecklist() {
    try {
        const checklistData = {
            state: false,
            remarks: "Test checklist",
            trimester: "1",
            instructorSignature: "Test signature",
            evaluationCriteria: false,
            studySheets: null,
            evaluations: null,
            component: "academico",
            associatedJuries: []
        };

        const response = await fetch('http://localhost:8080/aquiles/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:4000'
            },
            body: JSON.stringify({
                query: `
                    mutation AddChecklist($input: ChecklistDto!) {
                        addChecklist(input: $input) {
                            code
                            message
                            id
                        }
                    }
                `,
                variables: { input: checklistData }
            })
        });

        const data = await response.json();
        console.log('Response status:', response.status);
        console.log('Response data:', JSON.stringify(data, null, 2));
        
        if (response.ok && data.data?.addChecklist?.code === "200") {
            console.log('✅ Checklist created successfully!');
            console.log('New checklist ID:', data.data.addChecklist.id);
        } else {
            console.log('❌ Error creating checklist');
            if (data.errors) {
                console.log('GraphQL errors:', data.errors);
            }
        }
    } catch (error) {
        console.error('❌ Error connecting to GraphQL:', error.message);
    }
}

testCreateChecklist();