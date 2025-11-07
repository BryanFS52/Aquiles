import { clientLAN } from '@lib/apollo-client';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GENERATE_QR_CODE } from '@graphql/generateQrGraph';
import { RejectedPayload } from '@type/slices/common/generic';
import { GenerateQrCodeMutation, GenerateQrCodeMutationVariables } from '@graphql/generated';

interface GenerateQRState {
    data: GenerateQrCodeMutation['generateQRCode'] | null;
    loading: boolean;
    error: { code?: string; message?: string } | null;
}


export const generateQrCode = createAsyncThunk<GenerateQrCodeMutation['generateQRCode'], GenerateQrCodeMutationVariables,
    { rejectValue: { code: string; message: string } }
>(
    'generateQr/generate',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await clientLAN.mutate<GenerateQrCodeMutation, GenerateQrCodeMutationVariables>({
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

const initialState: GenerateQRState = {
    data: null,
    loading: false,
    error: null,
};
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
            .addCase(generateQrCode.fulfilled, (state, action: PayloadAction<GenerateQrCodeMutation['generateQRCode']>) => {
                state.data = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(generateQrCode.rejected, (state, action) => {
                const payload = action.payload as RejectedPayload;
                const { code, message } = payload || {};
                state.error = { code, message };
                state.loading = false;
            });
    },
});

export default generateQrSlice.reducer;