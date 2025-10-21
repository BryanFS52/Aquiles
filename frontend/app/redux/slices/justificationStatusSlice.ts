import { clientLAN } from '@lib/apollo-client';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { createInitialPaginatedState, RejectedPayload } from '@type/slices/common/generic'
import {
  GET_ALL_JUSTIFICATION_STATUS,
  GET_JUSTIFICATION_STATUS_BY_ID,
  ADD_JUSTIFICATION_STATUS,
  UPDATE_JUSTIFICATION_STATUS,
  DELETE_JUSTIFICATION_STATUS
} from '@graphql/justificationStatusGraph';
import {
  JustificationStatus,
  GetAllJustificationStatusQuery,
  GetAllJustificationStatusQueryVariables,
  GetJustificationStatusByIdQuery,
  GetJustificationStatusByIdQueryVariables,
  AddJustificationStatusMutation,
  AddJustificationStatusMutationVariables,
  UpdateJustificationStatusMutation,
  UpdateJustificationStatusMutationVariables,
  DeleteJustificationStatusMutation,
  DeleteJustificationStatusMutationVariables
} from '@graphql/generated'

export const fetchAllJustificationStatuses = createAsyncThunk<GetAllJustificationStatusQuery['allJustificationsStatus'], GetAllJustificationStatusQueryVariables>(
  'justificationStatus/fetchAll',
  async ({ page, size }) => {
    try {
      const { data } = await clientLAN.query<GetAllJustificationStatusQuery, GetAllJustificationStatusQueryVariables>({
        query: GET_ALL_JUSTIFICATION_STATUS,
        variables: { page, size },
        fetchPolicy: 'no-cache',
      });
      return data.allJustificationsStatus;
    } catch (error) {
      console.error('Error fetching all justification statuses:', error);
      throw error;
    }
  }
);

export const fetchJustificationStatusById = createAsyncThunk<GetJustificationStatusByIdQuery['justificationStatusById'], GetJustificationStatusByIdQueryVariables,
  { rejectValue: { code: string; message: string } }
>(
  'justificationStatus/fetchById',
  async ({ id }, { rejectWithValue }) => {
    try {
      const { data } = await clientLAN.query<GetJustificationStatusByIdQuery, GetJustificationStatusByIdQueryVariables>({
        query: GET_JUSTIFICATION_STATUS_BY_ID,
        variables: { id },
      });
      return data.justificationStatusById;
    } catch (error: any) {
      console.error('Error fetching justification status by ID:', error);
      return rejectWithValue({ code: '500', message: error.message });
    }
  }
);

export const addJustificationStatus = createAsyncThunk<AddJustificationStatusMutation['addJustificationStatus'], AddJustificationStatusMutationVariables['input'],
  { rejectValue: { code: string; message: string } }
>(
  'justificationStatus/add',
  async (input, { rejectWithValue }) => {
    try {
      const { data } = await clientLAN.mutate<AddJustificationStatusMutation, AddJustificationStatusMutationVariables>({
        mutation: ADD_JUSTIFICATION_STATUS,
        variables: { input },
      });
      const res = data?.addJustificationStatus;

      if (!res || res.code !== '200') {
        return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
      }
      return res;
    } catch (error: any) {
      return rejectWithValue({ code: '500', message: error.message });
    }
  }
);

export const updateJustificationStatus = createAsyncThunk<UpdateJustificationStatusMutation['updateJustificationStatus'], UpdateJustificationStatusMutationVariables,
  { rejectValue: { code: string; message: string } }
>(
  'justificationStatus/update',
  async ({ id, input }, { rejectWithValue }) => {
    try {
      const { data } = await clientLAN.mutate<UpdateJustificationStatusMutation, UpdateJustificationStatusMutationVariables>({
        mutation: UPDATE_JUSTIFICATION_STATUS,
        variables: { id, input },
      });

      const res = data?.updateJustificationStatus;
      if (!res || res.code !== '200') {
        return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
      }

      return res;
    } catch (error: any) {
      return rejectWithValue({ code: '500', message: error.message });
    }
  }
);

export const deleteJustificationStatus = createAsyncThunk<string, string,
  { rejectValue: { code: string; message: string } }
>(
  'justificationStatus/delete',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await clientLAN.mutate<DeleteJustificationStatusMutation, DeleteJustificationStatusMutationVariables>({
        mutation: DELETE_JUSTIFICATION_STATUS,
        variables: { id },
      });

      const res = data?.deleteJustificationStatus;
      if (!res || res.code !== '200') {
        return rejectWithValue({ code: res?.code ?? '500', message: res?.message ?? 'Unknown error' });
      }

      return id;
    } catch (error: any) {
      return rejectWithValue({ code: '500', message: error.message });
    }
  }
);

interface ExtendedJustificationStatusState extends ReturnType<typeof createInitialPaginatedState<JustificationStatus>> {
  currentJustificationStatus: JustificationStatus | null;
}

const initialState: ExtendedJustificationStatusState = {
  ...createInitialPaginatedState<JustificationStatus>(),
  currentJustificationStatus: null,
};

// Funciones helper para usar en componentes
export const getStatusNameById = (
  justificationStatuses: JustificationStatus[],
  statusId?: string
): string => {
  if (!statusId || !justificationStatuses || !Array.isArray(justificationStatuses) || !justificationStatuses.length) {
    return "En proceso";
  }

  const status = justificationStatuses.find(s => s.id === statusId);
  return status?.name || "En proceso";
};

export const getActiveStatuses = (
  justificationStatuses: JustificationStatus[]
): JustificationStatus[] => {
  if (!justificationStatuses || !Array.isArray(justificationStatuses)) {
    return [];
  }
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
    updateLocalJustificationStatus: (state, action: PayloadAction<{ id: string; updates: Partial<JustificationStatus> }>) => {
      const { id, updates } = action.payload;
      const index = state.data.findIndex((status: JustificationStatus) => status.id === id);
      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...updates };
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
        if (action.payload) {
          state.data = action.payload.data as JustificationStatus[] || [];
          state.totalPages = action.payload.totalPages || 0;
          state.totalItems = action.payload.totalItems || 0;
          state.currentPage = action.payload.currentPage || 0;
        }
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
        if (action.payload?.data) {
          state.currentJustificationStatus = action.payload.data as JustificationStatus;
        }
      })
      .addCase(fetchJustificationStatusById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al obtener el estado de justificación';
      })

      // Add
      .addCase(addJustificationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addJustificationStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.data.push(action.payload as JustificationStatus);
        }
        state.error = null;
      })
      .addCase(addJustificationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al agregar el estado de justificación';
      })

      // Update
      .addCase(updateJustificationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJustificationStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const updatedStatus = action.payload as JustificationStatus;
          const index = state.data.findIndex((status: JustificationStatus) => status.id === updatedStatus.id);
          if (index !== -1) {
            state.data[index] = updatedStatus;
          }
          if (state.currentJustificationStatus?.id === updatedStatus.id) {
            state.currentJustificationStatus = updatedStatus;
          }
        }
        state.error = null;
      })
      .addCase(updateJustificationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al actualizar el estado de justificación';
      })

      // Delete
      .addCase(deleteJustificationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJustificationStatus.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        state.data = state.data.filter((status: JustificationStatus) => status.id !== deletedId);
        if (state.currentJustificationStatus?.id === deletedId) {
          state.currentJustificationStatus = null;
        }
      })
      .addCase(deleteJustificationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al eliminar el estado de justificación';
      });
  },
});

export const { } = justificationStatusSlice.actions;

export default justificationStatusSlice.reducer;