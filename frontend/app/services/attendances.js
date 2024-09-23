import axios from 'axios';

const API_URL = 'http://localhost:8080/api/attendances'; 

export const createAttendance = async (attendanceData) => {
    try {
        const response = await axios.post(`${API_URL}/create`, attendanceData);
        return response.data; 
    } catch (error) {
        console.error('Error al crear asistencia:', error);
        throw error; 
    }
};
