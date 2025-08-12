// Script de prueba para crear una checklist con observaciones
const fetch = require('node-fetch');

async function testCreateChecklistWithRemarks() {
    try {
        const observaciones = "Estas son mis observaciones personalizadas para la lista de chequeo";
        const indicadores = [
            "Verificar documentación completa",
            "Revisar cumplimiento de objetivos",
            "Evaluar competencias técnicas"
        ];
        
        const indicadoresTexto = indicadores.map((indicador, index) => `${index + 1}. ${indicador}`).join('\n');
        const remarksCompletos = `${observaciones}\n\nIndicadores:\n${indicadoresTexto}`;

        const checklistData = {
            state: false,
            remarks: remarksCompletos,
            trimester: "2",
            instructorSignature: "Test signature",
            evaluationCriteria: false,
            studySheets: null,
            evaluations: null,
            component: "academico",
            associatedJuries: []
        };

        console.log('Datos a enviar:');
        console.log('Remarks:', remarksCompletos);
        console.log('\n---\n');

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
            
            // Ahora vamos a verificar que se guardó correctamente
            await verifyChecklistRemarks(data.data.addChecklist.id);
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

async function verifyChecklistRemarks(checklistId) {
    try {
        console.log('\n--- Verificando checklist creada ---');
        
        const response = await fetch('http://localhost:8080/aquiles/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:4000'
            },
            body: JSON.stringify({
                query: `
                    query GetChecklistById($id: Long!) {
                        checklistById(id: $id) {
                            code
                            message
                            data {
                                id
                                remarks
                                trimester
                                component
                            }
                        }
                    }
                `,
                variables: { id: parseInt(checklistId) }
            })
        });

        const data = await response.json();
        
        if (response.ok && data.data?.checklistById?.data) {
            const checklist = data.data.checklistById.data;
            console.log('✅ Checklist retrieved successfully!');
            console.log('ID:', checklist.id);
            console.log('Trimester:', checklist.trimester);
            console.log('Component:', checklist.component);
            console.log('Remarks guardadas:');
            console.log(checklist.remarks);
        } else {
            console.log('❌ Error retrieving checklist');
            console.log('Response:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error('❌ Error verifying checklist:', error.message);
    }
}

testCreateChecklistWithRemarks();