import axios from 'axios';

// Función para obtener la lista de entrenadores
export const getInstructorFichas = async () => {
  try {
    const response = await axios.get('/api/trainers/all');
    return response.data; // Devuelve solo los datos de la respuesta
  } catch (error) {
    console.error('Error fetching trainers:', error);
    throw error; // Lanza el error para manejarlo en el componente
  }
};
