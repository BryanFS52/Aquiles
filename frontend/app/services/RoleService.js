import axios from 'axios';

// Usa un valor por defecto si NEXT_PUBLIC_API_URL no está definido
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'; // Valor por defecto en desarrollo

// Función para obtener los roles desde el backend
export const getRoles = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/roles`);

        // Verifica si la respuesta contiene los roles
        if (response.data && Array.isArray(response.data.roles)) {
            return response.data.roles; // Devuelve el array de roles
        } else {
            console.error('Formato de respuesta inesperado:', response.data);
            return []; // Retorna un array vacío si el formato es incorrecto
        }
    } catch (error) {
        console.error('Error al obtener roles:', error);
        return []; // Retorna un array vacío en caso de error para evitar romper la aplicación
    }
};
