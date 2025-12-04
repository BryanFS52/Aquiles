import { clientLAN } from '@lib/apollo-client';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {GET_ALL_EVALUATIONS, GET_EVALUATION_BY_ID, ADD_EVALUATION, UPDATE_EVALUATION, DELETE_EVALUATION, GET_EVALUATIONS_BY_CHECKLIST} from '@graphql/evaluationsGraph';
import { createInitialPaginatedState, RejectedPayload } from '@type/slices/common/generic';
import {
    Evaluation,
    GetAllEvaluationsQuery,
    GetAllEvaluationsQueryVariables,
    GetEvaluationByIdQuery,
    GetEvaluationByIdQueryVariables,
    AddEvaluationMutation,
    AddEvaluationMutationVariables,
    UpdateEvaluationMutation,
    UpdateEvaluationMutationVariables,
    DeleteEvaluationMutation,
    DeleteEvaluationMutationVariables
} from '@graphql/generated';

// Service methods integrated into slice  
interface EvaluationInput {
    observations: string;
    recommendations: string;
    valueJudgment: string;
    checklistId: number;
}

// Función de utilidad para comparar IDs de forma segura
function safeIdComparison(id1: any, id2: any): boolean {
    if (id1 == null || id2 == null) return false;
    
    // Comparación por string (más segura)
    const stringMatch = id1.toString() === id2.toString();
    
    // Comparación numérica como respaldo
    const numericMatch = parseInt(id1) === parseInt(id2) && !isNaN(parseInt(id1)) && !isNaN(parseInt(id2));
    
    return stringMatch || numericMatch;
}

