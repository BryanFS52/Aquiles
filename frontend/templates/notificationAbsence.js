import React from 'react';

// Función para generar el contenido del correo electrónico
const generateEmailContent = (studentName, date) => {
  if (!studentName || !date) {
    console.error('Error: studentName o date son indefinidos.');
  }
  return 
};

const sendEmail = async (email, subject, studentName, date) => {
  const htmlContent = generateEmailContent(studentName, date);

  console.log('Contenido HTML del correo:', htmlContent); 

  try {
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
  } catch (error) {
    console.error('Error en la solicitud de envío:', error);
  }
};

// Llamar a sendEmail con los datos correspondientes
sendEmail('jhorsreflex@gmail.com', 'Notificación de Inasistencia a Clase', 'Nombre del Estudiante', '2024-08-16');
