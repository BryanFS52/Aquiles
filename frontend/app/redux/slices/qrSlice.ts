import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createInitialPaginatedState } from '@type/slices/common/generic';
import { client } from '@lib/apollo-client';
import { GENERATE_QR_CODE } from '@graphql/generateQrGraph';

// Async thunks
export const generateQRCode = createAsyncThunk(
    'qr/generate',
    async () => {
        const { data } = await client.mutate({
            mutation: GENERATE_QR_CODE,
        });

        if (!data?.generateQRCode?.qrCodeBase64) {
            throw new Error("No QR code returned from server");
        }

        const qrCodeImage = `data:image/png;base64,${data.generateQRCode.qrCodeBase64}`;

        return {
            qrCodeImage,
            sessionId: data.generateQRCode.sessionId,
            qrUrl: data.generateQRCode.qrUrl,
        };
    }
);

interface QrState extends ReturnType<typeof createInitialPaginatedState> {
    qrResult: {
        qrCodeImage: string;
        sessionId: string;
        qrUrl: string;
    } | null;
}

const initialState: QrState = {
    ...createInitialPaginatedState(),
    qrResult: null,
};

const qrSlice = createSlice({
    name: 'qr',
    initialState,
    reducers: {
        clearQrResult: (state) => {
            state.qrResult = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(generateQRCode.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(generateQRCode.fulfilled, (state, action) => {
                state.qrResult = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(generateQRCode.rejected, (state, action) => {
                state.error = action.error.message ?? 'Error generating QR code';
                state.loading = false;
            });
    }
});

export const { } = qrSlice.actions;

export default qrSlice.reducer;