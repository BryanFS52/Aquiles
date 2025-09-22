interface EmailTemplateParams {
  attendanceUrl: string;
  sessionId: string;
  expirationTime: string;
  defaultLogoInstitution: string;
  defaultLogoSena: string;
}

export const getAttendanceEmailTemplate = ({
  attendanceUrl,
  sessionId,
  expirationTime,
  defaultLogoInstitution,
  defaultLogoSena
}: EmailTemplateParams) => {
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="es" lang="es">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Registro de Asistencia - Sistema Académico SENA</title>
        <style type="text/css">
            /* Reset styles */
            body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
            table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
            img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
            
            /* Main styles */
            body {
                width: 100% !important;
                height: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
                font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, Arial, sans-serif;
                background-color: #dfdddd;
                color: #000000;
                line-height: 1.6;
            }
            
            .email-container {
                max-width: 650px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 0;
                overflow: hidden;
                border: 1px solid #E4E4E5;
            }
            
            /* Header styles */
            .header-section {
                background: linear-gradient(180deg, #00304D 0%, #005386 100%);
                color: #ffffff;
                text-align: center;
                padding: 40px 30px;
                border-bottom: 4px solid #398F0F;
            }
            
            .logos-container {
                margin-bottom: 30px;
                background-color: rgba(255, 255, 255, 0.1);
                padding: 20px;
                border-radius: 8px;
            }
            
            .logo-table {
                width: 100%;
                border-collapse: collapse;
            }
            
            .logo-cell {
                text-align: center;
                padding: 15px;
                width: 50%;
            }
            
            .logo-img {
                max-width: 100px;
                max-height: 80px;
                display: block;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 10px;
                border-radius: 6px;
                border: 2px solid #E4E4E5;
            }
            
            .header-title {
                font-family: 'Inter', sans-serif;
                font-size: 32px;
                font-weight: 800;
                margin: 20px 0 10px 0;
                letter-spacing: 1px;
                text-transform: uppercase;
            }
            
            .header-subtitle {
                font-family: 'Inter', sans-serif;
                font-size: 18px;
                font-weight: 500;
                margin: 0;
                opacity: 0.95;
                letter-spacing: 0.5px;
            }
            
            /* Content styles */
            .content-section {
                padding: 50px 40px;
                background-color: #ffffff;
            }
            
            .official-header {
                background-color: #00304D;
                color: #ffffff;
                padding: 15px 25px;
                margin: -50px -40px 40px -40px;
                text-align: center;
                font-weight: 700;
                font-size: 16px;
                letter-spacing: 0.5px;
                text-transform: uppercase;
            }
            
            .greeting {
                font-size: 20px;
                font-weight: 700;
                color: #00304D;
                margin-bottom: 25px;
                text-align: left;
                border-left: 4px solid #398F0F;
                padding-left: 15px;
            }
            
            .main-text {
                font-size: 16px;
                line-height: 1.8;
                color: #000000;
                margin-bottom: 30px;
                text-align: justify;
            }
            
            .main-text p {
                margin-bottom: 18px;
            }
            
            .highlight-text {
                color: #398F0F;
                font-weight: 700;
                text-transform: uppercase;
            }
            
            .bold-text {
                font-weight: 700;
                color: #00304D;
            }
            
            /* Button styles */
            .button-section {
                text-align: center;
                margin: 40px 0;
                padding: 35px 25px;
                background: linear-gradient(135deg, #00304D 0%, #005386 100%);
                border: 2px solid #398F0F;
                border-radius: 0;
            }
            
            .button-text {
                color: #ffffff;
                font-size: 18px;
                font-weight: 700;
                margin-bottom: 20px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .attendance-button {
                display: inline-block;
                background-color: #398F0F;
                color: #ffffff;
                padding: 18px 45px;
                text-decoration: none;
                border-radius: 0;
                font-weight: 800;
                font-size: 16px;
                border: 2px solid #398F0F;
                text-transform: uppercase;
                letter-spacing: 1px;
                transition: all 0.3s ease;
            }
            
            .attendance-button:hover {
                background-color: #007832;
                border-color: #007832;
                color: #ffffff;
            }
            
            /* Info section styles */
            .info-section {
                background-color: #ffffff;
                padding: 0;
                border: 2px solid #E4E4E5;
                margin: 35px 0;
            }
            
            .info-title {
                background-color: #00304D;
                color: #ffffff;
                font-size: 18px;
                font-weight: 700;
                margin: 0;
                padding: 15px 25px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .session-table {
                width: 100%;
                border-collapse: collapse;
                background-color: #ffffff;
            }
            
            .session-row {
                border-bottom: 1px solid #E4E4E5;
            }
            
            .session-row:last-child {
                border-bottom: none;
            }
            
            .session-label {
                padding: 18px 25px;
                font-weight: 700;
                color: #00304D;
                background-color: #ffffff;
                width: 45%;
                text-transform: uppercase;
                font-size: 14px;
                letter-spacing: 0.5px;
            }
            
            .session-value {
                padding: 18px 25px;
                color: #398F0F;
                font-weight: 600;
                background-color: #ffffff;
                font-size: 16px;
            }
            
            /* Important section styles */
            .important-section {
                background-color: #ffffff;
                padding: 0;
                border: 2px solid #005386;
                margin: 35px 0;
            }
            
            .important-title {
                background-color: #005386;
                color: #ffffff;
                font-size: 16px;
                font-weight: 700;
                margin: 0;
                padding: 15px 25px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .important-content {
                padding: 25px;
            }
            
            .important-list {
                margin: 0;
                padding-left: 0;
                color: #000000;
                list-style: none;
            }
            
            .important-list li {
                margin: 15px 0;
                line-height: 1.7;
                padding-left: 25px;
                position: relative;
                font-weight: 500;
            }
            
            .important-list li::before {
                content: "▪";
                color: #398F0F;
                font-weight: 900;
                font-size: 18px;
                position: absolute;
                left: 0;
                top: 0;
            }
            
            /* Instructions section styles */
            .instructions-section {
                background-color: #ffffff;
                padding: 0;
                border: 2px solid #398F0F;
                margin: 35px 0;
            }
            
            .instructions-title {
                background-color: #398F0F;
                color: #ffffff;
                font-size: 16px;
                font-weight: 700;
                margin: 0;
                padding: 15px 25px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .instructions-content {
                padding: 25px;
            }
            
            .instructions-list {
                margin: 0;
                padding-left: 0;
                color: #000000;
                list-style: none;
                counter-reset: step-counter;
            }
            
            .instructions-list li {
                margin: 15px 0;
                line-height: 1.7;
                padding-left: 35px;
                position: relative;
                font-weight: 500;
                counter-increment: step-counter;
            }
            
            .instructions-list li::before {
                content: counter(step-counter);
                background-color: #398F0F;
                color: #ffffff;
                width: 25px;
                height: 25px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                font-size: 12px;
                position: absolute;
                left: 0;
                top: 2px;
            }
            
            /* Signature styles */
            .signature-section {
                margin-top: 40px;
                padding: 30px;
                background-color: #ffffff;
                border: 2px solid #E4E4E5;
                border-left: 6px solid #00304D;
            }
            
            .signature-closing {
                font-size: 18px;
                font-weight: 600;
                color: #00304D;
                margin-bottom: 15px;
            }
            
            .signature-details {
                color: #5e5c5c;
                line-height: 1.6;
                font-weight: 500;
            }
            
            .signature-details strong {
                color: #00304D;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            /* Footer styles */
            .footer-section {
                background: linear-gradient(180deg, #00304D 0%, #005386 100%);
                color: #ffffff;
                text-align: center;
                padding: 35px 30px;
            }
            
            .footer-title {
                font-size: 20px;
                font-weight: 800;
                margin-bottom: 12px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .footer-subtitle {
                font-size: 16px;
                margin: 8px 0;
                opacity: 0.95;
                font-weight: 500;
            }
            
            .footer-disclaimer {
                font-size: 13px;
                margin-top: 20px;
                opacity: 0.85;
                line-height: 1.6;
                border-top: 1px solid rgba(255, 255, 255, 0.3);
                padding-top: 20px;
            }
            
            /* Responsive styles */
            @media only screen and (max-width: 600px) {
                .email-container {
                    width: 100% !important;
                    margin: 0 !important;
                    border-radius: 0 !important;
                }
                
                .content-section {
                    padding: 25px 20px !important;
                }
                
                .header-section {
                    padding: 25px 20px !important;
                }
                
                .header-title {
                    font-size: 24px !important;
                }
                
                .official-header {
                    margin: -25px -20px 25px -20px !important;
                    font-size: 14px !important;
                }
                
                .logo-cell {
                    width: 50% !important;
                    padding: 10px !important;
                }
                
                .logo-img {
                    max-width: 70px !important;
                    max-height: 60px !important;
                }
                
                .session-label,
                .session-value {
                    padding: 12px 15px !important;
                    font-size: 13px !important;
                }
                
                .attendance-button {
                    padding: 15px 30px !important;
                    font-size: 14px !important;
                }
                
                .button-section {
                    padding: 25px 15px !important;
                }
                
                .important-content,
                .instructions-content {
                    padding: 20px 15px !important;
                }
                
                .signature-section {
                    padding: 20px 15px !important;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <!-- Header Section -->
            <div class="header-section">
                <div class="logos-container">
                    <table class="logo-table" cellpadding="0" cellspacing="0">
                        <tr>
                            <td class="logo-cell">
                                <img src="cid:logo_institucion" alt="Logo Institución" class="logo-img" />
                            </td>
                            <td class="logo-cell">
                                <img src="cid:logo_sena" alt="Logo SENA" class="logo-img" />
                            </td>
                        </tr>
                    </table>
                </div>
                <h1 class="header-title">Registro de Asistencia</h1>
                <p class="header-subtitle">Sistema de Control Académico - SENA</p>
            </div>
            
            <!-- Content Section -->
            <div class="content-section">
                <div class="official-header">
                    Comunicado Oficial - Registro Obligatorio de Asistencia
                </div>
                
                <div class="greeting">
                    Estimado(a) Aprendiz:
                </div>
                
                <div class="main-text">
                    <p>Reciba un cordial saludo institucional.</p>
                    
                    <p>Por medio del presente comunicado oficial, le notificamos que se encuentra habilitado el <span class="highlight-text">Sistema de Registro de Asistencia</span> para su sesión de formación académica correspondiente, en cumplimiento de los protocolos establecidos por el Servicio Nacional de Aprendizaje - SENA.</p>
                    
                    <p>Es <span class="bold-text">obligatorio</span> que proceda a registrar su asistencia dentro del tiempo estipulado, accediendo al enlace oficial que se proporciona a continuación:</p>
                </div>
                
                <!-- Button Section -->
                <div class="button-section">
                    <div class="button-text">Acceso al Sistema Oficial</div>
                    <a href="${attendanceUrl}" class="attendance-button" target="_blank">
                        REGISTRAR ASISTENCIA
                    </a>
                </div>
                
                <!-- Session Info Section -->
                <div class="info-section">
                    <div class="info-title">Información de la Sesión Académica</div>
                    <table class="session-table" cellpadding="0" cellspacing="0">
                        <tr class="session-row">
                            <td class="session-label">Código de Sesión:</td>
                            <td class="session-value">${sessionId}</td>
                        </tr>
                        <tr class="session-row">
                            <td class="session-label">Vigencia del Enlace:</td>
                            <td class="session-value">${expirationTime}</td>
                        </tr>
                        <tr class="session-row">
                            <td class="session-label">Tiempo Límite:</td>
                            <td class="session-value">15 minutos</td>
                        </tr>
                        <tr class="session-row">
                            <td class="session-label">Estado:</td>
                            <td class="session-value">ACTIVO</td>
                        </tr>
                    </table>
                </div>
                
                <!-- Important Notice Section -->
                <div class="important-section">
                    <div class="important-title">
                        Disposiciones Reglamentarias
                    </div>
                    <div class="important-content">
                        <ul class="important-list">
                            <li>El enlace de registro posee una vigencia estricta de quince (15) minutos a partir de su generación oficial.</li>
                            <li>Cada aprendiz está autorizado a registrar su asistencia una única vez por sesión académica programada.</li>
                            <li>El registro debe efectuarse obligatoriamente durante el horario establecido para la actividad formativa correspondiente.</li>
                            <li>Cualquier inconveniente técnico debe ser reportado de inmediato al instructor responsable de la sesión.</li>
                            <li>La omisión en el registro será considerada como inasistencia conforme al reglamento académico vigente del SENA.</li>
                            <li>El sistema conservará un registro digital completo de todas las actividades realizadas para efectos de auditoria académica.</li>
                        </ul>
                    </div>
                </div>
                
                <!-- Instructions Section -->
                <div class="instructions-section">
                    <div class="instructions-title">
                        Procedimiento Oficial de Registro
                    </div>
                    <div class="instructions-content">
                        <ol class="instructions-list">
                            <li>Acceder al sistema mediante el botón "REGISTRAR ASISTENCIA" ubicado en la sección superior del presente comunicado.</li>
                            <li>El sistema lo redirigirá automáticamente al formulario oficial de registro de asistencia institucional.</li>
                            <li>Completar todos los campos obligatorios con información veraz, actualizada y conforme a su registro académico.</li>
                            <li>Verificar minuciosamente la exactitud de los datos ingresados antes de proceder con el envío del formulario.</li>
                            <li>Confirmar definitivamente el registro mediante el botón "Enviar" del formulario oficial del sistema.</li>
                            <li>Aguardar la confirmación automática del sistema y conservar el comprobante digital generado para sus registros.</li>
                        </ol>
                    </div>
                </div>
                
                <!-- Signature Section -->
                <div class="signature-section">
                    <div class="signature-closing">
                        Atentamente,
                    </div>
                    <div class="signature-details">
                        <strong>Coordinación Académica</strong><br>
                        Sistema Integrado de Gestión de Asistencia<br>
                        SENA - Servicio Nacional de Aprendizaje<br>
                        República de Colombia
                    </div>
                </div>
            </div>
            
            <!-- Footer Section -->
            <div class="footer-section">
                <div class="footer-title">
                    SENA - Servicio Nacional de Aprendizaje
                </div>
                <div class="footer-subtitle">Centro de Formación Tecnológica</div>
                <div class="footer-subtitle">Sistema Integrado de Gestión Académica</div>
                <div class="footer-disclaimer">
                    Este es un mensaje automático generado por el sistema institucional oficial.<br>
                    Por favor, no responda a este correo electrónico.<br>
                    Para consultas académicas, diríjase directamente a su instructor asignado o a la coordinación académica correspondiente.
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};

export const getAttendanceEmailSubject = () => {
  return "REGISTRO DE ASISTENCIA OBLIGATORIO - Comunicado Oficial SENA";
};