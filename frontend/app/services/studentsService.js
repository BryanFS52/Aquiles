// frontend/services/studentsService.js

import axios from 'axios';

const API_URL = 'http://localhost:8080/api/students'; // Asegúrate de que el puerto sea correcto

// Crear un nuevo aprendiz
export const createStudent = async (studentData) => {
  try {
    const response = await axios.post(API_URL, studentData);
    return response.data;
  } catch (error) {
    console.error('Error creando el estudiante:', error);
    throw error;
  }
};

// Obtener todos los estudiantes
export const getAllStudents = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo los estudiantes:', error);
    throw error;
  }
};

// Obtener estudiante por ID
export const getStudentById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo el estudiante:', error);
    throw error;
  }
};

// Actualizar estudiante
export const updateStudent = async (studentData) => {
  try {
    const response = await axios.put(API_URL, studentData);
    return response.data;
  } catch (error) {
    console.error('Error actualizando el estudiante:', error);
    throw error;
  }
};

// Eliminar estudiante
export const deleteStudent = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error eliminando el estudiante:', error);
    throw error;
  }
};
