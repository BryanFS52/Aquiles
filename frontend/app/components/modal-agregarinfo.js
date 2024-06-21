"use client"

import Link from 'next/link';
import React from 'react';

const Modal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
        {/* Fondo opaco gris */}
        <div className="fixed inset-0 bg-cyan-900 opacity-35"></div>
  
        {/* Contenedor del modal */}
        <div className="relative w-[90%] md:w-[40%] mx-auto my-12 bg-white rounded-lg shadow-lg ">
          <div className="p-5 h-full">
                <div className='flex text-xs md:space-x-6  justify-center flex-col md:flex-row '>
                    <button href="/home" className=' rounded-lg transition-colors bg-white md:px-4 py-1 my-1 border text-black border-black text-sm' 
                    >
                        Descripcion
                    </button>
                    <button href="/home" className=' rounded-lg transition-colors bg-white md:px-4 py-1 my-1 border text-black border-black text-sm'
                    >
                        Problematica
                    </button>
                    <button href="/home" className='rounded-lg transition-colors bg-white md:px-4 py-1 my-1 border text-black border-black text-sm' 
                    >
                        Objetivos
                    </button>
                    <button href="/home" className='rounded-lg transition-colors bg-white md:px-4 py-1 my-1 border text-black border-black text-sm' 
                    >
                        Justificacion
                    </button>
                </div>
            
                <div className='flex justify-center items-center'>
                    <h1 className="text-2xl font-serif border-b-2 border-black md:mt-10 ">Información del Team</h1>
                </div>
                
              <div className='flex flex-col items-center h-full w-full'>
                    <div className=' flex flex-col my-6 items-center '>
                        <span className="text-base font-serif text-black-700 ">Nombre del Team</span>
                        <input type="text" name="document" placeholder='Nombre del Team' className='rounded-lg border-solid border-2 text-custom-blue mt-1 w-auto shadow-lg shadow-gray-500/50 px-1'/>
                    </div>                
                <div>
                    <span >Integrantes</span>
                    <div className="flex flex-col">
                    <div className="overflow-x-auto">
                        <div className="py-2 align-middle inline-block min-w-full">
                        <div className="overflow-hidden border border-gray-300 sm:rounded-lg">
                            <table className="min-w-full divide-y  divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Num Doc
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nombre Completo
                                </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {/* Aquí puedes mapear los datos de tu tabla */}
                                <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">12345678</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">Juan Pérez</div>
                                </td>
                                </tr>
                                {/* Puedes añadir más filas según necesites */}
                            </tbody>
                            </table>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>

                  <div className='flex justify-between w-full text-xs space-x-4 text-white mt-12 px-32'>
                    <button href="/home" className='hover:bg-gray-500 rounded-md transition-colors bg-custom-blue px-8 py-4 border' 
                    >
                        Editar Informacion
                    </button>
                    <button href="/home" className='hover:bg-gray-500 rounded-md transition-colors bg-custom-blue px-8 py-4 border'
                    onClick={onClose}>
                        Cerrar
                    </button>
                  </div>
              </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Modal;
