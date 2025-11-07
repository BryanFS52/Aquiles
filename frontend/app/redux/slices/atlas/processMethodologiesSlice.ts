import { clientLAN } from "@/lib/apollo-client";
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GET_ALL_METHODOLOGIES_AND_PROFILES } from "@graphql/atlas/processMethodologiesGraph";
import { createInitialPaginatedState, RejectedPayload } from '@type/slices/common/generic';
import { ProcessMethodology,GetAllProcessMethodologiesAndProfilesQuery, GetAllProcessMethodologiesAndProfilesQueryVariables } from "@/graphql/generated";

export const fetchAllProcessMethodologiesAndProfiles = createAsyncThunk<GetAllProcessMethodologiesAndProfilesQuery['allProcessMethodology'],GetAllProcessMethodologiesAndProfilesQueryVariables
>(
    'processMethodologies/fetchAll',
    async ({ page, size, search }, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.query<
                GetAllProcessMethodologiesAndProfilesQuery,
                GetAllProcessMethodologiesAndProfilesQueryVariables
            >({
                query: GET_ALL_METHODOLOGIES_AND_PROFILES,
                variables: { page, size, search },
                fetchPolicy: 'no-cache',
            });

            return data.allProcessMethodology;
        } catch (error: any) {
            console.error("Error al fetch:", error);
            return rejectWithValue({
                message: error.message,
                code: 'ERR_FETCH',
            } as RejectedPayload);
        }
    }
);

const processMethodologiesSlice = createSlice({
    name: 'processMethodologies',
    initialState: createInitialPaginatedState<ProcessMethodology>(),
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllProcessMethodologiesAndProfiles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllProcessMethodologiesAndProfiles.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                
                if (action.payload?.data) {
                    // Filtra nulls y usa los datos directamente
                    state.data = action.payload.data
                        .filter((item: any): item is NonNullable<typeof item> => item !== null) as ProcessMethodology[];
                    
                    state.currentPage = action.payload.currentPage ?? 0;
                    state.totalPages = action.payload.totalPages ?? 0;
                    state.totalItems = action.payload.totalItems ?? 0;
                } else {
                    state.data = [];
                    state.currentPage = 0;
                    state.totalPages = 0;
                    state.totalItems = 0;
                }
            })
            .addCase(fetchAllProcessMethodologiesAndProfiles.rejected, (state, action: PayloadAction<unknown>) => {
                state.loading = false;
                state.error = action.payload as RejectedPayload;
            });
    },
});

export default processMethodologiesSlice.reducer;