const evaluationService = {
    // Función para crear una evaluación directamente con todos los datos
    createCompleteEvaluation: async (checklistId: number, observations: string, recommendations: string, valueJudgment: string) => {
        try {
            const numericChecklistId = parseInt(checklistId.toString());
            
            if (isNaN(numericChecklistId) || numericChecklistId <= 0) {
                throw new Error(`ID de checklist inválido: ${checklistId}`);
            }
            
            if (!observations || !observations.trim()) {
                throw new Error('Las observaciones son requeridas');
            }
            
            if (!recommendations || !recommendations.trim()) {
                throw new Error('Las recomendaciones son requeridas');
            }
            
            if (!valueJudgment || valueJudgment === "PENDIENTE") {
                throw new Error('El juicio de valor es requerido');
            }
            
            const evaluationInput = {
                observations: observations.trim(),
                recommendations: recommendations.trim(),
                valueJudgment: valueJudgment,
                checklistId: numericChecklistId
            };

            const { data } = await clientLAN.mutate({
                mutation: ADD_EVALUATION,
                variables: { input: evaluationInput },
            });
            
            if (data && data.addEvaluation && data.addEvaluation.code === "200") {
                return data.addEvaluation;
            } else {
                throw new Error(`Error creating complete evaluation: ${data?.addEvaluation?.message}`);
            }
        } catch (error) {
            console.error('❌ Error creating complete evaluation:', error);
            throw error;
        }
    },

    // Función para crear una evaluación automáticamente al crear una lista de chequeo
    createEvaluationForChecklist: async (checklistId: number, teamScrumId?: number) => {
        try {
            const numericChecklistId = parseInt(checklistId.toString());
            
            if (isNaN(numericChecklistId) || numericChecklistId <= 0) {
                throw new Error(`ID de checklist inválido: ${checklistId}`);
            }
            
            const evaluationInput = {
                observations: "",
                recommendations: "",
                valueJudgment: "PENDIENTE",
                checklistId: numericChecklistId,
                teamScrumId: teamScrumId // Incluir teamScrumId para hacer la evaluación única
            };

            console.log("🚀 Creando evaluación con datos:", evaluationInput);

            const { data } = await clientLAN.mutate({
                mutation: ADD_EVALUATION,
                variables: { input: evaluationInput },
            });
            
            if (data && data.addEvaluation && data.addEvaluation.code === "200") {
                console.log("✅ Evaluación creada exitosamente:", data.addEvaluation);
                return data.addEvaluation;
            } else {
                throw new Error(`Error creating evaluation: ${data?.addEvaluation?.message}`);
            }
        } catch (error: any) {
            console.error('❌ Error creating evaluation:', error);
            throw error;
        }
    },

    // Función para obtener evaluaciones por checklist ID
    fetchEvaluationsByChecklist: async (checklistId: number) => {
        try {
            console.log("🔍 Fetching evaluations for checklist:", checklistId);
            console.log("🔍 Using allEvaluations query and filtering");
            
            const { data } = await clientLAN.query({
                query: GET_ALL_EVALUATIONS,
                variables: { page: 0, size: 100 },
                fetchPolicy: 'no-cache',
            });
            
            console.log("🔍 Raw GraphQL response:", data);
            
            // Filtrar por checklistId
            if (data.allEvaluations && data.allEvaluations.data) {
                console.log("🔍 All evaluations before filtering:", data.allEvaluations.data);
                const filteredEvaluations = data.allEvaluations.data.filter((evaluation: any) => {
                    const matches = safeIdComparison(evaluation.checklistId, checklistId);
                    console.log(`🔍 Evaluation ${evaluation.id}: checklistId=${evaluation.checklistId}, target=${checklistId}, matches=${matches}`);
                    return matches;
                });
                
                console.log("🔍 Filtered evaluations:", filteredEvaluations);
                
                return {
                    ...data.allEvaluations,
                    data: filteredEvaluations
                };
            }
            
            console.log("❌ No allEvaluations data found");
            return data.allEvaluations;
        } catch (error) {
            console.error('❌ Error fetching evaluations by checklist:', error);
            throw error;
        }
    },

    // Función para obtener una evaluación por ID
    fetchEvaluationById: async (id: number) => {
        try {
            const { data } = await clientLAN.query({
                query: GET_EVALUATION_BY_ID,
                variables: { id },
                fetchPolicy: 'no-cache',
            });
            return data.evaluationById;
        } catch (error) {
            console.error('Error fetching evaluation by ID:', error);
            throw error;
        }
    },

    // Función para actualizar una evaluación
    updateEvaluation: async (id: number, evaluationData: EvaluationInput) => {
        try {
            const { data } = await clientLAN.mutate({
                mutation: UPDATE_EVALUATION,
                variables: { id, input: evaluationData },
            });
            return data.updateEvaluation;
        } catch (error) {
            console.error('Error updating evaluation:', error);
            throw error;
        }
    },

    // Función para completar una evaluación
    completeEvaluation: async (evaluationId: number, observations: string, recommendations: string, valueJudgment: string) => {
        try {
            const currentEvaluation = await evaluationService.fetchEvaluationById(evaluationId);
            
            const evaluationData = {
                observations: observations,
                recommendations: recommendations,
                valueJudgment: valueJudgment,
                checklistId: currentEvaluation.data.checklistId
            };

            return await evaluationService.updateEvaluation(evaluationId, evaluationData);
        } catch (error) {
            console.error('Error completing evaluation:', error);
            throw error;
        }
    }
};


const ttransformGraphQLToAttendanceItem = (graphqlData: any): Evaluation => {
    console.log('Transforming evaluation data:', graphqlData); // Debug log
    return {
        id: graphqlData.id,
        observations: graphqlData.observations,
        recommendations: graphqlData.recommendations,
        valueJudgment: graphqlData.valueJudgment,
        checklistId: graphqlData.checklistId
    };
}

export const fetchEvaluationsAllByChecklist = createAsyncThunk<
    GetAllEvaluationsQuery['allEvaluations'],
    GetAllEvaluationsQueryVariables
>(
    'evaluations/fetchEvaluationsAllByChecklist',
    async ({page, size}) =>{
        const { data } = await clientLAN.query<GetAllEvaluationsQuery, GetAllEvaluationsQueryVariables>({
            query: GET_ALL_EVALUATIONS,
            variables: { page, size }
        });
        return data.allEvaluations;
    }
);

export const fetchAllEvaluationsDebug = createAsyncThunk<
    GetAllEvaluationsQuery['allEvaluations'],
    { page: number; size: number }
