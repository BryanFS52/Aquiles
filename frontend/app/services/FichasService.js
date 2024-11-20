// services/FichasService.js
import axios from 'axios';

export const getFichaFromOlimpo = async () => {
  try {
    const response = await axios.get('http://localhost:8084/api/sheets/1');
    return response.data;
  } catch (error) {
    console.error("Error fetching ficha from Olimpo:", error);
    throw error;
  }
};