import axios from 'axios';

const ProgramsService = {
  getProgramById: async (id) => {
    try {
      const response = await axios.get(`http://localhost:8084/api/programs/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching program:", error);
      throw error;
    }
  },

  getAllPrograms: async () => {
    try {
      const response = await axios.get('http://localhost:8084/api/programs/all');
      return response.data;
    } catch (error) {
      console.error("Error fetching programs:", error);
      throw error;
    }
  }
};

export default ProgramsService;
