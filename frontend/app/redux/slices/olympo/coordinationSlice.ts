import { client } from '@lib/apollo-client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createInitialPaginatedState } from '@type/slices/common/generic'
import { Coordination } from '@graphql/generated';
import { GET_COORDINATION_BY_COLABORATOR_ID } from '@graphql/olympo/coordinationGraph';
import { GetCoordinationByCollaboratorQuery, GetCoordinationByCollaboratorQueryVariables } from '@graphql/generated'

export const fetchCoordinationByColaborator = createAsyncThunk<GetCoordinationByCollaboratorQuery['allCoordination'], GetCoordinationByCollaboratorQueryVariables>(
  'coordination/fetchByColaborator',
  async ({ collaboratorId, page, size, state = true }) => {
    try {
      const { data } = await client.query<GetCoordinationByCollaboratorQuery, GetCoordinationByCollaboratorQueryVariables>({
        query: GET_COORDINATION_BY_COLABORATOR_ID,
        variables: { collaboratorId, page, size, state },
        fetchPolicy: 'no-cache',
      });

      return data.allCoordination;
    } catch (error) {
      console.error('Error fetching coordinations:', error);
      throw error;
    }
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
    setCurrentPage: (state, action: { payload: number }) => {
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
        if (action.payload?.data) {
          // Filtra nulls y usa los datos directamente
          state.data = action.payload.data
            .filter((item): item is NonNullable<typeof item> => item !== null) as Coordination[];
          state.currentPage = action.payload.currentPage ?? 0;
          state.totalItems = action.payload.totalItems ?? 0;
          state.totalPages = action.payload.totalPages ?? 0;
        }
        state.error = null;
      })
      .addCase(fetchCoordinationByColaborator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar las coordinaciones';
      });
  },
});

export const { } = coordinationSlice.actions;

export default coordinationSlice.reducer;