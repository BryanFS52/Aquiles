import axios from 'axios';

const API_URL = 'http://localhost:8080/api/send-notification';

export const sendEmailAbsence = async (email) => {
    try {
        const response = await axios.post(API_URL, {
            email: email,
        });
        return response.data;
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        throw error;
    }
};
