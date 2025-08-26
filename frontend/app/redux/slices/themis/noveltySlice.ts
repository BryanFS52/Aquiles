import { clientLAN } from '@lib/apollo-client'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createInitialPaginatedState, RejectedPayload } from '@type/slices/common/generic'
import { ADD_NOVELTY } from '@graphql/themis/noveltyGraph'
import { fetchNoveltyTypes, filterByDesercion } from './noveltyTypeSlice'

// Interfaces para NoveltyDto (basadas en las variables exactas del backend)
export interface NoveltyTypeDto {
  id: string;
}

export interface NoveltyStatusDto {
  id: string;
}

export interface ProcessFlowStatusDto {
  id: string;
}

export interface NoveltyDto {
  observation: string;
  justification: string;
  noveltyFiles: string; // bytea en base64
  noveltyType: NoveltyTypeDto;
  noveltyStatus: NoveltyStatusDto;
  processFlowStatus: ProcessFlowStatusDto;
  studentId: number;
  teacherId: number;
//   administrativeId: number;
}

// Interface para el formulario del modal
export interface NoveltyFormData {
  observation: string;
  justification: string;
  noveltyFiles: string;
  noveltyType: { id: string };
  noveltyStatus: { id: string };
  processFlowStatus: { id: string };
  studentId: number;
  teacherId: number;
  selectedFile: File | null;
}

// Interface para validación de ausencias
export interface StudentAbsenceData {
  studentId: number;
  absenceCount: number;
  canReportDesertion: boolean;
  // Información adicional del estudiante
  studentName?: string;
  studentDocument?: string;
  studentLastname?: string;
}

export interface NoveltyResponse {
  id: string;
  code: string;
  message: string;
}

// Mutations types generadas (simuladas hasta que se generen automáticamente)
export interface AddNoveltyMutation {
  addNovelty: NoveltyResponse;
}

export interface AddNoveltyMutationVariables {
  input: NoveltyDto;
}

// Estado del slice
export interface NoveltyState {
  loading: boolean;
  error: string | { code?: string; message?: string } | null;
  submitSuccess: boolean;
  lastResponse: NoveltyResponse | null;
  // Form state
  formData: NoveltyFormData;
  modalOpen: boolean;
  // Absence validation
  selectedStudentAbsences: StudentAbsenceData | null;
  noveltyTypesLoaded: boolean;
}

// Estado inicial
const initialFormData: NoveltyFormData = {
  observation: '',
  justification: '',
  noveltyFiles: '',
  noveltyType: { id: '' },
  noveltyStatus: { id: '1' }, // Valor por defecto para deserción
  processFlowStatus: { id: '1' }, // Valor por defecto para deserción
  studentId: 0,
  teacherId: 0,
  selectedFile: null,
};

const initialState: NoveltyState = {
  loading: false,
  error: null,
  submitSuccess: false,
  lastResponse: null,
  formData: initialFormData,
  modalOpen: false,
  selectedStudentAbsences: null,
  noveltyTypesLoaded: false,
};

// Async thunk para validar ausencias y abrir modal
export const openNoveltyModal = createAsyncThunk<
  StudentAbsenceData,
  { 
    studentId: number; 
    teacherId: number; 
    absenceCount: number;
    studentName?: string;
    studentDocument?: string;
    studentLastname?: string;
  },
  { rejectValue: RejectedPayload }
>(
  'novelty/openNoveltyModal',
  async ({ studentId, teacherId, absenceCount, studentName, studentDocument, studentLastname }, { dispatch, rejectWithValue }) => {
    try {
      console.log('Opening novelty modal for student:', { studentId, teacherId, absenceCount, studentName });
      
      const canReportDesertion = absenceCount >= 3;
      
      if (!canReportDesertion) {
        return rejectWithValue({
          code: 'INSUFFICIENT_ABSENCES',
          message: `El estudiante debe tener al menos 3 ausencias para reportar deserción. Ausencias actuales: ${absenceCount}`
        });
      }

      // Cargar tipos de novedad y filtrar por "Deserción"
      await dispatch(fetchNoveltyTypes({ page: 0, size: 100 })).unwrap();
      await dispatch(filterByDesercion());

      return {
        studentId,
        absenceCount,
        canReportDesertion,
        studentName,
        studentDocument,
        studentLastname
      };
    } catch (error: any) {
      console.error('Error opening novelty modal:', error);
      return rejectWithValue({
        code: 'MODAL_OPEN_ERROR',
        message: error.message || 'Error al abrir el modal de novedad'
      });
    }
  }
);

// Async thunk para convertir archivo a base64
export const processFile = createAsyncThunk<
  string,
  File,
  { rejectValue: RejectedPayload }
>(
  'novelty/processFile',
  async (file, { rejectWithValue }) => {
    try {
      console.log('Processing file:', file.name);
      
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const result = reader.result as string;
          // Remove the data:mime;base64, prefix
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = (error) => reject(error);
      });
    } catch (error: any) {
      console.error('Error processing file:', error);
      return rejectWithValue({
        code: 'FILE_PROCESS_ERROR',
        message: 'Error al procesar el archivo'
      });
    }
  }
);

// Async thunk para enviar novedad con validación completa
export const submitNovelty = createAsyncThunk<
  NoveltyResponse,
  void,
  { rejectValue: RejectedPayload; state: { novelty: NoveltyState } }
