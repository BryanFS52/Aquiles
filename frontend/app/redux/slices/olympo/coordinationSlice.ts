import { clientLAN } from '@lib/apollo-client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createInitialPaginatedState } from '@type/slices/common/generic'
import { Coordination } from '@graphql/generated';
import { GET_COORDINATION_BY_COLABORATOR_ID } from '@graphql/coordination/coordinationGraph';

export const transformGraphQLToCoordination = (graphqlData: any): Coordination => {
  return {
    id: graphqlData.id,
    name: graphqlData.name,
    state: graphqlData.state,
    committees: graphqlData.committees || [],
    createdAt: graphqlData.createdAt,
    updatedAt: graphqlData.updatedAt,
    teachers: graphqlData.teachers?.map((t: any) => ({
      id: t.id,
      state: t.state,
    })) || [],
    trainingCenter: graphqlData.trainingCenter
      ? {
          id: graphqlData.trainingCenter.id,
          name: graphqlData.trainingCenter.name,
        }
      : null,
  };
};

export const fetchCoordinationByColaborator = createAsyncThunk(
  'coordination/fetchByColaborator',
  async ({ collaboratorId, page = 0, size = 10, state = true }: { collaboratorId: number; page?: number; size?: number; state?: boolean }) => {
    const { data } = await clientLAN.query({
      query: GET_COORDINATION_BY_COLABORATOR_ID,
      variables: { collaboratorId, page, size, state },
    });
    
    const transformedData = data.allCoordination.data.map(transformGraphQLToCoordination);
    
    return {
      data: transformedData,
      totalItems: data.allCoordination.totalItems,
      totalPages: data.allCoordination.totalPages,
      currentPage: data.allCoordination.currentPage,
    };
  }
);

const initialState = createInitialPaginatedState<Coordination>();

const coordinationSlice = createSlice({
  name: 'coordination',
  initialState,
  reducers: {
    clearCoordinations: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
      state.currentPage = 0;
      state.totalItems = 0;
      state.totalPages = 0;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoordinationByColaborator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoordinationByColaborator.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.currentPage = action.payload.currentPage;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.error = null;
      })
      .addCase(fetchCoordinationByColaborator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar las coordinaciones';
      });
  },
});

export const { clearCoordinations, setCurrentPage } = coordinationSlice.actions;export default coordinationSlice.reducer;