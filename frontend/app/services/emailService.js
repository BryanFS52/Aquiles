<<<<<<< HEAD
=======
"use client"
>>>>>>> keihslaDev
import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api"; // Base URL del backend

// Método para enviar notificación por correo
export const sendEmailAbsence = async (email, studentName, date) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/send-notification`, {
            params: { email, studentName, date }
        });
        return response.data;
    } catch (error) {
        console.error('Error al enviar correo', error);
        throw error;
    }
};
