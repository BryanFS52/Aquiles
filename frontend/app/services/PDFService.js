import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api"; // Base URL del backend

// Método para descargar el reporte PDF
export const downloadReportPDF = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/pdf/report`, {
            responseType: 'blob' // Esto es importante para obtener el blob directamente
        });
        return response.data; // Devuelve el blob del PDF
    } catch (error) {
        console.error('Error al descargar el reporte PDF:', error);
        throw error;
    }
};
