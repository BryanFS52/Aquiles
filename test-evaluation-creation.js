// Test rápido para verificar la creación de evaluaciones
const { client } = require('./frontend/app/lib/apollo-client.ts');
const { gql } = require('@apollo/client');

const TEST_ADD_EVALUATION = gql`
  mutation AddEvaluation($input: EvaluationDto!) {
    addEvaluation(input: $input) {
      code
      date
      message
    }
  }
`;

const testCreateEvaluation = async () => {
  try {
    console.log('Testing evaluation creation...');
    
    const evaluationInput = {
      observations: "Test observation",
      recommendations: "Test recommendation", 
      valueJudgment: "BUENO",
      checklistId: 1 // Usar un ID de checklist existente
    };

    console.log('Input:', evaluationInput);

    const { data } = await client.mutate({
      mutation: TEST_ADD_EVALUATION,
      variables: { input: evaluationInput },
    });

    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error);
    if (error.graphQLErrors) {
      console.error('GraphQL Errors:', error.graphQLErrors);
    }
    if (error.networkError) {
      console.error('Network Error:', error.networkError);
    }
  }
};

testCreateEvaluation();
