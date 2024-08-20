import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api";

export const sendEmailAbsence = async (email, studentName, date) => {
    // Agregar console.log para verificar los datos antes de enviarlos
    console.log('Datos que se enviarán:', {
        email,
        studentName,
        date
    });

    try {
        // Construcción del asunto y contenido del correo
        const subject = "Notificación de Inasistencia";
        const htmlContent = `
            <div>
                <p>Hola, ${studentName}:</p>
                <p>Nos hemos dado cuenta de que no asistió a la clase el día ${date}.</p>
                <p>Entendemos que pueden haber razones válidas para su inasistencia...</p>
            </div>
        `;

        // Agregar console.log para verificar el contenido del correo
        console.log('Contenido del correo:', {
            subject,
            htmlContent
        });

        // Enviar solicitud POST al backend
        const response = await axios.post(`${API_BASE_URL}/send-notification`, {
            email,
            subject,
            htmlContent
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Log de la respuesta del servidor
        console.log('Respuesta del servidor:', response.data);
        return response.data;
    } catch (error) {
        // Log de errores si la solicitud falla
        console.error('Error al enviar correo:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        throw error;
    }
};