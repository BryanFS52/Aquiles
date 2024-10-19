import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api";

export const sendEmailAbsence = async (email, studentName, date) => {
    console.log('Datos que se enviarán:', {
        email,
        studentName,
        date
    });

    try {
        const subject = "Notificación de Inasistencia";
        const htmlContent = `
            <div style="max-width: 800px; margin: auto; background-color: #ffffff; box-shadow: 0 4px 8px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;">
            <div style="background-color: #0e314d; padding: 16px;">
                <img src="cid:logoImage" alt="Logo Sena" style="width: 64px; height: 64px; display: block; margin: auto;" />
            </div>
            <div style="padding: 24px;">
                <h1 style="font-size: 1.5rem; color: #0e314d; font-family: 'Inter', sans-serif;">TDA</h1>
                <h5 style="color: #0e314d; font-size: 1rem; font-family: 'Inter', sans-serif;">
                Transformando el futuro con las nuevas habilidades del SENA.
                </h5>
                <h1 style="font-size: 1.25rem; font-weight: bold; color: #40b003;">
                Notificación de Inasistencia a Clase y Solicitud de Justificación
                </h1>
                <p style="margin-top: 16px; color: #0e314d; font-size: 1rem;">Hola, ${studentName}:</p>
                <p style="margin-top: 8px;">
                Nos hemos dado cuenta de que no asistió a la clase el día ${date}.
                </p>
                <p style="margin-top: 8px;">
                Entendemos que pueden haber razones válidas para su inasistencia. A continuación, le recordamos las tres excusas aceptables para justificar su ausencia:
                </p>
                <ul style="list-style-type: disc; margin-top: 16px; margin-bottom: 24px; padding-left: 20px;">
                <li>
                    <strong style="color: #0e314d;">Certificado médico:</strong> Si estaba enfermo/a, por favor, adjunte un certificado médico que respalde su inasistencia.
                </li>
                <li>
                    <strong style="color: #0e314d;">Previo aviso:</strong> Si informó sobre su ausencia antes de la clase, adjunte cualquier documento o comunicación previa que lo respalde.
                </li>
                <li>
                    <strong style="color: #0e314d;">Calamidad doméstica:</strong> Si tuvo una emergencia en casa, adjunte una nota explicativa o cualquier documentación relevante.
                </li>
                </ul>
                <p style="font-size: 1.125rem; color: #0e314d; margin-top: 16px; font-weight: bold;">
                Recordatorio:
                </p>
                <p style="margin-top: 8px; margin-bottom: 24px;">
                Tenga en cuenta que las justificaciones deben presentarse dentro de un plazo de 3 días hábiles a partir de la fecha de la inasistencia. Pasado este plazo, la inasistencia será considerada injustificada.
                </p>
                <p style="margin-top: 16px; margin-bottom: 24px;">
                Para adjuntar el archivo correspondiente, por favor ingrese al apartado de justificaciones de la plataforma para cargar su justificación.
                </p>
                <a href="/justificacionaprendiz" style="display: inline-block; margin-top: 24px; background-color: #0e314d; color: #ffffff; font-weight: bold; padding: 12px 24px; border-radius: 4px; text-decoration: none;">
                Adjuntar evidencia
                </a>
            </div>
            </div>
        `;

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
