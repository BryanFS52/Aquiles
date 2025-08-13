/**
 * Test de diagnóstico para ejecutar en la consola del navegador
 * 
 * Instrucciones:
 * 1. Abrir la aplicación en el navegador
 * 2. Ir a ListaChequeoInstructor
 * 3. Abrir DevTools (F12)
 * 4. Pegar este código en la consola
 * 5. Ejecutar con Enter
 */

(async function diagnosticTest() {
  console.log("🔍 === DIAGNÓSTICO DE EVALUACIONES-CHECKLISTS ===");
  
  try {
    // Simulación de cómo debería funcionar la búsqueda
    console.log("\n📊 Probando diferentes estrategias de búsqueda...");
    
    // Esta función simula lo que hace fetchEvaluationsByChecklist
    function simulateEvaluationSearch(checklistId, allEvaluations) {
      console.log(`\n🔍 Buscando evaluaciones para checklist ID: ${checklistId} (${typeof checklistId})`);
      
      // Log de todas las evaluaciones disponibles
      console.log("📝 Evaluaciones en base de datos:");
      allEvaluations.forEach((evaluation, index) => {
        console.log(`  ${index + 1}. ID: ${evaluation.id}, ChecklistId: ${evaluation.checklistId} (${typeof evaluation.checklistId}), Status: ${evaluation.valueJudgment}`);
      });
      
      // Probar diferentes estrategias de filtrado
      const strategies = [
        {
          name: "Direct comparison (===)",
          filter: (eval) => eval.checklistId === checklistId
        },
        {
          name: "Loose comparison (==)",
          filter: (eval) => eval.checklistId == checklistId
        },
        {
          name: "String comparison",
          filter: (eval) => eval.checklistId.toString() === checklistId.toString()
        },
        {
          name: "Numeric comparison", 
          filter: (eval) => parseInt(eval.checklistId) === parseInt(checklistId)
        },
        {
          name: "Combined safe comparison",
          filter: (eval) => {
            const stringMatch = eval.checklistId.toString() === checklistId.toString();
            const numericMatch = parseInt(eval.checklistId) === parseInt(checklistId);
            return stringMatch || numericMatch;
          }
        }
      ];
      
      strategies.forEach(strategy => {
        const matches = allEvaluations.filter(strategy.filter);
        console.log(`  ${strategy.name}: ${matches.length} matches`);
        if (matches.length > 0) {
          matches.forEach(match => {
            console.log(`    ✅ Found: Evaluation ID ${match.id} for Checklist ${match.checklistId}`);
          });
        }
      });
      
      return strategies[4].filter(allEvaluations); // Usar la estrategia más segura
    }
    
    // Datos de prueba que simulan el problema real
    const testScenarios = [
      {
        name: "Scenario 1: String checklist ID, numeric evaluation checklistId",
        checklistId: "123",
        evaluations: [
          { id: "1", checklistId: 123, valueJudgment: "APROBADO" },
          { id: "2", checklistId: 456, valueJudgment: "PENDIENTE" }
        ]
      },
      {
        name: "Scenario 2: Numeric checklist ID, string evaluation checklistId",
        checklistId: 123,
        evaluations: [
          { id: "1", checklistId: "123", valueJudgment: "APROBADO" },
          { id: "2", checklistId: "456", valueJudgment: "PENDIENTE" }
        ]
      },
      {
        name: "Scenario 3: Mixed types in evaluations",
        checklistId: "123",
        evaluations: [
          { id: "1", checklistId: 123, valueJudgment: "APROBADO" },
          { id: "2", checklistId: "123", valueJudgment: "PENDIENTE" },
          { id: "3", checklistId: "456", valueJudgment: "RECHAZADO" }
        ]
      }
    ];
    
    testScenarios.forEach(scenario => {
      console.log(`\n📋 ${scenario.name}`);
      simulateEvaluationSearch(scenario.checklistId, scenario.evaluations);
    });
    
    console.log("\n💡 RECOMENDACIONES BASADAS EN EL ANÁLISIS:");
    console.log("1. ✅ Usar comparación combinada (string Y numeric) para máxima compatibilidad");
    console.log("2. ✅ Normalizar tipos de datos en el backend");
    console.log("3. ✅ Agregar logs detallados para debugging");
    console.log("4. ✅ Crear evaluaciones faltantes automáticamente");
    console.log("5. ✅ Validar datos antes de comparaciones");
    
    console.log("\n🔧 CÓDIGO RECOMENDADO PARA FILTRADO:");
    console.log(`
    const filteredEvaluations = allEvaluations.filter(evaluation => {
      const evalChecklistId = evaluation.checklistId;
      const stringMatch = evalChecklistId?.toString() === checklistId.toString();
      const numericMatch = parseInt(evalChecklistId) === parseInt(checklistId);
      
      console.log('Comparison:', {
        evalChecklistId,
        evalType: typeof evalChecklistId,
        checklistId,
        checklistType: typeof checklistId,
        stringMatch,
        numericMatch
      });
      
      return stringMatch || numericMatch;
    });
    `);
    
    console.log("\n✨ DIAGNÓSTICO COMPLETADO");
    console.log("Este diagnóstico te ayuda a entender por qué las evaluaciones no se encuentran.");
    console.log("El problema principal son los tipos de datos inconsistentes entre IDs.");
    
  } catch (error) {
    console.error("❌ Error en el diagnóstico:", error);
  }
})();

console.log("📋 Script de diagnóstico cargado. El análisis debería aparecer arriba.");
console.log("Si necesitas más información, revisa los logs de la aplicación.");
