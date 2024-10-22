// services/attendanceService.js
import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

export const updateAttendance = async ({ documentNumber, attendanceData }) => {
    try {
        const response = await axios.post(`${API_URL}/attendance/update`, {
            documentNumber,
            attendanceData,
        });
        return response.data;
    } catch (error) {
        throw new Error('Error al actualizar la asistencia: ' + error.message);
    }
};
