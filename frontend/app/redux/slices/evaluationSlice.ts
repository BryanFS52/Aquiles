// import { client } from '@lib/apollo-client';
// import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
// import {GET_ALL_EVALUATIONS, GET_EVALUATION_BY_ID, ADD_EVALUATION, UPDATE_EVALUATION, DELETE_EVALUATION} from '@graphql/evaluationsGraph';
// import { createInitialPaginatedState, RejectedPayload } from '@type/slices/common/generic';
// import {
//     Evaluation,
//     GetAllEvaluationsQuery,
//     GetAllEvaluationsQueryVariables,
//     GetEvaluationByIdQuery,
//     GetEvaluationByIdQueryVariables,
//     AddEvaluationMutation,
//     AddEvaluationMutationVariables,
//     UpdateEvaluationMutation,
//     UpdateEvaluationMutationVariables,
//     DeleteEvaluationMutation,
//     DeleteEvaluationMutationVariables
// } from '@graphql/generated';


// const ttransformGraphQLToAttendanceItem = (graphqlData: any): Evaluation => {
//     console.log('Transforming evaluation data:', graphqlData); // Debug log
//     return {
//         id: graphqlData.id,
//         observations: graphqlData.observations,
//         recommendations: graphqlData.recommendations,
//         valueJudgment: graphqlData.valueJudgment,
//         checklistId: graphqlData.checklistId
//     };
// }

// export const fetchEvaluationsAllByChecklist = createAsyncThunk<
//     GetAllEvaluationsQuery['allEvaluations'],
//     GetAllEvaluationsQueryVariables
// >(
//     'evaluations/fetchEvaluationsAllByChecklist',
//     async ({page, size}) =>{
//         const { data } = await client.query<GetAllEvaluationsQuery, GetAllEvaluationsQueryVariables>({
//             query: GET_ALL_EVALUATIONS,
//             variables: { page, size }
//         });
//         return data.allEvaluations;
//     }
// );

// export const fetchEvaluationById = createAsyncThunk<
//     GetEvaluationByIdQuery['evaluationById'],
//     GetEvaluationByIdQueryVariables
// >(
//     'evaluations/fetchById',
//     async ({ id }, { rejectWithValue }) => {
//         try {
//             const { data } = await client.query<GetEvaluationByIdQuery, GetEvaluationByIdQueryVariables>({
//                 query: GET_EVALUATION_BY_ID,
//                 variables: { id }
//             });
//             return data.evaluationById;
//         } catch (error: any) {
//             console.error("Apollo error:", error);
//             return rejectWithValue({ code: '500', message: error.message });
//         }
//     }
// );


// export const addEvaluation = createAsyncThunk<AddEvaluationMutation['addEvaluation'],AddEvaluationMutationVariables['input'],
//      { rejectValue: { code: string; message: string } }
// >(
//     'evaluations/add',
//     async (input, { rejectWithValue }) => {
//         try {
//             const { data } = await client.mutate<AddEvaluationMutation, AddEvaluationMutationVariables>({
//                 mutation: ADD_EVALUATION,
//                 variables: { input }
//             });
//             const res = data?.addEvaluation;

//             if (!res || res.code !== '200') {
//                 return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
//             }
//             return res;
//         } catch (error: any) {
//             return rejectWithValue({ code: '500', message: error.message });
//         }
//     }
// );

// export const updateEvaluation = createAsyncThunk<UpdateEvaluationMutation['updateEvaluation'], UpdateEvaluationMutationVariables,
//     { rejectValue: { code: string; message: string } }
// >(
//     'evaluations/update',
//     async ({ id, input }, { rejectWithValue }) => {
//         try {
//             const { data } = await client.mutate<UpdateEvaluationMutation, UpdateEvaluationMutationVariables>({
//                 mutation: UPDATE_EVALUATION,
//                 variables: { id, input },
//             });

//             const res = data?.updateEvaluation;
//             if (!res || res.code !== '200') {
//                 return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
//             }

//             return res;
//         } catch (error: any) {
//             return rejectWithValue({ code: '500', message: error.message });
//         }
//     }
// );  

// export const deleteEvaluation = createAsyncThunk<string, string,
//     { rejectValue: { code: string; message: string } }
// >(
//     'evaluations/delete',
//     async (id, { rejectWithValue }) => {
//         try {
//             const { data } = await client.mutate<DeleteEvaluationMutation, DeleteEvaluationMutationVariables>({
//                 mutation: DELETE_EVALUATION,
//                 variables: { id },
//             });

