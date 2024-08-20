import React from 'react';

const ModalOlvidoContraseña = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      {/* Fondo opaco gris */}
      <div className="fixed inset-0 bg-cyan-900 opacity-35"></div>

      <div className="relative w-full max-w-md mx-auto my-12 bg-white rounded-lg shadow-lg">
        <div className="p-5">
          <div className='flex justify-center items-center'>
            <h1 className="text-2xl font-serif border-b-2 border-black font-semibold">Recuperar Contraseña</h1>
          </div>
          <p className="mt-6 text-sm text-gray-600 text-center">
          Ingresa tu correo electrónico para recuperara tu cuenta.          
          </p>
          <div className="flex-1 mt-8 md:mb-0 text-center">
                <input type="text" placeholder='Correo Electronico' className="rounded-md bg-white border-gray-300 shadow-md border-2 w-full md:w-96 px-3 py-3" />
          </div>

          <div className='flex  mt-10 mr-2 space-x-44 justify-center'>
            <button
              className='bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded'
              onClick={onClose}
            >
              Cancelar
            </button>

            <button className='bg-custom-blue hover:bg-custom-blue text-white font-medium py-2 px-4 rounded'>
              Recuperar
            </button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default ModalOlvidoContraseña;