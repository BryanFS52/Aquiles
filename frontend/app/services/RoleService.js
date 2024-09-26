import axios from 'axios';

// Función para obtener los roles desde Mockoon (o Olimpo en producción)
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Función para obtener los roles desde el backend
export const getRoles = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/roles`);

        // Verifica si la respuesta contiene los roles
        if (response.data && Array.isArray(response.data.roles)) {
            return response.data.roles; // Devuelve el array de roles
        } else {
            console.error('Formato de respuesta inesperado:', response.data);
            return []; // O maneja esto de otra forma
        }
    } catch (error) {
        console.error('Error al obtener roles:', error);
        // Opcional: Puedes lanzar el error si deseas manejarlo en otro lugar
        throw error; // Lanza el error si deseas manejarlo en AppSidebar
    }
};
