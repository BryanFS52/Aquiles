"use client"
import React, { useState } from 'react';
import { BsQrCode } from "react-icons/bs";

const ModalTerminarQr = ({ isOpen, onClose }) => {   // se crea los eventos de cerrar y abri el modal

  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      {/* Fondo opaco gris */}
      <div className="fixed inset-0 bg-cyan-900 opacity-35"></div>

      <div className="relative w-full max-w-xl mx-auto my-12 bg-white rounded-lg shadow-lg">
        <div className="p-5">
          <div className='flex justify-center items-center'>
            <h1 className="text-2xl font-serif border-b-2 border-black">Codigo QR Para la Toma de Asistencia</h1>
          </div><br/><br/>

        <div className='flex justify-start'>
          <div className='w-72 h-56'>
          <BsQrCode className='w-60 h-60 ml-6' />
          </div>
          </div>
          <div className='flex ml-80 absolute inset-x-0 top-36'>
            <span className='text-2xl font-medium font-serif'>Duración del QR</span>
          </div>
                <div className=" flex absolute inset-x-0 top-48 ml-80">
                    <input className="rounded-md border-gray-300 border-2 pl-8 w-40 h-10" />
                    <span className="absolute inset-y-0 left-9 flex items-center pr-3 text-black font-serif text-xl">
                        15:00 MIN
                    </span>
                </div>
          <div className='flex justify-end mt-20'>
            <button
            className='hover:bg-red-600 rounded-md transition-colors bg-red-600 px-4 py-2 border text-white text-lg w-36 h-10 font-serif' //En la linea de abajo se hace el llamado al evento de cerrar el modal
            onClick={onClose}>  
              Terminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalTerminarQr;