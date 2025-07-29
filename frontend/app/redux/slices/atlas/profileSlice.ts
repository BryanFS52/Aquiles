import { clientLAN } from '@lib/apollo-client';
import { GET_ALL_PROFILES, GET_PROFILE_BY_ID } from '@graphql/atlas/profilesGraph';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createInitialPaginatedState, RejectedPayload } from '@type/slices/common/generic';
import {
    Profile,
    GetAllProfilesQuery,
    GetAllProfilesQueryVariables,
    GetProfileByIdQuery,
    GetProfileByIdQueryVariables
} from '@graphql/generated'

const transformGraphQLToProfileItem = (graphqlData: any): Profile => {
    return {
        id: graphqlData.id,
        name: graphqlData.name,
        description: graphqlData.description,
        isActive: graphqlData.isActive,
        isUnique: graphqlData.isUnique,
        process: graphqlData.process
    }
};

export const fetchProfiles = createAsyncThunk<GetAllProfilesQuery['allProfiles'], GetAllProfilesQueryVariables>(
    'profile/fetchAll',
    async ({ page, size }) => {
        const { data } = await clientLAN.query<GetAllProfilesQuery, GetAllProfilesQueryVariables>({
            query: GET_ALL_PROFILES,
            variables: { page, size },
            fetchPolicy: 'no-cache',
        });
        return data.allProfiles;
    }
);

export const fetchProfileById = createAsyncThunk<GetProfileByIdQuery['ProfileById'], GetProfileByIdQueryVariables>(
    'profile/fetchById',
    async ({ id }) => {
        const { data } = await clientLAN.query<GetProfileByIdQuery, GetProfileByIdQueryVariables>({
            query: GET_PROFILE_BY_ID,
            variables: { id },
        });
        return data.ProfileById;
    }
);


const initialState = createInitialPaginatedState<Profile>();

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchProfiles
            .addCase(fetchProfiles.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProfiles.fulfilled, (state, action: PayloadAction<any>) => {
                if (action.payload?.data) {
                    state.data = action.payload.data
                        .filter((item: any): item is NonNullable<typeof item> => item !== null)
                        .map(transformGraphQLToProfileItem);
                    state.totalItems = action.payload.totalItems ?? 0;
                    state.totalPages = action.payload.totalPages ?? 0;
                    state.currentPage = action.payload.currentPage ?? 0;
                }
                state.loading = false;
            })
            .addCase(fetchProfiles.rejected, (state, action) => {
                state.error = action.error.message || 'Error fetching profiles';
                state.loading = false;
            })
            // fetchProfileById
            .addCase(fetchProfileById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProfileById.fulfilled, (state, action: PayloadAction<any>) => {
                if (action.payload?.data) {
                    state.data = [transformGraphQLToProfileItem(action.payload.data)];
                }
                state.loading = false;
            })
            .addCase(fetchProfileById.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
                state.loading = false;
            })
    }
})

export const { } = profileSlice.actions;
export default profileSlice.reducer;