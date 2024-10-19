import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api"; // Base URL del backend

export const downloadReportPDF = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/pdf/report`, {
            responseType: 'blob' 
        });
        return response.data; 
    } catch (error) {
        console.error('Error al descargar el reporte PDF:', error);
        throw error;
    }
};
