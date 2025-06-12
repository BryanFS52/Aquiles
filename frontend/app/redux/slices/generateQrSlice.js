import { client } from '@/lib/apollo-client';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GENERATE_QR_CODE } from '@graphql/generateQrGraph'

export const generateQrCode = createAsyncThunk(
    'generateQr/generate',
    async (input, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate({
                mutation: GENERATE_QR_CODE,
                variables: { input }
            });
            const { generateQrCode } = data;
            if (generateQrCode.code !== "200") {
                return rejectWithValue({ code: generateQrCode.code, message: generateQrCode.message });
            }
            return { ...input, id: generateQrCode.id };
        } catch (error) {
            return rejectWithValue({ code: "500", message: error.message });
        }
    }
);

const generateQrSlice = createSlice({
    name: 'generateQr',
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // generateQrCode
            .addCase(generateQrCode.pending, (state) => {
                state.loading = true;
            })
            .addCase(generateQrCode.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            })
            .addCase(generateQrCode.rejected, (state, action) => {
                const { code, message } = action.payload || {};
                state.error = { code, message };
                state.loading = false;
            });
    }
});

export const { } = generateQrSlice.actions;

export default generateQrSlice.reducer;