import axios from 'axios';

// Función para obtener las fichas del instructor
export const getInstructorFichas = async () => {
  try {
    // Realiza la solicitud GET al endpoint que devuelve las fichas del instructor
    const response = await axios.get('/api/instructor/sheets'); // Asegúrate de que este endpoint exista y devuelva los datos correctos
    return response; // Devuelve la respuesta completa
  } catch (error) {
    // Maneja errores de la solicitud
    console.error('Error fetching fichas:', error);
    throw error; // Lanza el error para manejarlo en el componente
  }
};
