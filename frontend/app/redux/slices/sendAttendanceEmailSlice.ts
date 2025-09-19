import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createInitialPaginatedState } from '@type/slices/common/generic';
import axios from 'axios';

// Service methods integrated into slice
interface EmailData {
    to: string;
    subject: string;
    text: string;
    html?: string;
}

const sendAttendanceEmailService = {
    sendEmail: async ({ to, subject, text, html }: EmailData) => {
        try {
            const response = await axios.post('/api/send-email', {
                to,
                subject,
                text,
                html,
            });

            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response.data;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    },

    sendAttendanceNotification: async (studentEmails: string[], attendanceData: any[]) => {
        try {
            const emailPromises = studentEmails.map(async (email, index) => {
                const attendance = attendanceData[index];
                
                if (!attendance) {
                    console.warn(`No attendance data for email: ${email}`);
                    return null;
                }

                const emailData: EmailData = {
                    to: email,
                    subject: 'Notificación de Asistencia',
                    text: `Estimado estudiante,\n\nSe ha registrado tu asistencia para la fecha ${attendance.date}.\n\nSaludos cordiales.`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #2c3e50;">Notificación de Asistencia</h2>
                            <p>Estimado estudiante,</p>
                            <p>Se ha registrado tu asistencia para la fecha <strong>${attendance.date}</strong>.</p>
                            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                <h3 style="margin-top: 0; color: #495057;">Detalles de la asistencia:</h3>
                                <ul style="list-style-type: none; padding: 0;">
                                    <li><strong>Fecha:</strong> ${attendance.date}</li>
                                    <li><strong>Estado:</strong> ${attendance.status}</li>
                                    <li><strong>Hora de registro:</strong> ${attendance.time}</li>
                                </ul>
                            </div>
                            <p>Saludos cordiales.</p>
                        </div>
                    `
                };

                return await sendAttendanceEmailService.sendEmail(emailData);
            });

            const results = await Promise.allSettled(emailPromises);
            
            const successful = results.filter(result => result.status === 'fulfilled').length;
            const failed = results.filter(result => result.status === 'rejected').length;

            return {
                successful,
                failed,
                total: studentEmails.length,
                results
            };
        } catch (error) {
            console.error('Error sending attendance notifications:', error);
            throw error;
        }
    },
};

// Async thunks
export const sendEmail = createAsyncThunk<any, EmailData>(
    'sendAttendanceEmail/send',
    async (emailData) => {
        const response = await axios.post('/api/send-email', emailData);
        
        if (response.status !== 200) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.data;
    }
);

export const sendAttendanceNotification = createAsyncThunk<
    { successful: number; failed: number; total: number; results: any[] },
    { studentEmails: string[]; attendanceData: any[] }
>(
    'sendAttendanceEmail/sendNotification',
    async ({ studentEmails, attendanceData }) => {
        const emailPromises = studentEmails.map(async (email, index) => {
            const attendance = attendanceData[index];
            
            if (!attendance) {
                console.warn(`No attendance data for email: ${email}`);
                return null;
            }

            const emailData: EmailData = {
                to: email,
                subject: 'Notificación de Asistencia',
                text: `Estimado estudiante,\n\nSe ha registrado tu asistencia para la fecha ${attendance.date}.\n\nSaludos cordiales.`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2c3e50;">Notificación de Asistencia</h2>
                        <p>Estimado estudiante,</p>
                        <p>Se ha registrado tu asistencia para la fecha <strong>${attendance.date}</strong>.</p>
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #495057;">Detalles de la asistencia:</h3>
                            <ul style="list-style-type: none; padding: 0;">
                                <li><strong>Fecha:</strong> ${attendance.date}</li>
                                <li><strong>Estado:</strong> ${attendance.status}</li>
                                <li><strong>Hora de registro:</strong> ${attendance.time}</li>
                            </ul>
                        </div>
                        <p>Saludos cordiales.</p>
                    </div>
                `
            };

            const response = await axios.post('/api/send-email', emailData);
            
            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response.data;
        });

        const results = await Promise.allSettled(emailPromises);
        
        const successful = results.filter(result => result.status === 'fulfilled').length;
        const failed = results.filter(result => result.status === 'rejected').length;

        return {
            successful,
            failed,
            total: studentEmails.length,
            results
        };
    }
);

interface SendAttendanceEmailState extends ReturnType<typeof createInitialPaginatedState> {
    emailResults: any | null;
    notificationResults: {
        successful: number;
        failed: number;
        total: number;
        results: any[];
    } | null;
}

const initialState: SendAttendanceEmailState = {
    ...createInitialPaginatedState(),
    emailResults: null,
    notificationResults: null,
};

const sendAttendanceEmailSlice = createSlice({
    name: 'sendAttendanceEmail',
    initialState,
    reducers: {
        clearEmailResults: (state) => {
            state.emailResults = null;
            state.notificationResults = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Send single email
            .addCase(sendEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendEmail.fulfilled, (state, action) => {
                state.emailResults = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(sendEmail.rejected, (state, action) => {
                state.error = action.error.message ?? 'Error sending email';
                state.loading = false;
            })
            // Send attendance notifications
            .addCase(sendAttendanceNotification.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendAttendanceNotification.fulfilled, (state, action) => {
                state.notificationResults = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(sendAttendanceNotification.rejected, (state, action) => {
                state.error = action.error.message ?? 'Error sending attendance notifications';
                state.loading = false;
            });
    }
});

export const { clearEmailResults } = sendAttendanceEmailSlice.actions;

// Export service methods for compatibility
export { sendAttendanceEmailService };

export default sendAttendanceEmailSlice.reducer;
