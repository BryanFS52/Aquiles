// Script de prueba para crear checklist con items y probar activar/desactivar
const fetch = require('node-fetch');

async function testChecklistWithItems() {
    try {
        console.log('🚀 Iniciando prueba de checklist con items...\n');

        // 1. Crear checklist con items
        const checklistData = {
            state: false,
            remarks: "Checklist de prueba con indicadores",
            trimester: "3",
            instructorSignature: "Test signature",
            evaluationCriteria: false,
            studySheets: null,
            evaluations: null,
            component: "academico",
            associatedJuries: [],
            items: [
                {
                    code: "IND-1",
                    indicator: "Verificar documentación completa del proyecto",
                    active: true
                },
                {
                    code: "IND-2", 
                    indicator: "Evaluar cumplimiento de objetivos específicos",
                    active: true
                },
                {
                    code: "IND-3",
                    indicator: "Revisar competencias técnicas desarrolladas",
                    active: true
                }
            ]
        };

        console.log('📝 Creando checklist con items...');
        const createResponse = await fetch('http://localhost:8080/aquiles/graphql', {
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

        const createData = await createResponse.json();
        
        if (!createResponse.ok || createData.data?.addChecklist?.code !== "200") {
            console.log('❌ Error creating checklist');
            console.log('Response:', JSON.stringify(createData, null, 2));
            return;
        }

        const checklistId = createData.data.addChecklist.id;
        console.log('✅ Checklist creada exitosamente! ID:', checklistId);

        // 2. Obtener checklist con items
        console.log('\n📋 Obteniendo checklist con items...');
        const getResponse = await fetch('http://localhost:8080/aquiles/graphql', {
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
                                items {
                                    id
                                    code
                                    indicator
                                    active
                                }
                            }
                        }
                    }
                `,
                variables: { id: parseInt(checklistId) }
            })
        });

        const getData = await getResponse.json();
        
        if (!getResponse.ok || getData.data?.checklistById?.code !== "200") {
            console.log('❌ Error getting checklist');
            console.log('Response:', JSON.stringify(getData, null, 2));
            return;
        }

        const checklist = getData.data.checklistById.data;
        console.log('✅ Checklist obtenida exitosamente!');
        console.log('Remarks:', checklist.remarks);
        console.log('Items:');
        checklist.items.forEach((item, index) => {
            console.log(`  ${index + 1}. [${item.code}] ${item.indicator} - ${item.active ? 'ACTIVO' : 'INACTIVO'}`);
        });

        // 3. Probar desactivar un item
        if (checklist.items && checklist.items.length > 0) {
            const firstItem = checklist.items[0];
            console.log(`\n🔄 Desactivando item: ${firstItem.code}...`);
            
            const updateResponse = await fetch('http://localhost:8080/aquiles/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': 'http://localhost:4000'
                },
                body: JSON.stringify({
                    query: `
                        mutation UpdateItemStatus($itemId: Long!, $active: Boolean!) {
                            updateItemStatus(itemId: $itemId, active: $active) {
                                code
                                message
                                id
                            }
                        }
                    `,
                    variables: { 
                        itemId: parseInt(firstItem.id), 
                        active: false 
                    }
                })
            });

            const updateData = await updateResponse.json();
            
            if (updateResponse.ok && updateData.data?.updateItemStatus?.code === "200") {
                console.log('✅ Item desactivado exitosamente!');
                
                // Verificar el cambio
                console.log('\n🔍 Verificando cambio...');
                await verifyItemStatus(checklistId, firstItem.id);
            } else {
                console.log('❌ Error updating item status');
                console.log('Response:', JSON.stringify(updateData, null, 2));
            }
        }

    } catch (error) {
        console.error('❌ Error en la prueba:', error.message);
    }
}

async function verifyItemStatus(checklistId, itemId) {
    try {
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
                            data {
                                items {
                                    id
                                    code
                                    indicator
                                    active
                                }
                            }
                        }
                    }
                `,
                variables: { id: parseInt(checklistId) }
            })
        });

        const data = await response.json();
        const items = data.data?.checklistById?.data?.items || [];
        const updatedItem = items.find(item => item.id === itemId);
        
        if (updatedItem) {
            console.log(`✅ Estado verificado: [${updatedItem.code}] - ${updatedItem.active ? 'ACTIVO' : 'INACTIVO'}`);
        } else {
            console.log('❌ No se pudo verificar el estado del item');
        }
    } catch (error) {
        console.error('❌ Error verificando estado:', error.message);
    }
}

// Esperar un poco para que el backend esté listo
setTimeout(() => {
    testChecklistWithItems();
}, 5000);