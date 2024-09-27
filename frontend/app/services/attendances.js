import axios from 'axios';

const API_URL = 'http://localhost:8080/api/attendances'; 

export const updateAttendanceState = async (attendanceData) => {
    try {
        const { attendance_id, ...dataToUpdate } = attendanceData; // Extraer el ID de los datos de asistencia

        // Enviando un PUT a la API de actualización con el ID en la URL
        const response = await axios.put(`${API_URL}/update-state/${attendance_id}`, dataToUpdate);
        return response.data; 
    } catch (error) {
        console.error('Error al actualizar el estado de asistencia:', error.response ? error.response.data : error.message);
        throw error; 
    }
};
