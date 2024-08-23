// src/services/apprenticeService.js
import axios from 'axios';

export const createApprentice = async (apprenticeData) => {
    try {
        const response = await axios.post('http://localhost:8081/api/persons/create', apprenticeData);
        return response.data;
    } catch (error) {
        console.error('Error creating apprentice:', error);
        throw error;
    }
};
