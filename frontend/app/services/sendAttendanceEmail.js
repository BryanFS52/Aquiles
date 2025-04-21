import axios from 'axios';

const API_URL = 'http://localhost:8081/api/email/send-notification-attendance';

export const sendEmailAbsence = async (email) => {
    try {
        const response = await axios.post('http://localhost:8081/api/send-notification', {
            email: email,
            // Aquí puedes incluir otros datos que necesites enviar
        });
        return response.data;
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        throw error;
    }
};