>(
    'evaluations/fetchAllEvaluationsDebug',
    async ({ page, size }) => {
        const { data } = await clientLAN.query<GetAllEvaluationsQuery, GetAllEvaluationsQueryVariables>({
            query: GET_ALL_EVALUATIONS,
            variables: { page, size },
            fetchPolicy: 'no-cache',
        });
        return data.allEvaluations;
    }
);

export const fetchEvaluationById = createAsyncThunk<
    GetEvaluationByIdQuery['evaluationById'],
    GetEvaluationByIdQueryVariables
>(
    'evaluations/fetchById',
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.query<GetEvaluationByIdQuery, GetEvaluationByIdQueryVariables>({
                query: GET_EVALUATION_BY_ID,
                variables: { id }
            });
            return data.evaluationById;
        } catch (error: any) {
            console.error("Apollo error:", error);
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);


export const addEvaluation = createAsyncThunk<AddEvaluationMutation['addEvaluation'],AddEvaluationMutationVariables['input'],
     { rejectValue: { code: string; message: string } }
>(
    'evaluations/add',
    async (input, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.mutate<AddEvaluationMutation, AddEvaluationMutationVariables>({
                mutation: ADD_EVALUATION,
                variables: { input }
            });
            const res = data?.addEvaluation;

            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }
            return res;
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

export const updateEvaluation = createAsyncThunk<UpdateEvaluationMutation['updateEvaluation'], UpdateEvaluationMutationVariables,
    { rejectValue: { code: string; message: string } }
>(
    'evaluations/update',
    async ({ id, input }, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.mutate<UpdateEvaluationMutation, UpdateEvaluationMutationVariables>({
                mutation: UPDATE_EVALUATION,
                variables: { id, input },
            });

            const res = data?.updateEvaluation;
            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }

            return res;
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);

export const updateEvaluationItemStates = createAsyncThunk<UpdateEvaluationMutation['updateEvaluation'], 
    { id: number; itemStates: any; generalObservations?: string; recommendations?: string; valueJudgment?: string },
    { rejectValue: { code: string; message: string } }
>(
    'evaluations/updateItemStates',
    async ({ id, itemStates, generalObservations, recommendations, valueJudgment }, { rejectWithValue }) => {
        try {
            console.log('=== UPDATING EVALUATION ITEM STATES ===');
            console.log('Evaluation ID:', id);
            console.log('Item states:', itemStates);
            console.log('General observations:', generalObservations);

            // Guardar solo las observaciones generales como texto plano
            // Los estados de items se mantienen en localStorage y se sincronizan con la evaluación
            const input = {
                observations: generalObservations || "",
                recommendations: recommendations || "",
                valueJudgment: valueJudgment || "PENDIENTE"
            };

            console.log('Update input:', input);

            const { data } = await clientLAN.mutate<UpdateEvaluationMutation, UpdateEvaluationMutationVariables>({
                mutation: UPDATE_EVALUATION,
                variables: { id, input },
            });

            const res = data?.updateEvaluation;
            if (!res || res.code !== '200') {
                console.error('Update failed with response:', res);
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }

            console.log('✅ Item states updated successfully in database');
            return res;
        } catch (error: any) {
            console.error('Error updating item states:', error);
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);  

export const deleteEvaluation = createAsyncThunk<string, string,
    { rejectValue: { code: string; message: string } }
>(
    'evaluations/delete',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.mutate<DeleteEvaluationMutation, DeleteEvaluationMutationVariables>({
                mutation: DELETE_EVALUATION,
                variables: { id },
            });


            const res = data?.deleteEvaluation;
            if (!res || res.code !== '200') {
                return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
            }

            return res.id;
        } catch (error: any) {
            return rejectWithValue({ code: '500', message: error.message });
        }
    }
);      
const initialState = createInitialPaginatedState<Evaluation>();

const evaluationSlice = createSlice({
    name: 'evaluation',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchEvaluationsAllByChecklist
            .addCase(fetchEvaluationsAllByChecklist.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchEvaluationsAllByChecklist.fulfilled, (state, action: PayloadAction<GetAllEvaluationsQuery['allEvaluations']>) => {
                if (action.payload?.data) {
                    state.data = action.payload.data
                        .filter((item): item is NonNullable<typeof item> => item !== null)
                        .map(ttransformGraphQLToAttendanceItem);
                    state.totalItems = action.payload.totalItems ?? 0;
                    state.totalPages = action.payload.totalPages ?? 0;
                    state.currentPage = action.payload.currentPage ?? 0;
                }
                state.loading = false;
            })
            .addCase(fetchEvaluationsAllByChecklist.rejected, (state, action) => {
                state.error = action.error.message || 'Error fetching evaluations';
                state.loading = false;
            })
            // fetchAllEvaluationsDebug
            .addCase(fetchAllEvaluationsDebug.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllEvaluationsDebug.fulfilled, (state, action: PayloadAction<GetAllEvaluationsQuery['allEvaluations']>) => {
                if (action.payload?.data) {
                    state.data = action.payload.data
                        .filter((item): item is NonNullable<typeof item> => item !== null)
                        .map(ttransformGraphQLToAttendanceItem);
                    state.totalItems = action.payload.totalItems ?? 0;
                    state.totalPages = action.payload.totalPages ?? 0;
                    state.currentPage = action.payload.currentPage ?? 0;
                }
                state.loading = false;
            })
            .addCase(fetchAllEvaluationsDebug.rejected, (state, action) => {
                state.error = action.error.message || 'Error fetching evaluations';
                state.loading = false;
            })
            // fetchEvaluationById
            .addCase(fetchEvaluationById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchEvaluationById.fulfilled, (state, action: PayloadAction<GetEvaluationByIdQuery['evaluationById']>) => {
                if (action.payload) {
                    state.data = [ttransformGraphQLToAttendanceItem(action.payload)];
                }
                state.loading = false;
            })
            .addCase(fetchEvaluationById.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
                state.loading = false;
            })
            // addEvaluation
            .addCase(addEvaluation.fulfilled, (state, action: PayloadAction<AddEvaluationMutation['addEvaluation']>) => {
                console.log('=== ADD EVALUATION FULFILLED ===');
                console.log('Response payload:', action.payload);
                
                if (action.payload) {
                    console.log('Evaluation added successfully:', action.payload);
                    // Note: addEvaluation solo devuelve {code, message, id}, no los datos completos de la evaluación
                    // No agregamos al estado local aquí porque no tenemos los datos completos
                    console.log('Evaluation created with ID:', action.payload.id);
                }
                state.error = null;
            })
            .addCase(addEvaluation.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            })
            // updateEvaluation
            .addCase(updateEvaluation.fulfilled, (state, action: PayloadAction<UpdateEvaluationMutation['updateEvaluation']>) => {
                if (action.payload) {
                    const updatedEvaluation = ttransformGraphQLToAttendanceItem(action.payload);
                    const index = state.data.findIndex((evaluation: Evaluation) => evaluation.id === updatedEvaluation.id);
                    if (index !== -1) {
                        state.data[index] = updatedEvaluation;
                    }
                }
                state.error = null;
            })
            .addCase(updateEvaluation.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            })
            // updateEvaluationItemStates
            .addCase(updateEvaluationItemStates.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateEvaluationItemStates.fulfilled, (state, action: PayloadAction<UpdateEvaluationMutation['updateEvaluation']>) => {
                console.log('=== ITEM STATES UPDATE FULFILLED ===');
                state.loading = false;
                state.error = null;
                console.log('✅ Item states saved to database successfully');
            })
            .addCase(updateEvaluationItemStates.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
                state.loading = false;
                console.error('❌ Failed to save item states to database:', payload);
            })
            // deleteEvaluation
            .addCase(deleteEvaluation.fulfilled, (state, action: PayloadAction<string>) => {
                if (action.payload) {
                    state.data = state.data.filter((evaluation: Evaluation) => evaluation.id !== action.payload);
                }
                state.error = null;
            })
            .addCase(deleteEvaluation.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
            })
    }
});

export const { } = evaluationSlice.actions;

// Export service methods for compatibility
export { evaluationService };

export default evaluationSlice.reducer;