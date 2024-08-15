import React from 'react';
const generateEmailContent = (studentName, date) => {
    return `
      <div class="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="bg-[#0e314d] p-4">
          <img src="cid:logoImage" alt="Logo Sena" class="w-16 h-16 mx-auto" />
        </div>
        <div class="p-6">
        <h1 class="text-2xl text-custom-blue font-medium font-inter">
        TDA
        </h1>
        <h5 class="text-custom-blue text-base font-inter">
        Transformando el futuro con las nuevas habilidades del SENA.
        </h5>
          <h1 class="text-xl font-bold text-[#40b003]">
            Notificación de Inasistencia a Clase y Solicitud de Justificación
          </h1>
          <p class="mt-4">Hola, ${studentName}:</p>
          <p class="mt-2">
            Nos hemos dado cuenta de que no asistió a la clase el día ${date}.
          </p>
          <p class="mt-2">
            Entendemos que pueden haber razones válidas para su inasistencia. A continuación, le recordamos las tres excusas aceptables para justificar su ausencia:
          </p>
          <ul class="list-disc list-inside mt-4 mb-6">
            <li>
              <strong><span class="text-[#0e314d]">Certificado médico:</span></strong> Si estaba enfermo/a, por favor, adjunte un certificado médico que respalde su inasistencia.
            </li>
            <li>
              <strong><span class="text-[#0e314d]">Previo aviso:</span></strong> Si informó sobre su ausencia antes de la clase, adjunte cualquier documento o comunicación previa que lo respalde.
            </li>
            <li>
              <strong><span class="text-[#0e314d]">Calamidad doméstica</span></strong> Si tuvo una emergencia en casa, adjunte una nota explicativa o cualquier documentación relevante.
            </li>
          </ul>
          <p class="text-lg text-[#0e314d] mt-4 font-bold">
            Recordatorio:
          </p>
          <p class="mt-2 mb-6">
            Tenga en cuenta que las justificaciones deben presentarse dentro de un plazo de 3 días hábiles a partir de la fecha de la inasistencia. Pasado este plazo, la inasistencia será considerada injustificada.
          </p>
          <p class="mt-4 mb-6">
            Para adjuntar el archivo correspondiente, por favor ingrese al apartado de justificaciones de la plataforma para cargar su justificación.
          </p>
          <a href="/justificacionaprendiz" class="mt-6 bg-[#0e314d] text-white font-bold py-2 px-4 rounded">
            Adjuntar evidencia
          </a>
        </div>
      </div>
    `;
};


const sendEmail = async (email, subject, studentName, date) => {
  const htmlContent = generateEmailContent(studentName, date);

  const response = await fetch('/api/send-notification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      subject,
      htmlContent,
    }),
  });

  if (response.ok) {
    console.log('Correo enviado con éxito');
  } else {
    console.error('Error al enviar el correo');
  }
};

// Llamar a sendEmail con los datos correspondientes
sendEmail('keishlanayedcamargorojas@gmail.com', 'Notificación de Inasistencia a Clase', 'Nombre del Estudiante', 'Fecha de la Clase');
