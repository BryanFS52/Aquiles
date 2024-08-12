import React from 'react';

const AbsenceEmailNotification = ({ studentName, date }) => {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-md p-6">
        <div className="bg-teal-700 text-white p-4 rounded-t-lg text-center">
          <h1 className="text-2xl font-semibold">Notificación de Inasistencia</h1>
        </div>
        <div className="mt-6 text-gray-700 leading-relaxed">
          <p>Estimado/a {studentName},</p>
          <p className="mt-4">
            Este es un recordatorio para informarte que tu inasistencia a la clase del {date} ha sido registrada.
          </p>
          <p className="mt-4">
            Por favor, asegúrate de revisar las lecciones perdidas y ponerte al día con los materiales de la clase.
          </p>
          <p className="mt-4">
            Si tienes alguna justificación válida, que son:
          </p>
          <ul className="list-disc list-inside mt-2">
            <li>Certificado Médico</li>
            <li>Previo Aviso</li>
            <li>Calamidad Doméstica</li>
          </ul>
          <p className="mt-4">
            Por favor contacta a tu profesor a la brevedad con la documentación adecuada o ingresa al apartado de Justificación y adjunta los archivos.
          </p>
          <p className="mt-4">
            Gracias por tu atención.
          </p>
        </div>
        <div className="mt-6 text-center text-sm text-gray-500 border-t pt-4">
          <p>Este es un correo automático, por favor no respondas.</p>
        </div>
      </div>
    </div>
  );
};

export default AbsenceEmailNotification;
