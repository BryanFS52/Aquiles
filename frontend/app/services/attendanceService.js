// services/attendanceService.js
import axios from 'axios';

export const updateAttendance = async (attendanceData) => {
    try {
        const response = await axios.post('/api/attendance/update', attendanceData);
        return response.data;
    } catch (error) {
        throw new Error('Error al actualizar la asistencia');
    }
};
    