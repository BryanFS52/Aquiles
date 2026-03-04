
import { client } from '@lib/apollo-client'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createInitialPaginatedState, RejectedPayload, GenericPaginatedState } from '@type/slices/common/generic'
import { GET_NOVELTYTYPE_LIST } from '@graphql/themis/noveltyTypeGraph'

export interface NoveltyType {
    id: string;
    nameNovelty: string;
    isActive: boolean;
    description: string;
    procedureDescription: string;
}

export interface NoveltyTypeResponse {
    code: string;
    message: string;
    date: string;
    currentPage: number;
    totalItems: number;
    totalPages: number;
    data: NoveltyType[];
}

export interface GetNoveltyTypesQuery {
    allNoveltyTypes: NoveltyTypeResponse;
}

export interface GetNoveltyTypesQueryVariables {
    page?: number;
    size?: number;
}

export interface NoveltyTypeState extends GenericPaginatedState<NoveltyType> {
    filteredData: NoveltyType[];
}

const initialState: NoveltyTypeState = {
    ...createInitialPaginatedState<NoveltyType>(),
    filteredData: [],
};

export const fetchNoveltyTypes = createAsyncThunk<
    NoveltyTypeResponse,
    { page?: number; size?: number },
    { rejectValue: RejectedPayload }
>(
    'noveltyType/fetchNoveltyTypes',
    async ({ page = 0, size = 100 }, { rejectWithValue }) => {
        try {

            const { data } = await client.query<GetNoveltyTypesQuery, GetNoveltyTypesQueryVariables>({
                query: GET_NOVELTYTYPE_LIST,
                variables: { page, size },
                fetchPolicy: 'cache-first'
            });

            if (!data?.allNoveltyTypes) {
                throw new Error('No se recibieron tipos de novedad del servidor');
            }

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
            // Filtrar por "Desercion"
            state.filteredData = state.data.filter(noveltyType =>
                noveltyType.nameNovelty.toLowerCase().includes('deserción') ||
                noveltyType.nameNovelty.toLowerCase().includes('desercion')
            );
        },
        resetFilter: (state) => {
            state.filteredData = state.data;
        }
    },
    extraReducers: (builder) => {
        builder
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