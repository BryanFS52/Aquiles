"use client";
import React, { useState, useEffect } from 'react';
import qrCodeService from '../../services/QRService'; // Importa el servicio
import { BsQrCode } from "react-icons/bs";
import { useRouter } from 'next/navigation'; // Importa useRouter de next/navigation

const ModalQR = ({ isOpen, onClose }) => {
  const [showNextModal, setShowNextModal] = useState(false);
  const [timer, setTimer] = useState(900); // Duración del QR en segundos
  const [qrCodeImage, setQrCodeImage] = useState(null); // Para almacenar la imagen del QR
  const router = useRouter(); // Hook para redireccionar

  useEffect(() => {
    if (!isOpen) return;

    // Generar el QR al abrir el modal
    const fetchQRCode = async () => {
      try {
        const qrCode = await qrCodeService.generateQRCode('Texto de ejemplo para el QR');
        setQrCodeImage(qrCode);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };

    fetchQRCode();

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push('/aprendicelist'); // Redirige cuando el tiempo se acaba
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, router]);

  const handleNext = () => {
    router.push('/aprendicelist'); // Redirige al hacer clic en "Finalizar"
  };

  const handleClose = () => {
    onClose();
    // También reinicia el temporizador aquí si deseas que se reinicie al cerrar el modal
    setTimer(900);
  }

  if (!isOpen) return null;

  const formatTime = (seconds) => {
    if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')} Min`;
    } else {
      return `00:${String(seconds).padStart(2, '0')} Seg`;
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="fixed inset-0 bg-cyan-900 opacity-35"></div>
      <div className="relative w-full max-w-xl mx-auto my-12 bg-white rounded-lg shadow-lg">
        <div className="p-5">
          <div className='flex justify-center items-center'>
            <h1 className="font-inter text-2xl border-b-2 border-black">Código QR Para la Toma de Asistencia</h1>
          </div><br/><br/>
          <div className='flex justify-start'>
            <div className='w-72 h-56'>
              {qrCodeImage ? (
                <img src={qrCodeImage} alt="QR Code" className='w-70 h-70 ml-0 ' />
              ) : (
                <BsQrCode className='w-60 h-60 ml-6' />
              )}
            </div>
          </div>
          <div className='flex ml-80 absolute inset-x-0 top-36'>
            <span className='text-2xl font-medium font-inter'>Duración del QR</span>
          </div>
          <div className="flex absolute inset-x-0 top-48 ml-80">
            <input className="rounded-md border-gray-300 border-2 pl-8 w-40 h-10" />
            <span className="absolute inset-y-0 left-9 flex items-center pr-3 text-black font-inter text-xl">
              {formatTime(timer)}
            </span>
          </div>
          <div className='flex justify-end mt-20'>
            <button
              className='hover:bg-red-600 rounded-md transition-colors bg-red-600 px-4 py-2 border text-white text-lg w-36 h-10 font-inter mr-60'
              onClick={handleClose}>
              Cancelar QR
            </button>
            <button
              className='hover:bg-custom-blue rounded-md transition-colors bg-custom-blue px-4 py-2 border text-white text-lg w-36 h-10 font-inter'
              onClick={handleNext}>
              Finalizar Asistencia
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalQR;
