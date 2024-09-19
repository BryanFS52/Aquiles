"use client";
import React, { useState, useEffect } from 'react';
import qrCodeService from '../../services/QRService'; 
import { BsQrCode } from "react-icons/bs";
import { useRouter } from 'next/navigation';

const ModalQR = ({ isOpen, onClose }) => {
  const [showNextModal, setShowNextModal] = useState(false);
  const [timer, setTimer] = useState(900); // Duración del QR en segundos
  const [qrCodeImage, setQrCodeImage] = useState(null); 
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false); 
  const router = useRouter(); 

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
          router.push('/aprendicelist'); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, router]);

  const handleNext = () => {
    setIsConfirmationModalOpen(true); 
  };

  const handleConfirmFinish = () => {
    setIsConfirmationModalOpen(false);
    router.push('/aprendicelist'); 
  };

  const handleCloseConfirmation = () => {
    setIsConfirmationModalOpen(false);
  };

  const handleClose = () => {
    onClose();
    setTimer(900);
  };

  if (!isOpen) return null;

  const formatTime = (seconds) => {
    if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    } else {
      return `00:${String(seconds).padStart(2, '0')}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="fixed inset-0 bg-cyan-900 opacity-35"></div>
      <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto my-8 bg-white rounded-lg shadow-lg">
        <div className="p-4 sm:p-6 md:p-8">
          <div className='flex justify-center items-center'>
            <h1 className="font-inter text-xl sm:text-2xl md:text-3xl border-b-2 border-black">
              Código QR Para la Toma de Asistencia
            </h1>
          </div><br/><br/>
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
            <button className='hover:bg-red-600 rounded-md transition-colors bg-red-600 px-4 py-2 border text-white text-lg font-inter' onClick={handleClose}>
              Cancelar QR
            </button>
            <button className='hover:bg-custom-blue rounded-md transition-colors bg-custom-blue px-4 py-2 border text-white text-lg font-inter' onClick={handleNext}>
              Finalizar Asistencia
            </button>
          </div>
        </div>
      </div>

      {isConfirmationModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-custom-blue bg-opacity-50">
          <div className="bg-white p-4 sm:p-6 w-4/5 sm:w-1/2 md:w-1/3 rounded-lg shadow-lg">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-center">¿Está seguro de finalizar la toma de asistencia?</h2>
            <div className="flex justify-center space-x-4">
              <button onClick={handleConfirmFinish} className="bg-green-600 text-white px-4 py-2 rounded-md">Sí</button>
              <button onClick={handleCloseConfirmation} className="bg-red-600 text-white px-4 py-2 rounded-md">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalQR;
