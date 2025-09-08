/*
import { clientLAN } from '@lib/apollo-client'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createInitialPaginatedState, RejectedPayload, GenericPaginatedState } from '@type/slices/common/generic'
import { GET_NOVELTYTYPE_LIST } from '@graphql/themis/noveltyTypeGraph'

// Interface para NoveltyType
export interface NoveltyType {
  id: string;
  nameNovelty: string;
  isActive: boolean;
  description: string;
  procedureDescription: string;
}

// Interface para la respuesta de la query
export interface NoveltyTypeResponse {
  code: string;
  message: string;
  date: string;
  currentPage: number;
  totalItems: number;
  totalPages: number;
  data: NoveltyType[];
}

// Query types (simuladas hasta que se generen automáticamente)
export interface GetNoveltyTypesQuery {
  allNoveltyTypes: NoveltyTypeResponse;
}

export interface GetNoveltyTypesQueryVariables {
  page?: number;
  size?: number;
}

// Estado del slice extendido
export interface NoveltyTypeState extends GenericPaginatedState<NoveltyType> {
  filteredData: NoveltyType[];
}

// Estado inicial
const initialState: NoveltyTypeState = {
  ...createInitialPaginatedState<NoveltyType>(),
  filteredData: [],
};

// Async thunk para obtener tipos de novedad
export const fetchNoveltyTypes = createAsyncThunk<
  NoveltyTypeResponse,
  { page?: number; size?: number },
  { rejectValue: RejectedPayload }
>(
  'noveltyType/fetchNoveltyTypes',
  async ({ page = 0, size = 100 }, { rejectWithValue }) => {
    try {
      // console.log('Fetching novelty types:', { page, size });
      
      const { data } = await clientLAN.query<GetNoveltyTypesQuery, GetNoveltyTypesQueryVariables>({
        query: GET_NOVELTYTYPE_LIST,
        variables: { page, size },
        fetchPolicy: 'cache-first'
      });

      if (!data?.allNoveltyTypes) {
        throw new Error('No se recibieron tipos de novedad del servidor');
      }

      // console.log('Novelty types fetched successfully:', data.allNoveltyTypes);
      return data.allNoveltyTypes;
    } catch (error: any) {
      console.error('Error fetching novelty types:', error);
      
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const graphQLError = error.graphQLErrors[0];
        return rejectWithValue({
          code: graphQLError.extensions?.code || 'GRAPHQL_ERROR',
          message: graphQLError.message || 'Error al obtener tipos de novedad'
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
        message: error.message || 'Error desconocido al obtener tipos de novedad'
      });
    }
  }
);

// Slice
const noveltyTypeSlice = createSlice({
  name: 'noveltyType',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearNoveltyTypes: (state) => {
      state.data = [];
      state.filteredData = [];
      state.currentPage = 0;
      state.totalItems = 0;
      state.totalPages = 0;
    },
    filterByDesercion: (state) => {
      // Filtrar solo tipos de novedad que contengan "Deserción" en nameNovelty
      state.filteredData = state.data.filter(noveltyType => 
        noveltyType.nameNovelty.toLowerCase().includes('deserción') ||
        noveltyType.nameNovelty.toLowerCase().includes('desercion')
      );
      // console.log('Filtered novelty types for Deserción:', state.filteredData);
    },
    resetFilter: (state) => {
      state.filteredData = state.data;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch novelty types
      .addCase(fetchNoveltyTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNoveltyTypes.fulfilled, (state, action: PayloadAction<NoveltyTypeResponse>) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload.data || [];
        state.filteredData = action.payload.data || [];
        state.currentPage = action.payload.currentPage;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchNoveltyTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Error desconocido' };
        state.data = [];
        state.filteredData = [];
      });
  }
});

export const { 
  clearError, 
  clearNoveltyTypes, 
  filterByDesercion, 
  resetFilter 
} = noveltyTypeSlice.actions;

export default noveltyTypeSlice.reducer;
*/