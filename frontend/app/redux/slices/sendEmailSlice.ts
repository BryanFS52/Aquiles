import { client } from '@lib/apollo-client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SEND_EMAIL_NOTIFICATION } from '@graphql/emailGraph';
import { RejectedPayload } from '@type/slices/common/generic';
import { MutationSendNotificationArgs } from '@graphql/generated';

interface SendEmailState {
    data: string | null;
    loading: boolean;
    error: { code?: string; message?: string } | null;
}

const initialState: SendEmailState = {
    data: null,
    loading: false,
    error: null,
};

export const sendEmailNotification = createAsyncThunk<
    string,
    MutationSendNotificationArgs,
    { rejectValue: { code: string; message: string } }
>(
    'email/sendNotification',
    async (variables, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate({
                mutation: SEND_EMAIL_NOTIFICATION,
                variables,
            });

            if (!data?.sendNotification) {
                return rejectWithValue({ code: 'NO_DATA', message: 'No response returned from email service' });
            }

            return data.sendNotification;
        } catch (error: any) {
            const message = error?.message || 'Error sending email notification';
            const code = error?.extensions?.code || 'UNKNOWN';
            return rejectWithValue({ code, message });
        }
    }
);

const sendEmailSlice = createSlice({
    name: 'sendEmail',
    initialState,
    reducers: {
        clearEmailState: (state) => {
            state.data = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendEmailNotification.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendEmailNotification.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(sendEmailNotification.rejected, (state, action) => {
                const { code, message } = (action.payload as RejectedPayload) || {};
                state.error = { code, message };
                state.loading = false;
            });
    },
});

export const { clearEmailState } = sendEmailSlice.actions;
export default sendEmailSlice.reducer;
