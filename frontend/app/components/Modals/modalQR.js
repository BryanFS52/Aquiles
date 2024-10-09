"use client";
import React, { useState, useEffect } from 'react';
import qrCodeService from '../../services/QRService'; 
import { BsQrCode } from "react-icons/bs";
import { useRouter } from 'next/navigation';
import axios from 'axios';

const ModalQR = ({ isOpen, onClose }) => {
  const [timer, setTimer] = useState(900); // Duración del QR en segundos
  const [qrCodeImage, setQrCodeImage] = useState(null); 
  const [showModal, setShowModal] = useState(false); // Estado para manejar la transición
  const router = useRouter(); 

  const apprenticeEmail = "jhorsreflex@gmail.com"; 

  useEffect(() => {
    if (!isOpen) return;

    const fetchQRCode = async () => {
      try {
        const qrCode = await qrCodeService.generateQRCode('Texto de ejemplo para el QR');
        setQrCodeImage(qrCode);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };

    fetchQRCode();
    setShowModal(true); // Mostrar el modal con transición al abrir

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push('/aprendicelist'); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isOpen, router]);

  const handleClose = () => {
    setShowModal(false); // Iniciar la transición de cierre
    setTimeout(() => {
      onClose();
      setTimer(900);
      setQrCodeImage(null); // Limpiar el QR al cerrar
    }, 300); // Tiempo de la transición antes de desmontar el modal
  };

  const sendAttendanceEmail = async () => {
    const emailData = {
      email: apprenticeEmail,
      subject: "Notificación de Asistencia",
      htmlContent: `
        <!-- Aquí iría el HTML del correo -->
      `,
    };

    try {
      const response = await axios.post('http://localhost:8080/api/email/send-notification-attendance', emailData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data.message); // Manejar la respuesta como sea necesario
      alert("Correo enviado con éxito!");
    } catch (error) {
      console.error("Error al enviar correo:", error);
      alert("Error al enviar el correo.");
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none transition-opacity duration-300 ease-in-out ${showModal ? 'opacity-100' : 'opacity-0'}`}>
      <div className="fixed inset-0 bg-cyan-900 opacity-35"></div>
      <div className={`relative w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto my-8 bg-white rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out ${showModal ? 'scale-100' : 'scale-90'}`}>
        <div className="p-4 sm:p-6 md:p-8">
          <div className='flex justify-center items-center'>
            <h1 className="text-center font-semibold font-inter text-xl sm:text-2xl md:text-3xl">
              Código QR Para la Toma de Asistencia
            </h1>
          </div>
          <br/><br/>
          <div className='flex justify-center'>
            <div className='w-56 h-56 sm:w-72 sm:h-72'>
              {qrCodeImage ? (
                <img src={qrCodeImage} alt="QR Code" className='w-full h-full object-cover' />
              ) : (
                <BsQrCode className='w-full h-full text-gray-500' />
              )}
            </div>
          </div>
          <div className='flex justify-center mt-6'>
            <span className='text-xl sm:text-2xl font-medium font-inter'>Duración del QR</span>
          </div>
          <div className="flex justify-center mt-4 relative">
            <input 
              className="rounded-md border-gray-300 border-2 text-center text-2xl w-36 sm:w-40 h-12"
              value={formatTime(timer)} 
              readOnly 
            />
          </div>
          <div className='flex justify-between mt-8'>
            <button 
              className='hover:bg-red-600 rounded-md transition-colors bg-red-600 px-4 py-2 border text-white text-lg font-inter' 
              onClick={handleClose}
            >
              Cancelar QR
            </button>
            <button 
              className='hover:bg-custom-blue rounded-md transition-colors bg-custom-blue px-3 py-2 border text-white text-base font-inter' 
              onClick={sendAttendanceEmail}
            >
              Enviar Correo Electrónico
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalQR;
