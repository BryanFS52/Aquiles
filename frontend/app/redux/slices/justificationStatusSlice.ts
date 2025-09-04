import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { clientLAN } from '@lib/apollo-client';
import {
  GET_ALL_JUSTIFICATION_STATUS,
  GET_JUSTIFICATION_STATUS_BY_ID,
  ADD_JUSTIFICATION_STATUS,
  UPDATE_JUSTIFICATION_STATUS,
  DELETE_JUSTIFICATION_STATUS
} from '@graphql/justificationStatusGraph';

// Tipos
export interface JustificationStatus {
  id: string;
  name: string;
  state: boolean;
}

export interface JustificationStatusDto {
  id?: string;
  name: string;
  state: boolean;
}

export interface JustificationStatusState {
  justificationStatuses: JustificationStatus[];
  currentJustificationStatus: JustificationStatus | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  totalItems: number;
  currentPage: number;
}

// Estado inicial
const initialState: JustificationStatusState = {
  justificationStatuses: [],
  currentJustificationStatus: null,
  loading: false,
  error: null,
  totalPages: 0,
  totalItems: 0,
  currentPage: 0,
};

// Thunks asíncronos
export const fetchAllJustificationStatuses = createAsyncThunk(
  'justificationStatus/fetchAll',
  async ({ page = 0, size = 10 }: { page?: number; size?: number }) => {
    const { data } = await clientLAN.query({
      query: GET_ALL_JUSTIFICATION_STATUS,
      variables: { page, size },
    });
    return data.allJustificationsStatus;
  }
);

export const fetchJustificationStatusById = createAsyncThunk(
  'justificationStatus/fetchById',
  async (id: string) => {
    const { data } = await clientLAN.query({
      query: GET_JUSTIFICATION_STATUS_BY_ID,
      variables: { id: parseInt(id) },
    });
    return data.justificationStatusById;
  }
);

export const addJustificationStatus = createAsyncThunk(
  'justificationStatus/add',
  async (input: JustificationStatusDto) => {
    const { data } = await clientLAN.mutate({
      mutation: ADD_JUSTIFICATION_STATUS,
      variables: { input },
    });
    return data.addJustificationStatus;
  }
);

export const updateJustificationStatus = createAsyncThunk(
  'justificationStatus/updateEntity',
  async ({ id, input }: { id: string; input: JustificationStatusDto }) => {
    const { data } = await clientLAN.mutate({
      mutation: UPDATE_JUSTIFICATION_STATUS,
      variables: { id: parseInt(id), input },
    });
    return data.updateJustificationStatus;
  }
);

export const deleteJustificationStatus = createAsyncThunk(
  'justificationStatus/delete',
  async (id: string) => {
    const { data } = await clientLAN.mutate({
      mutation: DELETE_JUSTIFICATION_STATUS,
      variables: { id: parseInt(id) },
    });
    return { id, response: data.deleteJustificationStatus };
  }
);

// Funciones helper para usar en componentes
export const getStatusNameById = (
  justificationStatuses: JustificationStatus[],
  statusId?: string
): string => {
  if (!statusId || !justificationStatuses.length) {
    return "En proceso";
  }

  const status = justificationStatuses.find(s => s.id === statusId);
  return status?.name || "En proceso";
};

export const getActiveStatuses = (
  justificationStatuses: JustificationStatus[]
): JustificationStatus[] => {
  return justificationStatuses.filter(status => status.state === true);
};

// Slice
const justificationStatusSlice = createSlice({
  name: 'justificationStatus',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentJustificationStatus: (state) => {
      state.currentJustificationStatus = null;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    // Nuevo reducer para actualizar un estado específico localmente
    updateLocalJustificationStatus: (state, action: PayloadAction<{ id: string; updates: Partial<JustificationStatus> }>) => {
      const { id, updates } = action.payload;
      const index = state.justificationStatuses.findIndex(status => status.id === id);
      if (index !== -1) {
        state.justificationStatuses[index] = { ...state.justificationStatuses[index], ...updates };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchAllJustificationStatuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllJustificationStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.justificationStatuses = action.payload.data || [];
        state.totalPages = action.payload.totalPages || 0;
        state.totalItems = action.payload.totalItems || 0;
        state.currentPage = action.payload.currentPage || 0;
      })
      .addCase(fetchAllJustificationStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al obtener los estados de justificación';
      })

      // Fetch By ID
      .addCase(fetchJustificationStatusById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJustificationStatusById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJustificationStatus = action.payload.data;
      })
      .addCase(fetchJustificationStatusById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al obtener el estado de justificación';
      })

      // Add
      .addCase(addJustificationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addJustificationStatus.fulfilled, (state) => {
        state.loading = false;
        // Refrescar la lista después de agregar
      })
      .addCase(addJustificationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al agregar el estado de justificación';
      })

      // Update
      .addCase(updateJustificationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJustificationStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Actualizar el estado específico localmente si existe
        if (action.meta.arg) {
          const { id, input } = action.meta.arg;
          const index = state.justificationStatuses.findIndex(status => status.id === id);
          if (index !== -1) {
            state.justificationStatuses[index] = { ...state.justificationStatuses[index], ...input };
          }
        }
      })
      .addCase(updateJustificationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al actualizar el estado de justificación';
      })

      // Delete
      .addCase(deleteJustificationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJustificationStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Remover el elemento de la lista
        state.justificationStatuses = state.justificationStatuses.filter(
          (status) => status.id !== action.payload.id
        );
      })
      .addCase(deleteJustificationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al eliminar el estado de justificación';
      });
  },
});

export const {
  clearError,
  clearCurrentJustificationStatus,
  setCurrentPage,
  updateLocalJustificationStatus
} = justificationStatusSlice.actions;


export default justificationStatusSlice.reducer;