//             const res = data?.deleteEvaluation;
//             if (!res || res.code !== '200') {
//                 return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
//             }

//             return res.id;
//         } catch (error: any) {
//             return rejectWithValue({ code: '500', message: error.message });
//         }
//     }
// );      

// const initialState = createInitialPaginatedState<Evaluation>();

// const evaluationSlice = createSlice({
//     name: 'evaluation',
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             // fetchEvaluationsAllByChecklist
//             .addCase(fetchEvaluationsAllByChecklist.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(fetchEvaluationsAllByChecklist.fulfilled, (state, action: PayloadAction<GetAllEvaluationsQuery['allEvaluations']>) => {
//                 if (action.payload?.data) {
//                     state.data = action.payload.data
//                         .filter((item): item is NonNullable<typeof item> => item !== null)
//                         .map(ttransformGraphQLToAttendanceItem);
//                     state.totalItems = action.payload.totalItems ?? 0;
//                     state.totalPages = action.payload.totalPages ?? 0;
//                     state.currentPage = action.payload.currentPage ?? 0;
//                 }
//                 state.loading = false;
//             })
//             .addCase(fetchEvaluationsAllByChecklist.rejected, (state, action) => {
//                 state.error = action.error.message || 'Error fetching evaluations';
//                 state.loading = false;
//             })
//             // fetchEvaluationById
//             .addCase(fetchEvaluationById.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(fetchEvaluationById.fulfilled, (state, action: PayloadAction<GetEvaluationByIdQuery['evaluationById']>) => {
//                 if (action.payload) {
//                     state.data = [ttransformGraphQLToAttendanceItem(action.payload)];
//                 }
//                 state.loading = false;
//             })
//             .addCase(fetchEvaluationById.rejected, (state, action) => {
//                 const payload = action.payload as RejectedPayload;
//                 const { code, message } = payload || {};
//                 state.error = { code, message };
//                 state.loading = false;
//             })
//             // addEvaluation
//             .addCase(addEvaluation.fulfilled, (state, action: PayloadAction<AddEvaluationMutation['addEvaluation']>) => {
//                 console.log('=== ADD EVALUATION FULFILLED ===');
//                 console.log('Response payload:', action.payload);
                
//                 if (action.payload) {
//                     console.log('Evaluation added successfully:', action.payload);
//                     // Note: addEvaluation solo devuelve {code, message, id}, no los datos completos de la evaluación
//                     // No agregamos al estado local aquí porque no tenemos los datos completos
//                     console.log('Evaluation created with ID:', action.payload.id);
//                 }
//                 state.error = null;
//             })
//             .addCase(addEvaluation.rejected, (state, action) => {
//                 const payload = action.payload as RejectedPayload;
//                 const { code, message } = payload || {};
//                 state.error = { code, message };
//             })
//             // updateEvaluation
//             .addCase(updateEvaluation.fulfilled, (state, action: PayloadAction<UpdateEvaluationMutation['updateEvaluation']>) => {
//                 if (action.payload) {
//                     const updatedEvaluation = ttransformGraphQLToAttendanceItem(action.payload);
//                     const index = state.data.findIndex((evaluation: Evaluation) => evaluation.id === updatedEvaluation.id);
//                     if (index !== -1) {
//                         state.data[index] = updatedEvaluation;
//                     }
//                 }
//                 state.error = null;
//             })
//             .addCase(updateEvaluation.rejected, (state, action) => {
//                 const payload = action.payload as RejectedPayload;
//                 const { code, message } = payload || {};
//                 state.error = { code, message };
//             })
//             // deleteEvaluation
//             .addCase(deleteEvaluation.fulfilled, (state, action: PayloadAction<string>) => {
//                 if (action.payload) {
//                     state.data = state.data.filter((evaluation: Evaluation) => evaluation.id !== action.payload);
//                 }
//                 state.error = null;
//             })
//             .addCase(deleteEvaluation.rejected, (state, action) => {
//                 const payload = action.payload as RejectedPayload;
//                 const { code, message } = payload || {};
//                 state.error = { code, message };
//             })
//     }
// });

// export const { } = evaluationSlice.actions;

// export default evaluationSlice.reducer;