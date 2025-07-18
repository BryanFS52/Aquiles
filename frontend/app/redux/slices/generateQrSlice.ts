import { client } from '@lib/apollo-client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GENERATE_QR_CODE } from '@graphql/generateQrGraph';
import { RejectedPayload } from '@type/slices/common/generic';
import { QrCodePayload, GenerateQrCodeMutation, GenerateQrCodeMutationVariables } from '@graphql/generated';

interface GenerateQRState {
    data: QrCodePayload | null;
    loading: boolean;
    error: { code?: string; message?: string } | null;
}

const initialState: GenerateQRState = {
    data: null,
    loading: false,
    error: null,
};

export const transformGraphQLToGenerateQRItem = (graphqlData: any): QrCodePayload => {
    return {
        sessionId: graphqlData.sessionId,
        qrCodeBase64: graphqlData.qrCodeBase64,
        qrUrl: graphqlData.qrUrl,
    };
};

export const generateQrCode = createAsyncThunk<GenerateQrCodeMutation['generateQRCode'], GenerateQrCodeMutationVariables,
    { rejectValue: { code: string; message: string } }
>(
    'generateQr/generate',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate<GenerateQrCodeMutation, GenerateQrCodeMutationVariables>({
                mutation: GENERATE_QR_CODE,
            });

            if (!data?.generateQRCode) {
                return rejectWithValue({ code: 'NO_DATA', message: 'No QR code returned from API' });
            }

            return data.generateQRCode;
        } catch (error: any) {
            const message = error?.message || 'Error generating QR code';
            const code = error?.extensions?.code || 'UNKNOWN';
            return rejectWithValue({ code, message });
        }
    }
);

const generateQrSlice = createSlice({
    name: 'generateQr',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(generateQrCode.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(generateQrCode.fulfilled, (state, action) => {
                state.data = transformGraphQLToGenerateQRItem(action.payload);
                state.loading = false;
                state.error = null;
            })
            .addCase(generateQrCode.rejected, (state, action) => {
                const { code, message } = (action.payload as RejectedPayload) || {};
                state.error = { code, message };
                state.loading = false;
            });
    },
});

export default generateQrSlice.reducer;