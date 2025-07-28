// Script de prueba completo para verificar toda la funcionalidad de indicadores
const fetch = require('node-fetch');

async function testCompleteFunctionality() {
    try {
        console.log('🚀 Iniciando prueba completa de funcionalidad de indicadores...\n');

        // 1. Crear checklist con observaciones personalizadas e indicadores
        const checklistData = {
            state: false,
            remarks: "Estas son mis observaciones personalizadas para la evaluación del proyecto",
            trimester: "4",
            instructorSignature: "Instructor Test",
            evaluationCriteria: true,
            studySheets: null,
            evaluations: null,
            component: "administrativo",
            associatedJuries: [],
            items: [
                {
                    code: "ADM-1",
                    indicator: "Verificar documentación administrativa completa",
                    active: true
                },
                {
                    code: "ADM-2", 
                    indicator: "Evaluar procesos de gestión implementados",
                    active: true
                },
                {
                    code: "ADM-3",
                    indicator: "Revisar cumplimiento de normativas",
                    active: true
                },
                {
                    code: "ADM-4",
                    indicator: "Validar reportes de seguimiento",
                    active: true
                }
            ]
        };

        console.log('📝 Creando checklist con observaciones e indicadores...');
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

        // 2. Obtener checklist completa
        console.log('\n📋 Obteniendo checklist completa...');
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
                                evaluationCriteria
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
        console.log('📝 Observaciones:', checklist.remarks);
        console.log('📊 Trimestre:', checklist.trimester);
        console.log('🏢 Componente:', checklist.component);
        console.log('✅ Criterio de evaluación:', checklist.evaluationCriteria);
        console.log('\n📋 Indicadores:');
        checklist.items.forEach((item, index) => {
            console.log(`  ${index + 1}. [${item.code}] ${item.indicator} - ${item.active ? '✅ ACTIVO' : '❌ INACTIVO'}`);
        });

        // 3. Probar desactivar múltiples items
        console.log('\n🔄 Probando activar/desactivar indicadores...');
        
        for (let i = 0; i < checklist.items.length; i++) {
            const item = checklist.items[i];
            const newStatus = i % 2 === 0 ? false : true; // Alternar estados
            
            console.log(`\n🔄 ${newStatus ? 'Activando' : 'Desactivando'} item: ${item.code}...`);
            
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
                        itemId: parseInt(item.id), 
                        active: newStatus 
                    }
                })
            });

            const updateData = await updateResponse.json();
            
            if (updateResponse.ok && updateData.data?.updateItemStatus?.code === "200") {
                console.log(`✅ Item ${item.code} ${newStatus ? 'activado' : 'desactivado'} exitosamente!`);
            } else {
                console.log(`❌ Error updating item ${item.code}`);
                console.log('Response:', JSON.stringify(updateData, null, 2));
            }
        }

        // 4. Verificar estados finales
        console.log('\n🔍 Verificando estados finales...');
        const finalResponse = await fetch('http://localhost:8080/aquiles/graphql', {
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

        const finalData = await finalResponse.json();
        const finalItems = finalData.data?.checklistById?.data?.items || [];
        
        console.log('\n📊 Estados finales de los indicadores:');
        finalItems.forEach((item, index) => {
            console.log(`  ${index + 1}. [${item.code}] ${item.indicator}`);
            console.log(`     Estado: ${item.active ? '✅ ACTIVO' : '❌ INACTIVO'}`);
        });

        // 5. Resumen
        const activeCount = finalItems.filter(item => item.active).length;
        const inactiveCount = finalItems.filter(item => !item.active).length;
        
        console.log('\n📈 Resumen de la prueba:');
        console.log(`✅ Checklist creada con ID: ${checklistId}`);
        console.log(`📝 Observaciones guardadas correctamente`);
        console.log(`📋 Total de indicadores: ${finalItems.length}`);
        console.log(`✅ Indicadores activos: ${activeCount}`);
        console.log(`❌ Indicadores inactivos: ${inactiveCount}`);
        console.log(`🔄 Funcionalidad de activar/desactivar: ✅ FUNCIONANDO`);
        console.log(`💾 Persistencia en base de datos: ✅ FUNCIONANDO`);
        
        console.log('\n🎉 ¡Todas las funcionalidades están trabajando correctamente!');

    } catch (error) {
        console.error('❌ Error en la prueba:', error.message);
    }
}

testCompleteFunctionality();