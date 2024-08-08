import React from 'react';

const Notification = ({ studentName, date }) => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="w-11/12 max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
                <div className="bg-teal-700 text-white p-4 rounded-t-lg text-center">
                    <h1 className="text-2xl font-semibold">Notificación de Inasistencia</h1>
                </div>
                <div className="mt-4 leading-relaxed">
                    <p>Estimado/a {studentName},</p>
                    <p className="mt-2">Este es un recordatorio para informarte que tu inasistencia a la clase del {date} ha sido registrada.</p>
                    <p className="mt-2">Por favor, asegúrate de revisar las lecciones perdidas y ponerte al día con los materiales de la clase.</p>
                    <p className="mt-2">Si tienes alguna justificación válida, que son:</p>
                    <ul className="mt-2 ml-5 list-disc">
                        <li>Certificado Médico</li>
                        <li>Previo Aviso</li>
                        <li>Calamidad Doméstica</li>
                    </ul>
                    <p className="mt-2">Por favor contacta a tu profesor a la brevedad con la documentación adecuada o ingresa al apartado de Justificación y adjunta los archivos.</p>
                    <p className="mt-2">Gracias por tu atención.</p>
                </div>
                <div className="mt-4 text-sm text-gray-600 text-center border-t pt-4">
                    <p>Este es un correo automático, por favor no respondas.</p>
                </div>
            </div>
        </div>
    );
}

export default Notification;
