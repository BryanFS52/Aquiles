// src/services/justificationService.js

import axios from 'axios';

const API_URL = 'http://localhost:8080/api//api/justification'; // Cambia la URL por la de tu backend

export const submitJustification = async (formData) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Si estás enviando archivos
      },
    });
    return response.data; // Aquí puedes manejar la respuesta del backend
  } catch (error) {
    throw error.response.data; // Manejo de errores
  }
};
