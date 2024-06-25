import React, { useState } from 'react';

const ModalAddinformation = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="fixed inset-0 bg-cyan-900 opacity-35"></div>
      <div className="relative w-[90%] md:w-[35%] mx-auto my-12 bg-white rounded-lg shadow-lg">
        {/* Caja para agregar la información */}
        <div className="p-8 flex flex-col items-center"> {/* Agregamos flex y items-center para centrar verticalmente */}

          {/* Título */}
          <h2 className="text-xl font-bold mb-4">Creación del Team</h2>

          {/* Espacio para el contenido adicional aquí */}

          {/* Espacio flexible para los botones */}
          <div className="flex-grow"></div>

          {/* Botones */}
          <div className="flex justify-center mt-4"> {/* Centramos los botones y añadimos un margen top */}
            <button onClick={onClose} className='rounded-md px-8 py-4 border bg-custom-blue text-black hover:text-gray-500 hover:bg-gray-300 transition-colors mr-4'>
              Cancelar
            </button>
            <button onClick={onClose} className='hover:bg-gray-500 rounded-md transition-colors bg-custom-blue px-8 py-4 border text-white'>
              Crear
            </button>
          </div>
        </div>
      </div>    
    </div>
  );
};

export default ModalAddinformation;
