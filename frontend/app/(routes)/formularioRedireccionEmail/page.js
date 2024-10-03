"use client";

import { useState } from 'react';
import logoSenaFormulario from "../../../public/img/Logo-sena-green.png";
import logo from "../../../public/img/aquiles.jpg";
import Image from 'next/image';

const formularioRedireccionEmail = () => {
  const [apprenticeName, setApprenticeName] = useState('');
  const [qrCode, setQrCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Nombre del aprendiz:', apprenticeName);
    console.log('Código QR:', qrCode);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg relative">
        <div className='bg-custom-blue rounded-t-lg w-full h-20 flex items-center relative'>
          <Image src={logoSenaFormulario} alt="logo del sena" className="w-12 h-12 mx-2 sm:mx-5" />
          <h2 className="text-xl sm:text-3xl font-inter font-semibold text-center text-green-500 mt-[-1px] sm:ml-4">qrformulario móvil</h2>
        </div>
        <div className="pb-4 border-b-2 border-green-500 w-full lg:w-4/5 mb-4 sm:mb-12 mx-auto"></div>

        <div className="p-4 sm:p-6">
          <div>
            <p className="text-gray-700 font-inter text-base font-semibold mb-2 sm:mb-4">Hola, [nombre del aprendiz]:</p>
            <span className="text-custom-blue text-left mb-4 whitespace-pre-line block">
              Parece que vas a confirmar tu asistencia nuevamente.{"\n"}Para hacerlo, hemos generado un código QR único que te permitirá verificar tu asistencia en nuestra plataforma.
            </span>
          </div>

          <div className='pt-3 sm:pt-5'>
            <span className="text-custom-blue font-semibold font-inter mb-4 block">Sigue estos pasos para completar el proceso:</span>
          </div>

          <ol className="list-decimal list-inside text-gray-700 mb-4 ml-4 sm:ml-0">
            <li className="text-custom-blue font-inter font-medium mb-4">
              <span className="text-green-600 font-inter font-semibold">Si estás en tu computadora:</span> usa la cámara de tu teléfono para escanear el código QR adjunto.
            </li>
            <div className="flex justify-center mb-4">
              <Image src={logo} alt="QR Code" className='w-24 h-24 sm:w-32 sm:h-32' />
            </div>
            <li className="text-custom-blue font-inter font-medium">
              <span className="text-green-600 font-inter font-semibold">Si has recibido un enlace:</span> haz clic en el enlace incluido para abrir el formulario en tu navegador y sigue las instrucciones para confirmar tu asistencia.
            </li>
          </ol>

          <div className="flex justify-center mt-4">
            <button type="submit" className="w-40 py-2 px-4 bg-custom-blue text-white font-semibold rounded-md transition duration-200">
              Enlace incluido
            </button>
          </div>

          <p className="text-custom-blue font-inter font-medium text-center mt-6 sm:mt-8 px-2 sm:px-4">
            Si no solicitaste este código o no estás confirmando tu asistencia, por favor responde a este mensaje o contáctanos directamente. Estaremos encantados de ayudarte a resolver cualquier problema.
          </p>
          <div className='pt-6'>
            <span className="text-custom-blue font-inter font-semibold text-center block mt-4">Atentamente, SENA Equipo de Asistencia</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default formularioRedireccionEmail;