>(
  'novelty/submitNovelty',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { novelty } = getState();
      const { formData, selectedStudentAbsences } = novelty;
      
      // Validaciones
      if (!formData.observation.trim()) {
        return rejectWithValue({
          code: 'VALIDATION_ERROR',
          message: 'La observación es requerida'
        });
      }
      
      if (!formData.noveltyType.id.trim()) {
        return rejectWithValue({
          code: 'VALIDATION_ERROR',
          message: 'El tipo de novedad es requerido'
        });
      }

      if (!selectedStudentAbsences?.canReportDesertion) {
        return rejectWithValue({
          code: 'INSUFFICIENT_ABSENCES',
          message: 'El estudiante no cumple con el mínimo de ausencias para reportar deserción'
        });
      }

      // Preparar datos para envío
      const noveltyData: NoveltyDto = {
        observation: formData.observation,
        justification: formData.justification,
        noveltyFiles: formData.noveltyFiles,
        noveltyType: { id: formData.noveltyType.id },
        noveltyStatus: { id: formData.noveltyStatus.id },
        processFlowStatus: { id: formData.processFlowStatus.id },
        studentId: formData.studentId,
        teacherId: formData.teacherId,
      };

      console.log('Submitting novelty:', noveltyData);
      
      const { data } = await clientLAN.mutate<AddNoveltyMutation, AddNoveltyMutationVariables>({
        mutation: ADD_NOVELTY,
        variables: {
          input: noveltyData
        }
      });

      if (!data?.addNovelty) {
        throw new Error('No se recibió respuesta del servidor');
      }

      console.log('Novelty submitted successfully:', data.addNovelty);
      return data.addNovelty;
    } catch (error: any) {
      console.error('Error submitting novelty:', error);
      
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const graphQLError = error.graphQLErrors[0];
        return rejectWithValue({
          code: graphQLError.extensions?.code || 'GRAPHQL_ERROR',
          message: graphQLError.message || 'Error al enviar la novedad'
        });
      }
      
      if (error.networkError) {
        return rejectWithValue({
          code: 'NETWORK_ERROR',
          message: 'Error de conexión. Verifique su conexión a internet.'
        });
      }
      
      return rejectWithValue({
        code: 'UNKNOWN_ERROR',
        message: error.message || 'Error desconocido al enviar la novedad'
      });
    }
  }
);
// Slice
const noveltySlice = createSlice({
  name: 'novelty',
  initialState,
  reducers: {
    // Modal management
    closeModal: (state) => {
      state.modalOpen = false;
      state.formData = initialFormData;
      state.selectedStudentAbsences = null;
      state.error = null;
    },
    
    // Form management
    updateFormField: (state, action: PayloadAction<{ field: keyof NoveltyFormData; value: any }>) => {
      const { field, value } = action.payload;
      if (field === 'noveltyType' || field === 'noveltyStatus' || field === 'processFlowStatus') {
        (state.formData as any)[field] = { id: value };
      } else {
        (state.formData as any)[field] = value;
      }
    },
    
    setSelectedFile: (state, action: PayloadAction<File | null>) => {
      state.formData.selectedFile = action.payload;
    },
    
    initializeForm: (state, action: PayloadAction<{ studentId: number; teacherId: number }>) => {
      const { studentId, teacherId } = action.payload;
      state.formData = {
        ...initialFormData,
        studentId,
        teacherId,
      };
    },
    
    // Error management
    clearError: (state) => {
      state.error = null;
    },
    
    clearSubmitSuccess: (state) => {
      state.submitSuccess = false;
    },
    
    resetNoveltyState: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      // Open modal
      .addCase(openNoveltyModal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(openNoveltyModal.fulfilled, (state, action: PayloadAction<StudentAbsenceData>) => {
        state.loading = false;
        state.error = null;
        state.modalOpen = true;
        state.selectedStudentAbsences = action.payload;
        state.noveltyTypesLoaded = true;
        state.formData.studentId = action.payload.studentId;
      })
      .addCase(openNoveltyModal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Error al abrir modal' };
        state.modalOpen = false;
      })
      
      // Process file
      .addCase(processFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(processFile.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.formData.noveltyFiles = action.payload;
      })
      .addCase(processFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Error al procesar archivo' };
      })
      
      // Submit novelty
      .addCase(submitNovelty.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.submitSuccess = false;
      })
      .addCase(submitNovelty.fulfilled, (state, action: PayloadAction<NoveltyResponse>) => {
        state.loading = false;
        state.error = null;
        state.submitSuccess = true;
        state.lastResponse = action.payload;
        state.modalOpen = false;
        state.formData = initialFormData;
      })
      .addCase(submitNovelty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Error desconocido' };
        state.submitSuccess = false;
      });
  }
});

export const { 
  closeModal,
  updateFormField,
  setSelectedFile,
  initializeForm,
  clearError, 
  clearSubmitSuccess, 
  resetNoveltyState 
} = noveltySlice.actions;

// Selectores útiles
export const selectNoveltyState = (state: { novelty: NoveltyState }) => state.novelty;
export const selectCanReportDesertion = (state: { novelty: NoveltyState }) => 
  state.novelty.selectedStudentAbsences?.canReportDesertion ?? false;
export const selectStudentAbsenceCount = (state: { novelty: NoveltyState }) => 
  state.novelty.selectedStudentAbsences?.absenceCount ?? 0;
export const selectIsModalOpen = (state: { novelty: NoveltyState }) => state.novelty.modalOpen;
export const selectFormData = (state: { novelty: NoveltyState }) => state.novelty.formData;
export const selectIsLoading = (state: { novelty: NoveltyState }) => state.novelty.loading;
export const selectError = (state: { novelty: NoveltyState }) => state.novelty.error;

export default noveltySlice.reducer;
