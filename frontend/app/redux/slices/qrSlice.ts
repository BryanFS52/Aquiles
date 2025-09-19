import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createInitialPaginatedState } from '@type/slices/common/generic';
import { client } from '@lib/apollo-client';
import { GENERATE_QR_CODE } from '@graphql/generateQrGraph';

// Service methods integrated into slice
const qrService = {
    generateQRCode: async () => {
        try {
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
        } catch (error) {
            console.error("Error generating QR code:", error);
            throw error;
        }
    },
};

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

export const { clearQrResult } = qrSlice.actions;

// Export service methods for compatibility
export { qrService };

export default qrSlice.reducer;
