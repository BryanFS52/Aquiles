import axios from 'axios';

export const createApprentice = async (apprentice) => {
  try {
    const response = await axios.post('http://localhost:8081/api/persons/create', apprentice, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
