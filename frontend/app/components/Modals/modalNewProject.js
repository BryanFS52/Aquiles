"use client"

import Link from 'next/link';
import React from 'react';

const ModalNewProject = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      {/* Fondo opaco gris */}
      <div className="fixed inset-0 bg-cyan-900 opacity-35"></div>

      {/* Contenedor del modal */}
      <div className="relative md:w-2/6 h-[40%] max-w-3xl mx-auto my-12 bg-white rounded-lg shadow-lg ">
        <div className="p-5 w-full h-full">
            <div className='flex justify-center items-center'>
              <h1 className="text-2xl font-serif border-b-2 border-black ">Nuevo Proyecto</h1>

            </div>
            <div className='flex flex-col justify-center items-center h-full w-full'>
              <div className='pb-12'>
                  <p className="text-sm font-serif text-black-700">Nombre del Proyecto</p>

                  <div className="rounded-lg border-solid border-2 text-custom-blue ">
                      <input type="text" name="document" placeholder='Nombre del Proyecto' className='text-base text-gray-950 p-4' />
                  </div>
              </div>
                <div className='flex text-xs space-x-4'>
                  <button href="/home" className='hover:bg-gray-500 rounded-md transition-colors bg-white px-8 py-4 border text-black ' 
                  onClick={onClose}>
                      Cancelar
                  </button>
                  <button href="/home" className='hover:bg-gray-500 rounded-md transition-colors bg-custom-blue px-8 py-4 border text-white '>
                      Registrar
                  </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ModalNewProject;
