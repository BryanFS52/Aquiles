import { clientLAN } from "@/lib/apollo-client";
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GET_ALL_METHODOLOGIES_AND_PROFILES } from "@graphql/atlas/processMethodologiesGraph";
import { createInitialPaginatedState, RejectedPayload } from '@type/slices/common/generic';
import {
    ProcessMethodology,
    GetAllProcessMethodologiesAndProfilesQuery,
    GetAllProcessMethodologiesAndProfilesQueryVariables
} from "@/graphql/generated";

const transformGraphQLToProcessMethodologiesItem = (grahpqlData: any): ProcessMethodology => {
    console.log("🔹 Transformando item crudo:", grahpqlData);

    const item: ProcessMethodology = {
        id: grahpqlData.id ?? grahpqlData._id ?? "",
        name: grahpqlData.name,
        description: grahpqlData.description,
        isActive: grahpqlData.isActive,
        methodology: grahpqlData.methodology
            ? {
                id: grahpqlData.methodology.id,
                name: grahpqlData.methodology.name,
                description: grahpqlData.methodology.description
            }
            : { id: "", name: "", description: "" },
        profiles: grahpqlData.profiles?.map((profile: any) => ({
            id: profile.id,
            name: profile.name,
            description: profile.description
        })) || []
    };

    console.log("✅ Transformado a:", item);
    return item;
};

export const fetchAllProcessMethodologiesAndProfiles = createAsyncThunk<
    GetAllProcessMethodologiesAndProfilesQuery['allProcessMethodology'],
    GetAllProcessMethodologiesAndProfilesQueryVariables
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

            console.log("📥 Respuesta GraphQL:", JSON.stringify(data.allProcessMethodology, null, 2));
            return data.allProcessMethodology;
        } catch (error: any) {
            console.error("❌ Error al fetch:", error);
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
                console.log("📦 Payload recibido en fulfilled:", action.payload);

                state.loading = false;
                state.data = action.payload.data.map(transformGraphQLToProcessMethodologiesItem);

                console.log("📊 Estado final data:", state.data);

                state.currentPage = action.payload.currentPage;
                state.totalPages = action.payload.totalPages;
                state.totalItems = action.payload.totalItems;
            })
            .addCase(fetchAllProcessMethodologiesAndProfiles.rejected, (state, action: PayloadAction<unknown>) => {
                state.loading = false;
                state.error = action.payload as RejectedPayload;
                console.error("❌ Fetch rechazado:", action.payload);
            });
    },
});

export default processMethodologiesSlice.reducer;
