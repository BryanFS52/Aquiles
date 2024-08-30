import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

export const createApprentice = async (data) => {
  try {
    await axios.post(`${API_URL}/persons/create`, data);
    return true;
  } catch (error) {
    console.error('Error creating apprentice:', error);
    return false;
  }
};

export const getAttendees = async () => {
  try {
    const response = await axios.get(`${API_URL}/attendees`);
    return response.data;
  } catch (error) {
    console.error('Error fetching attendees:', error);
    return [];
  }
};
