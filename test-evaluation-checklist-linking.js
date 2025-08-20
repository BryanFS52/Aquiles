/**
 * Script para diagnosticar problemas de vinculación entre checklists y evaluaciones
 * 
 * Este script ayuda a identificar:
 * 1. Checklists sin evaluaciones
 * 2. Evaluaciones sin vinculación correcta a checklists
 * 3. Problemas de tipos de datos en los IDs
 */

// Simulación de datos para testing
const simulatedChecklists = [
  { id: "1", trimester: 1, component: "academico", state: true },
  { id: "2", trimester: 2, component: "actitudinal", state: true },
  { id: "3", trimester: 3, component: "academico", state: false },
];

const simulatedEvaluations = [
  { id: "1", checklistId: 1, observations: "Test", recommendations: "Test", valueJudgment: "APROBADO" },
  { id: "2", checklistId: "2", observations: "", recommendations: "", valueJudgment: "PENDIENTE" },
  { id: "3", checklistId: "999", observations: "Orphaned", recommendations: "Orphaned", valueJudgment: "PENDIENTE" },
];

function analyzeChecklistEvaluationLinking() {
  console.log("=== ANÁLISIS DE VINCULACIÓN CHECKLIST-EVALUATION ===\n");

  // 1. Analizar checklists
  console.log("📋 CHECKLISTS DISPONIBLES:");
  simulatedChecklists.forEach(checklist => {
    console.log(`  ID: ${checklist.id} (${typeof checklist.id}) - Trimestre: ${checklist.trimester} - Estado: ${checklist.state}`);
  });

  console.log("\n📝 EVALUACIONES DISPONIBLES:");
  simulatedEvaluations.forEach(evaluation => {
    console.log(`  ID: ${evaluation.id} - ChecklistId: ${evaluation.checklistId} (${typeof evaluation.checklistId}) - Estado: ${evaluation.valueJudgment}`);
  });

  // 2. Encontrar checklists sin evaluaciones
  console.log("\n❌ CHECKLISTS SIN EVALUACIONES:");
  const checklistsWithoutEvaluations = simulatedChecklists.filter(checklist => {
    const hasEvaluation = simulatedEvaluations.some(evaluation => {
      // Diferentes tipos de comparación
      const stringMatch = evaluation.checklistId.toString() === checklist.id.toString();
      const numericMatch = parseInt(evaluation.checklistId) === parseInt(checklist.id);
      return stringMatch || numericMatch;
    });
    return !hasEvaluation;
  });

  if (checklistsWithoutEvaluations.length === 0) {
    console.log("  ✅ Todos los checklists tienen evaluaciones");
  } else {
    checklistsWithoutEvaluations.forEach(checklist => {
      console.log(`  ⚠️ Checklist ID: ${checklist.id} NO tiene evaluación asociada`);
    });
  }

  // 3. Encontrar evaluaciones huérfanas
  console.log("\n👻 EVALUACIONES HUÉRFANAS (sin checklist válido):");
  const orphanedEvaluations = simulatedEvaluations.filter(evaluation => {
    const hasValidChecklist = simulatedChecklists.some(checklist => {
      const stringMatch = evaluation.checklistId.toString() === checklist.id.toString();
      const numericMatch = parseInt(evaluation.checklistId) === parseInt(checklist.id);
      return stringMatch || numericMatch;
    });
    return !hasValidChecklist;
  });

  if (orphanedEvaluations.length === 0) {
    console.log("  ✅ Todas las evaluaciones tienen checklist válido");
  } else {
    orphanedEvaluations.forEach(evaluation => {
      console.log(`  ⚠️ Evaluación ID: ${evaluation.id} con ChecklistId: ${evaluation.checklistId} NO tiene checklist válido`);
    });
  }

  // 4. Verificar vinculaciones correctas
  console.log("\n🔗 VINCULACIONES CORRECTAS:");
  simulatedChecklists.forEach(checklist => {
    const linkedEvaluations = simulatedEvaluations.filter(evaluation => {
      const stringMatch = evaluation.checklistId.toString() === checklist.id.toString();
      const numericMatch = parseInt(evaluation.checklistId) === parseInt(checklist.id);
      return stringMatch || numericMatch;
    });

    if (linkedEvaluations.length > 0) {
      linkedEvaluations.forEach(evaluation => {
        console.log(`  ✅ Checklist ${checklist.id} ↔ Evaluación ${evaluation.id} (Estado: ${evaluation.valueJudgment})`);
      });
    }
  });

  // 5. Recomendaciones
  console.log("\n💡 RECOMENDACIONES:");
  console.log("  1. Asegurar que los tipos de datos de checklistId sean consistentes");
  console.log("  2. Usar parseInt() para comparaciones numéricas");
  console.log("  3. Implementar validación en el backend para evitar evaluaciones huérfanas");
  console.log("  4. Crear evaluaciones automáticamente al crear checklists");
  console.log("  5. Implementar una función de limpieza/reparación de datos");
}

// Función para testear la vinculación con diferentes tipos
function testDataTypeLinking() {
  console.log("\n=== TEST DE TIPOS DE DATOS ===");
  
  const testCases = [
    { checklistId: "1", evaluationChecklistId: 1, description: "String vs Number" },
    { checklistId: 1, evaluationChecklistId: "1", description: "Number vs String" },
    { checklistId: "1", evaluationChecklistId: "1", description: "String vs String" },
    { checklistId: 1, evaluationChecklistId: 1, description: "Number vs Number" },
  ];

  testCases.forEach((test, index) => {
    console.log(`\nTest ${index + 1}: ${test.description}`);
    console.log(`  ChecklistId: ${test.checklistId} (${typeof test.checklistId})`);
    console.log(`  EvaluationChecklistId: ${test.evaluationChecklistId} (${typeof test.evaluationChecklistId})`);
    
    // Diferentes tipos de comparación
    const directMatch = test.checklistId === test.evaluationChecklistId;
    const looseMatch = test.checklistId == test.evaluationChecklistId;
    const stringMatch = test.checklistId.toString() === test.evaluationChecklistId.toString();
    const numericMatch = parseInt(test.checklistId) === parseInt(test.evaluationChecklistId);
    
    console.log(`  Direct match (===): ${directMatch}`);
    console.log(`  Loose match (==): ${looseMatch}`);
    console.log(`  String match: ${stringMatch}`);
    console.log(`  Numeric match: ${numericMatch}`);
    console.log(`  Recommended: Use stringMatch OR numericMatch for safety`);
  });
}

// Ejecutar análisis
console.log("🔍 INICIANDO ANÁLISIS DE VINCULACIÓN...\n");
analyzeChecklistEvaluationLinking();
testDataTypeLinking();

console.log("\n✨ ANÁLISIS COMPLETADO");
console.log("\nEste script te ayuda a entender los problemas de vinculación.");
console.log("Revisa los logs en la consola del navegador para información detallada.");
