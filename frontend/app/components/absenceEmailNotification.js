import React from 'react';
import logoSena from "../../public/img/Logo-sena-green.png";
import Image from 'next/image';

const Notification = ({ studentName, date }) => {
  return (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-[#0e314d] p-4">
                            <Image src={logoSena} alt="Logo Sena" className="w-16 h-16 mx-auto" />
          </div>
             <div className="p-6">
            <h1 className="text-xl font-bold text-[#40b003]">
              Notificación de Inasistencia a Clase y Solicitud de Justificación
            </h1>
            <p className="mt-4">Hola, {studentName}:</p>
            <p className="mt-2">
              Nos hemos dado cuenta de que no asistió a la clase el día {date}.
            </p>
            <p className="mt-2">
              Entendemos que pueden haber razones 
              válidas para su inasistencia. 
              A continuación, le recordamos las tres 
              excusas aceptables para justificar su 
              ausencia:
            </p>
            <ul className="list-disc list-inside mt-4 mb-6">
              <li>
                <strong> <span className=" text-[#0e314d]">Certificado médico:</span></strong> Si estaba enfermo/a,
                por favor, adjunte un certificado médico
                que respalde su inasistencia.
              </li>
              <li>
                <strong><span className=" text-[#0e314d]">Previo aviso:</span></strong> Si informó sobre su
                ausencia antes de la clase, adjunte 
                cualquier documento o comunicación
                previa que lo respalde.
              </li>
              <li>
                <strong><span className=" text-[#0e314d]">Calamidad doméstica</span></strong> Si tuvo una 
                emergencia en casa, adjunte una nota 
                explicativa o cualquier documentación 
                relevante.
              </li>
            </ul>
            <p className="text-lg text-[#0e314d] mt-4 font-bold">
              Recordatorio:
            </p>
            <p className="mt-2 mb-6">
              Tenga en cuenta que las 
              justificaciones deben presentarse dentro 
              de un plazo de 3 días hábiles a partir de 
              la fecha de la inasistencia. Pasado este 
              plazo, la inasistencia será considerada 
              injustificada.
            </p>
            <p className="mt-4 mb-6">
              Para adjuntar el archivo correspondiente, 
              por favor ingrese al apartado de 
              justificaciones de la plataforma para 
              cargar su justificación.
            </p>

            <a href='/justificacionaprendiz' className='mt-6 bg-[#0e314d] text-white font-bold py-2 px-4 rounded'>
            Adjuntar evidencia
            </a>
          </div>
      </div>
   );
  };
  
export default Notification;
