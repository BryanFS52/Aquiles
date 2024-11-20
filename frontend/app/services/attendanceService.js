import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/attendances'; // Ajusta la URL de tu backend

const AttendanceService = {

  // Obtener todas las asistencias
  getAllAttendances: async (page = 0, size = 10) => {
    try {
      const response = await axios.get(`${BASE_URL}/all`, {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching attendances:', error);
      throw error;
    }
  },

  // Obtener una asistencia por ID
  getAttendanceById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/find/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching attendance with ID ${id}:`, error);
      throw error;
    }
  },

  // Crear una nueva asistencia
  createAttendance: async (attendanceData) => {
    try {
      const response = await axios.post(`${BASE_URL}/create`, attendanceData);
      return response.data;
    } catch (error) {
      console.error('Error creating attendance:', error);
      throw error;
    }
  },

  // Actualizar una asistencia existente
  updateAttendance: async (id, attendanceData) => {
    try {
      const response = await axios.put(`${BASE_URL}/update/${id}`, attendanceData);
      return response.data;
    } catch (error) {
      console.error(`Error updating attendance with ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar una asistencia
  deleteAttendance: async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting attendance with ID ${id}:`, error);
      throw error;
    }
  },
};

export default AttendanceService;
