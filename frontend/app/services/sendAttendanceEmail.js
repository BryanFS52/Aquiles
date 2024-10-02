import axios from 'axios';

const API_URL = 'http://localhost:8080/api/email/send-notification-attendance';

export const sendAttendanceEmail = async (emailRequest) => {
    try {
        const response = await axios.post(API_URL, emailRequest, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // Devuelve la respuesta
    } catch (error) {
        console.error('Error al enviar el correo de asistencia:', error);
        throw error; // Lanza el error para manejarlo en el componente
    }
};
