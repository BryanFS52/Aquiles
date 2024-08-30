"use client"

import React from 'react';

const ModalAsistencia = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      {/* Fondo opaco gris */}
      <div className="fixed inset-0 bg-cyan-900 opacity-50"></div>

      <div className="relative w-full max-w-3xl mx-auto my-6 bg-white rounded-lg shadow-lg">
        <div className="p-5">
          <div className='flex justify-center items-center'>
            <h1 className="text-2xl font-serif border-b-2 border-black">Información Asistencia</h1>
          </div>

          <div className='mt-5'>
            <div className="mb-4 md:flex md:space-x-4">
              <div className="flex-1 mb-4 md:mb-0">
                <label className="font-serif text-lg mb-1 block">Nombre del Instructor</label>
                <input id="instructor" type="text" placeholder='Nombre del Instructor' className="rounded-md bg-neutral-200 border-gray-300 shadow-md border-2 w-full px-3 py-2" />
              </div>

              <div className="flex-1">
                <label htmlFor="materia" className="font-serif text-lg mb-1 block">Materia</label>
                <input type='text' placeholder='Materia' className="rounded-md bg-neutral-200 border-gray-300 shadow-md border-2 w-full px-3 py-2" />
              </div>
            </div>

            <div className="mb-4 md:flex md:space-x-4">
              <div className="flex-1 mb-4 md:mb-0">
                <label htmlFor="fecha" className="font-serif text-lg mb-1 block">Fecha</label>
                <input type="text" placeholder='Fecha' className="rounded-md bg-neutral-200 border-gray-300 shadow-md border-2 w-full px-3 py-2" />
              </div>

              <div className="flex-1">
                <label htmlFor="aprendices" className="font-serif text-lg mb-1 block">Aprendices que asistieron</label>
                <input type='text' placeholder='Aprendices que asistieron' className="rounded-md bg-neutral-200 border-gray-300 shadow-md border-2 w-full px-3 py-2" />
              </div>
            </div>
          </div>

          <div className='flex justify-end mt-5'>
            <button
              className='hover:bg-gray-500 rounded-md transition-colors bg-custom-blue px-4 py-2 border text-white'
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAsistencia;