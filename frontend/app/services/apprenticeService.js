import axios from 'axios';

const API_URL = 'http://localhost:8081/api/send-notification';

export const getAttendees = async () => {
  try {
    const response = await axios.get(`${API_URL}/attendees`);
    return response.data;
  } catch (error) {
    console.error('Error fetching attendees:', error);
    throw error;
  }
};
