import axios from 'axios';

const API_URL = 'http://localhost:8081/api/attendances';

// Configuración de axios para CORS
const axiosConfig = {
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept'
  }
};

// Crear aprendiz
export const createApprentice = async (data) => {
  try {
    await axios.post(`${API_URL}/create`, data, axiosConfig);
    return true;
  } catch (error) {
    console.error('Error creating apprentice:', error);
    return false;
  }
};

// Obtener todos los aprendices
export const getAllApprentices = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`, axiosConfig);
    const filteredData = response.data.data.map(person => ({
      name: person.name,
      lastName: person.lastName || 'N/A', 
      documentNumber: person.documentNumber,
      documentType: person.documentType || 'N/A',
      program: person.program || 'N/A',
      email: person.email || 'N/A',
      teamNumber: person.teamNumber || 'N/A',
      profilePicture: person.profilePicture || 'N/A'
    }));
    return filteredData;
  } catch (error) {
    console.error('Error al obtener los aprendices:', error);
    return [];
  }
};

// Obtener asistencia de un aprendiz
export const getApprenticeAttendance = async (documentNumber) => {
  try {
    const response = await axios.get(`${API_URL}/find/${documentNumber}`, axiosConfig);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener la asistencia del aprendiz:', error);
    return null;
  }
};

// Actualizar asistencia de un aprendiz
export const updateApprenticeAttendance = async (documentNumber, attendanceData) => {
  try {
    const response = await axios.put(`${API_URL}/update/${documentNumber}`, attendanceData, axiosConfig);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la asistencia del aprendiz:', error);
    return null;
  }
};
