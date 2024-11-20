import axios from 'axios';

// URL base de tu API
const API_URL = "http://localhost:8080/api"; // Ajusta la URL según la configuración de tu backend

// Función para obtener las listas de chequeo
export const listChecklists = () => {
  return axios
    .get(`${API_URL}/checklists`) // Ajusta la ruta del API según tu backend
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching checklists:", error);
      throw error; // Lanza el error para manejarlo en el componente
    });
};

// Función para crear una nueva lista de chequeo
export const createChecklist = (checklist) => {
  return axios
    .post(`${API_URL}/checklists`, checklist) // Ajusta la ruta del API según tu backend
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error creating checklist:", error);
      throw error; // Lanza el error para manejarlo en el componente
    });
};

// Función para eliminar una lista de chequeo
export const deleteChecklist = (checklistId) => {
  return axios
    .delete(`${API_URL}/checklists/${checklistId}`) // Ajusta la ruta del API según tu backend
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error deleting checklist:", error);
      throw error; // Lanza el error para manejarlo en el componente
    });
};
