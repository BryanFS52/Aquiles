import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

// Función para crear un nuevo aprendiz
export const createApprentice = async (data) => {
  try {
    await axios.post(`${API_URL}/persons/create`, data);
    return true;
  } catch (error) {
    console.error('Error creating apprentice:', error);
    return false;
  }
};

// Función para obtener todos los aprendices con datos completos
export const getAllApprentices = async () => {
  try {
    const response = await axios.get(`${API_URL}/persons/all`);
    const filteredData = response.data.map(person => ({
      name: person.name,
      lastName: person.lastName || 'N/A', 
      documentNumber: person.documentNumber,
      documentType: person.documentType || 'N/A',
      program: person.program || 'N/A',
      email: person.email || 'N/A',
      teamNumber: person.teamNumber || 'N/A',
      profilePicture: person.profilePicture || 'N/A' // Asegúrate de que este campo esté disponible
    }));
    return filteredData;
  } catch (error) {
    console.error('Error al obtener los aprendices:', error);
    return [];
  }
};
