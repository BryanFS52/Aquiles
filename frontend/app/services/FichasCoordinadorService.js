import axios from 'axios';

const API_URL = 'http://localhost:8081/api/sheets';

// Función para obtener todas las fichas
export const getAllSheets = async () => {
  try {
    const response = await axios.get(API_URL); // Asegúrate de que este es el endpoint correcto
    return response;
  } catch (error) {
    console.error("Error fetching sheets:", error);
    throw error;
  }
};

// Función para asignar un instructor a una ficha
export const assignInstructor = async (sheetId, instructorId) => {
  try {
    const response = await axios.post(`${API_URL}/assign-instructor`, {
      sheetId,
      instructorId,
    });
    return response;
  } catch (error) {
    console.error("Error assigning instructor:", error);
    throw error;
  }
};
