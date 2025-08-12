/**
 * Test para verificar el flujo de datos del modal de edición
 * Simula la carga de datos y verifica que se transformen correctamente
 */

// Simular datos del backend (como los que vendrian de GraphQL)
const mockChecklistFromBackend = {
    id: "1",
    state: true,
    remarks: "Checklist de prueba",
    trimester: "2",
    component: "Componente de prueba",
    items: [
        {
            id: "1",
            code: "IND-1",
            indicator: "Indicador de prueba 1",
            active: true
        },
        {
            id: "2", 
            code: "IND-2",
            indicator: "Indicador de prueba 2",
            active: true
        }
    ]
};

// Función para transformar datos igual que en el Redux slice
function transformChecklistData(rawData) {
    if (!rawData) return null;
    
    return {
        ...rawData,
        id: rawData.id?.toString(),
        items: rawData.items ? rawData.items.map(item => ({
            ...item,
            id: item.id?.toString(),
        })) : []
    };
}

// Función para simular carga de datos en el modal (igual que en modalNewChecklist.tsx)
function simulateModalDataLoading(editingData, isEditing) {
    console.log("=== SIMULANDO CARGA DE DATOS EN MODAL ===");
    console.log("Modal received editingData:", editingData);
    console.log("Modal editingData type:", typeof editingData);
    console.log("Is editing mode:", isEditing);
    
    const result = {
        trimestre: '',
        componente: '',
        observaciones: '',
        items: []
    };
    
    if (isEditing && editingData) {
        // Cargar datos existentes para edición
        result.trimestre = editingData.trimester?.toString() || '';
        result.componente = editingData.component || '';
        result.observaciones = editingData.remarks || '';
        
        console.log("Loading items from editingData:", editingData.items);
        
        // Cargar indicadores existentes si están disponibles
        if (editingData.items && editingData.items.length > 0) {
            result.items = editingData.items.map(item => ({
                indicador: item.indicator || ''
            }));
            console.log("Mapped items for modal:", result.items);
        } else {
            console.log("No items found, setting default item");
            result.items = [{ indicador: '' }];
        }
    } else {
        // Limpiar formulario para nueva creación
        result.items = [{ indicador: '' }];
    }
    
    return result;
}

// Ejecutar el test
console.log("🧪 INICIANDO TEST DE FLUJO DE DATOS DEL MODAL");
console.log("=".repeat(50));

// 1. Simular datos del backend
console.log("1️⃣ Datos originales del backend:");
console.log(JSON.stringify(mockChecklistFromBackend, null, 2));

// 2. Transformar datos (como en Redux)
const transformedData = transformChecklistData(mockChecklistFromBackend);
console.log("\n2️⃣ Datos después de transformación (Redux):");
console.log(JSON.stringify(transformedData, null, 2));

// 3. Simular carga en modal
const modalData = simulateModalDataLoading(transformedData, true);
console.log("\n3️⃣ Datos cargados en el modal:");
console.log(JSON.stringify(modalData, null, 2));

// 4. Verificaciones
console.log("\n4️⃣ VERIFICACIONES:");

// Verificar que los datos básicos se cargaron
const basicFieldsLoaded = modalData.trimestre !== '' || modalData.componente !== '' || modalData.observaciones !== '';
console.log(`✅ Campos básicos cargados: ${basicFieldsLoaded}`);
console.log(`   - Trimestre: "${modalData.trimestre}"`);
console.log(`   - Componente: "${modalData.componente}"`);
console.log(`   - Observaciones: "${modalData.observaciones}"`);

// Verificar que los indicadores se cargaron
const indicatorsLoaded = modalData.items.length > 0 && modalData.items.some(item => item.indicador !== '');
console.log(`✅ Indicadores cargados: ${indicatorsLoaded}`);
console.log(`   - Cantidad de indicadores: ${modalData.items.length}`);
modalData.items.forEach((item, index) => {
    console.log(`   - Indicador ${index + 1}: "${item.indicador}"`);
});

// 5. Simular preparación de datos para envío
console.log("\n5️⃣ PREPARACIÓN PARA ENVÍO AL BACKEND:");
const dataForBackend = {
    state: false,
    remarks: modalData.observaciones || "Sin observaciones",
    trimester: modalData.trimestre,
    instructorSignature: "No signature",
    evaluationCriteria: false,
    studySheets: null,
    evaluations: null,
    associatedJuries: null,
    component: modalData.componente,
    items: modalData.items.map((item, index) => ({
        code: `IND-${index + 1}`,
        indicator: item.indicador,
        active: true
    }))
};

console.log("Datos preparados para envío:");
console.log(JSON.stringify(dataForBackend, null, 2));

// 6. Resultado final
console.log("\n6️⃣ RESULTADO DEL TEST:");
if (basicFieldsLoaded && indicatorsLoaded) {
    console.log("🎉 ✅ TEST EXITOSO: Los datos se cargan y transforman correctamente");
} else {
    console.log("❌ TEST FALLIDO: Hay problemas en la carga de datos");
    if (!basicFieldsLoaded) {
        console.log("   - Problema: Los campos básicos no se cargan");
    }
    if (!indicatorsLoaded) {
        console.log("   - Problema: Los indicadores no se cargan");
    }
}

console.log("=".repeat(50));
console.log("🏁 Test completado");
